const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-filters-logic.js', s, 'utf8');

const oldBlock = `  apiCall('GET', '/api/contacts?search=' + encodeURIComponent(search)).then(function(data) {
    var grid = document.getElementById('customers-grid');`;

const newBlock = `  apiCall('GET', '/api/contacts?search=' + encodeURIComponent(search)).then(function(data) {
    var statusFilter = document.getElementById('customers-filter-status') ? document.getElementById('customers-filter-status').value : '';
    var typeFilter = document.getElementById('customers-filter-type') ? document.getElementById('customers-filter-type').value : '';
    var sortBy = document.getElementById('customers-sort') ? document.getElementById('customers-sort').value : '';

    if (statusFilter) {
      data.contacts = (data.contacts || []).filter(function(c) {
        return String(c.status || 'active') === String(statusFilter);
      });
    }

    if (typeFilter) {
      data.contacts = (data.contacts || []).filter(function(c) {
        return String(c.customer_type || 'פרטי') === String(typeFilter);
      });
    }

    if (sortBy === 'name') {
      data.contacts = (data.contacts || []).sort(function(a,b) {
        return String(a.name || '').localeCompare(String(b.name || ''), 'he');
      });
    }

    if (sortBy === 'events') {
      data.contacts = (data.contacts || []).sort(function(a,b) {
        return Number(b.events_count || 0) - Number(a.events_count || 0);
      });
    }

    if (sortBy === 'revenue') {
      data.contacts = (data.contacts || []).sort(function(a,b) {
        return Number(b.revenue || 0) - Number(a.revenue || 0);
      });
    }

    if (sortBy === 'next_event') {
      data.contacts = (data.contacts || []).sort(function(a,b) {
        var ad = a.next_event_date || '9999-99-99';
        var bd = b.next_event_date || '9999-99-99';
        return String(ad).localeCompare(String(bd));
      });
    }

    var grid = document.getElementById('customers-grid');`;

if (!s.includes(oldBlock)) {
  throw new Error('loadCustomers api block not found');
}

s = s.replace(oldBlock, newBlock);

const oldSearchListener = `if (custSearch) custSearch.addEventListener('input', function() {
    clearTimeout(searchTimer); searchTimer = setTimeout(loadCustomers, 300);
  });`;

const newSearchListener = `if (custSearch) custSearch.addEventListener('input', function() {
    clearTimeout(searchTimer); searchTimer = setTimeout(loadCustomers, 300);
  });

  ['customers-filter-status','customers-filter-type','customers-sort'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', loadCustomers);
  });`;

if (!s.includes(oldSearchListener)) {
  throw new Error('customers search listener block not found');
}

s = s.replace(oldSearchListener, newSearchListener);

fs.writeFileSync(p, s, 'utf8');

console.log('customer filters logic added');