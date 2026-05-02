const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-extra-contacts-ui.js', s, 'utf8');

// 1. Add helpers before closeCustomerModal
const helperMarker = 'function closeCustomerModal()';
const helpers = `
function parseExtraContacts(c) {
  try {
    var arr = c.extra_contacts ? JSON.parse(c.extra_contacts) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e) {
    return [];
  }
}

function openExtraContactPrompt(customerId) {
  var name = prompt('שם איש קשר נוסף:');
  if (!name) return;

  var phone = prompt('טלפון איש קשר נוסף:');
  if (!phone) return;

  apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
    var c = data.contact || {};
    var extra = parseExtraContacts(c);

    extra.push({
      name: name.trim(),
      phone: phone.trim()
    });

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
    toast('איש קשר נוסף נשמר', 'success');
    openCustomerCard(customerId);
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

function renderContactQuickActions(phone) {
  if (!phone) return '';
  var clean = String(phone).replace(/[^0-9]/g, '');
  var wa = clean.replace(/^0/, '972');

  return '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + wa + '">' +
    '<img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block">' +
  '</a>' +
  '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '">' +
    '<img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block">' +
  '</a>';
}

`;

if (!s.includes('function openExtraContactPrompt')) {
  s = s.replace(helperMarker, helpers + helperMarker);
}

// 2. Parse extra contacts inside openCustomerCard, after tags block
s = s.replace(
  `try { tags = c.tags ? JSON.parse(c.tags) : []; if (!Array.isArray(tags)) tags = []; } catch(e) { tags = []; }`,
  `try { tags = c.tags ? JSON.parse(c.tags) : []; if (!Array.isArray(tags)) tags = []; } catch(e) { tags = []; }
    var extraContacts = parseExtraContacts(c);`
);

// 3. Add + button after WhatsApp/phone actions in main phone row
s = s.replace(
  `if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:24px;height:24px;object-fit:contain;display:block"></a> <a class="btn btn-ghost btn-sm" href="tel:' + c.phone + '"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';`,
  `if (c.phone) html += ' ' + renderContactQuickActions(c.phone);
    html += ' <button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" title="הוסף איש קשר נוסף" style="padding:5px 10px;font-weight:800">+</button>';`
);

// Fallback: if exact line differs, add plus near phone row after WhatsApp only
s = s.replace(
  `if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:24px;height:24px;object-fit:contain;display:block"></a>';`,
  `if (c.phone) html += ' ' + renderContactQuickActions(c.phone);
    html += ' <button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" title="הוסף איש קשר נוסף" style="padding:5px 10px;font-weight:800">+</button>';`
);

// 4. Render extra contacts under main phone row, before email row
s = s.replace(
  `html += '</span></div>';
    html += '<div class="info-row"><span class="info-label">`,
  `html += '</span></div>';

    if (extraContacts.length) {
      html += '<div class="info-row"><span class="info-label">אנשי קשר נוספים</span><span class="info-value">';
      extraContacts.forEach(function(ec) {
        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">';
        html += '<span style="font-weight:700">' + (ec.name || 'איש קשר') + '</span>';
        html += '<span>' + (ec.phone || '') + '</span>';
        html += renderContactQuickActions(ec.phone);
        html += '</div>';
      });
      html += '</span></div>';
    }

    html += '<div class="info-row"><span class="info-label">`
);

// 5. Add button event after back button listener
s = s.replace(
  `document.getElementById('back-to-customers').addEventListener('click', loadCustomers);`,
  `document.getElementById('back-to-customers').addEventListener('click', loadCustomers);
    var addExtraBtn = document.getElementById('add-extra-contact-btn');
    if (addExtraBtn) addExtraBtn.addEventListener('click', function() {
      openExtraContactPrompt(c.id);
    });`
);

fs.writeFileSync(p, s, 'utf8');

console.log('extra contacts UI patched');