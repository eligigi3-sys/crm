const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-event-modal-force.js', s, 'utf8');

const code = `
function openEventDetailsModal(id) {
  apiCall('GET', '/api/leads/' + id).then(function(data) {
    var l = data.lead || {};
    var old = document.getElementById('event-details-modal');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'event-details-modal';

    overlay.innerHTML =
      '<div class="modal" style="width:620px">' +
        '<div class="modal-header">' +
          '<h2>פרטי אירוע #' + (l.lead_num || l.id) + '</h2>' +
          '<button class="modal-close" id="event-details-close">✕</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="info-section"><div class="info-section-title">פרטי האירוע</div>' +
          '<div class="info-row"><span class="info-label">סוג אירוע</span><span class="info-value">' + (l.event_type || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">תאריך</span><span class="info-value">' + (l.event_date ? formatDate(l.event_date) : '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">שעה</span><span class="info-value">' + (l.event_time || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">אולם</span><span class="info-value">' + (l.venue || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">סטטוס</span><span class="info-value">' + statusBadge(l.status) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">כספים</div>' +
          '<div class="info-row"><span class="info-label">מחיר</span><span class="info-value">₪' + fmtMoney(l.price || 0) + '</span></div>' +
          '<div class="info-row"><span class="info-label">מקדמה</span><span class="info-value">₪' + fmtMoney(l.deposit || 0) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">הערות</div>' +
          '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (l.details || l.notes || 'אין הערות') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" id="event-details-cancel">סגור</button>' +
          '<button class="btn btn-primary" id="event-details-edit">✏️ עריכת אירוע</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function close() { overlay.remove(); }

    document.getElementById('event-details-close').onclick = close;
    document.getElementById('event-details-cancel').onclick = close;
    document.getElementById('event-details-edit').onclick = function() {
      close();
      editLead(id);
    };
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

if (!s.includes('function openEventDetailsModal(id)')) {
  s = s.replace('function openCustomerCard(id)', code + '\nfunction openCustomerCard(id)');
}

const marker = 'grid.innerHTML = html;';
const insert = `
    // force-event-modal-from-customer-card
    setTimeout(function() {
      grid.querySelectorAll('tr[data-event-id]').forEach(function(row) {
        row.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          openEventDetailsModal(parseInt(row.getAttribute('data-event-id')));
        }, true);
      });
    }, 100);
`;

if (!s.includes('// force-event-modal-from-customer-card')) {
  const start = s.indexOf('function openCustomerCard(id)');
  const pos = s.indexOf(marker, start);
  if (start < 0 || pos < 0) throw new Error('openCustomerCard grid.innerHTML not found');
  s = s.slice(0, pos + marker.length) + '\n' + insert + s.slice(pos + marker.length);
}

fs.writeFileSync(p, s, 'utf8');

console.log('event modal forced from customer card');