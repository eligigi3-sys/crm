const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

const code = `

function openShoppingStoreModalV2() {
  alert('shopping modal works');
}

document.addEventListener('click', function(e) {
  var btn = e.target.closest('#btn-new-shopping-list');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  openShoppingStoreModalV2();
}, true);

`;

if (!s.includes('openShoppingStoreModalV2')) {
  s = s.replace('</script>', code + '\n</script>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('DONE');
