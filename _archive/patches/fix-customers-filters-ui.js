const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-filters-ui.js', s, 'utf8');

// מחפשים את אזור החיפוש בעמוד לקוחות
const marker = 'id="customers-search"';

if (!s.includes('customers-filter-status')) {

  s = s.replace(marker, `
id="customers-search">
        <select id="customers-filter-status" class="form-input" style="max-width:140px;margin-right:8px">
          <option value="">כל הסטטוסים</option>
          <option value="hot">🔥 חם</option>
          <option value="cold">❄️ קר</option>
          <option value="offer">⏳ בהצעה</option>
          <option value="active">🟢 פעיל</option>
          <option value="closed">✅ סגור</option>
          <option value="cancelled">❌ בוטל</option>
        </select>

        <select id="customers-filter-type" class="form-input" style="max-width:140px;margin-right:8px">
          <option value="">כל הסוגים</option>
          <option value="פרטי">פרטי</option>
          <option value="עסקי">עסקי</option>
          <option value="מפיק/ספק">מפיק/ספק</option>
        </select>

        <select id="customers-sort" class="form-input" style="max-width:160px">
          <option value="">מיון</option>
          <option value="name">לפי שם</option>
          <option value="events">לפי מספר אירועים</option>
          <option value="revenue">לפי הכנסות</option>
          <option value="next_event">אירוע קרוב</option>
        </select>
`);
}

fs.writeFileSync(p, s, 'utf8');
console.log('filters UI added');