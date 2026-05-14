-- =========================
-- schema_v20.sql
-- Super Admin audit log foundation
-- DO NOT RUN without explicit approval.
-- Scope:
--   - create admin_audit_logs table only
-- Explicitly excluded:
--   - backfill
--   - tenant business data changes
--   - permissions changes
-- =========================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id INTEGER,
  actor_email TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id INTEGER,
  target_slug TEXT,
  details_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at
  ON admin_audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target
  ON admin_audit_logs(target_type, target_id, created_at DESC);
