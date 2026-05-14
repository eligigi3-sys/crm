-- =========================
-- schema_v18.sql
-- Tenant contact fields foundation for Super Admin onboarding
-- DO NOT RUN without explicit approval.
-- Scope:
--   - add minimal tenant contact fields only
-- Explicitly excluded:
--   - backfill
--   - UI changes
--   - owner creation
--   - auth/RBAC changes
--   - onboarding flow implementation
-- =========================

ALTER TABLE tenants ADD COLUMN contact_name TEXT;
ALTER TABLE tenants ADD COLUMN contact_phone TEXT;
ALTER TABLE tenants ADD COLUMN contact_email TEXT;
