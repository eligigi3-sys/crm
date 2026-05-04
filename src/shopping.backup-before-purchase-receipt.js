export async function handleShopping(request, env, path) {
  const method = request.method;

  if (path === '/api/shopping-lists' && method === 'GET') {
    const lists = await env.DB.prepare(`
      SELECT 
        sl.*,
        COUNT(si.id) AS items_count,
        SUM(CASE WHEN si.status = 'done' THEN 1 ELSE 0 END) AS done_count
      FROM shopping_lists sl
      LEFT JOIN shopping_items si ON si.list_id = sl.id
      GROUP BY sl.id
      ORDER BY sl.created_at DESC
    `).all();

    return { lists: lists.results || [] };
  }

  if (path === '/api/shopping-lists' && method === 'POST') {
    const b = await request.json();
    if (!b.name) throw new Error('שם חנות חובה');

    const result = await env.DB.prepare(`
      INSERT INTO shopping_lists
        (name, phone, address, notes, contact_name, contact_phone, extra_phone, opening_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      b.name,
      b.phone || null,
      b.address || null,
      b.notes || null,
      b.contact_name || null,
      b.contact_phone || null,
      b.extra_phone || null,
      b.opening_hours || null
    ).run();

    return { success: true, id: result.meta.last_row_id };
  }

  const listMatch = path.match(/^\/api\/shopping-lists\/(\d+)$/);

  if (listMatch && method === 'GET') {
    const id = listMatch[1];

    const list = await env.DB.prepare(`
      SELECT *
      FROM shopping_lists
      WHERE id = ?
    `).bind(id).first();

    const items = await env.DB.prepare(`
      SELECT *
      FROM shopping_items
      WHERE list_id = ?
      ORDER BY status ASC, created_at DESC
    `).bind(id).all();

    const purchases = await env.DB.prepare(`
      SELECT *
      FROM shopping_purchases
      WHERE list_id = ?
      ORDER BY purchase_date DESC, created_at DESC
    `).bind(id).all();

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearStart = `${now.getFullYear()}-01-01`;

    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const summary = await env.DB.prepare(`
      SELECT
        SUM(CASE WHEN substr(purchase_date, 1, 7) = ? THEN total_amount ELSE 0 END) AS current_month,
        SUM(CASE WHEN substr(purchase_date, 1, 7) = ? THEN total_amount ELSE 0 END) AS previous_month,
        SUM(CASE WHEN purchase_date >= ? THEN total_amount ELSE 0 END) AS year_total
      FROM shopping_purchases
      WHERE list_id = ?
    `).bind(currentMonth, prevMonth, yearStart, id).first();

    return {
      list,
      items: items.results || [],
      purchases: purchases.results || [],
      summary: summary || {
        current_month: 0,
        previous_month: 0,
        year_total: 0
      }
    };
  }

  if (listMatch && method === 'PUT') {
    const id = listMatch[1];
    const b = await request.json();
    if (!b.name) throw new Error('שם חנות חובה');

    await env.DB.prepare(`
      UPDATE shopping_lists
      SET
        name = ?,
        phone = ?,
        address = ?,
        notes = ?,
        contact_name = ?,
        contact_phone = ?,
        extra_phone = ?,
        opening_hours = ?
      WHERE id = ?
    `).bind(
      b.name,
      b.phone || null,
      b.address || null,
      b.notes || null,
      b.contact_name || null,
      b.contact_phone || null,
      b.extra_phone || null,
      b.opening_hours || null,
      id
    ).run();

    return { success: true };
  }

  if (listMatch && method === 'DELETE') {
    const id = listMatch[1];

    await env.DB.prepare('DELETE FROM shopping_items WHERE list_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id IN (SELECT id FROM shopping_purchases WHERE list_id = ?)').bind(id).run();
    await env.DB.prepare('DELETE FROM shopping_purchases WHERE list_id = ?').bind(id).run();
    await env.DB.prepare('DELETE FROM shopping_lists WHERE id = ?').bind(id).run();

    return { success: true };
  }

  const itemsMatch = path.match(/^\/api\/shopping-lists\/(\d+)\/items$/);

  if (itemsMatch && method === 'POST') {
    const listId = itemsMatch[1];
    const b = await request.json();

    if (!b.item_name) throw new Error('שם פריט חובה');

    const result = await env.DB.prepare(`
      INSERT INTO shopping_items
        (list_id, item_name, quantity, status, notes, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      listId,
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0)
    ).run();

    return { success: true, id: result.meta.last_row_id };
  }

  const itemMatch = path.match(/^\/api\/shopping-items\/(\d+)$/);

  if (itemMatch && method === 'PUT') {
    const id = itemMatch[1];
    const b = await request.json();

    if (!b.item_name) throw new Error('שם פריט חובה');

    await env.DB.prepare(`
      UPDATE shopping_items
      SET
        item_name = ?,
        quantity = ?,
        status = ?,
        notes = ?,
        price = ?
      WHERE id = ?
    `).bind(
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0),
      id
    ).run();

    return { success: true };
  }

  if (itemMatch && method === 'DELETE') {
    const id = itemMatch[1];

    await env.DB.prepare('DELETE FROM shopping_items WHERE id = ?').bind(id).run();

    return { success: true };
  }

  const purchaseMatch = path.match(/^\/api\/shopping-lists\/(\d+)\/purchases$/);

  if (purchaseMatch && method === 'POST') {
    const listId = purchaseMatch[1];
    const b = await request.json();

    const items = Array.isArray(b.items) ? b.items : [];
    const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const purchase = await env.DB.prepare(`
      INSERT INTO shopping_purchases (list_id, purchase_date, total_amount, notes)
      VALUES (?, ?, ?, ?)
    `).bind(
      listId,
      b.purchase_date || new Date().toISOString().slice(0, 10),
      Number(b.total_amount || total || 0),
      b.notes || null
    ).run();

    const purchaseId = purchase.meta.last_row_id;

    for (const item of items) {
      await env.DB.prepare(`
        INSERT INTO shopping_purchase_items
          (purchase_id, item_name, quantity, price, notes)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        purchaseId,
        item.item_name,
        item.quantity || null,
        Number(item.price || 0),
        item.notes || null
      ).run();
    }

    return { success: true, id: purchaseId };
  }

  return { error: 'Shopping route not found' };
}