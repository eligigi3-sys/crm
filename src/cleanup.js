const TEST_MARKERS = [
  'example.invalid',
  'test',
  'temp',
  'smoke',
  'validation',
  'phase',
  'demo',
  'johnny',
  'openclaw',
  'טסט',
  'בדיקה',
  'זמני'
];

const LOW_RISK_TENANT_DELETE_TABLES = [
  'strategic_contact_attributions',
  'strategic_contact_activities',
  'strategic_contacts',
  'sales_document_counters',
  'tenant_business_settings',
  'tenant_modules',
  'tenant_memberships'
];

const TENANT_BLOCK_TABLES = [
  'contacts',
  'contact_notes',
  'customer_billing_profiles',
  'customer_addresses',
  'customer_contact_people',
  'leads',
  'lead_notes',
  'lead_employees',
  'employees',
  'products',
  'product_purchases',
  'product_stock_movements',
  'event_product_allocations',
  'event_inventory_actions',
  'shopping_lists',
  'shopping_items',
  'shopping_purchases',
  'shopping_purchase_items',
  'sales_documents',
  'sales_document_items'
];

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value || {});
  } catch {
    return JSON.stringify({ error: 'details_json_serialize_failed' });
  }
}

function hasTestMarker(values) {
  const text = values.map(function(value) { return String(value || '').toLowerCase(); }).join(' ');
  return TEST_MARKERS.some(function(marker) { return text.includes(marker); });
}

function formatIds(rows) {
  return (rows || []).map(function(row) { return row.id; }).filter(function(id) { return id !== undefined && id !== null; });
}

async function countRows(env, tableName, whereSql, binds) {
  const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${tableName} ${whereSql}`).bind(...(binds || [])).first();
  return Number(row && row.count ? row.count : 0);
}

async function listIds(env, tableName, whereSql, binds, limit = 25) {
  const result = await env.DB.prepare(`SELECT id FROM ${tableName} ${whereSql} ORDER BY id LIMIT ?`).bind(...(binds || []), limit).all();
  return formatIds(result.results || []);
}

async function dependency(env, tableName, whereSql, binds) {
  return {
    table: tableName,
    count: await countRows(env, tableName, whereSql, binds),
    ids: await listIds(env, tableName, whereSql, binds)
  };
}

function compactDependencies(deps) {
  return (deps || []).filter(function(dep) { return dep.count > 0; });
}

function candidateKey(type, id) {
  return type + ':' + String(id);
}

function summarizeBlockedReasons(reasons) {
  return (reasons || []).filter(Boolean).join('; ');
}

async function buildStrategicContactCandidate(env, row) {
  const dependencies = compactDependencies([
    await dependency(env, 'strategic_contact_attributions', 'WHERE strategic_contact_id = ? AND tenant_id = ?', [row.id, row.tenant_id]),
    await dependency(env, 'strategic_contact_activities', 'WHERE strategic_contact_id = ? AND tenant_id = ?', [row.id, row.tenant_id])
  ]);
  const marker = hasTestMarker([
    row.organization_name,
    row.contact_person_name,
    row.email,
    row.source,
    row.tags,
    row.notes,
    row.tenant_name,
    row.tenant_slug,
    row.tenant_contact_email
  ]);
  const blocked = [];
  if (Number(row.tenant_id) === 1) blocked.push('tenant 1 data is protected in this phase');
  if (!marker) blocked.push('no clear test marker');

  return {
    type: 'strategic_contact',
    id: row.id,
    tenant_id: row.tenant_id,
    label: row.organization_name || ('Strategic contact #' + row.id),
    reason: marker ? 'strategic contact has test marker' : 'strategic contact lacks clear test marker',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies
  };
}

async function buildOrphanStrategicChildCandidate(env, row, type) {
  const tableName = type === 'strategic_contact_activity' ? 'strategic_contact_activities' : 'strategic_contact_attributions';
  const blocked = [];
  if (Number(row.tenant_id) === 1) blocked.push('tenant 1 data is protected in this phase');
  return {
    type,
    id: row.id,
    tenant_id: row.tenant_id,
    label: tableName + ' #' + row.id,
    reason: 'orphan strategic contact child row; parent strategic_contact is missing',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies: [{ table: tableName, count: 1, ids: [row.id] }]
  };
}

async function buildOrphanCounterCandidate(row) {
  return {
    type: 'orphan_sales_document_counter',
    id: row.id,
    tenant_id: row.tenant_id,
    label: (row.document_type || 'counter') + ' counter #' + row.id + ' / tenant #' + row.tenant_id,
    reason: 'sales document counter references a tenant that no longer exists',
    allowed: true,
    blocked_reason: '',
    dependencies: [{ table: 'sales_document_counters', count: 1, ids: [row.id] }]
  };
}

async function buildTenantCandidate(env, row) {
  const marker = hasTestMarker([row.name, row.slug, row.contact_name, row.contact_email]);
  const lowRiskDeps = [];
  for (const tableName of LOW_RISK_TENANT_DELETE_TABLES) {
    lowRiskDeps.push(await dependency(env, tableName, 'WHERE tenant_id = ?', [row.id]));
  }

  const protectedDeps = [];
  for (const tableName of TENANT_BLOCK_TABLES) {
    protectedDeps.push(await dependency(env, tableName, 'WHERE tenant_id = ?', [row.id]));
  }

  const blocked = [];
  if (Number(row.id) === 1) blocked.push('tenant 1 is protected');
  if (row.status !== 'suspended') blocked.push('tenant is not suspended');
  if (!marker) blocked.push('tenant is not clearly marked as test');
  const nonZeroProtected = protectedDeps.filter(function(dep) { return dep.count > 0; });
  if (nonZeroProtected.length) {
    blocked.push('has protected business/financial/inventory data: ' + nonZeroProtected.map(function(dep) { return dep.table + '=' + dep.count; }).join(', '));
  }

  return {
    type: 'test_tenant',
    id: row.id,
    tenant_id: row.id,
    label: (row.name || 'Tenant') + ' / ' + (row.slug || ('#' + row.id)),
    reason: marker ? 'suspended tenant with clear test marker and only low-risk dependencies' : 'tenant lacks clear test marker',
    allowed: blocked.length === 0,
    blocked_reason: summarizeBlockedReasons(blocked),
    dependencies: compactDependencies(lowRiskDeps.concat(protectedDeps))
  };
}

async function buildIssuedDocumentBlock(row) {
  return {
    type: 'blocked_sales_document',
    id: row.id,
    tenant_id: row.tenant_id,
    label: (row.document_type || 'document') + ' #' + (row.document_number || row.id) + ' / ' + row.status,
    reason: 'issued/locked sales documents are not hard-deletable',
    allowed: false,
    blocked_reason: 'issued/locked sales document',
    dependencies: [{ table: 'sales_documents', count: 1, ids: [row.id] }]
  };
}

async function buildTenantOneBlock(env) {
  const deps = [];
  for (const tableName of ['contacts', 'leads', 'products', 'product_stock_movements', 'sales_documents', 'strategic_contacts']) {
    deps.push(await dependency(env, tableName, 'WHERE tenant_id = ?', [1]));
  }
  return {
    type: 'protected_tenant',
    id: 1,
    tenant_id: 1,
    label: 'Tenant 1 protected data',
    reason: 'tenant 1 data is not deletable in this phase',
    allowed: false,
    blocked_reason: 'tenant 1 protected',
    dependencies: compactDependencies(deps)
  };
}

async function getCleanupCandidates(env) {
  const candidates = [];
  const seen = new Set();

  const orphanCounters = await env.DB.prepare(`
    SELECT c.id, c.tenant_id, c.document_type
    FROM sales_document_counters c
    LEFT JOIN tenants t ON t.id = c.tenant_id
    WHERE t.id IS NULL
    ORDER BY c.id
    LIMIT 100
  `).all();
  for (const row of orphanCounters.results || []) candidates.push(await buildOrphanCounterCandidate(row));

  const orphanActivities = await env.DB.prepare(`
    SELECT a.id, a.tenant_id, a.strategic_contact_id
    FROM strategic_contact_activities a
    LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
    WHERE sc.id IS NULL
    ORDER BY a.id
    LIMIT 100
  `).all();
  for (const row of orphanActivities.results || []) candidates.push(await buildOrphanStrategicChildCandidate(env, row, 'strategic_contact_activity'));

  const orphanAttributions = await env.DB.prepare(`
    SELECT a.id, a.tenant_id, a.strategic_contact_id
    FROM strategic_contact_attributions a
    LEFT JOIN strategic_contacts sc ON sc.id = a.strategic_contact_id AND sc.tenant_id = a.tenant_id
    WHERE sc.id IS NULL
    ORDER BY a.id
    LIMIT 100
  `).all();
  for (const row of orphanAttributions.results || []) candidates.push(await buildOrphanStrategicChildCandidate(env, row, 'strategic_contact_attribution'));

  const strategicContacts = await env.DB.prepare(`
    SELECT sc.*, t.name AS tenant_name, t.slug AS tenant_slug, t.contact_email AS tenant_contact_email
    FROM strategic_contacts sc
    JOIN tenants t ON t.id = sc.tenant_id
    WHERE sc.tenant_id <> 1
    ORDER BY sc.id
    LIMIT 100
  `).all();
  for (const row of strategicContacts.results || []) {
    const candidate = await buildStrategicContactCandidate(env, row);
    if (candidate.allowed || candidate.blocked_reason) candidates.push(candidate);
  }

  const tenants = await env.DB.prepare(`
    SELECT id, name, slug, status, contact_name, contact_email
    FROM tenants
    ORDER BY id
  `).all();
  for (const row of tenants.results || []) {
    if (Number(row.id) === 1) continue;
    if (!hasTestMarker([row.name, row.slug, row.contact_name, row.contact_email])) continue;
    candidates.push(await buildTenantCandidate(env, row));
  }

  const issuedDocs = await env.DB.prepare(`
    SELECT id, tenant_id, document_type, document_number, status
    FROM sales_documents
    WHERE status IN ('issued','paid','partially_paid','void') OR locked_at IS NOT NULL
    ORDER BY id
    LIMIT 25
  `).all();
  for (const row of issuedDocs.results || []) candidates.push(await buildIssuedDocumentBlock(row));

  const tenantOne = await buildTenantOneBlock(env);
  candidates.push(tenantOne);

  const deduped = [];
  for (const candidate of candidates) {
    const key = candidateKey(candidate.type, candidate.id);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }

  return deduped;
}

async function getCandidateByTypeAndId(env, type, id) {
  const candidates = await getCleanupCandidates(env);
  return candidates.find(function(candidate) {
    return candidate.type === type && Number(candidate.id) === Number(id);
  }) || null;
}

function auditStatement(env, actor, candidate) {
  return env.DB.prepare(`
    INSERT INTO admin_audit_logs (
      actor_user_id,
      actor_email,
      action,
      target_type,
      target_id,
      target_slug,
      details_json,
      created_at
    ) VALUES (?, ?, 'cleanup_hard_delete', ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    actor && actor.id ? actor.id : null,
    actor && actor.email ? actor.email : null,
    candidate.type,
    candidate.id,
    candidate.label || null,
    safeJsonStringify({ candidate })
  );
}

async function deleteCleanupCandidate(env, actor, candidate) {
  const statements = [];

  if (candidate.type === 'orphan_sales_document_counter') {
    statements.push(env.DB.prepare(`
      DELETE FROM sales_document_counters
      WHERE id = ?
        AND NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = sales_document_counters.tenant_id)
    `).bind(candidate.id));
  } else if (candidate.type === 'strategic_contact') {
    statements.push(env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE strategic_contact_id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
    statements.push(env.DB.prepare('DELETE FROM strategic_contact_activities WHERE strategic_contact_id = ? AND tenant_id = ?').bind(candidate.id, candidate.tenant_id));
    statements.push(env.DB.prepare('DELETE FROM strategic_contacts WHERE id = ? AND tenant_id = ? AND tenant_id <> 1').bind(candidate.id, candidate.tenant_id));
  } else if (candidate.type === 'strategic_contact_activity') {
    statements.push(env.DB.prepare(`
      DELETE FROM strategic_contact_activities
      WHERE id = ?
        AND tenant_id <> 1
        AND NOT EXISTS (
          SELECT 1 FROM strategic_contacts sc
          WHERE sc.id = strategic_contact_activities.strategic_contact_id
            AND sc.tenant_id = strategic_contact_activities.tenant_id
        )
    `).bind(candidate.id));
  } else if (candidate.type === 'strategic_contact_attribution') {
    statements.push(env.DB.prepare(`
      DELETE FROM strategic_contact_attributions
      WHERE id = ?
        AND tenant_id <> 1
        AND NOT EXISTS (
          SELECT 1 FROM strategic_contacts sc
          WHERE sc.id = strategic_contact_attributions.strategic_contact_id
            AND sc.tenant_id = strategic_contact_attributions.tenant_id
        )
    `).bind(candidate.id));
  } else if (candidate.type === 'test_tenant') {
    statements.push(env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM strategic_contact_activities WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM strategic_contacts WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM sales_document_counters WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM tenant_business_settings WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM tenant_modules WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare('DELETE FROM tenant_memberships WHERE tenant_id = ?').bind(candidate.id));
    statements.push(env.DB.prepare(`
      DELETE FROM tenants
      WHERE id = ?
        AND id <> 1
        AND status = 'suspended'
        AND NOT EXISTS (SELECT 1 FROM contacts WHERE tenant_id = tenants.id)
        AND NOT EXISTS (SELECT 1 FROM leads WHERE tenant_id = tenants.id)
        AND NOT EXISTS (SELECT 1 FROM products WHERE tenant_id = tenants.id)
        AND NOT EXISTS (SELECT 1 FROM product_stock_movements WHERE tenant_id = tenants.id)
        AND NOT EXISTS (SELECT 1 FROM sales_documents WHERE tenant_id = tenants.id)
    `).bind(candidate.id));
  } else {
    throw new Error('סוג ניקוי לא נתמך');
  }

  statements.push(auditStatement(env, actor, candidate));
  return env.DB.batch(statements);
}

export async function handleAdminCleanup(request, env, path, superAdminCtx) {
  const method = request.method;

  if (path === '/api/admin/cleanup/candidates' && method === 'GET') {
    const candidates = await getCleanupCandidates(env);
    return {
      candidates,
      summary: {
        total: candidates.length,
        allowed: candidates.filter(function(candidate) { return candidate.allowed; }).length,
        blocked: candidates.filter(function(candidate) { return !candidate.allowed; }).length
      }
    };
  }

  if (path === '/api/admin/cleanup/delete' && method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    if (!body || body.confirmation !== 'DELETE') throw new Error('נדרש אישור DELETE מדויק');
    const type = String(body.type || '').trim();
    const id = Number(body.id);
    if (!type || !Number.isFinite(id) || id <= 0) throw new Error('מועמד ניקוי לא תקין');

    const candidate = await getCandidateByTypeAndId(env, type, id);
    if (!candidate) throw new Error('מועמד ניקוי לא נמצא');
    if (!candidate.allowed) throw new Error(candidate.blocked_reason || 'מחיקה חסומה');

    await deleteCleanupCandidate(env, superAdminCtx && superAdminCtx.user, candidate);
    return { success: true, deleted: candidate };
  }

  return { error: 'Cleanup route not found' };
}
