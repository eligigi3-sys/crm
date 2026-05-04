const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-render-extra-contacts.js', s, 'utf8');

const marker = "html += '<div class=\"info-row\"><span class=\"info-label\">╫₧╫ש╫ש╫£</span><span class=\"info-value\">' + (c.email || 'Γאפ');";

const insert = `
    var extraContactsToShow = parseExtraContactsSafe(c.extra_contacts);
    if (extraContactsToShow.length) {
      html += '<div class="info-row"><span class="info-label">אנשי קשר נוספים</span><span class="info-value">';
      extraContactsToShow.forEach(function(ec) {
        var cleanExtraPhone = String(ec.phone || '').replace(/[^0-9]/g, '');
        var extraWa = cleanExtraPhone.replace(/^0/, '972');

        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;flex-wrap:nowrap">';
        html += '<span style="font-weight:700;color:var(--text)">' + (ec.name || 'איש קשר') + '</span>';
        html += '<span style="font-weight:600;color:var(--text)">' + (ec.phone || '') + '</span>';

        if (ec.phone) {
          html += '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + extraWa + '" style="padding:4px"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
          html += '<a class="btn btn-ghost btn-sm" href="tel:' + ec.phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
        }

        html += '</div>';
      });
      html += '</span></div>';
    }

`;

if (!s.includes('אנשי קשר נוספים')) {
  if (!s.includes(marker)) throw new Error('email row marker not found');
  s = s.replace(marker, insert + marker);
}

fs.writeFileSync(p, s, 'utf8');

console.log('extra contacts render added');