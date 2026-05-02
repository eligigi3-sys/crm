const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-phone-row-dom-align.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id)');
const pos = s.indexOf('grid.innerHTML = html;', start);

if (start < 0 || pos < 0) {
  throw new Error('openCustomerCard grid.innerHTML not found');
}

const insert = `
    setTimeout(function() {
      var plusBtn = document.getElementById('add-extra-contact-btn');
      var phoneLink = grid.querySelector('a[href^="tel:"]');

      if (phoneLink) {
        var phoneRow = phoneLink.closest('.info-row');
        var phoneValue = phoneRow ? phoneRow.querySelector('.info-value') : null;

        if (phoneValue) {
          phoneValue.style.display = 'flex';
          phoneValue.style.alignItems = 'center';
          phoneValue.style.gap = '8px';
          phoneValue.style.flexWrap = 'nowrap';

          phoneValue.querySelectorAll('img').forEach(function(img) {
            img.style.width = '28px';
            img.style.height = '28px';
          });

          phoneValue.querySelectorAll('a').forEach(function(a) {
            a.style.display = 'inline-flex';
            a.style.alignItems = 'center';
            a.style.justifyContent = 'center';
            a.style.padding = '4px';
          });

          if (plusBtn) {
            plusBtn.style.padding = '4px 9px';
            plusBtn.style.minWidth = '34px';
            plusBtn.style.height = '34px';
            plusBtn.style.fontWeight = '800';
            phoneValue.appendChild(plusBtn);
          }
        }
      }
    }, 0);
`;

if (!s.includes('phone-row-dom-align')) {
  s = s.slice(0, pos + 'grid.innerHTML = html;'.length) +
      '\n    // phone-row-dom-align' + insert +
      s.slice(pos + 'grid.innerHTML = html;'.length);
}

fs.writeFileSync(p, s, 'utf8');

console.log('phone row DOM align added');