const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-force-shopping-full.js', s, 'utf8');

// 1. Add sidebar item before calendar nav
if (!s.includes('id="nav-shopping"')) {
  s = s.replace(
    /<div class="nav-item" id="nav-calendar">[\s\S]*?<\/div>/,
    '<div class="nav-item" id="nav-shopping"><span class="nav-icon">🛒</span> רשימות קניות</div>\n    $&'
  );
}

// 2. Add shopping page before calendar page
if (!s.includes('id="page-shopping"')) {
  s = s.replace(
    /<div id="page-calendar" class="page">/,
    `<div id="page-shopping" class="page">
      <div class="page-header">
        <div class="page-title">רשימות קניות <small>חנויות ופריטים לקנייה</small></div>
        <button class="btn btn-primary" id="btn-new-shopping-list">+ חנות חדשה</button>
      </div>

      <div class="table-toolbar">
        <input class="search-input" id="shopping-search" placeholder="חיפוש חנות...">
      </div>

      <div id="shopping-grid" style="padding:16px">
        <div class="dash-empty">אין עדיין רשימות קניות</div>
      </div>
    </div>

    <div id="page-calendar" class="page">`
  );
}

// 3. Add goTo shopping loader
if (!s.includes("if (page === 'shopping') loadShoppingLists();")) {
  s = s.replace(
    /if \(page === 'calendar'\) loadCalendar\(\);/,
    "if (page === 'shopping') loadShoppingLists();\n  if (page === 'calendar') loadCalendar();"
  );
}

// 4. Add shopping nav click after nav-leads click
if (!s.includes("goTo('shopping'")) {
  s = s.replace(
    /document\.getElementById\('nav-leads'\)\.addEventListener\('click', function\(\) \{ goTo\('customers', this\); \}\);/,
    `document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });
  var navShopping = document.getElementById('nav-shopping');
  if (navShopping) navShopping.addEventListener('click', function() { goTo('shopping', this); });`
  );
}

// 5. Minimal loader, if missing
if (!s.includes('function loadShoppingLists()')) {
  s = s.replace(
    'function loadCalendar() {',
    `function loadShoppingLists() {
  var grid = document.getElementById('shopping-grid');
  if (!grid) return;

  apiCall('GET', '/api/shopping-lists').then(function(data) {
    var lists = data.lists || [];

    if (!lists.length) {
      grid.innerHTML = '<div class="dash-empty">אין עדיין רשימות קניות</div>';
      return;
    }

    grid.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">' +
      lists.map(function(l) {
        return '<div class="customer-card">' +
          '<div class="customer-card-name">' + (l.name || 'חנות ללא שם') + '</div>' +
          '<div class="customer-card-meta">' + (l.phone || '') + (l.address ? ' · ' + l.address : '') + '</div>' +
          '<div class="customer-card-stats" style="margin-top:12px">' +
            '<span class="customer-stat-pill">' + (l.items_count || 0) + ' פריטים</span>' +
            '<span class="customer-stat-pill">' + (l.done_count || 0) + ' נקנו</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

function loadCalendar() {`
  );
}

fs.writeFileSync(p, s, 'utf8');

console.log('shopping sidebar/page forced');