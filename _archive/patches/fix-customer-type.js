const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-customer-type.js', s, 'utf8');

const start = s.indexOf('function openCustomerCard(id) {');
const end = s.indexOf('function closeCustomerModal()', start);

if (start < 0 || end < 0) throw new Error('openCustomerCard block not found');

let block = s.slice(start, end);

if (!block.includes('customer-type-select')) {
  block = block.replace(
    "html += '<div class=\"info-row\"><span class=\"info-label\">סוג לקוח</span><span class=\"info-value\">' + (c.customer_type || 'פרטי') + '</span></div>';",
    [
      "html += '<div class=\"info-row\"><span class=\"info-label\">סוג לקוח</span><span class=\"info-value\">' + (c.customer_type || 'פרטי') + '</span></div>';",
      "html += '<select id=\"customer-type-select\" class=\"form-input\" style=\"margin-top:8px\">';",
      "html += '<option value=\"פרטי\">פרטי</option>';",
      "html += '<option value=\"עסקי\">עסקי</option>';",
      "html += '<option value=\"מפיק/ספק\">מפיק/ספק</option>';",
      "html += '</select>';",
      "html += '<button class=\"btn btn-primary btn-sm\" id=\"save-customer-type\" style=\"margin-top:8px\">שמור סוג לקוח</button>';"
    ].join("\\n")
  );

  block = block.replace(
    "var statusSelect = document.getElementById('customer-status-select');",
    [
      "var typeSelect = document.getElementById('customer-type-select');",
      "if (typeSelect) typeSelect.value = c.customer_type || 'פרטי';",
      "",
      "var saveTypeBtn = document.getElementById('save-customer-type');",
      "if (saveTypeBtn) saveTypeBtn.addEventListener('click', function() {",
      "  apiCall('PUT', '/api/contacts/' + c.id, {",
      "    name: c.name,",
      "    phone: c.phone,",
      "    email: c.email,",
      "    notes: c.notes,",
      "    customer_type: typeSelect.value,",
      "    status: c.status || 'active',",
      "    tags: c.tags,",
      "    last_contact_date: c.last_contact_date,",
      "    next_contact_date: c.next_contact_date,",
      "    general_notes: c.general_notes",
      "  }).then(function() {",
      "    toast('סוג לקוח נשמר', 'success');",
      "    openCustomerCard(c.id);",
      "  }).catch(function(e) { toast(e.message, 'error'); });",
      "});",
      "",
      "var statusSelect = document.getElementById('customer-status-select');"
    ].join("\\n")
  );
}

s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(p, s, 'utf8');

console.log('customer type added');