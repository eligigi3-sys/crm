const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-real-calendar-month.js', s, 'utf8');

const css = `
/* ===== Real Calendar Month View ===== */
.calendar-month-wrap{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.calendar-top{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)}
.calendar-title{font-size:18px;font-weight:800;color:var(--text)}
.calendar-actions{display:flex;gap:8px}
.calendar-weekdays{display:grid;grid-template-columns:repeat(7,1fr);background:#fafbfc;border-bottom:1px solid var(--border)}
.calendar-weekday{padding:10px;text-align:center;font-size:12px;font-weight:800;color:var(--text3)}
.calendar-grid-real{display:grid;grid-template-columns:repeat(7,1fr)}
.calendar-day-real{min-height:120px;border-left:1px solid var(--border);border-bottom:1px solid var(--border);padding:8px;background:var(--white)}
.calendar-day-real:nth-child(7n){border-left:none}
.calendar-day-real.other{background:#fafbfc;opacity:.45}
.calendar-day-num-real{font-size:12px;font-weight:800;color:var(--text3);margin-bottom:6px}
.calendar-event-pill{display:block;width:100%;border:none;border-radius:8px;padding:5px 7px;margin-bottom:5px;text-align:right;font-family:var(--font);font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.calendar-event-pill.lead{background:var(--blue-light);color:var(--blue)}
.calendar-event-pill.quote{background:var(--orange-light);color:var(--orange)}
.calendar-event-pill.closed{background:var(--green-light);color:var(--green)}
.calendar-event-pill.cancelled{background:var(--bg);color:var(--text3)}
.calendar-empty-day{font-size:11px;color:var(--text3)}

@media (max-width:768px){
  .calendar-top{flex-direction:column;align-items:stretch;gap:10px}
  .calendar-actions{display:grid;grid-template-columns:1fr 1fr 1fr}
  .calendar-weekday{font-size:10px;padding:7px 2px}
  .calendar-day-real{min-height:92px;padding:5px}
  .calendar-event-pill{font-size:10px;padding:4px 5px}
}
`;

if (!s.includes('/* ===== Real Calendar Month View ===== */')) {
  s = s.replace('</style>', css + '\n</style>');
}

const start = s.indexOf('function loadCalendar() {');
const end = s.indexOf('function openDrawer', start);

if (start < 0 || end < 0) throw new Error('loadCalendar block not found');

const block = `
function loadCalendar() {
  if (typeof calendarViewYear === 'undefined') {
    window.calendarViewYear = new Date().getFullYear();
    window.calendarViewMonth = new Date().getMonth();
  }

  apiCall('GET', '/api/leads').then(function(data) {
    var leads = (data.leads || []).filter(function(l) { return l.event_date; });
    renderRealCalendar(leads);
  }).catch(function(e) { toast(e.message, 'error'); });
}

function renderRealCalendar(leads) {
  var tbody = document.getElementById('calendar-body');
  var page = document.getElementById('page-calendar');
  if (!page) return;

  var tableCard = page.querySelector('.table-card');
  if (!tableCard) return;

  var monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var dayNames = ['א','ב','ג','ד','ה','ו','ש'];

  var year = window.calendarViewYear;
  var month = window.calendarViewMonth;

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var daysInPrev = new Date(year, month, 0).getDate();

  var eventMap = {};
  leads.forEach(function(l) {
    var d = (l.event_date || '').substring(0,10);
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(l);
  });

  var html = '';
  html += '<div class="calendar-month-wrap">';
  html += '<div class="calendar-top">';
  html += '<div class="calendar-title">' + monthNames[month] + ' ' + year + '</div>';
  html += '<div class="calendar-actions">';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-prev">‹ חודש קודם</button>';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-today">היום</button>';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-next">חודש הבא ›</button>';
  html += '</div></div>';

  html += '<div class="calendar-weekdays">';
  dayNames.forEach(function(d) { html += '<div class="calendar-weekday">' + d + '</div>'; });
  html += '</div>';

  html += '<div class="calendar-grid-real">';

  for (var i = firstDay - 1; i >= 0; i--) {
    html += '<div class="calendar-day-real other"><div class="calendar-day-num-real">' + (daysInPrev - i) + '</div></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var ds = year + '-' + pad2(month + 1) + '-' + pad2(d);
    var events = eventMap[ds] || [];

    html += '<div class="calendar-day-real">';
    html += '<div class="calendar-day-num-real">' + d + '</div>';

    if (events.length) {
      events.forEach(function(l) {
        html += '<button class="calendar-event-pill ' + (l.status || 'lead') + '" data-event-id="' + l.id + '">';
        html += (l.event_time ? l.event_time + ' · ' : '') + (l.name || '') + (l.event_type ? ' · ' + l.event_type : '');
        html += '</button>';
      });
    } else {
      html += '<div class="calendar-empty-day"> </div>';
    }

    html += '</div>';
  }

  var totalCells = firstDay + daysInMonth;
  var rem = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (var x = 1; x <= rem; x++) {
    html += '<div class="calendar-day-real other"><div class="calendar-day-num-real">' + x + '</div></div>';
  }

  html += '</div></div>';

  tableCard.innerHTML = html;

  document.getElementById('cal-real-prev').onclick = function() {
    window.calendarViewMonth--;
    if (window.calendarViewMonth < 0) {
      window.calendarViewMonth = 11;
      window.calendarViewYear--;
    }
    loadCalendar();
  };

  document.getElementById('cal-real-next').onclick = function() {
    window.calendarViewMonth++;
    if (window.calendarViewMonth > 11) {
      window.calendarViewMonth = 0;
      window.calendarViewYear++;
    }
    loadCalendar();
  };

  document.getElementById('cal-real-today').onclick = function() {
    var now = new Date();
    window.calendarViewYear = now.getFullYear();
    window.calendarViewMonth = now.getMonth();
    loadCalendar();
  };

  tableCard.querySelectorAll('.calendar-event-pill[data-event-id]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openEventDetailsModal(parseInt(this.getAttribute('data-event-id')));
    });
  });
}

`;

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('real calendar month view added');