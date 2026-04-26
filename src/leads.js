// ============================================================
// leads.js - ניהול לידים / אירועים עם קישור ללקוחות
// ============================================================

async function getNextCounter(name, env) {
  const row = await env.DB.prepare(
    'SELECT value FROM counters WHERE name = ?'
  ).bind(name).first();

  if (!row) {
    await env.DB.prepare(
      'INSERT INTO counters (name, value) VALUES (?, ?)'
    ).bind(name, 1).run();

    return 1;
  }

  const nextValue = Number(row.value || 0) + 1;

  await env.DB.prepare(
    'UPDATE counters SET value = ? WHERE name = ?'
  ).bind(nextValue, name).run();

  return nextValue;
}

async function linkToContact(leadId, name, phone, email, env) {
  try {
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

    if (!contact && name) {
      contact = await env.DB.prepare(
        'SELECT * FROM contacts WHERE name = ?'
      ).bind(name).first();
    }

    if (!contact) {
      const contactNum = await getNextCounter('contacts', env);

      const r = await env.DB.prepare(
        `INSERT INTO contacts 
          (name, phone, email, contact_num, created_at, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      ).bind(
        name || 'לקוח ללא שם',
        phone || null,
        email || null,
        contactNum
      ).run();

      const contactId = r.meta.last_row_id;

      await env.DB.prepare(
        'UPDATE leads SET contact_id = ? WHERE id = ?'
      ).bind(contactId, leadId).run();

      return contactId;
    }

    await env.DB.prepare(
      `UPDATE contacts
       SET 
         name = COALESCE(?, name),
         phone = COALESCE(?, phone),
         email = COALESCE(?, email),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      name || null,
      phone || null,
      email || null,
      contact.id
    ).run();

    await env.DB.prepare(
      'UPDATE leads SET contact_id = ? WHERE id = ?'
    ).bind(contact.id, leadId).run();

    return contact.id;

  } catch (e) {
    console.log('linkToContact:', e.message);
    return null;
  }
}

export async function handleLeads(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);

  if (path === '/api/leads' && method === 'GET') {
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    let query = `
      SELECT 
        leads.*,
        contacts.name AS contact_name,
        contacts.phone AS contact_phone,
        contacts.email AS contact_email,
        contacts.contact_num AS contact_num
      FROM leads
      LEFT JOIN contacts ON leads.contact_id = contacts.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += `
        AND (
          leads.name LIKE ? 
          OR leads.phone LIKE ? 
          OR leads.venue LIKE ?
          OR contacts.name LIKE ?
          OR contacts.phone LIKE ?
          OR contacts.email LIKE ?
        )
      `;
      params.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    if (status) {
      query += ' AND leads.status = ?';
      params.push(status);
    }

    query += `
      ORDER BY 
        CASE 
          WHEN leads.next_contact IS NOT NULL THEN leads.next_contact 
          ELSE leads.event_date 
        END ASC,
        leads.created_at DESC
      LIMIT 200
    `;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return { leads: results };
  }

  const idMatch = path.match(/^\/api\/leads\/(\d+)$/);

  if (idMatch && method === 'GET') {
    const id = idMatch[1];

    const lead = await env.DB.prepare(
      `SELECT 
        leads.*,
        contacts.name AS contact_name,
        contacts.phone AS contact_phone,
        contacts.email AS contact_email,
        contacts.contact_num AS contact_num
       FROM leads
       LEFT JOIN contacts ON leads.contact_id = contacts.id
       WHERE leads.id = ?`
    ).bind(id).first();

    if (!lead) throw new Error('ליד לא נמצא');

    const { results: notes } = await env.DB.prepare(
      'SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC'
    ).bind(id).all();

    return { lead, notes };
  }

  if (path === '/api/leads' && method === 'POST') {
    const b = await request.json();

    if (!b.name) throw new Error('שם לקוח חובה');

    const leadNum = await getNextCounter('leads', env);

    const result = await env.DB.prepare(
      `INSERT INTO leads (
        lead_num,
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
        deposit_date,
        balance_paid,
        status,
        last_contact,
        next_contact,
        details,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      leadNum,
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
      b.deposit_date || null,
      b.balance_paid ? 1 : 0,
      b.status || 'lead',
      b.last_contact || null,
      b.next_contact || null,
      b.details || null,
      b.notes || null
    ).run();

    const newId = result.meta.last_row_id;

    await linkToContact(newId, b.name, b.phone, b.email, env);

    return { success: true, id: newId, lead_num: leadNum };
  }

  if (idMatch && method === 'PUT') {
    const id = idMatch[1];
    const b = await request.json();

    await env.DB.prepare(
      `UPDATE leads SET
        name = ?,
        phone = ?,
        email = ?,
        event_type = ?,
        event_date = ?,
        event_time = ?,
        venue = ?,
        attractions = ?,
        price = ?,
        deposit = ?,
        deposit_date = ?,
        balance_paid = ?,
        status = ?,
        last_contact = ?,
        next_contact = ?,
        details = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    ).bind(
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
      b.deposit_date || null,
      b.balance_paid ? 1 : 0,
      b.status || 'lead',
      b.last_contact || null,
      b.next_contact || null,
      b.details || null,
      b.notes || null,
      id
    ).run();

    await linkToContact(id, b.name, b.phone, b.email, env);

    return { success: true };
  }

  if (idMatch && method === 'DELETE') {
    await env.DB.prepare(
      'DELETE FROM lead_notes WHERE lead_id = ?'
    ).bind(idMatch[1]).run();

    await env.DB.prepare(
      'DELETE FROM leads WHERE id = ?'
    ).bind(idMatch[1]).run();

    return { success: true };
  }

  const noteMatch = path.match(/^\/api\/leads\/(\d+)\/notes$/);

  if (noteMatch && method === 'POST') {
    const { note } = await request.json();

    if (!note) throw new Error('הערה ריקה');

    await env.DB.prepare(
      'INSERT INTO lead_notes (lead_id, note) VALUES (?, ?)'
    ).bind(noteMatch[1], note).run();

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

// פונקציה לסנכרון אוטומטי כאשר סטטוס משתנה ל-closed
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