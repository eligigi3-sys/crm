-- =========================
-- schema_v13.sql
-- Product purchase intake idempotency guard
-- הרץ רק באישור מפורש, למשל:
-- wrangler d1 execute comics-crm-db --remote --file=schema_v13.sql
-- =========================

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stock_movements_purchase_intake_unique
  ON product_stock_movements(product_purchase_id)
  WHERE movement_type = 'purchase_intake'
    AND product_purchase_id IS NOT NULL;
