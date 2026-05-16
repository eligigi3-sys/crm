-- =========================
-- schema_v25.sql
-- Strategic Contacts MVP foundation
-- DO NOT RUN without explicit approval.
-- Scope:
--   - create strategic_contacts table only
--   - add tenant-scoped indexes
-- Explicitly excluded:
--   - changes to existing customer/contact/lead/sales document tables
--   - activity timeline tables
--   - campaign/holiday/message automation
-- =========================

CREATE TABLE IF NOT EXISTS strategic_contacts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 tenant_id INTEGER NOT NULL,

 organization_name TEXT NOT NULL,
 contact_person_name TEXT,
 role_title TEXT,

 category TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new',
 priority TEXT NOT NULL DEFAULT 'normal',

 phone TEXT,
 whatsapp TEXT,
 email TEXT,
 website TEXT,

 city TEXT,
 area TEXT,

 preferred_channel TEXT,
 source TEXT,
 tags TEXT,

 last_contact_at TEXT,
 next_contact_at TEXT,
 followup_reason TEXT,
 notes TEXT,

 active INTEGER NOT NULL DEFAULT 1,

 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant
 ON strategic_contacts(tenant_id);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_category
 ON strategic_contacts(tenant_id, category);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_status
 ON strategic_contacts(tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_next_contact
 ON strategic_contacts(tenant_id, next_contact_at);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_priority
 ON strategic_contacts(tenant_id, priority);
