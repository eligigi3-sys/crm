import { requireTenantContext, assertTenantRole, normalizeTenantRole } from './auth.js';
import { hashPassword } from './passwords.js';

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || '').trim();
}

function normalizePassword(password) {
  return String(password || '');
}

function mapMemberRow(row) {
  return {
    membership_id: row.membership_id,
    tenant_id: row.tenant_id,
    user_id: row.user_id,
    name: row.display_name || row.name,
    display_name: row.display_name || null,
    email: row.email,
    role: row.role,
    status: row.status,
    invited_by_user_id: row.invited_by_user_id || null,
    accepted_at: row.accepted_at || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
    user_status: row.user_status || null,
    last_login_at: row.last_login_at || null
  };
}

async function getTenantMembershipById(tenantId, membershipId, env) {
  return env.DB.prepare(
    `SELECT
       tm.id AS membership_id,
       tm.tenant_id,
       tm.user_id,
       tm.role,
       tm.status,
       tm.invited_by_user_id,
       tm.accepted_at,
       tm.created_at,
       tm.updated_at,
       u.name,
       u.display_name,
       u.email,
       u.status AS user_status,
       u.last_login_at
     FROM tenant_memberships tm
     JOIN users u ON u.id = tm.user_id
     WHERE tm.id = ?
       AND tm.tenant_id = ?
     LIMIT 1`
  ).bind(membershipId, tenantId).first();
}

async function getTenantMembershipByUserId(tenantId, userId, env) {
  return env.DB.prepare(
    `SELECT
       tm.id AS membership_id,
       tm.tenant_id,
       tm.user_id,
       tm.role,
       tm.status,
       tm.invited_by_user_id,
       tm.accepted_at,
       tm.created_at,
       tm.updated_at,
       u.name,
       u.display_name,
       u.email,
       u.status AS user_status,
       u.last_login_at
     FROM tenant_memberships tm
     JOIN users u ON u.id = tm.user_id
     WHERE tm.user_id = ?
       AND tm.tenant_id = ?
     LIMIT 1`
  ).bind(userId, tenantId).first();
}

async function getUserByEmail(email, env) {
  return env.DB.prepare(
    `SELECT id, name, display_name, email, role, status
     FROM users
     WHERE lower(email) = ?
     LIMIT 1`
  ).bind(normalizeEmail(email)).first();
}

async function countActiveOwners(tenantId, env) {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS count
     FROM tenant_memberships
     WHERE tenant_id = ?
       AND role = 'owner'
       AND status = 'active'`
  ).bind(tenantId).first();
  return Number(row && row.count ? row.count : 0);
}

function canActorCreateRole(actorRole, targetRole) {
  if (actorRole === 'owner') return true;
  if (actorRole === 'admin') {
    return targetRole === 'manager' || targetRole === 'employee';
  }
  return false;
}

function canActorAssignRole(actorRole, targetMembershipRole, nextRole) {
  if (actorRole === 'owner') {
    return true;
  }
  if (actorRole === 'admin') {
    if (targetMembershipRole === 'owner' || targetMembershipRole === 'admin') return false;
    return nextRole === 'manager' || nextRole === 'employee';
  }
  return false;
}

function canActorManageMembership(actorRole, targetMembershipRole) {
  if (actorRole === 'owner') return true;
  if (actorRole === 'admin') {
    return targetMembershipRole === 'manager' || targetMembershipRole === 'employee';
  }
  return false;
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function validateCreatePayload(body) {
  const name = normalizeName(body && body.name);
  const email = normalizeEmail(body && body.email);
  const password = normalizePassword(body && body.password);
  const role = normalizeTenantRole(body && body.role);

  if (!name) return { error: 'שם הוא שדה חובה' };
  if (!email) return { error: 'אימייל הוא שדה חובה' };
  if (!email.includes('@')) return { error: 'אימייל לא תקין' };
  if (!password) return { error: 'סיסמה זמנית היא שדה חובה' };
  if (password.length < 4) return { error: 'הסיסמה הזמנית חייבת להכיל לפחות 4 תווים' };
  if (!role) return { error: 'תפקיד לא תקין' };

  return { name, email, password, role };
}

export async function handleMembers(request, env, path) {
  const method = request.method;
  const ctx = await requireTenantContext(request, env);
  if (ctx instanceof Response) return ctx;

  const access = await assertTenantRole(ctx, ['owner', 'admin']);
  if (access instanceof Response) return access;

  const actorRole = normalizeTenantRole(ctx.membership && ctx.membership.role);
  const actorUserId = Number(ctx.user && ctx.user.id);
  const tenantId = Number(ctx.tenant && ctx.tenant.id);

  if (path === '/api/tenant-members' && method === 'GET') {
    const result = await env.DB.prepare(
      `SELECT
         tm.id AS membership_id,
         tm.tenant_id,
         tm.user_id,
         tm.role,
         tm.status,
         tm.invited_by_user_id,
         tm.accepted_at,
         tm.created_at,
         tm.updated_at,
         u.name,
         u.display_name,
         u.email,
         u.status AS user_status,
         u.last_login_at
       FROM tenant_memberships tm
       JOIN users u ON u.id = tm.user_id
       WHERE tm.tenant_id = ?
       ORDER BY
         CASE tm.role
           WHEN 'owner' THEN 1
           WHEN 'admin' THEN 2
           WHEN 'manager' THEN 3
           ELSE 4
         END,
         CASE tm.status WHEN 'active' THEN 1 ELSE 2 END,
         tm.id ASC`
    ).bind(tenantId).all();

    return {
      members: (result.results || []).map(mapMemberRow)
    };
  }

  if (path === '/api/tenant-members' && method === 'POST') {
    const body = await parseJson(request);
    if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

    const parsed = validateCreatePayload(body);
    if (parsed.error) return json({ error: parsed.error }, 400);
    if (!canActorCreateRole(actorRole, parsed.role)) {
      return json({ error: 'Permission denied' }, 403);
    }

    let user = await getUserByEmail(parsed.email, env);
    if (user) {
      const existingMembership = await getTenantMembershipByUserId(tenantId, user.id, env);
      if (existingMembership) {
        return json({ error: 'למשתמש כבר קיים שיוך לעסק הזה' }, 409);
      }
    } else {
      const passwordHash = await hashPassword(parsed.password);
      const createUserResult = await env.DB.prepare(
        `INSERT INTO users (
           name,
           email,
           password_hash,
           role,
           created_at,
           updated_at
         ) VALUES (?, ?, ?, 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      ).bind(parsed.name, parsed.email, passwordHash).run();

      user = await env.DB.prepare(
        `SELECT id, name, display_name, email, role, status
         FROM users
         WHERE id = ?
         LIMIT 1`
      ).bind(createUserResult.meta.last_row_id).first();
    }

    await env.DB.prepare(
      `INSERT INTO tenant_memberships (
         tenant_id,
         user_id,
         role,
         status,
         invited_by_user_id,
         accepted_at,
         created_at,
         updated_at
       ) VALUES (?, ?, ?, 'active', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(tenantId, user.id, parsed.role, actorUserId).run();

    const createdMembership = await getTenantMembershipByUserId(tenantId, user.id, env);
    return {
      success: true,
      member: mapMemberRow(createdMembership)
    };
  }

  const roleMatch = path.match(/^\/api\/tenant-members\/(\d+)\/role$/);
  if (roleMatch && method === 'PUT') {
    const membershipId = Number(roleMatch[1]);
    const body = await parseJson(request);
    if (!body) return json({ error: 'בקשה לא תקינה' }, 400);

    const nextRole = normalizeTenantRole(body.role);
    if (!nextRole) return json({ error: 'תפקיד לא תקין' }, 400);

    const target = await getTenantMembershipById(tenantId, membershipId, env);
    if (!target) return json({ error: 'משתמש לא נמצא' }, 404);
    if (Number(target.user_id) === actorUserId) {
      return json({ error: 'לא ניתן לשנות את התפקיד של המשתמש המחובר' }, 403);
    }
    if (!canActorAssignRole(actorRole, normalizeTenantRole(target.role), nextRole)) {
      return json({ error: 'Permission denied' }, 403);
    }
    if (normalizeTenantRole(target.role) === 'owner' && nextRole !== 'owner') {
      const activeOwners = await countActiveOwners(tenantId, env);
      if (target.status === 'active' && activeOwners <= 1) {
        return json({ error: 'לא ניתן להסיר את הבעלים הפעיל האחרון' }, 409);
      }
    }

    await env.DB.prepare(
      `UPDATE tenant_memberships
       SET role = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND tenant_id = ?`
    ).bind(nextRole, membershipId, tenantId).run();

    const updatedMembership = await getTenantMembershipById(tenantId, membershipId, env);
    return {
      success: true,
      member: mapMemberRow(updatedMembership)
    };
  }

  const deactivateMatch = path.match(/^\/api\/tenant-members\/(\d+)\/deactivate$/);
  if (deactivateMatch && method === 'POST') {
    const membershipId = Number(deactivateMatch[1]);
    const target = await getTenantMembershipById(tenantId, membershipId, env);
    if (!target) return json({ error: 'משתמש לא נמצא' }, 404);
    if (Number(target.user_id) === actorUserId) {
      return json({ error: 'לא ניתן להשבית את המשתמש המחובר' }, 403);
    }
    if (!canActorManageMembership(actorRole, normalizeTenantRole(target.role))) {
      return json({ error: 'Permission denied' }, 403);
    }
    if (target.status !== 'active') {
      return json({ error: 'המשתמש כבר לא פעיל' }, 409);
    }
    if (normalizeTenantRole(target.role) === 'owner') {
      const activeOwners = await countActiveOwners(tenantId, env);
      if (activeOwners <= 1) {
        return json({ error: 'לא ניתן להשבית את הבעלים הפעיל האחרון' }, 409);
      }
    }

    await env.DB.prepare(
      `UPDATE tenant_memberships
       SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND tenant_id = ?`
    ).bind(membershipId, tenantId).run();

    const updatedMembership = await getTenantMembershipById(tenantId, membershipId, env);
    return {
      success: true,
      member: mapMemberRow(updatedMembership)
    };
  }

  const deleteMatch = path.match(/^\/api\/tenant-members\/(\d+)$/);
  if (deleteMatch && method === 'DELETE') {
    const membershipId = Number(deleteMatch[1]);
    const target = await getTenantMembershipById(tenantId, membershipId, env);
    if (!target) return json({ error: 'משתמש לא נמצא' }, 404);
    if (Number(target.user_id) === actorUserId) {
      return json({ error: 'לא ניתן למחוק את המשתמש המחובר' }, 403);
    }
    if (!canActorManageMembership(actorRole, normalizeTenantRole(target.role))) {
      return json({ error: 'Permission denied' }, 403);
    }
    if (normalizeTenantRole(target.role) === 'owner') {
      const activeOwners = await countActiveOwners(tenantId, env);
      if (target.status === 'active' && activeOwners <= 1) {
        return json({ error: 'לא ניתן למחוק את הבעלים הפעיל האחרון' }, 409);
      }
    }

    await env.DB.prepare(
      'DELETE FROM tenant_memberships WHERE id = ? AND tenant_id = ?'
    ).bind(membershipId, tenantId).run();

    const remainingMemberships = await env.DB.prepare(
      'SELECT COUNT(*) AS count FROM tenant_memberships WHERE user_id = ?'
    ).bind(target.user_id).first();
    if (Number(remainingMemberships && remainingMemberships.count || 0) === 0) {
      await env.DB.prepare(
        "DELETE FROM users WHERE id = ? AND lower(COALESCE(role,'')) <> 'super_admin'"
      ).bind(target.user_id).run();
    }

    return { success: true };
  }

  const reactivateMatch = path.match(/^\/api\/tenant-members\/(\d+)\/reactivate$/);
  if (reactivateMatch && method === 'POST') {
    const membershipId = Number(reactivateMatch[1]);
    const target = await getTenantMembershipById(tenantId, membershipId, env);
    if (!target) return json({ error: 'משתמש לא נמצא' }, 404);
    if (!canActorManageMembership(actorRole, normalizeTenantRole(target.role))) {
      return json({ error: 'Permission denied' }, 403);
    }
    if (target.status !== 'inactive') {
      return json({ error: 'המשתמש כבר פעיל' }, 409);
    }

    await env.DB.prepare(
      `UPDATE tenant_memberships
       SET status = 'active', updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND tenant_id = ?`
    ).bind(membershipId, tenantId).run();

    const updatedMembership = await getTenantMembershipById(tenantId, membershipId, env);
    return {
      success: true,
      member: mapMemberRow(updatedMembership)
    };
  }

  return json({ error: 'Members route not found' }, 404);
}
