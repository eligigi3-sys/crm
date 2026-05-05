-- =========================
-- schema_v10.sql
-- Product purchase history ledger foundation
-- הרץ רק באישור מפורש, למשל:
-- wrangler d1 execute comics-crm-db --remote --file=schema_v10.sql
-- =========================

CREATE TABLE IF NOT EXISTS product_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  purchase_type TEXT NOT NULL DEFAULT 'manual' CHECK (purchase_type IN ('manual','shopping','import')),
  purchase_date TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  total_price REAL NOT NULL DEFAULT 0,
  shopping_list_id INTEGER,
  shopping_purchase_id INTEGER,
  supplier_name TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_purchases_product_date
  ON product_purchases(product_id, purchase_date DESC);

CREATE INDEX IF NOT EXISTS idx_product_purchases_purchase_date
  ON product_purchases(purchase_date DESC);

CREATE INDEX IF NOT EXISTS idx_product_purchases_shopping_list
  ON product_purchases(shopping_list_id);

CREATE INDEX IF NOT EXISTS idx_product_purchases_shopping_purchase
  ON product_purchases(shopping_purchase_id);

CREATE INDEX IF NOT EXISTS idx_product_purchases_purchase_type
  ON product_purchases(purchase_type);
