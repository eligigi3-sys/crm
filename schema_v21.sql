-- =========================
-- schema_v21.sql
-- Sales documents additive foundation: quotes and invoices
-- DO NOT RUN without explicit approval.
-- Scope:
--   - create sales_documents
--   - create sales_document_items
--   - create sales_document_counters
-- Explicitly excluded:
--   - existing table changes
--   - backfill
--   - frontend/backend route changes
--   - PDF generation
--   - Israel Tax Authority API integration
-- Notes:
--   - all tables are tenant-scoped by tenant_id
--   - document numbers are unique per tenant and document_type when assigned
--   - invoice immutability after issue is reserved through issue/lock fields and must be enforced by application logic in a later phase
-- =========================

CREATE TABLE IF NOT EXISTS sales_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  document_type TEXT NOT NULL CHECK (document_type IN ('quote', 'invoice')),
  document_number TEXT,
  document_number_int INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
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
    )
  ),

  contact_id INTEGER,
  lead_id INTEGER,
  source_quote_id INTEGER,

  issue_date TEXT,
  due_date TEXT,
  valid_until TEXT,
  currency TEXT NOT NULL DEFAULT 'ILS',

  subtotal_amount REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  vat_rate REAL NOT NULL DEFAULT 17,
  vat_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  balance_amount REAL NOT NULL DEFAULT 0,

  customer_name_snapshot TEXT,
  customer_phone_snapshot TEXT,
  customer_email_snapshot TEXT,
  customer_address_snapshot TEXT,
  customer_tax_id TEXT,

  business_name_snapshot TEXT,
  business_phone_snapshot TEXT,
  business_email_snapshot TEXT,
  business_address_snapshot TEXT,
  business_tax_id TEXT,

  tax_allocation_number TEXT,
  tax_allocation_status TEXT,
  tax_allocation_requested_at TEXT,
  tax_allocation_response_json TEXT,

  notes TEXT,
  terms TEXT,
  internal_notes TEXT,

  created_by_user_id INTEGER,
  updated_by_user_id INTEGER,
  issued_by_user_id INTEGER,
  locked_by_user_id INTEGER,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  issued_at DATETIME,
  sent_at DATETIME,
  accepted_at DATETIME,
  cancelled_at DATETIME,
  voided_at DATETIME,
  locked_at DATETIME,

  CHECK (document_number_int IS NULL OR document_number_int > 0),
  CHECK (subtotal_amount >= 0),
  CHECK (discount_amount >= 0),
  CHECK (vat_rate >= 0),
  CHECK (vat_amount >= 0),
  CHECK (total_amount >= 0),
  CHECK (paid_amount >= 0),
  CHECK (balance_amount >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_documents_tenant_type_number_unique
  ON sales_documents(tenant_id, document_type, document_number)
  WHERE document_number IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_documents_tenant_type_number_int_unique
  ON sales_documents(tenant_id, document_type, document_number_int)
  WHERE document_number_int IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant
  ON sales_documents(tenant_id);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_type_status
  ON sales_documents(tenant_id, document_type, status);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_contact
  ON sales_documents(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_lead
  ON sales_documents(tenant_id, lead_id);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_issue_date
  ON sales_documents(tenant_id, issue_date DESC);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_created
  ON sales_documents(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sales_documents_tenant_tax_allocation_status
  ON sales_documents(tenant_id, tax_allocation_status);

CREATE TABLE IF NOT EXISTS sales_document_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  document_id INTEGER NOT NULL,
  line_order INTEGER NOT NULL DEFAULT 1,

  product_id INTEGER,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit TEXT,
  unit_price REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  vat_rate REAL NOT NULL DEFAULT 17,
  vat_amount REAL NOT NULL DEFAULT 0,
  line_subtotal REAL NOT NULL DEFAULT 0,
  line_total REAL NOT NULL DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CHECK (line_order > 0),
  CHECK (quantity > 0),
  CHECK (unit_price >= 0),
  CHECK (discount_amount >= 0),
  CHECK (vat_rate >= 0),
  CHECK (vat_amount >= 0),
  CHECK (line_subtotal >= 0),
  CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_sales_document_items_tenant_document
  ON sales_document_items(tenant_id, document_id, line_order);

CREATE INDEX IF NOT EXISTS idx_sales_document_items_tenant_product
  ON sales_document_items(tenant_id, product_id);

CREATE TABLE IF NOT EXISTS sales_document_counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('quote', 'invoice')),
  next_number INTEGER NOT NULL DEFAULT 1,
  prefix TEXT,
  padding INTEGER NOT NULL DEFAULT 6,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  CHECK (next_number > 0),
  CHECK (padding >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sales_document_counters_tenant_type_unique
  ON sales_document_counters(tenant_id, document_type);

CREATE INDEX IF NOT EXISTS idx_sales_document_counters_tenant
  ON sales_document_counters(tenant_id);
