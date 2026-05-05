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

async function getEmployeeById(employeeId, env) {
  return env.DB.prepare('SELECT * FROM employees WHERE id = ?').bind(employeeId).first();
}

export async function handleLeads(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);
  const assignmentIdMatch = path.match(/^\/api\/lead-employees\/(\d+)$/);
  const leadEmployeesMatch = path.match(/^\/api\/leads\/(\d+)\/employees$/);

  if (leadEmployeesMatch && method === 'GET') {
    const leadId = leadEmployeesMatch[1];
    const lead = await getLeadById(leadId, env);

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
      INNER JOIN employees ON employees.id = lead_employees.employee_id
      WHERE lead_employees.lead_id = ?
      ORDER BY lead_employees.created_at DESC, lead_employees.id DESC
    `).bind(leadId).all();

    return { assignments: results };
  }

  if (leadEmployeesMatch && method === 'POST') {
    const leadId = leadEmployeesMatch[1];
    const lead = await getLeadById(leadId, env);

    if (!lead) throw new Error('Lead not found');

    const b = await request.json();
    const employeeId = Number(b.employee_id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) throw new Error('employee_id חובה');

    const employee = await getEmployeeById(employeeId, env);
    if (!employee) throw new Error('עובד לא נמצא');
    if (Number(employee.is_active) === 0) throw new Error('לא ניתן לשייך עובד לא פעיל');

    const existingAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE lead_id = ? AND employee_id = ?'
    ).bind(leadId, employeeId).first();

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
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      leadId,
      employeeId,
      normalizeAssignmentText(b.role_on_event),
      normalizeAssignmentNumber(b.hourly_rate_override),
      normalizeAssignmentNumber(b.hours_planned),
      normalizeAssignmentNumber(b.hours_actual),
      normalizeAssignmentText(b.payment_status) || 'pending',
      normalizeAssignmentText(b.notes)
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
      INNER JOIN employees ON employees.id = lead_employees.employee_id
      WHERE lead_employees.id = ?
    `).bind(result.meta.last_row_id).first();

    return { success: true, assignment };
  }

  if (assignmentIdMatch && method === 'PUT') {
    const assignmentId = assignmentIdMatch[1];
    const b = await request.json();

    const existingAssignment = await env.DB.prepare(
      'SELECT * FROM lead_employees WHERE id = ?'
    ).bind(assignmentId).first();

    if (!existingAssignment) throw new Error('שיוך עובד לא נמצא');

    const employeeId = b.employee_id !== undefined ? Number(b.employee_id) : Number(existingAssignment.employee_id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) throw new Error('employee_id חובה');

    const employee = await getEmployeeById(employeeId, env);
    if (!employee) throw new Error('עובד לא נמצא');
    if (Number(employee.is_active) === 0) throw new Error('לא ניתן לשייך עובד לא פעיל');

    const lead = await getLeadById(existingAssignment.lead_id, env);
    if (!lead) throw new Error('Lead not found');

    const duplicateAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE lead_id = ? AND employee_id = ? AND id != ?'
    ).bind(existingAssignment.lead_id, employeeId, assignmentId).first();

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
    `).bind(
      employeeId,
      normalizeAssignmentText(b.role_on_event),
      normalizeAssignmentNumber(b.hourly_rate_override),
      normalizeAssignmentNumber(b.hours_planned),
      normalizeAssignmentNumber(b.hours_actual),
      normalizeAssignmentText(b.payment_status) || 'pending',
      normalizeAssignmentText(b.notes),
      assignmentId
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
      INNER JOIN employees ON employees.id = lead_employees.employee_id
      WHERE lead_employees.id = ?
    `).bind(assignmentId).first();

    return { success: true, assignment };
  }

  if (assignmentIdMatch && method === 'DELETE') {
    const assignmentId = assignmentIdMatch[1];

    const existingAssignment = await env.DB.prepare(
      'SELECT id FROM lead_employees WHERE id = ?'
    ).bind(assignmentId).first();

    if (!existingAssignment) throw new Error('שיוך עובד לא נמצא');

    await env.DB.prepare(
      'DELETE FROM lead_employees WHERE id = ?'
    ).bind(assignmentId).run();

    return { success: true };
  }

  // ===============================
  // GET ALL
  // ===============================
  if (path === '/api/leads' && method === 'GET') {
    const { results } = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id
      ORDER BY leads.created_at DESC
      LIMIT 200
    `).all();

    return { leads: results };
  }

  const idMatch = path.match(/^\/api\/leads\/(\d+)$/);

  // ===============================
  // GET SINGLE
  // ===============================
  if (idMatch && method === 'GET') {
    const id = idMatch[1];

    const lead = await env.DB.prepare(`
      SELECT
        leads.*,
        contacts.contact_num,
        contacts.name AS contact_name
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id
      WHERE leads.id = ?
    `).bind(id).first();

    const { results: notes } = await env.DB.prepare(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC'
    ).bind(id).all();

    return { lead, notes };
  }

  const noteMatch = path.match(/^\/api\/leads\/(\d+)\/notes$/);

  // ===============================
  // CREATE NOTE
  // ===============================
  if (noteMatch && method === 'POST') {
    const leadId = noteMatch[1];
    const b = await request.json();
    const note = (b.note || '').trim();

    if (!note) throw new Error('הערה חובה');

    const existingLead = await env.DB.prepare(
      'SELECT id FROM leads WHERE id = ?'
    ).bind(leadId).first();

    if (!existingLead) throw new Error('Lead not found');

    const result = await env.DB.prepare(
      'INSERT INTO lead_notes (lead_id, note, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).bind(leadId, note).run();

    const created = await env.DB.prepare(
      'SELECT * FROM lead_notes WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return { success: true, note: created };
  }

  // ===============================
  // CREATE EVENT
  // ===============================
  if (path === '/api/leads' && method === 'POST') {
    const b = await request.json();

    if (!b.name) throw new Error('שם חובה');

    // 🔥 קודם מזהים/יוצרים לקוח
    const contact = await findOrCreateContact(
      b.name,
      b.phone,
      b.email,
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
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      b.notes || null
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
    const id = idMatch[1];
    const b = await request.json();

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
      id
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
    await env.DB.prepare(
      'DELETE FROM lead_notes WHERE lead_id = ?'
    ).bind(idMatch[1]).run();

    await env.DB.prepare(
      'DELETE FROM leads WHERE id = ?'
    ).bind(idMatch[1]).run();

    return { success: true };
  }

  throw new Error('Leads route not found');
}

export async function handleDashboard(request, env, path) {
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
    env.DB.prepare('SELECT COUNT(*) AS c FROM leads').first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c, SUM(price) AS rev FROM leads WHERE status = 'closed'"
    ).first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c FROM leads WHERE status = 'quote'"
    ).first(),

    env.DB.prepare(
      "SELECT COUNT(*) AS c FROM leads WHERE status = 'lead'"
    ).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(prevStart, prevEnd).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(currStart, currEnd).first(),

    env.DB.prepare(
      "SELECT SUM(price) AS rev FROM leads WHERE status = 'closed' AND event_date >= ? AND event_date <= ?"
    ).bind(nextStart, nextEnd).first()
  ]);

  const today = now.toISOString().split('T')[0];

  const { results: followUps } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id
     WHERE leads.next_contact <= ?
       AND leads.status NOT IN ('closed', 'cancelled')
     ORDER BY leads.next_contact ASC
     LIMIT 5`
  ).bind(today).all();

  const { results: upcoming } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id
     WHERE leads.event_date >= ?
       AND leads.status = 'closed'
     ORDER BY leads.event_date ASC
     LIMIT 5`
  ).bind(today).all();

  const { results: recentLeads } = await env.DB.prepare(
    `SELECT
      leads.*,
      contacts.contact_num AS contact_num,
      contacts.name AS contact_name
     FROM leads
     LEFT JOIN contacts ON leads.contact_id = contacts.id
     ORDER BY leads.created_at DESC
     LIMIT 5`
  ).all();

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
     LEFT JOIN contacts ON leads.contact_id = contacts.id
     WHERE leads.event_date IS NOT NULL
        OR leads.next_contact IS NOT NULL`
  ).all();

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