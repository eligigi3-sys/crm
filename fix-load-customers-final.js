const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-load-customers-final.js', s, 'utf8');

const start = s.indexOf('function loadCustomers() {');
const end = s.indexOf('function openCustomerCard', start);

if (start < 0 || end < 0) {
  throw new Error('loadCustomers block not found');
}

const block = [
"function loadCustomers() {",
"  var search = document.getElementById('customers-search') ? document.getElementById('customers-search').value : '';",
"  var statusFilter = document.getElementById('customers-filter-status') ? document.getElementById('customers-filter-status').value : '';",
"  var typeFilter = document.getElementById('customers-filter-type') ? document.getElementById('customers-filter-type').value : '';",
"  var sortBy = document.getElementById('customers-sort') ? document.getElementById('customers-sort').value : '';",
"",
"  apiCall('GET', '/api/contacts?search=' + encodeURIComponent(search)).then(function(data) {",
"    var grid = document.getElementById('customers-grid');",
"    if (!grid) return;",
"",
"    var contacts = data.contacts || [];",
"",
"    if (statusFilter) {",
"      contacts = contacts.filter(function(c) {",
"        return String(c.status || 'active') === String(statusFilter);",
"      });",
"    }",
"",
"    if (typeFilter) {",
"      contacts = contacts.filter(function(c) {",
"        return String(c.customer_type || 'פרטי') === String(typeFilter);",
"      });",
"    }",
"",
"    if (sortBy === 'name') {",
"      contacts.sort(function(a,b) { return String(a.name || '').localeCompare(String(b.name || ''), 'he'); });",
"    }",
"",
"    if (sortBy === 'events') {",
"      contacts.sort(function(a,b) { return Number(b.events_count || 0) - Number(a.events_count || 0); });",
"    }",
"",
"    if (sortBy === 'revenue') {",
"      contacts.sort(function(a,b) { return Number(b.revenue || 0) - Number(a.revenue || 0); });",
"    }",
"",
"    if (sortBy === 'next_event') {",
"      contacts.sort(function(a,b) {",
"        var ad = a.next_event_date || '9999-12-31';",
"        var bd = b.next_event_date || '9999-12-31';",
"        return String(ad).localeCompare(String(bd));",
"      });",
"    }",
"",
"    if (!contacts.length) {",
"      var msg = 'אין לקוחות להצגה';",
"      if (statusFilter) msg = 'אין כרגע לקוחות בסטטוס שנבחר';",
"      if (typeFilter) msg = 'אין כרגע לקוחות מסוג הלקוח שנבחר';",
"      if (statusFilter && typeFilter) msg = 'אין כרגע לקוחות שמתאימים לסינון שבחרת';",
"      grid.innerHTML = '<div class=\"dash-empty\">' + msg + '</div>';",
"      return;",
"    }",
"",
"    grid.innerHTML = '<div style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px\">' +",
"      contacts.map(function(c) {",
"        return '<div class=\"customer-card\" data-cid=\"' + c.id + '\">' +",
"          '<div style=\"display:flex;justify-content:space-between;align-items:flex-start;gap:8px\">' +",
"            '<div>' +",
"              '<div class=\"customer-card-name\">' + (c.name || 'לקוח ללא שם') + '</div>' +",
"              '<div class=\"customer-card-meta\">' + (c.phone || '') + (c.email ? ' · ' + c.email : '') + '</div>' +",
"            '</div>' +",
"            '<span class=\"badge badge-purple\">C-' + String(c.contact_num || c.id).padStart(3,'0') + '</span>' +",
"          '</div>' +",
"          '<div class=\"customer-card-stats\">' +",
"            '<span class=\"customer-stat-pill\">' + (c.events_count || 0) + ' אירועים</span>' +",
"            '<span class=\"customer-stat-pill\">₪' + fmtMoney(c.revenue || 0) + '</span>' +",
"          '</div>' +",
"          '<div style=\"display:flex;gap:6px;flex-wrap:wrap;margin-top:4px\">' +",
"            '<span class=\"badge badge-purple\">' + (c.customer_type || 'פרטי') + '</span>' +",
"            '<span class=\"badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '\">' + getStatusLabel(c.status || 'active') + '</span>' +",
"          '</div>' +",
"          (c.next_event_date ? '<div class=\"customer-card-meta\">אירוע קרוב: ' + formatDate(c.next_event_date) + '</div>' : '') +",
"        '</div>';",
"      }).join('') + '</div>';",
"",
"    grid.querySelectorAll('.customer-card[data-cid]').forEach(function(card) {",
"      card.addEventListener('click', function() {",
"        openCustomerCard(parseInt(this.getAttribute('data-cid')));",
"      });",
"    });",
"  }).catch(function(e) { toast(e.message, 'error'); });",
"}",
"",
].join('\\n');

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('loadCustomers final fixed');