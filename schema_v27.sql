-- =========================
-- schema_v27.sql
-- Strategic Contact Activities MVP
-- DO NOT RUN without explicit approval.
-- Scope:
--   - add strategic_contact_activities table only
--   - tenant-scoped strategic contact activity timeline
-- Explicitly excluded:
--   - changes to contacts/customer tables
--   - changes to billing profiles, sales documents, invoices, or financial summaries
--   - deletes, campaigns, messaging automation
-- =========================

CREATE TABLE IF NOT EXISTS strategic_contact_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  strategic_contact_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'note',
  channel TEXT,
  summary TEXT NOT NULL,
  activity_at TEXT,
  next_contact_at TEXT,
  created_by_user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_activities_tenant_contact
 ON strategic_contact_activities(tenant_id, strategic_contact_id, activity_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_activities_tenant_created_by
 ON strategic_contact_activities(tenant_id, created_by_user_id);
