-- =========================
-- schema_v16.sql
-- SaaS multi-tenant foundation (schema file only)
-- DO NOT RUN without explicit approval.
-- Scope:
--   - create tenants
--   - create tenant_memberships
--   - evolve users additively
--   - add nullable tenant_id to tenant-owned business tables
--   - add tenant indexes
-- Explicitly excluded:
--   - app_settings changes
--   - Google/settings isolation
--   - backfill
--   - default tenant creation
--   - NOT NULL constraints
--   - uniqueness rewrites on existing tables
-- =========================

CREATE TABLE IF NOT EXISTS tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  timezone TEXT,
  currency TEXT,
  locale TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_slug
  ON tenants(slug);

CREATE INDEX IF NOT EXISTS idx_tenants_status
  ON tenants(status);

CREATE TABLE IF NOT EXISTS tenant_memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  status TEXT NOT NULL DEFAULT 'active',
  invited_by_user_id INTEGER,
  accepted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_memberships_tenant_user_unique
  ON tenant_memberships(tenant_id, user_id);

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_user
  ON tenant_memberships(user_id);

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant
  ON tenant_memberships(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant_role
  ON tenant_memberships(tenant_id, role);

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant_status
  ON tenant_memberships(tenant_id, status);

-- users additive evolution
ALTER TABLE users ADD COLUMN status TEXT;
ALTER TABLE users ADD COLUMN display_name TEXT;
ALTER TABLE users ADD COLUMN last_login_at DATETIME;
ALTER TABLE users ADD COLUMN updated_at DATETIME;

-- tenant_id additions (nullable first)
ALTER TABLE leads ADD COLUMN tenant_id INTEGER;
ALTER TABLE lead_notes ADD COLUMN tenant_id INTEGER;
ALTER TABLE contacts ADD COLUMN tenant_id INTEGER;
ALTER TABLE contact_notes ADD COLUMN tenant_id INTEGER;
ALTER TABLE counters ADD COLUMN tenant_id INTEGER;
ALTER TABLE employees ADD COLUMN tenant_id INTEGER;
ALTER TABLE lead_employees ADD COLUMN tenant_id INTEGER;
ALTER TABLE products ADD COLUMN tenant_id INTEGER;
ALTER TABLE product_purchases ADD COLUMN tenant_id INTEGER;
ALTER TABLE product_stock_movements ADD COLUMN tenant_id INTEGER;
ALTER TABLE shopping_lists ADD COLUMN tenant_id INTEGER;
ALTER TABLE shopping_items ADD COLUMN tenant_id INTEGER;
ALTER TABLE shopping_purchases ADD COLUMN tenant_id INTEGER;
ALTER TABLE shopping_purchase_items ADD COLUMN tenant_id INTEGER;
ALTER TABLE event_product_allocations ADD COLUMN tenant_id INTEGER;
ALTER TABLE event_inventory_actions ADD COLUMN tenant_id INTEGER;

-- tenant indexes: simple + safe composites
CREATE INDEX IF NOT EXISTS idx_leads_tenant
  ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_status
  ON leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_event_date
  ON leads(tenant_id, event_date);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_next_contact
  ON leads(tenant_id, next_contact);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_contact
  ON leads(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_lead_notes_tenant
  ON lead_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_tenant_lead
  ON lead_notes(tenant_id, lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_tenant_lead_created
  ON lead_notes(tenant_id, lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_tenant
  ON contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_phone
  ON contacts(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_name
  ON contacts(tenant_id, name);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_customer_type
  ON contacts(tenant_id, customer_type);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant_next_contact_date
  ON contacts(tenant_id, next_contact_date);

CREATE INDEX IF NOT EXISTS idx_contact_notes_tenant
  ON contact_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contact_notes_tenant_contact
  ON contact_notes(tenant_id, contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_notes_tenant_contact_created
  ON contact_notes(tenant_id, contact_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_counters_tenant
  ON counters(tenant_id);

CREATE INDEX IF NOT EXISTS idx_employees_tenant
  ON employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_active
  ON employees(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_name
  ON employees(tenant_id, full_name);
CREATE INDEX IF NOT EXISTS idx_employees_tenant_phone
  ON employees(tenant_id, phone);

CREATE INDEX IF NOT EXISTS idx_lead_employees_tenant
  ON lead_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_employees_tenant_lead
  ON lead_employees(tenant_id, lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_employees_tenant_employee
  ON lead_employees(tenant_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_lead_employees_tenant_payment_status
  ON lead_employees(tenant_id, payment_status);

CREATE INDEX IF NOT EXISTS idx_products_tenant
  ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_active
  ON products(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_tenant_name
  ON products(tenant_id, name);
CREATE INDEX IF NOT EXISTS idx_products_tenant_sku
  ON products(tenant_id, sku);
CREATE INDEX IF NOT EXISTS idx_products_tenant_category
  ON products(tenant_id, category);

CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant
  ON product_purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant_product_date
  ON product_purchases(tenant_id, product_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant_purchase_date
  ON product_purchases(tenant_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant_shopping_list
  ON product_purchases(tenant_id, shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant_shopping_purchase
  ON product_purchases(tenant_id, shopping_purchase_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_tenant_purchase_type
  ON product_purchases(tenant_id, purchase_type);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant
  ON product_stock_movements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant_product_created
  ON product_stock_movements(tenant_id, product_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant_type_created
  ON product_stock_movements(tenant_id, movement_type, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant_reference
  ON product_stock_movements(tenant_id, reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant_product_purchase
  ON product_stock_movements(tenant_id, product_purchase_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_movements_tenant_event
  ON product_stock_movements(tenant_id, event_id);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_tenant
  ON shopping_lists(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_tenant_created
  ON shopping_lists(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_tenant_name
  ON shopping_lists(tenant_id, name);

CREATE INDEX IF NOT EXISTS idx_shopping_items_tenant
  ON shopping_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_tenant_list
  ON shopping_items(tenant_id, list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_tenant_status
  ON shopping_items(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_shopping_items_tenant_product
  ON shopping_items(tenant_id, product_id);

CREATE INDEX IF NOT EXISTS idx_shopping_purchases_tenant
  ON shopping_purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shopping_purchases_tenant_list
  ON shopping_purchases(tenant_id, list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_purchases_tenant_purchase_date
  ON shopping_purchases(tenant_id, purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_shopping_purchases_tenant_created
  ON shopping_purchases(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shopping_purchase_items_tenant
  ON shopping_purchase_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shopping_purchase_items_tenant_purchase
  ON shopping_purchase_items(tenant_id, purchase_id);
CREATE INDEX IF NOT EXISTS idx_shopping_purchase_items_tenant_product
  ON shopping_purchase_items(tenant_id, product_id);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant
  ON event_product_allocations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant_event
  ON event_product_allocations(tenant_id, event_id);
CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant_product
  ON event_product_allocations(tenant_id, product_id);
CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant_status
  ON event_product_allocations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant_event_status
  ON event_product_allocations(tenant_id, event_id, status);
CREATE INDEX IF NOT EXISTS idx_event_product_allocations_tenant_product_status
  ON event_product_allocations(tenant_id, product_id, status);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant
  ON event_inventory_actions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_event
  ON event_inventory_actions(tenant_id, event_id);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_product
  ON event_inventory_actions(tenant_id, product_id);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_allocation
  ON event_inventory_actions(tenant_id, allocation_id);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_event_type
  ON event_inventory_actions(tenant_id, event_id, action_type);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_product_type
  ON event_inventory_actions(tenant_id, product_id, action_type);
CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_tenant_performed_at
  ON event_inventory_actions(tenant_id, performed_at DESC);
