CREATE TABLE IF NOT EXISTS event_inventory_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  allocation_id INTEGER,
  product_id INTEGER NOT NULL,
  action_type TEXT NOT NULL CHECK (
    action_type IN ('usage', 'return', 'damage', 'loss')
  ),
  quantity REAL NOT NULL CHECK (quantity > 0),
  note TEXT,
  performed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_event
  ON event_inventory_actions(event_id);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_product
  ON event_inventory_actions(product_id);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_allocation
  ON event_inventory_actions(allocation_id);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_event_type
  ON event_inventory_actions(event_id, action_type);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_product_type
  ON event_inventory_actions(product_id, action_type);

CREATE INDEX IF NOT EXISTS idx_event_inventory_actions_performed_at
  ON event_inventory_actions(performed_at);

ALTER TABLE product_stock_movements
  ADD COLUMN event_inventory_action_id INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stock_movements_event_inventory_action_unique
  ON product_stock_movements(event_inventory_action_id)
  WHERE event_inventory_action_id IS NOT NULL;
