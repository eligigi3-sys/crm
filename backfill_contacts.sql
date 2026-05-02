INSERT INTO contacts (name, phone, email, customer_type, status)
SELECT 
  l.name,
  l.phone,
  l.email,
  'פרטי',
  'active'
FROM leads l
LEFT JOIN contacts c
  ON (c.phone = l.phone AND l.phone IS NOT NULL AND l.phone != '')
  OR (c.email = l.email AND l.email IS NOT NULL AND l.email != '')
WHERE c.id IS NULL;

UPDATE leads
SET contact_id = (
  SELECT c.id FROM contacts c
  WHERE 
    (c.phone = leads.phone AND leads.phone IS NOT NULL AND leads.phone != '')
    OR
    (c.email = leads.email AND leads.email IS NOT NULL AND leads.email != '')
  LIMIT 1
)
WHERE contact_id IS NULL;