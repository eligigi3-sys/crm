-- =========================
-- schema_v23.sql
-- Customer billing profiles foundation (additive schema only)
-- Scope:
--   - create customer_billing_profiles
--   - create customer_addresses
--   - create customer_contact_people
-- Explicitly excluded:
--   - contacts table changes
--   - sales_documents behavior changes
--   - backfill
--   - accounting ledger
--   - pricing rules tables
-- =========================

CREATE TABLE IF NOT EXISTS customer_billing_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL,

  billing_name TEXT,
  tax_id TEXT,
  invoice_recipient_name TEXT,
  invoice_recipient_email TEXT,
  invoice_recipient_phone TEXT,

  preferred_currency TEXT NOT NULL DEFAULT 'ILS',
  payment_terms TEXT,
  default_notes TEXT,
  default_document_footer TEXT,
  billing_tags_json TEXT,

  vat_treatment TEXT NOT NULL DEFAULT 'standard'
    CHECK (vat_treatment IN ('standard', 'exempt', 'reverse_charge', 'foreign', 'custom')),
  default_vat_rate REAL,
  vat_exemption_reason TEXT,

  credit_limit REAL NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
  credit_status TEXT NOT NULL DEFAULT 'normal'
    CHECK (credit_status IN ('normal', 'watch', 'blocked')),
  credit_notes TEXT,

  default_discount_percent REAL NOT NULL DEFAULT 0
    CHECK (default_discount_percent >= 0 AND default_discount_percent <= 100),
  default_discount_amount REAL NOT NULL DEFAULT 0
    CHECK (default_discount_amount >= 0),
  pricing_notes TEXT,

  default_billing_address_id INTEGER,
  default_service_address_id INTEGER,
  default_finance_contact_id INTEGER,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_billing_profiles_tenant_contact_unique
  ON customer_billing_profiles(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_customer_billing_profiles_tenant
  ON customer_billing_profiles(tenant_id);

CREATE INDEX IF NOT EXISTS idx_customer_billing_profiles_tenant_credit_status
  ON customer_billing_profiles(tenant_id, credit_status);

CREATE INDEX IF NOT EXISTS idx_customer_billing_profiles_tenant_tax_id
  ON customer_billing_profiles(tenant_id, tax_id);

CREATE INDEX IF NOT EXISTS idx_customer_billing_profiles_tenant_vat_treatment
  ON customer_billing_profiles(tenant_id, vat_treatment);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL,

  label TEXT,
  address_type TEXT NOT NULL DEFAULT 'billing'
    CHECK (address_type IN ('billing', 'shipping', 'service', 'event', 'other')),
  full_address TEXT,
  street TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'IL',

  is_default_billing INTEGER NOT NULL DEFAULT 0 CHECK (is_default_billing IN (0, 1)),
  is_default_service INTEGER NOT NULL DEFAULT 0 CHECK (is_default_service IN (0, 1)),
  is_default_shipping INTEGER NOT NULL DEFAULT 0 CHECK (is_default_shipping IN (0, 1)),
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_tenant_contact
  ON customer_addresses(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_tenant_contact_active
  ON customer_addresses(tenant_id, contact_id, active);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_tenant_contact_type_active
  ON customer_addresses(tenant_id, contact_id, address_type, active);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_default_billing
  ON customer_addresses(tenant_id, contact_id, is_default_billing, active);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_default_service
  ON customer_addresses(tenant_id, contact_id, is_default_service, active);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_default_shipping
  ON customer_addresses(tenant_id, contact_id, is_default_shipping, active);

CREATE TABLE IF NOT EXISTS customer_contact_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  contact_id INTEGER NOT NULL,

  name TEXT NOT NULL,
  role_type TEXT NOT NULL DEFAULT 'main'
    CHECK (role_type IN ('main', 'finance', 'assistant', 'onsite', 'producer', 'other')),
  phone TEXT,
  email TEXT,
  title TEXT,
  notes TEXT,

  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  is_finance INTEGER NOT NULL DEFAULT 0 CHECK (is_finance IN (0, 1)),
  is_document_recipient INTEGER NOT NULL DEFAULT 0 CHECK (is_document_recipient IN (0, 1)),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_tenant_contact
  ON customer_contact_people(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_tenant_contact_active
  ON customer_contact_people(tenant_id, contact_id, active);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_tenant_contact_role_active
  ON customer_contact_people(tenant_id, contact_id, role_type, active);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_primary
  ON customer_contact_people(tenant_id, contact_id, is_primary, active);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_finance
  ON customer_contact_people(tenant_id, contact_id, is_finance, active);

CREATE INDEX IF NOT EXISTS idx_customer_contact_people_document_recipient
  ON customer_contact_people(tenant_id, contact_id, is_document_recipient, active);
