const fs = require('fs');

const p = 'src/contacts.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/contacts.backup-before-extra-contacts.js', s, 'utf8');

s = s.replace(
  `general_notes,
          created_at,`,
  `general_notes,
          extra_contacts,
          created_at,`
);

s = s.replace(
  `?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
  `?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
);

s = s.replace(
  `b.general_notes || null
    ).run();`,
  `b.general_notes || null,
      b.extra_contacts || null
    ).run();`
);

s = s.replace(
  `general_notes = ?,
         updated_at = CURRENT_TIMESTAMP`,
  `general_notes = ?,
         extra_contacts = ?,
         updated_at = CURRENT_TIMESTAMP`
);

s = s.replace(
  `b.general_notes || null,
      id
    ).run();`,
  `b.general_notes || null,
      b.extra_contacts || null,
      id
    ).run();`
);

fs.writeFileSync(p, s, 'utf8');
console.log('extra_contacts backend patched');