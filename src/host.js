// ============================================================
// host.js - זיהוי עסק (tenant) לפי כתובת האתר (subdomain)
// ============================================================
// כל עסק מקבל כתובת משלו: <slug>.comics-events.co.il
// הכתובת הראשית crm.comics-events.co.il נשארת ללא שינוי.

export const BASE_DOMAIN = 'comics-events.co.il';

// תת-דומיינים שמורים - לעולם לא tenant
export const RESERVED_SUBDOMAINS = new Set(['crm', 'www', 'api', 'admin', 'app']);

// מחלץ את ה-slug של ה-tenant מתוך ה-hostname, או null אם אין
export function extractTenantSlug(hostname) {
  if (!hostname) return null;
  const host = String(hostname).toLowerCase().split(':')[0].trim();
  if (!host) return null;
  if (host === BASE_DOMAIN) return null;
  if (host.endsWith('.workers.dev') || host === 'localhost' || host === '127.0.0.1') return null;
  if (!host.endsWith('.' + BASE_DOMAIN)) return null;
  const sub = host.slice(0, host.length - BASE_DOMAIN.length - 1);
  if (!sub || sub.includes('.')) return null;
  if (RESERVED_SUBDOMAINS.has(sub)) return null;
  return sub;
}

// בודק ש-host מסוים הוא host חוקי של המערכת (לשימוש ב-state של OAuth)
export function isValidAppHost(host) {
  if (!host) return false;
  const normalized = String(host).toLowerCase().split(':')[0].trim();
  if (normalized === 'crm.' + BASE_DOMAIN) return true;
  const slug = extractTenantSlug(normalized);
  return !!slug;
}

// פותר את ה-tenant מהבקשה. מחזיר { slug, tenant } - tenant=null אם לא נמצא
export async function resolveHostTenant(request, env) {
  const slug = extractTenantSlug(new URL(request.url).hostname);
  if (!slug) return { slug: null, tenant: null };
  const tenant = await env.DB.prepare(
    'SELECT id, name, slug, status FROM tenants WHERE slug = ? LIMIT 1'
  ).bind(slug).first();
  return { slug, tenant };
}

function pageShell(title, bodyHtml, accentColor) {
  return `<html dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#f8fafc;color:#1e293b">
  <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  ${bodyHtml}
  <a href="https://crm.${BASE_DOMAIN}/" style="display:inline-block;margin-top:24px;background:${accentColor};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">חזור למערכת הראשית</a>
  </div></body></html>`;
}

// דף שגיאה ידידותי כש-subdomain לא תואם לאף עסק
export function unknownTenantPage(slug) {
  const safeSlug = String(slug || '').replace(/[<>&"]/g, '');
  return new Response(
    pageShell('הכתובת לא נמצאה', `
      <div style="font-size:56px">🔍</div>
      <h2 style="margin:8px 0">הכתובת "${safeSlug}" לא קיימת במערכת</h2>
      <p style="color:#64748b">לא נמצא עסק עם הכתובת הזו. בדקו את האיותר או חזרו לכתובת הראשית.</p>
    `, '#7c3aed'),
    { status: 404, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}

// דף כשהעסק קיים אבל לא פעיל
export function inactiveTenantPage(tenant) {
  const safeName = String((tenant && tenant.name) || '').replace(/[<>&"]/g, '');
  return new Response(
    pageShell('העסק לא פעיל', `
      <div style="font-size:56px">⏸️</div>
      <h2 style="margin:8px 0">העסק "${safeName}" אינו פעיל כרגע</h2>
      <p style="color:#64748b">לפרטים נוספים פנו למנהל המערכת.</p>
    `, '#64748b'),
    { status: 403, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
