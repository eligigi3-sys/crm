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

export async function handleProducts(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const idMatch = path.match(/^\/api\/products\/(\d+)$/);

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

  if (idMatch && method === 'GET') {
    const id = idMatch[1];
    const product = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(id).first();

    if (!product) throw new Error('מוצר לא נמצא');

    return { product };
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

  throw new Error('Products route not found');
}
