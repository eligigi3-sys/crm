-- schema_v31.sql
-- Print approval queue: guest uploads are stored as pending print requests until admin approval.

CREATE TABLE IF NOT EXISTS print_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'guest',
  guest_name TEXT,
  guest_phone TEXT,
  event_id INTEGER,
  image_url TEXT,
  image_data TEXT,
  text_content TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  admin_note TEXT,
  external_ref TEXT,
  metadata_json TEXT,
  approved_by_user_id INTEGER,
  approved_at DATETIME,
  rejected_by_user_id INTEGER,
  rejected_at DATETIME,
  printed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_print_requests_tenant_status_created
  ON print_requests(tenant_id, status, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_print_requests_tenant_event
  ON print_requests(tenant_id, event_id);

CREATE INDEX IF NOT EXISTS idx_print_requests_tenant_external_ref
  ON print_requests(tenant_id, external_ref);
