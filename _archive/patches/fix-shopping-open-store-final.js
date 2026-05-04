const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-shopping-open-store-final.js', s, 'utf8');

const start = s.indexOf('function loadShoppingLists()');
const end = s.indexOf('function loadCalendar()', start);

if (start < 0 || end < 0) {
  throw new Error('loadShoppingLists/loadCalendar not found');
}

const block = `
function loadShoppingLists() {
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
        return '<div class="customer-card" data-shopping-id="' + l.id + '" style="cursor:pointer">' +
          '<div class="customer-card-name">' + (l.name || 'חנות ללא שם') + '</div>' +
          '<div class="customer-card-meta">' + (l.contact_name || '') + (l.contact_phone ? ' · ' + l.contact_phone : '') + '</div>' +
          '<div class="customer-card-meta">' + (l.address || '') + '</div>' +
          '<div class="customer-card-stats" style="margin-top:12px">' +
            '<span class="customer-stat-pill">' + (l.items_count || 0) + ' פריטים</span>' +
            '<span class="customer-stat-pill">' + (l.done_count || 0) + ' נקנו</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';

    grid.querySelectorAll('[data-shopping-id]').forEach(function(card) {
      card.onclick = function() {
        openShoppingList(parseInt(this.getAttribute('data-shopping-id')));
      };
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

function openShoppingList(id) {
  apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
    var grid = document.getElementById('shopping-grid');
    if (!grid) return;

    var list = data.list || {};
    var items = data.items || [];
    var purchases = data.purchases || [];
    var summary = data.summary || {};

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-shopping">← חזרה לחנויות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר לרשימה</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">';

    html += '<div>';

    html += '<div class="contact-card">';
    html += '<div class="contact-card-header"><div>';
    html += '<div class="contact-card-name">' + (list.name || 'חנות') + '</div>';
    html += '<div class="contact-card-meta">' + (list.address || '') + '</div>';
    html += '</div><span class="badge badge-purple">' + items.length + ' פריטים</span></div>';

    html += '<div class="info-section"><div class="info-section-title">פרטי חנות</div>';
    html += '<div class="info-row"><span class="info-label">איש קשר</span><span class="info-value">' + (list.contact_name || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (list.contact_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון נוסף</span><span class="info-value">' + (list.extra_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">שעות פתיחה</span><span class="info-value">' + (list.opening_hours || '—') + '</span></div>';
    html += '</div></div>';

    html += '<div class="stats-grid" style="margin-top:16px">';
    html += '<div class="stat-card"><div class="stat-label">החודש</div><div class="stat-value">₪' + fmtMoney(summary.current_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">חודש שעבר</div><div class="stat-value">₪' + fmtMoney(summary.previous_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">מתחילת השנה</div><div class="stat-value">₪' + fmtMoney(summary.year_total || 0) + '</div></div>';
    html += '</div>';

    html += '<div class="table-card" style="margin-top:16px">';
    html += '<div class="table-toolbar"><strong>רשימת קניות פעילה</strong></div>';

    if (!items.length) {
      html += '<div class="dash-empty">אין מוצרים ברשימה</div>';
    } else {
      html += '<table><thead><tr><th>מוצר</th><th>כמות</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
      items.forEach(function(it) {
        html += '<tr><td>' + (it.item_name || '') + '</td><td>' + (it.quantity || '') + '</td><td>₪' + fmtMoney(it.price || 0) + '</td><td>' + (it.status || 'pending') + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    html += '<div class="table-card">';
    html += '<div class="table-toolbar"><strong>עסקאות קודמות</strong></div>';

    if (!purchases.length) {
      html += '<div class="dash-empty">אין עסקאות קודמות</div>';
    } else {
      html += '<table><thead><tr><th>תאריך</th><th>סכום</th><th>הערות</th></tr></thead><tbody>';
      purchases.forEach(function(p) {
        html += '<tr><td>' + (p.purchase_date || '') + '</td><td>₪' + fmtMoney(p.total_amount || 0) + '</td><td>' + (p.notes || '') + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    grid.innerHTML = html;

    document.getElementById('back-to-shopping').onclick = loadShoppingLists;
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('shopping store opening fixed');