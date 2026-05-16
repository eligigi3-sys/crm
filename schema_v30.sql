-- Phase 21C: tenant sidebar/module ordering
ALTER TABLE tenant_modules ADD COLUMN sort_order INTEGER;

UPDATE tenant_modules
SET sort_order = CASE module_key
  WHEN 'leads' THEN 1
  WHEN 'contacts' THEN 2
  WHEN 'employees' THEN 3
  WHEN 'products' THEN 4
  WHEN 'shopping' THEN 5
  WHEN 'reports' THEN 6
  WHEN 'sales_documents' THEN 7
  WHEN 'strategic_contacts' THEN 8
  ELSE 99
END
WHERE sort_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_sort
  ON tenant_modules(tenant_id, sort_order);
