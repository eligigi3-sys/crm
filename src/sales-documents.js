import { requireTenantContext, assertTenantRole } from './auth.js';
import { getTenantBusinessSettings } from './tenant-business-settings.js';

const DEFAULT_STANDARD_VAT_RATE = 18;

const DOCUMENT_TYPES = new Set(['quote', 'invoice']);
const DOCUMENT_STATUSES = new Set([
  'draft',
  'sent',
  'accepted',
  'rejected',
  'cancelled',
  'expired',
  'converted',
  'issued',
  'paid',
  'partially_paid',
  'void'
]);

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

function normalizeDocumentType(value) {
  const documentType = String(value || '').trim().toLowerCase();
  if (!DOCUMENT_TYPES.has(documentType)) {
    throw new Error('סוג מסמך לא תקין');
  }
  return documentType;
}

function normalizeStatus(value, fallback = 'draft') {
  const status = String(value || fallback).trim().toLowerCase();
  if (!DOCUMENT_STATUSES.has(status)) {
    throw new Error('סטטוס מסמך לא תקין');
  }
  return status;
}

function normalizeNullablePositiveInteger(value, label) {
  if (value === undefined || value === null || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    throw new Error(label + ' לא תקין');
  }
  return numberValue;
}

function normalizeNonNegativeNumber(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(label + ' לא תקין');
  }
  return roundMoney(numberValue);
}

function normalizePositiveNumber(value, fallback, label) {
  if (value === undefined || value === null || value === '') return fallback;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(label + ' לא תקין');
  }
  return roundMoney(numberValue);
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultPrefix(documentType) {
  return documentType === 'invoice' ? 'INV' : 'Q';
}

function formatDocumentNumber(documentType, numberValue, prefix, padding) {
  const safePrefix = normalizeOptionalText(prefix) || defaultPrefix(documentType);
  const safePadding = Number.isInteger(Number(padding)) && Number(padding) >= 0 ? Number(padding) : 6;
  return safePrefix + '-' + String(numberValue).padStart(safePadding, '0');
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function assertSalesDocumentsModuleEnabled(ctx, env) {
  const tenantId = ctx && ctx.tenant ? ctx.tenant.id : null;
  const row = await env.DB.prepare(
    `SELECT is_enabled
     FROM tenant_modules
     WHERE tenant_id = ?
       AND module_key = 'sales_documents'
     LIMIT 1`
  ).bind(tenantId).first();

  if (row && Number(row.is_enabled) !== 1) {
    return json({ error: 'Module disabled' }, 403);
  }

  return {
    module_key: 'sales_documents',
    is_enabled: true,
    source: row ? 'row' : 'default_enabled'
  };
}

async function getContactForTenant(contactId, tenantId, env) {
  if (!contactId) return null;
  return env.DB.prepare(
    `SELECT id, name, phone, email
     FROM contacts
     WHERE id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(contactId, tenantId).first();
}

async function getLeadForTenant(leadId, tenantId, env) {
  if (!leadId) return null;
  return env.DB.prepare(
    `SELECT id, contact_id, name, phone, email, event_type, event_date, event_time, venue, price
     FROM leads
     WHERE id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(leadId, tenantId).first();
}

async function getTenantForSnapshot(tenantId, env) {
  return env.DB.prepare(
    `SELECT id, name, contact_name, contact_phone, contact_email
     FROM tenants
     WHERE id = ?
     LIMIT 1`
  ).bind(tenantId).first();
}


async function getCustomerBillingProfileForSnapshot(contactId, tenantId, env) {
  if (!contactId) return null;
  return env.DB.prepare(
    `SELECT *
     FROM customer_billing_profiles
     WHERE contact_id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(contactId, tenantId).first();
}

async function getDefaultCustomerAddressForSnapshot(contactId, tenantId, env, preferredFlag, preferredAddressId) {
  if (!contactId) return null;
  const addressId = normalizeNullablePositiveInteger(preferredAddressId, 'כתובת');
  if (addressId) {
    const byId = await env.DB.prepare(
      `SELECT *
       FROM customer_addresses
       WHERE id = ?
         AND contact_id = ?
         AND tenant_id = ?
         AND active = 1
       LIMIT 1`
    ).bind(addressId, contactId, tenantId).first();
    if (byId) return byId;
  }
  const flagColumn = preferredFlag === 'service' ? 'is_default_service' : preferredFlag === 'shipping' ? 'is_default_shipping' : 'is_default_billing';
  const result = await env.DB.prepare(
    `SELECT *
     FROM customer_addresses
     WHERE contact_id = ?
       AND tenant_id = ?
       AND active = 1
     ORDER BY ${flagColumn} DESC,
              is_default_billing DESC,
              is_default_service DESC,
              address_type ASC,
              id ASC
     LIMIT 1`
  ).bind(contactId, tenantId).first();
  return result || null;
}

async function getDefaultCustomerPersonForSnapshot(contactId, tenantId, env, preferredFlag, preferredPersonId) {
  if (!contactId) return null;
  const personId = normalizeNullablePositiveInteger(preferredPersonId, 'איש קשר');
  if (personId) {
    const byId = await env.DB.prepare(
      `SELECT *
       FROM customer_contact_people
       WHERE id = ?
         AND contact_id = ?
         AND tenant_id = ?
         AND active = 1
       LIMIT 1`
    ).bind(personId, contactId, tenantId).first();
    if (byId) return byId;
  }
  const flagColumn = preferredFlag === 'finance' ? 'is_finance' : preferredFlag === 'document' ? 'is_document_recipient' : 'is_primary';
  const result = await env.DB.prepare(
    `SELECT *
     FROM customer_contact_people
     WHERE contact_id = ?
       AND tenant_id = ?
       AND active = 1
     ORDER BY ${flagColumn} DESC,
              is_document_recipient DESC,
              is_finance DESC,
              is_primary DESC,
              display_order ASC,
              id ASC
     LIMIT 1`
  ).bind(contactId, tenantId).first();
  return result || null;
}

function formatCustomerAddressForSnapshot(address) {
  if (!address) return null;
  return normalizeOptionalText(address.full_address) || [
    normalizeOptionalText(address.street),
    normalizeOptionalText(address.city),
    normalizeOptionalText(address.region),
    normalizeOptionalText(address.postal_code),
    normalizeOptionalText(address.country)
  ].filter(Boolean).join(', ') || null;
}

function formatCustomerPersonForSnapshot(person) {
  if (!person) return null;
  return [
    normalizeOptionalText(person.name),
    normalizeOptionalText(person.title),
    normalizeOptionalText(person.phone),
    normalizeOptionalText(person.email)
  ].filter(Boolean).join(' · ') || null;
}

async function getProductForTenant(productId, tenantId, env) {
  if (!productId) return null;
  return env.DB.prepare(
    `SELECT id, name, unit, sale_price
     FROM products
     WHERE id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(productId, tenantId).first();
}

async function getDocumentForTenant(documentId, tenantId, env) {
  return env.DB.prepare(
    `SELECT *
     FROM sales_documents
     WHERE id = ?
       AND tenant_id = ?
     LIMIT 1`
  ).bind(documentId, tenantId).first();
}

async function getDocumentItemsForTenant(documentId, tenantId, env) {
  const result = await env.DB.prepare(
    `SELECT *
     FROM sales_document_items
     WHERE document_id = ?
       AND tenant_id = ?
     ORDER BY line_order ASC, id ASC`
  ).bind(documentId, tenantId).all();
  return result.results || [];
}

function mapDocument(row, items) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    document_type: row.document_type,
    document_number: row.document_number,
    document_number_int: row.document_number_int,
    status: row.status,
    contact_id: row.contact_id || null,
    lead_id: row.lead_id || null,
    source_quote_id: row.source_quote_id || null,
    issue_date: row.issue_date || null,
    due_date: row.due_date || null,
    valid_until: row.valid_until || null,
    currency: row.currency,
    subtotal_amount: Number(row.subtotal_amount || 0),
    discount_amount: Number(row.discount_amount || 0),
    vat_rate: Number(row.vat_rate || 0),
    vat_amount: Number(row.vat_amount || 0),
    total_amount: Number(row.total_amount || 0),
    paid_amount: Number(row.paid_amount || 0),
    balance_amount: Number(row.balance_amount || 0),
    customer_name_snapshot: row.customer_name_snapshot || null,
    customer_phone_snapshot: row.customer_phone_snapshot || null,
    customer_email_snapshot: row.customer_email_snapshot || null,
    customer_address_snapshot: row.customer_address_snapshot || null,
    customer_tax_id: row.customer_tax_id || null,
    customer_billing_profile_id_snapshot: row.customer_billing_profile_id_snapshot || null,
    customer_billing_name_snapshot: row.customer_billing_name_snapshot || null,
    customer_invoice_recipient_name_snapshot: row.customer_invoice_recipient_name_snapshot || null,
    customer_invoice_recipient_email_snapshot: row.customer_invoice_recipient_email_snapshot || null,
    customer_invoice_recipient_phone_snapshot: row.customer_invoice_recipient_phone_snapshot || null,
    customer_billing_address_id_snapshot: row.customer_billing_address_id_snapshot || null,
    customer_billing_address_snapshot: row.customer_billing_address_snapshot || null,
    customer_service_address_id_snapshot: row.customer_service_address_id_snapshot || null,
    customer_service_address_snapshot: row.customer_service_address_snapshot || null,
    customer_document_contact_id_snapshot: row.customer_document_contact_id_snapshot || null,
    customer_document_contact_snapshot: row.customer_document_contact_snapshot || null,
    customer_finance_contact_id_snapshot: row.customer_finance_contact_id_snapshot || null,
    customer_finance_contact_snapshot: row.customer_finance_contact_snapshot || null,
    customer_vat_treatment_hint: row.customer_vat_treatment_hint || null,
    customer_credit_status_snapshot: row.customer_credit_status_snapshot || null,
    customer_credit_notes_snapshot: row.customer_credit_notes_snapshot || null,
    customer_default_discount_percent: Number(row.customer_default_discount_percent || 0),
    customer_default_discount_amount: Number(row.customer_default_discount_amount || 0),
    business_name_snapshot: row.business_name_snapshot || null,
    business_phone_snapshot: row.business_phone_snapshot || null,
    business_email_snapshot: row.business_email_snapshot || null,
    business_address_snapshot: row.business_address_snapshot || null,
    business_tax_id: row.business_tax_id || null,
    business_legal_name_snapshot: row.business_legal_name_snapshot || null,
    business_display_name_snapshot: row.business_display_name_snapshot || null,
    business_type_snapshot: row.business_type_snapshot || null,
    vat_mode_snapshot: row.vat_mode_snapshot || null,
    default_vat_rate_snapshot: Number(row.default_vat_rate_snapshot || 0),
    business_logo_url_snapshot: row.business_logo_url_snapshot || null,
    payment_terms_snapshot: row.payment_terms_snapshot || null,
    cancellation_policy_snapshot: row.cancellation_policy_snapshot || null,
    document_footer_snapshot: row.document_footer_snapshot || null,
    tax_allocation_number: row.tax_allocation_number || null,
    tax_allocation_status: row.tax_allocation_status || null,
    tax_allocation_requested_at: row.tax_allocation_requested_at || null,
    tax_allocation_response_json: row.tax_allocation_response_json || null,
    notes: row.notes || null,
    terms: row.terms || null,
    internal_notes: row.internal_notes || null,
    created_by_user_id: row.created_by_user_id || null,
    updated_by_user_id: row.updated_by_user_id || null,
    issued_by_user_id: row.issued_by_user_id || null,
    locked_by_user_id: row.locked_by_user_id || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
    issued_at: row.issued_at || null,
    sent_at: row.sent_at || null,
    accepted_at: row.accepted_at || null,
    cancelled_at: row.cancelled_at || null,
    voided_at: row.voided_at || null,
    locked_at: row.locked_at || null,
    items: Array.isArray(items) ? items.map(mapDocumentItem) : undefined
  };
}

function mapDocumentItem(row) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    document_id: row.document_id,
    line_order: row.line_order,
    product_id: row.product_id || null,
    description: row.description,
    quantity: Number(row.quantity || 0),
    unit: row.unit || null,
    unit_price: Number(row.unit_price || 0),
    discount_amount: Number(row.discount_amount || 0),
    vat_rate: Number(row.vat_rate || 0),
    vat_amount: Number(row.vat_amount || 0),
    line_subtotal: Number(row.line_subtotal || 0),
    line_total: Number(row.line_total || 0),
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
  };
}

async function normalizeItems(rawItems, tenantId, env, businessSettings) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  if (items.length === 0) {
    throw new Error('נדרשת לפחות שורת מסמך אחת');
  }

  const normalizedItems = [];
  for (let index = 0; index < items.length; index += 1) {
    const rawItem = items[index] || {};
    const productId = normalizeNullablePositiveInteger(rawItem.product_id, 'מוצר');
    const product = await getProductForTenant(productId, tenantId, env);
    if (productId && !product) {
      throw new Error('המוצר לא נמצא');
    }

    const description = normalizeOptionalText(rawItem.description) || (product ? product.name : null);
    if (!description) {
      throw new Error('תיאור שורה חובה');
    }

    const quantity = normalizePositiveNumber(rawItem.quantity, 1, 'כמות');
    const unitPrice = normalizeNonNegativeNumber(
      rawItem.unit_price !== undefined ? rawItem.unit_price : (product ? product.sale_price : 0),
      0,
      'מחיר יחידה'
    );
    const discountAmount = normalizeNonNegativeNumber(rawItem.discount_amount, 0, 'הנחה');
    const isVatExempt = businessSettings && businessSettings.vat_mode === 'exempt';
    const defaultVatRate = businessSettings && Number.isFinite(Number(businessSettings.default_vat_rate))
      ? Number(businessSettings.default_vat_rate)
      : DEFAULT_STANDARD_VAT_RATE;
    const vatRate = isVatExempt ? 0 : normalizeNonNegativeNumber(rawItem.vat_rate, defaultVatRate, 'מע״מ');
    const grossLineSubtotal = roundMoney(quantity * unitPrice);
    if (discountAmount > grossLineSubtotal) {
      throw new Error('הנחת שורה לא יכולה להיות גבוהה מסכום השורה');
    }
    const lineSubtotal = roundMoney(grossLineSubtotal - discountAmount);
    const vatAmount = roundMoney(lineSubtotal * vatRate / 100);
    const lineTotal = roundMoney(lineSubtotal + vatAmount);

    normalizedItems.push({
      line_order: Number.isInteger(Number(rawItem.line_order)) && Number(rawItem.line_order) > 0 ? Number(rawItem.line_order) : index + 1,
      product_id: productId,
      description,
      quantity,
      unit: normalizeOptionalText(rawItem.unit) || (product ? product.unit : null),
      unit_price: unitPrice,
      discount_amount: discountAmount,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      line_subtotal: lineSubtotal,
      line_total: lineTotal,
      gross_line_subtotal: grossLineSubtotal
    });
  }

  return normalizedItems;
}

function calculateTotals(items, paidAmountValue) {
  const subtotalAmount = roundMoney(items.reduce(function(sum, item) {
    return sum + item.gross_line_subtotal;
  }, 0));
  const discountAmount = roundMoney(items.reduce(function(sum, item) {
    return sum + item.discount_amount;
  }, 0));
  const vatAmount = roundMoney(items.reduce(function(sum, item) {
    return sum + item.vat_amount;
  }, 0));
  const totalAmount = roundMoney(items.reduce(function(sum, item) {
    return sum + item.line_total;
  }, 0));
  const paidAmount = normalizeNonNegativeNumber(paidAmountValue, 0, 'סכום ששולם');
  if (paidAmount > totalAmount) {
    throw new Error('סכום ששולם לא יכול להיות גבוה מסך המסמך');
  }
  const balanceAmount = roundMoney(totalAmount - paidAmount);
  const vatRate = items.length > 0 && items.every(function(item) { return item.vat_rate === items[0].vat_rate; })
    ? items[0].vat_rate
    : 0;

  return {
    subtotal_amount: subtotalAmount,
    discount_amount: discountAmount,
    vat_rate: vatRate,
    vat_amount: vatAmount,
    total_amount: totalAmount,
    paid_amount: paidAmount,
    balance_amount: balanceAmount
  };
}

async function buildSnapshot(body, tenantId, env, businessSettings) {
  const contactId = normalizeNullablePositiveInteger(body.contact_id, 'לקוח');
  const leadId = normalizeNullablePositiveInteger(body.lead_id, 'אירוע');
  const sourceQuoteId = normalizeNullablePositiveInteger(body.source_quote_id, 'הצעת מקור');

  const lead = await getLeadForTenant(leadId, tenantId, env);
  if (leadId && !lead) throw new Error('האירוע לא נמצא');

  const effectiveContactId = contactId || (lead && lead.contact_id ? Number(lead.contact_id) : null);
  const contact = await getContactForTenant(effectiveContactId, tenantId, env);
  if (effectiveContactId && !contact) throw new Error('הלקוח לא נמצא');

  const tenant = await getTenantForSnapshot(tenantId, env);
  const settings = businessSettings || await getTenantBusinessSettings(tenantId, env);
  const billingProfile = await getCustomerBillingProfileForSnapshot(effectiveContactId, tenantId, env);
  const billingAddress = await getDefaultCustomerAddressForSnapshot(
    effectiveContactId,
    tenantId,
    env,
    'billing',
    body.customer_billing_address_id_snapshot || body.sales_document_billing_address_id || (billingProfile && billingProfile.default_billing_address_id)
  );
  const serviceAddress = await getDefaultCustomerAddressForSnapshot(
    effectiveContactId,
    tenantId,
    env,
    'service',
    body.customer_service_address_id_snapshot || body.sales_document_service_address_id || (billingProfile && billingProfile.default_service_address_id)
  );
  const invoicePerson = await getDefaultCustomerPersonForSnapshot(
    effectiveContactId,
    tenantId,
    env,
    'document',
    body.customer_document_contact_id_snapshot || body.sales_document_document_contact_id
  );
  const financePerson = await getDefaultCustomerPersonForSnapshot(
    effectiveContactId,
    tenantId,
    env,
    'finance',
    body.customer_finance_contact_id_snapshot || body.sales_document_finance_contact_id || (billingProfile && billingProfile.default_finance_contact_id)
  );
  const defaultNotes = normalizeOptionalText(billingProfile && billingProfile.default_notes) || normalizeOptionalText(settings.default_notes);
  const defaultPaymentTerms = normalizeOptionalText(billingProfile && billingProfile.payment_terms) || normalizeOptionalText(settings.default_payment_terms);
  const defaultFooter = normalizeOptionalText(billingProfile && billingProfile.default_document_footer) || normalizeOptionalText(settings.default_document_footer);
  const defaultTerms = [
    defaultPaymentTerms,
    normalizeOptionalText(settings.default_cancellation_policy)
  ].filter(Boolean).join('\n\n') || null;
  const invoiceName = normalizeOptionalText(billingProfile && billingProfile.invoice_recipient_name) || normalizeOptionalText(invoicePerson && invoicePerson.name);
  const invoiceEmail = normalizeOptionalText(billingProfile && billingProfile.invoice_recipient_email) || normalizeOptionalText(invoicePerson && invoicePerson.email);
  const invoicePhone = normalizeOptionalText(billingProfile && billingProfile.invoice_recipient_phone) || normalizeOptionalText(invoicePerson && invoicePerson.phone);

  return {
    contact_id: effectiveContactId,
    lead_id: leadId,
    source_quote_id: sourceQuoteId,
    preferred_currency: normalizeOptionalText(billingProfile && billingProfile.preferred_currency),
    customer_name_snapshot: normalizeOptionalText(body.customer_name_snapshot) || invoiceName || normalizeOptionalText(billingProfile && billingProfile.billing_name) || (contact && contact.name) || (lead && lead.name) || null,
    customer_phone_snapshot: normalizeOptionalText(body.customer_phone_snapshot) || invoicePhone || (contact && contact.phone) || (lead && lead.phone) || null,
    customer_email_snapshot: normalizeOptionalText(body.customer_email_snapshot) || invoiceEmail || (contact && contact.email) || (lead && lead.email) || null,
    customer_address_snapshot: normalizeOptionalText(body.customer_address_snapshot) || formatCustomerAddressForSnapshot(billingAddress),
    customer_tax_id: normalizeOptionalText(body.customer_tax_id) || normalizeOptionalText(billingProfile && billingProfile.tax_id),
    customer_billing_profile_id_snapshot: body.customer_billing_profile_id_snapshot !== undefined ? normalizeNullablePositiveInteger(body.customer_billing_profile_id_snapshot, 'פרופיל חיוב') : (billingProfile && billingProfile.id ? Number(billingProfile.id) : null),
    customer_billing_name_snapshot: normalizeOptionalText(body.customer_billing_name_snapshot) || normalizeOptionalText(billingProfile && billingProfile.billing_name),
    customer_invoice_recipient_name_snapshot: normalizeOptionalText(body.customer_invoice_recipient_name_snapshot) || invoiceName || null,
    customer_invoice_recipient_email_snapshot: normalizeOptionalText(body.customer_invoice_recipient_email_snapshot) || invoiceEmail || null,
    customer_invoice_recipient_phone_snapshot: normalizeOptionalText(body.customer_invoice_recipient_phone_snapshot) || invoicePhone || null,
    customer_billing_address_id_snapshot: billingAddress && billingAddress.id ? Number(billingAddress.id) : null,
    customer_billing_address_snapshot: normalizeOptionalText(body.customer_billing_address_snapshot) || formatCustomerAddressForSnapshot(billingAddress),
    customer_service_address_id_snapshot: serviceAddress && serviceAddress.id ? Number(serviceAddress.id) : null,
    customer_service_address_snapshot: normalizeOptionalText(body.customer_service_address_snapshot) || formatCustomerAddressForSnapshot(serviceAddress),
    customer_document_contact_id_snapshot: invoicePerson && invoicePerson.id ? Number(invoicePerson.id) : null,
    customer_document_contact_snapshot: normalizeOptionalText(body.customer_document_contact_snapshot) || formatCustomerPersonForSnapshot(invoicePerson),
    customer_finance_contact_id_snapshot: financePerson && financePerson.id ? Number(financePerson.id) : null,
    customer_finance_contact_snapshot: normalizeOptionalText(body.customer_finance_contact_snapshot) || formatCustomerPersonForSnapshot(financePerson),
    customer_vat_treatment_hint: normalizeOptionalText(body.customer_vat_treatment_hint) || normalizeOptionalText(billingProfile && billingProfile.vat_treatment),
    customer_credit_status_snapshot: normalizeOptionalText(body.customer_credit_status_snapshot) || normalizeOptionalText(billingProfile && billingProfile.credit_status),
    customer_credit_notes_snapshot: normalizeOptionalText(body.customer_credit_notes_snapshot) || normalizeOptionalText(billingProfile && billingProfile.credit_notes),
    customer_default_discount_percent: normalizeNonNegativeNumber(body.customer_default_discount_percent, Number(billingProfile && billingProfile.default_discount_percent || 0), 'אחוז הנחת לקוח'),
    customer_default_discount_amount: normalizeNonNegativeNumber(body.customer_default_discount_amount, Number(billingProfile && billingProfile.default_discount_amount || 0), 'סכום הנחת לקוח'),
    business_name_snapshot: normalizeOptionalText(body.business_name_snapshot) || settings.business_display_name || settings.business_legal_name || (tenant && tenant.name) || null,
    business_phone_snapshot: normalizeOptionalText(body.business_phone_snapshot) || settings.business_phone || (tenant && tenant.contact_phone) || null,
    business_email_snapshot: normalizeOptionalText(body.business_email_snapshot) || settings.business_email || (tenant && tenant.contact_email) || null,
    business_address_snapshot: normalizeOptionalText(body.business_address_snapshot) || settings.business_address || null,
    business_tax_id: normalizeOptionalText(body.business_tax_id) || settings.business_tax_id || null,
    business_legal_name_snapshot: normalizeOptionalText(body.business_legal_name_snapshot) || settings.business_legal_name || settings.business_display_name || (tenant && tenant.name) || null,
    business_display_name_snapshot: normalizeOptionalText(body.business_display_name_snapshot) || settings.business_display_name || settings.business_legal_name || (tenant && tenant.name) || null,
    business_type_snapshot: settings.business_type || null,
    vat_mode_snapshot: settings.vat_mode || 'standard',
    default_vat_rate_snapshot: Number(settings.default_vat_rate || 0),
    business_logo_url_snapshot: normalizeOptionalText(body.business_logo_url_snapshot) || settings.logo_url || null,
    payment_terms_snapshot: normalizeOptionalText(body.payment_terms_snapshot) || defaultPaymentTerms,
    cancellation_policy_snapshot: normalizeOptionalText(body.cancellation_policy_snapshot) || normalizeOptionalText(settings.default_cancellation_policy),
    document_footer_snapshot: normalizeOptionalText(body.document_footer_snapshot) || defaultFooter,
    default_notes: defaultNotes,
    default_terms: defaultTerms
  };
}

async function nextDocumentNumber(tenantId, documentType, env) {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO sales_document_counters (
       tenant_id,
       document_type,
       next_number,
       prefix,
       padding,
       created_at,
       updated_at
     ) VALUES (?, ?, 1, ?, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(tenantId, documentType, defaultPrefix(documentType)).run();

  try {
    const row = await env.DB.prepare(
      `UPDATE sales_document_counters
       SET next_number = next_number + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE tenant_id = ?
         AND document_type = ?
       RETURNING next_number - 1 AS document_number_int, prefix, padding`
    ).bind(tenantId, documentType).first();

    if (row && row.document_number_int) {
      return {
        document_number_int: Number(row.document_number_int),
        document_number: formatDocumentNumber(documentType, Number(row.document_number_int), row.prefix, row.padding)
      };
    }
  } catch {
    // Fallback for runtimes without UPDATE ... RETURNING. Less concurrency-safe, but keeps local/dev environments usable.
  }

  const current = await env.DB.prepare(
    `SELECT next_number, prefix, padding
     FROM sales_document_counters
     WHERE tenant_id = ?
       AND document_type = ?
     LIMIT 1`
  ).bind(tenantId, documentType).first();
  if (!current) throw new Error('מונה המסמכים לא נמצא');

  const documentNumberInt = Number(current.next_number || 1);
  await env.DB.prepare(
    `UPDATE sales_document_counters
     SET next_number = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE tenant_id = ?
       AND document_type = ?
       AND next_number = ?`
  ).bind(documentNumberInt + 1, tenantId, documentType, documentNumberInt).run();

  return {
    document_number_int: documentNumberInt,
    document_number: formatDocumentNumber(documentType, documentNumberInt, current.prefix, current.padding)
  };
}

async function insertItems(documentId, tenantId, items, env) {
  for (const item of items) {
    await env.DB.prepare(
      `INSERT INTO sales_document_items (
         tenant_id,
         document_id,
         line_order,
         product_id,
         description,
         quantity,
         unit,
         unit_price,
         discount_amount,
         vat_rate,
         vat_amount,
         line_subtotal,
         line_total,
         created_at,
         updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      tenantId,
      documentId,
      item.line_order,
      item.product_id,
      item.description,
      item.quantity,
      item.unit,
      item.unit_price,
      item.discount_amount,
      item.vat_rate,
      item.vat_amount,
      item.line_subtotal,
      item.line_total
    ).run();
  }
}

async function createDocument(request, env, tenantCtx) {
  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const documentType = normalizeDocumentType(body.document_type);
  const status = normalizeStatus(body.status, 'draft');
  if (status !== 'draft') {
    throw new Error('מסמך חדש חייב להתחיל כטיוטה');
  }

  const businessSettings = await getTenantBusinessSettings(tenantId, env);
  const items = await normalizeItems(body.items, tenantId, env, businessSettings);
  const totals = calculateTotals(items, body.paid_amount);
  const snapshot = await buildSnapshot(body, tenantId, env, businessSettings);
  const numberState = await nextDocumentNumber(tenantId, documentType, env);
  const issueDate = normalizeOptionalText(body.issue_date);

  const result = await env.DB.prepare(
    `INSERT INTO sales_documents (
       tenant_id,
       document_type,
       document_number,
       document_number_int,
       status,
       contact_id,
       lead_id,
       source_quote_id,
       issue_date,
       due_date,
       valid_until,
       currency,
       subtotal_amount,
       discount_amount,
       vat_rate,
       vat_amount,
       total_amount,
       paid_amount,
       balance_amount,
       customer_name_snapshot,
       customer_phone_snapshot,
       customer_email_snapshot,
       customer_address_snapshot,
       customer_tax_id,
       customer_billing_profile_id_snapshot,
       customer_billing_name_snapshot,
       customer_invoice_recipient_name_snapshot,
       customer_invoice_recipient_email_snapshot,
       customer_invoice_recipient_phone_snapshot,
       customer_billing_address_id_snapshot,
       customer_billing_address_snapshot,
       customer_service_address_id_snapshot,
       customer_service_address_snapshot,
       customer_document_contact_id_snapshot,
       customer_document_contact_snapshot,
       customer_finance_contact_id_snapshot,
       customer_finance_contact_snapshot,
       customer_vat_treatment_hint,
       customer_credit_status_snapshot,
       customer_credit_notes_snapshot,
       customer_default_discount_percent,
       customer_default_discount_amount,
       business_name_snapshot,
       business_phone_snapshot,
       business_email_snapshot,
       business_address_snapshot,
       business_tax_id,
       business_legal_name_snapshot,
       business_display_name_snapshot,
       business_type_snapshot,
       vat_mode_snapshot,
       default_vat_rate_snapshot,
       business_logo_url_snapshot,
       payment_terms_snapshot,
       cancellation_policy_snapshot,
       document_footer_snapshot,
       notes,
       terms,
       internal_notes,
       created_by_user_id,
       updated_by_user_id,
       created_at,
       updated_at
     ) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).bind(
    tenantId,
    documentType,
    numberState.document_number,
    numberState.document_number_int,
    snapshot.contact_id,
    snapshot.lead_id,
    snapshot.source_quote_id,
    issueDate,
    normalizeOptionalText(body.due_date),
    normalizeOptionalText(body.valid_until),
    normalizeOptionalText(body.currency) || snapshot.preferred_currency || 'ILS',
    totals.subtotal_amount,
    totals.discount_amount,
    totals.vat_rate,
    totals.vat_amount,
    totals.total_amount,
    totals.paid_amount,
    totals.balance_amount,
    snapshot.customer_name_snapshot,
    snapshot.customer_phone_snapshot,
    snapshot.customer_email_snapshot,
    snapshot.customer_address_snapshot,
    snapshot.customer_tax_id,
    snapshot.customer_billing_profile_id_snapshot,
    snapshot.customer_billing_name_snapshot,
    snapshot.customer_invoice_recipient_name_snapshot,
    snapshot.customer_invoice_recipient_email_snapshot,
    snapshot.customer_invoice_recipient_phone_snapshot,
    snapshot.customer_billing_address_id_snapshot,
    snapshot.customer_billing_address_snapshot,
    snapshot.customer_service_address_id_snapshot,
    snapshot.customer_service_address_snapshot,
    snapshot.customer_document_contact_id_snapshot,
    snapshot.customer_document_contact_snapshot,
    snapshot.customer_finance_contact_id_snapshot,
    snapshot.customer_finance_contact_snapshot,
    snapshot.customer_vat_treatment_hint,
    snapshot.customer_credit_status_snapshot,
    snapshot.customer_credit_notes_snapshot,
    snapshot.customer_default_discount_percent,
    snapshot.customer_default_discount_amount,
    snapshot.business_name_snapshot,
    snapshot.business_phone_snapshot,
    snapshot.business_email_snapshot,
    snapshot.business_address_snapshot,
    snapshot.business_tax_id,
    snapshot.business_legal_name_snapshot,
    snapshot.business_display_name_snapshot,
    snapshot.business_type_snapshot,
    snapshot.vat_mode_snapshot,
    snapshot.default_vat_rate_snapshot,
    snapshot.business_logo_url_snapshot,
    snapshot.payment_terms_snapshot,
    snapshot.cancellation_policy_snapshot,
    snapshot.document_footer_snapshot,
    normalizeOptionalText(body.notes) || snapshot.default_notes,
    normalizeOptionalText(body.terms) || snapshot.default_terms,
    normalizeOptionalText(body.internal_notes),
    userId,
    userId
  ).run();

  const documentId = result.meta.last_row_id;
  await insertItems(documentId, tenantId, items, env);

  const document = await getDocumentForTenant(documentId, tenantId, env);
  const documentItems = await getDocumentItemsForTenant(documentId, tenantId, env);
  return { success: true, document: mapDocument(document, documentItems) };
}

async function updateDocument(request, env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const existing = await getDocumentForTenant(documentId, tenantId, env);
  if (!existing) throw new Error('המסמך לא נמצא');
  if (existing.status !== 'draft' || existing.locked_at || existing.issued_at) {
    return json({ error: 'ניתן לערוך רק טיוטת מסמך לא נעולה' }, 409);
  }

  const body = await parseJson(request);
  if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

  const businessSettings = await getTenantBusinessSettings(tenantId, env);
  const items = await normalizeItems(body.items, tenantId, env, businessSettings);
  const totals = calculateTotals(items, body.paid_amount);
  const snapshot = await buildSnapshot({
    contact_id: body.contact_id !== undefined ? body.contact_id : existing.contact_id,
    lead_id: body.lead_id !== undefined ? body.lead_id : existing.lead_id,
    source_quote_id: body.source_quote_id !== undefined ? body.source_quote_id : existing.source_quote_id,
    customer_name_snapshot: body.customer_name_snapshot !== undefined ? body.customer_name_snapshot : existing.customer_name_snapshot,
    customer_phone_snapshot: body.customer_phone_snapshot !== undefined ? body.customer_phone_snapshot : existing.customer_phone_snapshot,
    customer_email_snapshot: body.customer_email_snapshot !== undefined ? body.customer_email_snapshot : existing.customer_email_snapshot,
    customer_address_snapshot: body.customer_address_snapshot !== undefined ? body.customer_address_snapshot : existing.customer_address_snapshot,
    customer_tax_id: body.customer_tax_id !== undefined ? body.customer_tax_id : existing.customer_tax_id,
    customer_billing_profile_id_snapshot: body.customer_billing_profile_id_snapshot !== undefined ? body.customer_billing_profile_id_snapshot : existing.customer_billing_profile_id_snapshot,
    customer_billing_name_snapshot: body.customer_billing_name_snapshot !== undefined ? body.customer_billing_name_snapshot : existing.customer_billing_name_snapshot,
    customer_invoice_recipient_name_snapshot: body.customer_invoice_recipient_name_snapshot !== undefined ? body.customer_invoice_recipient_name_snapshot : existing.customer_invoice_recipient_name_snapshot,
    customer_invoice_recipient_email_snapshot: body.customer_invoice_recipient_email_snapshot !== undefined ? body.customer_invoice_recipient_email_snapshot : existing.customer_invoice_recipient_email_snapshot,
    customer_invoice_recipient_phone_snapshot: body.customer_invoice_recipient_phone_snapshot !== undefined ? body.customer_invoice_recipient_phone_snapshot : existing.customer_invoice_recipient_phone_snapshot,
    customer_billing_address_id_snapshot: body.customer_billing_address_id_snapshot !== undefined ? body.customer_billing_address_id_snapshot : existing.customer_billing_address_id_snapshot,
    customer_billing_address_snapshot: body.customer_billing_address_snapshot !== undefined ? body.customer_billing_address_snapshot : existing.customer_billing_address_snapshot,
    customer_service_address_id_snapshot: body.customer_service_address_id_snapshot !== undefined ? body.customer_service_address_id_snapshot : existing.customer_service_address_id_snapshot,
    customer_service_address_snapshot: body.customer_service_address_snapshot !== undefined ? body.customer_service_address_snapshot : existing.customer_service_address_snapshot,
    customer_document_contact_id_snapshot: body.customer_document_contact_id_snapshot !== undefined ? body.customer_document_contact_id_snapshot : existing.customer_document_contact_id_snapshot,
    customer_document_contact_snapshot: body.customer_document_contact_snapshot !== undefined ? body.customer_document_contact_snapshot : existing.customer_document_contact_snapshot,
    customer_finance_contact_id_snapshot: body.customer_finance_contact_id_snapshot !== undefined ? body.customer_finance_contact_id_snapshot : existing.customer_finance_contact_id_snapshot,
    customer_finance_contact_snapshot: body.customer_finance_contact_snapshot !== undefined ? body.customer_finance_contact_snapshot : existing.customer_finance_contact_snapshot,
    customer_vat_treatment_hint: body.customer_vat_treatment_hint !== undefined ? body.customer_vat_treatment_hint : existing.customer_vat_treatment_hint,
    customer_credit_status_snapshot: body.customer_credit_status_snapshot !== undefined ? body.customer_credit_status_snapshot : existing.customer_credit_status_snapshot,
    customer_credit_notes_snapshot: body.customer_credit_notes_snapshot !== undefined ? body.customer_credit_notes_snapshot : existing.customer_credit_notes_snapshot,
    customer_default_discount_percent: body.customer_default_discount_percent !== undefined ? body.customer_default_discount_percent : existing.customer_default_discount_percent,
    customer_default_discount_amount: body.customer_default_discount_amount !== undefined ? body.customer_default_discount_amount : existing.customer_default_discount_amount,
    business_name_snapshot: body.business_name_snapshot !== undefined ? body.business_name_snapshot : existing.business_name_snapshot,
    business_phone_snapshot: body.business_phone_snapshot !== undefined ? body.business_phone_snapshot : existing.business_phone_snapshot,
    business_email_snapshot: body.business_email_snapshot !== undefined ? body.business_email_snapshot : existing.business_email_snapshot,
    business_address_snapshot: body.business_address_snapshot !== undefined ? body.business_address_snapshot : existing.business_address_snapshot,
    business_tax_id: body.business_tax_id !== undefined ? body.business_tax_id : existing.business_tax_id,
    business_legal_name_snapshot: body.business_legal_name_snapshot !== undefined ? body.business_legal_name_snapshot : existing.business_legal_name_snapshot,
    business_display_name_snapshot: body.business_display_name_snapshot !== undefined ? body.business_display_name_snapshot : existing.business_display_name_snapshot,
    business_logo_url_snapshot: body.business_logo_url_snapshot !== undefined ? body.business_logo_url_snapshot : existing.business_logo_url_snapshot,
    payment_terms_snapshot: body.payment_terms_snapshot !== undefined ? body.payment_terms_snapshot : existing.payment_terms_snapshot,
    cancellation_policy_snapshot: body.cancellation_policy_snapshot !== undefined ? body.cancellation_policy_snapshot : existing.cancellation_policy_snapshot,
    document_footer_snapshot: body.document_footer_snapshot !== undefined ? body.document_footer_snapshot : existing.document_footer_snapshot
  }, tenantId, env, businessSettings);

  await env.DB.prepare(
    `UPDATE sales_documents
     SET contact_id = ?,
         lead_id = ?,
         source_quote_id = ?,
         issue_date = ?,
         due_date = ?,
         valid_until = ?,
         currency = ?,
         subtotal_amount = ?,
         discount_amount = ?,
         vat_rate = ?,
         vat_amount = ?,
         total_amount = ?,
         paid_amount = ?,
         balance_amount = ?,
         customer_name_snapshot = ?,
         customer_phone_snapshot = ?,
         customer_email_snapshot = ?,
         customer_address_snapshot = ?,
         customer_tax_id = ?,
         customer_billing_profile_id_snapshot = ?,
         customer_billing_name_snapshot = ?,
         customer_invoice_recipient_name_snapshot = ?,
         customer_invoice_recipient_email_snapshot = ?,
         customer_invoice_recipient_phone_snapshot = ?,
         customer_billing_address_id_snapshot = ?,
         customer_billing_address_snapshot = ?,
         customer_service_address_id_snapshot = ?,
         customer_service_address_snapshot = ?,
         customer_document_contact_id_snapshot = ?,
         customer_document_contact_snapshot = ?,
         customer_finance_contact_id_snapshot = ?,
         customer_finance_contact_snapshot = ?,
         customer_vat_treatment_hint = ?,
         customer_credit_status_snapshot = ?,
         customer_credit_notes_snapshot = ?,
         customer_default_discount_percent = ?,
         customer_default_discount_amount = ?,
         business_name_snapshot = ?,
         business_phone_snapshot = ?,
         business_email_snapshot = ?,
         business_address_snapshot = ?,
         business_tax_id = ?,
         business_legal_name_snapshot = ?,
         business_display_name_snapshot = ?,
         business_type_snapshot = ?,
         vat_mode_snapshot = ?,
         default_vat_rate_snapshot = ?,
         business_logo_url_snapshot = ?,
         payment_terms_snapshot = ?,
         cancellation_policy_snapshot = ?,
         document_footer_snapshot = ?,
         notes = ?,
         terms = ?,
         internal_notes = ?,
         updated_by_user_id = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?`
  ).bind(
    snapshot.contact_id,
    snapshot.lead_id,
    snapshot.source_quote_id,
    normalizeOptionalText(body.issue_date !== undefined ? body.issue_date : existing.issue_date),
    normalizeOptionalText(body.due_date !== undefined ? body.due_date : existing.due_date),
    normalizeOptionalText(body.valid_until !== undefined ? body.valid_until : existing.valid_until),
    normalizeOptionalText(body.currency !== undefined ? body.currency : existing.currency) || snapshot.preferred_currency || 'ILS',
    totals.subtotal_amount,
    totals.discount_amount,
    totals.vat_rate,
    totals.vat_amount,
    totals.total_amount,
    totals.paid_amount,
    totals.balance_amount,
    snapshot.customer_name_snapshot,
    snapshot.customer_phone_snapshot,
    snapshot.customer_email_snapshot,
    snapshot.customer_address_snapshot,
    snapshot.customer_tax_id,
    snapshot.customer_billing_profile_id_snapshot,
    snapshot.customer_billing_name_snapshot,
    snapshot.customer_invoice_recipient_name_snapshot,
    snapshot.customer_invoice_recipient_email_snapshot,
    snapshot.customer_invoice_recipient_phone_snapshot,
    snapshot.customer_billing_address_id_snapshot,
    snapshot.customer_billing_address_snapshot,
    snapshot.customer_service_address_id_snapshot,
    snapshot.customer_service_address_snapshot,
    snapshot.customer_document_contact_id_snapshot,
    snapshot.customer_document_contact_snapshot,
    snapshot.customer_finance_contact_id_snapshot,
    snapshot.customer_finance_contact_snapshot,
    snapshot.customer_vat_treatment_hint,
    snapshot.customer_credit_status_snapshot,
    snapshot.customer_credit_notes_snapshot,
    snapshot.customer_default_discount_percent,
    snapshot.customer_default_discount_amount,
    snapshot.business_name_snapshot,
    snapshot.business_phone_snapshot,
    snapshot.business_email_snapshot,
    snapshot.business_address_snapshot,
    snapshot.business_tax_id,
    snapshot.business_legal_name_snapshot,
    snapshot.business_display_name_snapshot,
    snapshot.business_type_snapshot,
    snapshot.vat_mode_snapshot,
    snapshot.default_vat_rate_snapshot,
    snapshot.business_logo_url_snapshot,
    snapshot.payment_terms_snapshot,
    snapshot.cancellation_policy_snapshot,
    snapshot.document_footer_snapshot,
    normalizeOptionalText(body.notes !== undefined ? body.notes : existing.notes) || snapshot.default_notes,
    normalizeOptionalText(body.terms !== undefined ? body.terms : existing.terms) || snapshot.default_terms,
    normalizeOptionalText(body.internal_notes !== undefined ? body.internal_notes : existing.internal_notes),
    userId,
    documentId,
    tenantId
  ).run();

  await env.DB.prepare('DELETE FROM sales_document_items WHERE document_id = ? AND tenant_id = ?').bind(documentId, tenantId).run();
  await insertItems(documentId, tenantId, items, env);

  const document = await getDocumentForTenant(documentId, tenantId, env);
  const documentItems = await getDocumentItemsForTenant(documentId, tenantId, env);
  return { success: true, document: mapDocument(document, documentItems) };
}

async function listDocuments(request, env, tenantCtx) {
  const url = new URL(request.url);
  const tenantId = tenantCtx.tenant.id;
  const documentType = url.searchParams.get('type') ? normalizeDocumentType(url.searchParams.get('type')) : null;
  const status = url.searchParams.get('status') ? normalizeStatus(url.searchParams.get('status')) : null;
  const search = normalizeOptionalText(url.searchParams.get('search'));
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100), 1), 300);

  let query = `SELECT * FROM sales_documents WHERE tenant_id = ?`;
  const params = [tenantId];
  if (documentType) {
    query += ` AND document_type = ?`;
    params.push(documentType);
  }
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  if (search) {
    query += ` AND (
      document_number LIKE ?
      OR customer_name_snapshot LIKE ?
      OR customer_phone_snapshot LIKE ?
      OR customer_email_snapshot LIKE ?
    )`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ` ORDER BY created_at DESC, id DESC LIMIT ?`;
  params.push(limit);

  const result = await env.DB.prepare(query).bind(...params).all();
  return { documents: (result.results || []).map(function(row) { return mapDocument(row); }) };
}

async function getDocumentDetail(env, tenantId, documentId) {
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  const items = await getDocumentItemsForTenant(documentId, tenantId, env);
  return { document: mapDocument(document, items) };
}

function buildClonePayload(document, items, overrides = {}) {
  return {
    document_type: overrides.document_type || document.document_type,
    contact_id: document.contact_id || null,
    lead_id: document.lead_id || null,
    source_quote_id: overrides.source_quote_id !== undefined ? overrides.source_quote_id : (document.source_quote_id || null),
    issue_date: overrides.issue_date !== undefined ? overrides.issue_date : todayIsoDate(),
    due_date: overrides.due_date !== undefined ? overrides.due_date : document.due_date,
    valid_until: overrides.valid_until !== undefined ? overrides.valid_until : document.valid_until,
    currency: document.currency || 'ILS',
    customer_name_snapshot: document.customer_name_snapshot,
    customer_phone_snapshot: document.customer_phone_snapshot,
    customer_email_snapshot: document.customer_email_snapshot,
    customer_address_snapshot: document.customer_address_snapshot,
    customer_tax_id: document.customer_tax_id,
    customer_billing_address_id_snapshot: document.customer_billing_address_id_snapshot || null,
    customer_billing_address_snapshot: document.customer_billing_address_snapshot || document.customer_address_snapshot || null,
    customer_service_address_id_snapshot: document.customer_service_address_id_snapshot || null,
    customer_service_address_snapshot: document.customer_service_address_snapshot || null,
    customer_document_contact_id_snapshot: document.customer_document_contact_id_snapshot || null,
    customer_document_contact_snapshot: document.customer_document_contact_snapshot || null,
    customer_finance_contact_id_snapshot: document.customer_finance_contact_id_snapshot || null,
    customer_finance_contact_snapshot: document.customer_finance_contact_snapshot || null,
    customer_vat_treatment_hint: document.customer_vat_treatment_hint || null,
    customer_credit_status_snapshot: document.customer_credit_status_snapshot || null,
    customer_credit_notes_snapshot: document.customer_credit_notes_snapshot || null,
    customer_default_discount_percent: document.customer_default_discount_percent || 0,
    customer_default_discount_amount: document.customer_default_discount_amount || 0,
    business_name_snapshot: document.business_name_snapshot,
    business_phone_snapshot: document.business_phone_snapshot,
    business_email_snapshot: document.business_email_snapshot,
    business_address_snapshot: document.business_address_snapshot,
    business_tax_id: document.business_tax_id,
    business_legal_name_snapshot: document.business_legal_name_snapshot,
    business_display_name_snapshot: document.business_display_name_snapshot,
    business_logo_url_snapshot: document.business_logo_url_snapshot,
    payment_terms_snapshot: document.payment_terms_snapshot,
    cancellation_policy_snapshot: document.cancellation_policy_snapshot,
    document_footer_snapshot: document.document_footer_snapshot,
    notes: document.notes,
    terms: document.terms,
    internal_notes: document.internal_notes,
    items: (items || []).map(function(item) {
      return {
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
        vat_rate: item.vat_rate
      };
    })
  };
}

function payloadRequest(payload) {
  return new Request('https://internal.local/api/sales-documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function duplicateDocument(env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  const items = await getDocumentItemsForTenant(documentId, tenantId, env);
  const payload = buildClonePayload(document, items, {
    issue_date: todayIsoDate(),
    due_date: document.document_type === 'invoice' ? todayIsoDate() : null,
    valid_until: document.document_type === 'quote' ? todayIsoDate() : null
  });
  return createDocument(payloadRequest(payload), env, tenantCtx);
}

async function convertQuoteToInvoice(env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  if (document.document_type !== 'quote') {
    return json({ error: 'ניתן להמיר לחשבונית רק הצעת מחיר' }, 400);
  }
  if (['cancelled', 'rejected', 'expired', 'converted'].includes(document.status)) {
    return json({ error: 'לא ניתן להמיר הצעה במצב הנוכחי' }, 409);
  }
  const items = await getDocumentItemsForTenant(documentId, tenantId, env);
  const created = await createDocument(payloadRequest(buildClonePayload(document, items, {
    document_type: 'invoice',
    source_quote_id: documentId,
    issue_date: todayIsoDate(),
    due_date: todayIsoDate(),
    valid_until: null
  })), env, tenantCtx);

  await env.DB.prepare(
    `UPDATE sales_documents
     SET status = 'converted',
         updated_by_user_id = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?
       AND status NOT IN ('cancelled', 'rejected', 'expired', 'converted')`
  ).bind(userId, documentId, tenantId).run();

  return { success: true, source_document: (await getDocumentDetail(env, tenantId, documentId)).document, document: created.document };
}

async function markDocumentSent(env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  if (document.status === 'cancelled' || document.status === 'void' || document.status === 'rejected') {
    return json({ error: 'לא ניתן לסמן מסמך זה כנשלח' }, 409);
  }

  const nextStatus = document.status === 'issued' || document.status === 'paid' || document.status === 'partially_paid'
    ? document.status
    : 'sent';
  await env.DB.prepare(
    `UPDATE sales_documents
     SET status = ?,
         sent_at = COALESCE(sent_at, CURRENT_TIMESTAMP),
         updated_by_user_id = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?`
  ).bind(nextStatus, userId, documentId, tenantId).run();

  return { success: true, ...(await getDocumentDetail(env, tenantId, documentId)) };
}

async function issueDocument(env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  if (document.document_type !== 'invoice') {
    return json({ error: 'בשלב זה ניתן להנפיק חשבוניות בלבד' }, 400);
  }
  if (document.status !== 'draft') {
    return json({ error: 'ניתן להנפיק רק חשבונית במצב טיוטה' }, 409);
  }

  const issueDate = document.issue_date || todayIsoDate();
  await env.DB.prepare(
    `UPDATE sales_documents
     SET status = 'issued',
         issue_date = ?,
         issued_at = CURRENT_TIMESTAMP,
         issued_by_user_id = ?,
         locked_at = CURRENT_TIMESTAMP,
         locked_by_user_id = ?,
         updated_by_user_id = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?`
  ).bind(issueDate, userId, userId, userId, documentId, tenantId).run();

  return { success: true, ...(await getDocumentDetail(env, tenantId, documentId)) };
}

async function cancelDocument(env, tenantCtx, documentId) {
  const tenantId = tenantCtx.tenant.id;
  const userId = tenantCtx.user.id;
  const document = await getDocumentForTenant(documentId, tenantId, env);
  if (!document) throw new Error('המסמך לא נמצא');
  if (document.status === 'cancelled' || document.status === 'void') {
    return json({ error: 'המסמך כבר מבוטל' }, 409);
  }
  if (document.status === 'paid' || document.status === 'partially_paid') {
    return json({ error: 'לא ניתן לבטל מסמך עם תשלום בשלב זה' }, 409);
  }

  const nextStatus = document.document_type === 'invoice' && document.status === 'issued' ? 'void' : 'cancelled';
  await env.DB.prepare(
    `UPDATE sales_documents
     SET status = ?,
         cancelled_at = CURRENT_TIMESTAMP,
         voided_at = CASE WHEN ? = 'void' THEN CURRENT_TIMESTAMP ELSE voided_at END,
         locked_at = COALESCE(locked_at, CURRENT_TIMESTAMP),
         locked_by_user_id = COALESCE(locked_by_user_id, ?),
         updated_by_user_id = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?
       AND tenant_id = ?`
  ).bind(nextStatus, nextStatus, userId, userId, documentId, tenantId).run();

  return { success: true, ...(await getDocumentDetail(env, tenantId, documentId)) };
}

export async function handleSalesDocuments(request, env, path) {
  const method = request.method;
  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  const moduleState = await assertSalesDocumentsModuleEnabled(tenantCtx, env);
  if (moduleState instanceof Response) return moduleState;

  if (path === '/api/sales-documents' && method === 'GET') {
    return listDocuments(request, env, tenantCtx);
  }

  if (path === '/api/sales-documents' && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
    return createDocument(request, env, tenantCtx);
  }

  const duplicateMatch = path.match(/^\/api\/sales-documents\/(\d+)\/duplicate$/);
  if (duplicateMatch && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
    return duplicateDocument(env, tenantCtx, Number(duplicateMatch[1]));
  }

  const convertMatch = path.match(/^\/api\/sales-documents\/(\d+)\/convert-to-invoice$/);
  if (convertMatch && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
    return convertQuoteToInvoice(env, tenantCtx, Number(convertMatch[1]));
  }

  const markSentMatch = path.match(/^\/api\/sales-documents\/(\d+)\/mark-sent$/);
  if (markSentMatch && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
    return markDocumentSent(env, tenantCtx, Number(markSentMatch[1]));
  }

  const issueMatch = path.match(/^\/api\/sales-documents\/(\d+)\/issue$/);
  if (issueMatch && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (access instanceof Response) return access;
    return issueDocument(env, tenantCtx, Number(issueMatch[1]));
  }

  const cancelMatch = path.match(/^\/api\/sales-documents\/(\d+)\/cancel$/);
  if (cancelMatch && method === 'POST') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (access instanceof Response) return access;
    return cancelDocument(env, tenantCtx, Number(cancelMatch[1]));
  }

  const idMatch = path.match(/^\/api\/sales-documents\/(\d+)$/);
  if (idMatch && method === 'GET') {
    return getDocumentDetail(env, tenantCtx.tenant.id, Number(idMatch[1]));
  }

  if (idMatch && method === 'PUT') {
    const access = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (access instanceof Response) return access;
    return updateDocument(request, env, tenantCtx, Number(idMatch[1]));
  }

  return json({ error: 'Sales documents route not found' }, 404);
}
