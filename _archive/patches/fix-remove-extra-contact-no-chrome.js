const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-no-chrome-confirm.js', s, 'utf8');

const modalCode = `
function openConfirmRemoveExtraContactModal(customerId, index) {
  var old = document.getElementById('remove-extra-contact-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'remove-extra-contact-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header">' +
        '<h2>מחיקת איש קשר</h2>' +
        '<button class="modal-close" id="remove-extra-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div style="font-size:15px;font-weight:600;line-height:1.7">האם אתה בטוח שברצונך למחוק את איש הקשר?</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="remove-extra-no">לא</button>' +
        '<button class="btn btn-danger" id="remove-extra-yes">כן, מחק</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('remove-extra-close').onclick = close;
  document.getElementById('remove-extra-no').onclick = close;

  document.getElementById('remove-extra-yes').onclick = function() {
    close();
    removeExtraContactConfirmed(customerId, index);
  };
}

function removeExtraContactConfirmed(customerId, index) {
  apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
    var c = data.contact || {};
    var extra = parseExtraContactsSafe(c.extra_contacts);

    index = Number(index);
    extra.splice(index, 1);

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
    toast('איש הקשר נמחק', 'success');
    openCustomerCard(customerId);
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

window.removeExtraContact = function(customerId, index) {
  openConfirmRemoveExtraContactModal(customerId, index);
};

function removeExtraContact(customerId, index) {
  openConfirmRemoveExtraContactModal(customerId, index);
}
`;

// מוחק כל גרסה קודמת של המחיקה
s = s.replace(/window\.removeExtraContact = function\(customerId, index\)[\s\S]*?function removeExtraContact\(customerId, index\)\s*\{[\s\S]*?\n\}/g, '');
s = s.replace(/function removeExtraContact\(customerId, index\)\s*\{[\s\S]*?\n\}/g, '');
s = s.replace(/function openConfirmRemoveExtraContactModal\(customerId, index\)\s*\{[\s\S]*?\n\}/g, '');
s = s.replace(/function removeExtraContactConfirmed\(customerId, index\)\s*\{[\s\S]*?\n\}/g, '');

// מכניס גרסה נקייה לפני openExtraContactModal
s = s.replace('function openExtraContactModal(customerId)', modalCode + '\n\nfunction openExtraContactModal(customerId)');

fs.writeFileSync(p, s, 'utf8');

console.log('Chrome confirm removed, CRM modal installed');