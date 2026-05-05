-- =========================
-- schema_v9.sql
-- Products module foundation
-- הרץ: wrangler d1 execute comics-crm-db --file=schema_v9.sql --remote
-- =========================

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  sku TEXT,
  unit TEXT,
  cost_price REAL,
  sale_price REAL,
  stock_quantity REAL NOT NULL DEFAULT 0,
  min_stock_alert REAL,
  notes TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
