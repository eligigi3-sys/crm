const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-mail-icon-force.js', s, 'utf8');

const marker = 'grid.innerHTML = html;';

const insert = `
    // mail-icon-force
    setTimeout(function() {
      grid.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
        a.innerHTML = '<img src="/mail-icon.jpg" alt="Mail" style="width:28px;height:28px;object-fit:contain;display:block">';
        a.style.padding = '4px';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
      });
    }, 50);
`;

const start = s.indexOf('function openCustomerCard(id)');
const pos = s.indexOf(marker, start);

if (start < 0 || pos < 0) {
  throw new Error('openCustomerCard grid.innerHTML not found');
}

if (!s.includes('// mail-icon-force')) {
  s = s.slice(0, pos + marker.length) + '\n' + insert + s.slice(pos + marker.length);
}

fs.writeFileSync(p, s, 'utf8');

console.log('mail icon forced');