const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-shopping-purchased-ui.js', s, 'utf8');

const code = `
window.openShoppingPurchaseModal = function(listId, items) {
  if (!items || !items.length) {
    toast('אין מוצרים ברשימה', 'error');
    return;
  }

  var old = document.getElementById('shopping-purchase-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-purchase-modal';

  var defaultTotal = items.reduce(function(sum, it) {
    return sum + Number(it.price || 0);
  }, 0);

  overlay.innerHTML =
    '<div class="modal" style="width:520px">' +
      '<div class="modal-header">' +
        '<h2>סיום קנייה</h2>' +
        '<button class="modal-close" id="purchase-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">תאריך קנייה</label><input type="date" class="form-input" id="purchase-date" value="' + new Date().toISOString().slice(0,10) + '"></div>' +
        '<div class="form-group"><label class="form-label">סכום קנייה</label><input type="number" class="form-input" id="purchase-total" value="' + defaultTotal + '"></div>' +
        '<div class="form-group"><label class="form-label">תמונת חשבונית</label><input type="file" class="form-input" id="purchase-receipt" accept="image/*"></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="purchase-notes" style="min-height:80px"></textarea></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="purchase-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="purchase-save">קניתי</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('purchase-close').onclick = close;
  document.getElementById('purchase-cancel').onclick = close;

  document.getElementById('purchase-save').onclick = function() {
    var fileInput = document.getElementById('purchase-receipt');
    var file = fileInput.files && fileInput.files[0];

    function save(receiptData) {
      apiCall('POST', '/api/shopping-lists/' + listId + '/purchases', {
        purchase_date: document.getElementById('purchase-date').value,
        total_amount: Number(document.getElementById('purchase-total').value || 0),
        notes: document.getElementById('purchase-notes').value.trim(),
        receipt_image: receiptData || null,
        items: items.map(function(it) {
          return {
            item_name: it.item_name,
            quantity: it.quantity,
            price: it.price,
            notes: it.notes
          };
        })
      }).then(function() {
        close();
        toast('הקנייה נשמרה', 'success');
        openShoppingList(listId);
      }).catch(function(e) {
        toast(e.message, 'error');
      });
    }

    if (!file) {
      save(null);
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      save(e.target.result);
    };
    reader.readAsDataURL(file);
  };
};
`;

if (!s.includes('window.openShoppingPurchaseModal')) {
  s = s.replace('</script>', code + '\n</script>');
}

s = s.replace(
  `html += '<div class="table-toolbar"><strong>רשימת קניות פעילה</strong></div>';`,
  `html += '<div class="table-toolbar" style="justify-content:space-between"><strong>רשימת קניות פעילה</strong><button class="btn btn-primary btn-sm" id="shopping-purchased-btn">קניתי</button></div>';`
);

s = s.replace(
  `if (addBtn && typeof openShoppingItemModal === 'function') {
      addBtn.onclick = openShoppingItemModal;
    }`,
  `if (addBtn && typeof openShoppingItemModal === 'function') {
      addBtn.onclick = openShoppingItemModal;
    }

    var purchasedBtn = document.getElementById('shopping-purchased-btn');
    if (purchasedBtn) {
      purchasedBtn.onclick = function() {
        openShoppingPurchaseModal(id, items);
      };
    }`
);

fs.writeFileSync(p, s, 'utf8');

console.log('shopping purchased UI added');