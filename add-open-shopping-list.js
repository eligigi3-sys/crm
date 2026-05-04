const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync(
  'src/ui.backup-before-open-shopping-list.js',
  s,
  'utf8'
);

const code = `

function openShoppingList(id) {

  apiCall('GET', '/api/shopping-lists/' + id)
  .then(function(data) {

    var list = data.list || {};
    var items = data.items || [];
    var purchases = data.purchases || [];
    var summary = data.summary || {};

    var grid = document.getElementById('shopping-grid');

    if (!grid) return;

    var html = '';

    html += '<div style="display:grid;grid-template-columns:1.1fr 0.9fr;gap:16px">';

    // RIGHT SIDE
    html += '<div>';

    html += '<div class="table-card">';

    html += '<div class="page-title">' + (list.name || 'חנות') + '</div>';

    html += '<div class="info-row"><span class="info-label">איש קשר</span><span class="info-value">' + (list.contact_name || '—') + '</span></div>';

    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (list.contact_phone || '—') + '</span></div>';

    html += '<div class="info-row"><span class="info-label">טלפון נוסף</span><span class="info-value">' + (list.extra_phone || '—') + '</span></div>';

    html += '<div class="info-row"><span class="info-label">כתובת</span><span class="info-value">' + (list.address || '—') + '</span></div>';

    html += '<div class="info-row"><span class="info-label">שעות פתיחה</span><span class="info-value">' + (list.opening_hours || '—') + '</span></div>';

    html += '</div>';

    // SUMMARY
    html += '<div class="table-card" style="margin-top:16px">';

    html += '<div class="info-section-title">סיכום הוצאות</div>';

    html += '<div class="stats-grid">';

    html += '<div class="stat-card"><div class="stat-label">החודש</div><div class="stat-value">₪' + Number(summary.current_month || 0).toLocaleString('he-IL') + '</div></div>';

    html += '<div class="stat-card"><div class="stat-label">חודש שעבר</div><div class="stat-value">₪' + Number(summary.previous_month || 0).toLocaleString('he-IL') + '</div></div>';

    html += '<div class="stat-card"><div class="stat-label">מתחילת השנה</div><div class="stat-value">₪' + Number(summary.year_total || 0).toLocaleString('he-IL') + '</div></div>';

    html += '</div>';

    html += '</div>';

    // SHOPPING LIST
    html += '<div class="table-card" style="margin-top:16px">';

    html += '<div class="table-toolbar" style="justify-content:space-between">';

    html += '<strong>רשימת קניות פעילה</strong>';

    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר</button>';

    html += '</div>';

    if (!items.length) {

      html += '<div class="dash-empty">אין מוצרים ברשימה</div>';

    } else {

      html += '<table>';

      html += '<thead><tr><th>מוצר</th><th>כמות</th><th>מחיר</th><th>סטטוס</th></tr></thead>';

      html += '<tbody>';

      items.forEach(function(item) {

        html += '<tr>';

        html += '<td>' + (item.item_name || '') + '</td>';

        html += '<td>' + (item.quantity || '') + '</td>';

        html += '<td>₪' + Number(item.price || 0).toLocaleString('he-IL') + '</td>';

        html += '<td>' + (item.status || 'pending') + '</td>';

        html += '</tr>';

      });

      html += '</tbody></table>';
    }

    html += '</div>';

    html += '</div>';

    // LEFT SIDE
    html += '<div>';

    html += '<div class="table-card">';

    html += '<div class="table-toolbar">';

    html += '<strong>עסקאות קודמות</strong>';

    html += '</div>';

    if (!purchases.length) {

      html += '<div class="dash-empty">אין עסקאות קודמות</div>';

    } else {

      html += '<table>';

      html += '<thead><tr><th>תאריך</th><th>סכום</th><th>הערות</th></tr></thead>';

      html += '<tbody>';

      purchases.forEach(function(p) {

        html += '<tr>';

        html += '<td>' + (p.purchase_date || '') + '</td>';

        html += '<td>₪' + Number(p.total_amount || 0).toLocaleString('he-IL') + '</td>';

        html += '<td>' + (p.notes || '') + '</td>';

        html += '</tr>';

      });

      html += '</tbody></table>';
    }

    html += '</div>';

    html += '</div>';

    html += '</div>';

    grid.innerHTML = html;
  })
  .catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

if (!s.includes('function openShoppingList(id)')) {

  s = s.replace(
    'function loadCalendar() {',
    code + '\n\nfunction loadCalendar() {'
  );
}

// connect shopping cards click

s = s.replace(
  "return '<div class=\"customer-card\">' +",
  "return '<div class=\"customer-card\" data-shopping-id=\"' + l.id + '\">' +"
);

if (!s.includes('data-shopping-id')) {

}

s = s.replace(
  "grid.innerHTML = '<div style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px\">' +",
  "grid.innerHTML = '<div id=\"shopping-cards-wrap\" style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px\">' +"
);

if (!s.includes('openShoppingList(parseInt')) {

  s = s.replace(
    "}).catch(function(e) {",
`
setTimeout(function() {

  grid.querySelectorAll('[data-shopping-id]').forEach(function(card) {

    card.addEventListener('click', function() {

      openShoppingList(parseInt(this.getAttribute('data-shopping-id')));

    });

  });

}, 50);

}).catch(function(e) {`
  );
}

fs.writeFileSync(p, s, 'utf8');

console.log('open shopping list added');