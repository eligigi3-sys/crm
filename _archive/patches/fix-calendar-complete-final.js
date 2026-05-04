const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-calendar-complete-final.js', s, 'utf8');

const css = `
/* ===== Calendar Complete Final ===== */
.calendar-day-real{min-height:120px;border-left:1px solid var(--border);border-bottom:1px solid var(--border);padding:8px;background:#fff;position:relative;cursor:pointer}
.calendar-day-real:hover{background:#f8fbff}
.calendar-day-real.today{background:#eef6ff;box-shadow:inset 0 0 0 2px var(--accent)}
.calendar-add-btn{position:absolute;top:6px;left:6px;width:24px;height:24px;border-radius:50%;border:0;background:var(--accent);color:#fff;font-weight:900;cursor:pointer}
.calendar-event-pill{display:block;width:100%;border:0;border-radius:8px;padding:5px 7px;margin-bottom:5px;text-align:right;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.calendar-event-pill.closed{background:var(--green-light);color:var(--green)}
.calendar-event-pill.lead{background:var(--blue-light);color:var(--blue)}
.calendar-event-pill.quote{background:var(--orange-light);color:var(--orange)}
.calendar-event-pill.cancelled{background:var(--bg);color:var(--text3)}
`;

if (!s.includes('/* ===== Calendar Complete Final ===== */')) {
  s = s.replace('</style>', css + '\n</style>');
}

const start = s.indexOf('function loadCalendar() {');
const end = s.indexOf('function openDrawer', start);

if (start < 0 || end < 0) throw new Error('loadCalendar block not found');

const block = `
function loadCalendar() {
  if (typeof window.calendarViewYear === 'undefined') {
    var now = new Date();
    window.calendarViewYear = now.getFullYear();
    window.calendarViewMonth = now.getMonth();
  }

  apiCall('GET', '/api/leads').then(function(data) {
    var leads = (data.leads || []).filter(function(l) { return l.event_date; });

    var statusFilter = window.calendarStatusFilter || '';
    var typeFilter = window.calendarTypeFilter || '';

    if (statusFilter) {
      leads = leads.filter(function(l) {
        return String(l.status || '') === String(statusFilter);
      });
    }

    if (typeFilter) {
      leads = leads.filter(function(l) {
        return String(l.event_type || '') === String(typeFilter);
      });
    }

    renderRealCalendar(leads);
  }).catch(function(e) { toast(e.message, 'error'); });
}

function renderRealCalendar(leads) {
  var page = document.getElementById('page-calendar');
  if (!page) return;

  var tableCard = page.querySelector('.table-card');
  if (!tableCard) return;

  var monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var dayNames = ['א','ב','ג','ד','ה','ו','ש'];

  var year = window.calendarViewYear;
  var month = window.calendarViewMonth;

  var today = new Date();
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();

  var eventMap = {};
  leads.forEach(function(l) {
    var d = String(l.event_date || '').substring(0,10);
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(l);
  });

  var html = '';

  html += '<div class="calendar-month-wrap">';
  html += '<div class="calendar-top" style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">';
  html += '<div class="calendar-title">' + monthNames[month] + ' ' + year + '</div>';

  html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  html += '<select id="calendar-status-filter" class="form-select" style="width:150px">';
  html += '<option value="">כל הסטטוסים</option>';
  html += '<option value="lead">ליד</option>';
  html += '<option value="quote">הצעת מחיר</option>';
  html += '<option value="closed">סגור</option>';
  html += '<option value="cancelled">בוטל</option>';
  html += '</select>';

  html += '<select id="calendar-type-filter" class="form-select" style="width:170px">';
  html += '<option value="">כל סוגי האירועים</option>';
  html += '<option value="בת מצווה">בת מצווה</option>';
  html += '<option value="יום הולדת">יום הולדת</option>';
  html += '<option value="אירוע חברה">אירוע חברה</option>';
  html += '<option value="בר מצווה">בר מצווה</option>';
  html += '<option value="חתונה">חתונה</option>';
  html += '<option value="אחר">אחר</option>';
  html += '</select>';
  html += '</div>';

  html += '<div style="display:flex;gap:8px">';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-prev">‹ קודם</button>';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-today">היום</button>';
  html += '<button class="btn btn-secondary btn-sm" id="cal-real-next">הבא ›</button>';
  html += '</div>';

  html += '</div>';

  html += '<div class="calendar-weekdays" style="display:grid;grid-template-columns:repeat(7,1fr);background:#fafbfc;border-bottom:1px solid var(--border)">';
  dayNames.forEach(function(d) {
    html += '<div style="padding:10px;text-align:center;font-size:12px;font-weight:800;color:var(--text3)">' + d + '</div>';
  });
  html += '</div>';

  html += '<div class="calendar-grid-real" style="display:grid;grid-template-columns:repeat(7,1fr)">';

  for (var empty = 0; empty < firstDay; empty++) {
    html += '<div class="calendar-day-real" style="opacity:.35;background:#fafbfc"></div>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var ds = year + '-' + pad2(month + 1) + '-' + pad2(d);
    var isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    var events = eventMap[ds] || [];

    html += '<div class="calendar-day-real ' + (isToday ? 'today' : '') + '" data-date="' + ds + '">';
    html += '<button class="calendar-add-btn" data-date="' + ds + '">+</button>';
    html += '<div class="calendar-day-num-real" style="font-size:12px;font-weight:900;margin-bottom:8px">' + d + '</div>';

    events.forEach(function(l) {
      html += '<button class="calendar-event-pill ' + (l.status || 'lead') + '" data-event-id="' + l.id + '">';
      html += (l.event_time ? l.event_time + ' · ' : '') + (l.name || '') + (l.event_type ? ' · ' + l.event_type : '');
      html += '</button>';
    });

    html += '</div>';
  }

  html += '</div></div>';

  tableCard.innerHTML = html;

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

  tableCard.querySelectorAll('.calendar-add-btn').forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      var date = this.getAttribute('data-date');
      openLeadModal();
      setTimeout(function() {
        document.getElementById('l-event-date').value = date;
      }, 80);
    };
  });

  tableCard.querySelectorAll('.calendar-day-real[data-date]').forEach(function(day) {
    day.ondblclick = function(e) {
      if (e.target.classList.contains('calendar-event-pill')) return;
      if (e.target.classList.contains('calendar-add-btn')) return;

      var date = this.getAttribute('data-date');
      openLeadModal();
      setTimeout(function() {
        document.getElementById('l-event-date').value = date;
      }, 80);
    };
  });

  tableCard.querySelectorAll('.calendar-event-pill[data-event-id]').forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      openEventDetailsModal(parseInt(this.getAttribute('data-event-id')));
    };
  });
}

`;

s = s.slice(0, start) + block + s.slice(end);

fs.writeFileSync(p, s, 'utf8');

console.log('calendar complete final fixed');
