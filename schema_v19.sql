-- =========================
-- schema_v19.sql
-- Force initial password change support
-- DO NOT RUN without explicit approval.
-- Scope:
--   - add users.must_change_password flag only
-- Explicitly excluded:
--   - backfill existing users
--   - auth flow rewrites beyond app logic
--   - UI changes
-- =========================

ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;
