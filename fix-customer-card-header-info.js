const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-customer-card-header-info.js', s, 'utf8');

// שם לקוח + סטטוס ליד השם
s = s.replace(
  `'<div class="customer-card-name">' + (c.name || 'לקוח ללא שם') + '</div>' +`,
  `'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
    '<div class="customer-card-name">' + (c.name || 'לקוח ללא שם') + '</div>' +
    '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>' +
  '</div>' +`
);

// לוודא שסוג לקוח והכנסות מופיעים יפה
s = s.replace(
  `'<span class="customer-stat-pill">₪' + fmtMoney(c.revenue || 0) + '</span>' +`,
  `'<span class="customer-stat-pill" style="color:var(--green);font-weight:800">₪' + fmtMoney(c.revenue || 0) + ' סה״כ הכנסות</span>' +`
);

s = s.replace(
  `'<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>' +`,
  `'<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>' +`
);

fs.writeFileSync(p, s, 'utf8');

console.log('customer card header info updated');