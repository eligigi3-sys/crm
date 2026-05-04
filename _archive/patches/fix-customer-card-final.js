const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-final-card.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id) {');
const end = s.indexOf('function showCustomerEventDetails', start);

if (start < 0 || end < 0) {
  throw new Error('Could not find openCustomerCard block');
}

const block = `
function openCustomerCard(id) {
  apiCall('GET', '/api/contacts/' + id).then(function(data) {
    var c = data.contact || {};
    var leads = data.leads || [];
    var stats = data.stats || {};
    var grid = document.getElementById('customers-grid');
    if (!grid) return;

    var cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
    var waPhone = cleanPhone.charAt(0) === '0' ? '972' + cleanPhone.substring(1) : cleanPhone;

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-customers">← חזרה לרשימת לקוחות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+ אירוע חדש ללקוח</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:360px 1fr;gap:20px;align-items:start">';

    html += '<div class="contact-card" style="position:sticky;top:20px">';
    html += '<div class="contact-card-header">';
    html += '<div>';
    html += '<div class="contact-card-name">' + (c.name || 'לקוח ללא שם') + '</div>';
    html += '<div class="contact-card-meta">מספר לקוח #' + (c.contact_num || c.id || '') + '</div>';
    html += '</div>';
    html += '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">פרטי לקוח</div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (c.phone || '—');
    if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '">WhatsApp</a>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">מייל</span><span class="info-value">' + (c.email || '—');
    if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '">שלח מייל</a>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">סוג לקוח</span><span class="info-value">' + (c.customer_type || 'פרטי') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">סטטוס לקוח</span><span class="info-value">' + (c.status || 'פעיל') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">נתונים עסקיים</div>';
    html += '<div class="info-row"><span class="info-label">מספר אירועים</span><span class="info-value">' + (stats.total || leads.length || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">סך הכנסות</span><span class="info-value">₪' + fmtMoney(stats.revenue || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע אחרון</span><span class="info-value">' + (stats.last_event_date ? formatDate(stats.last_event_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע קרוב</span><span class="info-value">' + (stats.next_event_date ? formatDate(stats.next_event_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">מעקב</div>';
    html += '<div class="info-row"><span class="info-label">קשר אחרון</span><span class="info-value">' + (c.last_contact_date ? formatDate(c.last_contact_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">קשר קרוב</span><span class="info-value">' + (c.next_contact_date ? formatDate(c.next_contact_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">הערות כלליות</div>';
    html += '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (c.general_notes || c.notes || 'אין הערות כלליות') + '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="table-card">';
    html += '<div class="table-toolbar" style="justify-content:space-between"><strong>אירועים של הלקוח</strong><span class="badge badge-gray">' + leads.length + ' אירועים</span></div>';

    if (!leads.length) {
      html += '<div class="dash-empty">אין אירועים ללקוח הזה</div>';
    } else {
      html += '<table><thead><tr><th>מספר אירוע</th><th>תאריך</th><th>סוג</th><th>אולם</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
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

console.log('openCustomerCard replaced');