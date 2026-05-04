const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-force-shopping-store-item-edit.js', s, 'utf8');

const code = `

window.shoppingStatusBadge = function(status) {
  if (status === 'done') return '<span class="badge badge-green">נקנה</span>';
  return '<span class="badge badge-orange">ממתין</span>';
};

window.openEditShoppingItemModal = function(listId, item) {
  var old = document.getElementById('shopping-item-edit-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-item-edit-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:500px">' +
      '<div class="modal-header"><h2>עריכת מוצר</h2><button class="modal-close" id="shopping-edit-close">✕</button></div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם מוצר</label><input class="form-input" id="shopping-edit-name" value="' + (item.item_name || '') + '"></div>' +
        '<div class="form-group"><label class="form-label">כמות</label><input class="form-input" id="shopping-edit-quantity" value="' + (item.quantity || '') + '"></div>' +
        '<div class="form-group"><label class="form-label">מחיר</label><input class="form-input" type="number" id="shopping-edit-price" value="' + (item.price || 0) + '"></div>' +
        '<div class="form-group"><label class="form-label">סטטוס</label><select class="form-input" id="shopping-edit-status"><option value="pending">ממתין</option><option value="done">נקנה</option></select></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="shopping-edit-notes" style="min-height:90px">' + (item.notes || '') + '</textarea></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-danger" id="shopping-edit-delete">מחק</button>' +
        '<button class="btn btn-secondary" id="shopping-edit-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="shopping-edit-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('shopping-edit-status').value = item.status || 'pending';

  function close() { overlay.remove(); }

  document.getElementById('shopping-edit-close').onclick = close;
  document.getElementById('shopping-edit-cancel').onclick = close;

  document.getElementById('shopping-edit-save').onclick = function() {
    apiCall('PUT', '/api/shopping-items/' + item.id, {
      item_name: document.getElementById('shopping-edit-name').value.trim(),
      quantity: document.getElementById('shopping-edit-quantity').value.trim(),
      price: Number(document.getElementById('shopping-edit-price').value || 0),
      status: document.getElementById('shopping-edit-status').value,
      notes: document.getElementById('shopping-edit-notes').value.trim()
    }).then(function() {
      close();
      toast('המוצר עודכן', 'success');
      openShoppingList(listId);
    }).catch(function(e) { toast(e.message, 'error'); });
  };

  document.getElementById('shopping-edit-delete').onclick = function() {
    if (!confirm('האם למחוק את המוצר?')) return;

    apiCall('DELETE', '/api/shopping-items/' + item.id).then(function() {
      close();
      toast('המוצר נמחק', 'success');
      openShoppingList(listId);
    }).catch(function(e) { toast(e.message, 'error'); });
  };
};

openShoppingList = function(id) {
  window.currentShoppingListId = id;

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
        html += '<tr class="shopping-item-row" data-item-id="' + it.id + '" style="cursor:pointer">';
        html += '<td>' + (it.item_name || '') + '</td>';
        html += '<td>' + (it.quantity || '') + '</td>';
        html += '<td>₪' + fmtMoney(it.price || 0) + '</td>';
        html += '<td>' + shoppingStatusBadge(it.status) + '</td>';
        html += '</tr>';
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

    var addBtn = document.getElementById('add-shopping-item-btn');
    if (addBtn && typeof openShoppingItemModal === 'function') {
      addBtn.onclick = openShoppingItemModal;
    }

    grid.querySelectorAll('.shopping-item-row').forEach(function(row) {
      row.onclick = function() {
        var itemId = parseInt(this.getAttribute('data-item-id'));
        var item = items.find(function(x) { return Number(x.id) === itemId; });
        if (item) openEditShoppingItemModal(id, item);
      };
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
};
`;

if (!s.includes('window.openEditShoppingItemModal = function')) {
  s = s.replace('</script>', code + '\n</script>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('forced shopping edit override added');