const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-status.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id) {');
const end = s.indexOf('function closeCustomerModal()', start);

if (start < 0 || end < 0) {
  throw new Error('Could not find openCustomerCard block');
}

let block = s.slice(start, end);

if (!block.includes('customer-status-select')) {

  // replace display of status
  block = block.replace(
    "סטטוס לקוח</span><span class=\"info-value\">' + (c.status || 'פעיל') + '</span>",
    "סטטוס לקוח</span><span class=\"info-value\">' + getStatusLabel(c.status) + '</span>"
  );

  // add selector
  block = block.replace(
    "html += '</div>';",
    `
    html += '<div class="info-section">';
    html += '<div class="info-section-title">סטטוס לקוח</div>';
    html += '<select id="customer-status-select" class="form-input">';
    html += '<option value="hot">🔥 חם</option>';
    html += '<option value="cold">❄️ קר</option>';
    html += '<option value="offer">⏳ בהצעה</option>';
    html += '<option value="active">🟢 פעיל</option>';
    html += '<option value="closed">✅ סגור</option>';
    html += '<option value="cancelled">❌ בוטל</option>';
    html += '</select>';
    html += '<button class="btn btn-primary btn-sm" id="save-customer-status" style="margin-top:8px">שמור סטטוס</button>';
    html += '</div>';

    html += '</div>';
    `
  );

  // add save logic
  block = block.replace(
    "document.getElementById('back-to-customers').addEventListener('click', loadCustomers);",
    `
    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);

    var statusSelect = document.getElementById('customer-status-select');
    if (statusSelect) statusSelect.value = c.status || 'active';

    var saveStatusBtn = document.getElementById('save-customer-status');
    if (saveStatusBtn) saveStatusBtn.addEventListener('click', function() {
      var newStatus = statusSelect.value;

      apiCall('PUT', '/api/contacts/' + c.id, {
        name: c.name,
        phone: c.phone,
        email: c.email,
        notes: c.notes,
        customer_type: c.customer_type || 'פרטי',
        status: newStatus,
        tags: c.tags,
        last_contact_date: c.last_contact_date,
        next_contact_date: c.next_contact_date,
        general_notes: c.general_notes
      }).then(function() {
        toast('סטטוס נשמר', 'success');
        openCustomerCard(c.id);
      }).catch(function(e) { toast(e.message, 'error'); });
    });
    `
  );

  // add helper function globally
  if (!s.includes('function getStatusLabel')) {
    s += `
function getStatusLabel(status) {
  var map = {
    hot: "🔥 חם",
    cold: "❄️ קר",
    offer: "⏳ בהצעה",
    active: "🟢 פעיל",
    closed: "✅ סגור",
    cancelled: "❌ בוטל"
  };
  return map[status] || "🟢 פעיל";
}
`;
  }
}

s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(p, s, 'utf8');

console.log('customer status added');