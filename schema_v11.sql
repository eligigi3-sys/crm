-- =========================
-- schema_v11.sql
-- Shopping -> Product Purchase linking foundation
-- הרץ רק באישור מפורש, למשל:
-- wrangler d1 execute comics-crm-db --remote --file=schema_v11.sql
-- =========================

ALTER TABLE shopping_items
ADD COLUMN product_id INTEGER;

ALTER TABLE shopping_purchase_items
ADD COLUMN product_id INTEGER;

ALTER TABLE product_purchases
ADD COLUMN shopping_purchase_item_id INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_purchases_shopping_purchase_item_unique
  ON product_purchases(shopping_purchase_item_id);
