const TEST_MARKERS = [
  'example.invalid', 'test', 'temp', 'smoke', 'validation', 'phase', 'demo', 'johnny', 'openclaw', 'טסט', 'בדיקה', 'זמני'
];

const LOCKED_SALES_STATUSES = new Set(['issued', 'paid', 'partially_paid', 'void']);
const TENANT_LOW_RISK_DELETE_TABLES = [
  'strategic_contact_attributions', 'strategic_contact_activities', 'strategic_contacts',
  'sales_document_counters', 'counters', 'tenant_business_settings', 'tenant_modules', 'tenant_memberships'
];
const TENANT_PROTECTED_TABLES = [
  'contacts', 'contact_notes', 'customer_billing_profiles', 'customer_addresses', 'customer_contact_people',
  'leads', 'lead_notes', 'lead_employees', 'employees', 'products', 'product_purchases', 'product_stock_movements',
  'event_product_allocations', 'event_inventory_actions', 'shopping_lists', 'shopping_items', 'shopping_purchases',
  'shopping_purchase_items', 'sales_documents', 'sales_document_items'
];

function safeJsonStringify(value) {
  try { return JSON.stringify(value || {}); } catch { return JSON.stringify({ error: 'details_json_serialize_failed' }); }
}

function hasTestMarker(values) {
  const text = values.map(function(value) { return String(value || '').toLowerCase(); }).join(' ');
  return TEST_MARKERS.some(function(marker) { return text.includes(marker); });
}

function textLike(row, fields, search) {
  if (!search) return true;
  const needle = String(search || '').trim().toLowerCase();
  if (!needle) return true;
  return fields.some(function(field) { return String(row[field] || '').toLowerCase().includes(needle); });
}

function formatIds(rows) {
  return (rows || []).map(function(row) { return row.id; }).filter(function(id) { return id !== undefined && id !== null; });
}

async function countRows(env, tableName, whereSql, binds) {
  const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${tableName} ${whereSql}`).bind(...(binds || [])).first();
  return Number(row && row.count ? row.count : 0);
}

const DEPENDENCY_ID_COLUMNS = {
  counters: 'name'
};

async function listIds(env, tableName, whereSql, binds, limit = 12) {
  const idColumn = DEPENDENCY_ID_COLUMNS[tableName] || 'id';
  const result = await env.DB.prepare(`SELECT ${idColumn} AS id FROM ${tableName} ${whereSql} ORDER BY ${idColumn} LIMIT ?`).bind(...(binds || []), limit).all();
  return formatIds(result.results || []);
}

async function dependency(env, tableName, whereSql, binds) {
  return { table: tableName, count: await countRows(env, tableName, whereSql, binds), ids: await listIds(env, tableName, whereSql, binds) };
}

function compactDependencies(deps) {
  return (deps || []).filter(function(dep) { return dep.count > 0; });
}

function summarizeBlockedReasons(reasons) {
  return (reasons || []).filter(Boolean).join('; ');
}

function mkAction(action, label, allowed, blocked_reason, extra) {
  return Object.assign({ action, label, allowed: !!allowed, blocked_reason: allowed ? '' : (blocked_reason || 'blocked') }, extra || {});
}

function candidate(type, row, fields) {
  return Object.assign({
    type,
    id: row.id,
    tenant_id: row.tenant_id || null,
    label: row.label || (type + ' #' + row.id),
    status: row.status || null,
    reason: row.reason || '',
    allowed: !!row.allowed,
    blocked_reason: row.blocked_reason || '',
    dependencies: row.dependencies || [],
    actions: row.actions || []
  }, fields || {});
}

function candidateKey(item) {
  return item.type + ':' + String(item.id);
}

function isLockedSalesDocument(row) {
  return LOCKED_SALES_STATUSES.has(String(row.status || '')) || !!row.locked_at || !!row.issued_at;
}

async function tenantDependencies(env, tenantId) {
  const lowRisk = [];
  const protectedDeps = [];
  for (const tableName of TENANT_LOW_RISK_DELETE_TABLES) lowRisk.push(await dependency(env, tableName, 'WHERE tenant_id = ?', [tenantId]));
  for (const tableName of TENANT_PROTECTED_TABLES) protectedDeps.push(await dependency(env, tableName, 'WHERE tenant_id = ?', [tenantId]));
  return { lowRisk, protectedDeps, all: compactDependencies(lowRisk.concat(protectedDeps)) };
}

async function buildTenantCandidate(env, row) {
  const deps = await tenantDependencies(env, row.id);
  const lockedDocs = deps.protectedDeps.find(function(dep) { return dep.table === 'sales_documents'; });
  const deleteBlocked = [];
  if (Number(row.id) === 1) deleteBlocked.push('tenant 1 cannot be hard-deleted');
  return candidate('tenant', {
    id: row.id,
    tenant_id: row.id,
    label: (row.name || 'Tenant') + ' / ' + (row.slug || ('#' + row.id)),
    status: row.status,
    reason: Number(row.id) === 1 ? 'tenant 1 protected' : 'tenant dependency preview',
    allowed: deleteBlocked.length === 0,
    blocked_reason: summarizeBlockedReasons(deleteBlocked),
    dependencies: deps.all,
    owner_email: row.owner_email || row.contact_email || null,
    owner_user_id: row.owner_user_id || null,
    locked_sales_documents_count: lockedDocs ? lockedDocs.count : 0,
    actions: [
      mkAction('archive', 'Suspend', Number(row.id) !== 1 && row.status !== 'suspended', Number(row.id) === 1 ? 'tenant 1 cannot be suspended' : 'already suspended'),
      mkAction('reactivate', 'Reactivate', row.status === 'suspended', 'tenant is already active'),
      mkAction('delete', 'Delete Tenant', deleteBlocked.length === 0, summarizeBlockedReasons(deleteBlocked), { requires_delete: true, requires_name: row.name || '' })
    ]
  });
}

async function buildUserCandidate(env, row) {
  const deps = compactDependencies([
    await dependency(env, 'tenant_memberships', 'WHERE user_id = ?', [row.id])
  ]);
  const tenantOneMemberships = await countRows(env, 'tenant_memberships', 'WHERE user_id = ? AND tenant_id = 1', [row.id]);
  const ownerMemberships = await countRows(env, 'tenant_memberships', "WHERE user_id = ? AND role = 'owner'", [row.id]);
  const membershipCount = deps.find(function(dep) { return dep.table === 'tenant_memberships'; })?.count || 0;
  const isSuperAdmin = String(row.role || '').toLowerCase() === 'super_admin';
  const status = row.status || 'active';
  const deleteBlocked = [];
  if (isSuperAdmin) deleteBlocked.push('super_admin users are protected');
  if (tenantOneMemberships > 0) deleteBlocked.push('user belongs to tenant 1');
  if (ownerMemberships > 0) deleteBlocked.push('user owns a tenant; deactivate instead');
  if (membershipCount > 0) deleteBlocked.push('user has tenant memberships; deactivate instead');
  return candidate('user', {
    id: row.id,
    tenant_id: null,
    label: (row.display_name || row.name || row.email || 'User') + ' / ' + row.email,
    status,
    reason: 'user controls',
    allowed: deleteBlocked.length === 0,
    blocked_reason: summarizeBlockedReasons(deleteBlocked),
    dependencies: deps,
    actions: [
      mkAction('archive', 'Deactivate', !isSuperAdmin && status !== 'inactive', isSuperAdmin ? 'super_admin users are protected' : 'already inactive'),
      mkAction('reactivate', 'Reactivate', !isSuperAdmin && status === 'inactive', isSuperAdmin ? 'super_admin users are protected' : 'already active'),
      mkAction('delete', 'Hard Delete', deleteBlocked.length === 0, summarizeBlockedReasons(deleteBlocked), { requires_delete: true })
    ]
  });
}

async function buildContactCandidate(env, row) {
  const deps = compactDependencies([
    await dependency(env, 'sales_documents', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'leads', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'contact_notes', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'customer_billing_profiles', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'customer_addresses', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'customer_contact_people', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'strategic_contact_attributions', 'WHERE tenant_id = ? AND contact_id = ?', [row.tenant_id, row.id])
  ]);
  const lockedDocs = await countRows(env, 'sales_documents', "WHERE tenant_id = ? AND contact_id = ? AND (status IN ('issued','paid','partially_paid','void') OR locked_at IS NOT NULL OR issued_at IS NOT NULL)", [row.tenant_id, row.id]);
  const salesDocs = deps.find(function(dep) { return dep.table === 'sales_documents'; })?.count || 0;
  const leads = deps.find(function(dep) { return dep.table === 'leads'; })?.count || 0;
  const blocked = [];
  if (Number(row.tenant_id) === 1) blocked.push('tenant 1 customer data cannot be hard-deleted in this phase');
  if (lockedDocs > 0) blocked.push('customer has issued/locked sales documents');
  if (salesDocs > 0) blocked.push('customer has sales document history');
  if (leads > 0) blocked.push('customer has event/lead history');
  const status = row.status || 'פעיל';
  return candidate('contact', {
    id: row.id,
    tenant_id: row.tenant_id,
    label: row.name || ('Customer #' + row.id),
    status,
    reason: 'customer controls',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies: deps,
    actions: [
      mkAction('archive', 'Archive', status !== 'לא פעיל', 'already inactive'),
      mkAction('reactivate', 'Reactivate', status === 'לא פעיל', 'customer is not archived'),
      mkAction('delete', 'Hard Delete', blocked.length === 0, summarizeBlockedReasons(blocked), { requires_delete: true })
    ]
  });
}

async function buildProductCandidate(env, row) {
  const deps = compactDependencies([
    await dependency(env, 'product_stock_movements', 'WHERE tenant_id = ? AND product_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'product_purchases', 'WHERE tenant_id = ? AND product_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'event_product_allocations', 'WHERE tenant_id = ? AND product_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'event_inventory_actions', 'WHERE tenant_id = ? AND product_id = ?', [row.tenant_id, row.id]),
    await dependency(env, 'sales_document_items', 'WHERE tenant_id = ? AND product_id = ?', [row.tenant_id, row.id])
  ]);
  const blocked = [];
  if (Number(row.tenant_id) === 1) blocked.push('tenant 1 product data cannot be hard-deleted in this phase');
  if (deps.length) blocked.push('product has stock/purchase/allocation/sales history');
  const active = Number(row.is_active) !== 0;
  return candidate('product', {
    id: row.id,
    tenant_id: row.tenant_id,
    label: row.name || ('Product #' + row.id),
    status: active ? 'active' : 'inactive',
    reason: 'product controls',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies: deps,
    actions: [
      mkAction('archive', 'Deactivate', active, 'already inactive'),
      mkAction('reactivate', 'Reactivate', !active, 'already active'),
      mkAction('delete', 'Hard Delete', blocked.length === 0, summarizeBlockedReasons(blocked), { requires_delete: true })
    ]
  });
}

async function buildStrategicContactCandidate(env, row) {
  const deps = compactDependencies([
    await dependency(env, 'strategic_contact_attributions', 'WHERE strategic_contact_id = ? AND tenant_id = ?', [row.id, row.tenant_id]),
    await dependency(env, 'strategic_contact_activities', 'WHERE strategic_contact_id = ? AND tenant_id = ?', [row.id, row.tenant_id])
  ]);
  const active = Number(row.active) !== 0;
  const blocked = [];
  if (Number(row.tenant_id) === 1) blocked.push('tenant 1 strategic contact data cannot be hard-deleted in this phase');
  return candidate('strategic_contact', {
    id: row.id,
    tenant_id: row.tenant_id,
    label: row.organization_name || ('Strategic contact #' + row.id),
    status: active ? 'active' : 'inactive',
    reason: 'strategic contact controls',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies: deps,
    actions: [
      mkAction('archive', 'Deactivate', active, 'already inactive'),
      mkAction('reactivate', 'Reactivate', !active, 'already active'),
      mkAction('delete', 'Hard Delete', blocked.length === 0, summarizeBlockedReasons(blocked), { requires_delete: true })
    ]
  });
}

function buildOrphanCounterCandidate(row) {
  return candidate('orphan_sales_document_counter', {
    id: row.id,
    tenant_id: row.tenant_id,
    label: (row.document_type || 'counter') + ' counter #' + row.id + ' / tenant #' + row.tenant_id,
    status: 'orphan',
    reason: 'sales document counter references a missing tenant',
    allowed: true,
    dependencies: [{ table: 'sales_document_counters', count: 1, ids: [row.id] }],
    actions: [mkAction('delete', 'Hard Delete', true, '', { requires_delete: true })]
  });
}

function buildOrphanStrategicChildCandidate(row, type) {
  const tableName = type === 'strategic_contact_activity' ? 'strategic_contact_activities' : 'strategic_contact_attributions';
  const blocked = Number(row.tenant_id) === 1 ? 'tenant 1 data is protected in this phase' : '';
  return candidate(type, {
    id: row.id,
    tenant_id: row.tenant_id,
    label: tableName + ' #' + row.id,
    status: 'orphan',
    reason: 'strategic contact child references missing parent',
    allowed: !blocked,
    blocked_reason: blocked,
    dependencies: [{ table: tableName, count: 1, ids: [row.id] }],
    actions: [mkAction('delete', 'Hard Delete', !blocked, blocked, { requires_delete: true })]
  });
}

function buildSalesDocumentCandidate(row) {
  const locked = isLockedSalesDocument(row);
  const marker = hasTestMarker([
    row.document_number, row.customer_name_snapshot, row.customer_email_snapshot, row.notes, row.internal_notes, row.tenant_name, row.tenant_slug
  ]);
  const safeDraft = !locked && (row.status === 'draft' || marker);
  const blocked = locked ? 'issued/locked sales document cannot be hard-deleted' : (safeDraft ? '' : 'only draft/test non-locked sales documents can be hard-deleted');
  return candidate(locked ? 'blocked_sales_document' : 'sales_document', {
    id: row.id,
    tenant_id: row.tenant_id,
    label: (row.document_type || 'document') + ' #' + (row.document_number || row.id) + ' / ' + (row.customer_name_snapshot || ''),
    status: row.status,
    reason: locked ? 'issued/locked sales documents are protected' : 'draft/test sales document controls',
    allowed: safeDraft,
    blocked_reason: blocked,
    dependencies: [{ table: 'sales_document_items', count: Number(row.items_count || 0), ids: [] }].filter(function(dep) { return dep.count > 0; }),
    actions: [
      mkAction('archive', 'Cancel', !locked && row.status !== 'cancelled', locked ? 'issued/locked sales document cannot be cancelled here' : 'already cancelled'),
      mkAction('delete', 'Hard Delete', safeDraft, blocked, { requires_delete: true })
    ]
  });
}

async function listCleanupCandidates(env, entity, search) {
  const candidates = [];
  const want = function(name) { return !entity || entity === 'all' || entity === name; };

  if (want('tenants')) {
    const rows = await env.DB.prepare(`
      SELECT t.id, t.name, t.slug, t.status, t.contact_name, t.contact_email, u.email AS owner_email, u.id AS owner_user_id
      FROM tenants t
      LEFT JOIN tenant_memberships tm ON tm.tenant_id = t.id AND tm.role = 'owner'
      LEFT JOIN users u ON u.id = tm.user_id
      GROUP BY t.id
      ORDER BY t.id
      LIMIT 100
    `).all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'name', 'slug', 'contact_email', 'owner_email'], search)) candidates.push(await buildTenantCandidate(env, row));
  }

  if (want('users')) {
    const rows = await env.DB.prepare('SELECT id, name, display_name, email, role, status FROM users ORDER BY id LIMIT 100').all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'name', 'display_name', 'email', 'role'], search)) candidates.push(await buildUserCandidate(env, row));
  }

  if (want('contacts')) {
    const rows = await env.DB.prepare('SELECT id, tenant_id, name, phone, email, status, tags FROM contacts ORDER BY id DESC LIMIT 100').all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'name', 'phone', 'email', 'tags'], search)) candidates.push(await buildContactCandidate(env, row));
  }

  if (want('products')) {
    const rows = await env.DB.prepare('SELECT id, tenant_id, name, category, sku, is_active FROM products ORDER BY id DESC LIMIT 100').all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'name', 'category', 'sku'], search)) candidates.push(await buildProductCandidate(env, row));
  }

  if (want('strategic_contacts')) {
    const rows = await env.DB.prepare('SELECT id, tenant_id, organization_name, contact_person_name, email, status, active, tags, notes FROM strategic_contacts ORDER BY id DESC LIMIT 100').all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'organization_name', 'contact_person_name', 'email', 'tags'], search)) candidates.push(await buildStrategicContactCandidate(env, row));
  }

  if (want('sales_documents')) {
    const rows = await env.DB.prepare(`
      SELECT sd.id, sd.tenant_id, sd.document_type, sd.document_number, sd.status, sd.locked_at, sd.issued_at,
             sd.customer_name_snapshot, sd.customer_email_snapshot, sd.notes, sd.internal_notes,
             t.name AS tenant_name, t.slug AS tenant_slug,
             (SELECT COUNT(*) FROM sales_document_items i WHERE i.tenant_id = sd.tenant_id AND i.document_id = sd.id) AS items_count
      FROM sales_documents sd
      LEFT JOIN tenants t ON t.id = sd.tenant_id
      ORDER BY sd.id DESC
      LIMIT 100
    `).all();
    for (const row of rows.results || []) if (textLike(row, ['id', 'document_number', 'customer_name_snapshot', 'customer_email_snapshot', 'tenant_name'], search)) candidates.push(buildSalesDocumentCandidate(row));
  }

  if (want('orphans')) {
    const counters = await env.DB.prepare(`
      SELECT c.id, c.tenant_id, c.document_type
      FROM sales_document_counters c
      LEFT JOIN tenants t ON t.id = c.tenant_id
      WHERE t.id IS NULL
      ORDER BY c.id
      LIMIT 100
    `).all();
    for (const row of counters.results || []) candidates.push(buildOrphanCounterCandidate(row));

    const activities = await env.DB.prepare(`
      SELECT a.id, a.tenant_id, a.strategic_contact_id
      FROM strategic_contact_activities a
      LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
      WHERE sc.id IS NULL
      ORDER BY a.id
      LIMIT 100
    `).all();
    for (const row of activities.results || []) candidates.push(buildOrphanStrategicChildCandidate(row, 'strategic_contact_activity'));

    const attributions = await env.DB.prepare(`
      SELECT a.id, a.tenant_id, a.strategic_contact_id
      FROM strategic_contact_attributions a
      LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
      WHERE sc.id IS NULL
      ORDER BY a.id
      LIMIT 100
    `).all();
    for (const row of attributions.results || []) candidates.push(buildOrphanStrategicChildCandidate(row, 'strategic_contact_attribution'));
  }

  const seen = new Set();
  return candidates.filter(function(item) {
    const key = candidateKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function getCandidateByTypeAndId(env, type, id) {
  if (type === 'tenant') {
    const row = await env.DB.prepare(`
      SELECT t.id, t.name, t.slug, t.status, t.contact_name, t.contact_email, u.email AS owner_email, u.id AS owner_user_id
      FROM tenants t
      LEFT JOIN tenant_memberships tm ON tm.tenant_id = t.id AND tm.role = 'owner'
      LEFT JOIN users u ON u.id = tm.user_id
      WHERE t.id = ?
      GROUP BY t.id
    `).bind(id).first();
    return row ? buildTenantCandidate(env, row) : null;
  }
  if (type === 'user') {
    const row = await env.DB.prepare('SELECT id, name, display_name, email, role, status FROM users WHERE id = ?').bind(id).first();
    return row ? buildUserCandidate(env, row) : null;
  }
  if (type === 'contact') {
    const row = await env.DB.prepare('SELECT id, tenant_id, name, phone, email, status, tags FROM contacts WHERE id = ?').bind(id).first();
    return row ? buildContactCandidate(env, row) : null;
  }
  if (type === 'product') {
    const row = await env.DB.prepare('SELECT id, tenant_id, name, category, sku, is_active FROM products WHERE id = ?').bind(id).first();
    return row ? buildProductCandidate(env, row) : null;
  }
  if (type === 'strategic_contact') {
    const row = await env.DB.prepare('SELECT id, tenant_id, organization_name, contact_person_name, email, status, active, tags, notes FROM strategic_contacts WHERE id = ?').bind(id).first();
    return row ? buildStrategicContactCandidate(env, row) : null;
  }
  if (type === 'sales_document' || type === 'blocked_sales_document') {
    const row = await env.DB.prepare(`
      SELECT sd.id, sd.tenant_id, sd.document_type, sd.document_number, sd.status, sd.locked_at, sd.issued_at,
             sd.customer_name_snapshot, sd.customer_email_snapshot, sd.notes, sd.internal_notes,
             t.name AS tenant_name, t.slug AS tenant_slug,
             (SELECT COUNT(*) FROM sales_document_items i WHERE i.tenant_id = sd.tenant_id AND i.document_id = sd.id) AS items_count
      FROM sales_documents sd
      LEFT JOIN tenants t ON t.id = sd.tenant_id
      WHERE sd.id = ?
    `).bind(id).first();
    if (!row) return null;
    const built = buildSalesDocumentCandidate(row);
    return built.type === type ? built : null;
  }
  if (type === 'orphan_sales_document_counter') {
    const row = await env.DB.prepare(`
      SELECT c.id, c.tenant_id, c.document_type
      FROM sales_document_counters c
      LEFT JOIN tenants t ON t.id = c.tenant_id
      WHERE c.id = ? AND t.id IS NULL
    `).bind(id).first();
    return row ? buildOrphanCounterCandidate(row) : null;
  }
  if (type === 'strategic_contact_activity') {
    const row = await env.DB.prepare(`
      SELECT a.id, a.tenant_id, a.strategic_contact_id
      FROM strategic_contact_activities a
      LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
      WHERE a.id = ? AND sc.id IS NULL
    `).bind(id).first();
    return row ? buildOrphanStrategicChildCandidate(row, 'strategic_contact_activity') : null;
  }
  if (type === 'strategic_contact_attribution') {
    const row = await env.DB.prepare(`
      SELECT a.id, a.tenant_id, a.strategic_contact_id
      FROM strategic_contact_attributions a
      LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
      WHERE a.id = ? AND sc.id IS NULL
    `).bind(id).first();
    return row ? buildOrphanStrategicChildCandidate(row, 'strategic_contact_attribution') : null;
  }
  return null;
}

function auditStatement(env, actor, action, target, details) {
  return env.DB.prepare(`
    INSERT INTO admin_audit_logs (actor_user_id, actor_email, action, target_type, target_id, target_slug, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    actor && actor.id ? actor.id : null,
    actor && actor.email ? actor.email : null,
    action,
    target.type,
    target.id,
    target.label || null,
    safeJsonStringify(details)
  );
}

async function runArchiveAction(env, actor, candidate) {
  const s = [];
  if (candidate.type === 'tenant') {
    if (Number(candidate.id) === 1) throw new Error('tenant 1 cannot be suspended in this phase');
    s.push(env.DB.prepare("UPDATE tenants SET status = 'suspended', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND id <> 1").bind(candidate.id));
  } else if (candidate.type === 'user') {
    s.push(env.DB.prepare("UPDATE users SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND lower(COALESCE(role,'')) <> 'super_admin'").bind(candidate.id));
  } else if (candidate.type === 'contact') {
    s.push(env.DB.prepare("UPDATE contacts SET status = 'לא פעיל', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?").bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'product') {
    s.push(env.DB.prepare('UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'strategic_contact') {
    s.push(env.DB.prepare('UPDATE strategic_contacts SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'sales_document') {
    s.push(env.DB.prepare("UPDATE sales_documents SET status = 'cancelled', cancelled_at = COALESCE(cancelled_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ? AND locked_at IS NULL AND issued_at IS NULL AND status NOT IN ('issued','paid','partially_paid','void')").bind(candidate.id, candidate.tenant_id));
  } else {
    throw new Error('Archive/deactivate is not supported for this record');
  }
  s.push(auditStatement(env, actor, 'cleanup_archive', candidate, { candidate }));
  return env.DB.batch(s);
}

async function runReactivateAction(env, actor, candidate) {
  const s = [];
  if (candidate.type === 'tenant') {
    s.push(env.DB.prepare("UPDATE tenants SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(candidate.id));
  } else if (candidate.type === 'user') {
    s.push(env.DB.prepare("UPDATE users SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND lower(COALESCE(role,'')) <> 'super_admin'").bind(candidate.id));
  } else if (candidate.type === 'contact') {
    s.push(env.DB.prepare("UPDATE contacts SET status = 'פעיל', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?").bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'product') {
    s.push(env.DB.prepare('UPDATE products SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'strategic_contact') {
    s.push(env.DB.prepare('UPDATE strategic_contacts SET active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
  } else {
    throw new Error('Reactivate is not supported for this record');
  }
  s.push(auditStatement(env, actor, 'cleanup_reactivate', candidate, { candidate }));
  return env.DB.batch(s);
}

async function runDeleteAction(env, actor, candidate) {
  const s = [];
  if (candidate.type === 'tenant') {
    if (Number(candidate.id) === 1) throw new Error('tenant 1 cannot be hard-deleted');
    s.push(env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM strategic_contact_activities WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM strategic_contacts WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM sales_document_items WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM sales_documents WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM sales_document_counters WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_contact_people WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_addresses WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_billing_profiles WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM contact_notes WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM lead_employees WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM lead_notes WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM event_inventory_actions WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM event_product_allocations WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM product_stock_movements WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM product_purchases WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM shopping_purchase_items WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM shopping_purchases WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM shopping_items WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM shopping_lists WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM leads WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM contacts WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM employees WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM products WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM counters WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM tenant_business_settings WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM tenant_modules WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM tenant_memberships WHERE tenant_id = ?').bind(candidate.id));
    s.push(env.DB.prepare('DELETE FROM tenants WHERE id = ? AND id <> 1').bind(candidate.id));
  } else if (candidate.type === 'user') {
    s.push(env.DB.prepare("DELETE FROM users WHERE id = ? AND lower(COALESCE(role,'')) <> 'super_admin' AND NOT EXISTS (SELECT 1 FROM tenant_memberships WHERE user_id = users.id)").bind(candidate.id));
  } else if (candidate.type === 'contact') {
    s.push(env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE tenant_id = ? AND contact_id = ?').bind(candidate.tenant_id, candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_contact_people WHERE tenant_id = ? AND contact_id = ?').bind(candidate.tenant_id, candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_addresses WHERE tenant_id = ? AND contact_id = ?').bind(candidate.tenant_id, candidate.id));
    s.push(env.DB.prepare('DELETE FROM customer_billing_profiles WHERE tenant_id = ? AND contact_id = ?').bind(candidate.tenant_id, candidate.id));
    s.push(env.DB.prepare('DELETE FROM contact_notes WHERE tenant_id = ? AND contact_id = ?').bind(candidate.tenant_id, candidate.id));
    s.push(env.DB.prepare('DELETE FROM contacts WHERE id = ? AND tenant_id = ? AND tenant_id <> 1 AND NOT EXISTS (SELECT 1 FROM sales_documents WHERE tenant_id = contacts.tenant_id AND contact_id = contacts.id) AND NOT EXISTS (SELECT 1 FROM leads WHERE tenant_id = contacts.tenant_id AND contact_id = contacts.id)').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'product') {
    s.push(env.DB.prepare('DELETE FROM products WHERE id = ? AND tenant_id = ? AND tenant_id <> 1').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'strategic_contact') {
    s.push(env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE strategic_contact_id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
    s.push(env.DB.prepare('DELETE FROM strategic_contact_activities WHERE strategic_contact_id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
    s.push(env.DB.prepare('DELETE FROM strategic_contacts WHERE id = ? AND tenant_id = ? AND tenant_id <> 1').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'sales_document') {
    s.push(env.DB.prepare('DELETE FROM sales_document_items WHERE document_id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
    s.push(env.DB.prepare("DELETE FROM sales_documents WHERE id = ? AND tenant_id = ? AND locked_at IS NULL AND issued_at IS NULL AND status NOT IN ('issued','paid','partially_paid','void')").bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'orphan_sales_document_counter') {
    s.push(env.DB.prepare('DELETE FROM sales_document_counters WHERE id = ? AND NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = sales_document_counters.tenant_id)').bind(candidate.id));
  } else if (candidate.type === 'strategic_contact_activity') {
    s.push(env.DB.prepare(`DELETE FROM strategic_contact_activities WHERE id = ? AND tenant_id <> 1 AND NOT EXISTS (SELECT 1 FROM strategic_contacts sc WHERE sc.id = strategic_contact_activities.strategic_contact_id AND sc.tenant_id = strategic_contact_activities.tenant_id)`).bind(candidate.id));
  } else if (candidate.type === 'strategic_contact_attribution') {
    s.push(env.DB.prepare(`DELETE FROM strategic_contact_attributions WHERE id = ? AND tenant_id <> 1 AND NOT EXISTS (SELECT 1 FROM strategic_contacts sc WHERE sc.id = strategic_contact_attributions.strategic_contact_id AND sc.tenant_id = strategic_contact_attributions.tenant_id)`).bind(candidate.id));
  } else {
    throw new Error('סוג ניקוי לא נתמך למחיקה');
  }
  s.push(auditStatement(env, actor, 'cleanup_hard_delete', candidate, { candidate }));
  return env.DB.batch(s);
}

function findAction(candidate, action) {
  return (candidate.actions || []).find(function(item) { return item.action === action; }) || null;
}

export async function handleAdminCleanup(request, env, path, superAdminCtx) {
  const method = request.method;
  const url = new URL(request.url);

  if (path === '/api/admin/cleanup/candidates' && method === 'GET') {
    const entity = url.searchParams.get('entity') || 'all';
    const search = url.searchParams.get('search') || '';
    const candidates = await listCleanupCandidates(env, entity, search);
    return {
      candidates,
      summary: {
        total: candidates.length,
        allowed: candidates.filter(function(item) { return (item.actions || []).some(function(action) { return action.allowed; }); }).length,
        blocked: candidates.filter(function(item) { return !(item.actions || []).some(function(action) { return action.allowed; }); }).length
      }
    };
  }

  const actionMatch = path === '/api/admin/cleanup/action' || path === '/api/admin/cleanup/delete';
  if (actionMatch && method === 'POST') {
    let body;
    try { body = await request.json(); } catch { throw new Error('בקשה לא תקינה'); }
    const type = String(body && body.type || '').trim();
    const id = Number(body && body.id);
    const actionName = path.endsWith('/delete') ? 'delete' : String(body && body.action || '').trim();
    if (!type || !Number.isFinite(id) || id <= 0 || !actionName) throw new Error('מועמד ניקוי לא תקין');

    const item = await getCandidateByTypeAndId(env, type, id);
    if (!item) throw new Error('מועמד ניקוי לא נמצא');
    const action = findAction(item, actionName);
    if (!action) throw new Error('פעולת ניקוי לא נתמכת לרשומה');
    if (!action.allowed) throw new Error(action.blocked_reason || item.blocked_reason || 'הפעולה חסומה');
    if (actionName === 'delete') {
      if (!body || body.confirmation !== 'DELETE') throw new Error('נדרש אישור DELETE מדויק');
      if (action.requires_name && String(body.name_confirmation || '').trim() !== String(action.requires_name).trim()) {
        throw new Error('נדרש אישור שם עסק מדויק למחיקת tenant');
      }
    }

    if (actionName === 'archive') await runArchiveAction(env, superAdminCtx && superAdminCtx.user, item);
    else if (actionName === 'reactivate') await runReactivateAction(env, superAdminCtx && superAdminCtx.user, item);
    else if (actionName === 'delete') await runDeleteAction(env, superAdminCtx && superAdminCtx.user, item);
    else throw new Error('פעולת ניקוי לא נתמכת');

    return { success: true, action: actionName, record: item };
  }

  return { error: 'Cleanup route not found' };
}
