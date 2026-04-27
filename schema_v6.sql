-- =========================
-- schema_v6.sql
-- הרחבת טבלת contacts
-- =========================

ALTER TABLE contacts ADD COLUMN customer_type TEXT;        -- פרטי / עסקי / מפיק/ספק
ALTER TABLE contacts ADD COLUMN status TEXT;               -- סטטוס לקוח
ALTER TABLE contacts ADD COLUMN tags TEXT;                 -- תגיות (JSON string)
ALTER TABLE contacts ADD COLUMN last_contact_date TEXT;    -- קשר אחרון
ALTER TABLE contacts ADD COLUMN next_contact_date TEXT;    -- קשר קרוב
ALTER TABLE contacts ADD COLUMN general_notes TEXT;        -- הערות כלליות
