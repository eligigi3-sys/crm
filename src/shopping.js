import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

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

async function getProductByIdForTenant(productId, tenantId, env) {
  return env.DB.prepare(`
    SELECT id, is_active
    FROM products
    WHERE id = ?
      AND tenant_id = ?
  `).bind(productId, tenantId).first();
}

async function assertValidShoppingProductLink(productId, env) {
  if (productId === null) return null;
  const product = await getProductById(productId, env);
  if (!product) {
    throw new Error('המוצר המקושר לא נמצא');
  }
  return product;
}

async function assertValidShoppingProductLinkForTenant(productId, tenantId, env) {
  if (productId === null) return null;
  const product = await getProductByIdForTenant(productId, tenantId, env);
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

async function normalizeShoppingLedgerItemForTenant(rawItem, tenantId, env) {
  const productId = parseOptionalProductId(rawItem ? rawItem.product_id : null);
  await assertValidShoppingProductLinkForTenant(productId, tenantId, env);

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

async function getShoppingPurchaseById(purchaseId, env) {
  return env.DB.prepare(`
    SELECT *
    FROM shopping_purchases
    WHERE id = ?
  `).bind(purchaseId).first();
}

async function getShoppingPurchaseByIdForTenant(purchaseId, tenantId, env) {
  return env.DB.prepare(`
    SELECT *
    FROM shopping_purchases
    WHERE id = ?
      AND tenant_id = ?
  `).bind(purchaseId, tenantId).first();
}

async function getShoppingPurchaseItems(purchaseId, env) {
  const result = await env.DB.prepare(`
    SELECT *
    FROM shopping_purchase_items
    WHERE purchase_id = ?
    ORDER BY created_at ASC, id ASC
  `).bind(purchaseId).all();
  return result.results || [];
}

async function getShoppingPurchaseItemsForTenant(purchaseId, tenantId, env) {
  const result = await env.DB.prepare(`
    SELECT *
    FROM shopping_purchase_items
    WHERE purchase_id = ?
      AND tenant_id = ?
    ORDER BY created_at ASC, id ASC
  `).bind(purchaseId, tenantId).all();
  return result.results || [];
}

async function getProductPurchaseByShoppingPurchaseItemId(shoppingPurchaseItemId, env) {
  return env.DB.prepare(`
    SELECT id
    FROM product_purchases
    WHERE shopping_purchase_item_id = ?
    LIMIT 1
  `).bind(shoppingPurchaseItemId).first();
}

async function getProductPurchaseByShoppingPurchaseItemIdForTenant(shoppingPurchaseItemId, tenantId, env) {
  return env.DB.prepare(`
    SELECT id
    FROM product_purchases
    WHERE shopping_purchase_item_id = ?
      AND tenant_id = ?
    LIMIT 1
  `).bind(shoppingPurchaseItemId, tenantId).first();
}

async function insertProductPurchaseFromShoppingPurchaseItem(purchase, item, env) {
  const productId = parseOptionalProductId(item.product_id);
  await assertValidShoppingProductLink(productId, env);
  const quantity = normalizeShoppingPurchaseQuantity(item.quantity);
  const totalPrice = normalizeShoppingPurchaseLineTotal(item.price);
  const unitPrice = calculateShoppingUnitPrice(totalPrice, quantity);

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
    productId,
    purchase.purchase_date,
    quantity,
    unitPrice,
    totalPrice,
    purchase.list_id,
    purchase.id,
    item.id,
    null,
    item.notes || null
  ).run();
}

async function insertProductPurchaseFromShoppingPurchaseItemForTenant(purchase, item, tenantId, env) {
  const productId = parseOptionalProductId(item.product_id);
  await assertValidShoppingProductLinkForTenant(productId, tenantId, env);
  const quantity = normalizeShoppingPurchaseQuantity(item.quantity);
  const totalPrice = normalizeShoppingPurchaseLineTotal(item.price);
  const unitPrice = calculateShoppingUnitPrice(totalPrice, quantity);

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
      notes,
      tenant_id
    )
    VALUES (?, 'shopping', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    productId,
    purchase.purchase_date,
    quantity,
    unitPrice,
    totalPrice,
    purchase.list_id,
    purchase.id,
    item.id,
    null,
    item.notes || null,
    tenantId
  ).run();
}

export async function handleShopping(request, env, path) {
  const method = request.method;

  if (path === '/api/shopping-lists' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const lists = await env.DB.prepare(`
      SELECT 
        sl.*,
        COUNT(si.id) AS items_count,
        SUM(CASE WHEN si.status = 'done' THEN 1 ELSE 0 END) AS done_count
      FROM shopping_lists sl
      LEFT JOIN shopping_items si ON si.list_id = sl.id AND si.tenant_id = sl.tenant_id
      WHERE sl.tenant_id = ?
      GROUP BY sl.id
      ORDER BY sl.created_at DESC
    `).bind(tenantId).all();

    return { lists: lists.results || [] };
  }

  if (path === '/api/shopping-lists' && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();
    if (!b.name) throw new Error('שם חנות חובה');

    const result = await env.DB.prepare(`
      INSERT INTO shopping_lists
        (name, phone, address, notes, contact_name, contact_phone, extra_phone, opening_hours, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      b.name,
      b.phone || null,
      b.address || null,
      b.notes || null,
      b.contact_name || null,
      b.contact_phone || null,
      b.extra_phone || null,
      b.opening_hours || null,
      tenantId
    ).run();

    return { success: true, id: result.meta.last_row_id };
  }

  const listMatch = path.match(/^\/api\/shopping-lists\/(\d+)$/);

  if (listMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const id = listMatch[1];

    const list = await env.DB.prepare(`
      SELECT *
      FROM shopping_lists
      WHERE id = ?
        AND tenant_id = ?
    `).bind(id, tenantId).first();

    if (!list) throw new Error('חנות לא נמצאה');

    const items = await env.DB.prepare(`
      SELECT *
      FROM shopping_items
      WHERE list_id = ?
        AND tenant_id = ?
      ORDER BY status ASC, created_at DESC
    `).bind(id, tenantId).all();

    const purchases = await env.DB.prepare(`
      SELECT *
      FROM shopping_purchases
      WHERE list_id = ?
        AND tenant_id = ?
      ORDER BY purchase_date DESC, created_at DESC
    `).bind(id, tenantId).all();

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
        AND tenant_id = ?
    `).bind(currentMonth, prevMonth, yearStart, id, tenantId).first();

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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = listMatch[1];
    const b = await request.json();
    if (!b.name) throw new Error('שם חנות חובה');

    const existingList = await env.DB.prepare('SELECT id FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingList) throw new Error('חנות לא נמצאה');

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
        AND tenant_id = ?
    `).bind(
      b.name,
      b.phone || null,
      b.address || null,
      b.notes || null,
      b.contact_name || null,
      b.contact_phone || null,
      b.extra_phone || null,
      b.opening_hours || null,
      id,
      tenantId
    ).run();

    return { success: true };
  }

  if (listMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = listMatch[1];

    const existingList = await env.DB.prepare('SELECT id FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingList) throw new Error('חנות לא נמצאה');

    await env.DB.prepare('DELETE FROM shopping_items WHERE list_id = ? AND tenant_id = ?').bind(id, tenantId).run();
    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE tenant_id = ? AND purchase_id IN (SELECT id FROM shopping_purchases WHERE list_id = ? AND tenant_id = ?)').bind(tenantId, id, tenantId).run();
    await env.DB.prepare('DELETE FROM shopping_purchases WHERE list_id = ? AND tenant_id = ?').bind(id, tenantId).run();
    await env.DB.prepare('DELETE FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();

    return { success: true };
  }

  const itemsMatch = path.match(/^\/api\/shopping-lists\/(\d+)\/items$/);

  if (itemsMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const listId = itemsMatch[1];
    const b = await request.json();

    const existingList = await env.DB.prepare('SELECT id FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(listId, tenantId).first();
    if (!existingList) throw new Error('חנות לא נמצאה');

    if (!b.item_name) throw new Error('שם פריט חובה');
    const productId = parseOptionalProductId(b.product_id);
    await assertValidShoppingProductLinkForTenant(productId, tenantId, env);

    const result = await env.DB.prepare(`
      INSERT INTO shopping_items
        (list_id, item_name, quantity, status, notes, price, product_id, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      listId,
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0),
      productId,
      tenantId
    ).run();

    return { success: true, id: result.meta.last_row_id };
  }

  const itemMatch = path.match(/^\/api\/shopping-items\/(\d+)$/);

  if (itemMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = itemMatch[1];
    const b = await request.json();

    const existingItem = await env.DB.prepare('SELECT id, list_id FROM shopping_items WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingItem) throw new Error('פריט לא נמצא');

    if (!b.item_name) throw new Error('שם פריט חובה');
    const productId = parseOptionalProductId(b.product_id);
    await assertValidShoppingProductLinkForTenant(productId, tenantId, env);

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
        AND tenant_id = ?
    `).bind(
      b.item_name,
      b.quantity || null,
      b.status || 'pending',
      b.notes || null,
      Number(b.price || 0),
      productId,
      id,
      tenantId
    ).run();

    return { success: true };
  }

  if (itemMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = itemMatch[1];

    const existingItem = await env.DB.prepare('SELECT id FROM shopping_items WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingItem) throw new Error('פריט לא נמצא');

    await env.DB.prepare('DELETE FROM shopping_items WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();

    return { success: true };
  }

  const purchaseMatch = path.match(/^\/api\/shopping-lists\/(\d+)\/purchases$/);

  if (purchaseMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const listId = purchaseMatch[1];
    const b = await request.json();

    const shoppingList = await env.DB.prepare('SELECT id FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(listId, tenantId).first();
    if (!shoppingList) throw new Error('חנות לא נמצאה');

    const items = Array.isArray(b.items) ? b.items : [];
    const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const normalizedItems = [];

    for (const item of items) {
      normalizedItems.push({
        raw: item,
        ledger: await normalizeShoppingLedgerItemForTenant(item, tenantId, env)
      });
    }

    const purchase = await env.DB.prepare(`
      INSERT INTO shopping_purchases (list_id, purchase_date, total_amount, notes, tenant_id)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      listId,
      b.purchase_date || new Date().toISOString().slice(0, 10),
      Number(b.total_amount || total || 0),
      b.notes || null,
      tenantId
    ).run();

    const purchaseId = purchase.meta.last_row_id;

    for (const itemData of normalizedItems) {
      const item = itemData.raw;
      const ledger = itemData.ledger;

      await env.DB.prepare(`
        INSERT INTO shopping_purchase_items
          (purchase_id, item_name, quantity, price, notes, product_id, tenant_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        purchaseId,
        item.item_name,
        item.quantity || null,
        Number(item.price || 0),
        item.notes || null,
        ledger.productId,
        tenantId
      ).run();
    }

    await env.DB.prepare('DELETE FROM shopping_items WHERE list_id = ? AND tenant_id = ?').bind(listId, tenantId).run();

    return { success: true, id: purchaseId };
  }


  const purchaseSyncProductsMatch = path.match(/^\/api\/shopping-purchases\/(\d+)\/sync-products$/);

  if (purchaseSyncProductsMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const purchaseId = Number(purchaseSyncProductsMatch[1]);
    const purchase = await getShoppingPurchaseByIdForTenant(purchaseId, tenantId, env);
    if (!purchase) throw new Error('רכישת קניות לא נמצאה');

    const items = await getShoppingPurchaseItemsForTenant(purchaseId, tenantId, env);
    const summary = {
      purchase_id: purchaseId,
      eligible_count: 0,
      created_count: 0,
      skipped_unlinked: 0,
      skipped_existing: 0,
      failed_count: 0,
      failures: []
    };

    for (const item of items) {
      const productId = parseOptionalProductId(item.product_id);
      if (productId === null) {
        summary.skipped_unlinked++;
        continue;
      }

      summary.eligible_count++;

      const existing = await getProductPurchaseByShoppingPurchaseItemIdForTenant(item.id, tenantId, env);
      if (existing) {
        summary.skipped_existing++;
        continue;
      }

      try {
        await insertProductPurchaseFromShoppingPurchaseItemForTenant(purchase, item, tenantId, env);
        summary.created_count++;
      } catch (error) {
        var errorMessage = error && error.message ? error.message : 'שגיאת סנכרון לא ידועה';
        if (String(errorMessage).includes('idx_product_purchases_shopping_purchase_item_unique') || String(errorMessage).includes('UNIQUE constraint failed')) {
          summary.skipped_existing++;
          continue;
        }
        summary.failed_count++;
        summary.failures.push({
          item_id: item.id,
          error: errorMessage
        });
      }
    }

    return summary;
  }

  const purchaseDetailsMatch = path.match(/^\/api\/shopping-purchases\/(\d+)$/);

  if (purchaseDetailsMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const id = purchaseDetailsMatch[1];

    const purchase = await env.DB.prepare(`
      SELECT sp.*, sl.name AS store_name
      FROM shopping_purchases sp
      LEFT JOIN shopping_lists sl ON sl.id = sp.list_id AND sl.tenant_id = sp.tenant_id
      WHERE sp.id = ?
        AND sp.tenant_id = ?
    `).bind(id, tenantId).first();

    if (!purchase) throw new Error('רכישת קניות לא נמצאה');

    const items = await env.DB.prepare(`
      SELECT *
      FROM shopping_purchase_items
      WHERE purchase_id = ?
        AND tenant_id = ?
      ORDER BY created_at ASC
    `).bind(id, tenantId).all();

    const stores = await env.DB.prepare(`
      SELECT id, name
      FROM shopping_lists
      WHERE tenant_id = ?
      ORDER BY name ASC
    `).bind(tenantId).all();

    return {
      purchase,
      items: items.results || [],
      stores: stores.results || []
    };
  }

  if (purchaseDetailsMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = purchaseDetailsMatch[1];
    const b = await request.json();

    const existingPurchase = await env.DB.prepare('SELECT id, list_id FROM shopping_purchases WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingPurchase) throw new Error('רכישת קניות לא נמצאה');

    const targetListId = Number(b.list_id || existingPurchase.list_id);
    const shoppingList = await env.DB.prepare('SELECT id FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(targetListId, tenantId).first();
    if (!shoppingList) throw new Error('חנות לא נמצאה');

    const items = Array.isArray(b.items) ? b.items : [];
    for (const item of items) {
      const productId = parseOptionalProductId(item.product_id);
      await assertValidShoppingProductLinkForTenant(productId, tenantId, env);
    }

    await env.DB.prepare(`
      UPDATE shopping_purchases
      SET list_id = ?, purchase_date = ?, total_amount = ?, notes = ?, receipt_image = ?
      WHERE id = ?
        AND tenant_id = ?
    `).bind(
      targetListId,
      b.purchase_date,
      Number(b.total_amount || 0),
      b.notes || null,
      b.receipt_image || null,
      id,
      tenantId
    ).run();

    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id = ? AND tenant_id = ?').bind(id, tenantId).run();

    for (const item of items) {
      const productId = parseOptionalProductId(item.product_id);
      await env.DB.prepare(`
        INSERT INTO shopping_purchase_items (purchase_id, item_name, quantity, price, notes, product_id, tenant_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        item.item_name,
        item.quantity || null,
        Number(item.price || 0),
        item.notes || null,
        productId,
        tenantId
      ).run();
    }

    return { success: true };
  }

  if (purchaseDetailsMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'shopping');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = purchaseDetailsMatch[1];

    const existingPurchase = await env.DB.prepare('SELECT id FROM shopping_purchases WHERE id = ? AND tenant_id = ?').bind(id, tenantId).first();
    if (!existingPurchase) throw new Error('רכישת קניות לא נמצאה');

    await env.DB.prepare('DELETE FROM shopping_purchase_items WHERE purchase_id = ? AND tenant_id = ?').bind(id, tenantId).run();
    await env.DB.prepare('DELETE FROM shopping_purchases WHERE id = ? AND tenant_id = ?').bind(id, tenantId).run();

    return { success: true };
  }


  return { error: 'Shopping route not found' };
}