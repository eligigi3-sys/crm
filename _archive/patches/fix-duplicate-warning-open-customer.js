const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-dup-open-customer.js', s, 'utf8');

const newFunc = `
function openDupLead() {
  if (!dupLeadId) return;

  apiCall('GET', '/api/leads/' + dupLeadId).then(function(data) {
    var l = data.lead || {};

    if (l.contact_id) {
      closeLeadModal();
      openCustomerCard(parseInt(l.contact_id));
      return;
    }

    var q = l.phone || l.email || l.name || '';
    return apiCall('GET', '/api/contacts?search=' + encodeURIComponent(q)).then(function(res) {
      if (res.contacts && res.contacts.length) {
        closeLeadModal();
        openCustomerCard(parseInt(res.contacts[0].id));
      } else {
        toast('נמצא ליד קיים, אבל עדיין אין לו כרטיס לקוח', 'error');
      }
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

`;

s = s.replace(/function openDupLead\(\)\s*\{[\s\S]*?\n\}/g, newFunc.trim());

fs.writeFileSync(p, s, 'utf8');

console.log('duplicate warning now opens customer card');