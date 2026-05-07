function parseOptionalProductId(value) {
  if (value === null || value === undefined || value === '') return null;
  const productId = Number(value);
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error('מוצר מקושר לא תקין');
  }
  return productId;
}

async function getProductById(productId, env) {
  return env.DB.prepare(`
    SELECT id, is_active
    FROM products
    WHERE id = ?
  `).bind(productId).first();
}

async function assertValidShoppingProductLink(productId, env) {
  if (productId === null) return null;
  const product = await getProductById(productId, env);
  if (!product) {
    throw new Error('המוצר המקושר לא נמצא');
  }
  return product;
}

function normalizeShoppingPurchaseQuantity(value) {
  if (value === null || value === undefined || value === '') return 1;
  const quantity = Number(String(value).trim());
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('כמות לא תקינה עבור מוצר מקושר');
  }
  return Math.round(quantity * 100) / 100;
}

function normalizeShoppingPurchaseLineTotal(value) {
  const totalPrice = Number(value);
  if (!Number.isFinite(totalPrice) || totalPrice < 0) {
    throw new Error('מחיר לא תקין עבור מוצר מקושר');
  }
  return Math.round(totalPrice * 100) / 100;
}

function calculateShoppingUnitPrice(totalPrice, quantity) {
  return Math.round((totalPrice / quantity) * 100) / 100;
}

async function normalizeShoppingLedgerItem(rawItem, env) {
  const productId = parseOptionalProductId(rawItem ? rawItem.product_id : null);
  await assertValidShoppingProductLink(productId, env);

  if (productId === null) {
    return {
      productId: null,
      quantity: null,
      totalPrice: null,
      unitPrice: null
    };
  }

  const quantity = normalizeShoppingPurchaseQuantity(rawItem.quantity);
  const totalPrice = normalizeShoppingPurchaseLineTotal(rawItem.price);
  const unitPrice = calculateShoppingUnitPrice(totalPrice, quantity);

  return {
    productId,
    quantity,
    totalPrice,
    unitPrice
  };
}

async function getProductPurchaseByShoppingPurchaseItemId(shoppingPurchaseItemId, env) {
  return env.DB.prepare(`
    SELECT id
    FROM product_purchases
    WHERE shopping_purchase_item_id = ?
    LIMIT 1
  `).bind(shoppingPurchaseItemId).first();
}

async function insertProductPurchaseFromShoppingItem(params, env) {
  const existing = await getProductPurchaseByShoppingPurchaseItemId(params.shoppingPurchaseItemId, env);
  if (existing) {
    throw new Error('כפילות בהיסטוריית רכישות עבור פריט קנייה זה');
  }

  try {
    await env.DB.prepare(`
      INSERT INTO product_purchases (
        product_id,
        purchase_type,
        purchase_date,
        quantity,
        unit_price,
        total_price,
        shopping_list_id,
        shopping_purchase_id,
        shopping_purchase_item_id,
        supplier_name,
        notes
      )
      VALUES (?, 'shopping', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      params.productId,
      params.purchaseDate,
      params.quantity,
      params.unitPrice,
      params.totalPrice,
      params.shoppingListId,
      params.shoppingPurchaseId,
      params.shoppingPurchaseItemId,
      null,
      params.notes || null
    ).run();
  } catch (error) {
    if (String((error && error.message) || error).includes('idx_product_purchases_shopping_purchase_item_unique')) {
      throw new Error('כפילות בהיסטוריית רכישות עבור פריט קנייה זה');
    }
    throw error;
  }
}

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
    const productId = parseOptionalProductId(b.product_id);
    await assertValidShoppingProductLink(productId, env);

    const result = await env.DB.prepare(`
      INSERT INTO shopping_items
        (list_id, item_name, quantity, status, notes, price, product_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      listId,
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0),
      productId
    ).run();

    return { success: true, id: result.meta.last_row_id };
  }

  const itemMatch = path.match(/^\/api\/shopping-items\/(\d+)$/);

  if (itemMatch && method === 'PUT') {
    const id = itemMatch[1];
    const b = await request.json();

    if (!b.item_name) throw new Error('שם פריט חובה');
    const productId = parseOptionalProductId(b.product_id);
    await assertValidShoppingProductLink(productId, env);

    await env.DB.prepare(`
      UPDATE shopping_items
      SET
        item_name = ?,
        quantity = ?,
        status = ?,
        notes = ?,
        price = ?,
        product_id = ?
      WHERE id = ?
    `).bind(
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0),
      productId,
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
    const normalizedItems = [];

    for (const item of items) {
      normalizedItems.push({
        raw: item,
        ledger: await normalizeShoppingLedgerItem(item, env)
      });
    }

    const purchaseDate = b.purchase_date || new Date().toISOString().slice(0, 10);
    const totalAmount = Number(b.total_amount || total || 0);
    let transactionStarted = false;

    try {
      await env.DB.prepare('BEGIN').run();
      transactionStarted = true;

      const purchase = await env.DB.prepare(`
        INSERT INTO shopping_purchases (list_id, purchase_date, total_amount, notes)
        VALUES (?, ?, ?, ?)
      `).bind(
        listId,
        purchaseDate,
        totalAmount,
        b.notes || null
      ).run();

      const purchaseId = purchase.meta.last_row_id;

      for (const itemData of normalizedItems) {
        const item = itemData.raw;
        const ledger = itemData.ledger;

        const purchaseItem = await env.DB.prepare(`
          INSERT INTO shopping_purchase_items
            (purchase_id, item_name, quantity, price, notes, product_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          purchaseId,
          item.item_name,
          item.quantity || null,
          Number(item.price || 0),
          item.notes || null,
          ledger.productId
        ).run();

        const shoppingPurchaseItemId = purchaseItem.meta.last_row_id;

        if (ledger.productId !== null) {
          await insertProductPurchaseFromShoppingItem({
            productId: ledger.productId,
            purchaseDate,
            quantity: ledger.quantity,
            unitPrice: ledger.unitPrice,
            totalPrice: ledger.totalPrice,
            shoppingListId: Number(listId),
            shoppingPurchaseId: purchaseId,
            shoppingPurchaseItemId,
            notes: item.notes || null
          }, env);
        }
      }

      await env.DB.prepare('DELETE FROM shopping_items WHERE list_id = ?').bind(listId).run();
      await env.DB.prepare('COMMIT').run();
      transactionStarted = false;

      return { success: true, id: purchaseId };
    } catch (error) {
      if (transactionStarted) {
        try {
          await env.DB.prepare('ROLLBACK').run();
        } catch (rollbackError) {
          console.error('Shopping finalize rollback failed', rollbackError);
        }
      }
      throw error;
    }
  }


  const purchaseDetailsMatch = path.match(/^\/api\/shopping-purchases\/(\d+)$/);

  if (purchaseDetailsMatch && method === 'GET') {
    const id = purchaseDetailsMatch[1];

    const purchase = await env.DB.prepare(`
      SELECT sp.*, sl.name AS store_name
      FROM shopping_purchases sp
      LEFT JOIN shopping_lists sl ON sl.id = sp.list_id
      WHERE sp.id = ?
    `).bind(id).first();

    const items = await env.DB.prepare(`
      SELECT *
      FROM shopping_purchase_items
      WHERE purchase_id = ?
      ORDER BY created_at ASC
    `).bind(id).all();

    const stores = await env.DB.prepare(`
      SELECT id, name
      FROM shopping_lists
      ORDER BY name ASC
    `).all();

    return {
      purchase,
      items: items.results || [],
      stores: stores.results || []
    };
  }

  if (purchaseDetailsMatch && method === 'PUT') {
    const id = purchaseDetailsMatch[1];
    const b = await request.json();

    await env.DB.prepare(`
      UPDATE shopping_purchases
      SET list_id = ?, purchase_date = ?, total_amount = ?, notes = ?, receipt_image = ?
      WHERE id = ?
    `).bind(
      b.list_id,
      b.purchase_date,
      Number(b.total_amount || 0),
      b.notes || null,
      b.receipt_image || null,
      id
    ).run();

    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id = ?').bind(id).run();

    for (const item of (b.items || [])) {
      await env.DB.prepare(`
        INSERT INTO shopping_purchase_items (purchase_id, item_name, quantity, price, notes)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
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


  return { error: 'Shopping route not found' };
}