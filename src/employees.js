import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

// ============================================================
// employees.js - ניהול עובדים
// ============================================================

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  var text = String(value).trim();
  return text ? text : null;
}

function normalizeNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  var num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeActive(value) {
  if (value === 0 || value === '0' || value === false) return 0;
  return 1;
}

async function getEmployeeByIdForTenant(employeeId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM employees WHERE id = ? AND tenant_id = ?').bind(employeeId, tenantId).first();
}

export async function handleEmployees(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const idMatch = path.match(/^\/api\/employees\/(\d+)$/);
  const assignmentsMatch = path.match(/^\/api\/employees\/(\d+)\/assignments$/);

  // GET /api/employees
  if (path === '/api/employees' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const tenantId = tenantCtx.tenant.id;
    const includeInactive = url.searchParams.get('includeInactive') === '1';
    const search = (url.searchParams.get('search') || '').trim();

    let query = `
      SELECT *
      FROM employees
      WHERE tenant_id = ?
    `;
    const params = [tenantId];

    if (!includeInactive) {
      query += ` AND is_active = 1`;
    }

    if (search) {
      query += `
        AND (
          full_name LIKE ?
          OR phone LIKE ?
          OR email LIKE ?
          OR role LIKE ?
        )
      `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY is_active DESC, full_name COLLATE NOCASE ASC, id DESC LIMIT 200`;

    const { results } = await env.DB.prepare(query).bind(...params).all();
    return { employees: results };
  }

  // GET /api/employees/:id
  if (idMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const id = idMatch[1];
    const tenantId = tenantCtx.tenant.id;
    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!employee) throw new Error('עובד לא נמצא');

    return { employee };
  }

  // GET /api/employees/:id/assignments
  if (assignmentsMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const id = assignmentsMatch[1];
    const tenantId = tenantCtx.tenant.id;

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!employee) throw new Error('עובד לא נמצא');

    const { results } = await env.DB.prepare(`
      SELECT
        lead_employees.*,
        leads.lead_num,
        leads.name AS customer_name,
        leads.event_type,
        leads.event_date,
        leads.event_time,
        leads.status AS lead_status,
        leads.venue,
        contacts.name AS contact_name,
        employees.full_name,
        employees.hourly_rate AS employee_hourly_rate
      FROM lead_employees
      INNER JOIN leads ON leads.id = lead_employees.lead_id AND leads.tenant_id = lead_employees.tenant_id
      INNER JOIN employees ON employees.id = lead_employees.employee_id AND employees.tenant_id = lead_employees.tenant_id
      LEFT JOIN contacts ON contacts.id = leads.contact_id AND contacts.tenant_id = leads.tenant_id
      WHERE lead_employees.employee_id = ?
        AND lead_employees.tenant_id = ?
      ORDER BY
        CASE WHEN leads.event_date IS NULL OR TRIM(leads.event_date) = '' THEN 1 ELSE 0 END,
        leads.event_date DESC,
        lead_employees.id DESC
    `).bind(id, tenantId).all();

    return { assignments: results };
  }

  // POST /api/employees
  if (path === '/api/employees' && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();
    const fullName = normalizeText(b.full_name);
    const phone = normalizeText(b.phone);

    if (!fullName) throw new Error('שם מלא חובה');
    if (!phone) throw new Error('טלפון חובה');

    const result = await env.DB.prepare(
      `INSERT INTO employees (
        full_name,
        phone,
        email,
        role,
        hourly_rate,
        birth_date,
        notes,
        is_active,
        emergency_contact_name,
        emergency_contact_phone,
        preferred_work_area,
        payment_method,
        bank_details_notes,
        internal_notes,
        tenant_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      fullName,
      phone,
      normalizeText(b.email),
      normalizeText(b.role || b.job_type),
      normalizeNumber(b.hourly_rate),
      normalizeText(b.birth_date),
      normalizeText(b.notes),
      normalizeActive(b.is_active),
      normalizeText(b.emergency_contact_name),
      normalizeText(b.emergency_contact_phone),
      normalizeText(b.preferred_work_area),
      normalizeText(b.payment_method),
      normalizeText(b.bank_details_notes),
      normalizeText(b.internal_notes),
      tenantId
    ).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();

    return { success: true, employee };
  }

  // PUT /api/employees/:id
  if (idMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];
    const b = await request.json();
    const fullName = normalizeText(b.full_name);
    const phone = normalizeText(b.phone);

    if (!fullName) throw new Error('שם מלא חובה');
    if (!phone) throw new Error('טלפון חובה');

    const existing = await env.DB.prepare(
      'SELECT id FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!existing) throw new Error('עובד לא נמצא');

    await env.DB.prepare(
      `UPDATE employees
       SET
         full_name = ?,
         phone = ?,
         email = ?,
         role = ?,
         hourly_rate = ?,
         birth_date = ?,
         notes = ?,
         is_active = ?,
         emergency_contact_name = ?,
         emergency_contact_phone = ?,
         preferred_work_area = ?,
         payment_method = ?,
         bank_details_notes = ?,
         internal_notes = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND tenant_id = ?`
    ).bind(
      fullName,
      phone,
      normalizeText(b.email),
      normalizeText(b.role || b.job_type),
      normalizeNumber(b.hourly_rate),
      normalizeText(b.birth_date),
      normalizeText(b.notes),
      normalizeActive(b.is_active),
      normalizeText(b.emergency_contact_name),
      normalizeText(b.emergency_contact_phone),
      normalizeText(b.preferred_work_area),
      normalizeText(b.payment_method),
      normalizeText(b.bank_details_notes),
      normalizeText(b.internal_notes),
      id,
      tenantId
    ).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    return { success: true, employee };
  }

  // DELETE /api/employees/:id (soft delete)
  if (idMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'employees');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const id = idMatch[1];

    const existing = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!existing) throw new Error('עובד לא נמצא');

    await env.DB.prepare(
      'UPDATE employees SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    return { success: true, employee };
  }

  throw new Error('Employees route not found');
}
