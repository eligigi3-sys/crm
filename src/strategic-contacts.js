import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

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

const CATEGORY_VALUES = new Set([
  'school',
  'kindergarten',
  'hr_welfare',
  'employee_committee',
  'dj',
  'hall',
  'producer',
  'supplier',
  'other'
]);

const STATUS_VALUES = new Set(['new', 'need_first_contact', 'contacted', 'in_conversation', 'meeting_scheduled', 'active_relationship', 'dormant', 'not_relevant']);
const PRIORITY_VALUES = new Set(['low', 'normal', 'high']);
const CHANNEL_VALUES = new Set(['', 'phone', 'whatsapp', 'email', 'meeting', 'other']);

function normalizeEnum(value, allowed, fallback, label) {
  const text = String(value === undefined || value === null ? fallback : value).trim();
  if (!allowed.has(text)) throw new Error(label + ' לא תקין');
  return text;
}

function normalizeActive(value) {
  if (value === undefined || value === null || value === '') return 1;
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  throw new Error('active לא תקין');
}

function normalizeOptionalPositiveInteger(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    throw new Error(label + ' לא תקין');
  }
  return numberValue;
}

async function getContactForTenant(env, tenantId, contactId) {
  if (!contactId) return null;
  return env.DB.prepare(
    'SELECT id, name, phone, email, city, area, notes, general_notes FROM contacts WHERE id = ? AND tenant_id = ? LIMIT 1'
  ).bind(contactId, tenantId).first();
}

async function validateLinkedContactId(env, tenantId, linkedContactId) {
  if (!linkedContactId) return null;
  const contact = await getContactForTenant(env, tenantId, linkedContactId);
  if (!contact) throw new Error('הלקוח המקושר לא נמצא');
  return linkedContactId;
}

function mapStrategicContact(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    organization_name: row.organization_name,
    contact_person_name: row.contact_person_name || null,
    role_title: row.role_title || null,
    category: row.category,
    status: row.status,
    priority: row.priority,
    phone: row.phone || null,
    whatsapp: row.whatsapp || null,
    email: row.email || null,
    website: row.website || null,
    city: row.city || null,
    area: row.area || null,
    preferred_channel: row.preferred_channel || null,
    source: row.source || null,
    tags: row.tags || null,
    last_contact_at: row.last_contact_at || null,
    next_contact_at: row.next_contact_at || null,
    followup_reason: row.followup_reason || null,
    notes: row.notes || null,
    active: Number(row.active) === 1 ? 1 : 0,
    linked_contact_id: row.linked_contact_id || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
  };
}

async function getStrategicContactForTenant(env, tenantId, id) {
  const row = await env.DB.prepare(
    'SELECT * FROM strategic_contacts WHERE id = ? AND tenant_id = ? LIMIT 1'
  ).bind(id, tenantId).first();
  return mapStrategicContact(row);
}

function buildStrategicContactPayload(body, existing = {}) {
  const next = { ...existing, ...(body || {}) };
  const categoryValue = normalizeEnum(next.category, CATEGORY_VALUES, 'other', 'קטגוריה');
  const statusValue = normalizeEnum(next.status, STATUS_VALUES, 'new', 'סטטוס');
  const priorityValue = normalizeEnum(next.priority, PRIORITY_VALUES, 'normal', 'עדיפות');
  const preferredChannel = normalizeEnum(next.preferred_channel || '', CHANNEL_VALUES, '', 'ערוץ מועדף') || null;

  return {
    organization_name: normalizeRequiredText(next.organization_name, 'שם ארגון'),
    contact_person_name: normalizeOptionalText(next.contact_person_name),
    role_title: normalizeOptionalText(next.role_title),
    category: categoryValue,
    status: statusValue,
    priority: priorityValue,
    phone: normalizeOptionalText(next.phone),
    whatsapp: normalizeOptionalText(next.whatsapp),
    email: normalizeOptionalText(next.email),
    website: normalizeOptionalText(next.website),
    city: normalizeOptionalText(next.city),
    area: normalizeOptionalText(next.area),
    preferred_channel: preferredChannel,
    source: normalizeOptionalText(next.source),
    tags: normalizeOptionalText(next.tags),
    last_contact_at: normalizeOptionalText(next.last_contact_at),
    next_contact_at: normalizeOptionalText(next.next_contact_at),
    followup_reason: normalizeOptionalText(next.followup_reason),
    notes: normalizeOptionalText(next.notes),
    active: normalizeActive(next.active),
    linked_contact_id: normalizeOptionalPositiveInteger(next.linked_contact_id, 'לקוח מקושר')
  };
}

async function listStrategicContacts(request, env, tenantId) {
  const url = new URL(request.url);
  const search = normalizeOptionalText(url.searchParams.get('search'));
  const category = normalizeOptionalText(url.searchParams.get('category'));
  const status = normalizeOptionalText(url.searchParams.get('status'));
  const priority = normalizeOptionalText(url.searchParams.get('priority'));
  const active = normalizeOptionalText(url.searchParams.get('active'));
  const linkedContactId = normalizeOptionalPositiveInteger(url.searchParams.get('linked_contact_id'), 'לקוח מקושר');
  const due = normalizeOptionalText(url.searchParams.get('next_contact_due')) || normalizeOptionalText(url.searchParams.get('overdue'));

  let sql = 'SELECT * FROM strategic_contacts WHERE tenant_id = ?';
  const params = [tenantId];

  if (search) {
    sql += ` AND (
      organization_name LIKE ?
      OR contact_person_name LIKE ?
      OR phone LIKE ?
      OR whatsapp LIKE ?
      OR email LIKE ?
      OR city LIKE ?
      OR area LIKE ?
      OR tags LIKE ?
      OR notes LIKE ?
    )`;
    const like = '%' + search + '%';
    params.push(like, like, like, like, like, like, like, like, like);
  }

  if (category) {
    if (!CATEGORY_VALUES.has(category)) return json({ error: 'קטגוריה לא תקינה' }, 400);
    sql += ' AND category = ?';
    params.push(category);
  }

  if (status) {
    if (!STATUS_VALUES.has(status)) return json({ error: 'סטטוס לא תקין' }, 400);
    sql += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    if (!PRIORITY_VALUES.has(priority)) return json({ error: 'עדיפות לא תקינה' }, 400);
    sql += ' AND priority = ?';
    params.push(priority);
  }

  if (linkedContactId) {
    sql += ' AND linked_contact_id = ?';
    params.push(linkedContactId);
  }

  if (active === null) {
    sql += ' AND active = 1';
  } else if (active !== 'all') {
    sql += ' AND active = ?';
    params.push(normalizeActive(active));
  }

  if (due === '1' || due === 'true') {
    sql += " AND next_contact_at IS NOT NULL AND next_contact_at <= date('now')";
  }

  sql += ` ORDER BY
    CASE priority WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
    CASE WHEN next_contact_at IS NULL THEN 1 ELSE 0 END,
    next_contact_at ASC,
    updated_at DESC,
    id DESC
    LIMIT 200`;

  const { results } = await env.DB.prepare(sql).bind(...params).all();
  return { strategic_contacts: (results || []).map(mapStrategicContact) };
}

async function createStrategicContact(request, env, tenantId) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'בקשה לא תקינה' }, 400);
  }

  let payload;
  try {
    payload = buildStrategicContactPayload(body || {});
    payload.linked_contact_id = await validateLinkedContactId(env, tenantId, payload.linked_contact_id);
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }

  const result = await env.DB.prepare(
    `INSERT INTO strategic_contacts (
      tenant_id,
      organization_name,
      contact_person_name,
      role_title,
      category,
      status,
      priority,
      phone,
      whatsapp,
      email,
      website,
      city,
      area,
      preferred_channel,
      source,
      tags,
      last_contact_at,
      next_contact_at,
      followup_reason,
      notes,
      active,
      linked_contact_id,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    payload.organization_name,
    payload.contact_person_name,
    payload.role_title,
    payload.category,
    payload.status,
    payload.priority,
    payload.phone,
    payload.whatsapp,
    payload.email,
    payload.website,
    payload.city,
    payload.area,
    payload.preferred_channel,
    payload.source,
    payload.tags,
    payload.last_contact_at,
    payload.next_contact_at,
    payload.followup_reason,
    payload.notes,
    payload.active,
    payload.linked_contact_id
  ).run();

  const created = await getStrategicContactForTenant(env, tenantId, result.meta.last_row_id);
  return { success: true, strategic_contact: created };
}

async function updateStrategicContact(request, env, tenantId, id) {
  const existing = await getStrategicContactForTenant(env, tenantId, id);
  if (!existing) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'בקשה לא תקינה' }, 400);
  }

  let payload;
  try {
    payload = buildStrategicContactPayload(body || {}, existing);
    payload.linked_contact_id = await validateLinkedContactId(env, tenantId, payload.linked_contact_id);
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }

  await env.DB.prepare(
    `UPDATE strategic_contacts SET
      organization_name = ?,
      contact_person_name = ?,
      role_title = ?,
      category = ?,
      status = ?,
      priority = ?,
      phone = ?,
      whatsapp = ?,
      email = ?,
      website = ?,
      city = ?,
      area = ?,
      preferred_channel = ?,
      source = ?,
      tags = ?,
      last_contact_at = ?,
      next_contact_at = ?,
      followup_reason = ?,
      notes = ?,
      active = ?,
      linked_contact_id = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND tenant_id = ?`
  ).bind(
    payload.organization_name,
    payload.contact_person_name,
    payload.role_title,
    payload.category,
    payload.status,
    payload.priority,
    payload.phone,
    payload.whatsapp,
    payload.email,
    payload.website,
    payload.city,
    payload.area,
    payload.preferred_channel,
    payload.source,
    payload.tags,
    payload.last_contact_at,
    payload.next_contact_at,
    payload.followup_reason,
    payload.notes,
    payload.active,
    payload.linked_contact_id,
    id,
    tenantId
  ).run();

  const updated = await getStrategicContactForTenant(env, tenantId, id);
  return { success: true, strategic_contact: updated };
}

export async function handleStrategicContacts(request, env, path) {
  const method = request.method;
  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'strategic_contacts');
  if (moduleState instanceof Response) return moduleState;

  const tenantId = tenantCtx.tenant.id;

  if (path === '/api/strategic-contacts' && method === 'GET') {
    return listStrategicContacts(request, env, tenantId);
  }

  if (path === '/api/strategic-contacts' && method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return createStrategicContact(request, env, tenantId);
  }

  const idMatch = path.match(/^\/api\/strategic-contacts\/(\d+)$/);
  if (idMatch && method === 'GET') {
    const item = await getStrategicContactForTenant(env, tenantId, Number(idMatch[1]));
    if (!item) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);
    return { strategic_contact: item };
  }

  if (idMatch && method === 'PUT') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return updateStrategicContact(request, env, tenantId, Number(idMatch[1]));
  }

  return json({ error: 'Strategic contacts route not found' }, 404);
}
