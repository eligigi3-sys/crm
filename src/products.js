import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

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

function normalizeStockAdjustmentQuantity(value) {
  var num = Number(value);
  if (!Number.isFinite(num)) throw new Error('כמות שינוי לא תקינה');
  if (num === 0) throw new Error('כמות שינוי לא יכולה להיות 0');
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

async function getProductByIdForTenant(productId, tenantId, env) {
  const product = await env.DB.prepare('SELECT * FROM products WHERE id = ? AND tenant_id = ?').bind(productId, tenantId).first();
  if (!product) throw new Error('מוצר לא נמצא');
  return product;
}

async function getShoppingListById(listId, env) {
  if (!listId) return null;
  const shoppingList = await env.DB.prepare('SELECT id, name FROM shopping_lists WHERE id = ?').bind(listId).first();
  if (!shoppingList) throw new Error('ספק / חנות לא נמצאו');
  return shoppingList;
}

async function getShoppingListByIdForTenant(listId, tenantId, env) {
  if (!listId) return null;
  const shoppingList = await env.DB.prepare('SELECT id, name FROM shopping_lists WHERE id = ? AND tenant_id = ?').bind(listId, tenantId).first();
  if (!shoppingList) throw new Error('ספק / חנות לא נמצאו');
  return shoppingList;
}

async function getShoppingPurchaseById(purchaseId, env) {
  if (!purchaseId) return null;
  const shoppingPurchase = await env.DB.prepare('SELECT id, list_id, purchase_date FROM shopping_purchases WHERE id = ?').bind(purchaseId).first();
  if (!shoppingPurchase) throw new Error('רכישת קניות לא נמצאה');
  return shoppingPurchase;
}

async function getShoppingPurchaseByIdForTenant(purchaseId, tenantId, env) {
  if (!purchaseId) return null;
  const shoppingPurchase = await env.DB.prepare('SELECT id, list_id, purchase_date FROM shopping_purchases WHERE id = ? AND tenant_id = ?').bind(purchaseId, tenantId).first();
  if (!shoppingPurchase) throw new Error('רכישת קניות לא נמצאה');
  return shoppingPurchase;
}

async function getProductPurchaseById(purchaseId, env) {
  const purchase = await env.DB.prepare(
    `SELECT pp.*, 
        EXISTS(
          SELECT 1
          FROM product_stock_movements psm
          WHERE psm.movement_type = 'purchase_intake'
            AND psm.product_purchase_id = pp.id
        ) AS stock_received
     FROM product_purchases pp
     WHERE pp.id = ?`
  ).bind(purchaseId).first();
  if (!purchase) throw new Error('רשומת רכישה לא נמצאה');
  return purchase;
}

async function getProductPurchaseByIdForTenant(purchaseId, tenantId, env) {
  const purchase = await env.DB.prepare(
    `SELECT pp.*, 
        EXISTS(
          SELECT 1
          FROM product_stock_movements psm
          WHERE psm.movement_type = 'purchase_intake'
            AND psm.product_purchase_id = pp.id
            AND psm.tenant_id = pp.tenant_id
        ) AS stock_received
     FROM product_purchases pp
     WHERE pp.id = ?
       AND pp.tenant_id = ?`
  ).bind(purchaseId, tenantId).first();
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

async function getCurrentStockForProductForTenant(productId, tenantId, env) {
  const row = await env.DB.prepare(
    `SELECT COALESCE(SUM(quantity_change), 0) AS current_stock
     FROM product_stock_movements
     WHERE product_id = ?
       AND tenant_id = ?`
  ).bind(productId, tenantId).first();
  return Number(row && row.current_stock !== undefined && row.current_stock !== null ? row.current_stock : 0);
}

async function getStockMovementById(movementId, env) {
  const movement = await env.DB.prepare('SELECT * FROM product_stock_movements WHERE id = ?').bind(movementId).first();
  if (!movement) throw new Error('תנועת מלאי לא נמצאה');
  return movement;
}

async function getStockMovementByIdForTenant(movementId, tenantId, env) {
  const movement = await env.DB.prepare('SELECT * FROM product_stock_movements WHERE id = ? AND tenant_id = ?').bind(movementId, tenantId).first();
  if (!movement) throw new Error('תנועת מלאי לא נמצאה');
  return movement;
}

async function getPurchaseIntakeMovementByPurchaseId(purchaseId, env) {
  return await env.DB.prepare(
    `SELECT *
     FROM product_stock_movements
     WHERE movement_type = 'purchase_intake'
       AND product_purchase_id = ?
     ORDER BY id DESC
     LIMIT 1`
  ).bind(purchaseId).first();
}

async function getPurchaseIntakeMovementByPurchaseIdForTenant(purchaseId, tenantId, env) {
  return await env.DB.prepare(
    `SELECT *
     FROM product_stock_movements
     WHERE movement_type = 'purchase_intake'
       AND product_purchase_id = ?
       AND tenant_id = ?
     ORDER BY id DESC
     LIMIT 1`
  ).bind(purchaseId, tenantId).first();
}

function buildPurchaseIntakeNote(purchase) {
  var parts = [];
  if (purchase.purchase_date) parts.push('תאריך: ' + purchase.purchase_date);
  if (purchase.supplier_name) parts.push('ספק: ' + purchase.supplier_name);
  return parts.join(' | ') || null;
}

function isUniqueConstraintError(err) {
  var text = String((err && err.message) || err || '');
  return text.indexOf('UNIQUE constraint failed') !== -1;
}

export async function handleProducts(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const idMatch = path.match(/^\/api\/products\/(\d+)$/);
  const productStockMatch = path.match(/^\/api\/products\/(\d+)\/stock$/);
  const productStockMovementsMatch = path.match(/^\/api\/products\/(\d+)\/stock-movements$/);
  const productStockAdjustmentsMatch = path.match(/^\/api\/products\/(\d+)\/stock-adjustments$/);
  const productPurchasesMatch = path.match(/^\/api\/products\/(\d+)\/purchases$/);
  const productPurchaseMatch = path.match(/^\/api\/product-purchases\/(\d+)$/);
  const productPurchaseReceiveStockMatch = path.match(/^\/api\/product-purchases\/(\d+)\/receive-stock$/);

  if (path === '/api/products' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const search = (url.searchParams.get('search') || '').trim();
    const includeInactive = url.searchParams.get('includeInactive') === '1';

    let query = `
      SELECT *
      FROM products
      WHERE tenant_id = ?
    `;
    const params = [tenantId];

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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'reports');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const includeInactive = url.searchParams.get('includeInactive') === '1';
    const params = [tenantId, tenantId];
    let query = `SELECT
         p.*, 
         COALESCE(sm.current_stock, 0) AS current_stock
       FROM products p
       LEFT JOIN (
         SELECT product_id, tenant_id, SUM(quantity_change) AS current_stock
         FROM product_stock_movements
         WHERE tenant_id = ?
         GROUP BY product_id, tenant_id
       ) sm ON sm.product_id = p.id AND sm.tenant_id = p.tenant_id
       WHERE p.tenant_id = ?
         AND p.min_stock_alert IS NOT NULL
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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const productId = Number(productStockMatch[1]);
    const product = await getProductByIdForTenant(productId, tenantId, env);
    const currentStock = await getCurrentStockForProductForTenant(productId, tenantId, env);
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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const productId = Number(productStockMovementsMatch[1]);
    await getProductByIdForTenant(productId, tenantId, env);

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
         AND tenant_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ? OFFSET ?`
    ).bind(productId, tenantId, limit, offset).all();

    const hasMoreRow = await env.DB.prepare(
      `SELECT 1
       FROM product_stock_movements
       WHERE product_id = ?
         AND tenant_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1 OFFSET ?`
    ).bind(productId, tenantId, offset + limit).first();

    return {
      movements: movementsResult.results || [],
      pagination: {
        limit,
        offset,
        has_more: !!hasMoreRow
      }
    };
  }

  if (productStockAdjustmentsMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const productId = Number(productStockAdjustmentsMatch[1]);
    await getProductByIdForTenant(productId, tenantId, env);

    let b;
    try {
      b = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const quantityChange = normalizeStockAdjustmentQuantity(b.quantity_change);
    const reason = normalizeText(b.reason);
    const note = normalizeText(b.note);

    if (!reason) throw new Error('סיבת התאמה חובה');

    const result = await env.DB.prepare(
      `INSERT INTO product_stock_movements (
        product_id,
        movement_type,
        quantity_change,
        reference_type,
        reason,
        note,
        tenant_id,
        created_at,
        updated_at
      ) VALUES (?, 'adjustment', ?, 'manual', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      productId,
      quantityChange,
      reason,
      note,
      tenantId
    ).run();

    const movement = await getStockMovementByIdForTenant(result.meta.last_row_id, tenantId, env);
    const currentStock = await getCurrentStockForProductForTenant(productId, tenantId, env);
    const product = await getProductByIdForTenant(productId, tenantId, env);
    const minStockAlert = product.min_stock_alert;
    const isLowStock = minStockAlert !== null && minStockAlert !== undefined && minStockAlert !== ''
      ? currentStock <= Number(minStockAlert)
      : false;

    return {
      success: true,
      movement,
      current_stock: currentStock,
      min_stock_alert: minStockAlert,
      is_low_stock: isLowStock
    };
  }

  if (productPurchasesMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const productId = Number(productPurchasesMatch[1]);
    await getProductByIdForTenant(productId, tenantId, env);

    let limit = Number(url.searchParams.get('limit') || 50);
    if (!Number.isFinite(limit)) limit = 50;
    limit = Math.min(Math.max(limit, 1), 200);

    let offset = Number(url.searchParams.get('offset') || 0);
    if (!Number.isFinite(offset) || offset < 0) offset = 0;
    offset = Math.floor(offset);

    const purchasesResult = await env.DB.prepare(
      `SELECT pp.*, 
          EXISTS(
            SELECT 1
            FROM product_stock_movements psm
            WHERE psm.movement_type = 'purchase_intake'
              AND psm.product_purchase_id = pp.id
              AND psm.tenant_id = pp.tenant_id
          ) AS stock_received
       FROM product_purchases pp
       WHERE pp.product_id = ?
         AND pp.tenant_id = ?
       ORDER BY pp.purchase_date DESC, pp.id DESC
       LIMIT ? OFFSET ?`
    ).bind(productId, tenantId, limit, offset).all();

    const hasMoreRow = await env.DB.prepare(
      `SELECT 1
       FROM product_purchases
       WHERE product_id = ?
         AND tenant_id = ?
       ORDER BY purchase_date DESC, id DESC
       LIMIT 1 OFFSET ?`
    ).bind(productId, tenantId, offset + limit).first();

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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const purchaseId = Number(productPurchaseMatch[1]);
    const purchase = await getProductPurchaseByIdForTenant(purchaseId, tenantId, env);
    return { purchase };
  }

  if (productPurchaseReceiveStockMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const purchaseId = Number(productPurchaseReceiveStockMatch[1]);
    const purchase = await getProductPurchaseByIdForTenant(purchaseId, tenantId, env);
    const product = await getProductByIdForTenant(purchase.product_id, tenantId, env);

    const existingMovement = await getPurchaseIntakeMovementByPurchaseIdForTenant(purchaseId, tenantId, env);
    if (existingMovement) {
      const currentStock = await getCurrentStockForProductForTenant(purchase.product_id, tenantId, env);
      const minStockAlert = product.min_stock_alert;
      const isLowStock = minStockAlert !== null && minStockAlert !== undefined && minStockAlert !== ''
        ? currentStock <= Number(minStockAlert)
        : false;
      return {
        success: true,
        already_received: true,
        movement: existingMovement,
        current_stock: currentStock,
        is_low_stock: isLowStock
      };
    }

    let movement;
    try {
      const result = await env.DB.prepare(
        `INSERT INTO product_stock_movements (
          product_id,
          movement_type,
          quantity_change,
          reference_type,
          reference_id,
          product_purchase_id,
          reason,
          note,
          tenant_id,
          created_at,
          updated_at
        ) VALUES (?, 'purchase_intake', ?, 'product_purchase', ?, ?, 'קליטת מלאי מרכישה', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      ).bind(
        purchase.product_id,
        purchase.quantity,
        purchase.id,
        purchase.id,
        buildPurchaseIntakeNote(purchase),
        tenantId
      ).run();

      movement = await getStockMovementByIdForTenant(result.meta.last_row_id, tenantId, env);
    } catch (err) {
      if (!isUniqueConstraintError(err)) throw err;
      const racedMovement = await getPurchaseIntakeMovementByPurchaseIdForTenant(purchaseId, tenantId, env);
      if (!racedMovement) throw err;
      const currentStock = await getCurrentStockForProductForTenant(purchase.product_id, tenantId, env);
      const minStockAlert = product.min_stock_alert;
      const isLowStock = minStockAlert !== null && minStockAlert !== undefined && minStockAlert !== ''
        ? currentStock <= Number(minStockAlert)
        : false;
      return {
        success: true,
        already_received: true,
        movement: racedMovement,
        current_stock: currentStock,
        is_low_stock: isLowStock
      };
    }

    const currentStock = await getCurrentStockForProductForTenant(purchase.product_id, tenantId, env);
    const minStockAlert = product.min_stock_alert;
    const isLowStock = minStockAlert !== null && minStockAlert !== undefined && minStockAlert !== ''
      ? currentStock <= Number(minStockAlert)
      : false;

    return {
      success: true,
      already_received: false,
      movement,
      current_stock: currentStock,
      is_low_stock: isLowStock
    };
  }

  if (idMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];
    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!product) throw new Error('מוצר לא נמצא');

    return { product };
  }

  if (productPurchasesMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const productId = Number(productPurchasesMatch[1]);
    await getProductByIdForTenant(productId, tenantId, env);

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

    await getShoppingListByIdForTenant(shoppingListId, tenantId, env);
    const shoppingPurchase = await getShoppingPurchaseByIdForTenant(shoppingPurchaseId, tenantId, env);

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
        tenant_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
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
      notes,
      tenantId
    ).run();

    const purchase = await getProductPurchaseByIdForTenant(result.meta.last_row_id, tenantId, env);
    return { success: true, purchase };
  }

  if (path === '/api/products' && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
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
        tenant_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
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
      tenantId
    ).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();

    return { success: true, product };
  }

  if (productPurchaseMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const purchaseId = Number(productPurchaseMatch[1]);
    const existingPurchase = await getProductPurchaseByIdForTenant(purchaseId, tenantId, env);

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

    await getProductByIdForTenant(existingPurchase.product_id, tenantId, env);
    await getShoppingListByIdForTenant(shoppingListId, tenantId, env);
    const shoppingPurchase = await getShoppingPurchaseByIdForTenant(shoppingPurchaseId, tenantId, env);

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
       WHERE id = ?
         AND tenant_id = ?`
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
      purchaseId,
      tenantId
    ).run();

    const purchase = await getProductPurchaseByIdForTenant(purchaseId, tenantId, env);
    return { success: true, purchase };
  }

  if (idMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];
    const b = await request.json();
    const name = normalizeText(b.name);

    if (!name) throw new Error('שם מוצר חובה');

    const existing = await env.DB.prepare(
      'SELECT id FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

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
       WHERE id = ?
         AND tenant_id = ?`
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
      id,
      tenantId
    ).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    return { success: true, product };
  }

  if (idMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'products');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];

    const existing = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!existing) throw new Error('מוצר לא נמצא');

    await env.DB.prepare(
      `UPDATE products
       SET is_active = 0,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND tenant_id = ?`
    ).bind(id, tenantId).run();

    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    return { success: true, product };
  }

  throw new Error('Products route not found');
}
