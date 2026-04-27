const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-tags.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id) {');
const end = s.indexOf('function closeCustomerModal()', start);

if (start < 0 || end < 0) {
  throw new Error('Could not find openCustomerCard block');
}

let block = s.slice(start, end);

if (!block.includes('customer-tags-input')) {
  block = block.replace(
    "    if (!grid) return;\n\n    var cleanPhone",
    "    if (!grid) return;\n\n    var tags = [];\n    try {\n      tags = c.tags ? JSON.parse(c.tags) : [];\n      if (!Array.isArray(tags)) tags = [];\n    } catch(e) { tags = []; }\n\n    var cleanPhone"
  );

  block = block.replace(
    "    html += '<span class=\"badge badge-purple\">' + (c.customer_type || 'פרטי') + '</span>';\n    html += '</div>';",
    "    html += '<span class=\"badge badge-purple\">' + (c.customer_type || 'פרטי') + '</span>';\n    html += '</div>';\n\n    html += '<div class=\"info-section\">';\n    html += '<div class=\"info-section-title\">תגיות לקוח</div>';\n    if (tags.length) {\n      html += '<div class=\"attraction-tags\" style=\"margin-bottom:10px\">';\n      tags.forEach(function(t) {\n        html += '<span class=\"attraction-tag\">' + t + '</span>';\n      });\n      html += '</div>';\n    } else {\n      html += '<div style=\"font-size:12px;color:var(--text3);margin-bottom:8px\">אין תגיות עדיין</div>';\n    }\n    html += '<input class=\"form-input\" id=\"customer-tags-input\" placeholder=\"לדוגמה: VIP, לקוח חוזר, מפיק\" value=\"' + tags.join(', ') + '\">';\n    html += '<button class=\"btn btn-primary btn-sm\" id=\"save-customer-tags\" style=\"margin-top:8px\">שמור תגיות</button>';\n    html += '</div>';"
  );

  block = block.replace(
    "    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);",
    "    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);\n\n    var saveTagsBtn = document.getElementById('save-customer-tags');\n    if (saveTagsBtn) saveTagsBtn.addEventListener('click', function() {\n      var raw = document.getElementById('customer-tags-input').value || '';\n      var newTags = raw.split(',').map(function(t) { return t.trim(); }).filter(Boolean);\n\n      apiCall('PUT', '/api/contacts/' + c.id, {\n        name: c.name,\n        phone: c.phone,\n        email: c.email,\n        notes: c.notes,\n        customer_type: c.customer_type || 'פרטי',\n        status: c.status || 'פעיל',\n        tags: JSON.stringify(newTags),\n        last_contact_date: c.last_contact_date,\n        next_contact_date: c.next_contact_date,\n        general_notes: c.general_notes\n      }).then(function() {\n        toast('תגיות נשמרו', 'success');\n        openCustomerCard(c.id);\n      }).catch(function(e) { toast(e.message, 'error'); });\n    });"
  );
}

s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(p, s, 'utf8');

console.log('customer tags added');