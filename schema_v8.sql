-- =========================
-- schema_v8.sql
-- Employees module foundation
-- הרץ: wrangler d1 execute comics-crm-db --file=schema_v8.sql --remote
-- =========================

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  role TEXT,
  hourly_rate REAL,
  birth_date TEXT,
  notes TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  preferred_work_area TEXT,
  payment_method TEXT,
  bank_details_notes TEXT,
  internal_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(full_name);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON employees(phone);

CREATE TABLE IF NOT EXISTS lead_employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  role_on_event TEXT,
  hourly_rate_override REAL,
  hours_planned REAL,
  hours_actual REAL,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_lead_employees_lead ON lead_employees(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_employees_employee ON lead_employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_lead_employees_payment_status ON lead_employees(payment_status);
