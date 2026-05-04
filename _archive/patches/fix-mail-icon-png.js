const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-mail-icon-png.js', s, 'utf8');

s = s.replaceAll('/mail-icon.jpg', '/mail-icon.png');

fs.writeFileSync(p, s, 'utf8');

console.log('mail icon switched to png');