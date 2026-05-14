import { hashPassword, verifyPassword } from './passwords.js';

function normalizeOptionalText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeRequiredText(value, label) {
  const text = normalizeOptionalText(value);
  if (!text) throw new Error(label + ' חובה');
  return text;
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

const TENANT_MODULE_KEYS = new Set([
  'leads',
  'contacts',
  'employees',
  'products',
  'shopping',
  'reports'
]);

const TENANT_ROLE_HIERARCHY = {
  employee: 1,
  manager: 2,
  admin: 3,
  owner: 4
};

function normalizeTenantModuleKey(moduleKey) {
  const value = String(moduleKey || '').trim().toLowerCase();
  if (!TENANT_MODULE_KEYS.has(value)) {
    throw new Error('Module key not allowed');
  }
  return value;
}

function getBearerToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function normalizePasswordInput(value, label) {
  const password = String(value || '');
  if (!password) throw new Error(label + ' חובה');
  if (password.length < 4) throw new Error('הסיסמה חייבת להכיל לפחות 4 תווים');
  return password;
}

function shouldForcePasswordChange(user) {
  return Number(user && user.must_change_password) === 1;
}

function mapAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    must_change_password: shouldForcePasswordChange(user)
  };
}

export async function getUserById(userId, env) {
  if (!userId) return null;
  return env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
}

export async function requireAuthUser(request, env) {
  const token = getBearerToken(request);
  if (!token) {
    return json({ error: 'נדרש טוקן התחברות' }, 401);
  }

  let payload;
  try {
    payload = await verifyToken(token, env.JWT_SECRET);
  } catch {
    return json({ error: 'טוקן לא תקין או שפג תוקפו' }, 401);
  }

  const user = await getUserById(payload.userId, env);
  if (!user) {
    return json({ error: 'המשתמש לא נמצא' }, 401);
  }

  return user;
}

export async function requireSuperAdmin(request, env) {
  const user = await requireAuthUser(request, env);
  if (user instanceof Response) return user;

  if (String(user.role || '').trim().toLowerCase() !== 'super_admin') {
    return json({ error: 'גישה זו מותרת לסופר אדמין בלבד' }, 403);
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

export async function requireTenantContext(request, env) {
  const user = await requireAuthUser(request, env);
  if (user instanceof Response) {
    return user;
  }

  if (shouldForcePasswordChange(user)) {
    return json({ error: 'יש להחליף סיסמה ראשונית לפני הכניסה למערכת', must_change_password: true }, 403);
  }

  const memberships = await env.DB.prepare(
    `SELECT
       tm.id,
       tm.tenant_id,
       tm.role,
       tm.status,
       t.slug AS tenant_slug,
       t.status AS tenant_status,
       t.name AS tenant_name,
       t.contact_phone AS tenant_contact_phone,
       t.contact_email AS tenant_contact_email
     FROM tenant_memberships tm
     JOIN tenants t ON t.id = tm.tenant_id
     WHERE tm.user_id = ?
       AND tm.status = 'active'
     ORDER BY tm.id ASC`
  ).bind(user.id).all();

  const activeMemberships = (memberships.results || []).filter(function(item) {
    return item.tenant_status === 'active';
  });

  if (activeMemberships.length === 0) {
    return json({ error: 'אין למשתמש שיוך פעיל לעסק' }, 403);
  }

  if (activeMemberships.length > 1) {
    return json({ error: 'נדרשת בחירת עסק פעיל לפני המשך' }, 409);
  }

  const membership = activeMemberships[0];
  return {
    user: {
      id: user.id,
      email: user.email
    },
    tenant: {
      id: membership.tenant_id,
      slug: membership.tenant_slug,
      status: membership.tenant_status,
      name: membership.tenant_name || null,
      contact_phone: membership.tenant_contact_phone || null,
      contact_email: membership.tenant_contact_email || null
    },
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status
    }
  };
}

export async function getTenantModuleState(tenantId, moduleKey, env) {
  const normalizedModuleKey = normalizeTenantModuleKey(moduleKey);
  const row = await env.DB.prepare(
    `SELECT module_key, is_enabled
     FROM tenant_modules
     WHERE tenant_id = ?
       AND module_key = ?
     LIMIT 1`
  ).bind(tenantId, normalizedModuleKey).first();

  if (!row) {
    return {
      module_key: normalizedModuleKey,
      is_enabled: true,
      source: 'default_enabled'
    };
  }

  return {
    module_key: normalizedModuleKey,
    is_enabled: Number(row.is_enabled) === 1,
    source: 'row'
  };
}

export async function assertTenantModuleEnabled(ctx, env, moduleKey) {
  const state = await getTenantModuleState(ctx && ctx.tenant ? ctx.tenant.id : null, moduleKey, env);
  if (!state.is_enabled) {
    return json({ error: 'Module disabled' }, 403);
  }
  return state;
}

export function normalizeTenantRole(role) {
  const value = String(role || '').trim().toLowerCase();
  if (!TENANT_ROLE_HIERARCHY[value]) {
    return null;
  }
  return value;
}

export async function assertTenantRole(ctx, allowedRoles) {
  const currentRole = normalizeTenantRole(ctx && ctx.membership ? ctx.membership.role : null);
  if (!currentRole) {
    return json({ error: 'Permission denied' }, 403);
  }

  const normalizedAllowedRoles = Array.isArray(allowedRoles)
    ? allowedRoles.map(normalizeTenantRole).filter(Boolean)
    : [];

  if (normalizedAllowedRoles.length === 0) {
    return json({ error: 'Permission denied' }, 403);
  }

  const currentRank = TENANT_ROLE_HIERARCHY[currentRole];
  const minimumAllowedRank = Math.min(...normalizedAllowedRoles.map(function(role) {
    return TENANT_ROLE_HIERARCHY[role];
  }));

  if (currentRank < minimumAllowedRank) {
    return json({ error: 'Permission denied' }, 403);
  }

  return {
    role: currentRole,
    allowed_roles: normalizedAllowedRoles
  };
}

async function getEffectiveTenantModules(tenantId, env) {
  return Promise.all(Array.from(TENANT_MODULE_KEYS).map(function(moduleKey) {
    return getTenantModuleState(tenantId, moduleKey, env);
  }));
}

async function updateUserLoginSuccess(userId, env, options = {}) {
  const nextHash = options.passwordHash;
  try {
    if (nextHash) {
      await env.DB.prepare(
        'UPDATE users SET password_hash = ?, last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(nextHash, userId).run();
      return;
    }

    await env.DB.prepare(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(userId).run();
  } catch {
    try {
      if (nextHash) {
        await env.DB.prepare(
          'UPDATE users SET password_hash = ? WHERE id = ?'
        ).bind(nextHash, userId).run();
      }
    } catch {
    }
  }
}

async function loginWithUser(user, password, env) {
  const verification = await verifyPassword(password, user && user.password_hash);
  if (!verification.ok) return null;

  if (verification.needsUpgrade) {
    const nextHash = await hashPassword(password);
    await updateUserLoginSuccess(user.id, env, { passwordHash: nextHash });
  } else {
    await updateUserLoginSuccess(user.id, env);
  }

  const refreshedUser = await getUserById(user.id, env);
  const token = await createToken(user.id, user.email, env.JWT_SECRET);
  return {
    success: true,
    token,
    must_change_password: shouldForcePasswordChange(refreshedUser || user),
    user: mapAuthUser(refreshedUser || user)
  };
}

export async function handleAuth(request, env, path) {
  const method = request.method;

  if (path === '/api/auth/login') {
    if (method !== 'POST') {
      return json({ error: 'Method Not Allowed' }, 405, { Allow: 'POST' });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'בקשה לא תקינה' }, 400);
    }

    const email = (body.email || '').trim();
    const password = body.password;

    if (!email || !password) {
      return json({ error: 'אימייל וסיסמה חובה' }, 400);
    }

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (!user) {
      const user2 = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first();
      if (!user2) return json({ error: 'אימייל או סיסמה שגויים' }, 401);
      const loginResult = await loginWithUser(user2, password, env);
      if (!loginResult) return json({ error: 'אימייל או סיסמה שגויים' }, 401);
      return loginResult;
    }

    const loginResult = await loginWithUser(user, password, env);
    if (!loginResult) return json({ error: 'אימייל או סיסמה שגויים' }, 401);
    return loginResult;
  }

  if (path === '/api/auth/change-password' && method === 'POST') {
    const user = await requireAuthUser(request, env);
    if (user instanceof Response) return user;

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'בקשה לא תקינה' }, 400);
    }

    const newPassword = normalizePasswordInput(body && body.new_password, 'סיסמה חדשה');
    const currentPassword = String(body && body.current_password || '');
    const mustChangePassword = shouldForcePasswordChange(user);

    if (!mustChangePassword) {
      if (!currentPassword) {
        return json({ error: 'סיסמה נוכחית חובה' }, 400);
      }
      const verification = await verifyPassword(currentPassword, user && user.password_hash);
      if (!verification.ok) {
        return json({ error: 'הסיסמה הנוכחית שגויה' }, 400);
      }
    }

    const nextHash = await hashPassword(newPassword);
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(nextHash, user.id).run();

    const updatedUser = await getUserById(user.id, env);
    return {
      success: true,
      must_change_password: false,
      user: mapAuthUser(updatedUser || user)
    };
  }

  if (path === '/api/auth/verify' && method === 'POST') {
    const { token } = await request.json();
    const payload = await verifyToken(token, env.JWT_SECRET);
    return { valid: true, user: payload };
  }

  if (path === '/api/auth/tenant-context' && method === 'GET') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    return {
      user: ctx.user,
      tenant: ctx.tenant,
      membership: ctx.membership
    };
  }

  if (path === '/api/auth/modules' && method === 'GET') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    return {
      modules: await getEffectiveTenantModules(ctx.tenant.id, env)
    };
  }

  if (path === '/api/auth/tenant-setup-profile' && method === 'PUT') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    const roleState = await assertTenantRole(ctx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'בקשה לא תקינה' }, 400);
    }

    const name = normalizeRequiredText(body && body.name, 'שם העסק');
    const contactPhone = normalizeRequiredText(body && body.contact_phone, 'טלפון');

    await env.DB.prepare(
      `UPDATE tenants
       SET name = ?,
           contact_phone = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(name, contactPhone, ctx.tenant.id).run();

    const tenant = await env.DB.prepare(
      `SELECT id, slug, status, name, contact_phone, contact_email
       FROM tenants
       WHERE id = ?
       LIMIT 1`
    ).bind(ctx.tenant.id).first();

    return {
      success: true,
      tenant: tenant || {
        id: ctx.tenant.id,
        slug: ctx.tenant.slug,
        status: ctx.tenant.status,
        name,
        contact_phone: contactPhone,
        contact_email: ctx.tenant.contact_email || null
      }
    };
  }

  return json({ error: 'Auth route not found' }, 404);
}

async function createToken(userId, email, secret) {
  const payload = { userId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  const data = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret || 'default-secret'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${data}.${sigB64}`;
}

async function verifyToken(token, secret) {
  const [data, sig] = token.split('.');
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret || 'default-secret'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
  if (!valid) throw new Error('Token invalid');
  const payload = JSON.parse(atob(data));
  if (payload.exp < Date.now()) throw new Error('Token expired');
  return payload;
}
