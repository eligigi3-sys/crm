const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-getstatus-fix.js', s, 'utf8');

const marker = "var stats = data.stats || {};";

const helper = `
    function getStatusLabel(status) {
      var map = {
        hot: "🔥 חם",
        cold: "❄️ קר",
        offer: "⏳ בהצעה",
        active: "🟢 פעיל",
        closed: "✅ סגור",
        cancelled: "❌ בוטל"
      };
      return map[status] || "🟢 פעיל";
    }
`;

if (!s.includes('function getStatusLabel(status)')) {
  s = s.replace(marker, marker + helper);
}

fs.writeFileSync(p, s, 'utf8');
console.log('getStatusLabel fixed');