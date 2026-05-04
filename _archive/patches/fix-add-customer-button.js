const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-add-customer-button.js', s, 'utf8');

s = s.replace(
  `<div class="page-title">כרטיסי לקוח <small>לקוחות חוזרים וכל האירועים שלהם</small></div>`,
  `<div class="page-title">כרטיסי לקוח <small>לקוחות חוזרים וכל האירועים שלהם</small></div>
        <button class="btn btn-primary" id="btn-new-customer">+ לקוח חדש</button>`
);

s = s.replace(
  `var custSearch = document.getElementById('customers-search');`,
  `var newCustomerBtn = document.getElementById('btn-new-customer');
  if (newCustomerBtn) newCustomerBtn.addEventListener('click', openLeadModal);

  var custSearch = document.getElementById('customers-search');`
);

fs.writeFileSync(p, s, 'utf8');

console.log('add customer button added');