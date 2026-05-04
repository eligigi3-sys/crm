const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-force-purchased-button.js', s, 'utf8');

const code = `
(function() {
  var originalOpenShoppingList = window.openShoppingList || openShoppingList;

  window.openShoppingList = openShoppingList = function(id) {
    originalOpenShoppingList(id);

    setTimeout(function() {
      var grid = document.getElementById('shopping-grid');
      if (!grid) return;

      var toolbars = grid.querySelectorAll('.table-toolbar');
      if (!toolbars.length) return;

      var toolbar = toolbars[0];

      if (document.getElementById('shopping-purchased-btn')) return;

      var btn = document.createElement('button');
      btn.className = 'btn btn-primary btn-sm';
      btn.id = 'shopping-purchased-btn';
      btn.textContent = 'קניתי';

      btn.onclick = function() {
        apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
          var items = data.items || [];
          openShoppingPurchaseModal(id, items);
        }).catch(function(e) {
          toast(e.message, 'error');
        });
      };

      toolbar.style.justifyContent = 'space-between';
      toolbar.appendChild(btn);
    }, 500);
  };
})();
`;

if (!s.includes('force-purchased-button')) {
  s = s.replace('</script>', '\n// force-purchased-button\n' + code + '\n</script>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('forced purchased button added');