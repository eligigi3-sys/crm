const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-force-shopping-sidebar.js', s, 'utf8');

// add sidebar item
const oldSidebar =
`    <div class="nav-item" id="nav-calendar"><span class="nav-icon">≡ƒףו</span> ╫ש╫ץ╫₧╫ƒ ╫נ╫ש╫¿╫ץ╫ó╫ש╫¥</div>`;

const newSidebar =
`    <div class="nav-item" id="nav-shopping"><span class="nav-icon">🛒</span> רשימות קניות</div>
    <div class="nav-item" id="nav-calendar"><span class="nav-icon">≡ƒףו</span> ╫ש╫ץ╫₧╫ƒ ╫נ╫ש╫¿╫ץ╫ó╫ש╫¥</div>`;

if (!s.includes('id="nav-shopping"')) {
  s = s.replace(oldSidebar, newSidebar);
}

// add click event
const oldNav =
`  document.getElementById('nav-dashboard').addEventListener('click', function() { goTo('dashboard', this); });
  document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });
  document.getElementById('nav-calendar').addEventListener('click', function() { goTo('calendar', this); });`;

const newNav =
`  document.getElementById('nav-dashboard').addEventListener('click', function() { goTo('dashboard', this); });
  document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });

  var shoppingNav = document.getElementById('nav-shopping');
  if (shoppingNav) {
    shoppingNav.addEventListener('click', function() {
      goTo('shopping', this);
    });
  }

  document.getElementById('nav-calendar').addEventListener('click', function() { goTo('calendar', this); });`;

s = s.replace(oldNav, newNav);

fs.writeFileSync(p, s, 'utf8');

console.log('shopping sidebar forced');