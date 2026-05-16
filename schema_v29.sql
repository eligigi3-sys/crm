-- =========================
-- Phase 20A — Strategic Contact Attribution
-- Additive attribution links only.
-- Explicitly excluded:
--   - sales document totals or invoice behavior
--   - billing profiles or financial summary calculations
--   - automatic revenue reporting
-- =========================

CREATE TABLE IF NOT EXISTS strategic_contact_attributions (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 tenant_id INTEGER NOT NULL,
 strategic_contact_id INTEGER NOT NULL,
 contact_id INTEGER,
 lead_id INTEGER,
 event_id INTEGER,
 attribution_type TEXT NOT NULL DEFAULT 'referral',
 notes TEXT,
 created_by_user_id INTEGER,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_attributions_tenant
 ON strategic_contact_attributions(tenant_id);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_attributions_tenant_strategic
 ON strategic_contact_attributions(tenant_id, strategic_contact_id);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_attributions_tenant_contact
 ON strategic_contact_attributions(tenant_id, contact_id);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_attributions_tenant_lead
 ON strategic_contact_attributions(tenant_id, lead_id);

CREATE INDEX IF NOT EXISTS idx_strategic_contact_attributions_tenant_event
 ON strategic_contact_attributions(tenant_id, event_id);
