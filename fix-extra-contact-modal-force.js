const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-extra-modal-force.js', s, 'utf8');

// מחליף כל פונקציה ישנה של prompt
s = s.replace(
/function openExtraContactPrompt\(customerId\)\s*\{[\s\S]*?\n\}/g,
`
function openExtraContactPrompt(customerId) {
  openExtraContactModal(customerId);
}
`
);

// לוודא שהכפתור + מחובר לחלונית ולא ל-prompt
s = s.replace(
/openExtraContactPrompt\(c\.id\);/g,
'openExtraContactModal(c.id);'
);

fs.writeFileSync(p, s, 'utf8');

console.log('extra contact button forced to modal');