import { requireTenantContext, assertTenantRole } from './auth.js';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

const STATUS_VALUES = new Set(['pending', 'approved', 'rejected', 'printed', 'cancelled']);
const SOURCE_VALUES = new Set(['guest', 'admin', 'system', 'other']);

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeRequiredText(value, label) {
  const text = normalizeOptionalText(value);
  if (!text) throw new Error(label + ' חובה');
  return text;
}

function normalizeStatus(value, fallback = 'pending') {
  const text = String(value === undefined || value === null || value === '' ? fallback : value).trim().toLowerCase();
  if (!STATUS_VALUES.has(text)) throw new Error('סטטוס לא תקין');
  return text;
}

function normalizeSource(value) {
  const text = String(value === undefined || value === null || value === '' ? 'guest' : value).trim().toLowerCase();
  return SOURCE_VALUES.has(text) ? text : 'other';
}

function normalizeOptionalPositiveInteger(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) throw new Error(label + ' לא תקין');
  return numberValue;
}

function normalizePayload(body) {
  const imageUrl = normalizeOptionalText(body.image_url || body.file_url || body.url);
  const imageData = normalizeOptionalText(body.image_data || body.data_url || body.image_base64);
  const textContent = normalizeOptionalText(body.text_content || body.text || body.caption);
  if (!imageUrl && !imageData && !textContent) throw new Error('חובה לשלוח תמונה, קישור או טקסט להדפסה');
  if (imageData && imageData.length > 1200000) throw new Error('קובץ גדול מדי לבקשת הדפסה');

  let metadataJson = null;
  if (body.metadata !== undefined && body.metadata !== null) {
    metadataJson = JSON.stringify(body.metadata).slice(0, 20000);
  }

  return {
    source: normalizeSource(body.source),
    guest_name: normalizeOptionalText(body.guest_name || body.name),
    guest_phone: normalizeOptionalText(body.guest_phone || body.phone),
    event_id: normalizeOptionalPositiveInteger(body.event_id || body.lead_id, 'אירוע'),
    image_url: imageUrl,
    image_data: imageData,
    text_content: textContent,
    notes: normalizeOptionalText(body.notes || body.note),
    external_ref: normalizeOptionalText(body.external_ref || body.external_id || body.request_id),
    metadata_json: metadataJson
  };
}

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    source: row.source,
    guest_name: row.guest_name,
    guest_phone: row.guest_phone,
    event_id: row.event_id,
    event_customer_name: row.event_customer_name || null,
    event_date: row.event_date || null,
    event_type: row.event_type || null,
    image_url: row.image_url,
    image_data: row.image_data,
    text_content: row.text_content,
    status: row.status,
    notes: row.notes,
    admin_note: row.admin_note,
    external_ref: row.external_ref,
    metadata: row.metadata_json ? safeJsonParse(row.metadata_json) : null,
    approved_by_user_id: row.approved_by_user_id,
    approved_at: row.approved_at,
    rejected_by_user_id: row.rejected_by_user_id,
    rejected_at: row.rejected_at,
    printed_at: row.printed_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

async function getTenantBySlug(env, slug) {
  const value = normalizeRequiredText(slug, 'מזהה עסק');
  return env.DB.prepare('SELECT id, slug, status FROM tenants WHERE slug = ? LIMIT 1').bind(value).first();
}

async function getPrintRequest(env, tenantId, id) {
  return env.DB.prepare(
    `SELECT pr.*, l.name AS event_customer_name, l.event_date, l.event_type
     FROM print_requests pr
     LEFT JOIN leads l ON l.id = pr.event_id AND l.tenant_id = pr.tenant_id
     WHERE pr.tenant_id = ? AND pr.id = ?
     LIMIT 1`
  ).bind(tenantId, id).first();
}

export async function handlePrintRequests(request, env, path) {
  const method = request.method;

  if (path === '/api/public/print-requests' && method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'בקשה לא תקינה' }, 400); }
    let tenant;
    let payload;
    try {
      tenant = await getTenantBySlug(env, body.tenant_slug || body.tenant || body.business_slug);
      payload = normalizePayload(body);
    } catch (err) {
      return json({ error: err.message || 'בקשת הדפסה לא תקינה' }, 400);
    }
    if (!tenant || tenant.status !== 'active') return json({ error: 'עסק לא נמצא או לא פעיל' }, 404);
    const result = await env.DB.prepare(
      `INSERT INTO print_requests (
        tenant_id, source, guest_name, guest_phone, event_id, image_url, image_data,
        text_content, status, notes, external_ref, metadata_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`
    ).bind(
      tenant.id,
      payload.source,
      payload.guest_name,
      payload.guest_phone,
      payload.event_id,
      payload.image_url,
      payload.image_data,
      payload.text_content,
      payload.notes,
      payload.external_ref,
      payload.metadata_json
    ).run();
    return json({ success: true, request: { id: result.meta.last_row_id, status: 'pending' } }, 201);
  }

  if (path === '/api/print-requests' && method === 'GET') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    const roleCheck = await assertTenantRole(ctx, ['owner', 'admin', 'manager']);
    if (roleCheck instanceof Response) return roleCheck;
    const url = new URL(request.url);
    let status;
    try { status = normalizeStatus(url.searchParams.get('status') || 'pending'); } catch (err) { return json({ error: err.message }, 400); }
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100), 1), 200);
    const rows = await env.DB.prepare(
      `SELECT pr.*, l.name AS event_customer_name, l.event_date, l.event_type
       FROM print_requests pr
       LEFT JOIN leads l ON l.id = pr.event_id AND l.tenant_id = pr.tenant_id
       WHERE pr.tenant_id = ? AND pr.status = ?
       ORDER BY pr.created_at DESC, pr.id DESC
       LIMIT ?`
    ).bind(ctx.tenant.id, status, limit).all();
    return json({ requests: (rows.results || []).map(mapRow) });
  }

  const actionMatch = path.match(/^\/api\/print-requests\/(\d+)\/(approve|reject|mark-printed)$/);
  if (actionMatch && method === 'POST') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    const roleCheck = await assertTenantRole(ctx, ['owner', 'admin', 'manager']);
    if (roleCheck instanceof Response) return roleCheck;
    const id = Number(actionMatch[1]);
    const action = actionMatch[2];
    let body = {};
    try { body = await request.json(); } catch { body = {}; }
    const existing = await getPrintRequest(env, ctx.tenant.id, id);
    if (!existing) return json({ error: 'בקשת הדפסה לא נמצאה' }, 404);
    const adminNote = normalizeOptionalText(body.admin_note || body.note);

    if (action === 'approve') {
      if (existing.status !== 'pending') return json({ error: 'אפשר לאשר רק בקשה ממתינה' }, 400);
      await env.DB.prepare(
        `UPDATE print_requests
         SET status = 'approved', approved_by_user_id = ?, approved_at = CURRENT_TIMESTAMP,
             admin_note = COALESCE(?, admin_note), updated_at = CURRENT_TIMESTAMP
         WHERE tenant_id = ? AND id = ?`
      ).bind(ctx.user.id, adminNote, ctx.tenant.id, id).run();
    } else if (action === 'reject') {
      if (existing.status !== 'pending') return json({ error: 'אפשר לדחות רק בקשה ממתינה' }, 400);
      await env.DB.prepare(
        `UPDATE print_requests
         SET status = 'rejected', rejected_by_user_id = ?, rejected_at = CURRENT_TIMESTAMP,
             admin_note = COALESCE(?, admin_note), updated_at = CURRENT_TIMESTAMP
         WHERE tenant_id = ? AND id = ?`
      ).bind(ctx.user.id, adminNote, ctx.tenant.id, id).run();
    } else {
      if (existing.status !== 'approved') return json({ error: 'אפשר לסמן הודפס רק אחרי אישור' }, 400);
      await env.DB.prepare(
        `UPDATE print_requests
         SET status = 'printed', printed_at = CURRENT_TIMESTAMP,
             admin_note = COALESCE(?, admin_note), updated_at = CURRENT_TIMESTAMP
         WHERE tenant_id = ? AND id = ?`
      ).bind(adminNote, ctx.tenant.id, id).run();
    }

    return json({ success: true, request: mapRow(await getPrintRequest(env, ctx.tenant.id, id)) });
  }

  return json({ error: 'Route not found' }, 404);
}
