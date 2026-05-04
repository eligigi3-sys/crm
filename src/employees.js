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

export async function handleEmployees(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const idMatch = path.match(/^\/api\/employees\/(\d+)$/);

  // GET /api/employees
  if (path === '/api/employees' && method === 'GET') {
    const includeInactive = url.searchParams.get('includeInactive') === '1';
    const search = (url.searchParams.get('search') || '').trim();

    let query = `
      SELECT *
      FROM employees
      WHERE 1=1
    `;
    const params = [];

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
    const id = idMatch[1];
    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).bind(id).first();

    if (!employee) throw new Error('עובד לא נמצא');

    return { employee };
  }

  // POST /api/employees
  if (path === '/api/employees' && method === 'POST') {
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
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
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
      normalizeText(b.internal_notes)
    ).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return { success: true, employee };
  }

  // PUT /api/employees/:id
  if (idMatch && method === 'PUT') {
    const id = idMatch[1];
    const b = await request.json();
    const fullName = normalizeText(b.full_name);
    const phone = normalizeText(b.phone);

    if (!fullName) throw new Error('שם מלא חובה');
    if (!phone) throw new Error('טלפון חובה');

    const existing = await env.DB.prepare(
      'SELECT id FROM employees WHERE id = ?'
    ).bind(id).first();

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
       WHERE id = ?`
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
      id
    ).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).bind(id).first();

    return { success: true, employee };
  }

  // DELETE /api/employees/:id (soft delete)
  if (idMatch && method === 'DELETE') {
    const id = idMatch[1];

    const existing = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).bind(id).first();

    if (!existing) throw new Error('עובד לא נמצא');

    await env.DB.prepare(
      'UPDATE employees SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run();

    const employee = await env.DB.prepare(
      'SELECT * FROM employees WHERE id = ?'
    ).bind(id).first();

    return { success: true, employee };
  }

  throw new Error('Employees route not found');
}
