import { requireTenantContext } from './auth.js';

// ============================================================
// leads.js - לוגיקת אירועים (נפרדת מלקוחות!)
// ============================================================

async function ensureCounter(name, env) {
  await env.DB.prepare(
    'INSERT OR IGNORE INTO counters (name, value) VALUES (?, 0)'
  ).bind(name).run();
}

async function getNextCounter(name, env) {
  await ensureCounter(name, env);

  await env.DB.prepare(
    'UPDATE counters SET value = value + 1 WHERE name = ?'
  ).bind(name).run();

  const row = await env.DB.prepare(
    'SELECT value FROM counters WHERE name = ?'
  ).bind(name).first();

  return row.value;
}

// 🔥 הפונקציה הכי חשובה – לא נוגעים בלקוח קיים!
async function findOrCreateContact(name, phone, email, env) {
  let contact = null;

  if (phone) {
    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE phone = ?'
    ).bind(phone).first();
  }

  if (!contact && email) {
    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE email = ?'
    ).bind(email).first();
  }

  if (!contact) {
    const contactNum = await getNextCounter('contacts', env);

    const result = await env.DB.prepare(
      `INSERT INTO contacts
        (contact_num, name, phone, email, created_at, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      contactNum,
      name || 'לקוח ללא שם',
      phone || null,
      email || null
    ).run();

    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ?'
    ).bind(result.meta.last_row_id).first();
  }

  return contact;
}

async function findOrCreateContactForTenant(name, phone, email, tenantId, env) {
  let contact = null;

  if (phone) {
    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE phone = ? AND tenant_id = ?'
    ).bind(phone, tenantId).first();
  }

  if (!contact && email) {
    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE email = ? AND tenant_id = ?'
    ).bind(email, tenantId).first();
  }

  if (!contact) {
    const contactNum = await getNextCounter('contacts', env);

    const result = await env.DB.prepare(
      `INSERT INTO contacts
        (contact_num, name, phone, email, tenant_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      contactNum,
      name || 'לקוח ללא שם',
      phone || null,
      email || null,
      tenantId
    ).run();

    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();
  }

  return contact;
}

function normalizeAssignmentText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeAssignmentNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

async function getLeadById(leadId, env) {
  return env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(leadId).first();
}

async function getLeadByIdForTenant(leadId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM leads WHERE id = ? AND tenant_id = ?').bind(leadId, tenantId).first();
}

async function getEmployeeById(employeeId, env) {
  return env.DB.prepare('SELECT * FROM employees WHERE id = ?').bind(employeeId).first();
}

async function getEmployeeByIdForTenant(employeeId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM employees WHERE id = ? AND tenant_id = ?').bind(employeeId, tenantId).first();
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

async function getReservedElsewhereForProduct(productId, eventId, env) {
  const row = await env.DB.prepare(
    `SELECT COALESCE(SUM(reserved_quantity), 0) AS reserved_elsewhere
     FROM event_product_allocations
     WHERE product_id = ?
       AND event_id != ?
       AND status IN ('reserved', 'partial')`
  ).bind(productId, eventId).first();
  return Number(row && row.reserved_elsewhere !== undefined && row.reserved_elsewhere !== null ? row.reserved_elsewhere : 0);
}

async function getReservedElsewhereForProductForTenant(productId, eventId, tenantId, env) {
  const row = await env.DB.prepare(
    `SELECT COALESCE(SUM(reserved_quantity), 0) AS reserved_elsewhere
     FROM event_product_allocations
     WHERE product_id = ?
       AND event_id != ?
       AND tenant_id = ?
       AND status IN ('reserved', 'partial')`
  ).bind(productId, eventId, tenantId).first();
  return Number(row && row.reserved_elsewhere !== undefined && row.reserved_elsewhere !== null ? row.reserved_elsewhere : 0);
}

async function getProductById(productId, env) {
  return env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(productId).first();
}

async function getProductByIdForTenant(productId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM products WHERE id = ? AND tenant_id = ?').bind(productId, tenantId).first();
}

async function getEventAllocationById(allocationId, env) {
  return env.DB.prepare('SELECT * FROM event_product_allocations WHERE id = ?').bind(allocationId).first();
}

async function getEventAllocationByIdForTenant(allocationId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM event_product_allocations WHERE id = ? AND tenant_id = ?').bind(allocationId, tenantId).first();
}

function normalizeAllocationStatus(value) {
  const status = String(value || 'draft').trim().toLowerCase();
  if (!['draft', 'reserved', 'cancelled'].includes(status)) throw new Error('סטטוס הקצאה לא תקין');
  return status;
}

function normalizeAllocationNumber(value, fieldLabel) {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new Error(fieldLabel + ' לא תקין');
  if (num < 0) throw new Error(fieldLabel + ' לא יכול להיות שלילי');
  return Math.round(num * 100) / 100;
}

function normalizeAllocationNote(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeInventoryActionQuantity(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) throw new Error('כמות שימוש חייבת להיות גדולה מ-0');
  return Math.round(num * 100) / 100;
}

function normalizeOptionalAllocationId(value) {
  if (value === undefined || value === null || value === '') return null;
  const allocationId = Number(value);
  if (!Number.isInteger(allocationId) || allocationId <= 0) throw new Error('allocation_id לא תקין');
  return allocationId;
}

function mapInventoryActionRow(row) {
  return {
    id: row.id,
    action_type: row.action_type,
    quantity: Number(row.quantity || 0),
    note: row.note || null,
    performed_at: row.performed_at || null,
    created_at: row.created_at || null,
    allocation_id: row.allocation_id || null,
    product_id: row.product_id,
    product_name: row.product_name,
    product_category: row.product_category,
    product_sku: row.product_sku,
    product_unit: row.product_unit,
    product_is_active: row.product_is_active,
    stock_movement: row.stock_movement_id ? {
      exists: true,
      id: row.stock_movement_id,
      movement_type: row.stock_movement_type,
      quantity_change: Number(row.stock_movement_quantity_change || 0),
      created_at: row.stock_movement_created_at || null
    } : {
      exists: false,
      id: null,
      movement_type: null,
      quantity_change: null,
      created_at: null
    }
  };
}

async function getInventoryActionWithMovementById(actionId, env) {
  const row = await env.DB.prepare(`
    SELECT
      eia.id,
      eia.event_id,
      eia.allocation_id,
      eia.product_id,
      eia.action_type,
      eia.quantity,
      eia.note,
      eia.performed_at,
      eia.created_at,
      eia.updated_at,
      p.name AS product_name,
      p.category AS product_category,
      p.sku AS product_sku,
      p.unit AS product_unit,
      p.is_active AS product_is_active,
      psm.id AS stock_movement_id,
      psm.movement_type AS stock_movement_type,
      psm.quantity_change AS stock_movement_quantity_change,
      psm.created_at AS stock_movement_created_at
    FROM event_inventory_actions eia
    INNER JOIN products p ON p.id = eia.product_id
    LEFT JOIN product_stock_movements psm ON psm.event_inventory_action_id = eia.id
    WHERE eia.id = ?
  `).bind(actionId).first();

  return row ? mapInventoryActionRow(row) : null;
}

async function getInventoryActionWithMovementByIdForTenant(actionId, tenantId, env) {
  const row = await env.DB.prepare(`
    SELECT
      eia.id,
      eia.event_id,
      eia.allocation_id,
      eia.product_id,
      eia.action_type,
      eia.quantity,
      eia.note,
      eia.performed_at,
      eia.created_at,
      eia.updated_at,
      p.name AS product_name,
      p.category AS product_category,
      p.sku AS product_sku,
      p.unit AS product_unit,
      p.is_active AS product_is_active,
      psm.id AS stock_movement_id,
      psm.movement_type AS stock_movement_type,
      psm.quantity_change AS stock_movement_quantity_change,
      psm.created_at AS stock_movement_created_at
    FROM event_inventory_actions eia
    INNER JOIN products p ON p.id = eia.product_id AND p.tenant_id = eia.tenant_id
    LEFT JOIN product_stock_movements psm ON psm.event_inventory_action_id = eia.id AND psm.tenant_id = eia.tenant_id
    WHERE eia.id = ?
      AND eia.tenant_id = ?
  `).bind(actionId, tenantId).first();

  return row ? mapInventoryActionRow(row) : null;
}

async function findRecentMatchingUsageAction(eventId, productId, quantity, allocationId, note, env) {
  const row = await env.DB.prepare(`
    SELECT
      eia.id,
      eia.event_id,
      eia.allocation_id,
      eia.product_id,
      eia.action_type,
      eia.quantity,
      eia.note,
      eia.performed_at,
      eia.created_at,
      eia.updated_at,
      p.name AS product_name,
      p.category AS product_category,
      p.sku AS product_sku,
      p.unit AS product_unit,
      p.is_active AS product_is_active,
      psm.id AS stock_movement_id,
      psm.movement_type AS stock_movement_type,
      psm.quantity_change AS stock_movement_quantity_change,
      psm.created_at AS stock_movement_created_at
    FROM event_inventory_actions eia
    INNER JOIN products p ON p.id = eia.product_id
    INNER JOIN product_stock_movements psm ON psm.event_inventory_action_id = eia.id
    WHERE eia.event_id = ?
      AND eia.product_id = ?
      AND eia.action_type = 'usage'
      AND eia.quantity = ?
      AND ((eia.allocation_id IS NULL AND ? IS NULL) OR eia.allocation_id = ?)
      AND COALESCE(eia.note, '') = COALESCE(?, '')
      AND eia.created_at >= datetime('now', '-15 seconds')
    ORDER BY eia.id DESC
    LIMIT 1
  `).bind(eventId, productId, quantity, allocationId, allocationId, note).first();

  return row ? mapInventoryActionRow(row) : null;
}

async function findRecentMatchingUsageActionForTenant(eventId, productId, quantity, allocationId, note, tenantId, env) {
  const row = await env.DB.prepare(`
    SELECT
      eia.id,
      eia.event_id,
      eia.allocation_id,
      eia.product_id,
      eia.action_type,
      eia.quantity,
      eia.note,
      eia.performed_at,
      eia.created_at,
      eia.updated_at,
      p.name AS product_name,
      p.category AS product_category,
      p.sku AS product_sku,
      p.unit AS product_unit,
      p.is_active AS product_is_active,
      psm.id AS stock_movement_id,
      psm.movement_type AS stock_movement_type,
      psm.quantity_change AS stock_movement_quantity_change,
      psm.created_at AS stock_movement_created_at
    FROM event_inventory_actions eia
    INNER JOIN products p ON p.id = eia.product_id AND p.tenant_id = eia.tenant_id
    INNER JOIN product_stock_movements psm ON psm.event_inventory_action_id = eia.id AND psm.tenant_id = eia.tenant_id
    WHERE eia.event_id = ?
      AND eia.product_id = ?
      AND eia.tenant_id = ?
      AND eia.action_type = 'usage'
      AND eia.quantity = ?
      AND ((eia.allocation_id IS NULL AND ? IS NULL) OR eia.allocation_id = ?)
      AND COALESCE(eia.note, '') = COALESCE(?, '')
      AND eia.created_at >= datetime('now', '-15 seconds')
    ORDER BY eia.id DESC
    LIMIT 1
  `).bind(eventId, productId, tenantId, quantity, allocationId, allocationId, note).first();

  return row ? mapInventoryActionRow(row) : null;
}

function isUniqueConstraintError(err) {
  const text = String((err && err.message) || err || '');
  return text.indexOf('UNIQUE constraint failed') !== -1;
}

async function validateAllocationPayload(payload, env, eventId, existingAllocation) {
  const productId = Number(payload.product_id !== undefined ? payload.product_id : existingAllocation && existingAllocation.product_id);
  if (!Number.isInteger(productId) || productId <= 0) throw new Error('product_id חובה');

  const product = await getProductById(productId, env);
  if (!product) throw new Error('מוצר לא נמצא');
  if (!existingAllocation && Number(product.is_active) === 0) throw new Error('לא ניתן להוסיף מוצר לא פעיל לתכנון');

  const plannedQuantity = normalizeAllocationNumber(
    payload.planned_quantity !== undefined ? payload.planned_quantity : existingAllocation && existingAllocation.planned_quantity,
    'כמות מתוכננת'
  );
  const reservedQuantity = normalizeAllocationNumber(
    payload.reserved_quantity !== undefined ? payload.reserved_quantity : existingAllocation && existingAllocation.reserved_quantity,
    'כמות שמורה'
  );
  const status = normalizeAllocationStatus(payload.status !== undefined ? payload.status : existingAllocation && existingAllocation.status);
  const note = normalizeAllocationNote(payload.note !== undefined ? payload.note : existingAllocation && existingAllocation.note);

  if (reservedQuantity > plannedQuantity) throw new Error('כמות שמורה לא יכולה להיות גדולה מכמות מתוכננת');
  if (status === 'reserved' && reservedQuantity <= 0) throw new Error('כדי לסמן כשמור צריך כמות שמורה גדולה מ-0');

  const currentStock = await getCurrentStockForProduct(productId, env);
  const reservedElsewhere = await getReservedElsewhereForProduct(productId, eventId, env);
  const availableStock = currentStock - reservedElsewhere;

  if (reservedQuantity > availableStock) {
    throw new Error('לא ניתן לשמור יותר מהמלאי הזמין כרגע');
  }

  return {
    product,
    productId,
    plannedQuantity,
    reservedQuantity,
    status,
    note,
    currentStock,
    reservedElsewhere,
    availableStock
  };
}

async function validateAllocationPayloadForTenant(payload, env, eventId, existingAllocation, tenantId) {
  const productId = Number(payload.product_id !== undefined ? payload.product_id : existingAllocation && existingAllocation.product_id);
  if (!Number.isInteger(productId) || productId <= 0) throw new Error('product_id חובה');

  const product = await getProductByIdForTenant(productId, tenantId, env);
  if (!product) throw new Error('מוצר לא נמצא');
  if (!existingAllocation && Number(product.is_active) === 0) throw new Error('לא ניתן להוסיף מוצר לא פעיל לתכנון');

  const plannedQuantity = normalizeAllocationNumber(
    payload.planned_quantity !== undefined ? payload.planned_quantity : existingAllocation && existingAllocation.planned_quantity,
    'כמות מתוכננת'
  );
  const reservedQuantity = normalizeAllocationNumber(
    payload.reserved_quantity !== undefined ? payload.reserved_quantity : existingAllocation && existingAllocation.reserved_quantity,
    'כמות שמורה'
  );
  const status = normalizeAllocationStatus(payload.status !== undefined ? payload.status : existingAllocation && existingAllocation.status);
  const note = normalizeAllocationNote(payload.note !== undefined ? payload.note : existingAllocation && existingAllocation.note);

  if (reservedQuantity > plannedQuantity) throw new Error('כמות שמורה לא יכולה להיות גדולה מכמות מתוכננת');
  if (status === 'reserved' && reservedQuantity <= 0) throw new Error('כדי לסמן כשמור צריך כמות שמורה גדולה מ-0');

  const currentStock = await getCurrentStockForProductForTenant(productId, tenantId, env);
  const reservedElsewhere = await getReservedElsewhereForProductForTenant(productId, eventId, tenantId, env);
  const availableStock = currentStock - reservedElsewhere;

  if (reservedQuantity > availableStock) {
    throw new Error('לא ניתן לשמור יותר מהמלאי הזמין כרגע');
  }

  return {
    product,
    productId,
    plannedQuantity,
    reservedQuantity,
    status,
    note,
    currentStock,
    reservedElsewhere,
    availableStock
  };
}

export async function handleLeads(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const assignmentIdMatch = path.match(/^\/api\/lead-employees\/(\d+)$/);
  const leadEmployeesMatch = path.match(/^\/api\/leads\/(\d+)\/employees$/);
  const leadInventoryMatch = path.match(/^\/api\/leads\/(\d+)\/inventory$/);
  const leadInventoryActionsMatch = path.match(/^\/api\/leads\/(\d+)\/inventory-actions$/);
  const leadInventoryAllocationMatch = path.match(/^\/api\/leads\/(\d+)\/inventory\/(\d+)$/);
  const leadInventoryAllocationCancelMatch = path.match(/^\/api\/leads\/(\d+)\/inventory\/(\d+)\/cancel$/);

  if (leadInventoryMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const leadId = leadInventoryMatch[1];
    const tenantId = tenantCtx.tenant.id;
    const event = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
      WHERE leads.id = ?
        AND leads.tenant_id = ?
    `).bind(leadId, tenantId).first();

    if (!event) throw new Error('Lead not found');

    const { results } = await env.DB.prepare(`
      SELECT
        epa.id,
        epa.event_id,
        epa.product_id,
        epa.planned_quantity,
        epa.reserved_quantity,
        epa.status,
        epa.note,
        epa.created_at,
        epa.updated_at,
        p.name AS product_name,
        p.category AS product_category,
        p.sku AS product_sku,
        p.unit AS product_unit,
        p.is_active AS product_is_active,
        (
          SELECT pp.purchase_date
          FROM product_purchases pp
          WHERE pp.product_id = epa.product_id
          ORDER BY pp.purchase_date DESC, pp.id DESC
          LIMIT 1
        ) AS latest_purchase_date,
        (
          SELECT psm.created_at
          FROM product_stock_movements psm
          WHERE psm.product_id = epa.product_id
          ORDER BY psm.created_at DESC, psm.id DESC
          LIMIT 1
        ) AS latest_stock_movement_date,
        EXISTS(
          SELECT 1
          FROM product_purchases pp
          WHERE pp.product_id = epa.product_id
            AND NOT EXISTS(
              SELECT 1
              FROM product_stock_movements psm
              WHERE psm.movement_type = 'purchase_intake'
                AND psm.product_purchase_id = pp.id
            )
        ) AS has_unreceived_purchases
      FROM event_product_allocations epa
      INNER JOIN products p ON p.id = epa.product_id AND p.tenant_id = epa.tenant_id
      WHERE epa.event_id = ?
        AND epa.tenant_id = ?
      ORDER BY p.name COLLATE NOCASE ASC, epa.id ASC
    `).bind(leadId, tenantId).all();

    const allocations = await Promise.all((results || []).map(async function(row) {
      const currentStock = await getCurrentStockForProductForTenant(row.product_id, tenantId, env);
      const reservedElsewhere = await getReservedElsewhereForProductForTenant(row.product_id, leadId, tenantId, env);
      const availableStock = currentStock - reservedElsewhere;
      const shortageAmount = Math.max(Number(row.reserved_quantity || 0) - availableStock, 0);

      return {
        id: row.id,
        product_id: row.product_id,
        product_name: row.product_name,
        product_category: row.product_category,
        product_sku: row.product_sku,
        product_unit: row.product_unit,
        product_is_active: row.product_is_active,
        planned_quantity: Number(row.planned_quantity || 0),
        reserved_quantity: Number(row.reserved_quantity || 0),
        status: row.status,
        note: row.note,
        current_stock: currentStock,
        reserved_elsewhere: reservedElsewhere,
        available_stock: availableStock,
        shortage_amount: shortageAmount,
        is_short: shortageAmount > 0,
        latest_purchase_date: row.latest_purchase_date || null,
        latest_stock_movement_date: row.latest_stock_movement_date || null,
        has_unreceived_purchases: Number(row.has_unreceived_purchases || 0) === 1
      };
    }));

    return {
      event,
      summary: {
        allocation_count: allocations.length,
        shortage_count: allocations.filter(function(item) { return item.is_short; }).length
      },
      allocations
    };
  }

  if (leadInventoryActionsMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const leadId = Number(leadInventoryActionsMatch[1]);
    const tenantId = tenantCtx.tenant.id;
    const event = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
      WHERE leads.id = ?
        AND leads.tenant_id = ?
    `).bind(leadId, tenantId).first();

    if (!event) throw new Error('Lead not found');

    const { results } = await env.DB.prepare(`
      SELECT
        eia.id,
        eia.event_id,
        eia.allocation_id,
        eia.product_id,
        eia.action_type,
        eia.quantity,
        eia.note,
        eia.performed_at,
        eia.created_at,
        eia.updated_at,
        p.name AS product_name,
        p.category AS product_category,
        p.sku AS product_sku,
        p.unit AS product_unit,
        p.is_active AS product_is_active,
        psm.id AS stock_movement_id,
        psm.movement_type AS stock_movement_type,
        psm.quantity_change AS stock_movement_quantity_change,
        psm.created_at AS stock_movement_created_at
      FROM event_inventory_actions eia
      INNER JOIN products p ON p.id = eia.product_id AND p.tenant_id = eia.tenant_id
      LEFT JOIN product_stock_movements psm ON psm.event_inventory_action_id = eia.id AND psm.tenant_id = eia.tenant_id
      WHERE eia.event_id = ?
        AND eia.tenant_id = ?
      ORDER BY eia.performed_at DESC, eia.id DESC
    `).bind(leadId, tenantId).all();

    const actions = (results || []).map(mapInventoryActionRow);

    return {
      event,
      summary: {
        action_count: actions.length
      },
      actions
    };
  }

  if (leadInventoryActionsMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = Number(leadInventoryActionsMatch[1]);
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);
    if (!lead) throw new Error('Lead not found');

    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const productId = Number(body.product_id);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('product_id חובה');

    const product = await getProductByIdForTenant(productId, tenantId, env);
    if (!product) throw new Error('מוצר לא נמצא');

    const quantity = normalizeInventoryActionQuantity(body.quantity);
    const allocationId = normalizeOptionalAllocationId(body.allocation_id);
    const note = normalizeAllocationNote(body.note);

    if (allocationId !== null) {
      const allocation = await getEventAllocationByIdForTenant(allocationId, tenantId, env);
      if (!allocation || Number(allocation.event_id) !== leadId) throw new Error('הקצאה לא שייכת לאירוע הזה');
      if (Number(allocation.product_id) !== productId) throw new Error('הקצאה לא שייכת למוצר הזה');
    }

    const duplicateAction = await findRecentMatchingUsageActionForTenant(leadId, productId, quantity, allocationId, note, tenantId, env);
    if (duplicateAction) {
      return {
        success: true,
        already_processed: true,
        action: duplicateAction,
        movement: duplicateAction.stock_movement,
        current_stock: await getCurrentStockForProductForTenant(productId, tenantId, env)
      };
    }

    const currentStockBefore = await getCurrentStockForProductForTenant(productId, tenantId, env);
    if (quantity > currentStockBefore) throw new Error('לא ניתן לרשום שימוש גדול מהמלאי הקיים');

    const actionInsert = await env.DB.prepare(`
      INSERT INTO event_inventory_actions (
        event_id,
        allocation_id,
        product_id,
        action_type,
        quantity,
        note,
        tenant_id,
        performed_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, 'usage', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      leadId,
      allocationId,
      productId,
      quantity,
      note,
      tenantId
    ).run();

    const actionId = actionInsert.meta.last_row_id;

    try {
      await env.DB.prepare(`
        INSERT INTO product_stock_movements (
          product_id,
          movement_type,
          quantity_change,
          reference_type,
          reference_id,
          event_id,
          reason,
          note,
          event_inventory_action_id,
          tenant_id,
          created_at,
          updated_at
        ) VALUES (?, 'event_usage', ?, 'event', ?, ?, 'שימוש בפועל באירוע', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        productId,
        -quantity,
        leadId,
        leadId,
        note,
        actionId,
        tenantId
      ).run();
    } catch (err) {
      if (!isUniqueConstraintError(err)) throw err;
      const existingAction = await getInventoryActionWithMovementByIdForTenant(actionId, tenantId, env);
      if (!existingAction || !existingAction.stock_movement || !existingAction.stock_movement.exists) throw err;
      return {
        success: true,
        already_processed: true,
        action: existingAction,
        movement: existingAction.stock_movement,
        current_stock: await getCurrentStockForProductForTenant(productId, tenantId, env)
      };
    }

    const action = await getInventoryActionWithMovementByIdForTenant(actionId, tenantId, env);
    return {
      success: true,
      already_processed: false,
      action,
      movement: action && action.stock_movement ? action.stock_movement : null,
      current_stock: await getCurrentStockForProductForTenant(productId, tenantId, env)
    };
  }

  if (leadInventoryMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = Number(leadInventoryMatch[1]);
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);
    if (!lead) throw new Error('Lead not found');

    const body = await request.json();
    const validated = await validateAllocationPayloadForTenant(body, env, leadId, null, tenantId);

    try {
      const result = await env.DB.prepare(`
        INSERT INTO event_product_allocations (
          event_id,
          product_id,
          planned_quantity,
          reserved_quantity,
          status,
          note,
          tenant_id,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        leadId,
        validated.productId,
        validated.plannedQuantity,
        validated.reservedQuantity,
        validated.status,
        validated.note,
        tenantId
      ).run();

      const allocation = await getEventAllocationByIdForTenant(result.meta.last_row_id, tenantId, env);
      return { success: true, allocation };
    } catch (err) {
      if (isUniqueConstraintError(err)) throw new Error('כבר קיימת הקצאה למוצר הזה באירוע');
      throw err;
    }
  }

  if (leadInventoryAllocationMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = Number(leadInventoryAllocationMatch[1]);
    const allocationId = Number(leadInventoryAllocationMatch[2]);
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);
    if (!lead) throw new Error('Lead not found');

    const existingAllocation = await getEventAllocationByIdForTenant(allocationId, tenantId, env);
    if (!existingAllocation || Number(existingAllocation.event_id) !== leadId) throw new Error('הקצאה לא נמצאה');

    const body = await request.json();
    const validated = await validateAllocationPayloadForTenant(body, env, leadId, existingAllocation, tenantId);

    if (validated.productId !== Number(existingAllocation.product_id)) {
      const targetProduct = await getProductByIdForTenant(validated.productId, tenantId, env);
      if (!targetProduct || Number(targetProduct.is_active) === 0) throw new Error('לא ניתן להחליף למוצר לא פעיל');
    }

    try {
      await env.DB.prepare(`
        UPDATE event_product_allocations
        SET
          product_id = ?,
          planned_quantity = ?,
          reserved_quantity = ?,
          status = ?,
          note = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND tenant_id = ?
      `).bind(
        validated.productId,
        validated.plannedQuantity,
        validated.reservedQuantity,
        validated.status,
        validated.note,
        allocationId,
        tenantId
      ).run();
    } catch (err) {
      if (isUniqueConstraintError(err)) throw new Error('כבר קיימת הקצאה למוצר הזה באירוע');
      throw err;
    }

    const allocation = await getEventAllocationByIdForTenant(allocationId, tenantId, env);
    return { success: true, allocation };
  }

  if (leadInventoryAllocationCancelMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = Number(leadInventoryAllocationCancelMatch[1]);
    const allocationId = Number(leadInventoryAllocationCancelMatch[2]);
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);
    if (!lead) throw new Error('Lead not found');

    const existingAllocation = await getEventAllocationByIdForTenant(allocationId, tenantId, env);
    if (!existingAllocation || Number(existingAllocation.event_id) !== leadId) throw new Error('הקצאה לא נמצאה');

    await env.DB.prepare(`
      UPDATE event_product_allocations
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND tenant_id = ?
    `).bind(allocationId, tenantId).run();

    const allocation = await getEventAllocationByIdForTenant(allocationId, tenantId, env);
    return { success: true, allocation };
  }

  if (leadEmployeesMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const leadId = leadEmployeesMatch[1];
    const tenantId = tenantCtx.tenant.id;
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);

    if (!lead) throw new Error('Lead not found');

    const { results } = await env.DB.prepare(`
      SELECT
        lead_employees.*,
        employees.full_name,
        employees.phone,
        employees.email,
        employees.role AS employee_role,
        employees.hourly_rate AS employee_hourly_rate,
        employees.is_active
      FROM lead_employees
      INNER JOIN employees ON employees.id = lead_employees.employee_id AND employees.tenant_id = lead_employees.tenant_id
      WHERE lead_employees.lead_id = ?
        AND lead_employees.tenant_id = ?
      ORDER BY lead_employees.created_at DESC, lead_employees.id DESC
    `).bind(leadId, tenantId).all();

    return { assignments: results };
  }

  if (leadEmployeesMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = leadEmployeesMatch[1];
    const lead = await getLeadByIdForTenant(leadId, tenantId, env);

    if (!lead) throw new Error('Lead not found');

    const b = await request.json();
    const employeeId = Number(b.employee_id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) throw new Error('employee_id חובה');

    const employee = await getEmployeeByIdForTenant(employeeId, tenantId, env);
    if (!employee) throw new Error('עובד לא נמצא');
    if (Number(employee.is_active) === 0) throw new Error('לא ניתן לשייך עובד לא פעיל');

    const existingAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE lead_id = ? AND employee_id = ? AND tenant_id = ?'
    ).bind(leadId, employeeId, tenantId).first();

    if (existingAssignment) throw new Error('העובד כבר משויך לאירוע');

    const result = await env.DB.prepare(`
      INSERT INTO lead_employees (
        lead_id,
        employee_id,
        role_on_event,
        hourly_rate_override,
        hours_planned,
        hours_actual,
        payment_status,
        notes,
        tenant_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      leadId,
      employeeId,
      normalizeAssignmentText(b.role_on_event),
      normalizeAssignmentNumber(b.hourly_rate_override),
      normalizeAssignmentNumber(b.hours_planned),
      normalizeAssignmentNumber(b.hours_actual),
      normalizeAssignmentText(b.payment_status) || 'pending',
      normalizeAssignmentText(b.notes),
      tenantId
    ).run();

    const assignment = await env.DB.prepare(`
      SELECT
        lead_employees.*,
        employees.full_name,
        employees.phone,
        employees.email,
        employees.role AS employee_role,
        employees.hourly_rate AS employee_hourly_rate,
        employees.is_active
      FROM lead_employees
      INNER JOIN employees ON employees.id = lead_employees.employee_id AND employees.tenant_id = lead_employees.tenant_id
      WHERE lead_employees.id = ?
        AND lead_employees.tenant_id = ?
    `).bind(result.meta.last_row_id, tenantId).first();

    return { success: true, assignment };
  }

  if (assignmentIdMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const assignmentId = assignmentIdMatch[1];
    const b = await request.json();

    const existingAssignment = await env.DB.prepare(
      'SELECT * FROM lead_employees WHERE id = ? AND tenant_id = ?'
    ).bind(assignmentId, tenantId).first();

    if (!existingAssignment) throw new Error('שיוך עובד לא נמצא');

    const employeeId = b.employee_id !== undefined ? Number(b.employee_id) : Number(existingAssignment.employee_id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) throw new Error('employee_id חובה');

    const employee = await getEmployeeByIdForTenant(employeeId, tenantId, env);
    if (!employee) throw new Error('עובד לא נמצא');
    if (Number(employee.is_active) === 0) throw new Error('לא ניתן לשייך עובד לא פעיל');

    const lead = await getLeadByIdForTenant(existingAssignment.lead_id, tenantId, env);
    if (!lead) throw new Error('Lead not found');

    const duplicateAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE lead_id = ? AND employee_id = ? AND id != ? AND tenant_id = ?'
    ).bind(existingAssignment.lead_id, employeeId, assignmentId, tenantId).first();

    if (duplicateAssignment) throw new Error('העובד כבר משויך לאירוע');

    await env.DB.prepare(`
      UPDATE lead_employees
      SET
        employee_id = ?,
        role_on_event = ?,
        hourly_rate_override = ?,
        hours_planned = ?,
        hours_actual = ?,
        payment_status = ?,
        notes = ?
      WHERE id = ?
        AND tenant_id = ?
    `).bind(
      employeeId,
      normalizeAssignmentText(b.role_on_event),
      normalizeAssignmentNumber(b.hourly_rate_override),
      normalizeAssignmentNumber(b.hours_planned),
      normalizeAssignmentNumber(b.hours_actual),
      normalizeAssignmentText(b.payment_status) || 'pending',
      normalizeAssignmentText(b.notes),
      assignmentId,
      tenantId
    ).run();

    const assignment = await env.DB.prepare(`
      SELECT
        lead_employees.*,
        employees.full_name,
        employees.phone,
        employees.email,
        employees.role AS employee_role,
        employees.hourly_rate AS employee_hourly_rate,
        employees.is_active
      FROM lead_employees
      INNER JOIN employees ON employees.id = lead_employees.employee_id AND employees.tenant_id = lead_employees.tenant_id
      WHERE lead_employees.id = ?
        AND lead_employees.tenant_id = ?
    `).bind(assignmentId, tenantId).first();

    return { success: true, assignment };
  }

  if (assignmentIdMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const assignmentId = assignmentIdMatch[1];

    const existingAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE id = ? AND tenant_id = ?'
    ).bind(assignmentId, tenantId).first();

    if (!existingAssignment) throw new Error('שיוך עובד לא נמצא');

    await env.DB.prepare(
      'DELETE FROM lead_employees WHERE id = ? AND tenant_id = ?'
    ).bind(assignmentId, tenantId).run();

    return { success: true };
  }

  // ===============================
  // GET ALL
  // ===============================
  if (path === '/api/leads' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const { results } = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
      WHERE leads.tenant_id = ?
      ORDER BY leads.created_at DESC
      LIMIT 200
    `).bind(tenantId).all();

    return { leads: results };
  }

  const idMatch = path.match(/^\/api\/leads\/(\d+)$/);

  // ===============================
  // GET SINGLE
  // ===============================
  if (idMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const id = idMatch[1];
    const tenantId = tenantCtx.tenant.id;

    const lead = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
      WHERE leads.id = ?
        AND leads.tenant_id = ?
    `).bind(id, tenantId).first();

    const { results: notes } = await env.DB.prepare(
      'SELECT * FROM lead_notes WHERE lead_id = ? AND tenant_id = ? ORDER BY created_at DESC'
    ).bind(id, tenantId).all();

    return { lead, notes };
  }

  const noteMatch = path.match(/^\/api\/leads\/(\d+)\/notes$/);

  // ===============================
  // CREATE NOTE
  // ===============================
  if (noteMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = noteMatch[1];
    const b = await request.json();
    const note = (b.note || '').trim();

    if (!note) throw new Error('הערה חובה');

    const existingLead = await env.DB.prepare(
      'SELECT id FROM leads WHERE id = ? AND tenant_id = ?'
    ).bind(leadId, tenantId).first();

    if (!existingLead) throw new Error('Lead not found');

    const result = await env.DB.prepare(
      'INSERT INTO lead_notes (lead_id, note, tenant_id, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(leadId, note, tenantId).run();

    const created = await env.DB.prepare(
      'SELECT * FROM lead_notes WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();

    return { success: true, note: created };
  }

  // ===============================
  // CREATE EVENT
  // ===============================
  if (path === '/api/leads' && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();

    if (!b.name) throw new Error('שם חובה');

    const contact = await findOrCreateContactForTenant(
      b.name,
      b.phone,
      b.email,
      tenantId,
      env
    );

    const leadNum = await getNextCounter('leads', env);

    const result = await env.DB.prepare(`
      INSERT INTO leads (
        lead_num,
        contact_id,
        name,
        phone,
        email,
        event_type,
        event_date,
        event_time,
        venue,
        attractions,
        price,
        deposit,
        status,
        details,
        notes,
        tenant_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      leadNum,
      contact.id,
      b.name,
      b.phone || null,
      b.email || null,
      b.event_type || null,
      b.event_date || null,
      b.event_time || null,
      b.venue || null,
      JSON.stringify(b.attractions || []),
      b.price || 0,
      b.deposit || 0,
      b.status || 'lead',
      b.details || null,
      b.notes || null,
      tenantId
    ).run();

    try {
      await autoSyncToCalendar(result.meta.last_row_id, b.status || 'lead', env);
    } catch (e) {
      console.log('Google auto-sync failed after create:', e.message);
    }

    return {
      success: true,
      id: result.meta.last_row_id,
      lead_num: leadNum,
      contact_id: contact.id
    };
  }

  // ===============================
  // UPDATE EVENT
  // ===============================
  if (idMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];
    const b = await request.json();

    const existingLead = await getLeadByIdForTenant(id, tenantId, env);
    if (!existingLead) throw new Error('Lead not found');

    await env.DB.prepare(`
      UPDATE leads SET
        event_type = ?,
        event_date = ?,
        event_time = ?,
        venue = ?,
        attractions = ?,
        price = ?,
        deposit = ?,
        status = ?,
        details = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND tenant_id = ?
    `).bind(
      b.event_type || null,
      b.event_date || null,
      b.event_time || null,
      b.venue || null,
      JSON.stringify(b.attractions || []),
      b.price || 0,
      b.deposit || 0,
      b.status || 'lead',
      b.details || null,
      b.notes || null,
      id,
      tenantId
    ).run();

    try {
      await autoSyncToCalendar(id, b.status || 'lead', env);
    } catch (e) {
      console.log('Google auto-sync failed after update:', e.message);
    }

    return { success: true };
  }

  // ===============================
  // DELETE
  // ===============================
  if (idMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const leadId = idMatch[1];

    const existingLead = await getLeadByIdForTenant(leadId, tenantId, env);
    if (!existingLead) throw new Error('Lead not found');

    await env.DB.prepare(
      'DELETE FROM lead_notes WHERE lead_id = ? AND tenant_id = ?'
    ).bind(leadId, tenantId).run();

    await env.DB.prepare(
      'DELETE FROM lead_employees WHERE lead_id = ? AND tenant_id = ?'
    ).bind(leadId, tenantId).run();

    await env.DB.prepare(
      'DELETE FROM leads WHERE id = ? AND tenant_id = ?'
    ).bind(leadId, tenantId).run();

    return { success: true };
  }

  throw new Error('Leads route not found');
}

export async function handleDashboard(request, env, path) {
  const tenantCtx = await requireTenantContext(request, env);
  if (tenantCtx instanceof Response) return tenantCtx;

  const tenantId = tenantCtx.tenant.id;
  const now = new Date();

  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const prevM = m === 1 ? 12 : m - 1;
  const prevY = m === 1 ? y - 1 : y;

  const nextM = m === 12 ? 1 : m + 1;
  const nextY = m === 12 ? y + 1 : y;

  const pad = n => String(n).padStart(2, '0');

  const currStart = `${y}-${pad(m)}-01`;
  const currEnd = `${y}-${pad(m)}-31`;

  const prevStart = `${prevY}-${pad(prevM)}-01`;
  const prevEnd = `${prevY}-${pad(prevM)}-31`;

  const nextStart = `${nextY}-${pad(nextM)}-01`;
  const nextEnd = `${nextY}-${pad(nextM)}-31`;

  const [
    total,
    closed,
    quotes,
    leads,
    revPrev,
    revCurr,
    revNext
  ] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) AS c FROM leads WHERE tenant_id = ?').bind(tenantId).first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c, SUM(price) AS rev FROM leads WHERE tenant_id = ? AND status = 'closed'"
    ).bind(tenantId).first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c FROM leads WHERE tenant_id = ? AND status = 'quote'"
    ).bind(tenantId).first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c FROM leads WHERE tenant_id = ? AND status = 'lead'"
    ).bind(tenantId).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE tenant_id = ? AND status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(tenantId, prevStart, prevEnd).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE tenant_id = ? AND status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(tenantId, currStart, currEnd).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE tenant_id = ? AND status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(tenantId, nextStart, nextEnd).first()
  ]);

  const today = now.toISOString().split('T')[0];

  const { results: followUps } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
     WHERE leads.tenant_id = ?
       AND leads.next_contact <= ?
       AND leads.status NOT IN ('closed', 'cancelled')
     ORDER BY leads.next_contact ASC
     LIMIT 5`
  ).bind(tenantId, today).all();

  const { results: upcoming } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
     WHERE leads.tenant_id = ?
       AND leads.event_date >= ?
       AND leads.status = 'closed'
     ORDER BY leads.event_date ASC
     LIMIT 5`
  ).bind(tenantId, today).all();

  const { results: recentLeads } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
     WHERE leads.tenant_id = ?
     ORDER BY leads.created_at DESC
     LIMIT 5`
  ).bind(tenantId).all();

  const { results: allLeads } = await env.DB.prepare(
    `SELECT
      leads.id,
      leads.lead_num,
      leads.name,
      leads.event_date,
      leads.next_contact,
      leads.event_type,
      leads.venue,
      leads.status,
      leads.contact_id,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id AND contacts.tenant_id = leads.tenant_id
     WHERE leads.tenant_id = ?
       AND (leads.event_date IS NOT NULL
        OR leads.next_contact IS NOT NULL)`
  ).bind(tenantId).all();

  return {
    stats: {
      total: total.c,
      closed: closed.c,
      revenue: closed.rev || 0,
      quotes: quotes.c,
      leads: leads.c,
      rev_prev: revPrev.rev || 0,
      rev_curr: revCurr.rev || 0,
      rev_next: revNext.rev || 0
    },
    followUps,
    upcoming,
    recentLeads,
    allLeads
  };
}

export async function autoSyncToCalendar(leadId, newStatus, env) {
  if (newStatus !== 'closed') return;

  try {
    const { syncEventToCalendar } = await import('./google-calendar.js');

    const lead = await env.DB.prepare(
      'SELECT * FROM leads WHERE id = ?'
    ).bind(leadId).first();

    if (lead && lead.event_date) {
      await syncEventToCalendar(lead, env);
    }
  } catch (e) {
    console.log('Google sync skipped:', e.message);
  }
}