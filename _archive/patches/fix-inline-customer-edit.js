const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-inline-customer-edit.js', s, 'utf8');

const helper = `
function openEditCustomerFieldModal(c, field, label, inputType) {
  var old = document.getElementById('edit-field-modal');
  if (old) old.remove();

  var current = c[field] || '';
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'edit-field-modal';

  var inputHtml = field === 'general_notes'
    ? '<textarea class="form-input" id="edit-field-value" style="min-height:120px">' + current + '</textarea>'
    : '<input class="form-input" id="edit-field-value" type="' + (inputType || 'text') + '" value="' + current + '">';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header"><h2>עריכת ' + label + '</h2><button class="modal-close" id="edit-field-close">✕</button></div>' +
      '<div class="modal-body"><div class="form-group"><label class="form-label">' + label + '</label>' + inputHtml + '</div></div>' +
      '<div class="modal-footer"><button class="btn btn-secondary" id="edit-field-cancel">ביטול</button><button class="btn btn-primary" id="edit-field-save">שמור</button></div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('edit-field-close').onclick = close;
  document.getElementById('edit-field-cancel').onclick = close;

  document.getElementById('edit-field-save').onclick = function() {
    var value = document.getElementById('edit-field-value').value;

    var payload = {
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
      extra_contacts: c.extra_contacts
    };

    payload[field] = value;

    apiCall('PUT', '/api/contacts/' + c.id, payload).then(function() {
      close();
      toast(label + ' עודכן', 'success');
      openCustomerCard(c.id);
    }).catch(function(e) {
      toast(e.message, 'error');
    });
  };
}

function makeTinyEditButton(c, field, label, inputType) {
  var btn = document.createElement('button');
  btn.className = 'btn btn-ghost btn-sm';
  btn.textContent = '✏️';
  btn.title = 'עריכת ' + label;
  btn.style.padding = '3px 7px';
  btn.style.fontSize = '11px';
  btn.onclick = function(e) {
    e.stopPropagation();
    openEditCustomerFieldModal(c, field, label, inputType);
  };
  return btn;
}
`;

if (!s.includes('function openEditCustomerFieldModal(c, field, label, inputType)')) {
  s = s.replace('function openCustomerCard(id)', helper + '\nfunction openCustomerCard(id)');
}

const marker = 'grid.innerHTML = html;';
const insert = `
    // inline-customer-edit
    setTimeout(function() {
      var nameEl = grid.querySelector('.contact-card-name');
      if (nameEl && !nameEl.querySelector('.inline-edit-name')) {
        var b = makeTinyEditButton(c, 'name', 'שם לקוח', 'text');
        b.classList.add('inline-edit-name');
        nameEl.appendChild(b);
      }

      var phoneLink = grid.querySelector('a[href^="tel:"]');
      var phoneRow = phoneLink ? phoneLink.closest('.info-row') : null;
      if (phoneRow && !phoneRow.querySelector('.inline-edit-phone')) {
        var b = makeTinyEditButton(c, 'phone', 'טלפון', 'text');
        b.classList.add('inline-edit-phone');
        phoneRow.querySelector('.info-value').appendChild(b);
      }

      var mailLink = grid.querySelector('a[href^="mailto:"]');
      var mailRow = mailLink ? mailLink.closest('.info-row') : null;
      if (mailRow && !mailRow.querySelector('.inline-edit-email')) {
        var b = makeTinyEditButton(c, 'email', 'מייל', 'email');
        b.classList.add('inline-edit-email');
        mailRow.querySelector('.info-value').appendChild(b);
      }

      if (c.next_contact_date) {
        grid.querySelectorAll('.info-row').forEach(function(row) {
          if (row.textContent.indexOf(formatDate(c.next_contact_date)) !== -1 && !row.querySelector('.inline-edit-next')) {
            var b = makeTinyEditButton(c, 'next_contact_date', 'תאריך קשר קרוב', 'date');
            b.classList.add('inline-edit-next');
            row.querySelector('.info-value').appendChild(b);
          }
        });
      }

      grid.querySelectorAll('.info-section').forEach(function(sec) {
        if (sec.textContent.indexOf(c.general_notes || '') !== -1 && (c.general_notes || '').length > 0 && !sec.querySelector('.inline-edit-notes')) {
          var b = makeTinyEditButton(c, 'general_notes', 'הערות כלליות', 'text');
          b.classList.add('inline-edit-notes');
          sec.appendChild(b);
        }
      });
    }, 150);
`;

if (!s.includes('// inline-customer-edit')) {
  const start = s.indexOf('function openCustomerCard(id)');
  const pos = s.indexOf(marker, start);
  if (start < 0 || pos < 0) throw new Error('openCustomerCard grid.innerHTML not found');
  s = s.slice(0, pos + marker.length) + '\n' + insert + s.slice(pos + marker.length);
}

fs.writeFileSync(p, s, 'utf8');

console.log('inline customer edit added');