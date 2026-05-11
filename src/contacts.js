import { requireTenantContext } from './auth.js';

// ============================================================
// contacts.js - ניהול לקוחות קבועים וכרטיסי לקוח
// לקוח = ישות קבועה עם מספר לקוח
// אירוע = רשומה נפרדת בטבלת leads עם מספר אירוע
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

function normalizeTags(tags) {
  if (!tags) return null;
  if (Array.isArray(tags)) return JSON.stringify(tags);
  return tags;
}

async function getContactByIdForTenant(contactId, tenantId, env) {
  return env.DB.prepare('SELECT * FROM contacts WHERE id = ? AND tenant_id = ?').bind(contactId, tenantId).first();
}

export async function handleContacts(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/contacts
  if (path === '/api/contacts' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const tenantId = tenantCtx.tenant.id;
    const search = url.searchParams.get('search') || '';

    let query = `
      SELECT 
        contacts.*,
        COUNT(leads.id) AS events_count,
        SUM(CASE WHEN leads.status = 'closed' THEN 1 ELSE 0 END) AS closed_count,
        SUM(CASE WHEN leads.status = 'closed' THEN leads.price ELSE 0 END) AS revenue,
        MAX(leads.event_date) AS last_event_date,
        MIN(CASE WHEN leads.event_date >= date('now') THEN leads.event_date ELSE NULL END) AS next_event_date
      FROM contacts
      LEFT JOIN leads ON leads.contact_id = contacts.id AND leads.tenant_id = contacts.tenant_id
      WHERE contacts.tenant_id = ?
    `;

    const params = [tenantId];

    if (search) {
      query += `
        AND (
          contacts.name LIKE ?
          OR contacts.phone LIKE ?
          OR contacts.email LIKE ?
          OR contacts.tags LIKE ?
        )
      `;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += `
      GROUP BY contacts.id
      ORDER BY contacts.contact_num DESC, contacts.id DESC
      LIMIT 100
    `;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return { contacts: results };
  }

  const timelineMatch = path.match(/^\/api\/contacts\/(\d+)\/timeline$/);
  const contactNoteMatch = path.match(/^\/api\/contacts\/(\d+)\/notes$/);
  const idMatch = path.match(/^\/api\/contacts\/(\d+)$/);

  // GET /api/contacts/:id/timeline
  if (timelineMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const id = timelineMatch[1];
    const tenantId = tenantCtx.tenant.id;

    const contact = await getContactByIdForTenant(id, tenantId, env);

    if (!contact) throw new Error('לקוח לא נמצא');

    const { results: leads } = await env.DB.prepare(
      `SELECT id, contact_id, lead_num, name, status, event_type, event_date, created_at, updated_at
       FROM leads
       WHERE contact_id = ?
         AND tenant_id = ?`
    ).bind(id, tenantId).all();

    const { results: notes } = await env.DB.prepare(
      `SELECT lead_notes.id, lead_notes.lead_id, lead_notes.note, lead_notes.created_at, leads.name, leads.event_type, leads.lead_num
       FROM lead_notes
       LEFT JOIN leads ON lead_notes.lead_id = leads.id AND leads.tenant_id = lead_notes.tenant_id
       WHERE leads.contact_id = ?
         AND leads.tenant_id = ?
         AND lead_notes.tenant_id = ?`
    ).bind(id, tenantId, tenantId).all();

    const { results: contactNotes } = await env.DB.prepare(
      `SELECT id, contact_id, note, created_at
       FROM contact_notes
       WHERE contact_id = ?
         AND tenant_id = ?`
    ).bind(id, tenantId).all();

    const timeline = [];

    timeline.push({
      type: 'customer_created',
      created_at: contact.created_at,
      title: 'לקוח נוצר',
      text: 'הלקוח נוסף למערכת',
      contact_id: contact.id
    });

    if (contact.updated_at && contact.updated_at !== contact.created_at) {
      timeline.push({
        type: 'customer_updated',
        created_at: contact.updated_at,
        title: 'כרטיס לקוח עודכן',
        text: 'פרטי הלקוח עודכנו',
        contact_id: contact.id
      });
    }

    leads.forEach(function(lead) {
      timeline.push({
        type: 'lead_created',
        created_at: lead.created_at,
        title: 'ליד/אירוע נוצר',
        text: 'נוצר ליד #' + (lead.lead_num || lead.id) + (lead.event_type ? ' עבור ' + lead.event_type : ''),
        lead_id: lead.id,
        contact_id: contact.id
      });

      if (lead.updated_at && lead.updated_at !== lead.created_at) {
        timeline.push({
          type: 'lead_updated',
          created_at: lead.updated_at,
          title: 'ליד/אירוע עודכן',
          text: 'ליד #' + (lead.lead_num || lead.id) + (lead.status ? ' עודכן לסטטוס ' + lead.status : ' עודכן'),
          lead_id: lead.id,
          contact_id: contact.id
        });
      }
    });

    notes.forEach(function(note) {
      timeline.push({
        type: 'note_added',
        created_at: note.created_at,
        title: 'נוספה הערה',
        text: note.note,
        lead_id: note.lead_id,
        contact_id: contact.id
      });
    });

    contactNotes.forEach(function(note) {
      timeline.push({
        type: 'contact_note_added',
        created_at: note.created_at,
        title: 'נוספה הערת לקוח',
        text: note.note,
        contact_id: contact.id
      });
    });

    timeline.sort(function(a, b) {
      return String(b.created_at || '').localeCompare(String(a.created_at || ''));
    });

    return {
      contact_id: contact.id,
      timeline
    };
  }

  // POST /api/contacts/:id/notes
  if (contactNoteMatch && method === 'POST') {
    const id = contactNoteMatch[1];
    const b = await request.json();
    const note = (b.note || '').trim();

    const contact = await env.DB.prepare(
      'SELECT id FROM contacts WHERE id = ?'
    ).bind(id).first();

    if (!contact) throw new Error('לקוח לא נמצא');
    if (!note) throw new Error('הערה חובה');

    const result = await env.DB.prepare(
      'INSERT INTO contact_notes (contact_id, note, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).bind(id, note).run();

    const created = await env.DB.prepare(
      'SELECT * FROM contact_notes WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return { success: true, note: created };
  }

  // GET /api/contacts/:id
  if (idMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const id = idMatch[1];
    const tenantId = tenantCtx.tenant.id;

    const contact = await getContactByIdForTenant(id, tenantId, env);

    if (!contact) throw new Error('לקוח לא נמצא');

    const { results: leads } = await env.DB.prepare(
      `SELECT *
       FROM leads
       WHERE contact_id = ?
         AND tenant_id = ?
       ORDER BY 
         CASE WHEN event_date IS NOT NULL THEN event_date ELSE created_at END DESC`
    ).bind(id, tenantId).all();

    const stats = await env.DB.prepare(
      `SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed,
        SUM(CASE WHEN status = 'closed' THEN price ELSE 0 END) AS revenue,
        MAX(event_date) AS last_event_date,
        MIN(CASE WHEN event_date >= date('now') THEN event_date ELSE NULL END) AS next_event_date
       FROM leads
       WHERE contact_id = ?
         AND tenant_id = ?`
    ).bind(id, tenantId).first();

    return {
      contact,
      leads,
      stats: {
        total: stats.total || 0,
        closed: stats.closed || 0,
        revenue: stats.revenue || 0,
        last_event_date: stats.last_event_date || null,
        next_event_date: stats.next_event_date || null
      }
    };
  }

  // POST /api/contacts
  if (path === '/api/contacts' && method === 'POST') {
    const b = await request.json();

    if (!b.name) throw new Error('שם לקוח חובה');

    if (b.phone) {
      const existing = await env.DB.prepare(
        'SELECT * FROM contacts WHERE phone = ?'
      ).bind(b.phone).first();

      if (existing) {
        return { existing: true, contact: existing };
      }
    }

    if (b.email) {
      const existing = await env.DB.prepare(
        'SELECT * FROM contacts WHERE email = ?'
      ).bind(b.email).first();

      if (existing) {
        return { existing: true, contact: existing };
      }
    }

    const contactNum = await getNextCounter('contacts', env);

    const result = await env.DB.prepare(
      `INSERT INTO contacts 
        (
          contact_num,
          name,
          phone,
          email,
          notes,
          customer_type,
          status,
          tags,
          last_contact_date,
          next_contact_date,
          general_notes,
          extra_contacts,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      contactNum,
      b.name,
      b.phone || null,
      b.email || null,
      b.notes || null,
      b.customer_type || 'פרטי',
      b.status || 'פעיל',
      normalizeTags(b.tags),
      b.last_contact_date || null,
      b.next_contact_date || null,
      b.general_notes || null,
      b.extra_contacts || null
    ).run();

    const contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return {
      success: true,
      id: result.meta.last_row_id,
      contact
    };
  }

  // PUT /api/contacts/:id
  if (idMatch && method === 'PUT') {
    const id = idMatch[1];
    const b = await request.json();

    if (!b.name) throw new Error('שם לקוח חובה');

    await env.DB.prepare(
      `UPDATE contacts 
       SET 
         name = ?,
         phone = ?,
         email = ?,
         notes = ?,
         customer_type = ?,
         status = ?,
         tags = ?,
         last_contact_date = ?,
         next_contact_date = ?,
         general_notes = ?,
         extra_contacts = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      b.name,
      b.phone || null,
      b.email || null,
      b.notes || null,
      b.customer_type || 'פרטי',
      b.status || 'פעיל',
      normalizeTags(b.tags),
      b.last_contact_date || null,
      b.next_contact_date || null,
      b.general_notes || null,
      b.extra_contacts || null,
      id
    ).run();

    const contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ?'
    ).bind(id).first();

    return { success: true, contact };
  }

  throw new Error('Contacts route not found');
}

// ============================================================
// פונקציה פנימית: מוצאת או יוצרת לקוח ומחזירה contact_id
// חשוב: לא משנה לקוח קיים אוטומטית בזמן יצירת אירוע
// ============================================================

export async function findOrCreateContact(name, phone, email, env) {
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
        (
          contact_num,
          name,
          phone,
          email,
          customer_type,
          status,
          tags,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    ).bind(
      contactNum,
      name || 'לקוח ללא שם',
      phone || null,
      email || null,
      'פרטי',
      'פעיל',
      null
    ).run();

    contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ?'
    ).bind(result.meta.last_row_id).first();
  }

  return contact;
}

// תאימות אחורה לקוד ישן אם משהו עדיין קורא לפונקציה הזאת
export async function linkLeadToContact(leadId, name, phone, email, env) {
  const contact = await findOrCreateContact(name, phone, email, env);

  await env.DB.prepare(
    'UPDATE leads SET contact_id = ? WHERE id = ?'
  ).bind(contact.id, leadId).run();

  return contact;
}