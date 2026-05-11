import { requireSuperAdmin } from './auth.js';

const MODULE_KEYS = [
  'leads',
  'contacts',
  'employees',
  'products',
  'shopping',
  'reports'
];

function mapTenantRow(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    timezone: row.timezone,
    currency: row.currency,
    locale: row.locale,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function getTenantById(tenantId, env) {
  return env.DB.prepare(`
    SELECT id, name, slug, status, timezone, currency, locale, created_at, updated_at
    FROM tenants
    WHERE id = ?
  `).bind(tenantId).first();
}

export async function handleAdmin(request, env, path) {
  const method = request.method;
  const superAdminCtx = await requireSuperAdmin(request, env);
  if (superAdminCtx instanceof Response) return superAdminCtx;

  if (path === '/api/admin/tenants' && method === 'GET') {
    const result = await env.DB.prepare(`
      SELECT id, name, slug, status, timezone, currency, locale, created_at, updated_at
      FROM tenants
      ORDER BY created_at DESC, id DESC
    `).all();

    return {
      tenants: (result.results || []).map(mapTenantRow)
    };
  }

  const tenantMatch = path.match(/^\/api\/admin\/tenants\/(\d+)$/);
  if (tenantMatch && method === 'GET') {
    const tenantId = Number(tenantMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');
    return { tenant: mapTenantRow(tenant) };
  }

  const tenantModulesMatch = path.match(/^\/api\/admin\/tenants\/(\d+)\/modules$/);
  if (tenantModulesMatch && method === 'GET') {
    const tenantId = Number(tenantModulesMatch[1]);
    const tenant = await getTenantById(tenantId, env);
    if (!tenant) throw new Error('Tenant not found');

    const rows = await env.DB.prepare(`
      SELECT module_key, is_enabled
      FROM tenant_modules
      WHERE tenant_id = ?
    `).bind(tenantId).all();

    const rowMap = new Map((rows.results || []).map(function(row) {
      return [row.module_key, row];
    }));

    return {
      tenant: mapTenantRow(tenant),
      modules: MODULE_KEYS.map(function(moduleKey) {
        const row = rowMap.get(moduleKey);
        return {
          module_key: moduleKey,
          is_enabled: row ? Number(row.is_enabled) === 1 : true,
          source: row ? 'row' : 'default_enabled'
        };
      })
    };
  }

  return { error: 'Admin route not found' };
}
