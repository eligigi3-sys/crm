const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-extra-contacts-new-line.js', s, 'utf8');

s = s.replace(
  `row.className = 'info-row';`,
  `row.className = 'info-row';
      row.style.display = 'block';
      row.style.marginTop = '10px';`
);

s = s.replace(
  `htmlExtra += '<span class="info-value">';`,
  `htmlExtra += '<div class="info-value" style="display:flex;flex-direction:column;gap:8px;margin-top:6px">';`
);

s = s.replace(
  `htmlExtra += '</span>';`,
  `htmlExtra += '</div>';`
);

s = s.replace(
  `display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:nowrap`,
  `display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--bg2);padding:8px 10px;border-radius:10px`
);

fs.writeFileSync(p, s, 'utf8');

console.log('extra contacts moved to new line');