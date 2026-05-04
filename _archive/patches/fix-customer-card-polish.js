const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-customer-card-polish.js', s, 'utf8');

// remove customer number badge from customer cards
s = s.replace(
  `'<span class="badge badge-purple">C-' + String(c.contact_num || c.id).padStart(3,'0') + '</span>' +`,
  `'' +`
);

// make next event date blue and more visible
s = s.replace(
  `(c.next_event_date ? '<div class="customer-card-meta">אירוע קרוב: ' + formatDate(c.next_event_date) + '</div>' : '') +`,
  `(c.next_event_date ? '<div class="customer-card-meta" style="color:var(--blue);font-weight:700;margin-top:6px">אירוע קרוב: ' + formatDate(c.next_event_date) + '</div>' : '') +`
);

fs.writeFileSync(p, s, 'utf8');

console.log('customer cards polished');