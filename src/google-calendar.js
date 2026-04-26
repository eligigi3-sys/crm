// ============================================================
// google-calendar.js - חיבור ל-Google Calendar
// ============================================================

const REDIRECT_URI = 'https://crm.comics-events.co.il/auth/google/callback';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

// שלב 1: הפניה ל-Google לאישור
export function getAuthUrl(env) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// שלב 2: קבלת token אחרי אישור
export async function exchangeCode(code, env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data;
}

// רענון token פג תוקף
export async function refreshToken(refreshTok, env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshTok,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}

// קבלת access token תקף
async function getAccessToken(env) {
  const stored = await env.DB.prepare(
    "SELECT value FROM app_settings WHERE key = 'google_tokens'"
  ).first();
  if (!stored) throw new Error('לא מחובר ל-Google Calendar — יש לחבר תחילה');
  
  const tokens = JSON.parse(stored.value);
  
  // בדוק אם ה-token פג תוקף
  if (tokens.expires_at && Date.now() > tokens.expires_at - 60000) {
    if (!tokens.refresh_token) throw new Error('נדרש חיבור מחדש ל-Google');
    const newToken = await refreshToken(tokens.refresh_token, env);
    tokens.access_token = newToken;
    tokens.expires_at = Date.now() + 3500 * 1000;
    await env.DB.prepare(
      "UPDATE app_settings SET value = ? WHERE key = 'google_tokens'"
    ).bind(JSON.stringify(tokens)).run();
  }
  
  return tokens.access_token;
}

// יצירת/עדכון אירוע ביומן Google
export async function syncEventToCalendar(lead, env) {
  if (!lead.event_date) return { skipped: true, reason: 'אין תאריך' };
  
  const accessToken = await getAccessToken(env);
  
  // בנה תיאור האירוע
  let attrs = [];
  try { attrs = JSON.parse(lead.attractions || '[]'); } catch(e) {}
  
  const description = [
    `סוג אירוע: ${lead.event_type || '—'}`,
    `אולם: ${lead.venue || '—'}`,
    `טלפון: ${lead.phone || '—'}`,
    `אטרקציות: ${attrs.join(', ') || '—'}`,
    `מחיר: ₪${lead.price || 0}`,
    `סטטוס תשלום: ${lead.balance_paid ? 'שולם במלואו' : lead.deposit ? `מקדמה ₪${lead.deposit}` : 'טרם שולם'}`,
    lead.details ? `פרטים: ${lead.details}` : '',
    lead.notes ? `הערות: ${lead.notes}` : '',
  ].filter(Boolean).join('\n');

  // בנה זמן האירוע
  const startTime = lead.event_time || '10:00';
  const [startH, startM] = startTime.split(':');
  const endH = String(parseInt(startH) + 4).padStart(2, '0');
  
  const startDateTime = `${lead.event_date}T${startTime}:00`;
  const endDateTime = `${lead.event_date}T${endH}:${startM}:00`;

  const eventBody = {
    summary: `🎈 ${lead.name} - ${lead.event_type || 'אירוע'}`,
    description,
    location: lead.venue || '',
    start: { dateTime: startDateTime, timeZone: 'Asia/Jerusalem' },
    end: { dateTime: endDateTime, timeZone: 'Asia/Jerusalem' },
    colorId: '9', // כחול
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // יום לפני
        { method: 'popup', minutes: 2 * 60 },  // שעתיים לפני
      ],
    },
  };

  // בדוק אם כבר יש Google Event ID ל-lead הזה
  const existingId = lead.google_event_id;
  
  let res;
  if (existingId) {
    // עדכן אירוע קיים
    res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );
  } else {
    // צור אירוע חדש
    res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  
  // שמור את Google Event ID ב-lead
  await env.DB.prepare(
    'UPDATE leads SET google_event_id = ? WHERE id = ?'
  ).bind(data.id, lead.id).run();

  return { success: true, eventId: data.id, eventUrl: data.htmlLink };
}

// מחיקת אירוע מהיומן
export async function deleteEventFromCalendar(googleEventId, env) {
  if (!googleEventId) return { skipped: true };
  const accessToken = await getAccessToken(env);
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return { success: true };
}

// Handler לכל ה-routes של Google
export async function handleGoogle(request, env, path) {
  // GET /api/google/auth-url - קבל קישור לחיבור
  if (path === '/api/google/auth-url') {
    const url = getAuthUrl(env);
    return { url };
  }

  // GET /api/google/status - בדוק אם מחובר
  if (path === '/api/google/status') {
    const stored = await env.DB.prepare(
      "SELECT value FROM app_settings WHERE key = 'google_tokens'"
    ).first();
    return { connected: !!stored };
  }

  // POST /api/google/sync/:id - סנכרן ליד ספציפי
  const syncMatch = path.match(/^\/api\/google\/sync\/(\d+)$/);
  if (syncMatch && request.method === 'POST') {
    const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(syncMatch[1]).first();
    if (!lead) throw new Error('ליד לא נמצא');
    const result = await syncEventToCalendar(lead, env);
    return result;
  }

  // POST /api/google/disconnect - התנתק
  if (path === '/api/google/disconnect' && request.method === 'POST') {
    await env.DB.prepare("DELETE FROM app_settings WHERE key = 'google_tokens'").run();
    return { success: true };
  }

  throw new Error('Google route not found');
}

// Callback מ-Google אחרי אישור
export async function handleGoogleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(
      `<html><body dir="rtl" style="font-family:sans-serif;text-align:center;padding:50px">
        <h2>❌ שגיאה בחיבור</h2><p>${error}</p>
        <a href="/">חזור למערכת</a></body></html>`,
      { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
    );
  }

  const tokens = await exchangeCode(code, env);
  tokens.expires_at = Date.now() + (tokens.expires_in || 3500) * 1000;

  // שמור tokens במסד הנתונים
  const existing = await env.DB.prepare(
    "SELECT key FROM app_settings WHERE key = 'google_tokens'"
  ).first();
  
  if (existing) {
    await env.DB.prepare(
      "UPDATE app_settings SET value = ? WHERE key = 'google_tokens'"
    ).bind(JSON.stringify(tokens)).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO app_settings (key, value) VALUES ('google_tokens', ?)"
    ).bind(JSON.stringify(tokens)).run();
  }

  return new Response(
    `<html><body dir="rtl" style="font-family:sans-serif;text-align:center;padding:50px;background:#f0fdf4">
      <div style="font-size:60px">✅</div>
      <h2 style="color:#16a34a">חובר בהצלחה ל-Google Calendar!</h2>
      <p>המערכת מוכנה לסנכרן אירועים ליומן שלך.</p>
      <a href="/" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">חזור למערכת</a>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
