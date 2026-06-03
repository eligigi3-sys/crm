// ============================================================
// google-calendar.js - חיבור ל-Google Calendar
// ============================================================

import { requireAuthUser, requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

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
  if (data.error) {
    const message = data.error === 'invalid_grant'
      ? 'החיבור ל-Google פג או בוטל — יש להתחבר מחדש ליומן'
      : (data.error_description || data.error);
    const err = new Error(message);
    err.googleError = data.error;
    throw err;
  }
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

function shouldCreateReplacementEvent(status) {
  return status === 404 || status === 410;
}

async function persistGoogleEventId(lead, eventId, env) {
  if (lead && lead.tenant_id) {
    await env.DB.prepare(
      'UPDATE leads SET google_event_id = ? WHERE id = ? AND tenant_id = ?'
    ).bind(eventId, lead.id, lead.tenant_id).run();
    return;
  }

  await env.DB.prepare(
    'UPDATE leads SET google_event_id = ? WHERE id = ?'
  ).bind(eventId, lead.id).run();
}

async function clearGoogleEventId(lead, env) {
  await persistGoogleEventId(lead, null, env);
}

// יצירת/עדכון אירוע ביומן Google
export async function syncEventToCalendar(lead, env) {
  if (!lead.event_date) return { skipped: true, reason: 'אין תאריך' };
  
  const accessToken = await getAccessToken(env);
  
  // בנה תיאור האירוע
  let attrs = [];
  try { attrs = JSON.parse(lead.attractions || '[]'); } catch(e) {}
  const venue = (lead.venue || '').trim();
  const wazeUrl = venue ? `https://waze.com/ul?q=${encodeURIComponent(venue)}&navigate=yes` : '';
  
  const description = [
    `סוג אירוע: ${lead.event_type || '—'}`,
    `אולם: ${lead.venue || '—'}`,
    venue ? `כתובת / אולם:\n${venue}` : '',
    wazeUrl ? `ניווט ב-Waze:\n${wazeUrl}` : '',
    `טלפון: ${lead.phone || '—'}`,
    `אטרקציות: ${attrs.join(', ') || '—'}`,
    `מחיר: ₪${lead.price || 0}`,
    `סטטוס תשלום: ${lead.balance_paid ? 'שולם במלואו' : lead.deposit ? `מקדמה ₪${lead.deposit}` : 'טרם שולם'}`,
    lead.details ? `פרטים: ${lead.details}` : '',
    lead.notes ? `הערות: ${lead.notes}` : '',
  ].filter(Boolean).join('\n\n');

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
  
  const createEvent = function() {
    return fetch(
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
  };

  let res;
  let replacedMissingEvent = false;
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

    if (shouldCreateReplacementEvent(res.status)) {
      replacedMissingEvent = true;
      res = await createEvent();
    }
  } else {
    // צור אירוע חדש
    res = await createEvent();
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Google Calendar sync failed');
  
  // שמור את Google Event ID ב-lead
  await persistGoogleEventId(lead, data.id, env);

  return { success: true, eventId: data.id, eventUrl: data.htmlLink, replacedMissingEvent };
}

// מחיקת אירוע מהיומן
export async function deleteEventFromCalendar(googleEventId, env) {
  if (!googleEventId) return { skipped: true };
  const accessToken = await getAccessToken(env);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleEventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok && !shouldCreateReplacementEvent(res.status)) {
    let data = {};
    try { data = await res.json(); } catch (e) {}
    throw new Error(data && data.error && data.error.message ? data.error.message : 'Google Calendar delete failed');
  }
  return { success: true };
}

// Handler לכל ה-routes של Google
export async function handleGoogle(request, env, path) {
  // GET /api/google/status - בדיקת סטטוס חיבור בלבד.
  // חשוב: לא דורש tenant context כדי שלא יישבר בכניסה ל-CRM העסקי או במעבר בין shell-ים.
  if (path === '/api/google/status') {
    const user = await requireAuthUser(request, env);
    if (user instanceof Response) return user;

    const stored = await env.DB.prepare(
      "SELECT value FROM app_settings WHERE key = 'google_tokens'"
    ).first();

    if (!stored) return { connected: false, needs_reconnect: false };

    try {
      await getAccessToken(env);
      return { connected: true, needs_reconnect: false };
    } catch (e) {
      return { connected: false, needs_reconnect: true, error: e.message };
    }
  }

  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'leads');
  if (moduleState instanceof Response) return moduleState;

  const tenantId = tenantCtx.tenant.id;

  // GET /api/google/auth-url - קבל קישור לחיבור
  if (path === '/api/google/auth-url') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    const url = getAuthUrl(env);
    return { url };
  }

  // POST /api/google/sync/:id - סנכרן ליד ספציפי
  const syncMatch = path.match(/^\/api\/google\/sync\/(\d+)$/);
  if (syncMatch && request.method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ? AND tenant_id = ?').bind(syncMatch[1], tenantId).first();
    if (!lead) throw new Error('ליד לא נמצא');
    if (lead.status === 'cancelled') {
      if (lead.google_event_id) {
        await deleteEventFromCalendar(lead.google_event_id, env);
        await clearGoogleEventId(lead, env);
      }
      return { success: true, deleted: true };
    }
    const result = await syncEventToCalendar(lead, env);
    return result;
  }

  // POST /api/google/sync-backlog - סנכרון אירועים קיימים שעדיין לא סונכרנו
  if (path === '/api/google/sync-backlog' && request.method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const leads = await env.DB.prepare(
      `SELECT *
       FROM leads
       WHERE tenant_id = ?
         AND status != 'cancelled'
         AND event_date IS NOT NULL
         AND TRIM(event_date) != ''
         AND (google_event_id IS NULL OR TRIM(google_event_id) = '')
       ORDER BY event_date ASC, id ASC
       LIMIT 50`
    ).bind(tenantId).all();

    const items = leads.results || [];
    let synced = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    for (const lead of items) {
      try {
        const result = await syncEventToCalendar(lead, env);
        if (result && result.skipped) skipped++;
        else synced++;
      } catch (e) {
        failed++;
        errors.push({ id: lead.id, name: lead.name || '', error: e.message });
        console.log('Google backlog sync failed for lead', lead.id, e.message);
      }
    }

    return { success: true, total: items.length, synced, skipped, failed, errors };
  }

  // POST /api/google/resync-future - סנכרון/עדכון אירועים מהיום והלאה בלי לאפס IDs קיימים
  if (path === '/api/google/resync-future' && request.method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    const today = parts.filter(p => p.type !== 'literal').map(p => p.value).join('-');

    const leads = await env.DB.prepare(
      `SELECT *
       FROM leads
       WHERE tenant_id = ?
         AND status != 'cancelled'
         AND event_date IS NOT NULL
         AND TRIM(event_date) != ''
         AND event_date >= ?
       ORDER BY event_date ASC, id ASC
       LIMIT 100`
    ).bind(tenantId, today).all();

    const items = leads.results || [];
    let synced = 0;
    let skipped = 0;
    let failed = 0;
    let replaced = 0;
    const errors = [];

    for (const lead of items) {
      try {
        const result = await syncEventToCalendar(lead, env);
        if (result && result.skipped) skipped++;
        else {
          synced++;
          if (result && result.replacedMissingEvent) replaced++;
        }
      } catch (e) {
        failed++;
        errors.push({ id: lead.id, name: lead.name || '', error: e.message });
        console.log('Google future resync failed for lead', lead.id, e.message);
      }
    }

    return { success: true, total: items.length, synced, skipped, failed, replaced, errors };
  }

  // POST /api/google/disconnect - התנתק
  if (path === '/api/google/disconnect' && request.method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;
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
