const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-image-icons.js', s, 'utf8');

s = s.replace(
  /(<a[^>]*href="https:\/\/wa\.me\/[^"]+"[^>]*>)[\s\S]*?(<\/a>)/g,
  '$1<img src="/whatsapp-icon.png" alt="WhatsApp" style="width:24px;height:24px;object-fit:contain;display:block">$2'
);

s = s.replace(
  /(<a[^>]*href="tel:[^"]+"[^>]*>)[\s\S]*?(<\/a>)/g,
  '$1<img src="/phone-icon.png" alt="Phone" style="width:24px;height:24px;object-fit:contain;display:block">$2'
);

s = s.replace(
  /style="width:24px;height:24px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:var\(--bg\);color:var\(--text2\);border:1px solid var\(--border\);text-decoration:none;font-size:12px"/g,
  'style="width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:none;text-decoration:none"'
);

fs.writeFileSync(p, s, 'utf8');

console.log('contact icons changed to image files');