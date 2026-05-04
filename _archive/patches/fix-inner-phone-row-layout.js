const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-inner-phone-row-layout.js', s, 'utf8');

s = s.replace(
  `html += '<div class="info-row"><span class="info-label">╫ר╫£╫ñ╫ץ╫ƒ</span><span class="info-value">' + (c.phone || 'Γאפ');
    if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a> <a class="btn btn-ghost btn-sm" href="tel:' + c.phone + '"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a> <button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" style="padding:6px 10px;font-weight:800">+</button>';
    html += '</span></div>';`,
  `html += '<div class="info-row" style="align-items:center"><span class="info-label">טלפון</span><span class="info-value" style="display:flex;align-items:center;gap:8px;flex-wrap:nowrap">' + 
    '<span style="font-weight:700;color:var(--text);min-width:max-content">' + (c.phone || '—') + '</span>';
    if (c.phone) html += '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '" style="padding:4px"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a>' +
      '<a class="btn btn-ghost btn-sm" href="tel:' + c.phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
    html += '<button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" style="padding:4px 9px;font-weight:800;min-width:34px;height:34px">+</button>';
    html += '</span></div>';`
);

fs.writeFileSync(p, s, 'utf8');

console.log('inner phone row aligned');