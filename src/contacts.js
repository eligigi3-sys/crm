import { requireTenantContext, assertTenantModuleEnabled, assertTenantRole } from './auth.js';

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

async function getContactByPhoneForTenant(phone, tenantId, env) {
  if (!phone) return null;
  return env.DB.prepare('SELECT * FROM contacts WHERE phone = ? AND tenant_id = ?').bind(phone, tenantId).first();
}

async function getContactByEmailForTenant(email, tenantId, env) {
  if (!email) return null;
  return env.DB.prepare('SELECT * FROM contacts WHERE email = ? AND tenant_id = ?').bind(email, tenantId).first();
}


const CUSTOMER_FINANCIAL_STATUSES = ['draft', 'sent', 'issued', 'paid', 'partially_paid', 'cancelled', 'void'];
const CUSTOMER_REVENUE_STATUSES = ['issued', 'paid', 'partially_paid'];
const CUSTOMER_OPEN_BALANCE_STATUSES = ['sent', 'issued', 'partially_paid'];

function moneyNumber(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function emptyCustomerStatusBreakdown() {
  return CUSTOMER_FINANCIAL_STATUSES.reduce(function(acc, status) {
    acc[status] = 0;
    return acc;
  }, {});
}

function documentContactWhereSql(alias) {
  const docAlias = alias || 'sd';
  return `
    ${docAlias}.tenant_id = ?
    AND (
      ${docAlias}.contact_id = ?
      OR (
        ${docAlias}.lead_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM leads linked_lead
          WHERE linked_lead.id = ${docAlias}.lead_id
            AND linked_lead.tenant_id = ${docAlias}.tenant_id
            AND linked_lead.contact_id = ?
        )
      )
    )
  `;
}

function mapRecentSalesDocument(row) {
  return {
    id: row.id,
    document_type: row.document_type,
    document_number: row.document_number || null,
    status: row.status,
    issue_date: row.issue_date || null,
    due_date: row.due_date || null,
    total_amount: moneyNumber(row.total_amount),
    paid_amount: moneyNumber(row.paid_amount),
    balance_amount: moneyNumber(row.balance_amount),
    currency: row.currency || 'ILS',
    lead_id: row.lead_id || null,
    lead_name: row.lead_name || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
  };
}

function mapRecentCustomerEvent(row) {
  return {
    id: row.id,
    lead_num: row.lead_num || null,
    name: row.name || null,
    status: row.status || null,
    event_type: row.event_type || null,
    event_date: row.event_date || null,
    event_time: row.event_time || null,
    venue: row.venue || null,
    price: moneyNumber(row.price),
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
  };
}

async function buildContactFinancialSummary(contactId, tenantId, env) {
  const contact = await getContactByIdForTenant(contactId, tenantId, env);
  if (!contact) throw new Error('לקוח לא נמצא');

  const whereSql = documentContactWhereSql('sd');
  const baseParams = [tenantId, contactId, contactId];

  const invoiceTotals = await env.DB.prepare(
    `SELECT
       COUNT(CASE WHEN sd.document_type = 'invoice' THEN 1 END) AS invoice_count,
       COUNT(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('issued', 'paid', 'partially_paid') THEN 1 END) AS recognized_invoice_count,
       COALESCE(SUM(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('issued', 'paid', 'partially_paid') THEN sd.total_amount ELSE 0 END), 0) AS total_revenue,
       COALESCE(SUM(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('sent', 'issued', 'partially_paid') THEN sd.balance_amount ELSE 0 END), 0) AS open_balance,
       COALESCE(SUM(CASE WHEN sd.document_type = 'invoice' AND sd.status IN ('sent', 'issued', 'partially_paid') AND sd.due_date IS NOT NULL AND sd.due_date < date('now') THEN sd.balance_amount ELSE 0 END), 0) AS overdue_balance
     FROM sales_documents sd
     WHERE ${whereSql}`
  ).bind(...baseParams).first();

  const { results: statusRows } = await env.DB.prepare(
    `SELECT sd.status, COUNT(*) AS count
     FROM sales_documents sd
     WHERE ${whereSql}
       AND sd.document_type = 'invoice'
     GROUP BY sd.status`
  ).bind(...baseParams).all();

  const invoiceStatusBreakdown = emptyCustomerStatusBreakdown();
  (statusRows || []).forEach(function(row) {
    if (Object.prototype.hasOwnProperty.call(invoiceStatusBreakdown, row.status)) {
      invoiceStatusBreakdown[row.status] = Number(row.count || 0);
    }
  });

  const eventStats = await env.DB.prepare(
    `SELECT
       COUNT(*) AS total_events,
       COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_events,
       COALESCE(SUM(CASE WHEN status = 'closed' THEN price ELSE 0 END), 0) AS closed_event_value,
       MAX(event_date) AS last_event_date,
       MIN(CASE WHEN event_date >= date('now') THEN event_date ELSE NULL END) AS next_event_date
     FROM leads
     WHERE tenant_id = ?
       AND contact_id = ?`
  ).bind(tenantId, contactId).first();

  const { results: recentDocumentsRows } = await env.DB.prepare(
    `SELECT
       sd.id,
       sd.document_type,
       sd.document_number,
       sd.status,
       sd.issue_date,
       sd.due_date,
       sd.total_amount,
       sd.paid_amount,
       sd.balance_amount,
       sd.currency,
       sd.lead_id,
       sd.created_at,
       sd.updated_at,
       leads.name AS lead_name
     FROM sales_documents sd
     LEFT JOIN leads ON leads.id = sd.lead_id AND leads.tenant_id = sd.tenant_id
     WHERE ${whereSql}
     ORDER BY COALESCE(sd.issue_date, sd.created_at) DESC, sd.id DESC
     LIMIT 6`
  ).bind(...baseParams).all();

  const { results: recentEventRows } = await env.DB.prepare(
    `SELECT id, lead_num, name, status, event_type, event_date, event_time, venue, price, created_at, updated_at
     FROM leads
     WHERE tenant_id = ?
       AND contact_id = ?
     ORDER BY COALESCE(event_date, created_at) DESC, id DESC
     LIMIT 6`
  ).bind(tenantId, contactId).all();

  const billingProfile = await env.DB.prepare(
    `SELECT credit_status, credit_notes, credit_limit
     FROM customer_billing_profiles
     WHERE tenant_id = ?
       AND contact_id = ?
     LIMIT 1`
  ).bind(tenantId, contactId).first();

  const invoiceCount = Number(invoiceTotals && invoiceTotals.invoice_count || 0);
  const recognizedInvoiceCount = Number(invoiceTotals && invoiceTotals.recognized_invoice_count || 0);
  const totalRevenue = moneyNumber(invoiceTotals && invoiceTotals.total_revenue);

  return {
    contact_id: Number(contactId),
    computed_from: 'existing_contacts_leads_sales_documents',
    read_only: true,
    summary: {
      total_revenue: totalRevenue,
      invoice_count: invoiceCount,
      recognized_invoice_count: recognizedInvoiceCount,
      open_balance: moneyNumber(invoiceTotals && invoiceTotals.open_balance),
      overdue_balance: moneyNumber(invoiceTotals && invoiceTotals.overdue_balance),
      total_events: Number(eventStats && eventStats.total_events || 0),
      closed_events: Number(eventStats && eventStats.closed_events || 0),
      closed_event_value: moneyNumber(eventStats && eventStats.closed_event_value),
      average_invoice_value: recognizedInvoiceCount ? moneyNumber(totalRevenue / recognizedInvoiceCount) : 0,
      last_event_date: eventStats && eventStats.last_event_date || null,
      next_event_date: eventStats && eventStats.next_event_date || null
    },
    invoice_status_breakdown: invoiceStatusBreakdown,
    recent_sales_documents: (recentDocumentsRows || []).map(mapRecentSalesDocument),
    recent_events: (recentEventRows || []).map(mapRecentCustomerEvent),
    credit: {
      status: billingProfile && billingProfile.credit_status ? billingProfile.credit_status : 'normal',
      notes: billingProfile && billingProfile.credit_notes ? billingProfile.credit_notes : null,
      limit: moneyNumber(billingProfile && billingProfile.credit_limit)
    },
    coverage: {
      safe_scope: 'Tenant-scoped documents linked directly by contact_id, plus documents linked by lead_id to this contact.',
      limitations: [
        'No invoice-event link table yet, so consolidated/partial job billing is not inferred.',
        'Sales documents without contact_id or a lead_id tied to this contact are not counted.',
        'Payment allocation is invoice-level only; no accounting ledger is calculated.'
      ],
      unknown_counts: {
        unlinked_sales_documents: null,
        externally_billed_events: null,
        partially_billed_events: null
      }
    }
  };
}

export async function handleContacts(request, env, path) {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/contacts
  if (path === '/api/contacts' && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

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
  const financialSummaryMatch = path.match(/^\/api\/contacts\/(\d+)\/financial-summary$/);
  const contactNoteMatch = path.match(/^\/api\/contacts\/(\d+)\/notes$/);
  const idMatch = path.match(/^\/api\/contacts\/(\d+)$/);

  // GET /api/contacts/:id/timeline
  if (timelineMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

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


  // GET /api/contacts/:id/financial-summary
  if (financialSummaryMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

    const id = Number(financialSummaryMatch[1]);
    const tenantId = tenantCtx.tenant.id;

    return buildContactFinancialSummary(id, tenantId, env);
  }

  // POST /api/contacts/:id/notes
  if (contactNoteMatch && method === 'POST') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const id = contactNoteMatch[1];
    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();
    const note = (b.note || '').trim();

    const contact = await env.DB.prepare(
      'SELECT id FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!contact) throw new Error('לקוח לא נמצא');
    if (!note) throw new Error('הערה חובה');

    const result = await env.DB.prepare(
      'INSERT INTO contact_notes (contact_id, note, tenant_id, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(id, note, tenantId).run();

    const created = await env.DB.prepare(
      'SELECT * FROM contact_notes WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();

    return { success: true, note: created };
  }

  // GET /api/contacts/:id
  if (idMatch && method === 'GET') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

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
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();

    if (!b.name) throw new Error('שם לקוח חובה');

    if (b.phone) {
      const existing = await getContactByPhoneForTenant(b.phone, tenantId, env);
      if (existing) {
        return { existing: true, contact: existing };
      }
    }

    if (b.email) {
      const existing = await getContactByEmailForTenant(b.email, tenantId, env);
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
          tenant_id,
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
      b.extra_contacts || null,
      tenantId
    ).run();

    const contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(result.meta.last_row_id, tenantId).first();

    return {
      success: true,
      id: result.meta.last_row_id,
      contact
    };
  }

  // PUT /api/contacts/:id
  if (idMatch && method === 'PUT') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin', 'manager']);
    if (roleState instanceof Response) return roleState;

    const id = idMatch[1];
    const tenantId = tenantCtx.tenant.id;
    const b = await request.json();

    if (!b.name) throw new Error('שם לקוח חובה');

    const existing = await env.DB.prepare(
      'SELECT id FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    if (!existing) throw new Error('לקוח לא נמצא');

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
       WHERE id = ?
         AND tenant_id = ?`
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
      id,
      tenantId
    ).run();

    const contact = await env.DB.prepare(
      'SELECT * FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();

    return { success: true, contact };
  }

  // DELETE /api/contacts/:id
  if (idMatch && method === 'DELETE') {
    const tenantCtx = await requireTenantContext(request, env);
    if (tenantCtx instanceof Response) return tenantCtx;

    const moduleState = await assertTenantModuleEnabled(tenantCtx, env, 'contacts');
    if (moduleState instanceof Response) return moduleState;

    const roleState = await assertTenantRole(tenantCtx, ['owner', 'admin']);
    if (roleState instanceof Response) return roleState;

    const id = Number(idMatch[1]);
    const tenantId = tenantCtx.tenant.id;

    const existing = await env.DB.prepare(
      'SELECT id FROM contacts WHERE id = ? AND tenant_id = ?'
    ).bind(id, tenantId).first();
    if (!existing) throw new Error('לקוח לא נמצא');

    const lockedDoc = await env.DB.prepare(
      "SELECT id FROM sales_documents WHERE tenant_id = ? AND (contact_id = ? OR lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)) AND (status IN ('issued','paid','partially_paid','void') OR locked_at IS NOT NULL OR issued_at IS NOT NULL) LIMIT 1"
    ).bind(tenantId, id, tenantId, id).first();
    if (lockedDoc) throw new Error('לא ניתן למחוק לקוח עם מסמך מכירה שהופק או ננעל');

    await env.DB.batch([
      env.DB.prepare("DELETE FROM sales_document_items WHERE tenant_id = ? AND document_id IN (SELECT id FROM sales_documents WHERE tenant_id = ? AND (contact_id = ? OR lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)) AND locked_at IS NULL AND issued_at IS NULL AND status NOT IN ('issued','paid','partially_paid','void'))").bind(tenantId, tenantId, id, tenantId, id),
      env.DB.prepare("DELETE FROM sales_documents WHERE tenant_id = ? AND (contact_id = ? OR lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)) AND locked_at IS NULL AND issued_at IS NULL AND status NOT IN ('issued','paid','partially_paid','void')").bind(tenantId, id, tenantId, id),
      env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM strategic_contact_attributions WHERE tenant_id = ? AND (lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?) OR event_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?))').bind(tenantId, tenantId, id, tenantId, id),
      env.DB.prepare('DELETE FROM product_stock_movements WHERE tenant_id = ? AND event_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)').bind(tenantId, tenantId, id),
      env.DB.prepare('DELETE FROM event_inventory_actions WHERE tenant_id = ? AND event_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)').bind(tenantId, tenantId, id),
      env.DB.prepare('DELETE FROM event_product_allocations WHERE tenant_id = ? AND event_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)').bind(tenantId, tenantId, id),
      env.DB.prepare('DELETE FROM lead_employees WHERE tenant_id = ? AND lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)').bind(tenantId, tenantId, id),
      env.DB.prepare('DELETE FROM lead_notes WHERE tenant_id = ? AND lead_id IN (SELECT id FROM leads WHERE tenant_id = ? AND contact_id = ?)').bind(tenantId, tenantId, id),
      env.DB.prepare('DELETE FROM leads WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('UPDATE strategic_contacts SET linked_contact_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE tenant_id = ? AND linked_contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM customer_contact_people WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM customer_addresses WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM customer_billing_profiles WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM contact_notes WHERE tenant_id = ? AND contact_id = ?').bind(tenantId, id),
      env.DB.prepare('DELETE FROM contacts WHERE id = ? AND tenant_id = ?').bind(id, tenantId)
    ]);

    return { success: true };
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