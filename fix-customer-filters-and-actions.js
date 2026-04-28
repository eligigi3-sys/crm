const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-customer-filter-actions.js', s, 'utf8');

// 1) make filters trigger loadCustomers immediately
s = s.replace(
  'id="customers-filter-status"',
  'id="customers-filter-status" onchange="loadCustomers()"'
);

s = s.replace(
  'id="customers-filter-type"',
  'id="customers-filter-type" onchange="loadCustomers()"'
);

s = s.replace(
  'id="customers-sort"',
  'id="customers-sort" onchange="loadCustomers()"'
);

// 2) add WhatsApp + phone icons to customer cards phone row
s = s.replace(
  `'<div class="customer-card-meta">' + (c.phone || '') + (c.email ? ' · ' + c.email : '') + '</div>' +`,
  `'<div class="customer-card-meta" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
    '<span>' + (c.phone || '') + '</span>' +
    (c.phone ? '<a title="WhatsApp" onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + String(c.phone).replace(/[^0-9]/g, '').replace(/^0/, '972') + '" style="text-decoration:none">💬</a>' : '') +
    (c.phone ? '<a title="התקשר" onclick="event.stopPropagation()" href="tel:' + c.phone + '" style="text-decoration:none">📞</a>' : '') +
    (c.email ? '<span> · ' + c.email + '</span>' : '') +
  '</div>' +`
);

fs.writeFileSync(p, s, 'utf8');

console.log('customer filters + actions fixed');