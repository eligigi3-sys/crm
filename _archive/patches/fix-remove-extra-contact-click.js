const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-remove-extra-click.js', s, 'utf8');

// Remove broken previous remove function if exists
s = s.replace(/function removeExtraContact\(customerId, index\)\s*\{[\s\S]*?\n\}/g, '');

const code = `
window.removeExtraContact = function(customerId, index) {
  var ok = confirm('האם אתה בטוח שברצונך למחוק את איש הקשר?');
  if (!ok) return;

  apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
    var c = data.contact || {};
    var extra = parseExtraContactsSafe(c.extra_contacts);

    index = Number(index);
    if (index < 0 || index >= extra.length) {
      throw new Error('איש הקשר לא נמצא');
    }

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
};

function removeExtraContact(customerId, index) {
  return window.removeExtraContact(customerId, index);
}

`;

if (!s.includes('window.removeExtraContact = function(customerId, index)')) {
  s = s.replace('function openExtraContactModal(customerId)', code + '\nfunction openExtraContactModal(customerId)');
}

fs.writeFileSync(p, s, 'utf8');

console.log('remove extra contact click fixed');