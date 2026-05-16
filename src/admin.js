import { requireSuperAdmin } from './auth.js';
import { hashPassword } from './passwords.js';
import { handleAdminCleanup } from './cleanup.js';

const MODULE_KEYS = [
  'leads',
  'contacts',
  'employees',
  'products',
  'shopping',
  'reports',
  'sales_documents',
  'strategic_contacts'
];
const MODULE_KEY_SET = new Set(MODULE_KEYS);
const AUDIT_ACTIONS = new Set([
  'tenant_create',
  'tenant_update',
  'tenant_activate',
  'tenant_suspend',
  'tenant_modules_update',
  'tenant_owner_password_reset',
  'cleanup_hard_delete'
]);

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeTenantName(value) {
  const name = normalizeOptionalText(value);
  if (!name) throw new Error('שם עסק חובה');
  return name;
}

function normalizeTenantSlug(value) {
  const slug = String(value || '').trim().toLowerCase();
  if (!slug) throw new Error('כתובת המערכת לא תקינה');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('כתובת המערכת לא תקינה');
  }
  return slug;
}

function slugifyTenantName(value) {
  const base = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'tenant';
}

async function generateUniqueTenantSlug(name, env) {
  const baseSlug = normalizeTenantSlug(slugifyTenantName(name));
  let candidate = baseSlug;
  let suffix = 2;
  while (await getTenantBySlug(candidate, env)) {
    candidate = normalizeTenantSlug(baseSlug + '-' + suffix);
    suffix += 1;
  }
  return candidate;
}

function normalizeRequiredText(value, label) {
  const text = normalizeOptionalText(value);
  if (!text) throw new Error(label + ' חובה');
  return text;
}

function normalizeContactEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email) throw new Error('אימייל איש קשר חובה');
  if (!email.includes('@')) throw new Error('אימייל איש קשר לא תקין');
  return email;
}

function normalizeInitialPassword(value) {
  const password = String(value || '');
  if (!password) throw new Error('סיסמה ראשונית חובה');
  if (password.length < 4) throw new Error('הסיסמה הראשונית חייבת להכיל לפחות 4 תווים');
  return password;
}

function normalizeTenantStatus(value) {
  const status = String(value || '').trim().toLowerCase();
  if (status !== 'active' && status !== 'suspended') {
    throw new Error('סטטוס עסק לא תקין');
  }
  return status;
}

function mapOwnerRow(row) {
  if (!row) return null;
  return {
    user_id: row.user_id,
    membership_id: row.membership_id,
    name: row.display_name || row.name || null,
    email: row.email || null,
    membership_status: row.membership_status || null,
    last_login_at: row.last_login_at || null,
    must_change_password: Number(row.must_change_password) === 1
  };
}

function normalizeModuleKey(value) {
  const moduleKey = String(value || '').trim().toLowerCase();
  if (!MODULE_KEY_SET.has(moduleKey)) throw new Error('module_key לא תקין');
  return moduleKey;
}

function normalizeModuleEnabled(value) {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  throw new Error('is_enabled לא תקין');
}

function normalizeModuleSortOrder(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const order = Number(value);
  if (!Number.isInteger(order) || order < 0 || order > 1000) throw new Error('sort_order לא תקין');
  return order;
}

function normalizeModulesPayload(modules) {
  if (!Array.isArray(modules) || modules.length !== MODULE_KEYS.length) {
    throw new Error('בחירת מודולים לא תקינה');
  }

  const seen = new Set();
  const normalized = modules.map(function(item, index) {
    if (!item || typeof item !== 'object') throw new Error('בחירת מודולים לא תקינה');
    const moduleKey = normalizeModuleKey(item.module_key);
    if (seen.has(moduleKey)) throw new Error('module_key כפול בבקשה');
    seen.add(moduleKey);
    return {
      module_key: moduleKey,
      is_enabled: normalizeModuleEnabled(item.is_enabled),
      sort_order: normalizeModuleSortOrder(item.sort_order, index + 1)
    };
  });

  if (seen.size !== MODULE_KEYS.length) {
    throw new Error('חסרים מודולים בבקשה');
  }

  const byKey = new Map(normalized.map(function(item) { return [item.module_key, item]; }));
  return MODULE_KEYS.map(function(moduleKey, index) {
    const item = byKey.get(moduleKey);
    return {
      module_key: moduleKey,
      is_enabled: item.is_enabled,
      sort_order: item.sort_order || (index + 1)
    };
  });
}

function mapTenantRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    timezone: row.timezone,
    currency: row.currency,
    locale: row.locale,
    contact_name: row.contact_name || null,
    contact_phone: row.contact_phone || null,
    contact_email: row.contact_email || null,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function mapAuditRow(row) {
  return {
    id: row.id,
    actor_user_id: row.actor_user_id || null,
    actor_email: row.actor_email || null,
    action: row.action,
    target_type: row.target_type,
    target_id: row.target_id || null,
    target_slug: row.target_slug || null,
    details_json: row.details_json || null,
    created_at: row.created_at || null
  };
}

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value || {});
  } catch {
    return JSON.stringify({ error: 'details_json_serialize_failed' });
  }
}

async function getTenantById(tenantId, env) {
  return env.DB.prepare(`
    SELECT id, name, slug, status, timezone, currency, locale, contact_name, contact_phone, contact_email, created_at, updated_at
    FROM tenants
    WHERE id = ?
  `).bind(tenantId).first();
}

async function getTenantBySlug(slug, env) {
  return env.DB.prepare(`
    SELECT id, name, slug, status, timezone, currency, locale, contact_name, contact_phone, contact_email, created_at, updated_at
    FROM tenants
    WHERE slug = ?
  `).bind(slug).first();
}

async function getUserByEmail(email, env) {
  return env.DB.prepare(`
    SELECT id, name, email, role, status
    FROM users
    WHERE lower(email) = ?
    LIMIT 1
  `).bind(email).first();
}

async function getActiveMembershipCountForUser(userId, env) {
  const row = await env.DB.prepare(`
    SELECT COUNT(*) AS count
    FROM tenant_memberships tm
    JOIN tenants t ON t.id = tm.tenant_id
    WHERE tm.user_id = ?
      AND tm.status = 'active'
      AND t.status = 'active'
  `).bind(userId).first();
  return Number(row && row.count ? row.count : 0);
}

async function getPrimaryOwner(tenantId, env) {
  return env.DB.prepare(`
    SELECT
      tm.id AS membership_id,
      tm.user_id,
      tm.status AS membership_status,
      u.name,
      u.display_name,
      u.email,
      u.last_login_at,
      u.must_change_password
    FROM tenant_memberships tm
    JOIN users u ON u.id = tm.user_id
    WHERE tm.tenant_id = ?
      AND tm.role = 'owner'
    ORDER BY
      CASE tm.status WHEN 'active' THEN 1 ELSE 2 END,
      tm.id ASC
    LIMIT 1
  `).bind(tenantId).first();
}

async function getEffectiveTenantModules(tenantId, env) {
  const rows = await env.DB.prepare(`
    SELECT module_key, is_enabled, sort_order
    FROM tenant_modules
    WHERE tenant_id = ?
  `).bind(tenantId).all();

  const rowMap = new Map((rows.results || []).map(function(row) {
    return [row.module_key, row];
  }));

  return MODULE_KEYS.map(function(moduleKey, index) {
    const row = rowMap.get(moduleKey);
    return {
      module_key: moduleKey,
      is_enabled: row ? Number(row.is_enabled) === 1 : true,
      sort_order: row && row.sort_order !== null && row.sort_order !== undefined ? Number(row.sort_order) : (index + 1),
      source: row ? 'row' : 'default_enabled'
    };
  }).sort(function(a, b) {
    return (a.sort_order - b.sort_order) || MODULE_KEYS.indexOf(a.module_key) - MODULE_KEYS.indexOf(b.module_key);
  });
}

async function getAdminAuditLogsForTenant(tenantId, env, limit = 10) {
  const result = await env.DB.prepare(`
    SELECT id, actor_user_id, actor_email, action, target_type, target_id, target_slug, details_json, created_at
    FROM admin_audit_logs
    WHERE target_type = 'tenant'
      AND target_id = ?
    ORDER BY id DESC
    LIMIT ?
  `).bind(tenantId, limit).all();

  return (result.results || []).map(mapAuditRow);
}

async function logAdminAudit(env, actor, action, target, details) {
  if (!AUDIT_ACTIONS.has(action)) return;
  try {
    await env.DB.prepare(`
      INSERT INTO admin_audit_logs (
        actor_user_id,
        actor_email,
        action,
        target_type,
        target_id,
        target_slug,
        details_json,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      actor && actor.id ? actor.id : null,
      actor && actor.email ? actor.email : null,
      action,
      target && target.type ? target.type : 'unknown',
      target && target.id ? target.id : null,
      target && target.slug ? target.slug : null,
      safeJsonStringify(details)
    ).run();
  } catch (err) {
    console.error('admin audit log failed', action, err && err.message ? err.message : err);
  }
}

export async function handleAdmin(request, env, path) {
  const method = request.method;
  const superAdminCtx = await requireSuperAdmin(request, env);
  if (superAdminCtx instanceof Response) return superAdminCtx;

  if (path.startsWith('/api/admin/cleanup')) {
    return handleAdminCleanup(request, env, path, superAdminCtx);
  }

  if (path === '/api/admin/tenants' && method === 'GET') {
    const result = await env.DB.prepare(`
      SELECT id, name, slug, status, timezone, currency, locale, contact_name, contact_phone, contact_email, created_at, updated_at
      FROM tenants
      ORDER BY created_at DESC, id DESC
    `).all();

    return {
      tenants: (result.results || []).map(mapTenantRow)
    };
  }

  if (path === '/api/admin/tenants' && method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const name = normalizeTenantName(body.name);
    const contactName = normalizeRequiredText(body.contact_name, 'שם איש קשר');
    const contactPhone = normalizeRequiredText(body.contact_phone, 'טלפון איש קשר');
    const contactEmail = normalizeContactEmail(body.contact_email);
    const initialPassword = normalizeInitialPassword(body.initial_password);
    const timezone = 'Asia/Jerusalem';
    const currency = 'ILS';
    const locale = 'he-IL';
    const normalizedModules = normalizeModulesPayload(body.modules);
    const slug = await generateUniqueTenantSlug(name, env);

    let ownerUser = await getUserByEmail(contactEmail, env);
    if (ownerUser) {
      const activeMembershipCount = await getActiveMembershipCountForUser(ownerUser.id, env);
      if (activeMembershipCount > 0) {
        throw new Error('האימייל כבר משויך לעסק פעיל אחר, לא ניתן להשתמש בו כבעלים חדש');
      }
    }

    const tenantResult = await env.DB.prepare(`
      INSERT INTO tenants (
        name,
        slug,
        status,
        timezone,
        currency,
        locale,
        contact_name,
        contact_phone,
        contact_email,
        created_at,
        updated_at
      ) VALUES (?, ?, 'active', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      name,
      slug,
      timezone,
      currency,
      locale,
      contactName,
      contactPhone,
      contactEmail
    ).run();

    const tenantId = tenantResult.meta.last_row_id;

    if (!ownerUser) {
      const passwordHash = await hashPassword(initialPassword);
      const createUserResult = await env.DB.prepare(`
        INSERT INTO users (
          name,
          email,
          password_hash,
          role,
          must_change_password,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, 'user', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(contactName, contactEmail, passwordHash).run();

      ownerUser = await env.DB.prepare(`
        SELECT id, name, email, role, status
        FROM users
        WHERE id = ?
        LIMIT 1
      `).bind(createUserResult.meta.last_row_id).first();
    } else {
      const passwordHash = await hashPassword(initialPassword);
      await env.DB.prepare(`
        UPDATE users
        SET password_hash = ?, must_change_password = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(passwordHash, ownerUser.id).run();
    }

    await env.DB.prepare(`
      INSERT INTO tenant_memberships (
        tenant_id,
        user_id,
        role,
        status,
        invited_by_user_id,
        accepted_at,
        created_at,
        updated_at
      ) VALUES (?, ?, 'owner', 'active', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      tenantId,
      ownerUser.id,
      superAdminCtx && superAdminCtx.user ? superAdminCtx.user.id : null
    ).run();

    for (const item of normalizedModules) {
      await env.DB.prepare(`
        INSERT INTO tenant_modules (
          tenant_id,
          module_key,
          is_enabled,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        tenantId,
        item.module_key,
        item.is_enabled ? 1 : 0,
        item.sort_order
      ).run();
    }

    const tenant = await getTenantById(tenantId, env);
    await logAdminAudit(env, superAdminCtx.user, 'tenant_create', {
      type: 'tenant',
      id: tenantId,
      slug: tenant.slug
    }, {
      tenant: mapTenantRow(tenant),
      owner: {
        id: ownerUser.id,
        email: ownerUser.email,
        role: ownerUser.role
      },
      modules: normalizedModules.map(function(item) {
        return { module_key: item.module_key, is_enabled: item.is_enabled };
      })
    });
    return {
      success: true,
      tenant: mapTenantRow(tenant),
      owner: {
        id: ownerUser.id,
        name: ownerUser.name,
        email: ownerUser.email,
        role: ownerUser.role
      },
      modules: normalizedModules
    };
  }

  const tenantMatch = path.match(/^\/api\/admin\/tenants\/(\d+)$/);
  if (tenantMatch && method === 'GET') {
    const tenantId = Number(tenantMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');
    return {
      tenant: mapTenantRow(tenant),
      owner: mapOwnerRow(await getPrimaryOwner(tenantId, env)),
      audit_logs: await getAdminAuditLogsForTenant(tenantId, env)
    };
  }

  if (tenantMatch && method === 'PUT') {
    const tenantId = Number(tenantMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const name = normalizeTenantName(body.name);
    const contactName = normalizeRequiredText(body.contact_name, 'שם איש קשר');
    const contactPhone = normalizeRequiredText(body.contact_phone, 'טלפון איש קשר');
    const contactEmail = normalizeContactEmail(body.contact_email);
    const status = normalizeTenantStatus(body.status || tenant.status);
    const beforeTenant = mapTenantRow(tenant);

    await env.DB.prepare(`
      UPDATE tenants
      SET name = ?,
          contact_name = ?,
          contact_phone = ?,
          contact_email = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(name, contactName, contactPhone, contactEmail, status, tenantId).run();

    const updatedTenant = await getTenantById(tenantId, env);
    await logAdminAudit(env, superAdminCtx.user, 'tenant_update', {
      type: 'tenant',
      id: tenantId,
      slug: updatedTenant.slug
    }, {
      before: beforeTenant,
      after: mapTenantRow(updatedTenant)
    });
    return {
      success: true,
      tenant: mapTenantRow(updatedTenant),
      owner: mapOwnerRow(await getPrimaryOwner(tenantId, env))
    };
  }

  const tenantActivateMatch = path.match(/^\/api\/admin\/tenants\/(\d+)\/activate$/);
  if (tenantActivateMatch && method === 'POST') {
    const tenantId = Number(tenantActivateMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    await env.DB.prepare(`
      UPDATE tenants
      SET status = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(tenantId).run();

    const updatedTenant = await getTenantById(tenantId, env);
    await logAdminAudit(env, superAdminCtx.user, 'tenant_activate', {
      type: 'tenant',
      id: tenantId,
      slug: updatedTenant.slug
    }, {
      before: { status: tenant.status },
      after: { status: updatedTenant.status }
    });
    return { success: true, tenant: mapTenantRow(updatedTenant) };
  }

  const tenantSuspendMatch = path.match(/^\/api\/admin\/tenants\/(\d+)\/suspend$/);
  if (tenantSuspendMatch && method === 'POST') {
    const tenantId = Number(tenantSuspendMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    await env.DB.prepare(`
      UPDATE tenants
      SET status = 'suspended', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(tenantId).run();

    const updatedTenant = await getTenantById(tenantId, env);
    await logAdminAudit(env, superAdminCtx.user, 'tenant_suspend', {
      type: 'tenant',
      id: tenantId,
      slug: updatedTenant.slug
    }, {
      before: { status: tenant.status },
      after: { status: updatedTenant.status }
    });
    return { success: true, tenant: mapTenantRow(updatedTenant) };
  }

  const tenantModulesMatch = path.match(/^\/api\/admin\/tenants\/(\d+)\/modules$/);
  if (tenantModulesMatch && method === 'GET') {
    const tenantId = Number(tenantModulesMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    return {
      tenant: mapTenantRow(tenant),
      modules: await getEffectiveTenantModules(tenantId, env)
    };
  }

  if (tenantModulesMatch && method === 'PUT') {
    const tenantId = Number(tenantModulesMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const beforeModules = await getEffectiveTenantModules(tenantId, env);
    const normalizedModules = normalizeModulesPayload(body.modules);

    for (const item of normalizedModules) {
      await env.DB.prepare(`
        INSERT INTO tenant_modules (
          tenant_id,
          module_key,
          is_enabled,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(tenant_id, module_key)
        DO UPDATE SET
          is_enabled = excluded.is_enabled,
          sort_order = excluded.sort_order,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        tenantId,
        item.module_key,
        item.is_enabled ? 1 : 0,
        item.sort_order
      ).run();
    }

    const updatedModules = await getEffectiveTenantModules(tenantId, env);
    await logAdminAudit(env, superAdminCtx.user, 'tenant_modules_update', {
      type: 'tenant',
      id: tenantId,
      slug: tenant.slug
    }, {
      before: beforeModules.map(function(item) { return { module_key: item.module_key, is_enabled: item.is_enabled, sort_order: item.sort_order }; }),
      after: updatedModules.map(function(item) { return { module_key: item.module_key, is_enabled: item.is_enabled, sort_order: item.sort_order }; })
    });
    return {
      success: true,
      tenant: mapTenantRow(tenant),
      modules: updatedModules
    };
  }

  const tenantOwnerResetMatch = path.match(/^\/api\/admin\/tenants\/(\d+)\/owner\/reset-password$/);
  if (tenantOwnerResetMatch && method === 'POST') {
    const tenantId = Number(tenantOwnerResetMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    let body;
    try {
      body = await request.json();
    } catch {
      throw new Error('בקשה לא תקינה');
    }

    const newPassword = normalizeInitialPassword(body && body.password);
    const owner = await getPrimaryOwner(tenantId, env);
    if (!owner || !owner.user_id) throw new Error('לא נמצא בעלים ראשי לעסק הזה');
    const ownerBefore = mapOwnerRow(owner);

    const passwordHash = await hashPassword(newPassword);
    await env.DB.prepare(`
      UPDATE users
      SET password_hash = ?,
          must_change_password = 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(passwordHash, owner.user_id).run();

    const updatedOwner = mapOwnerRow(await getPrimaryOwner(tenantId, env));
    await logAdminAudit(env, superAdminCtx.user, 'tenant_owner_password_reset', {
      type: 'tenant',
      id: tenantId,
      slug: tenant.slug
    }, {
      owner_before: ownerBefore,
      owner_after: updatedOwner,
      password_reset: true
    });
    return {
      success: true,
      owner: updatedOwner
    };
  }

  return { error: 'Admin route not found' };
}
