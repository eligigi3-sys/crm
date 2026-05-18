import { requireTenantContext, assertTenantRole } from './auth.js';

const BUSINESS_TYPES = new Set(['licensed_dealer', 'exempt_dealer', 'company']);
const VAT_MODES = new Set(['standard', 'exempt']);
const DEFAULT_STANDARD_VAT_RATE = 18;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeLogoValue(value) {
  const text = normalizeOptionalText(value);
  if (!text) return null;
  if (text.length > 800000) throw new Error('קובץ הלוגו גדול מדי אחרי דחיסה. נסה תמונה קטנה יותר');
  if (text.startsWith('data:')) {
    if (!/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(text)) throw new Error('קובץ לוגו לא תקין');
    return text;
  }
  return text;
}

function normalizeBusinessType(value) {
  const businessType = String(value || 'licensed_dealer').trim().toLowerCase();
  if (!BUSINESS_TYPES.has(businessType)) {
    throw new Error('סוג עסק לא תקין');
  }
  return businessType;
}

function normalizeVatMode(value, businessType) {
  if (businessType === 'exempt_dealer') return 'exempt';
  const vatMode = String(value || 'standard').trim().toLowerCase();
  if (!VAT_MODES.has(vatMode)) {
    throw new Error('מצב מע״מ לא תקין');
  }
  return vatMode;
}

function normalizeVatRate(value, vatMode, businessType) {
  if (businessType === 'exempt_dealer' || vatMode === 'exempt') return 0;
  if (value === undefined || value === null || value === '') return DEFAULT_STANDARD_VAT_RATE;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error('אחוז מע״מ לא תקין');
  }
  return Math.round(numberValue * 100) / 100;
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function mapSettings(row, tenant) {
  const businessType = normalizeBusinessType(row && row.business_type);
  const vatMode = normalizeVatMode(row && row.vat_mode, businessType);
  const defaultVatRate = normalizeVatRate(row && row.default_vat_rate, vatMode, businessType);
  const tenantName = tenant && tenant.name ? tenant.name : null;
  const tenantPhone = tenant && tenant.contact_phone ? tenant.contact_phone : null;
  const tenantEmail = tenant && tenant.contact_email ? tenant.contact_email : null;

  return {
    id: row && row.id ? row.id : null,
    tenant_id: tenant && tenant.id ? tenant.id : (row && row.tenant_id ? row.tenant_id : null),
    business_legal_name: (row && row.business_legal_name) || tenantName,
    business_display_name: (row && row.business_display_name) || (row && row.business_legal_name) || tenantName,
    business_tax_id: row && row.business_tax_id ? row.business_tax_id : null,
    business_type: businessType,
    vat_mode: vatMode,
    default_vat_rate: defaultVatRate,
    business_address: row && row.business_address ? row.business_address : null,
    business_phone: (row && row.business_phone) || tenantPhone,
    business_email: (row && row.business_email) || tenantEmail,
    logo_url: row && row.logo_url ? row.logo_url : null,
    default_payment_terms: row && row.default_payment_terms ? row.default_payment_terms : null,
    default_cancellation_policy: row && row.default_cancellation_policy ? row.default_cancellation_policy : null,
    default_document_footer: row && row.default_document_footer ? row.default_document_footer : null,
    default_notes: row && row.default_notes ? row.default_notes : null,
    created_at: row && row.created_at ? row.created_at : null,
    updated_at: row && row.updated_at ? row.updated_at : null,
    source: row && row.id ? 'row' : 'defaults'
  };
}

async function getTenantForSettings(tenantId, env) {
  return env.DB.prepare(
    `SELECT id, name, contact_phone, contact_email
     FROM tenants
     WHERE id = ?
     LIMIT 1`
  ).bind(tenantId).first();
}

export async function getTenantBusinessSettings(tenantId, env) {
  const tenant = await getTenantForSettings(tenantId, env);
  if (!tenant) throw new Error('העסק לא נמצא');
  const row = await env.DB.prepare(
    `SELECT *
     FROM tenant_business_settings
     WHERE tenant_id = ?
     LIMIT 1`
  ).bind(tenantId).first();
  return mapSettings(row, tenant);
}

function normalizeSettingsPayload(body, tenant) {
  const businessType = normalizeBusinessType(body && body.business_type);
  const vatMode = normalizeVatMode(body && body.vat_mode, businessType);
  const defaultVatRate = normalizeVatRate(body && body.default_vat_rate, vatMode, businessType);
  const tenantName = tenant && tenant.name ? tenant.name : null;

  return {
    business_legal_name: normalizeOptionalText(body && body.business_legal_name) || tenantName,
    business_display_name: normalizeOptionalText(body && body.business_display_name) || normalizeOptionalText(body && body.business_legal_name) || tenantName,
    business_tax_id: normalizeOptionalText(body && body.business_tax_id),
    business_type: businessType,
    vat_mode: vatMode,
    default_vat_rate: defaultVatRate,
    business_address: normalizeOptionalText(body && body.business_address),
    business_phone: normalizeOptionalText(body && body.business_phone) || (tenant && tenant.contact_phone) || null,
    business_email: normalizeOptionalText(body && body.business_email) || (tenant && tenant.contact_email) || null,
    logo_url: normalizeLogoValue(body && body.logo_url),
    default_payment_terms: normalizeOptionalText(body && body.default_payment_terms),
    default_cancellation_policy: normalizeOptionalText(body && body.default_cancellation_policy),
    default_document_footer: normalizeOptionalText(body && body.default_document_footer),
    default_notes: normalizeOptionalText(body && body.default_notes)
  };
}

async function updateTenantBusinessSettings(request, env, tenantCtx) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenant = await getTenantForSettings(tenantCtx.tenant.id, env);
  if (!tenant) throw new Error('העסק לא נמצא');
  const payload = normalizeSettingsPayload(body, tenant);

  await env.DB.prepare(
    `INSERT INTO tenant_business_settings (
       tenant_id,
       business_legal_name,
       business_display_name,
       business_tax_id,
       business_type,
       vat_mode,
       default_vat_rate,
       business_address,
       business_phone,
       business_email,
       logo_url,
       default_payment_terms,
       default_cancellation_policy,
       default_document_footer,
       default_notes,
       created_at,
       updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT(tenant_id) DO UPDATE SET
       business_legal_name = excluded.business_legal_name,
       business_display_name = excluded.business_display_name,
       business_tax_id = excluded.business_tax_id,
       business_type = excluded.business_type,
       vat_mode = excluded.vat_mode,
       default_vat_rate = excluded.default_vat_rate,
       business_address = excluded.business_address,
       business_phone = excluded.business_phone,
       business_email = excluded.business_email,
       logo_url = excluded.logo_url,
       default_payment_terms = excluded.default_payment_terms,
       default_cancellation_policy = excluded.default_cancellation_policy,
       default_document_footer = excluded.default_document_footer,
       default_notes = excluded.default_notes,
       updated_at = CURRENT_TIMESTAMP`
  ).bind(
    tenantCtx.tenant.id,
    payload.business_legal_name,
    payload.business_display_name,
    payload.business_tax_id,
    payload.business_type,
    payload.vat_mode,
    payload.default_vat_rate,
    payload.business_address,
    payload.business_phone,
    payload.business_email,
    payload.logo_url,
    payload.default_payment_terms,
    payload.default_cancellation_policy,
    payload.default_document_footer,
    payload.default_notes
  ).run();

  return { success: true, settings: await getTenantBusinessSettings(tenantCtx.tenant.id, env) };
}

export async function handleTenantBusinessSettings(request, env, path) {
  const method = request.method;
  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  if (path === '/api/tenant-business-settings' && method === 'GET') {
    return { settings: await getTenantBusinessSettings(tenantCtx.tenant.id, env) };
  }

  if (path === '/api/tenant-business-settings' && method === 'PUT') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (access instanceof Response) return access;
    return updateTenantBusinessSettings(request, env, tenantCtx);
  }

  return json({ error: 'Tenant business settings route not found' }, 404);
}
