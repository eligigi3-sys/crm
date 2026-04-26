-- הוסף מספרים סידוריים לטבלאות
ALTER TABLE contacts ADD COLUMN contact_num INTEGER;
ALTER TABLE leads ADD COLUMN lead_num INTEGER;

-- צור מספרים לקיימים
UPDATE contacts SET contact_num = id;
UPDATE leads SET lead_num = id;

-- טבלת מונה אוטומטי
CREATE TABLE IF NOT EXISTS counters (
  name TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

-- אתחל מונים לפי הקיים
INSERT OR REPLACE INTO counters (name, value) SELECT 'contacts', MAX(id) FROM contacts;
INSERT OR REPLACE INTO counters (name, value) SELECT 'leads', MAX(id) FROM leads;
