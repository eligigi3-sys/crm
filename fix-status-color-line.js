const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-status-color-line.js', s, 'utf8');

if (!s.includes('function getCustomerStatusBadgeClass(status)')) {
  s = s.replace(
    'function getStatusLabel(status) {',
    'function getCustomerStatusBadgeClass(status) { var map = { hot:"badge-red", cold:"badge-blue", offer:"badge-orange", active:"badge-green", closed:"badge-green", cancelled:"badge-gray" }; return map[status] || "badge-green"; }\n\nfunction getStatusLabel(status) {'
  );
}

s = s.replace(
  `html += '<span class="badge badge-green">' + getStatusLabel(c.status) + '</span>';`,
  `html += '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>';`
);

fs.writeFileSync(p, s, 'utf8');

console.log('status badge color fixed');
