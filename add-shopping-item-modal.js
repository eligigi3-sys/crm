const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync(
  'src/ui.backup-before-add-shopping-item-modal.js',
  s,
  'utf8'
);

const inject = `

var currentShoppingListId = null;

function openShoppingItemModal() {

  if (!currentShoppingListId) {
    toast('לא נבחרה חנות', 'error');
    return;
  }

  var old = document.getElementById('shopping-item-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-item-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:500px">' +

      '<div class="modal-header">' +
        '<h2>מוצר חדש</h2>' +
        '<button class="modal-close" id="shopping-item-close">✕</button>' +
      '</div>' +

      '<div class="modal-body">' +

        '<div class="form-group">' +
          '<label class="form-label">שם מוצר</label>' +
          '<input class="form-input" id="shopping-item-name">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">כמות</label>' +
          '<input class="form-input" id="shopping-item-quantity">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">מחיר</label>' +
          '<input class="form-input" type="number" id="shopping-item-price">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סטטוס</label>' +
          '<select class="form-input" id="shopping-item-status">' +
            '<option value="pending">ממתין</option>' +
            '<option value="done">נקנה</option>' +
          '</select>' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">הערות</label>' +
          '<textarea class="form-input" id="shopping-item-notes" style="min-height:80px"></textarea>' +
        '</div>' +

      '</div>' +

      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="shopping-item-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="shopping-item-save">שמור</button>' +
      '</div>' +

    '</div>';

  document.body.appendChild(overlay);

  function closeModal() {
    overlay.remove();
  }

  document.getElementById('shopping-item-close').onclick = closeModal;
  document.getElementById('shopping-item-cancel').onclick = closeModal;

  document.getElementById('shopping-item-save').onclick = function() {

    var itemName = document.getElementById('shopping-item-name').value.trim();

    if (!itemName) {
      toast('שם מוצר חובה', 'error');
      return;
    }

    apiCall(
      'POST',
      '/api/shopping-lists/' + currentShoppingListId + '/items',
      {
        item_name: itemName,
        quantity: document.getElementById('shopping-item-quantity').value.trim(),
        price: Number(document.getElementById('shopping-item-price').value || 0),
        status: document.getElementById('shopping-item-status').value,
        notes: document.getElementById('shopping-item-notes').value.trim()
      }
    )
    .then(function() {

      closeModal();

      toast('מוצר נוסף', 'success');

      openShoppingList(currentShoppingListId);

    })
    .catch(function(e) {

      toast(e.message, 'error');

    });
  };
}

`;

if (!s.includes('function openShoppingItemModal()')) {

  s = s.replace(
    'function openShoppingList(id) {',
    inject + '\n\nfunction openShoppingList(id) {'
  );
}

// inject currentShoppingListId
s = s.replace(
  "apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {",
  "currentShoppingListId = id;\n  apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {"
);

// connect button
s = s.replace(
  "document.getElementById('back-to-shopping').onclick = loadShoppingLists;",
  `
document.getElementById('back-to-shopping').onclick = loadShoppingLists;

var addBtn = document.getElementById('add-shopping-item-btn');

if (addBtn) {
  addBtn.onclick = openShoppingItemModal;
}
`
);

fs.writeFileSync(p, s, 'utf8');

console.log('shopping item modal added');