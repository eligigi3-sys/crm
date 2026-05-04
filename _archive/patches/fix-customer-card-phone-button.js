const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-phone-button.js', s, 'utf8');

// מחליף את שורת הטלפון בכרטיס לקוח
s = s.replace(
  /'<div class="info-row"><span class="info-label">טלפון<\/span><span class="info-value">[\s\S]*?<\/span><\/div>'/,
  `'<div class="info-row"><span class="info-label">טלפון</span><span class="info-value" style="display:flex;align-items:center;gap:8px">' +
    '<span>' + (c.phone || '') + '</span>' +
    (c.phone ? '<a onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + String(c.phone).replace(/[^0-9]/g,'').replace(/^0/,'972') + '"><img src="/whatsapp-icon.png" style="width:28px;height:28px"></a>' : '') +
    (c.phone ? '<a onclick="event.stopPropagation()" href="tel:' + c.phone + '"><img src="/phone-icon.png" style="width:28px;height:28px"></a>' : '') +
  '</span></div>'`
);

fs.writeFileSync(p, s, 'utf8');

console.log('phone button added to customer card');