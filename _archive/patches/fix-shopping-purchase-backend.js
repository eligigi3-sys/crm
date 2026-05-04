const fs = require('fs');

const p = 'src/shopping.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/shopping.backup-before-purchase-receipt.js', s, 'utf8');

s = s.replace(
  `INSERT INTO shopping_purchases (list_id, purchase_date, total_amount, notes)
      VALUES (?, ?, ?, ?)`,
  `INSERT INTO shopping_purchases (list_id, purchase_date, total_amount, notes, receipt_image)
      VALUES (?, ?, ?, ?, ?)`
);

s = s.replace(
  `b.notes || null
    ).run();`,
  `b.notes || null,
      b.receipt_image || null
    ).run();`
);

s = s.replace(
  `return { success: true, id: purchaseId };`,
  `await env.DB.prepare('DELETE FROM shopping_items WHERE list_id = ?').bind(listId).run();

    return { success: true, id: purchaseId };`
);

fs.writeFileSync(p, s, 'utf8');

console.log('shopping purchase backend updated');