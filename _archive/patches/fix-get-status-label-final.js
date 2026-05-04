const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-getstatus-final.js', s, 'utf8');

// לתקן כל קריאה עם אותיות גדולות/קטנות לא נכונות
s = s.replace(/\b[Gg]et[Ss]tatus[Ll]abel\b/g, 'getStatusLabel');

// למחוק גרסאות קודמות אם נוספו במקום לא נכון
s = s.replace(/function getStatusLabel\(status\)\s*\{[\s\S]*?return map\[status\]\s*\|\|\s*["']🟢 פעיל["'];\s*\}/g, '');

const helper = `
function getStatusLabel(status) {
  var map = {
    hot: "🔥 חם",
    cold: "❄️ קר",
    offer: "⏳ בהצעה",
    active: "🟢 פעיל",
    closed: "✅ סגור",
    cancelled: "❌ בוטל",
    "פעיל": "🟢 פעיל",
    "סגור": "✅ סגור",
    "בוטל": "❌ בוטל"
  };
  return map[status] || "🟢 פעיל";
}

`;

const marker = 'function init() {';

if (!s.includes('function getStatusLabel(status)')) {
  s = s.replace(marker, helper + marker);
}

fs.writeFileSync(p, s, 'utf8');

console.log('getStatusLabel fixed inside script');