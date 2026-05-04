const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-edit-customer-modal.js', s, 'utf8');

const modalCode = `
function openEditCustomerModal(c) {
  var old = document.getElementById('edit-customer-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'edit-customer-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:520px">' +
      '<div class="modal-header">' +
        '<h2>עריכת לקוח</h2>' +
        '<button class="modal-close" id="edit-customer-close">✕</button>' +
      '</div>' +

      '<div class="modal-body">' +

        '<div class="form-group">' +
          '<label class="form-label">שם לקוח</label>' +
          '<input class="form-input" id="edit-customer-name" value="' + (c.name || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">טלפון</label>' +
          '<input class="form-input" id="edit-customer-phone" value="' + (c.phone || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">מייל</label>' +
          '<input class="form-input" id="edit-customer-email" value="' + (c.email || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סוג לקוח</label>' +
          '<input class="form-input" id="edit-customer-type" value="' + (c.customer_type || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סטטוס</label>' +
          '<input class="form-input" id="edit-customer-status" value="' + (c.status || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">תאריך קשר הבא</label>' +
          '<input type="date" class="form-input" id="edit-customer-next-contact" value="' + (c.next_contact_date || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">הערות</label>' +
          '<textarea class="form-input" id="edit-customer-notes" style="min-height:120px">' + (c.general_notes || '') + '</textarea>' +
        '</div>' +

      '</div>' +

      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="edit-customer-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="edit-customer-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
  }

  document.getElementById('edit-customer-close').onclick = close;
  document.getElementById('edit-customer-cancel').onclick = close;

  document.getElementById('edit-customer-save').onclick = function() {

    apiCall('PUT', '/api/contacts/' + c.id, {
      name: document.getElementById('edit-customer-name').value,
      phone: document.getElementById('edit-customer-phone').value,
      email: document.getElementById('edit-customer-email').value,
      customer_type: document.getElementById('edit-customer-type').value,
      status: document.getElementById('edit-customer-status').value,
      general_notes: document.getElementById('edit-customer-notes').value,
      next_contact_date: document.getElementById('edit-customer-next-contact').value,

      notes: c.notes,
      tags: c.tags,
      last_contact_date: c.last_contact_date,
      extra_contacts: c.extra_contacts
    }).then(function() {
      close();
      toast('הלקוח עודכן', 'success');
      openCustomerCard(c.id);
    }).catch(function(e) {
      toast(e.message, 'error');
    });

  };
}
`;

if (!s.includes('function openEditCustomerModal(c)')) {
  s = s.replace('function openCustomerCard(id)', modalCode + '\n\nfunction openCustomerCard(id)');
}

// Add edit button
s = s.replace(
  `html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+`,
  `html += '<button class="btn btn-secondary btn-sm" id="edit-customer-btn">✏️ עריכה</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+`
);

// Add click event
s = s.replace(
  `document.getElementById('back-to-customers').addEventListener('click', loadCustomers);`,
  `document.getElementById('back-to-customers').addEventListener('click', loadCustomers);

    var editBtn = document.getElementById('edit-customer-btn');
    if (editBtn) {
      editBtn.onclick = function() {
        openEditCustomerModal(c);
      };
    }`
);

fs.writeFileSync(p, s, 'utf8');

console.log('edit customer modal added');