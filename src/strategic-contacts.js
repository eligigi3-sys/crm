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
const ACTIVITY_TYPE_VALUES = new Set(['note', 'call', 'whatsapp', 'email', 'meeting', 'followup', 'other']);
const FOLLOW_UP_FILTER_VALUES = new Set(['today', 'week', 'overdue', 'high_priority', 'dormant_90']);
const SEASONAL_TAG_VALUES = new Set(['school_start', 'school_end', 'purim', 'pesach', 'rosh_hashana', 'hanukkah', 'civil_year_end', 'team_building', 'wedding_season', 'summer', 'bar_bat_mitzvah', 'all_year']);
const RELATIONSHIP_GRADE_VALUES = new Set(['', 'A', 'B', 'C']);
const WARMTH_LEVEL_VALUES = new Set(['', 'cold', 'warm', 'hot']);
const RELATIONSHIP_VALUE_FILTER_VALUES = new Set(['grade_a', 'warm_hot', 'high_potential']);
const ATTRIBUTION_TYPE_VALUES = new Set(['referral', 'repeat_business', 'partner', 'school_cycle', 'campaign_response']);

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

function normalizeOptionalNonNegativeNumber(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(label + ' לא תקין');
  }
  return numberValue;
}

function normalizeOptionalNonNegativeInteger(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new Error(label + ' לא תקין');
  }
  return numberValue;
}

async function getContactForTenant(env, tenantId, contactId) {
  if (!contactId) return null;
  return env.DB.prepare(
    'SELECT id, name, phone, email, notes, general_notes FROM contacts WHERE id = ? AND tenant_id = ? LIMIT 1'
  ).bind(contactId, tenantId).first();
}

async function validateLinkedContactId(env, tenantId, linkedContactId) {
  if (!linkedContactId) return null;
  const contact = await getContactForTenant(env, tenantId, linkedContactId);
  if (!contact) throw new Error('הלקוח המקושר לא נמצא');
  return linkedContactId;
}

function mapStrategicContactActivity(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    strategic_contact_id: row.strategic_contact_id,
    activity_type: row.activity_type || 'note',
    channel: row.channel || null,
    summary: row.summary || null,
    activity_at: row.activity_at || null,
    next_contact_at: row.next_contact_at || null,
    created_by_user_id: row.created_by_user_id || null,
    created_at: row.created_at || null
  };
}

function buildStrategicContactActivityPayload(body) {
  const next = body || {};
  const activityType = normalizeEnum(next.activity_type, ACTIVITY_TYPE_VALUES, 'note', 'סוג פעילות');
  const channel = normalizeEnum(next.channel || '', CHANNEL_VALUES, '', 'ערוץ') || null;
  return {
    activity_type: activityType,
    channel,
    summary: normalizeRequiredText(next.summary, 'סיכום פעילות'),
    activity_at: normalizeOptionalText(next.activity_at),
    next_contact_at: normalizeOptionalText(next.next_contact_at)
  };
}

function mapStrategicContactAttribution(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    strategic_contact_id: row.strategic_contact_id,
    strategic_contact_name: row.strategic_contact_name || null,
    contact_id: row.contact_id || null,
    contact_name: row.contact_name || null,
    lead_id: row.lead_id || null,
    lead_num: row.lead_num || null,
    lead_name: row.lead_name || null,
    event_id: row.event_id || null,
    event_num: row.event_num || null,
    event_name: row.event_name || null,
    event_date: row.event_date || null,
    attribution_type: row.attribution_type || 'referral',
    notes: row.notes || null,
    created_by_user_id: row.created_by_user_id || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
  };
}

function moneyNumber(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function mapStrategicContactBusinessSummary(row) {
  row = row || {};
  return {
    attribution_count: Number(row.attribution_count || 0),
    linked_customers_count: Number(row.linked_customers_count || 0),
    linked_leads_count: Number(row.linked_leads_count || 0),
    linked_events_count: Number(row.linked_events_count || 0),
    quotes_count: Number(row.quotes_count || 0),
    invoices_count: Number(row.invoices_count || 0),
    issued_invoices_total: moneyNumber(row.issued_invoices_total),
    open_unpaid_amount: moneyNumber(row.open_unpaid_amount),
    computed_from: 'strategic_contact_attributions_sales_documents_read_only',
    limitations: [
      'מבוסס רק על שיוכי Strategic Contact קיימים',
      'לא משנה מסמכי מכירה, חשבוניות או סיכומים פיננסיים קיימים',
      'מסמך שקשור גם ללקוח וגם לליד נספר פעם אחת בלבד'
    ]
  };
}


function buildStrategicContactAttributionPayload(body, strategicContactId) {
  const next = body || {};
  return {
    strategic_contact_id: strategicContactId || normalizeOptionalPositiveInteger(next.strategic_contact_id, 'קשר אסטרטגי'),
    contact_id: normalizeOptionalPositiveInteger(next.contact_id, 'לקוח'),
    lead_id: normalizeOptionalPositiveInteger(next.lead_id, 'ליד'),
    event_id: normalizeOptionalPositiveInteger(next.event_id, 'אירוע'),
    attribution_type: normalizeEnum(next.attribution_type, ATTRIBUTION_TYPE_VALUES, 'referral', 'סוג שיוך'),
    notes: normalizeOptionalText(next.notes)
  };
}

async function validateStrategicContactAttributionPayload(env, tenantId, payload) {
  const strategicContact = await getStrategicContactForTenant(env, tenantId, payload.strategic_contact_id);
  if (!strategicContact) throw new Error('קשר אסטרטגי לא נמצא');
  if (!payload.contact_id && !payload.lead_id && !payload.event_id) throw new Error('יש לבחור לקוח או ליד/אירוע לשיוך');

  if (payload.contact_id) {
    const contact = await env.DB.prepare('SELECT id FROM contacts WHERE id = ? AND tenant_id = ? LIMIT 1').bind(payload.contact_id, tenantId).first();
    if (!contact) throw new Error('הלקוח לשיוך לא נמצא');
  }
  if (payload.lead_id) {
    const lead = await env.DB.prepare('SELECT id FROM leads WHERE id = ? AND tenant_id = ? LIMIT 1').bind(payload.lead_id, tenantId).first();
    if (!lead) throw new Error('הליד לשיוך לא נמצא');
  }
  if (payload.event_id) {
    const event = await env.DB.prepare('SELECT id FROM leads WHERE id = ? AND tenant_id = ? LIMIT 1').bind(payload.event_id, tenantId).first();
    if (!event) throw new Error('האירוע לשיוך לא נמצא');
  }
  return payload;
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
    relationship_grade: row.relationship_grade || null,
    warmth_level: row.warmth_level || null,
    estimated_annual_value: row.estimated_annual_value === null || row.estimated_annual_value === undefined ? null : Number(row.estimated_annual_value),
    potential_events_per_year: row.potential_events_per_year === null || row.potential_events_per_year === undefined ? null : Number(row.potential_events_per_year),
    relevant_services: row.relevant_services || null,
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
  const relationshipGrade = normalizeEnum(next.relationship_grade || '', RELATIONSHIP_GRADE_VALUES, '', 'דירוג קשר') || null;
  const warmthLevel = normalizeEnum(next.warmth_level || '', WARMTH_LEVEL_VALUES, '', 'רמת חום') || null;

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
    linked_contact_id: normalizeOptionalPositiveInteger(next.linked_contact_id, 'לקוח מקושר'),
    relationship_grade: relationshipGrade,
    warmth_level: warmthLevel,
    estimated_annual_value: normalizeOptionalNonNegativeNumber(next.estimated_annual_value, 'פוטנציאל שנתי'),
    potential_events_per_year: normalizeOptionalNonNegativeInteger(next.potential_events_per_year, 'אירועים פוטנציאליים בשנה'),
    relevant_services: normalizeOptionalText(next.relevant_services)
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
  const followUp = normalizeOptionalText(url.searchParams.get('follow_up'));
  const seasonalTag = normalizeOptionalText(url.searchParams.get('seasonal_tag'));
  const relationshipValue = normalizeOptionalText(url.searchParams.get('relationship_value'));
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
      OR relevant_services LIKE ?
      OR notes LIKE ?
    )`;
    const like = '%' + search + '%';
    params.push(like, like, like, like, like, like, like, like, like, like);
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

  if (seasonalTag) {
    if (!SEASONAL_TAG_VALUES.has(seasonalTag)) return json({ error: 'תגית עונתית לא תקינה' }, 400);
    sql += ' AND tags LIKE ?';
    params.push('%' + seasonalTag + '%');
  }

  if (relationshipValue) {
    if (!RELATIONSHIP_VALUE_FILTER_VALUES.has(relationshipValue)) return json({ error: 'מסנן ערך קשר לא תקין' }, 400);
    if (relationshipValue === 'grade_a') {
      sql += " AND relationship_grade = 'A'";
    } else if (relationshipValue === 'warm_hot') {
      sql += " AND warmth_level IN ('warm', 'hot')";
    } else if (relationshipValue === 'high_potential') {
      sql += " AND (estimated_annual_value >= 5000 OR potential_events_per_year >= 3)";
    }
  }

  if (active === null) {
    sql += ' AND active = 1';
  } else if (active !== 'all') {
    sql += ' AND active = ?';
    params.push(normalizeActive(active));
  }

  if (followUp) {
    if (!FOLLOW_UP_FILTER_VALUES.has(followUp)) return json({ error: 'מסנן מעקב לא תקין' }, 400);
    if (followUp === 'today') {
      sql += " AND next_contact_at = date('now')";
    } else if (followUp === 'week') {
      sql += " AND next_contact_at IS NOT NULL AND next_contact_at >= date('now') AND next_contact_at <= date('now', '+7 days')";
    } else if (followUp === 'overdue') {
      sql += " AND next_contact_at IS NOT NULL AND next_contact_at < date('now')";
    } else if (followUp === 'high_priority') {
      sql += " AND priority = 'high'";
    } else if (followUp === 'dormant_90') {
      sql += " AND (status = 'dormant' OR last_contact_at IS NULL OR last_contact_at <= date('now', '-90 days'))";
    }
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

function strategicContactAttributionSelectSql() {
  return `SELECT sca.*,
      sc.organization_name AS strategic_contact_name,
      c.name AS contact_name,
      l.lead_num AS lead_num,
      l.name AS lead_name,
      e.lead_num AS event_num,
      e.name AS event_name,
      e.event_date AS event_date
    FROM strategic_contact_attributions sca
    JOIN strategic_contacts sc ON sc.id = sca.strategic_contact_id AND sc.tenant_id = sca.tenant_id
    LEFT JOIN contacts c ON c.id = sca.contact_id AND c.tenant_id = sca.tenant_id
    LEFT JOIN leads l ON l.id = sca.lead_id AND l.tenant_id = sca.tenant_id
    LEFT JOIN leads e ON e.id = sca.event_id AND e.tenant_id = sca.tenant_id`;
}

async function getStrategicContactBusinessSummary(env, tenantId, strategicContactId) {
  const strategicContact = await getStrategicContactForTenant(env, tenantId, strategicContactId);
  if (!strategicContact) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  const attributionCounts = await env.DB.prepare(
    `SELECT
       COUNT(*) AS attribution_count,
       COUNT(DISTINCT contact_id) AS linked_customers_count,
       COUNT(DISTINCT lead_id) AS linked_leads_count,
       COUNT(DISTINCT event_id) AS linked_events_count
     FROM strategic_contact_attributions
     WHERE tenant_id = ?
       AND strategic_contact_id = ?`
  ).bind(tenantId, strategicContactId).first();

  const salesSummary = await env.DB.prepare(
    `SELECT
       COUNT(DISTINCT CASE WHEN sd.document_type = 'quote' THEN sd.id END) AS quotes_count,
       COUNT(DISTINCT CASE WHEN sd.document_type = 'invoice' THEN sd.id END) AS invoices_count,
       COALESCE(SUM(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('issued', 'paid', 'partially_paid') THEN sd.total_amount ELSE 0 END), 0) AS issued_invoices_total,
       COALESCE(SUM(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('sent', 'issued', 'partially_paid') THEN sd.balance_amount ELSE 0 END), 0) AS open_unpaid_amount
     FROM sales_documents sd
     WHERE sd.tenant_id = ?
       AND EXISTS (
         SELECT 1
         FROM strategic_contact_attributions sca
         WHERE sca.tenant_id = sd.tenant_id
           AND sca.strategic_contact_id = ?
           AND (
             (sca.contact_id IS NOT NULL AND sd.contact_id = sca.contact_id)
             OR (sca.lead_id IS NOT NULL AND sd.lead_id = sca.lead_id)
             OR (sca.event_id IS NOT NULL AND sd.lead_id = sca.event_id)
           )
       )`
  ).bind(tenantId, strategicContactId).first();

  return {
    strategic_contact_id: strategicContactId,
    summary: mapStrategicContactBusinessSummary({ ...(attributionCounts || {}), ...(salesSummary || {}) })
  };
}

async function listStrategicContactAttributions(request, env, tenantId, strategicContactId) {
  const url = new URL(request.url);
  const params = [tenantId];
  let sql = strategicContactAttributionSelectSql() + ' WHERE sca.tenant_id = ?';

  if (strategicContactId) {
    const strategicContact = await getStrategicContactForTenant(env, tenantId, strategicContactId);
    if (!strategicContact) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);
    sql += ' AND sca.strategic_contact_id = ?';
    params.push(strategicContactId);
  }

  const contactId = normalizeOptionalPositiveInteger(url.searchParams.get('contact_id'), 'לקוח');
  const leadId = normalizeOptionalPositiveInteger(url.searchParams.get('lead_id'), 'ליד');
  const eventId = normalizeOptionalPositiveInteger(url.searchParams.get('event_id'), 'אירוע');
  if (contactId) { sql += ' AND sca.contact_id = ?'; params.push(contactId); }
  if (leadId) { sql += ' AND sca.lead_id = ?'; params.push(leadId); }
  if (eventId) { sql += ' AND sca.event_id = ?'; params.push(eventId); }

  sql += ' ORDER BY sca.created_at DESC, sca.id DESC LIMIT 100';
  const { results } = await env.DB.prepare(sql).bind(...params).all();
  return { attributions: (results || []).map(mapStrategicContactAttribution) };
}

async function createStrategicContactAttribution(request, env, tenantCtx, strategicContactId) {
  const tenantId = tenantCtx.tenant.id;
  let body;
  try { body = await request.json(); } catch { return json({ error: 'בקשה לא תקינה' }, 400); }
  let payload;
  try {
    payload = await validateStrategicContactAttributionPayload(env, tenantId, buildStrategicContactAttributionPayload(body || {}, strategicContactId));
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }

  const result = await env.DB.prepare(
    `INSERT INTO strategic_contact_attributions (
      tenant_id, strategic_contact_id, contact_id, lead_id, event_id,
      attribution_type, notes, created_by_user_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    payload.strategic_contact_id,
    payload.contact_id,
    payload.lead_id,
    payload.event_id,
    payload.attribution_type,
    payload.notes,
    tenantCtx.user.id
  ).run();

  const row = await env.DB.prepare(strategicContactAttributionSelectSql() + ' WHERE sca.id = ? AND sca.tenant_id = ? LIMIT 1').bind(result.meta.last_row_id, tenantId).first();
  return { success: true, attribution: mapStrategicContactAttribution(row) };
}

async function updateStrategicContactAttribution(request, env, tenantCtx, strategicContactId, attributionId) {
  const tenantId = tenantCtx.tenant.id;
  const existing = await env.DB.prepare(
    'SELECT * FROM strategic_contact_attributions WHERE id = ? AND tenant_id = ? AND strategic_contact_id = ? LIMIT 1'
  ).bind(attributionId, tenantId, strategicContactId).first();
  if (!existing) return json({ error: 'שיוך לא נמצא' }, 404);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'בקשה לא תקינה' }, 400); }
  let payload;
  try {
    payload = await validateStrategicContactAttributionPayload(env, tenantId, buildStrategicContactAttributionPayload({ ...existing, ...(body || {}) }, strategicContactId));
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }

  await env.DB.prepare(
    `UPDATE strategic_contact_attributions
     SET contact_id = ?, lead_id = ?, event_id = ?, attribution_type = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND tenant_id = ? AND strategic_contact_id = ?`
  ).bind(payload.contact_id, payload.lead_id, payload.event_id, payload.attribution_type, payload.notes, attributionId, tenantId, strategicContactId).run();

  const row = await env.DB.prepare(strategicContactAttributionSelectSql() + ' WHERE sca.id = ? AND sca.tenant_id = ? LIMIT 1').bind(attributionId, tenantId).first();
  return { success: true, attribution: mapStrategicContactAttribution(row) };
}

async function listStrategicContactActivities(env, tenantId, strategicContactId) {
  const strategicContact = await getStrategicContactForTenant(env, tenantId, strategicContactId);
  if (!strategicContact) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  const { results } = await env.DB.prepare(
    `SELECT *
     FROM strategic_contact_activities
     WHERE tenant_id = ?
       AND strategic_contact_id = ?
     ORDER BY COALESCE(activity_at, created_at) DESC, id DESC
     LIMIT 50`
  ).bind(tenantId, strategicContactId).all();

  return { activities: (results || []).map(mapStrategicContactActivity) };
}

async function createStrategicContactActivity(request, env, tenantCtx, strategicContactId) {
  const tenantId = tenantCtx.tenant.id;
  const strategicContact = await getStrategicContactForTenant(env, tenantId, strategicContactId);
  if (!strategicContact) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'בקשה לא תקינה' }, 400);
  }

  let payload;
  try {
    payload = buildStrategicContactActivityPayload(body || {});
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }

  const result = await env.DB.prepare(
    `INSERT INTO strategic_contact_activities (
      tenant_id,
      strategic_contact_id,
      activity_type,
      channel,
      summary,
      activity_at,
      next_contact_at,
      created_by_user_id,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    strategicContactId,
    payload.activity_type,
    payload.channel,
    payload.summary,
    payload.activity_at,
    payload.next_contact_at,
    tenantCtx.user.id
  ).run();

  const created = await env.DB.prepare(
    `SELECT *
     FROM strategic_contact_activities
     WHERE id = ?
       AND tenant_id = ?
       AND strategic_contact_id = ?
     LIMIT 1`
  ).bind(result.meta.last_row_id, tenantId, strategicContactId).first();

  return { success: true, activity: mapStrategicContactActivity(created) };
}

async function markStrategicContactContacted(request, env, tenantCtx, strategicContactId) {
  const tenantId = tenantCtx.tenant.id;
  const strategicContact = await getStrategicContactForTenant(env, tenantId, strategicContactId);
  if (!strategicContact) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'בקשה לא תקינה' }, 400);
  }

  let payload;
  const contactedAt = new Date().toISOString().slice(0, 10);
  try {
    payload = buildStrategicContactActivityPayload({ ...(body || {}), activity_at: contactedAt });
  } catch (error) {
    return json({ error: error.message || 'בקשה לא תקינה' }, 400);
  }
  const followupReason = normalizeOptionalText(body && body.followup_reason);

  const result = await env.DB.prepare(
    `INSERT INTO strategic_contact_activities (
      tenant_id,
      strategic_contact_id,
      activity_type,
      channel,
      summary,
      activity_at,
      next_contact_at,
      created_by_user_id,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    strategicContactId,
    payload.activity_type,
    payload.channel,
    payload.summary,
    payload.activity_at,
    payload.next_contact_at,
    tenantCtx.user.id
  ).run();

  await env.DB.prepare(
    `UPDATE strategic_contacts
     SET last_contact_at = ?,
         next_contact_at = ?,
         followup_reason = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?`
  ).bind(
    payload.activity_at,
    payload.next_contact_at,
    followupReason,
    strategicContactId,
    tenantId
  ).run();

  const activity = await env.DB.prepare(
    `SELECT *
     FROM strategic_contact_activities
     WHERE id = ?
       AND tenant_id = ?
       AND strategic_contact_id = ?
     LIMIT 1`
  ).bind(result.meta.last_row_id, tenantId, strategicContactId).first();
  const updated = await getStrategicContactForTenant(env, tenantId, strategicContactId);

  return { success: true, activity: mapStrategicContactActivity(activity), strategic_contact: updated };
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
      relationship_grade,
      warmth_level,
      estimated_annual_value,
      potential_events_per_year,
      relevant_services,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
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
    payload.linked_contact_id,
    payload.relationship_grade,
    payload.warmth_level,
    payload.estimated_annual_value,
    payload.potential_events_per_year,
    payload.relevant_services
  ).run();

  const created = await getStrategicContactForTenant(env, tenantId, result.meta.last_row_id);
  return { success: true, strategic_contact: created };
}

async function deleteStrategicContact(env, tenantId, id) {
  const existing = await getStrategicContactForTenant(env, tenantId, id);
  if (!existing) return json({ error: 'קשר אסטרטגי לא נמצא' }, 404);

  await env.DB.batch([
    env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE strategic_contact_id = ? AND tenant_id = ?').bind(id, tenantId),
    env.DB.prepare('DELETE FROM strategic_contact_activities WHERE strategic_contact_id = ? AND tenant_id = ?').bind(id, tenantId),
    env.DB.prepare('DELETE FROM strategic_contacts WHERE id = ? AND tenant_id = ?').bind(id, tenantId)
  ]);

  return { success: true };
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
      relationship_grade = ?,
      warmth_level = ?,
      estimated_annual_value = ?,
      potential_events_per_year = ?,
      relevant_services = ?,
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
    payload.relationship_grade,
    payload.warmth_level,
    payload.estimated_annual_value,
    payload.potential_events_per_year,
    payload.relevant_services,
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

  if (path === '/api/strategic-contacts/attributions' && method === 'GET') {
    return listStrategicContactAttributions(request, env, tenantId, null);
  }

  const businessSummaryMatch = path.match(/^\/api\/strategic-contacts\/(\d+)\/business-summary$/);
  if (businessSummaryMatch && method === 'GET') {
    return getStrategicContactBusinessSummary(env, tenantId, Number(businessSummaryMatch[1]));
  }

  const attributionCollectionMatch = path.match(/^\/api\/strategic-contacts\/(\d+)\/attributions$/);
  if (attributionCollectionMatch && method === 'GET') {
    return listStrategicContactAttributions(request, env, tenantId, Number(attributionCollectionMatch[1]));
  }

  if (attributionCollectionMatch && method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return createStrategicContactAttribution(request, env, tenantCtx, Number(attributionCollectionMatch[1]));
  }

  const attributionItemMatch = path.match(/^\/api\/strategic-contacts\/(\d+)\/attributions\/(\d+)$/);
  if (attributionItemMatch && method === 'PUT') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return updateStrategicContactAttribution(request, env, tenantCtx, Number(attributionItemMatch[1]), Number(attributionItemMatch[2]));
  }

  const activitiesMatch = path.match(/^\/api\/strategic-contacts\/(\d+)\/activities$/);
  if (activitiesMatch && method === 'GET') {
    return listStrategicContactActivities(env, tenantId, Number(activitiesMatch[1]));
  }

  if (activitiesMatch && method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return createStrategicContactActivity(request, env, tenantCtx, Number(activitiesMatch[1]));
  }

  const markContactedMatch = path.match(/^\/api\/strategic-contacts\/(\d+)\/mark-contacted$/);
  if (markContactedMatch && method === 'POST') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;
    return markStrategicContactContacted(request, env, tenantCtx, Number(markContactedMatch[1]));
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

  if (idMatch && method === 'DELETE') {
    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;
    return deleteStrategicContact(env, tenantId, Number(idMatch[1]));
  }

  return json({ error: 'Strategic contacts route not found' }, 404);
}
