const fs = require('fs');

const p = 'src/shopping.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/shopping.backup-before-purchase-routes.js', s, 'utf8');

const code = `
  const purchaseDetailsMatch = path.match(/^\\/api\\/shopping-purchases\\/(\\d+)$/);

  if (purchaseDetailsMatch && method === 'GET') {
    const id = purchaseDetailsMatch[1];

    const purchase = await env.DB.prepare(\`
      SELECT sp.*, sl.name AS store_name
      FROM shopping_purchases sp
      LEFT JOIN shopping_lists sl ON sl.id = sp.list_id
      WHERE sp.id = ?
    \`).bind(id).first();

    const items = await env.DB.prepare(\`
      SELECT *
      FROM shopping_purchase_items
      WHERE purchase_id = ?
      ORDER BY created_at ASC
    \`).bind(id).all();

    const stores = await env.DB.prepare(\`
      SELECT id, name
      FROM shopping_lists
      ORDER BY name ASC
    \`).all();

    return {
      purchase,
      items: items.results || [],
      stores: stores.results || []
    };
  }

  if (purchaseDetailsMatch && method === 'PUT') {
    const id = purchaseDetailsMatch[1];
    const b = await request.json();

    await env.DB.prepare(\`
      UPDATE shopping_purchases
      SET list_id = ?, purchase_date = ?, total_amount = ?, notes = ?, receipt_image = ?
      WHERE id = ?
    \`).bind(
      b.list_id,
      b.purchase_date,
      Number(b.total_amount || 0),
      b.notes || null,
      b.receipt_image || null,
      id
    ).run();

    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id = ?').bind(id).run();

    for (const item of (b.items || [])) {
      await env.DB.prepare(\`
        INSERT INTO shopping_purchase_items (purchase_id, item_name, quantity, price, notes)
        VALUES (?, ?, ?, ?, ?)
      \`).bind(
        id,
        item.item_name,
        item.quantity || null,
        Number(item.price || 0),
        item.notes || null
      ).run();
    }

    return { success: true };
  }

  if (purchaseDetailsMatch && method === 'DELETE') {
    const id = purchaseDetailsMatch[1];

    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM shopping_purchases WHERE id = ?').bind(id).run();

    return { success: true };
  }

`;

if (!s.includes('purchaseDetailsMatch')) {
  s = s.replace('  return { error: \'Shopping route not found\' };', code + "\n  return { error: 'Shopping route not found' };");
}

fs.writeFileSync(p, s, 'utf8');

console.log('shopping purchase routes added');