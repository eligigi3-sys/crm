const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-professional-icons.js', s, 'utf8');

s = s.replace(/>💬<\/a>/g, '><span style="font-size:13px;font-weight:800">W</span></a>');
s = s.replace(/>📞<\/a>/g, '><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L9 10.6a16 16 0 0 0 4.4 4.4l1.17-1.17a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z"></path></svg></a>');

s = s.replace(
  /style="text-decoration:none;font-size:14px"/g,
  'style="width:24px;height:24px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:var(--bg);color:var(--text2);border:1px solid var(--border);text-decoration:none;font-size:12px"'
);

fs.writeFileSync(p, s, 'utf8');

console.log('professional contact icons applied');