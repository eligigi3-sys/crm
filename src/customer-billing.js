import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

const VAT_TREATMENTS = new Set(['standard', 'exempt', 'reverse_charge', 'foreign', 'custom']);
const CREDIT_STATUSES = new Set(['normal', 'watch', 'blocked']);
const ADDRESS_TYPES = new Set(['billing', 'shipping', 'service', 'event', 'other']);
const CONTACT_ROLE_TYPES = new Set(['main', 'finance', 'assistant', 'onsite', 'producer', 'other']);

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
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

function normalizeEnum(value, allowed, fallback, label) {
  const text = String(value || fallback || '').trim().toLowerCase();
  if (!allowed.has(text)) throw new Error(label + ' לא תקין');
  return text;
}

function normalizeBoolean(value, fallback = 0, label = 'ערך') {
  if (value === undefined || value === null || value === '') return fallback ? 1 : 0;
  if (value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true') return 1;
  if (value === false || value === 0 || value === '0' || String(value).toLowerCase() === 'false') return 0;
  throw new Error(label + ' לא תקין');
}

function normalizeNonNegativeNumber(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) throw new Error(label + ' לא תקין');
  return Math.round(numberValue * 100) / 100;
}

function normalizePercent(value, fallback, label) {
  const numberValue = normalizeNonNegativeNumber(value, fallback, label);
  if (numberValue > 100) throw new Error(label + ' לא יכול להיות מעל 100');
  return numberValue;
}

function normalizeNullablePositiveInteger(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) throw new Error(label + ' לא תקין');
  return numberValue;
}

function normalizeCurrency(value) {
  const text = normalizeOptionalText(value) || 'ILS';
  const currency = text.toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('מטבע לא תקין');
  return currency;
}

function normalizeJsonText(value, label) {
  if (value === undefined || value === null || value === '') return null;
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return JSON.stringify(value);
  const text = String(value).trim();
  if (!text) return null;
  try {
    JSON.parse(text);
  } catch {
    throw new Error(label + ' חייב להיות JSON תקין');
  }
  return text;
}

async function getContactForTenant(contactId, tenantId, env) {
  return env.DB.prepare(
    `SELECT id, tenant_id, name, phone, email
     FROM contacts
     WHERE id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(contactId, tenantId).first();
}

async function requireContactForTenant(contactId, tenantId, env) {
  const contact = await getContactForTenant(contactId, tenantId, env);
  if (!contact) throw new Error('לקוח לא נמצא');
  return contact;
}

async function validateAddressReference(addressId, contactId, tenantId, env, label) {
  if (!addressId) return null;
  const row = await env.DB.prepare(
    `SELECT id
     FROM customer_addresses
     WHERE id = ?
       AND contact_id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(addressId, contactId, tenantId).first();
  if (!row) throw new Error(label + ' לא נמצא ללקוח');
  return addressId;
}

async function validateContactPersonReference(personId, contactId, tenantId, env, label) {
  if (!personId) return null;
  const row = await env.DB.prepare(
    `SELECT id
     FROM customer_contact_people
     WHERE id = ?
       AND contact_id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(personId, contactId, tenantId).first();
  if (!row) throw new Error(label + ' לא נמצא ללקוח');
  return personId;
}

async function applyDefaultAddressFlags(env, tenantId, contactId, addressId, payload) {
  if (payload.is_default_billing) {
    await env.DB.prepare(
      `UPDATE customer_addresses
       SET is_default_billing = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, addressId).run();
  }
  if (payload.is_default_service) {
    await env.DB.prepare(
      `UPDATE customer_addresses
       SET is_default_service = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, addressId).run();
  }
  if (payload.is_default_shipping) {
    await env.DB.prepare(
      `UPDATE customer_addresses
       SET is_default_shipping = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, addressId).run();
  }
}

async function applyDefaultContactPersonFlags(env, tenantId, contactId, personId, payload) {
  if (payload.is_primary) {
    await env.DB.prepare(
      `UPDATE customer_contact_people
       SET is_primary = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, personId).run();
  }
  if (payload.is_finance) {
    await env.DB.prepare(
      `UPDATE customer_contact_people
       SET is_finance = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, personId).run();
  }
  if (payload.is_document_recipient) {
    await env.DB.prepare(
      `UPDATE customer_contact_people
       SET is_document_recipient = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND contact_id = ?
         AND id != ?`
    ).bind(tenantId, contactId, personId).run();
  }
}

function mapProfile(row, contact) {
  if (row) return row;
  return {
    id: null,
    tenant_id: contact.tenant_id,
    contact_id: contact.id,
    billing_name: contact.name || null,
    tax_id: null,
    invoice_recipient_name: contact.name || null,
    invoice_recipient_email: contact.email || null,
    invoice_recipient_phone: contact.phone || null,
    preferred_currency: 'ILS',
    payment_terms: null,
    default_notes: null,
    default_document_footer: null,
    billing_tags_json: null,
    vat_treatment: 'standard',
    default_vat_rate: null,
    vat_exemption_reason: null,
    credit_limit: 0,
    credit_status: 'normal',
    credit_notes: null,
    default_discount_percent: 0,
    default_discount_amount: 0,
    pricing_notes: null,
    default_billing_address_id: null,
    default_service_address_id: null,
    default_finance_contact_id: null,
    created_at: null,
    updated_at: null,
    source: 'defaults'
  };
}

async function getBillingProfile(env, tenantId, contactId) {
  return env.DB.prepare(
    `SELECT *
     FROM customer_billing_profiles
     WHERE tenant_id = ?
       AND contact_id = ?
     LIMIT 1`
  ).bind(tenantId, contactId).first();
}

async function handleGetBillingProfile(env, tenantCtx, contactId) {
  const tenantId = tenantCtx.tenant.id;
  const contact = await requireContactForTenant(contactId, tenantId, env);
  const row = await getBillingProfile(env, tenantId, contactId);
  return { profile: mapProfile(row, contact) };
}

async function normalizeBillingProfilePayload(body, contactId, tenantId, env) {
  return {
    billing_name: normalizeOptionalText(body.billing_name),
    tax_id: normalizeOptionalText(body.tax_id),
    invoice_recipient_name: normalizeOptionalText(body.invoice_recipient_name),
    invoice_recipient_email: normalizeOptionalText(body.invoice_recipient_email),
    invoice_recipient_phone: normalizeOptionalText(body.invoice_recipient_phone),
    preferred_currency: normalizeCurrency(body.preferred_currency),
    payment_terms: normalizeOptionalText(body.payment_terms),
    default_notes: normalizeOptionalText(body.default_notes),
    default_document_footer: normalizeOptionalText(body.default_document_footer),
    billing_tags_json: normalizeJsonText(body.billing_tags_json, 'תגיות חיוב'),
    vat_treatment: normalizeEnum(body.vat_treatment, VAT_TREATMENTS, 'standard', 'טיפול מע״מ'),
    default_vat_rate: body.default_vat_rate === undefined || body.default_vat_rate === null || body.default_vat_rate === '' ? null : normalizePercent(body.default_vat_rate, 0, 'אחוז מע״מ'),
    vat_exemption_reason: normalizeOptionalText(body.vat_exemption_reason),
    credit_limit: normalizeNonNegativeNumber(body.credit_limit, 0, 'מסגרת אשראי'),
    credit_status: normalizeEnum(body.credit_status, CREDIT_STATUSES, 'normal', 'סטטוס אשראי'),
    credit_notes: normalizeOptionalText(body.credit_notes),
    default_discount_percent: normalizePercent(body.default_discount_percent, 0, 'אחוז הנחה'),
    default_discount_amount: normalizeNonNegativeNumber(body.default_discount_amount, 0, 'סכום הנחה'),
    pricing_notes: normalizeOptionalText(body.pricing_notes),
    default_billing_address_id: await validateAddressReference(normalizeNullablePositiveInteger(body.default_billing_address_id, 'כתובת ברירת מחדל לחיוב'), contactId, tenantId, env, 'כתובת ברירת מחדל לחיוב'),
    default_service_address_id: await validateAddressReference(normalizeNullablePositiveInteger(body.default_service_address_id, 'כתובת שירות ברירת מחדל'), contactId, tenantId, env, 'כתובת שירות ברירת מחדל'),
    default_finance_contact_id: await validateContactPersonReference(normalizeNullablePositiveInteger(body.default_finance_contact_id, 'איש קשר פיננסי'), contactId, tenantId, env, 'איש קשר פיננסי')
  };
}

async function handlePutBillingProfile(request, env, tenantCtx, contactId) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const payload = await normalizeBillingProfilePayload(body, contactId, tenantId, env);

  await env.DB.prepare(
    `INSERT INTO customer_billing_profiles (
       tenant_id,
       contact_id,
       billing_name,
       tax_id,
       invoice_recipient_name,
       invoice_recipient_email,
       invoice_recipient_phone,
       preferred_currency,
       payment_terms,
       default_notes,
       default_document_footer,
       billing_tags_json,
       vat_treatment,
       default_vat_rate,
       vat_exemption_reason,
       credit_limit,
       credit_status,
       credit_notes,
       default_discount_percent,
       default_discount_amount,
       pricing_notes,
       default_billing_address_id,
       default_service_address_id,
       default_finance_contact_id,
       created_at,
       updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(tenant_id, contact_id) DO UPDATE SET
       billing_name = excluded.billing_name,
       tax_id = excluded.tax_id,
       invoice_recipient_name = excluded.invoice_recipient_name,
       invoice_recipient_email = excluded.invoice_recipient_email,
       invoice_recipient_phone = excluded.invoice_recipient_phone,
       preferred_currency = excluded.preferred_currency,
       payment_terms = excluded.payment_terms,
       default_notes = excluded.default_notes,
       default_document_footer = excluded.default_document_footer,
       billing_tags_json = excluded.billing_tags_json,
       vat_treatment = excluded.vat_treatment,
       default_vat_rate = excluded.default_vat_rate,
       vat_exemption_reason = excluded.vat_exemption_reason,
       credit_limit = excluded.credit_limit,
       credit_status = excluded.credit_status,
       credit_notes = excluded.credit_notes,
       default_discount_percent = excluded.default_discount_percent,
       default_discount_amount = excluded.default_discount_amount,
       pricing_notes = excluded.pricing_notes,
       default_billing_address_id = excluded.default_billing_address_id,
       default_service_address_id = excluded.default_service_address_id,
       default_finance_contact_id = excluded.default_finance_contact_id,
       updated_at = CURRENT_TIMESTAMP`
  ).bind(
    tenantId,
    contactId,
    payload.billing_name,
    payload.tax_id,
    payload.invoice_recipient_name,
    payload.invoice_recipient_email,
    payload.invoice_recipient_phone,
    payload.preferred_currency,
    payload.payment_terms,
    payload.default_notes,
    payload.default_document_footer,
    payload.billing_tags_json,
    payload.vat_treatment,
    payload.default_vat_rate,
    payload.vat_exemption_reason,
    payload.credit_limit,
    payload.credit_status,
    payload.credit_notes,
    payload.default_discount_percent,
    payload.default_discount_amount,
    payload.pricing_notes,
    payload.default_billing_address_id,
    payload.default_service_address_id,
    payload.default_finance_contact_id
  ).run();

  return { success: true, profile: await getBillingProfile(env, tenantId, contactId) };
}

function normalizeAddressPayload(body, existing = {}) {
  return {
    label: body.label !== undefined ? normalizeOptionalText(body.label) : existing.label || null,
    address_type: body.address_type !== undefined ? normalizeEnum(body.address_type, ADDRESS_TYPES, 'billing', 'סוג כתובת') : existing.address_type || 'billing',
    full_address: body.full_address !== undefined ? normalizeOptionalText(body.full_address) : existing.full_address || null,
    street: body.street !== undefined ? normalizeOptionalText(body.street) : existing.street || null,
    city: body.city !== undefined ? normalizeOptionalText(body.city) : existing.city || null,
    region: body.region !== undefined ? normalizeOptionalText(body.region) : existing.region || null,
    postal_code: body.postal_code !== undefined ? normalizeOptionalText(body.postal_code) : existing.postal_code || null,
    country: body.country !== undefined ? (normalizeOptionalText(body.country) || 'IL').toUpperCase() : existing.country || 'IL',
    is_default_billing: body.is_default_billing !== undefined ? normalizeBoolean(body.is_default_billing, 0, 'ברירת מחדל לחיוב') : Number(existing.is_default_billing || 0),
    is_default_service: body.is_default_service !== undefined ? normalizeBoolean(body.is_default_service, 0, 'ברירת מחדל לשירות') : Number(existing.is_default_service || 0),
    is_default_shipping: body.is_default_shipping !== undefined ? normalizeBoolean(body.is_default_shipping, 0, 'ברירת מחדל למשלוח') : Number(existing.is_default_shipping || 0),
    notes: body.notes !== undefined ? normalizeOptionalText(body.notes) : existing.notes || null,
    active: body.active !== undefined ? normalizeBoolean(body.active, 1, 'פעיל') : (existing.active === undefined ? 1 : Number(existing.active))
  };
}

async function handleListAddresses(env, tenantCtx, contactId) {
  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const result = await env.DB.prepare(
    `SELECT *
     FROM customer_addresses
     WHERE tenant_id = ?
       AND contact_id = ?
     ORDER BY active DESC, is_default_billing DESC, is_default_service DESC, address_type ASC, id ASC`
  ).bind(tenantId, contactId).all();
  return { addresses: result.results || [] };
}

async function handleCreateAddress(request, env, tenantCtx, contactId) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const payload = normalizeAddressPayload(body);

  const result = await env.DB.prepare(
    `INSERT INTO customer_addresses (
       tenant_id,
       contact_id,
       label,
       address_type,
       full_address,
       street,
       city,
       region,
       postal_code,
       country,
       is_default_billing,
       is_default_service,
       is_default_shipping,
       notes,
       active,
       created_at,
       updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    contactId,
    payload.label,
    payload.address_type,
    payload.full_address,
    payload.street,
    payload.city,
    payload.region,
    payload.postal_code,
    payload.country,
    payload.is_default_billing,
    payload.is_default_service,
    payload.is_default_shipping,
    payload.notes,
    payload.active
  ).run();

  const addressId = result.meta.last_row_id;
  await applyDefaultAddressFlags(env, tenantId, contactId, addressId, payload);
  const address = await getAddressForTenant(env, tenantId, contactId, addressId);
  return { success: true, address };
}

async function getAddressForTenant(env, tenantId, contactId, addressId) {
  return env.DB.prepare(
    `SELECT *
     FROM customer_addresses
     WHERE id = ?
       AND tenant_id = ?
       AND contact_id = ?
     LIMIT 1`
  ).bind(addressId, tenantId, contactId).first();
}

async function handleUpdateAddress(request, env, tenantCtx, contactId, addressId) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const existing = await getAddressForTenant(env, tenantId, contactId, addressId);
  if (!existing) throw new Error('כתובת לא נמצאה');
  const payload = normalizeAddressPayload(body, existing);

  await env.DB.prepare(
    `UPDATE customer_addresses
     SET label = ?,
         address_type = ?,
         full_address = ?,
         street = ?,
         city = ?,
         region = ?,
         postal_code = ?,
         country = ?,
         is_default_billing = ?,
         is_default_service = ?,
         is_default_shipping = ?,
         notes = ?,
         active = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?
       AND contact_id = ?`
  ).bind(
    payload.label,
    payload.address_type,
    payload.full_address,
    payload.street,
    payload.city,
    payload.region,
    payload.postal_code,
    payload.country,
    payload.is_default_billing,
    payload.is_default_service,
    payload.is_default_shipping,
    payload.notes,
    payload.active,
    addressId,
    tenantId,
    contactId
  ).run();

  await applyDefaultAddressFlags(env, tenantId, contactId, addressId, payload);
  return { success: true, address: await getAddressForTenant(env, tenantId, contactId, addressId) };
}

function normalizeContactPersonPayload(body, existing = {}) {
  return {
    name: body.name !== undefined ? normalizeRequiredText(body.name, 'שם איש קשר') : normalizeRequiredText(existing.name, 'שם איש קשר'),
    role_type: body.role_type !== undefined ? normalizeEnum(body.role_type, CONTACT_ROLE_TYPES, 'main', 'תפקיד איש קשר') : existing.role_type || 'main',
    phone: body.phone !== undefined ? normalizeOptionalText(body.phone) : existing.phone || null,
    email: body.email !== undefined ? normalizeOptionalText(body.email) : existing.email || null,
    title: body.title !== undefined ? normalizeOptionalText(body.title) : existing.title || null,
    notes: body.notes !== undefined ? normalizeOptionalText(body.notes) : existing.notes || null,
    is_primary: body.is_primary !== undefined ? normalizeBoolean(body.is_primary, 0, 'איש קשר ראשי') : Number(existing.is_primary || 0),
    is_finance: body.is_finance !== undefined ? normalizeBoolean(body.is_finance, 0, 'איש קשר פיננסי') : Number(existing.is_finance || 0),
    is_document_recipient: body.is_document_recipient !== undefined ? normalizeBoolean(body.is_document_recipient, 0, 'נמען מסמכים') : Number(existing.is_document_recipient || 0),
    active: body.active !== undefined ? normalizeBoolean(body.active, 1, 'פעיל') : (existing.active === undefined ? 1 : Number(existing.active)),
    display_order: body.display_order !== undefined ? Number(body.display_order || 0) : Number(existing.display_order || 0)
  };
}

async function handleListContactPeople(env, tenantCtx, contactId) {
  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const result = await env.DB.prepare(
    `SELECT *
     FROM customer_contact_people
     WHERE tenant_id = ?
       AND contact_id = ?
     ORDER BY active DESC, is_primary DESC, is_finance DESC, is_document_recipient DESC, display_order ASC, id ASC`
  ).bind(tenantId, contactId).all();
  return { contact_people: result.results || [] };
}

async function getContactPersonForTenant(env, tenantId, contactId, personId) {
  return env.DB.prepare(
    `SELECT *
     FROM customer_contact_people
     WHERE id = ?
       AND tenant_id = ?
       AND contact_id = ?
     LIMIT 1`
  ).bind(personId, tenantId, contactId).first();
}

async function handleCreateContactPerson(request, env, tenantCtx, contactId) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const payload = normalizeContactPersonPayload(body);

  const result = await env.DB.prepare(
    `INSERT INTO customer_contact_people (
       tenant_id,
       contact_id,
       name,
       role_type,
       phone,
       email,
       title,
       notes,
       is_primary,
       is_finance,
       is_document_recipient,
       active,
       display_order,
       created_at,
       updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    contactId,
    payload.name,
    payload.role_type,
    payload.phone,
    payload.email,
    payload.title,
    payload.notes,
    payload.is_primary,
    payload.is_finance,
    payload.is_document_recipient,
    payload.active,
    payload.display_order
  ).run();

  const personId = result.meta.last_row_id;
  await applyDefaultContactPersonFlags(env, tenantId, contactId, personId, payload);
  return { success: true, contact_person: await getContactPersonForTenant(env, tenantId, contactId, personId) };
}

async function handleUpdateContactPerson(request, env, tenantCtx, contactId, personId) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  await requireContactForTenant(contactId, tenantId, env);
  const existing = await getContactPersonForTenant(env, tenantId, contactId, personId);
  if (!existing) throw new Error('איש קשר לא נמצא');
  const payload = normalizeContactPersonPayload(body, existing);

  await env.DB.prepare(
    `UPDATE customer_contact_people
     SET name = ?,
         role_type = ?,
         phone = ?,
         email = ?,
         title = ?,
         notes = ?,
         is_primary = ?,
         is_finance = ?,
         is_document_recipient = ?,
         active = ?,
         display_order = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?
       AND contact_id = ?`
  ).bind(
    payload.name,
    payload.role_type,
    payload.phone,
    payload.email,
    payload.title,
    payload.notes,
    payload.is_primary,
    payload.is_finance,
    payload.is_document_recipient,
    payload.active,
    payload.display_order,
    personId,
    tenantId,
    contactId
  ).run();

  await applyDefaultContactPersonFlags(env, tenantId, contactId, personId, payload);
  return { success: true, contact_person: await getContactPersonForTenant(env, tenantId, contactId, personId) };
}

export function isCustomerBillingRoute(path) {
  return /^\/api\/contacts\/\d+\/(billing-profile|addresses|contact-people)(\/\d+)?$/.test(path);
}

export async function handleCustomerBilling(request, env, path) {
  const method = request.method;
  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
  if (moduleState instanceof Response) return moduleState;

  const writeMethods = new Set(['POST', 'PUT']);
  if (writeMethods.has(method)) {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
  }

  const billingProfileMatch = path.match(/^\/api\/contacts\/(\d+)\/billing-profile$/);
  if (billingProfileMatch && method === 'GET') return handleGetBillingProfile(env, tenantCtx, Number(billingProfileMatch[1]));
  if (billingProfileMatch && method === 'PUT') return handlePutBillingProfile(request, env, tenantCtx, Number(billingProfileMatch[1]));

  const addressesMatch = path.match(/^\/api\/contacts\/(\d+)\/addresses$/);
  if (addressesMatch && method === 'GET') return handleListAddresses(env, tenantCtx, Number(addressesMatch[1]));
  if (addressesMatch && method === 'POST') return handleCreateAddress(request, env, tenantCtx, Number(addressesMatch[1]));

  const addressMatch = path.match(/^\/api\/contacts\/(\d+)\/addresses\/(\d+)$/);
  if (addressMatch && method === 'PUT') return handleUpdateAddress(request, env, tenantCtx, Number(addressMatch[1]), Number(addressMatch[2]));

  const contactPeopleMatch = path.match(/^\/api\/contacts\/(\d+)\/contact-people$/);
  if (contactPeopleMatch && method === 'GET') return handleListContactPeople(env, tenantCtx, Number(contactPeopleMatch[1]));
  if (contactPeopleMatch && method === 'POST') return handleCreateContactPerson(request, env, tenantCtx, Number(contactPeopleMatch[1]));

  const contactPersonMatch = path.match(/^\/api\/contacts\/(\d+)\/contact-people\/(\d+)$/);
  if (contactPersonMatch && method === 'PUT') return handleUpdateContactPerson(request, env, tenantCtx, Number(contactPersonMatch[1]), Number(contactPersonMatch[2]));

  return json({ error: 'Customer billing route not found' }, 404);
}
