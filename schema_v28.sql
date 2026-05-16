-- =========================
-- Phase 19F — Strategic Contact Relationship Value
-- Additive Strategic Contacts fields only.
-- Explicitly excluded:
--   - changes to customers/contacts/leads
--   - changes to sales documents, billing, financial summaries, or invoices
--   - revenue automation or links to events/leads
-- =========================

ALTER TABLE strategic_contacts
ADD COLUMN relationship_grade TEXT;

ALTER TABLE strategic_contacts
ADD COLUMN warmth_level TEXT;

ALTER TABLE strategic_contacts
ADD COLUMN estimated_annual_value REAL;

ALTER TABLE strategic_contacts
ADD COLUMN potential_events_per_year INTEGER;

ALTER TABLE strategic_contacts
ADD COLUMN relevant_services TEXT;

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_relationship_grade
 ON strategic_contacts(tenant_id, relationship_grade);

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_warmth_level
 ON strategic_contacts(tenant_id, warmth_level);
