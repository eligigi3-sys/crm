// ============================================================
// products.js - ניהול מוצרים / מלאי בסיסי
// ============================================================

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  var text = String(value).trim();
  return text ? text : null;
}

function normalizeNumber(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback === undefined ? null : fallback;
  }
  var num = Number(value);
  return Number.isFinite(num) ? num : fallback === undefined ? null : fallback;
}

function normalizeActive(value) {
  if (value === undefined || value === null || value === '') return 1;
  if (value === 0 || value === '0' || value === false) return 0;
  return 1;
}

function normalizePurchaseType(value) {
  var type = String(value || 'manual').trim().toLowerCase() || 'manual';
  if (!['manual', 'shopping', 'import'].includes(type)) throw new Error('סוג רכישה לא תקין');
  return type;
}

function normalizePurchaseDate(value) {
  var date = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('תאריך רכישה לא תקין');
  return date;
}

function normalizePositiveNumber(value, fieldLabel) {
  var num = Number(value);
  if (!Number.isFinite(num) || num <= 0) throw new Error(fieldLabel + ' חייב להיות גדול מ-0');
  return num;
}

function normalizeMoney(value, fieldLabel, allowZero = true) {
  var num = Number(value);
  if (!Number.isFinite(num)) throw new Error(fieldLabel + ' לא תקין');
  if (allowZero ? num < 0 : num <= 0) throw new Error(fieldLabel + ' לא תקין');
  return Math.round(num * 100) / 100;
}

function normalizeOptionalId(value, fieldLabel) {
  if (value === undefined || value === null || value === '') return null;
  var num = Number(value);
  if (!Number.isInteger(num) || num <= 0) throw new Error(fieldLabel + ' לא תקין');
  return num;
}

function calculatePurchaseTotal(quantity, unitPrice) {
  return Math.round(quantity * unitPrice * 100) / 100;
}

function resolveTotalPrice(rawTotal, quantity, unitPrice) {
  var calculatedTotal = calculatePurchaseTotal(quantity, unitPrice);
  if (rawTotal === undefined || rawTotal === null || rawTotal === '') return calculatedTotal;
  var total = normalizeMoney(rawTotal, 'סכום כולל');
  if (Math.abs(total - calculatedTotal) > 0.01) {
    throw new Error('סכום כולל לא תואם לכמות ולמחיר יחידה');
  }
  return total;
}

async function getProductById(productId, env) {
  const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).first();
  if (!product) throw new Error('מוצר לא נמצא');
  return product;
}

async function getShoppingListById(listId, env) {
  if (!listId) return null;
  const shoppingList = await env.DB.prepare('SELECT id, name FROM shopping_lists WHERE id = ?').bind(listId).first();
  if (!shoppingList) throw new Error('ספק / חנות לא נמצאו');
  return shoppingList;
}

async function getShoppingPurchaseById(purchaseId, env) {
  if (!purchaseId) return null;
  const shoppingPurchase = await env.DB.prepare('SELECT id, list_id, purchase_date FROM shopping_purchases WHERE id = ?').bind(purchaseId).first();
  if (!shoppingPurchase) throw new Error('רכישת קניות לא נמצאה');
  return shoppingPurchase;
}

async function getProductPurchaseById(purchaseId, env) {
  const purchase = await env.DB.prepare('SELECT * FROM product_purchases WHERE id = ?').bind(purchaseId).first();
  if (!purchase) throw new Error('רשומת רכישה לא נמצאה');
  return purchase;
}

async function getCurrentStockForProduct(productId, env) {
  const row = await env.DB.prepare(
    `SELECT COALESCE(SUM(quantity_change), 0) AS current_stock
     FROM product_stock_movements
     WHERE product_id = ?`
  ).bind(productId).first();
  return Number(row && row.current_stock !== undefined && row.current_stock !== null ? row.current_stock : 0);
}

export async function handleProducts(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const idMatch = path.match(/^\/api\/products\/(\d+)$/);
  const productStockMatch = path.match(/^\/api\/products\/(\d+)\/stock$/);
  const productStockMovementsMatch = path.match(/^\/api\/products\/(\d+)\/stock-movements$/);
  const productPurchasesMatch = path.match(/^\/api\/products\/(\d+)\/purchases$/);
  const productPurchaseMatch = path.match(/^\/api\/product-purchases\/(\d+)$/);

  if (path === '/api/products' && method === 'GET') {
    const search = (url.searchParams.get('search') || '').trim();
    const includeInactive = url.searchParams.get('includeInactive') === '1';

    let query = `
      SELECT *
      FROM products
      WHERE 1=1
    `;
    const params = [];

    if (!includeInactive) {
      query += ` AND is_active = 1`;
    }

    if (search) {
      query += `
        AND (
          name LIKE ?
          OR category LIKE ?
          OR sku LIKE ?
          OR unit LIKE ?
          OR notes LIKE ?
        )
      `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY is_active DESC, name COLLATE NOCASE ASC, id DESC LIMIT 300`;

    const { results } = await env.DB.prepare(query).bind(...params).all();
    return { products: results };
  }

  if (path === '/api/inventory/low-stock' && method === 'GET') {
    const includeInactive = url.searchParams.get('includeInactive') === '1';
    const params = [];
    let query = `SELECT
         p.*, 
         COALESCE(sm.current_stock, 0) AS current_stock
       FROM products p
       LEFT JOIN (
         SELECT product_id, SUM(quantity_change) AS current_stock
         FROM product_stock_movements
         GROUP BY product_id
       ) sm ON sm.product_id = p.id
       WHERE p.min_stock_alert IS NOT NULL
         AND COALESCE(sm.current_stock, 0) <= p.min_stock_alert`;

    if (!includeInactive) {
      query += `
         AND p.is_active = 1`;
    }

    query += `
       ORDER BY COALESCE(sm.current_stock, 0) ASC, p.min_stock_alert ASC, p.name COLLATE NOCASE ASC, p.id ASC`;

    const rows = await env.DB.prepare(query).bind(...params).all();

    return {
      products: (rows.results || []).map(function(product) {
        var currentStock = Number(product.current_stock || 0);
        return {
          product: product,
          current_stock: currentStock,
          min_stock_alert: product.min_stock_alert,
          is_low_stock: true
        };
      })
    };
  }

  if (productStockMatch && method === 'GET') {
    const productId = Number(productStockMatch[1]);
    const product = await getProductById(productId, env);
    const currentStock = await getCurrentStockForProduct(productId, env);
    const minStockAlert = product.min_stock_alert;
    const isLowStock = minStockAlert !== null && minStockAlert !== undefined && minStockAlert !== ''
      ? currentStock <= Number(minStockAlert)
      : false;

    return {
      product,
      current_stock: currentStock,
      min_stock_alert: minStockAlert,
      is_low_stock: isLowStock
    };
  }

  if (productStockMovementsMatch && method === 'GET') {
    const productId = Number(productStockMovementsMatch[1]);
    await getProductById(productId, env);

    let limit = Number(url.searchParams.get('limit') || 100);
    if (!Number.isFinite(limit)) limit = 100;
    limit = Math.min(Math.max(limit, 1), 200);

    let offset = Number(url.searchParams.get('offset') || 0);
    if (!Number.isFinite(offset) || offset < 0) offset = 0;
    offset = Math.floor(offset);

    const movementsResult = await env.DB.prepare(
      `SELECT *
       FROM product_stock_movements
       WHERE product_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`
    ).bind(productId, limit, offset).all();

    const hasMoreRow = await env.DB.prepare(
      `SELECT 1
       FROM product_stock_movements
       WHERE product_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1 OFFSET ?`
    ).bind(productId, offset + limit).first();

    return {
      movements: movementsResult.results || [],
      pagination: {
        limit,
        offset,
        has_more: !!hasMoreRow
      }
    };
  }

  if (productPurchasesMatch && method === 'GET') {
    const productId = Number(productPurchasesMatch[1]);
    await getProductById(productId, env);

    let limit = Number(url.searchParams.get('limit') || 50);
    if (!Number.isFinite(limit)) limit = 50;
    limit = Math.min(Math.max(limit, 1), 200);

    let offset = Number(url.searchParams.get('offset') || 0);
    if (!Number.isFinite(offset) || offset < 0) offset = 0;
    offset = Math.floor(offset);

    const purchasesResult = await env.DB.prepare(
      `SELECT *
       FROM product_purchases
       WHERE product_id = ?
       ORDER BY purchase_date DESC, id DESC
       LIMIT ? OFFSET ?`
    ).bind(productId, limit, offset).all();

    const hasMoreRow = await env.DB.prepare(
      `SELECT 1
       FROM product_purchases
       WHERE product_id = ?
       ORDER BY purchase_date DESC, id DESC
       LIMIT 1 OFFSET ?`
    ).bind(productId, offset + limit).first();

    return {
      purchases: purchasesResult.results || [],
      pagination: {
        limit,
        offset,
        has_more: !!hasMoreRow
      }
    };
  }

  if (productPurchaseMatch && method === 'GET') {
    const purchaseId = Number(productPurchaseMatch[1]);
    const purchase = await getProductPurchaseById(purchaseId, env);
    return { purchase };
  }

  if (idMatch && method === 'GET') {
    const id = idMatch[1];
    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    if (!product) throw new Error('מוצר לא נמצא');

    return { product };
  }

  if (productPurchasesMatch && method === 'POST') {
    const productId = Number(productPurchasesMatch[1]);
    await getProductById(productId, env);

    let b;
    try {
      b = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const purchaseType = normalizePurchaseType(b.purchase_type);
    const purchaseDate = normalizePurchaseDate(b.purchase_date);
    const quantity = normalizePositiveNumber(b.quantity, 'כמות');
    const unitPrice = normalizeMoney(b.unit_price, 'מחיר יחידה');
    const totalPrice = resolveTotalPrice(b.total_price, quantity, unitPrice);
    const shoppingListId = normalizeOptionalId(b.shopping_list_id, 'ספק / חנות');
    const shoppingPurchaseId = normalizeOptionalId(b.shopping_purchase_id, 'רכישת קניות');
    const supplierName = normalizeText(b.supplier_name);
    const notes = normalizeText(b.notes);

    await getShoppingListById(shoppingListId, env);
    const shoppingPurchase = await getShoppingPurchaseById(shoppingPurchaseId, env);

    if (shoppingListId && shoppingPurchase && Number(shoppingPurchase.list_id) !== shoppingListId) {
      throw new Error('רכישת הקניות לא שייכת לחנות שנבחרה');
    }

    const result = await env.DB.prepare(
      `INSERT INTO product_purchases (
        product_id,
        purchase_type,
        purchase_date,
        quantity,
        unit_price,
        total_price,
        shopping_list_id,
        shopping_purchase_id,
        supplier_name,
        notes,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      productId,
      purchaseType,
      purchaseDate,
      quantity,
      unitPrice,
      totalPrice,
      shoppingListId,
      shoppingPurchaseId,
      supplierName,
      notes
    ).run();

    const purchase = await getProductPurchaseById(result.meta.last_row_id, env);
    return { success: true, purchase };
  }

  if (path === '/api/products' && method === 'POST') {
    const b = await request.json();
    const name = normalizeText(b.name);

    if (!name) throw new Error('שם מוצר חובה');

    const result = await env.DB.prepare(
      `INSERT INTO products (
        name,
        category,
        sku,
        unit,
        cost_price,
        sale_price,
        stock_quantity,
        min_stock_alert,
        notes,
        is_active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      name,
      normalizeText(b.category),
      normalizeText(b.sku),
      normalizeText(b.unit),
      normalizeNumber(b.cost_price),
      normalizeNumber(b.sale_price),
      normalizeNumber(b.stock_quantity, 0),
      normalizeNumber(b.min_stock_alert),
      normalizeText(b.notes),
      normalizeActive(b.is_active)
    ).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return { success: true, product };
  }

  if (productPurchaseMatch && method === 'PUT') {
    const purchaseId = Number(productPurchaseMatch[1]);
    const existingPurchase = await getProductPurchaseById(purchaseId, env);

    let b;
    try {
      b = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const purchaseType = normalizePurchaseType(b.purchase_type);
    const purchaseDate = normalizePurchaseDate(b.purchase_date);
    const quantity = normalizePositiveNumber(b.quantity, 'כמות');
    const unitPrice = normalizeMoney(b.unit_price, 'מחיר יחידה');
    const totalPrice = resolveTotalPrice(b.total_price, quantity, unitPrice);
    const shoppingListId = normalizeOptionalId(b.shopping_list_id, 'ספק / חנות');
    const shoppingPurchaseId = normalizeOptionalId(b.shopping_purchase_id, 'רכישת קניות');
    const supplierName = normalizeText(b.supplier_name);
    const notes = normalizeText(b.notes);

    await getProductById(existingPurchase.product_id, env);
    await getShoppingListById(shoppingListId, env);
    const shoppingPurchase = await getShoppingPurchaseById(shoppingPurchaseId, env);

    if (shoppingListId && shoppingPurchase && Number(shoppingPurchase.list_id) !== shoppingListId) {
      throw new Error('רכישת הקניות לא שייכת לחנות שנבחרה');
    }

    await env.DB.prepare(
      `UPDATE product_purchases
       SET
         purchase_type = ?,
         purchase_date = ?,
         quantity = ?,
         unit_price = ?,
         total_price = ?,
         shopping_list_id = ?,
         shopping_purchase_id = ?,
         supplier_name = ?,
         notes = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      purchaseType,
      purchaseDate,
      quantity,
      unitPrice,
      totalPrice,
      shoppingListId,
      shoppingPurchaseId,
      supplierName,
      notes,
      purchaseId
    ).run();

    const purchase = await getProductPurchaseById(purchaseId, env);
    return { success: true, purchase };
  }

  if (idMatch && method === 'PUT') {
    const id = idMatch[1];
    const b = await request.json();
    const name = normalizeText(b.name);

    if (!name) throw new Error('שם מוצר חובה');

    const existing = await env.DB.prepare(
      'SELECT id FROM products WHERE id = ?'
    ).bind(id).first();

    if (!existing) throw new Error('מוצר לא נמצא');

    await env.DB.prepare(
      `UPDATE products
       SET
         name = ?,
         category = ?,
         sku = ?,
         unit = ?,
         cost_price = ?,
         sale_price = ?,
         stock_quantity = ?,
         min_stock_alert = ?,
         notes = ?,
         is_active = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      name,
      normalizeText(b.category),
      normalizeText(b.sku),
      normalizeText(b.unit),
      normalizeNumber(b.cost_price),
      normalizeNumber(b.sale_price),
      normalizeNumber(b.stock_quantity, 0),
      normalizeNumber(b.min_stock_alert),
      normalizeText(b.notes),
      normalizeActive(b.is_active),
      id
    ).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    return { success: true, product };
  }

  if (idMatch && method === 'DELETE') {
    const id = idMatch[1];

    const existing = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    if (!existing) throw new Error('מוצר לא נמצא');

    await env.DB.prepare(
      `UPDATE products
       SET is_active = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(id).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    return { success: true, product };
  }

  throw new Error('Products route not found');
}
