-- =========================
-- schema_v17.sql
-- Tenant modules schema foundation only
-- DO NOT RUN without explicit approval.
-- Scope:
--   - create tenant_modules table
--   - add indexes for future Super Admin module toggles
-- Explicitly excluded:
--   - seed data
--   - backend enforcement
--   - UI changes
--   - permissions changes
--   - Google/app_settings changes
--   - billing/onboarding changes
-- Future default behavior (application-level, not enforced here):
--   - missing row = enabled
-- Planned initial module keys (not inserted by this migration):
--   - leads
--   - contacts
--   - employees
--   - products
--   - shopping
--   - reports
-- =========================

CREATE TABLE IF NOT EXISTS tenant_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  module_key TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_modules_tenant_module_unique
  ON tenant_modules(tenant_id, module_key);

CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant
  ON tenant_modules(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_enabled
  ON tenant_modules(tenant_id, is_enabled);
