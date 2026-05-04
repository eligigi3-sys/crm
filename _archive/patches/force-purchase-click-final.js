const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-force-purchase-click-final.js', s, 'utf8');

const code = `

// force-purchase-click-final
window.openShoppingPurchaseDetailsModal = function(purchaseId, currentListId) {
  apiCall('GET', '/api/shopping-purchases/' + purchaseId).then(function(data) {
    var p = data.purchase || {};
    var items = data.items || [];
    var stores = data.stores || [];

    var old = document.getElementById('shopping-purchase-details-modal');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'shopping-purchase-details-modal';

    var itemsHtml = items.map(function(it, idx) {
      return '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:8px">' +
        '<input class="form-input purchase-item-name" data-idx="' + idx + '" value="' + (it.item_name || '') + '">' +
        '<input class="form-input purchase-item-qty" data-idx="' + idx + '" value="' + (it.quantity || '') + '">' +
        '<input class="form-input purchase-item-price" data-idx="' + idx + '" type="number" value="' + (it.price || 0) + '">' +
      '</div>';
    }).join('');

    overlay.innerHTML =
      '<div class="modal" style="width:720px">' +
        '<div class="modal-header"><h2>עסקה קודמת</h2><button class="modal-close" id="purchase-details-close">✕</button></div>' +
        '<div class="modal-body">' +
          '<div class="form-group"><label class="form-label">חנות</label><select class="form-input" id="purchase-store-id">' +
            stores.map(function(st) { return '<option value="' + st.id + '">' + st.name + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="form-group"><label class="form-label">תאריך קנייה</label><input type="date" class="form-input" id="purchase-edit-date" value="' + (p.purchase_date || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">סכום קנייה</label><input type="number" class="form-input" id="purchase-edit-total" value="' + (p.total_amount || 0) + '"></div>' +
          '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="purchase-edit-notes" style="min-height:80px">' + (p.notes || '') + '</textarea></div>' +
          '<div class="info-section"><div class="info-section-title">פריטים שנקנו</div>' +
            '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:6px;font-size:12px;color:var(--text3);font-weight:700"><div>מוצר</div><div>כמות</div><div>מחיר</div></div>' +
            (itemsHtml || '<div class="dash-empty">אין פריטים בעסקה</div>') +
          '</div>' +
          (p.receipt_image ? '<div class="info-section"><div class="info-section-title">חשבונית</div><img src="' + p.receipt_image + '" style="max-width:100%;border-radius:12px;border:1px solid var(--border)"></div>' : '') +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-danger" id="purchase-delete">מחק עסקה</button>' +
          '<button class="btn btn-secondary" id="purchase-details-cancel">ביטול</button>' +
          '<button class="btn btn-primary" id="purchase-details-save">שמור</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.getElementById('purchase-store-id').value = p.list_id;

    function close() { overlay.remove(); }

    document.getElementById('purchase-details-close').onclick = close;
    document.getElementById('purchase-details-cancel').onclick = close;

    document.getElementById('purchase-details-save').onclick = function() {
      var updatedItems = items.map(function(it, idx) {
        return {
          item_name: document.querySelector('.purchase-item-name[data-idx="' + idx + '"]').value.trim(),
          quantity: document.querySelector('.purchase-item-qty[data-idx="' + idx + '"]').value.trim(),
          price: Number(document.querySelector('.purchase-item-price[data-idx="' + idx + '"]').value || 0),
          notes: it.notes || ''
        };
      }).filter(function(it) { return it.item_name; });

      var newListId = Number(document.getElementById('purchase-store-id').value);

      apiCall('PUT', '/api/shopping-purchases/' + purchaseId, {
        list_id: newListId,
        purchase_date: document.getElementById('purchase-edit-date').value,
        total_amount: Number(document.getElementById('purchase-edit-total').value || 0),
        notes: document.getElementById('purchase-edit-notes').value.trim(),
        receipt_image: p.receipt_image || null,
        items: updatedItems
      }).then(function() {
        close();
        toast('העסקה עודכנה', 'success');
        openShoppingList(newListId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };

    document.getElementById('purchase-delete').onclick = function() {
      if (!confirm('האם למחוק את העסקה הקודמת?')) return;

      apiCall('DELETE', '/api/shopping-purchases/' + purchaseId).then(function() {
        close();
        toast('העסקה נמחקה', 'success');
        openShoppingList(currentListId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };
  }).catch(function(e) { toast(e.message, 'error'); });
};

(function() {
  var oldOpenShoppingList = openShoppingList;

  openShoppingList = window.openShoppingList = function(id) {
    oldOpenShoppingList(id);

    setTimeout(function() {
      apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
        var grid = document.getElementById('shopping-grid');
        if (!grid) return;

        var purchases = data.purchases || [];
        if (!purchases.length) return;

        var purchaseTables = Array.from(grid.querySelectorAll('.table-card')).filter(function(card) {
          return card.textContent.indexOf('עסקאות קודמות') !== -1;
        });

        if (!purchaseTables.length) return;

        var rows = purchaseTables[0].querySelectorAll('tbody tr');

        rows.forEach(function(row, idx) {
          var p = purchases[idx];
          if (!p) return;

          row.style.cursor = 'pointer';
          row.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openShoppingPurchaseDetailsModal(p.id, id);
          };
        });
      });
    }, 500);
  };
})();
`;

if (!s.includes('// force-purchase-click-final')) {
  s = s.replace('</script>', code + '\n</script>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('purchase click forced final');