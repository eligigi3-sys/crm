const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-customer-screen.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id) {');
const end = s.indexOf('function closeCustomerModal()', start);

if (start < 0 || end < 0) {
  throw new Error('Could not find openCustomerCard block');
}

const block = `
function openCustomerCard(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });

  var page = document.getElementById('page-customers');
  var nav = document.getElementById('nav-leads');
  if (page) page.classList.add('active');
  if (nav) nav.classList.add('active');

  var grid = document.getElementById('customers-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="dash-empty">טוען כרטיס לקוח...</div>';

  apiCall('GET', '/api/contacts/' + id).then(function(data) {
    var c = data.contact || {};
    var leads = data.leads || [];
    var stats = data.stats || {};
    var tags = [];

    try {
      tags = c.tags ? JSON.parse(c.tags) : [];
      if (!Array.isArray(tags)) tags = [];
    } catch(e) {
      tags = [];
    }

    var cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
    var waPhone = cleanPhone;
    if (waPhone.charAt(0) === '0') waPhone = '972' + waPhone.substring(1);

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-customers">← חזרה ללקוחות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+ הוסף אירוע</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:360px 1fr;gap:18px;align-items:start">';

    // RIGHT SIDE - CUSTOMER DETAILS
    html += '<div class="contact-card" style="position:sticky;top:20px">';
    html += '<div class="contact-card-header">';
    html += '<div>';
    html += '<div class="contact-card-name">' + (c.name || 'לקוח ללא שם') + '</div>';
    html += '<div class="contact-card-meta">מספר לקוח #' + (c.contact_num || c.id || '') + '</div>';
    html += '</div>';
    html += '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>';
    html += '</div>';

    if (tags.length) {
      html += '<div class="attraction-tags" style="margin-bottom:14px">';
      tags.forEach(function(t) {
        html += '<span class="attraction-tag">' + t + '</span>';
      });
      html += '</div>';
    }

    html += '<div class="info-section">';
    html += '<div class="info-section-title">פרטי לקוח</div>';

    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">';
    html += c.phone || '—';
    if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '">WhatsApp</a>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">מייל</span><span class="info-value">';
    html += c.email || '—';
    if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '">שלח מייל</a>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">סוג לקוח</span><span class="info-value">' + (c.customer_type || 'פרטי') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">סטטוס לקוח</span><span class="info-value">' + (c.status || 'פעיל') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section">';
    html += '<div class="info-section-title">נתונים עסקיים</div>';
    html += '<div class="info-row"><span class="info-label">מספר אירועים</span><span class="info-value">' + (stats.total || leads.length || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">סך הכנסות</span><span class="info-value">₪' + fmtMoney(stats.revenue || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע אחרון</span><span class="info-value">' + (stats.last_event_date ? formatDate(stats.last_event_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע קרוב</span><span class="info-value">' + (stats.next_event_date ? formatDate(stats.next_event_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section">';
    html += '<div class="info-section-title">מעקב</div>';
    html += '<div class="info-row"><span class="info-label">קשר אחרון</span><span class="info-value">' + (c.last_contact_date ? formatDate(c.last_contact_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">קשר קרוב</span><span class="info-value">' + (c.next_contact_date ? formatDate(c.next_contact_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section">';
    html += '<div class="info-section-title">הערות כלליות</div>';
    html += '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (c.general_notes || c.notes || 'אין הערות כלליות') + '</div>';
    html += '</div>';

    html += '</div>';

    // LEFT SIDE - EVENTS
    html += '<div class="table-card">';
    html += '<div class="table-toolbar" style="justify-content:space-between">';
    html += '<strong>אירועים של הלקוח</strong>';
    html += '<span class="badge badge-gray">' + leads.length + ' אירועים</span>';
    html += '</div>';

    if (!leads.length) {
      html += '<div class="dash-empty">אין אירועים ללקוח הזה</div>';
    } else {
      html += '<table>';
      html += '<thead><tr><th>מספר אירוע</th><th>תאריך</th><th>סוג</th><th>אולם</th><th>מחיר</th><th>סטטוס</th></tr></thead>';
      html += '<tbody>';

      leads.forEach(function(l) {
        html += '<tr data-event-id="' + l.id + '">';
        html += '<td class="bold" style="color:var(--accent)">אירוע #' + (l.lead_num || l.id) + '</td>';
        html += '<td>' + (l.event_date ? formatDate(l.event_date) : '—') + '</td>';
        html += '<td>' + (l.event_type || '—') + '</td>';
        html += '<td>' + (l.venue || '—') + '</td>';
        html += '<td>' + (l.price ? '₪' + fmtMoney(l.price) : '—') + '</td>';
        html += '<td>' + statusBadge(l.status) + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    html += '</div>';
    html += '</div>';

    grid.innerHTML = html;

    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);

    document.getElementById('add-event-btn').addEventListener('click', function() {
      openLeadModal();
      setTimeout(function() {
        document.getElementById('l-name').value = c.name || '';
        document.getElementById('l-phone').value = c.phone || '';
        document.getElementById('l-email').value = c.email || '';
        document.getElementById('lead-id').setAttribute('data-contact-id', c.id);
      }, 50);
    });

    grid.querySelectorAll('tr[data-event-id]').forEach(function(row) {
      row.addEventListener('click', function() {
        openDrawer(parseInt(this.getAttribute('data-event-id')));
      });
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('Customer screen replaced successfully');
`;
fs.writeFileSync(p, s, 'utf8');
console.log('done');