CREATE TABLE IF NOT EXISTS event_product_allocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  planned_quantity REAL NOT NULL DEFAULT 0,
  reserved_quantity REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'reserved', 'partial', 'fulfilled', 'cancelled')
  ),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (planned_quantity >= 0),
  CHECK (reserved_quantity >= 0),
  CHECK (reserved_quantity <= planned_quantity)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_product_allocations_event_product_unique
  ON event_product_allocations(event_id, product_id);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_event
  ON event_product_allocations(event_id);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_product
  ON event_product_allocations(product_id);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_status
  ON event_product_allocations(status);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_event_status
  ON event_product_allocations(event_id, status);

CREATE INDEX IF NOT EXISTS idx_event_product_allocations_product_status
  ON event_product_allocations(product_id, status);
