const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-small-buttons.js', s, 'utf8');

// תגיות
s = s.replace(
  /html \+= '<input class="form-input" id="customer-tags-input"([^']*)>';\s*html \+= '<button class="btn btn-primary btn-sm" id="save-customer-tags" style="margin-top:8px">שמור תגיות<\/button>';/,
  "html += '<div style=\"display:flex;gap:8px;align-items:center\">';\n    html += '<input class=\"form-input\" id=\"customer-tags-input\"$1 style=\"flex:1\">';\n    html += '<button class=\"btn btn-primary btn-sm\" id=\"save-customer-tags\" style=\"padding:6px 10px\">שמור</button>';\n    html += '</div>';"
);

// סטטוס
s = s.replace(
  /html \+= '<select id="customer-status-select" class="form-input">';/,
  "html += '<div style=\"display:flex;gap:8px;align-items:center\">';\n    html += '<select id=\"customer-status-select\" class=\"form-input\" style=\"flex:1\">';"
);

s = s.replace(
  /html \+= '<\/select>';\s*html \+= '<button class="btn btn-primary btn-sm" id="save-customer-status" style="margin-top:8px">שמור סטטוס<\/button>';/,
  "html += '</select>';\n    html += '<button class=\"btn btn-primary btn-sm\" id=\"save-customer-status\" style=\"padding:6px 10px\">שמור</button>';\n    html += '</div>';"
);

// סוג לקוח
s = s.replace(
  /html \+= '<select id="customer-type-select" class="form-input" style="margin-top:8px">';/,
  "html += '<div style=\"display:flex;gap:8px;align-items:center;margin-top:8px\">';\n    html += '<select id=\"customer-type-select\" class=\"form-input\" style=\"flex:1\">';"
);

s = s.replace(
  /html \+= '<\/select>';\s*html \+= '<button class="btn btn-primary btn-sm" id="save-customer-type" style="margin-top:8px">שמור סוג לקוח<\/button>';/,
  "html += '</select>';\n    html += '<button class=\"btn btn-primary btn-sm\" id=\"save-customer-type\" style=\"padding:6px 10px\">שמור</button>';\n    html += '</div>';"
);

fs.writeFileSync(p, s, 'utf8');

console.log('small save buttons applied');
