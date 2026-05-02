const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-extra-modal-direct.js', s, 'utf8');

const code = `
function parseExtraContactsSafe(value) {
  try {
    var arr = value ? JSON.parse(value) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e) {
    return [];
  }
}

function openExtraContactModal(customerId) {
  var old = document.getElementById('extra-contact-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'extra-contact-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header">' +
        '<h2>הוספת איש קשר נוסף</h2>' +
        '<button class="modal-close" id="extra-contact-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם איש קשר</label><input class="form-input" id="extra-contact-name" placeholder="שם איש קשר"></div>' +
        '<div class="form-group"><label class="form-label">טלפון</label><input class="form-input" id="extra-contact-phone" placeholder="0500000000"></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="extra-contact-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="extra-contact-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('extra-contact-close').onclick = close;
  document.getElementById('extra-contact-cancel').onclick = close;

  document.getElementById('extra-contact-save').onclick = function() {
    var name = document.getElementById('extra-contact-name').value.trim();
    var phone = document.getElementById('extra-contact-phone').value.trim();

    if (!name || !phone) {
      toast('צריך למלא שם וטלפון', 'error');
      return;
    }

    apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
      var c = data.contact || {};
      var extra = parseExtraContactsSafe(c.extra_contacts);

      extra.push({ name: name, phone: phone });

      return apiCall('PUT', '/api/contacts/' + customerId, {
        name: c.name,
        phone: c.phone,
        email: c.email,
        notes: c.notes,
        customer_type: c.customer_type || 'פרטי',
        status: c.status || 'active',
        tags: c.tags,
        last_contact_date: c.last_contact_date,
        next_contact_date: c.next_contact_date,
        general_notes: c.general_notes,
        extra_contacts: JSON.stringify(extra)
      });
    }).then(function() {
      close();
      toast('איש קשר נוסף נשמר', 'success');
      openCustomerCard(customerId);
    }).catch(function(e) {
      toast(e.message, 'error');
    });
  };
}

`;

if (!s.includes('function openExtraContactModal(customerId)')) {
  s = s.replace('function openCustomerCard(id)', code + '\nfunction openCustomerCard(id)');
}

fs.writeFileSync(p, s, 'utf8');

console.log('extra contact modal inserted directly');