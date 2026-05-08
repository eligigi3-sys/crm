-- =========================
-- schema_v12.sql
-- Product stock movement ledger foundation
-- הרץ רק באישור מפורש, למשל:
-- wrangler d1 execute comics-crm-db --remote --file=schema_v12.sql
-- =========================

CREATE TABLE IF NOT EXISTS product_stock_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('adjustment','purchase_intake','event_usage','correction')),
  quantity_change REAL NOT NULL CHECK (quantity_change <> 0),
  reference_type TEXT CHECK (reference_type IS NULL OR reference_type IN ('manual','product_purchase','event','shopping','import')),
  reference_id INTEGER,
  product_purchase_id INTEGER,
  event_id INTEGER,
  reason TEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_product_created
  ON product_stock_movements(product_id, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_type_created
  ON product_stock_movements(movement_type, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_reference
  ON product_stock_movements(reference_type, reference_id);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_product_purchase
  ON product_stock_movements(product_purchase_id);

CREATE INDEX IF NOT EXISTS idx_product_stock_movements_event
  ON product_stock_movements(event_id);
