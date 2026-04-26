-- ============================================================
-- CRM אטרקציות לאירועים - Schema v2
-- הרץ: wrangler d1 execute comics-crm-db --file=schema_v2.sql --remote
-- ============================================================

-- מחיקת טבלאות ישנות
DROP TABLE IF EXISTS communications;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS contacts;

-- טבלת לקוחות / עסקאות (הכל במקום אחד)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- פרטי לקוח
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,

  -- פרטי האירוע
  event_type TEXT, -- חתונה / בר מצווה / יום הולדת / אירוע חברה / ברית / הפרשת חלה / אחר
  event_date TEXT,
  event_time TEXT,
  venue TEXT,

  -- אטרקציות
  attractions TEXT, -- JSON array: ["בלונים","עמדת צילום","צילום מגנטים","זיקוקים"]

  -- כספים
  price REAL DEFAULT 0,
  deposit REAL DEFAULT 0,       -- מקדמה ששולמה
  deposit_date TEXT,            -- תאריך קבלת מקדמה
  balance_paid INTEGER DEFAULT 0, -- 0/1 האם שולם יתרה

  -- סטטוס
  status TEXT DEFAULT 'lead',  -- lead / quote / closed / cancelled

  -- תקשורת
  last_contact TEXT,
  next_contact TEXT,

  -- פרטים נוספים
  details TEXT,
  notes TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- טבלת הערות / פעילות לכל ליד
CREATE TABLE IF NOT EXISTS lead_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- טבלת משתמשים (נשאר)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO users (name, email, password_hash, role)
VALUES ('מנהל', 'eligigi3@gmail.com', 'Eg0545711282!', 'admin');

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_event_date ON leads(event_date);
CREATE INDEX IF NOT EXISTS idx_leads_next_contact ON leads(next_contact);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id);
