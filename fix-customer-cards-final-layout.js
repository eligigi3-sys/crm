const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-final-card-layout.js', s, 'utf8');

const start = s.indexOf('function loadCustomers()');
const end = s.indexOf('function openCustomerCard', start);

if (start < 0 || end < 0) {
  throw new Error('loadCustomers block not found');
}

const block = `
function loadCustomers() {
  var search = document.getElementById('customers-search') ? document.getElementById('customers-search').value : '';
  var statusFilter = document.getElementById('customers-filter-status') ? document.getElementById('customers-filter-status').value : '';
  var typeFilter = document.getElementById('customers-filter-type') ? document.getElementById('customers-filter-type').value : '';
  var sortBy = document.getElementById('customers-sort') ? document.getElementById('customers-sort').value : '';

  apiCall('GET', '/api/contacts?search=' + encodeURIComponent(search)).then(function(data) {
    var grid = document.getElementById('customers-grid');
    if (!grid) return;

    var contacts = data.contacts || [];

    if (statusFilter) {
      contacts = contacts.filter(function(c) {
        return String(c.status || 'active') === String(statusFilter);
      });
    }

    if (typeFilter) {
      contacts = contacts.filter(function(c) {
        return String(c.customer_type || 'פרטי') === String(typeFilter);
      });
    }

    if (sortBy === 'name') {
      contacts.sort(function(a,b) {
        return String(a.name || '').localeCompare(String(b.name || ''), 'he');
      });
    }

    if (sortBy === 'events') {
      contacts.sort(function(a,b) {
        return Number(b.events_count || 0) - Number(a.events_count || 0);
      });
    }

    if (sortBy === 'revenue') {
      contacts.sort(function(a,b) {
        return Number(b.revenue || 0) - Number(a.revenue || 0);
      });
    }

    if (sortBy === 'next_event') {
      contacts.sort(function(a,b) {
        var ad = a.next_event_date || '9999-12-31';
        var bd = b.next_event_date || '9999-12-31';
        return String(ad).localeCompare(String(bd));
      });
    }

    if (!contacts.length) {
      var msg = 'אין לקוחות להצגה';
      if (statusFilter) msg = 'אין כרגע לקוחות בסטטוס שנבחר';
      if (typeFilter) msg = 'אין כרגע לקוחות מסוג הלקוח שנבחר';
      if (statusFilter && typeFilter) msg = 'אין כרגע לקוחות שמתאימים לסינון שבחרת';
      grid.innerHTML = '<div class="dash-empty">' + msg + '</div>';
      return;
    }

    grid.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">' +
      contacts.map(function(c) {
        var phone = c.phone || '';
        var cleanPhone = String(phone).replace(/[^0-9]/g, '');
        var waPhone = cleanPhone.replace(/^0/, '972');

        return '<div class="customer-card" data-cid="' + c.id + '">' +
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">' +
            '<div style="flex:1">' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-start">' +
                '<div class="customer-card-name">' + (c.name || 'לקוח ללא שם') + '</div>' +
                '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>' +
                '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>' +
              '</div>' +

              '<div class="customer-card-meta" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px">' +
                '<span style="color:var(--text);font-weight:700;font-size:13px">' + phone + '</span>' +
                (phone ? '<a title="WhatsApp" onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + waPhone + '" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:30px;height:30px;object-fit:contain;display:block"></a>' : '') +
                (phone ? '<a title="התקשר" onclick="event.stopPropagation()" href="tel:' + phone + '" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center"><img src="/phone-icon.png" alt="Phone" style="width:30px;height:30px;object-fit:contain;display:block"></a>' : '') +
              '</div>' +

              (c.email ? '<div class="customer-card-meta" style="margin-top:2px;color:var(--text3);font-size:12px">' + c.email + '</div>' : '') +
            '</div>' +
          '</div>' +

          '<div class="customer-card-stats" style="margin-top:12px">' +
            '<span class="customer-stat-pill">' + (c.events_count || 0) + ' אירועים</span>' +
            '<span class="customer-stat-pill" style="color:var(--green);font-weight:800">₪' + fmtMoney(c.revenue || 0) + ' סה״כ הכנסות</span>' +
          '</div>' +

          (c.next_event_date ? '<div class="customer-card-meta" style="color:var(--blue);font-weight:800;margin-top:10px;font-size:13px">אירוע קרוב: ' + formatDate(c.next_event_date) + '</div>' : '') +
        '</div>';
      }).join('') + '</div>';

    grid.querySelectorAll('.customer-card[data-cid]').forEach(function(card) {
      card.addEventListener('click', function() {
        openCustomerCard(parseInt(this.getAttribute('data-cid')));
      });
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('customer cards final layout applied');