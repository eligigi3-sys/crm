-- =========================
-- schema_v22.sql
-- Tenant business settings foundation for sales documents
-- Scope:
--   - add tenant_business_settings table
--   - add sales document business/tax/default-term snapshot columns
--   - keep changes additive only
-- Explicitly excluded:
--   - destructive changes
--   - recalculating old documents
--   - PDF/print/template builder
-- =========================

CREATE TABLE IF NOT EXISTS tenant_business_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL UNIQUE,

  business_legal_name TEXT,
  business_display_name TEXT,
  business_tax_id TEXT,

  business_type TEXT NOT NULL DEFAULT 'licensed_dealer' CHECK (business_type IN ('licensed_dealer', 'exempt_dealer', 'company')),
  vat_mode TEXT NOT NULL DEFAULT 'standard' CHECK (vat_mode IN ('standard', 'exempt')),
  default_vat_rate REAL NOT NULL DEFAULT 18,

  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,

  logo_url TEXT,

  default_payment_terms TEXT,
  default_cancellation_policy TEXT,
  default_document_footer TEXT,
  default_notes TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CHECK (default_vat_rate >= 0),
  CHECK (
    (business_type = 'exempt_dealer' AND vat_mode = 'exempt' AND default_vat_rate = 0)
    OR business_type <> 'exempt_dealer'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_business_settings_tenant
  ON tenant_business_settings(tenant_id);

ALTER TABLE sales_documents ADD COLUMN business_legal_name_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN business_display_name_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN business_type_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN vat_mode_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN default_vat_rate_snapshot REAL;
ALTER TABLE sales_documents ADD COLUMN business_logo_url_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN payment_terms_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN cancellation_policy_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN document_footer_snapshot TEXT;
