-- =========================
-- schema_v26.sql
-- Link Strategic Contacts to existing customers/contacts
-- DO NOT RUN without explicit approval.
-- Scope:
--   - add nullable linked_contact_id to strategic_contacts only
--   - add tenant-scoped lookup index
-- Explicitly excluded:
--   - changes to contacts/customer tables
--   - changes to billing profiles, sales documents, invoices, or financial summaries
--   - customer conversion/move/bulk operations
-- =========================

ALTER TABLE strategic_contacts
ADD COLUMN linked_contact_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_strategic_contacts_tenant_linked_contact
 ON strategic_contacts(tenant_id, linked_contact_id);
