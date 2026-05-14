import { requireSuperAdmin } from './auth.js';
import { hashPassword } from './passwords.js';

const MODULE_KEYS = [
  'leads',
  'contacts',
  'employees',
  'products',
  'shopping',
  'reports'
];
const MODULE_KEY_SET = new Set(MODULE_KEYS);

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
  if (!slug) throw new Error('כתובת מערכת / slug חובה');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('slug לא תקין');
  }
  return slug;
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

function normalizeModulesPayload(modules) {
  if (!Array.isArray(modules) || modules.length !== MODULE_KEYS.length) {
    throw new Error('בחירת מודולים לא תקינה');
  }

  const seen = new Set();
  const normalized = modules.map(function(item) {
    if (!item || typeof item !== 'object') throw new Error('בחירת מודולים לא תקינה');
    const moduleKey = normalizeModuleKey(item.module_key);
    if (seen.has(moduleKey)) throw new Error('module_key כפול בבקשה');
    seen.add(moduleKey);
    return {
      module_key: moduleKey,
      is_enabled: normalizeModuleEnabled(item.is_enabled)
    };
  });

  if (seen.size !== MODULE_KEYS.length) {
    throw new Error('חסרים מודולים בבקשה');
  }

  return MODULE_KEYS.map(function(moduleKey) {
    return normalized.find(function(item) { return item.module_key === moduleKey; });
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

async function getEffectiveTenantModules(tenantId, env) {
  const rows = await env.DB.prepare(`
    SELECT module_key, is_enabled
    FROM tenant_modules
    WHERE tenant_id = ?
  `).bind(tenantId).all();

  const rowMap = new Map((rows.results || []).map(function(row) {
    return [row.module_key, row];
  }));

  return MODULE_KEYS.map(function(moduleKey) {
    const row = rowMap.get(moduleKey);
    return {
      module_key: moduleKey,
      is_enabled: row ? Number(row.is_enabled) === 1 : true,
      source: row ? 'row' : 'default_enabled'
    };
  });
}

export async function handleAdmin(request, env, path) {
  const method = request.method;
  const superAdminCtx = await requireSuperAdmin(request, env);
  if (superAdminCtx instanceof Response) return superAdminCtx;

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
    const slug = normalizeTenantSlug(body.slug);
    const contactName = normalizeRequiredText(body.contact_name, 'שם איש קשר');
    const contactPhone = normalizeRequiredText(body.contact_phone, 'טלפון איש קשר');
    const contactEmail = normalizeContactEmail(body.contact_email);
    const initialPassword = normalizeInitialPassword(body.initial_password);
    const timezone = normalizeOptionalText(body.timezone) || 'Asia/Jerusalem';
    const currency = normalizeOptionalText(body.currency) || 'ILS';
    const locale = normalizeOptionalText(body.locale) || 'he-IL';
    const normalizedModules = normalizeModulesPayload(body.modules);

    const existingTenant = await getTenantBySlug(slug, env);
    if (existingTenant) throw new Error('כתובת המערכת כבר קיימת');

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
          created_at,
          updated_at
        ) VALUES (?, ?, ?, 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(contactName, contactEmail, passwordHash).run();

      ownerUser = await env.DB.prepare(`
        SELECT id, name, email, role, status
        FROM users
        WHERE id = ?
        LIMIT 1
      `).bind(createUserResult.meta.last_row_id).first();
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
          created_at,
          updated_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        tenantId,
        item.module_key,
        item.is_enabled ? 1 : 0
      ).run();
    }

    const tenant = await getTenantById(tenantId, env);
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
    return { tenant: mapTenantRow(tenant) };
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

    const normalizedModules = normalizeModulesPayload(body.modules);

    for (const item of normalizedModules) {
      await env.DB.prepare(`
        INSERT INTO tenant_modules (
          tenant_id,
          module_key,
          is_enabled,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(tenant_id, module_key)
        DO UPDATE SET
          is_enabled = excluded.is_enabled,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        tenantId,
        item.module_key,
        item.is_enabled ? 1 : 0
      ).run();
    }

    return {
      success: true,
      tenant: mapTenantRow(tenant),
      modules: await getEffectiveTenantModules(tenantId, env)
    };
  }

  return { error: 'Admin route not found' };
}
