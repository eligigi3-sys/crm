const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-show-remove-button.js', s, 'utf8');

// לוודא שיש index בתוך forEach
s = s.replace(
  `extra.forEach(function(ec) {`,
  `extra.forEach(function(ec, index) {`
);

// להוסיף X אחרי כפתור הטלפון
s = s.replace(
  `htmlExtra += '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';`,
  `htmlExtra += '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';

        htmlExtra += '<button class="btn btn-danger btn-sm" onclick="removeExtraContact(' + c.id + ',' + index + ')" style="padding:4px 8px;font-weight:700;border-radius:8px">✕</button>';`
);

fs.writeFileSync(p, s, 'utf8');

console.log('remove button visible');