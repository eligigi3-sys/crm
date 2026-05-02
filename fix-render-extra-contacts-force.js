const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-render-extra-force.js', s, 'utf8');

const marker = 'grid.innerHTML = html;';

const insert = `
    // render-extra-contacts-force
    setTimeout(function() {
      var extra = [];
      try {
        extra = c.extra_contacts ? JSON.parse(c.extra_contacts) : [];
        if (!Array.isArray(extra)) extra = [];
      } catch(e) {
        extra = [];
      }

      if (!extra.length) return;
      if (document.getElementById('extra-contacts-row')) return;

      var phoneLink = grid.querySelector('a[href^="tel:"]');
      var phoneRow = phoneLink ? phoneLink.closest('.info-row') : null;
      if (!phoneRow) return;

      var row = document.createElement('div');
      row.className = 'info-row';
      row.id = 'extra-contacts-row';

      var htmlExtra = '<span class="info-label">אנשי קשר נוספים</span>';
      htmlExtra += '<span class="info-value">';

      extra.forEach(function(ec) {
        var phone = ec.phone || '';
        var clean = String(phone).replace(/[^0-9]/g, '');
        var wa = clean.replace(/^0/, '972');

        htmlExtra += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:nowrap">';
        htmlExtra += '<span style="font-weight:700;color:var(--text);white-space:nowrap">' + (ec.name || 'איש קשר') + '</span>';
        htmlExtra += '<span style="font-weight:600;color:var(--text);white-space:nowrap">' + phone + '</span>';

        if (phone) {
          htmlExtra += '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + wa + '" style="padding:4px"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
          htmlExtra += '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
        }

        htmlExtra += '</div>';
      });

      htmlExtra += '</span>';
      row.innerHTML = htmlExtra;

      phoneRow.insertAdjacentElement('afterend', row);
    }, 120);
`;

const start = s.indexOf('function openCustomerCard(id)');
const pos = s.indexOf(marker, start);

if (start < 0 || pos < 0) {
  throw new Error('openCustomerCard grid.innerHTML not found');
}

if (!s.includes('// render-extra-contacts-force')) {
  s = s.slice(0, pos + marker.length) + '\n' + insert + s.slice(pos + marker.length);
}

fs.writeFileSync(p, s, 'utf8');

console.log('extra contacts force render added');