const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-calendar-filters.js', s, 'utf8');

// add filter UI
s = s.replace(
  `html += '<div class="calendar-actions">';`,
  `
  html += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">';
  
  html += '<select id="calendar-status-filter" class="form-select" style="width:160px">';
  html += '<option value="">כל הסטטוסים</option>';
  html += '<option value="lead">ליד</option>';
  html += '<option value="quote">הצעת מחיר</option>';
  html += '<option value="closed">סגור</option>';
  html += '<option value="cancelled">בוטל</option>';
  html += '</select>';

  html += '<select id="calendar-type-filter" class="form-select" style="width:170px">';
  html += '<option value="">כל סוגי האירועים</option>';
  html += '<option value="חתונה">חתונה</option>';
  html += '<option value="בר מצווה">בר מצווה</option>';
  html += '<option value="בת מצווה">בת מצווה</option>';
  html += '<option value="ברית">ברית</option>';
  html += '<option value="יום הולדת">יום הולדת</option>';
  html += '<option value="אירוע חברה">אירוע חברה</option>';
  html += '</select>';

  html += '</div>';

  html += '<div class="calendar-actions">';
`
);

// add filtering logic
s = s.replace(
  `var eventMap = {};`,
  `
  var statusFilter = window.calendarStatusFilter || '';
  var typeFilter = window.calendarTypeFilter || '';

  if (statusFilter) {
    leads = leads.filter(function(l) {
      return l.status === statusFilter;
    });
  }

  if (typeFilter) {
    leads = leads.filter(function(l) {
      return (l.event_type || '') === typeFilter;
    });
  }

  var eventMap = {};
`
);

// add listeners
const marker = `
  document.getElementById('cal-real-today').onclick = function() {
`;

const insert = `
  var sf = document.getElementById('calendar-status-filter');
  if (sf) {
    sf.value = window.calendarStatusFilter || '';
    sf.onchange = function() {
      window.calendarStatusFilter = this.value;
      loadCalendar();
    };
  }

  var tf = document.getElementById('calendar-type-filter');
  if (tf) {
    tf.value = window.calendarTypeFilter || '';
    tf.onchange = function() {
      window.calendarTypeFilter = this.value;
      loadCalendar();
    };
  }

`;

if (!s.includes("calendar-status-filter")) {
  throw new Error('filter UI not inserted');
}

if (!s.includes("window.calendarStatusFilter")) {
  s = s.replace(marker, insert + marker);
}

fs.writeFileSync(p, s, 'utf8');

console.log('calendar filters added');