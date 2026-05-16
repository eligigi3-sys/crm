-- =========================
-- schema_v24.sql
-- Customer billing snapshots on sales documents (CB-3)
-- Scope:
--   - persist immutable customer billing/address/contact defaults on saved sales documents
--   - keep tenant-scoped document rows self-contained after customer profile changes
-- Explicitly excluded:
--   - accounting ledger
--   - payment gateway
--   - pricing engine expansion
--   - public customer links
-- =========================

ALTER TABLE sales_documents ADD COLUMN customer_billing_profile_id_snapshot INTEGER;
ALTER TABLE sales_documents ADD COLUMN customer_billing_name_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_invoice_recipient_name_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_invoice_recipient_email_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_invoice_recipient_phone_snapshot TEXT;

ALTER TABLE sales_documents ADD COLUMN customer_billing_address_id_snapshot INTEGER;
ALTER TABLE sales_documents ADD COLUMN customer_billing_address_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_service_address_id_snapshot INTEGER;
ALTER TABLE sales_documents ADD COLUMN customer_service_address_snapshot TEXT;

ALTER TABLE sales_documents ADD COLUMN customer_document_contact_id_snapshot INTEGER;
ALTER TABLE sales_documents ADD COLUMN customer_document_contact_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_finance_contact_id_snapshot INTEGER;
ALTER TABLE sales_documents ADD COLUMN customer_finance_contact_snapshot TEXT;

ALTER TABLE sales_documents ADD COLUMN customer_vat_treatment_hint TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_credit_status_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_credit_notes_snapshot TEXT;
ALTER TABLE sales_documents ADD COLUMN customer_default_discount_percent REAL NOT NULL DEFAULT 0;
ALTER TABLE sales_documents ADD COLUMN customer_default_discount_amount REAL NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_credit_snapshot
  ON sales_documents(tenant_id, customer_credit_status_snapshot);
