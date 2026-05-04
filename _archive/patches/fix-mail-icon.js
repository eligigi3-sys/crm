const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-mail-icon.js', s, 'utf8');

// מחליף את כפתור המייל הישן
s = s.replace(
  `if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '">╫⌐╫£╫ק ╫₧╫ש╫ש╫£</a>';`,
  `if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '" style="padding:4px"><img src="/mail-icon.jpg" alt="Mail" style="width:28px;height:28px;object-fit:contain;display:block"></a>';`
);

fs.writeFileSync(p, s, 'utf8');

console.log('mail icon replaced');
