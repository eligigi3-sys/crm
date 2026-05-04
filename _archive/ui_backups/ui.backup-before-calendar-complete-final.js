export function serveHTML() {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CRM | אטרקציות לאירועים</title>
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#f0f2f5;--white:#fff;--border:#e2e6ea;--border2:#cdd3da;
  --accent:#7c3aed;--accent-light:#f5f3ff;--accent-dark:#5b21b6;
  --green:#16a34a;--green-light:#f0fdf4;
  --orange:#ea580c;--orange-light:#fff7ed;
  --blue:#2563eb;--blue-light:#eff6ff;
  --red:#dc2626;--red-light:#fef2f2;
  --yellow:#ca8a04;--yellow-light:#fefce8;
  --text:#111827;--text2:#6b7280;--text3:#9ca3af;
  --shadow:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 16px rgba(0,0,0,0.10);
  --radius:12px;--radius-sm:8px;--font:'Heebo',sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;direction:rtl}
#app{display:flex;min-height:100vh}
#sidebar{width:240px;background:var(--white);border-left:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;right:0;bottom:0;z-index:100;box-shadow:2px 0 8px rgba(0,0,0,0.04)}
#main{margin-right:240px;flex:1;padding:28px 32px}
.sidebar-logo{padding:20px 16px 16px;border-bottom:1px solid var(--border)}
.logo-row{display:flex;align-items:center;gap:10px}
.logo-icon{width:38px;height:38px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.logo-title{font-size:14px;font-weight:800;color:var(--text)}
.logo-sub{font-size:11px;color:var(--text3);margin-top:1px}
.nav-section{padding:14px 14px 4px;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:var(--radius-sm);margin:1px 8px;cursor:pointer;font-size:13.5px;color:var(--text2);transition:all 0.12s;font-weight:500}
.nav-item:hover{background:var(--bg);color:var(--text)}
.nav-item.active{background:var(--accent-light);color:var(--accent);font-weight:700}
.nav-icon{font-size:15px;width:22px;text-align:center}
.nav-badge{margin-right:auto;background:var(--accent);color:#fff;border-radius:20px;padding:1px 7px;font-size:10px;font-weight:700}
.sidebar-bottom{margin-top:auto;padding:12px;border-top:1px solid var(--border)}
.user-row{display:flex;align-items:center;gap:9px}
.user-avatar{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
.user-name{font-size:12px;font-weight:600;color:var(--text)}
.user-role{font-size:10px;color:var(--text3)}
.logout-btn{margin-right:auto;background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:11px;color:var(--text3);cursor:pointer;font-family:var(--font)}
.logout-btn:hover{color:var(--red);border-color:var(--red)}
.page{display:none}.page.active{display:block}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.page-title{font-size:20px;font-weight:800;color:var(--text)}
.page-title small{font-size:13px;color:var(--text3);font-weight:400;margin-right:8px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);display:flex;align-items:center;gap:12px}
.stat-icon-wrap{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.stat-card.purple .stat-icon-wrap{background:var(--accent-light)}
.stat-card.green .stat-icon-wrap{background:var(--green-light)}
.stat-card.orange .stat-icon-wrap{background:var(--orange-light)}
.stat-card.blue .stat-icon-wrap{background:var(--blue-light)}
.stat-label{font-size:10px;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px}
.stat-value{font-size:20px;font-weight:800}
.stat-card.purple .stat-value{color:var(--accent)}
.stat-card.green .stat-value{color:var(--green)}
.stat-card.orange .stat-value{color:var(--orange)}
.stat-card.blue .stat-value{color:var(--blue)}
.revenue-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;width:100%}
.rev-box{background:var(--bg);border-radius:var(--radius-sm);padding:8px 10px;text-align:center}
.rev-box-label{font-size:9px;color:var(--text3);font-weight:700;margin-bottom:3px}
.rev-box-value{font-size:13px;font-weight:800}
.rev-box.prev .rev-box-value{color:var(--text2)}
.rev-box.curr .rev-box-value{color:var(--blue)}
.rev-box.next .rev-box-value{color:var(--green)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:var(--radius-sm);font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all 0.12s;white-space:nowrap}
.btn-primary{background:var(--accent);color:#fff;box-shadow:0 2px 8px rgba(124,58,237,0.25)}
.btn-primary:hover{background:var(--accent-dark)}
.btn-secondary{background:var(--white);color:var(--text2);border:1px solid var(--border)}
.btn-secondary:hover{background:var(--bg)}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border)}
.btn-ghost:hover{color:var(--text);background:var(--bg)}
.btn-danger{background:var(--red-light);color:var(--red);border:1px solid rgba(220,38,38,0.15)}
.btn-danger:hover{background:#fee2e2}
.btn-sm{padding:5px 11px;font-size:12px}
.table-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.table-toolbar{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
table{width:100%;border-collapse:collapse}
th{padding:10px 14px;text-align:right;font-size:10px;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;border-bottom:1px solid var(--border);background:#fafbfc;white-space:nowrap}
td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:middle}
td.bold{color:var(--text);font-weight:600}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafbfc;cursor:pointer}
.empty-row td{text-align:center;padding:40px;color:var(--text3);font-size:14px}
.search-input{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 13px;font-family:var(--font);font-size:13px;color:var(--text);outline:none;width:220px;transition:all 0.15s}
.search-input:focus{border-color:var(--accent);background:var(--white);box-shadow:0 0 0 3px rgba(124,58,237,0.08)}
.search-input::placeholder{color:var(--text3)}
.filter-select{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 12px;font-family:var(--font);font-size:12px;color:var(--text2);outline:none;cursor:pointer}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap}
.badge-green{background:var(--green-light);color:var(--green)}
.badge-orange{background:var(--orange-light);color:var(--orange)}
.badge-red{background:var(--red-light);color:var(--red)}
.badge-blue{background:var(--blue-light);color:var(--blue)}
.badge-purple{background:var(--accent-light);color:var(--accent)}
.badge-gray{background:var(--bg);color:var(--text3);border:1px solid var(--border)}
.badge-yellow{background:var(--yellow-light);color:var(--yellow)}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal-overlay.open{display:flex}
.modal{background:var(--white);border-radius:16px;width:620px;max-width:96vw;max-height:92vh;overflow-y:auto;box-shadow:var(--shadow-md)}
.modal-header{padding:18px 24px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--white);z-index:1}
.modal-header h2{font-size:16px;font-weight:800;color:var(--text)}
.modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px}
.modal-close:hover{background:var(--bg)}
.modal-body{padding:18px 24px}
.modal-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;position:sticky;bottom:0;background:var(--white)}
.form-group{margin-bottom:13px}
.form-label{display:block;font-size:11px;color:var(--text2);margin-bottom:4px;font-weight:700}
.form-input,.form-select,.form-textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 13px;font-family:var(--font);font-size:13px;color:var(--text);outline:none;direction:rtl;transition:all 0.12s}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent);background:var(--white);box-shadow:0 0 0 3px rgba(124,58,237,0.08)}
.form-textarea{resize:vertical;min-height:68px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.form-section{margin:16px 0 8px;padding-bottom:5px;border-bottom:1px solid var(--border);font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px}
.check-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.check-item{display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all 0.12s;font-size:13px;background:var(--bg)}
.check-item:hover{border-color:var(--accent);background:var(--accent-light)}
.check-item.checked{border-color:var(--accent);background:var(--accent-light);color:var(--accent);font-weight:600}
.check-item input{display:none}
.dup-warning{background:var(--orange-light);border:1px solid rgba(234,88,12,0.3);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--orange);margin-top:5px;display:none;cursor:pointer}
.dup-warning:hover{background:#fed7aa}
.ac-dropdown{position:absolute;top:100%;right:0;left:0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);z-index:99;display:none;max-height:200px;overflow-y:auto}
.ac-item{padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);transition:background 0.1s}
.ac-item:last-child{border-bottom:none}
.ac-item:hover{background:var(--accent-light)}
.ac-item-name{font-weight:600;color:var(--text)}
.ac-item-sub{font-size:11px;color:var(--text3);margin-top:2px}
#login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#ede9fe 0%,#f5f3ff 50%,#eff6ff 100%)}
.login-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:40px;width:390px;box-shadow:var(--shadow-md)}
.login-top{text-align:center;margin-bottom:28px}
.login-icon{width:60px;height:60px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px}
.login-title{font-size:20px;font-weight:800;color:var(--text)}
.login-sub{font-size:13px;color:var(--text3);margin-top:4px}
.login-error{background:var(--red-light);border:1px solid rgba(220,38,38,0.2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--red);margin-bottom:14px;display:none}
.toast-container{position:fixed;bottom:20px;left:20px;z-index:999;display:flex;flex-direction:column;gap:8px}
.toast{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:11px 16px;font-size:13px;color:var(--text);display:flex;align-items:center;gap:10px;box-shadow:var(--shadow-md);animation:slideUp 0.2s ease}
.toast.success{border-color:rgba(22,163,74,0.3);background:var(--green-light);color:var(--green)}
.toast.error{border-color:rgba(220,38,38,0.3);background:var(--red-light);color:var(--red)}
@keyframes slideUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:4px}
.dash-section{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.dash-section-title{padding:12px 16px;border-bottom:1px solid var(--border);font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px}
.dash-item{padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;cursor:pointer}
.dash-item:last-child{border-bottom:none}
.dash-item:hover{background:var(--bg)}
.dash-item-name{font-size:13px;font-weight:600;color:var(--text)}
.dash-item-sub{font-size:11px;color:var(--text3);margin-top:1px}
.dash-empty{padding:24px;text-align:center;color:var(--text3);font-size:13px}
.mini-cal{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.cal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--accent);color:#fff}
.cal-title{font-size:14px;font-weight:700}
.cal-nav{background:rgba(255,255,255,0.2);border:none;color:#fff;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px;font-family:var(--font)}
.cal-nav:hover{background:rgba(255,255,255,0.35)}
.cal-grid{padding:8px}
.cal-days-header{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:2px}
.cal-day-name{text-align:center;font-size:9px;font-weight:700;color:var(--text3);padding:3px 0}
.cal-days{display:grid;grid-template-columns:repeat(7,1fr);gap:1px}
.cal-day{min-height:30px;border-radius:5px;display:flex;flex-direction:column;align-items:center;padding:2px;position:relative}
.cal-day.other-month{opacity:0.3}
.cal-day.has-event{background:var(--accent-light);cursor:pointer}
.cal-day.has-event:hover{background:#ede9fe}
.cal-day.has-follow{background:var(--orange-light);cursor:pointer}
.cal-day.has-both{background:linear-gradient(135deg,var(--accent-light) 50%,var(--orange-light) 50%);cursor:pointer}
.cal-day-num{font-size:10px;font-weight:600;color:var(--text);line-height:1.4}
.cal-today .cal-day-num{background:var(--accent);color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:9px}
.cal-dots{display:flex;gap:2px;justify-content:center;flex-wrap:wrap}
.cal-dot{width:4px;height:4px;border-radius:50%}
.cal-dot-e{background:var(--accent)}
.cal-dot-f{background:var(--orange)}
.cal-legend{display:flex;gap:10px;padding:6px 12px;border-top:1px solid var(--border);font-size:9px;color:var(--text3)}
.cal-legend-item{display:flex;align-items:center;gap:3px}
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:150;display:none}
.drawer-overlay.open{display:block}
.drawer{position:fixed;top:0;left:0;bottom:0;width:480px;background:var(--white);box-shadow:var(--shadow-md);z-index:151;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform 0.25s ease}
.drawer.open{transform:translateX(0)}
.drawer-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.drawer-title{font-size:15px;font-weight:800;color:var(--text)}
.drawer-body{flex:1;overflow-y:auto;padding:18px 20px}
.drawer-footer{padding:12px 20px;border-top:1px solid var(--border)}
.info-section{margin-bottom:18px}
.info-section-title{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border)}
.info-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:13px}
.info-label{color:var(--text3);font-weight:600;min-width:110px;flex-shrink:0;font-size:12px}
.info-value{color:var(--text);font-weight:500;flex:1}
.attraction-tags{display:flex;flex-wrap:wrap;gap:5px}
.attraction-tag{background:var(--accent-light);color:var(--accent);border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700}
.payment-box{background:var(--bg);border-radius:var(--radius-sm);padding:12px 14px}
.payment-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;font-size:13px}
.payment-row:last-child{margin-bottom:0}
.payment-label{color:var(--text3);font-weight:600}
.payment-value{font-weight:700;color:var(--text)}
.balance-due{color:var(--red);font-size:14px}
.balance-ok{color:var(--green);font-size:14px}
.note-item{background:var(--yellow-light);border-right:3px solid var(--yellow);border-radius:6px;padding:9px 12px;margin-bottom:7px;font-size:13px;color:var(--text)}
.note-date{font-size:10px;color:var(--text3);margin-top:3px}
.note-input-row{display:flex;gap:8px;width:100%}
.note-input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 12px;font-family:var(--font);font-size:13px;color:var(--text);outline:none}
.note-input:focus{border-color:var(--accent)}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px}
.dot-red{background:var(--red)}.dot-orange{background:var(--orange)}.dot-green{background:var(--green)}.dot-gray{background:var(--border2)}
.customer-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;transition:all 0.12s;display:flex;flex-direction:column;gap:8px}
.customer-card:hover{border-color:var(--accent);box-shadow:0 2px 8px rgba(124,58,237,0.1)}
.customer-card-name{font-size:14px;font-weight:700;color:var(--text)}
.customer-card-meta{font-size:12px;color:var(--text3)}
.customer-card-stats{display:flex;gap:8px;margin-top:4px}
.customer-stat-pill{background:var(--bg);border-radius:20px;padding:3px 10px;font-size:11px;color:var(--text2);font-weight:600}
.autocomplete-list{position:absolute;top:100%;right:0;left:0;background:var(--white);border:1px solid var(--accent);border-radius:var(--radius-sm);box-shadow:var(--shadow-md);z-index:300;max-height:200px;overflow-y:auto}
.autocomplete-item{padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border)}
.autocomplete-item:last-child{border-bottom:none}
.autocomplete-item:hover{background:var(--accent-light);color:var(--accent)}
.autocomplete-item-name{font-weight:600;color:var(--text)}
.autocomplete-item-sub{font-size:11px;color:var(--text3);margin-top:2px}
.form-group-rel{position:relative}
.contact-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;margin-bottom:16px}
.contact-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.contact-card-name{font-size:16px;font-weight:800;color:var(--text)}
.contact-card-meta{font-size:13px;color:var(--text3);margin-top:3px}
.contact-stats{display:flex;gap:16px;margin-bottom:14px}
.contact-stat{text-align:center;padding:10px 14px;background:var(--bg);border-radius:var(--radius-sm)}
.contact-stat-val{font-size:18px;font-weight:800;color:var(--accent)}
.contact-stat-label{font-size:10px;color:var(--text3);margin-top:2px}

/* ===== Mobile Responsive ===== */
@media (max-width: 768px) {
  #app {
    display: block;
  }

  #sidebar {
    position: fixed;
    top: auto;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 68px;
    flex-direction: row;
    align-items: center;
    border-left: none;
    border-top: 1px solid var(--border);
    z-index: 999;
  }

  .sidebar-logo,
  .nav-section,
  .sidebar-bottom,
  #gcal-status {
    display: none !important;
  }

  #sidebar .nav-item {
    flex: 1;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 8px 4px;
    border-radius: 0;
    font-size: 11px;
  }

  .nav-icon {
    font-size: 18px;
  }

  #main {
    margin-right: 0;
    padding: 16px 12px 86px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 14px;
  }

  .page-title {
    font-size: 20px;
  }

  .page-title small {
    display: block;
    margin-right: 0;
    margin-top: 4px;
    font-size: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .dash-grid,
  #page-dashboard > div[style*="grid-template-columns"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select,
  .form-input,
  .form-select {
    width: 100% !important;
    max-width: none !important;
  }

  #customers-grid > div {
    grid-template-columns: 1fr !important;
  }

  .customer-card {
    padding: 16px;
  }

  .customer-card-name {
    font-size: 18px;
  }

  .customer-card-meta {
    font-size: 13px;
  }

  .customer-card-stats {
    flex-wrap: wrap;
  }

  .customer-stat-pill {
    font-size: 12px;
    padding: 5px 10px;
  }

  table {
    min-width: 720px;
  }

  .table-card {
    overflow-x: auto;
  }

  .drawer {
    width: 100%;
  }

  .modal {
    width: 94vw;
    max-height: 90vh;
  }

  .form-row,
  .form-row-3,
  .check-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    position: static !important;
  }

  #customers-grid div[style*="grid-template-columns:360px 1fr"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  #main {
    padding: 12px 10px 84px;
  }

  .btn {
    justify-content: center;
  }

  .customer-card {
    border-radius: 14px;
  }

  .badge {
    font-size: 10px;
  }

  .page-title {
    font-size: 18px;
  }
}


/* ===== Final Mobile Responsive Fix ===== */
@media (max-width: 768px) {
  #main {
    margin-right: 0 !important;
    padding: 14px 10px 86px !important;
  }

  #sidebar {
    position: fixed !important;
    top: auto !important;
    bottom: 0 !important;
    right: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 68px !important;
    flex-direction: row !important;
    z-index: 9999 !important;
    border-top: 1px solid var(--border) !important;
  }

  .sidebar-logo,
  .nav-section,
  .sidebar-bottom,
  #gcal-status {
    display: none !important;
  }

  #sidebar .nav-item {
    flex: 1 !important;
    margin: 0 !important;
    padding: 7px 4px !important;
    border-radius: 0 !important;
    flex-direction: column !important;
    justify-content: center !important;
    font-size: 11px !important;
    gap: 2px !important;
  }

  .page-header {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }

  .table-toolbar {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .search-input,
  .filter-select,
  .form-input,
  .form-select {
    width: 100% !important;
    max-width: none !important;
  }

  #customers-grid > div {
    grid-template-columns: 1fr !important;
  }

  .customer-card {
    padding: 14px !important;
  }

  .customer-card-name {
    font-size: 17px !important;
  }

  .customer-card-meta,
  .info-row,
  .info-value {
    font-size: 13px !important;
  }

  .customer-card-stats {
    flex-wrap: wrap !important;
  }

  .contact-card {
    position: static !important;
    padding: 16px !important;
  }

  #customers-grid div[style*="grid-template-columns:360px 1fr"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .info-row {
    flex-direction: column !important;
    gap: 5px !important;
    align-items: stretch !important;
  }

  .info-label {
    min-width: 0 !important;
    font-size: 11px !important;
  }

  .info-value {
    width: 100% !important;
  }

  .info-value[style*="display:flex"],
  .info-row .info-value {
    flex-wrap: wrap !important;
  }

  #extra-contacts-row {
    display: block !important;
  }

  #extra-contacts-row .info-value > div {
    flex-wrap: wrap !important;
    width: 100% !important;
  }

  .modal {
    width: 94vw !important;
    max-height: 88vh !important;
    overflow-y: auto !important;
  }

  .modal-body {
    padding: 16px !important;
  }

  .modal-footer {
    flex-direction: column-reverse !important;
  }

  .modal-footer .btn {
    width: 100% !important;
    justify-content: center !important;
  }

  .drawer {
    width: 100% !important;
  }

  .table-card {
    overflow-x: auto !important;
  }

  table {
    min-width: 720px !important;
  }

  .stats-grid,
  .dash-grid,
  #page-dashboard > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }

  .form-row,
  .form-row-3,
  .check-grid {
    grid-template-columns: 1fr !important;
  }

  a[href^="https://wa.me"] img,
  a[href^="tel:"] img,
  a[href^="mailto:"] img {
    width: 30px !important;
    height: 30px !important;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px !important;
  }

  .badge {
    font-size: 10px !important;
    padding: 3px 8px !important;
  }

  .btn {
    font-size: 12px !important;
  }

  .contact-card-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }
}


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

</style>
</head>
<body>
<div id="login-page">
  <div class="login-card">
    <div class="login-top">
      <div class="login-icon">🎈</div>
      <div class="login-title">אטרקציות CRM</div>
      <div class="login-sub">ניהול לקוחות ואירועים</div>
    </div>
    <div class="login-error" id="login-error"></div>
    <div class="form-group"><label class="form-label">אימייל</label><input class="form-input" type="email" id="login-email" placeholder="your@email.com"></div>
    <div class="form-group"><label class="form-label">סיסמה</label><input class="form-input" type="password" id="login-password" placeholder=""></div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;margin-top:6px" id="login-btn">כניסה</button>
  </div>
</div>
<div id="app" style="display:none">
  <div id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-row">
        <div class="logo-icon">🎈</div>
        <div><div class="logo-title">אטרקציות CRM</div><div class="logo-sub">ניהול אירועים</div></div>
      </div>
    </div>
    <div class="nav-section">תפריט</div>
    <div class="nav-item active" id="nav-dashboard"><span class="nav-icon">📊</span> דאשבורד</div>
    <div class="nav-item" id="nav-leads"><span class="nav-icon">👥</span> לקוחות <span class="nav-badge" id="nav-leads-count" style="display:none">0</span></div>
    <div class="nav-item" id="nav-calendar"><span class="nav-icon">📅</span> יומן אירועים</div>
    <div id="gcal-status" style="margin:8px;padding:10px 12px;border-radius:8px;font-size:12px;display:none"></div>
    <div class="sidebar-bottom">
      <div class="user-row">
        <div class="user-avatar" id="user-avatar">מ</div>
        <div><div class="user-name" id="user-name">טוען...</div><div class="user-role">מנהל</div></div>
        <button class="logout-btn" id="logout-btn">יציאה</button>
      </div>
    </div>
  </div>
  <div id="main">
    <div id="page-dashboard" class="page active">
      <div class="page-header">
        <div class="page-title">שלום! 👋 <small id="dash-date"></small></div>
        <button class="btn btn-primary" id="btn-new-lead">+ ליד חדש</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card purple"><div class="stat-icon-wrap">👥</div><div><div class="stat-label">סה"כ לידים</div><div class="stat-value" id="stat-total">—</div></div></div>
        <div class="stat-card green"><div class="stat-icon-wrap">✅</div><div><div class="stat-label">עסקאות סגורות</div><div class="stat-value" id="stat-closed">—</div></div></div>
        <div class="stat-card orange"><div class="stat-icon-wrap">📋</div><div><div class="stat-label">הצעות מחיר</div><div class="stat-value" id="stat-quotes">—</div></div></div>
        <div class="stat-card blue" style="flex-direction:column;align-items:flex-start;gap:6px">
          <div style="display:flex;align-items:center;gap:10px"><div class="stat-icon-wrap">💰</div><div><div class="stat-label">הכנסות</div><div class="stat-value" id="stat-revenue">—</div></div></div>
          <div class="revenue-grid">
            <div class="rev-box prev"><div class="rev-box-label">חודש קודם</div><div class="rev-box-value" id="rev-prev">—</div></div>
            <div class="rev-box curr"><div class="rev-box-label">החודש</div><div class="rev-box-value" id="rev-curr">—</div></div>
            <div class="rev-box next"><div class="rev-box-label">חודש הבא</div><div class="rev-box-value" id="rev-next">—</div></div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:18px">
        <div class="dash-section"><div class="dash-section-title">🔔 מעקב — להתקשר היום</div><div id="dash-followups"><div class="dash-empty">טוען...</div></div></div>
        <div class="dash-section"><div class="dash-section-title">📅 אירועים קרובים</div><div id="dash-upcoming"><div class="dash-empty">טוען...</div></div></div>
        <div class="mini-cal" id="mini-cal"><div class="dash-empty">טוען...</div></div>
      </div>
      <div class="dash-section" style="margin-top:18px"><div class="dash-section-title">🕐 לידים אחרונים</div><div id="dash-recent"><div class="dash-empty">טוען...</div></div></div>
    </div>
    <div id="page-leads" class="page">
      <div class="page-header"><div class="page-title">לקוחות ולידים</div><button class="btn btn-primary" id="btn-new-lead2">+ ליד חדש</button></div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש שם / טלפון / אולם..." id="leads-search">
          <select class="filter-select" id="leads-status-filter"><option value="">כל הסטטוסים</option><option value="lead">ליד</option><option value="quote">הצעת מחיר</option><option value="closed">סגור</option><option value="cancelled">בוטל</option></select>
          <select class="filter-select" id="leads-event-filter"><option value="">כל סוגי האירועים</option><option>חתונה</option><option>בר מצווה</option><option>בת מצווה</option><option>יום הולדת</option><option>אירוע חברה</option><option>ברית</option><option>הפרשת חלה</option><option>אחר</option></select>
        </div>
        <table><thead><tr><th></th><th>שם לקוח</th><th>טלפון</th><th>סוג אירוע</th><th>תאריך</th><th>אולם</th><th>מחיר</th><th>סטטוס</th><th>מעקב הבא</th><th></th></tr></thead><tbody id="leads-body"><tr class="empty-row"><td colspan="10">טוען...</td></tr></tbody></table>
      </div>
    </div>
    <div id="page-customers" class="page">
      <div class="page-header">
        <div class="page-title">כרטיסי לקוח <small>לקוחות חוזרים וכל האירועים שלהם</small></div>
        <button class="btn btn-primary" id="btn-new-customer">+ לקוח חדש</button>
      </div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש לקוח לפי שם / טלפון / אימייל..." 
id="customers-search">
        <select id="customers-filter-status" onchange="loadCustomers()" class="form-input" style="max-width:140px;margin-right:8px">
          <option value="">כל הסטטוסים</option>
          <option value="hot">🔥 חם</option>
          <option value="cold">❄️ קר</option>
          <option value="offer">⏳ בהצעה</option>
          <option value="active">🟢 פעיל</option>
          <option value="closed">✅ סגור</option>
          <option value="cancelled">❌ בוטל</option>
        </select>

        <select id="customers-filter-type" onchange="loadCustomers()" class="form-input" style="max-width:140px;margin-right:8px">
          <option value="">כל הסוגים</option>
          <option value="פרטי">פרטי</option>
          <option value="עסקי">עסקי</option>
          <option value="מפיק/ספק">מפיק/ספק</option>
        </select>

        <select id="customers-sort" onchange="loadCustomers()" class="form-input" style="max-width:160px">
          <option value="">מיון</option>
          <option value="name">לפי שם</option>
          <option value="events">לפי מספר אירועים</option>
          <option value="revenue">לפי הכנסות</option>
          <option value="next_event">אירוע קרוב</option>
        </select>
>
        </div>
        <div id="customers-grid" style="padding:16px">
          <div class="dash-empty">טוען...</div>
        </div>
      </div>
    </div>
    <div id="page-calendar" class="page">
      <div class="page-header"><div class="page-title">יומן אירועים 📅</div></div>
      <div class="table-card">
        <table><thead><tr><th>תאריך</th><th>שם לקוח</th><th>סוג אירוע</th><th>אולם</th><th>שעה</th><th>אטרקציות</th><th>מחיר</th><th>סטטוס תשלום</th></tr></thead><tbody id="calendar-body"><tr class="empty-row"><td colspan="8">טוען...</td></tr></tbody></table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="modal-lead">
  <div class="modal">
    <div class="modal-header"><h2 id="modal-lead-title">ליד חדש</h2><button class="modal-close" id="modal-close-btn">✕</button></div>
    <div class="modal-body">
      <input type="hidden" id="lead-id">
      <div class="form-section">פרטי לקוח</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">שם לקוח *</label>
          <div style="position:relative">
            <input class="form-input" id="l-name" placeholder="ישראל ישראלי" autocomplete="off">
            <div id="ac-name" class="ac-dropdown"></div>
          </div>
          <div class="dup-warning" id="dup-name">טוען...</div>
        </div>
        <div class="form-group"><label class="form-label">טלפון</label>
          <div style="position:relative">
            <input class="form-input" id="l-phone" placeholder="050-0000000" type="tel" autocomplete="off">
            <div id="ac-phone" class="ac-dropdown"></div>
          </div>
          <div class="dup-warning" id="dup-phone">טוען...</div>
        </div>
      </div>
      <div class="form-group"><label class="form-label">אימייל</label>
        <div style="position:relative">
          <input class="form-input" id="l-email" placeholder="email@example.com" type="email" autocomplete="off">
          <div id="ac-email" class="ac-dropdown"></div>
        </div>
      </div>
      <div class="form-section">פרטי האירוע</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">סוג אירוע</label><select class="form-select" id="l-event-type"><option value="">בחר סוג...</option><option>חתונה</option><option>בר מצווה</option><option>בת מצווה</option><option>יום הולדת</option><option>אירוע חברה</option><option>ברית</option><option>הפרשת חלה</option><option>אחר</option></select></div>
        <div class="form-group"><label class="form-label">סטטוס</label><select class="form-select" id="l-status"><option value="lead">ליד</option><option value="quote">הצעת מחיר</option><option value="closed">סגור</option><option value="cancelled">בוטל</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">תאריך אירוע</label><input class="form-input" id="l-event-date" type="date"></div>
        <div class="form-group"><label class="form-label">שעה</label><input class="form-input" id="l-event-time" type="time"></div>
      </div>
      <div class="form-group"><label class="form-label">אולם / מיקום</label><input class="form-input" id="l-venue" placeholder="שם האולם / עיר"></div>
      <div class="form-section">אטרקציות</div>
      <div class="check-grid" id="attractions-grid">
        <label class="check-item"><input type="checkbox" value="בלונים"> 🎈 בלונים</label>
        <label class="check-item"><input type="checkbox" value="עמדת צילום"> 📸 עמדת צילום</label>
        <label class="check-item"><input type="checkbox" value="צילום מגנטים"> 🧲 צילום מגנטים</label>
        <label class="check-item"><input type="checkbox" value="זיקוקים"> 🎆 זיקוקים</label>
      </div>
      <div class="form-section">כספים</div>
      <div class="form-row-3">
        <div class="form-group"><label class="form-label">מחיר סופי (₪)</label><input class="form-input" id="l-price" type="number" placeholder="0"></div>
        <div class="form-group"><label class="form-label">מקדמה ששולמה (₪)</label><input class="form-input" id="l-deposit" type="number" placeholder="0"></div>
        <div class="form-group"><label class="form-label">תאריך מקדמה</label><input class="form-input" id="l-deposit-date" type="date"></div>
      </div>
      <div class="form-group"><label class="check-item" id="balance-paid-check" style="display:inline-flex;width:auto"><input type="checkbox" id="l-balance-paid"> יתרה שולמה במלואה</label></div>
      <div class="form-section">מעקב</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">תאריך קשר אחרון</label><input class="form-input" id="l-last-contact" type="date"></div>
        <div class="form-group"><label class="form-label">תאריך קשר הבא</label><input class="form-input" id="l-next-contact" type="date"></div>
      </div>
      <div class="form-section">פרטים נוספים</div>
      <div class="form-group"><label class="form-label">פרטי אירוע</label><textarea class="form-textarea" id="l-details" placeholder="פרטים נוספים..."></textarea></div>
      <div class="form-group"><label class="form-label">הערות פנימיות</label><textarea class="form-textarea" id="l-notes" placeholder="הערות..."></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" id="modal-cancel-btn">ביטול</button><button class="btn btn-primary" id="modal-save-btn">שמור</button></div>
  </div>
</div>
<div class="modal-overlay" id="modal-customer">
  <div class="modal" style="width:760px">
    <div class="modal-header">
      <h2 id="customer-modal-title">כרטיס לקוח</h2>
      <button class="modal-close" id="customer-modal-close">✕</button>
    </div>
    <div class="modal-body" id="customer-modal-body">טוען...</div>
  </div>
</div>
<div class="drawer-overlay" id="drawer-overlay"></div>
<div class="drawer" id="lead-drawer">
  <div class="drawer-header">
    <div class="drawer-title" id="drawer-title">פרטי לקוח</div>
    <div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" id="drawer-edit-btn">עריכה</button><button class="btn btn-ghost btn-sm" id="drawer-sync-btn" title="סנכרן ל-Google Calendar" style="display:none">📅 סנכרן</button><button class="modal-close" id="drawer-close-btn">✕</button></div>
  </div>
  <div class="drawer-body" id="drawer-body">טוען...</div>
  <div class="drawer-footer"><div class="note-input-row"><input class="note-input" id="new-note-input" placeholder="הוסף הערה..."><button class="btn btn-primary btn-sm" id="add-note-btn">הוסף</button></div></div>
</div>
<div class="toast-container" id="toasts"></div>
<script>
var token = localStorage.getItem('crm_token');
var currentUser = JSON.parse(localStorage.getItem('crm_user') || 'null');
var searchTimer, currentLeadId, dupLeadId, selectedContactId = null;
var allLeadsCache = [];
var calYear, calMonth;


function getCustomerStatusBadgeClass(status) { var map = { hot:"badge-red", cold:"badge-blue", offer:"badge-orange", active:"badge-green", closed:"badge-green", cancelled:"badge-gray" }; return map[status] || "badge-green"; }

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

function init() {
  var now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  var el = document.getElementById('dash-date');
  if (el) el.textContent = now.toLocaleDateString('he-IL', {weekday:'long',day:'numeric',month:'long',year:'numeric'});

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('btn-new-lead').addEventListener('click', function() {
  goTo('customers', document.getElementById('nav-leads'));
});

document.getElementById('btn-new-lead2').addEventListener('click', function() {
  goTo('customers', document.getElementById('nav-leads'));
});  document.getElementById('modal-close-btn').addEventListener('click', closeLeadModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeLeadModal);
  document.getElementById('modal-save-btn').addEventListener('click', saveLead);
  document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
  document.getElementById('drawer-sync-btn').addEventListener('click', function() { if (currentLeadId) syncToGoogle(currentLeadId); });
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('drawer-edit-btn').addEventListener('click', function() { if (currentLeadId) editLead(currentLeadId); });
  document.getElementById('add-note-btn').addEventListener('click', addNote);
  document.getElementById('nav-dashboard').addEventListener('click', function() { goTo('dashboard', this); });
  document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });
  document.getElementById('nav-calendar').addEventListener('click', function() { goTo('calendar', this); });
  var navCustomers = document.getElementById('nav-customers');
  if (navCustomers) navCustomers.addEventListener('click', function() { goTo('customers', this); });
  document.getElementById('leads-search').addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function() { loadLeads(); }, 300);
  });
  document.getElementById('leads-status-filter').addEventListener('change', loadLeads);
  document.getElementById('leads-event-filter').addEventListener('change', loadLeads);
  document.getElementById('new-note-input').addEventListener('keydown', function(e) { if (e.key === 'Enter') addNote(); });
  document.getElementById('l-name').addEventListener('input', function() { checkDup('name', this.value); });
  document.getElementById('l-phone').addEventListener('input', function() { checkDup('phone', this.value); });
  document.getElementById('l-balance-paid').addEventListener('change', function() {
    document.getElementById('balance-paid-check').classList.toggle('checked', this.checked);
  });
  document.querySelectorAll('#attractions-grid .check-item').forEach(function(el) {
    el.addEventListener('click', function() {
      var cb = this.querySelector('input');
      cb.checked = !cb.checked;
      this.classList.toggle('checked', cb.checked);
    });
  });
  document.getElementById('dup-name').addEventListener('click', openDupLead);
  document.getElementById('dup-phone').addEventListener('click', openDupLead);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeLeadModal(); closeDrawer(); closeCustomerModal(); }
  });

  if (token && currentUser) showApp();
}

function goTo(page, el) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  pageEl.classList.add('active');
  if (el) el.classList.add('active');
  if (page === 'dashboard') loadDashboard();
  if (page === 'leads') loadLeads();
  if (page === 'calendar') loadCalendar();
  if (page === 'customers') loadCustomers();
}

function apiCall(method, path, body) {
  var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body) opts.body = JSON.stringify(body);
  return fetch(path, opts).then(function(res) { return res.json(); }).then(function(data) {
    if (data.error) throw new Error(data.error);
    return data;
  });
}

function doLogin() {
  var email = document.getElementById('login-email').value;
  var password = document.getElementById('login-password').value;
  var errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  apiCall('POST', '/api/auth/login', { email: email, password: password }).then(function(res) {
    token = res.token;
    currentUser = res.user;
    localStorage.setItem('crm_token', token);
    localStorage.setItem('crm_user', JSON.stringify(currentUser));
    showApp();
  }).catch(function(e) {
    errEl.textContent = e.message || 'שגיאה בכניסה';
    errEl.style.display = 'block';
  });
}

function showApp() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('user-name').textContent = currentUser ? currentUser.name : '';
  document.getElementById('user-avatar').textContent = currentUser ? currentUser.name[0] : 'מ';
  loadDashboard();
  preloadLeads();
  checkGoogleStatus();
}

function logout() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_user');
  token = null; currentUser = null;
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function preloadLeads() {
  apiCall('GET', '/api/leads').then(function(data) {
    allLeadsCache = data.leads || [];
  }).catch(function() {});
}

var dupTimer;
function checkDup(field, value) {
  clearTimeout(dupTimer);
  document.getElementById('dup-' + field).style.display = 'none';
  if (!value || value.length < 2) return;
  dupTimer = setTimeout(function() {
    var editId = document.getElementById('lead-id').value;
    var val = value.trim().toLowerCase();
    var found = null;
    for (var i = 0; i < allLeadsCache.length; i++) {
      var l = allLeadsCache[i];
      if (editId && String(l.id) === String(editId)) continue;
      if (field === 'name' && l.name && l.name.toLowerCase().indexOf(val) !== -1) { found = l; break; }
      if (field === 'phone' && l.phone && l.phone.replace(/[-\s]/g,'').indexOf(val.replace(/[-\s]/g,'')) !== -1) { found = l; break; }
    }
    if (found) {
      dupLeadId = found.id;
      var el = document.getElementById('dup-' + field);
      el.textContent = field === 'name' ? ('לקוח "' + found.name + '" כבר קיים — לחץ לפתיחה') : ('טלפון זה שייך ל-"' + found.name + '" — לחץ לפתיחה');
      el.style.display = 'block';
    }
  }, 400);
}

function openDupLead() {
  if (!dupLeadId) return;

  apiCall('GET', '/api/leads/' + dupLeadId).then(function(data) {
    var l = data.lead || {};

    if (l.contact_id) {
      closeLeadModal();
      openCustomerCard(parseInt(l.contact_id));
      return;
    }

    var q = l.phone || l.email || l.name || '';
    return apiCall('GET', '/api/contacts?search=' + encodeURIComponent(q)).then(function(res) {
      if (res.contacts && res.contacts.length) {
        closeLeadModal();
        openCustomerCard(parseInt(res.contacts[0].id));
      } else {
        toast('נמצא ליד קיים, אבל עדיין אין לו כרטיס לקוח', 'error');
      }
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

function loadDashboard() {
  apiCall('GET', '/api/dashboard').then(function(d) {
    document.getElementById('stat-total').textContent = d.stats.total;
    document.getElementById('stat-closed').textContent = d.stats.closed;
    document.getElementById('stat-quotes').textContent = d.stats.quotes;
    document.getElementById('stat-revenue').textContent = 'R' + fmtMoney(d.stats.revenue);
    document.getElementById('rev-prev').textContent = 'R' + fmtMoney(d.stats.rev_prev || 0);
    document.getElementById('rev-curr').textContent = 'R' + fmtMoney(d.stats.rev_curr || 0);
    document.getElementById('rev-next').textContent = 'R' + fmtMoney(d.stats.rev_next || 0);
    // fix shekel sign
    ['stat-revenue','rev-prev','rev-curr','rev-next'].forEach(function(id) {
      document.getElementById(id).textContent = document.getElementById(id).textContent.replace('R','₪');
    });
    var nb = document.getElementById('nav-leads-count');
    if (d.stats.leads > 0) { nb.textContent = d.stats.leads; nb.style.display = ''; }
    var fuEl = document.getElementById('dash-followups');
    fuEl.innerHTML = d.followUps.length ? d.followUps.map(function(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.event_type||'') + (l.event_date ? ' - ' + formatDate(l.event_date) : '') + '</div></div>' + statusBadge(l.status) + '</div>';
    }).join('') : '<div class="dash-empty">אין מעקבים להיום</div>';
    var upEl = document.getElementById('dash-upcoming');
    upEl.innerHTML = d.upcoming.length ? d.upcoming.map(function(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.event_type||'') + ' - ' + (l.venue||'') + '</div></div><span style="font-size:12px;font-weight:700;color:var(--accent)">' + formatDate(l.event_date) + '</span></div>';
    }).join('') : '<div class="dash-empty">אין אירועים קרובים</div>';
    var recEl = document.getElementById('dash-recent');
    recEl.innerHTML = d.recentLeads.length ? d.recentLeads.map(function(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.phone||'') + (l.event_type ? ' - ' + l.event_type : '') + '</div></div>' + statusBadge(l.status) + '</div>';
    }).join('') : '<div class="dash-empty">אין לידים עדיין</div>';
    document.querySelectorAll('.dash-item[data-id]').forEach(function(el) {
      el.addEventListener('click', function() { openDrawer(parseInt(this.getAttribute('data-id'))); });
    });
    allLeadsCache = d.allLeads || allLeadsCache;
    renderMiniCal(d.allLeads || []);
  }).catch(function(e) { toast(e.message, 'error'); });
}

function renderMiniCal(leads) {
  var cal = document.getElementById('mini-cal');
  var monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var dayNames = ['א','ב','ג','ד','ה','ו','ש'];
  var year = calYear, month = calMonth;
  var eventMap = {}, followMap = {};
  leads.forEach(function(l) {
    if (l.event_date) { var d = l.event_date.substring(0,10); if (!eventMap[d]) eventMap[d] = []; eventMap[d].push(l); }
    if (l.next_contact) { var d = l.next_contact.substring(0,10); if (!followMap[d]) followMap[d] = []; followMap[d].push(l); }
  });
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var daysInPrev = new Date(year, month, 0).getDate();
  var todayStr = new Date().toISOString().split('T')[0];
  var daysHTML = '';
  for (var i = firstDay - 1; i >= 0; i--) {
    daysHTML += '<div class="cal-day other-month"><span class="cal-day-num">' + (daysInPrev - i) + '</span></div>';
  }
  for (var d = 1; d <= daysInMonth; d++) {
    var ds = year + '-' + pad2(month+1) + '-' + pad2(d);
    var ev = eventMap[ds] || [], fl = followMap[ds] || [];
    var isToday = ds === todayStr;
    var cls = 'cal-day' + (isToday ? ' cal-today' : '') + (ev.length && fl.length ? ' has-both' : ev.length ? ' has-event' : fl.length ? ' has-follow' : '');
    var dots = ev.slice(0,2).map(function() { return '<div class="cal-dot cal-dot-e"></div>'; }).join('') + fl.slice(0,2).map(function() { return '<div class="cal-dot cal-dot-f"></div>'; }).join('');
    var dataId = (ev.length === 1 && !fl.length) ? ev[0].id : (fl.length === 1 && !ev.length) ? fl[0].id : '';
    daysHTML += '<div class="' + cls + '"' + (dataId ? ' data-calid="' + dataId + '"' : '') + '>';
    daysHTML += '<span class="cal-day-num">' + d + '</span>';
    if (dots) daysHTML += '<div class="cal-dots">' + dots + '</div>';
    daysHTML += '</div>';
  }
  var total = firstDay + daysInMonth;
  var rem = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (var i = 1; i <= rem; i++) {
    daysHTML += '<div class="cal-day other-month"><span class="cal-day-num">' + i + '</span></div>';
  }
  cal.innerHTML = '<div class="cal-header"><button class="cal-nav" id="cal-prev">&#x203A;</button><div class="cal-title">' + monthNames[month] + ' ' + year + '</div><button class="cal-nav" id="cal-next">&#x2039;</button></div><div class="cal-grid"><div class="cal-days-header">' + dayNames.map(function(n) { return '<div class="cal-day-name">' + n + '</div>'; }).join('') + '</div><div class="cal-days">' + daysHTML + '</div></div><div class="cal-legend"><div class="cal-legend-item"><div class="cal-dot cal-dot-e"></div> אירוע</div><div class="cal-legend-item"><div class="cal-dot cal-dot-f"></div> מעקב</div></div>';
  document.getElementById('cal-prev').addEventListener('click', function() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderMiniCal(allLeadsCache); });
  document.getElementById('cal-next').addEventListener('click', function() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderMiniCal(allLeadsCache); });
  cal.querySelectorAll('.cal-day[data-calid]').forEach(function(el) {
    el.addEventListener('click', function() { openDrawer(parseInt(this.getAttribute('data-calid'))); });
  });
}

function pad2(n) { return n < 10 ? '0' + n : String(n); }

function loadLeads() {
  var s = document.getElementById('leads-search').value || '';
  var status = document.getElementById('leads-status-filter').value || '';
  var eventType = document.getElementById('leads-event-filter').value || '';
  apiCall('GET', '/api/leads?search=' + encodeURIComponent(s) + '&status=' + encodeURIComponent(status)).then(function(data) {
    allLeadsCache = data.leads || [];
    var leads = data.leads;
    if (eventType) leads = leads.filter(function(l) { return l.event_type === eventType; });
    var tbody = document.getElementById('leads-body');
    if (!leads.length) { tbody.innerHTML = '<tr class="empty-row"><td colspan="10">לא נמצאו לידים</td></tr>'; return; }
    tbody.innerHTML = leads.map(function(l) {
      var payBadge = l.price > 0 ? (l.balance_paid ? '<span class="badge badge-green">שולם</span>' : (l.deposit > 0 ? '<span class="badge badge-yellow">מקדמה</span>' : '<span class="badge badge-red">טרם שולם</span>')) : '';
      return '<tr data-id="' + l.id + '"><td><div class="dot ' + getUrgencyDot(l.next_contact) + '"></div></td><td class="bold">' + l.name + '</td><td>' + (l.phone||'—') + '</td><td>' + (l.event_type||'—') + '</td><td>' + (l.event_date?formatDate(l.event_date):'—') + '</td><td>' + (l.venue||'—') + '</td><td>' + (l.price?'₪'+fmtMoney(l.price):payBadge||'—') + '</td><td>' + statusBadge(l.status) + '</td><td style="font-size:12px;' + (isOverdue(l.next_contact)?'color:var(--red);font-weight:700':'') + '">' + (l.next_contact?formatDate(l.next_contact):'—') + '</td><td><button class="btn btn-ghost btn-sm edit-btn" data-id="' + l.id + '">עריכה</button> <button class="btn btn-danger btn-sm del-btn" data-id="' + l.id + '">מחיקה</button></td></tr>';
    }).join('');
    tbody.querySelectorAll('tr[data-id]').forEach(function(row) {
      row.addEventListener('click', function(e) { if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('del-btn')) openDrawer(parseInt(this.getAttribute('data-id'))); });
    });
    tbody.querySelectorAll('.edit-btn').forEach(function(btn) { btn.addEventListener('click', function(e) { e.stopPropagation(); editLead(parseInt(this.getAttribute('data-id'))); }); });
    tbody.querySelectorAll('.del-btn').forEach(function(btn) { btn.addEventListener('click', function(e) { e.stopPropagation(); deleteLead(parseInt(this.getAttribute('data-id'))); }); });
  }).catch(function(e) { toast(e.message, 'error'); });
}



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

  leads.forEach(function(l) {
    var d = (l.event_date || '').substring(0,10);
    if (!eventMap[d]) eventMap[d] = [];
    eventMap[d].push(l);
  });

  var html = '';
  html += '<div class="calendar-month-wrap">';
  html += '<div class="calendar-top">';
  html += '<div class="calendar-title">' + monthNames[month] + ' ' + year + '</div>';
  
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

function openDrawer(id) {
  currentLeadId = id;
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('lead-drawer').classList.add('open');
  document.getElementById('drawer-body').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">טוען...</div>';
  apiCall('GET', '/api/leads/' + id).then(function(data) { renderDrawer(data.lead, data.notes); }).catch(function(e) { toast(e.message, 'error'); });
}

function renderDrawer(l, notes) {
  document.getElementById('drawer-title').textContent = 'אירוע #' + (l.lead_num || l.id) + ' · ' + l.name;
  var attrs = safeJSON(l.attractions);
  var balance = (l.price||0) - (l.deposit||0);
  var html = '<div class="info-section"><div style="display:flex;gap:8px;margin-bottom:12px"><span class="badge badge-purple">אירוע #' + (l.lead_num || l.id) + '</span>' + statusBadge(l.status) + (l.event_type ? '<span class="badge badge-purple">' + l.event_type + '</span>' : '') + '</div>';
  html += '<div class="info-section-title">פרטי לקוח</div>';
'<div class="info-row">' +
  '<span class="info-label">טלפון</span>' +
  '<span class="info-value" style="display:flex;align-items:center;gap:8px">' +

    '<span style="font-weight:600;color:var(--text)">' + (c.phone || '') + '</span>' +

    (c.phone ? 
      '<a onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + 
      String(c.phone).replace(/[^0-9]/g,'').replace(/^0/,'972') + '">' +
      '<img src="/whatsapp-icon.png" style="width:30px;height:30px">' +
      '</a>' 
    : '') +

    (c.phone ? 
      '<a onclick="event.stopPropagation()" href="tel:' + c.phone + '">' +
      '<img src="/phone-icon.png" style="width:30px;height:30px">' +
      '</a>' 
    : '') +

  '</span>' +
'</div>'    (c.phone ? '<a onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + String(c.phone).replace(/[^0-9]/g,'').replace(/^0/,'972') + '"><img src="/whatsapp-icon.png" style="width:28px;height:28px"></a>' : '') +
    (c.phone ? '<a onclick="event.stopPropagation()" href="tel:' + c.phone + '"><img src="/phone-icon.png" style="width:28px;height:28px"></a>' : '') +
  '</span></div>';
  html += '<div class="info-row"><span class="info-label">אימייל</span><span class="info-value">' + (l.email||'—') + '</span></div></div>';
  html += '<div class="info-section"><div class="info-section-title">פרטי האירוע</div>';
  html += '<div class="info-row"><span class="info-label">תאריך</span><span class="info-value" style="font-weight:700;color:var(--accent)">' + (l.event_date?formatDate(l.event_date):'—') + '</span></div>';
  html += '<div class="info-row"><span class="info-label">שעה</span><span class="info-value">' + (l.event_time||'—') + '</span></div>';
  html += '<div class="info-row"><span class="info-label">אולם</span><span class="info-value">' + (l.venue||'—') + '</span></div>';
  if (attrs.length) html += '<div class="info-row"><span class="info-label">אטרקציות</span><div class="attraction-tags">' + attrs.map(function(a) { return '<span class="attraction-tag">' + a + '</span>'; }).join('') + '</div></div>';
  if (l.details) html += '<div class="info-row"><span class="info-label">פרטים</span><span class="info-value">' + l.details + '</span></div>';
  html += '</div><div class="info-section"><div class="info-section-title">כספים</div><div class="payment-box">';
  html += '<div class="payment-row"><span class="payment-label">מחיר סופי</span><span class="payment-value">₪' + fmtMoney(l.price||0) + '</span></div>';
  html += '<div class="payment-row"><span class="payment-label">מקדמה</span><span class="payment-value" style="color:var(--green)">₪' + fmtMoney(l.deposit||0) + (l.deposit_date?' ('+formatDate(l.deposit_date)+')':'') + '</span></div>';
  html += '<div class="payment-row" style="border-top:1px solid var(--border2);padding-top:8px;margin-top:4px"><span class="payment-label">יתרה</span><span class="' + (l.balance_paid?'balance-ok':'balance-due') + '">' + (l.balance_paid ? 'שולם במלואו' : '₪'+fmtMoney(balance)) + '</span></div></div></div>';
  html += '<div class="info-section"><div class="info-section-title">מעקב</div>';
  html += '<div class="info-row"><span class="info-label">קשר אחרון</span><span class="info-value">' + (l.last_contact?formatDate(l.last_contact):'—') + '</span></div>';
  html += '<div class="info-row"><span class="info-label">קשר הבא</span><span class="info-value" style="' + (isOverdue(l.next_contact)?'color:var(--red);font-weight:700':'') + '">' + (l.next_contact?formatDate(l.next_contact):'—') + '</span></div>';
  if (l.notes) html += '<div class="info-row"><span class="info-label">הערות</span><span class="info-value">' + l.notes + '</span></div>';
  html += '</div><div class="info-section"><div class="info-section-title">יומן הערות (' + notes.length + ')</div>';
  html += notes.length ? notes.map(function(n) { return '<div class="note-item">' + n.note + '<div class="note-date">' + fmtDT(n.created_at) + '</div></div>'; }).join('') : '<div style="color:var(--text3);font-size:13px">אין הערות עדיין</div>';
  html += '</div>';
  document.getElementById('drawer-body').innerHTML = html;
}

function closeDrawer() {
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('lead-drawer').classList.remove('open');
  currentLeadId = null;
}

function addNote() {
  var input = document.getElementById('new-note-input');
  var note = input.value.trim();
  if (!note || !currentLeadId) return;
  apiCall('POST', '/api/leads/' + currentLeadId + '/notes', { note: note }).then(function() {
    input.value = '';
    return apiCall('GET', '/api/leads/' + currentLeadId);
  }).then(function(data) { renderDrawer(data.lead, data.notes); toast('הערה נוספה', 'success'); }).catch(function(e) { toast(e.message, 'error'); });
}

var acSetupDone = false;
function openLeadModal() {
  if (!acSetupDone) { setupAutocomplete(); acSetupDone = true; }
  document.getElementById('lead-id').value = '';
  document.getElementById('modal-lead-title').textContent = 'ליד חדש';
  ['l-name','l-phone','l-email','l-venue','l-details','l-notes','l-price','l-deposit'].forEach(function(id) { document.getElementById(id).value = ''; });
  ['l-event-date','l-event-time','l-deposit-date','l-last-contact','l-next-contact'].forEach(function(id) { document.getElementById(id).value = ''; });
  document.getElementById('l-event-type').value = '';
  document.getElementById('l-status').value = 'lead';
  document.getElementById('l-balance-paid').checked = false;
  document.getElementById('balance-paid-check').classList.remove('checked');
  document.getElementById('dup-name').style.display = 'none';
  document.getElementById('dup-phone').style.display = 'none';
  document.querySelectorAll('#attractions-grid .check-item').forEach(function(el) { el.classList.remove('checked'); el.querySelector('input').checked = false; });
  setupAutocomplete();
  document.getElementById('modal-lead').classList.add('open');
}

function closeLeadModal() { document.getElementById('modal-lead').classList.remove('open'); }

function editLead(id) {
  apiCall('GET', '/api/leads/' + id).then(function(data) {
    var l = data.lead;
    document.getElementById('lead-id').value = l.id;
    document.getElementById('modal-lead-title').textContent = 'עריכת ליד';
    document.getElementById('l-name').value = l.name||'';
    document.getElementById('l-phone').value = l.phone||'';
    document.getElementById('l-email').value = l.email||'';
    document.getElementById('l-event-type').value = l.event_type||'';
    document.getElementById('l-status').value = l.status||'lead';
    document.getElementById('l-event-date').value = l.event_date||'';
    document.getElementById('l-event-time').value = l.event_time||'';
    document.getElementById('l-venue').value = l.venue||'';
    document.getElementById('l-price').value = l.price||'';
    document.getElementById('l-deposit').value = l.deposit||'';
    document.getElementById('l-deposit-date').value = l.deposit_date||'';
    document.getElementById('l-balance-paid').checked = !!l.balance_paid;
    document.getElementById('balance-paid-check').classList.toggle('checked', !!l.balance_paid);
    document.getElementById('l-last-contact').value = l.last_contact||'';
    document.getElementById('l-next-contact').value = l.next_contact||'';
    document.getElementById('l-details').value = l.details||'';
    document.getElementById('l-notes').value = l.notes||'';
    document.getElementById('dup-name').style.display = 'none';
    document.getElementById('dup-phone').style.display = 'none';
    var attrs = safeJSON(l.attractions);
    document.querySelectorAll('#attractions-grid .check-item').forEach(function(el) {
      var val = el.querySelector('input').value;
      el.classList.toggle('checked', attrs.indexOf(val) !== -1);
      el.querySelector('input').checked = attrs.indexOf(val) !== -1;
    });
    document.getElementById('modal-lead').classList.add('open');
  }).catch(function(e) { toast(e.message, 'error'); });
}

function saveLead() {
  var id = document.getElementById('lead-id').value;
  var attrs = [];
  document.querySelectorAll('#attractions-grid input:checked').forEach(function(i) { attrs.push(i.value); });
  var body = {
    name: document.getElementById('l-name').value,
    phone: document.getElementById('l-phone').value,
    email: document.getElementById('l-email').value,
    event_type: document.getElementById('l-event-type').value,
    status: document.getElementById('l-status').value,
    event_date: document.getElementById('l-event-date').value,
    event_time: document.getElementById('l-event-time').value,
    venue: document.getElementById('l-venue').value,
    attractions: attrs,
    price: parseFloat(document.getElementById('l-price').value)||0,
    deposit: parseFloat(document.getElementById('l-deposit').value)||0,
    deposit_date: document.getElementById('l-deposit-date').value,
    balance_paid: document.getElementById('l-balance-paid').checked,
    last_contact: document.getElementById('l-last-contact').value,
    next_contact: document.getElementById('l-next-contact').value,
    details: document.getElementById('l-details').value,
    notes: document.getElementById('l-notes').value
  };
  if (!body.name) { toast('שם לקוח חובה', 'error'); return; }
  var req = id ? apiCall('PUT', '/api/leads/' + id, body) : apiCall('POST', '/api/leads', body);
  req.then(function() {
    closeLeadModal();
    loadLeads();
    loadDashboard();
    preloadLeads();
    toast(id ? 'ליד עודכן בהצלחה' : 'ליד נוסף בהצלחה', 'success');
  }).catch(function(e) { toast(e.message, 'error'); });
}

function deleteLead(id) {
  if (!confirm('למחוק ליד זה?')) return;
  apiCall('DELETE', '/api/leads/' + id).then(function() { loadLeads(); preloadLeads(); toast('נמחק', 'success'); }).catch(function(e) { toast(e.message, 'error'); });
}

function formatDate(d) { if (!d) return '—'; var p = d.substring(0,10).split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
function fmtDT(d) { if (!d) return '—'; return new Date(d).toLocaleString('he-IL'); }
function isOverdue(d) { if (!d) return false; return d.substring(0,10) < new Date().toISOString().split('T')[0]; }
function getUrgencyDot(nc) { if (!nc) return 'dot-gray'; var t = new Date().toISOString().split('T')[0]; if (nc < t) return 'dot-red'; var tm = new Date(Date.now()+86400000).toISOString().split('T')[0]; return nc <= tm ? 'dot-orange' : 'dot-green'; }
function safeJSON(v) { try { var r = JSON.parse(v); return Array.isArray(r)?r:[]; } catch(e) { return []; } }
function fmtMoney(n) { return Number(n||0).toLocaleString('he-IL'); }
function statusBadge(s) { var m={lead:'badge-blue',quote:'badge-orange',closed:'badge-green',cancelled:'badge-gray'}; var l={lead:'ליד',quote:'הצעת מחיר',closed:'סגור',cancelled:'בוטל'}; return '<span class="badge '+(m[s]||'badge-gray')+'">'+(l[s]||s)+'</span>'; }
function toast(msg, type) { type = type||'success'; var c = document.getElementById('toasts'); var el = document.createElement('div'); el.className = 'toast '+type; el.textContent = msg; c.appendChild(el); setTimeout(function() { el.remove(); }, 3000); }


// ---- Google Calendar ----
function checkGoogleStatus() {
  apiCall('GET', '/api/google/status').then(function(data) {
    var el = document.getElementById('gcal-status');
    if (data.connected) {
      el.style.display = 'block';
      el.style.background = '#f0fdf4';
      el.style.border = '1px solid #bbf7d0';
      el.innerHTML = '<span style="color:#16a34a;font-weight:600">✓ Google Calendar מחובר</span><br><button onclick="disconnectGoogle()" style="margin-top:6px;font-size:11px;background:none;border:none;color:#dc2626;cursor:pointer">נתק חיבור</button>';
      document.getElementById('drawer-sync-btn').style.display = '';
    } else {
      el.style.display = 'block';
      el.style.background = '#eff6ff';
      el.style.border = '1px solid #bfdbfe';
      el.innerHTML = '<span style="color:#2563eb">📅 Google Calendar לא מחובר</span><br><button onclick="connectGoogle()" style="margin-top:6px;font-size:11px;background:var(--blue);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">חבר יומן</button>';
    }
  }).catch(function() {});
}

function connectGoogle() {
  apiCall('GET', '/api/google/auth-url').then(function(data) {
    window.location.href = data.url;
  }).catch(function(e) { toast(e.message, 'error'); });
}

function disconnectGoogle() {
  if (!confirm('לנתק את החיבור ל-Google Calendar?')) return;
  apiCall('POST', '/api/google/disconnect').then(function() {
    toast('החיבור נותק', 'success');
    checkGoogleStatus();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function syncToGoogle(id) {
  toast('מסנכרן ל-Google Calendar...', 'success');
  apiCall('POST', '/api/google/sync/' + id).then(function(data) {
    if (data.skipped) { toast('ניתן לסנכרן רק אירועים סגורים עם תאריך', 'error'); }
    else { toast('האירוע סונכרן ל-Google Calendar! ✓', 'success'); }
  }).catch(function(e) { toast('שגיאה: ' + e.message, 'error'); });
}


// ---- Autocomplete ----
function setupAutocomplete() {
  setupAC2('l-name', 'ac-name');
  setupAC2('l-phone', 'ac-phone');
  setupAC2('l-email', 'ac-email');
}

function setupAC2(inputId, listId) {
  var input = document.getElementById(inputId);
  var list = document.getElementById(listId);
  if (!input || !list || input.getAttribute('data-ac-setup')) return;
  input.setAttribute('data-ac-setup', '1');
  input.addEventListener('input', function() {
    var val = this.value.trim();
    if (val.length < 2) { list.style.display = 'none'; return; }
    clearTimeout(dupTimer2);
    dupTimer2 = setTimeout(function() {
      apiCall('GET', '/api/contacts?search=' + encodeURIComponent(val)).then(function(data) {
        if (!data.contacts || !data.contacts.length) { list.style.display = 'none'; return; }
        list.innerHTML = data.contacts.map(function(c) {
          return '<div class="autocomplete-item" data-id="' + c.id + '" data-name="' + encodeURIComponent(c.name||'') + '" data-phone="' + encodeURIComponent(c.phone||'') + '" data-email="' + encodeURIComponent(c.email||'') + '">' +
            '<div class="autocomplete-item-name">' + c.name + '</div>' +
            '<div class="autocomplete-item-sub">' + (c.phone||'') + (c.email ? ' · ' + c.email : '') + '</div>' +
            '<div style="font-size:11px;color:var(--accent);margin-top:4px">לחץ לפתיחת כרטיס לקוח</div>' +
          '</div>';
        }).join('');
        list.style.display = 'block';
        list.querySelectorAll('.autocomplete-item').forEach(function(item) {
          item.addEventListener('click', function() {
var contactId = this.getAttribute('data-id');
selectedContactId = parseInt(contactId);

document.getElementById('l-name').value = decodeURIComponent(this.getAttribute('data-name') || '');
document.getElementById('l-phone').value = decodeURIComponent(this.getAttribute('data-phone') || '');
document.getElementById('l-email').value = decodeURIComponent(this.getAttribute('data-email') || '');

document.getElementById('dup-name').style.display = 'none';
document.getElementById('dup-phone').style.display = 'none';
list.style.display = 'none';

toast('לקוח קיים נבחר — האירוע יקושר לכרטיס הלקוח', 'success');          });
        });
      }).catch(function() {});
    }, 300);
  });
  document.addEventListener('click', function(e) {
    if (input && list && !input.contains(e.target) && !list.contains(e.target)) {
      list.style.display = 'none';
    }
  });
}

function fillFromContact(contactId, contact) {
  contact = contact || {};
  document.getElementById('l-name').value = contact.name || '';
  document.getElementById('l-phone').value = contact.phone || '';
  document.getElementById('l-email').value = contact.email || '';
  document.getElementById('lead-id').setAttribute('data-contact-id', contactId || '');
  document.getElementById('dup-name').style.display = 'none';
  document.getElementById('dup-phone').style.display = 'none';
}

function openDupLead() {
  if (!dupLeadId) return;

  apiCall('GET', '/api/leads/' + dupLeadId).then(function(data) {
    var l = data.lead || {};

    if (l.contact_id) {
      closeLeadModal();
      openCustomerCard(parseInt(l.contact_id));
      return;
    }

    var q = l.phone || l.email || l.name || '';
    return apiCall('GET', '/api/contacts?search=' + encodeURIComponent(q)).then(function(res) {
      if (res.contacts && res.contacts.length) {
        closeLeadModal();
        openCustomerCard(parseInt(res.contacts[0].id));
      } else {
        toast('נמצא ליד קיים, אבל עדיין אין לו כרטיס לקוח', 'error');
      }
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

// ---- Customer Cards ----


function loadCustomers() {
  var search = document.getElementById('customers-search') ? document.getElementById('customers-search').value : '';
  var statusFilter = document.getElementById('customers-filter-status') ? document.getElementById('customers-filter-status').value : '';
  var typeFilter = document.getElementById('customers-filter-type') ? document.getElementById('customers-filter-type').value : '';
  var sortBy = document.getElementById('customers-sort') ? document.getElementById('customers-sort').value : '';

  apiCall('GET', '/api/contacts?search=' + encodeURIComponent(search)).then(function(data) {
    var grid = document.getElementById('customers-grid');
    if (!grid) return;

    var contacts = data.contacts || [];

    if (statusFilter) {
      contacts = contacts.filter(function(c) {
        return String(c.status || 'active') === String(statusFilter);
      });
    }

    if (typeFilter) {
      contacts = contacts.filter(function(c) {
        return String(c.customer_type || 'פרטי') === String(typeFilter);
      });
    }

    if (sortBy === 'name') {
      contacts.sort(function(a,b) {
        return String(a.name || '').localeCompare(String(b.name || ''), 'he');
      });
    }

    if (sortBy === 'events') {
      contacts.sort(function(a,b) {
        return Number(b.events_count || 0) - Number(a.events_count || 0);
      });
    }

    if (sortBy === 'revenue') {
      contacts.sort(function(a,b) {
        return Number(b.revenue || 0) - Number(a.revenue || 0);
      });
    }

    if (sortBy === 'next_event') {
      contacts.sort(function(a,b) {
        var ad = a.next_event_date || '9999-12-31';
        var bd = b.next_event_date || '9999-12-31';
        return String(ad).localeCompare(String(bd));
      });
    }

    if (!contacts.length) {
      var msg = 'אין לקוחות להצגה';
      if (statusFilter) msg = 'אין כרגע לקוחות בסטטוס שנבחר';
      if (typeFilter) msg = 'אין כרגע לקוחות מסוג הלקוח שנבחר';
      if (statusFilter && typeFilter) msg = 'אין כרגע לקוחות שמתאימים לסינון שבחרת';
      grid.innerHTML = '<div class="dash-empty">' + msg + '</div>';
      return;
    }

    grid.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">' +
      contacts.map(function(c) {
        var phone = c.phone || '';
        var cleanPhone = String(phone).replace(/[^0-9]/g, '');
        var waPhone = cleanPhone.replace(/^0/, '972');

        return '<div class="customer-card" data-cid="' + c.id + '">' +
          '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">' +
            '<div style="flex:1">' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-start">' +
                '<div class="customer-card-name">' + (c.name || 'לקוח ללא שם') + '</div>' +
                '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>' +
                '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>' +
              '</div>' +

              '<div class="customer-card-meta" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px">' +
                '<span style="color:var(--text);font-weight:700;font-size:13px">' + phone + '</span>' +
                (phone ? '<a title="WhatsApp" onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + waPhone + '" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:30px;height:30px;object-fit:contain;display:block"></a>' : '') +
                (phone ? '<a title="התקשר" onclick="event.stopPropagation()" href="tel:' + phone + '" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center"><img src="/phone-icon.png" alt="Phone" style="width:30px;height:30px;object-fit:contain;display:block"></a>' : '') +
              '</div>' +

              (c.email ? '<div class="customer-card-meta" style="margin-top:2px;color:var(--text3);font-size:12px">' + c.email + '</div>' : '') +
            '</div>' +
          '</div>' +

          '<div class="customer-card-stats" style="margin-top:12px">' +
            '<span class="customer-stat-pill">' + (c.events_count || 0) + ' אירועים</span>' +
            '<span class="customer-stat-pill" style="color:var(--green);font-weight:800">₪' + fmtMoney(c.revenue || 0) + ' סה״כ הכנסות</span>' +
          '</div>' +

          (c.next_event_date ? '<div class="customer-card-meta" style="color:var(--blue);font-weight:800;margin-top:10px;font-size:13px">אירוע קרוב: ' + formatDate(c.next_event_date) + '</div>' : '') +
        '</div>';
      }).join('') + '</div>';

    grid.querySelectorAll('.customer-card[data-cid]').forEach(function(card) {
      card.addEventListener('click', function() {
        openCustomerCard(parseInt(this.getAttribute('data-cid')));
      });
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}


function parseExtraContactsSafe(value) {
  try {
    var arr = value ? JSON.parse(value) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e) {
    return [];
  }
}






function openConfirmRemoveExtraContactModal(customerId, index) {
  var old = document.getElementById('remove-extra-contact-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'remove-extra-contact-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header">' +
        '<h2>מחיקת איש קשר</h2>' +
        '<button class="modal-close" id="remove-extra-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div style="font-size:15px;font-weight:600;line-height:1.7">האם אתה בטוח שברצונך למחוק את איש הקשר?</div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="remove-extra-no">לא</button>' +
        '<button class="btn btn-danger" id="remove-extra-yes">כן, מחק</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('remove-extra-close').onclick = close;
  document.getElementById('remove-extra-no').onclick = close;

  document.getElementById('remove-extra-yes').onclick = function() {
    close();
    removeExtraContactConfirmed(customerId, index);
  };
}

function removeExtraContactConfirmed(customerId, index) {
  apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
    var c = data.contact || {};
    var extra = parseExtraContactsSafe(c.extra_contacts);

    index = Number(index);
    extra.splice(index, 1);

    return apiCall('PUT', '/api/contacts/' + customerId, {
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
      customer_type: c.customer_type || 'פרטי',
      status: c.status || 'active',
      tags: c.tags,
      last_contact_date: c.last_contact_date,
      next_contact_date: c.next_contact_date,
      general_notes: c.general_notes,
      extra_contacts: JSON.stringify(extra)
    });
  }).then(function() {
    toast('איש הקשר נמחק', 'success');
    openCustomerCard(customerId);
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

window.removeExtraContact = function(customerId, index) {
  openConfirmRemoveExtraContactModal(customerId, index);
};

function removeExtraContact(customerId, index) {
  openConfirmRemoveExtraContactModal(customerId, index);
}


function openExtraContactModal(customerId) {
  var old = document.getElementById('extra-contact-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'extra-contact-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header">' +
        '<h2>הוספת איש קשר נוסף</h2>' +
        '<button class="modal-close" id="extra-contact-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם איש קשר</label><input class="form-input" id="extra-contact-name" placeholder="שם איש קשר"></div>' +
        '<div class="form-group"><label class="form-label">טלפון</label><input class="form-input" id="extra-contact-phone" placeholder="0500000000"></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="extra-contact-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="extra-contact-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('extra-contact-close').onclick = close;
  document.getElementById('extra-contact-cancel').onclick = close;

  document.getElementById('extra-contact-save').onclick = function() {
    var name = document.getElementById('extra-contact-name').value.trim();
    var phone = document.getElementById('extra-contact-phone').value.trim();

    if (!name || !phone) {
      toast('צריך למלא שם וטלפון', 'error');
      return;
    }

    apiCall('GET', '/api/contacts/' + customerId).then(function(data) {
      var c = data.contact || {};
      var extra = parseExtraContactsSafe(c.extra_contacts);

      extra.push({ name: name, phone: phone });

      return apiCall('PUT', '/api/contacts/' + customerId, {
        name: c.name,
        phone: c.phone,
        email: c.email,
        notes: c.notes,
        customer_type: c.customer_type || 'פרטי',
        status: c.status || 'active',
        tags: c.tags,
        last_contact_date: c.last_contact_date,
        next_contact_date: c.next_contact_date,
        general_notes: c.general_notes,
        extra_contacts: JSON.stringify(extra)
      });
    }).then(function() {
      close();
      toast('איש קשר נוסף נשמר', 'success');
      openCustomerCard(customerId);
    }).catch(function(e) {
      toast(e.message, 'error');
    });
  };
}



function openEditCustomerModal(c) {
  var old = document.getElementById('edit-customer-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'edit-customer-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:520px">' +
      '<div class="modal-header">' +
        '<h2>עריכת לקוח</h2>' +
        '<button class="modal-close" id="edit-customer-close">✕</button>' +
      '</div>' +

      '<div class="modal-body">' +

        '<div class="form-group">' +
          '<label class="form-label">שם לקוח</label>' +
          '<input class="form-input" id="edit-customer-name" value="' + (c.name || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">טלפון</label>' +
          '<input class="form-input" id="edit-customer-phone" value="' + (c.phone || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">מייל</label>' +
          '<input class="form-input" id="edit-customer-email" value="' + (c.email || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סוג לקוח</label>' +
          '<input class="form-input" id="edit-customer-type" value="' + (c.customer_type || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סטטוס</label>' +
          '<input class="form-input" id="edit-customer-status" value="' + (c.status || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">תאריך קשר הבא</label>' +
          '<input type="date" class="form-input" id="edit-customer-next-contact" value="' + (c.next_contact_date || '') + '">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">הערות</label>' +
          '<textarea class="form-input" id="edit-customer-notes" style="min-height:120px">' + (c.general_notes || '') + '</textarea>' +
        '</div>' +

      '</div>' +

      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="edit-customer-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="edit-customer-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
  }

  document.getElementById('edit-customer-close').onclick = close;
  document.getElementById('edit-customer-cancel').onclick = close;

  document.getElementById('edit-customer-save').onclick = function() {

    apiCall('PUT', '/api/contacts/' + c.id, {
      name: document.getElementById('edit-customer-name').value,
      phone: document.getElementById('edit-customer-phone').value,
      email: document.getElementById('edit-customer-email').value,
      customer_type: document.getElementById('edit-customer-type').value,
      status: document.getElementById('edit-customer-status').value,
      general_notes: document.getElementById('edit-customer-notes').value,
      next_contact_date: document.getElementById('edit-customer-next-contact').value,

      notes: c.notes,
      tags: c.tags,
      last_contact_date: c.last_contact_date,
      extra_contacts: c.extra_contacts
    }).then(function() {
      close();
      toast('הלקוח עודכן', 'success');
      openCustomerCard(c.id);
    }).catch(function(e) {
      toast(e.message, 'error');
    });

  };
}



function openEditCustomerFieldModal(c, field, label, inputType) {
  var old = document.getElementById('edit-field-modal');
  if (old) old.remove();

  var current = c[field] || '';
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'edit-field-modal';

  var inputHtml = field === 'general_notes'
    ? '<textarea class="form-input" id="edit-field-value" style="min-height:120px">' + current + '</textarea>'
    : '<input class="form-input" id="edit-field-value" type="' + (inputType || 'text') + '" value="' + current + '">';

  overlay.innerHTML =
    '<div class="modal" style="width:420px">' +
      '<div class="modal-header"><h2>עריכת ' + label + '</h2><button class="modal-close" id="edit-field-close">✕</button></div>' +
      '<div class="modal-body"><div class="form-group"><label class="form-label">' + label + '</label>' + inputHtml + '</div></div>' +
      '<div class="modal-footer"><button class="btn btn-secondary" id="edit-field-cancel">ביטול</button><button class="btn btn-primary" id="edit-field-save">שמור</button></div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('edit-field-close').onclick = close;
  document.getElementById('edit-field-cancel').onclick = close;

  document.getElementById('edit-field-save').onclick = function() {
    var value = document.getElementById('edit-field-value').value;

    var payload = {
      name: c.name,
      phone: c.phone,
      email: c.email,
      notes: c.notes,
      customer_type: c.customer_type || 'פרטי',
      status: c.status || 'active',
      tags: c.tags,
      last_contact_date: c.last_contact_date,
      next_contact_date: c.next_contact_date,
      general_notes: c.general_notes,
      extra_contacts: c.extra_contacts
    };

    payload[field] = value;

    apiCall('PUT', '/api/contacts/' + c.id, payload).then(function() {
      close();
      toast(label + ' עודכן', 'success');
      openCustomerCard(c.id);
    }).catch(function(e) {
      toast(e.message, 'error');
    });
  };
}

function makeTinyEditButton(c, field, label, inputType) {
  var btn = document.createElement('button');
  btn.className = 'btn btn-ghost btn-sm';
  btn.textContent = '✏️';
  btn.title = 'עריכת ' + label;
  btn.style.padding = '3px 7px';
  btn.style.fontSize = '11px';
  btn.onclick = function(e) {
    e.stopPropagation();
    openEditCustomerFieldModal(c, field, label, inputType);
  };
  return btn;
}


function openEventDetailsModal(id) {
  apiCall('GET', '/api/leads/' + id).then(function(data) {
    var l = data.lead || {};
    var old = document.getElementById('event-details-modal');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'event-details-modal';

    overlay.innerHTML =
      '<div class="modal" style="width:620px">' +
        '<div class="modal-header">' +
          '<h2>פרטי אירוע #' + (l.lead_num || l.id) + '</h2>' +
          '<button class="modal-close" id="event-details-close">✕</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="info-section"><div class="info-section-title">פרטי האירוע</div>' +
          '<div class="info-row"><span class="info-label">סוג אירוע</span><span class="info-value">' + (l.event_type || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">תאריך</span><span class="info-value">' + (l.event_date ? formatDate(l.event_date) : '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">שעה</span><span class="info-value">' + (l.event_time || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">אולם</span><span class="info-value">' + (l.venue || '—') + '</span></div>' +
          '<div class="info-row"><span class="info-label">סטטוס</span><span class="info-value">' + statusBadge(l.status) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">כספים</div>' +
          '<div class="info-row"><span class="info-label">מחיר</span><span class="info-value">₪' + fmtMoney(l.price || 0) + '</span></div>' +
          '<div class="info-row"><span class="info-label">מקדמה</span><span class="info-value">₪' + fmtMoney(l.deposit || 0) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">הערות</div>' +
          '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (l.details || l.notes || 'אין הערות') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" id="event-details-cancel">סגור</button>' +
          '<button class="btn btn-primary" id="event-details-edit">✏️ עריכת אירוע</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function close() { overlay.remove(); }

    document.getElementById('event-details-close').onclick = close;
    document.getElementById('event-details-cancel').onclick = close;
    document.getElementById('event-details-edit').onclick = function() {
      close();
      editLead(id);
    };
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}


function openCustomerCard(id) {\n  apiCall('GET', '/api/contacts/' + id).then(function(data) {\n    var c = data.contact || {};\n    var leads = data.leads || [];\n    var stats = data.stats || {};\n    var grid = document.getElementById('customers-grid');\n    if (!grid) return;\n\n    var tags = [];\n    try { tags = c.tags ? JSON.parse(c.tags) : []; if (!Array.isArray(tags)) tags = []; } catch(e) { tags = []; }
    var extraContacts = parseExtraContacts(c);\n\n    var cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');\n    var waPhone = cleanPhone.charAt(0) === '0' ? '972' + cleanPhone.substring(1) : cleanPhone;\n\n    var html = '';\n\n    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">';\n    html += '<button class="btn btn-secondary btn-sm" id="back-to-customers">← חזרה לרשימת לקוחות</button>';\n    html += '<button class="btn btn-secondary btn-sm" id="edit-customer-btn">✏️ עריכה</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+ אירוע חדש ללקוח</button>';\n    html += '</div>';\n\n    html += '<div style="display:grid;grid-template-columns:360px 1fr;gap:20px;align-items:start">';\n\n    html += '<div class="contact-card" style="position:sticky;top:20px">';\n    html += '<div class="contact-card-header"><div>';\n    html += '<div class="contact-card-name">' + (c.name || 'לקוח ללא שם') + '</div>';\n    html += '<div class="contact-card-meta">מספר לקוח #' + (c.contact_num || c.id || '') + '</div>';\n    html += '</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
    html += '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>';
    html += '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>';
    html += '</div></div>';\n\n    html += '<div class="info-section"><div class="info-section-title">תגיות לקוח</div>';\n    if (tags.length) {\n      html += '<div class="attraction-tags" style="margin-bottom:10px">';\n      tags.forEach(function(t) { html += '<span class="attraction-tag">' + t + '</span>'; });\n      html += '</div>';\n    } else {\n      html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">אין תגיות עדיין</div>';\n    }\n    html += '<input class="form-input" id="customer-tags-input" placeholder="לדוגמה: VIP, לקוח חוזר, מפיק" value="' + tags.join(', ') + '">';\n    html += '<button class="btn btn-primary btn-sm" id="save-customer-tags" style="margin-top:8px;padding:4px 8px;font-size:11px">שמור</button>';\n    html += '</div>';\n\n    html += '<div class="info-section"><div class="info-section-title">פרטי לקוח</div>';\n    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (c.phone || '—');\n    if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a> <a class="btn btn-ghost btn-sm" href="tel:' + c.phone + '"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a> <button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" style="padding:6px 10px;font-weight:800">+</button>';\n    html += '</span></div>';\n    html += '<div class="info-row"><span class="info-label">מייל</span><span class="info-value">' + (c.email || '—');\n    if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '">שלח מייל</a>';\n    html += '</span></div>';\n\n    html += '<div class="info-row"><span class="info-label">סוג לקוח</span><span class="info-value" style="display:flex;gap:8px;align-items:center">';\n    html += '<select id="customer-type-select" class="form-input" style="flex:1"><option value="פרטי">פרטי</option><option value="עסקי">עסקי</option><option value="מפיק/ספק">מפיק/ספק</option></select>';\n    html += '<button class="btn btn-primary btn-sm" id="save-customer-type" style="padding:4px 8px;font-size:11px">שמור</button>';\n    html += '</span></div>';\n\n    html += '<div class="info-row"><span class="info-label">סטטוס לקוח</span><span class="info-value" style="display:flex;gap:8px;align-items:center">';\n    html += '<select id="customer-status-select" class="form-input" style="flex:1"><option value="hot">🔥 חם</option><option value="cold">❄️ קר</option><option value="offer">⏳ בהצעה</option><option value="active">🟢 פעיל</option><option value="closed">✅ סגור</option><option value="cancelled">❌ בוטל</option></select>';\n    html += '<button class="btn btn-primary btn-sm" id="save-customer-status" style="padding:4px 8px;font-size:11px">שמור</button>';\n    html += '</span></div>';\n    html += '</div>';\n\n    html += '<div class="info-section"><div class="info-section-title">נתונים עסקיים</div>';\n    html += '<div class="info-row"><span class="info-label">מספר אירועים</span><span class="info-value">' + (stats.total || leads.length || 0) + '</span></div>';\n    html += '<div class="info-row"><span class="info-label">סך הכנסות</span><span class="info-value">₪' + fmtMoney(stats.revenue || 0) + '</span></div>';\n    html += '<div class="info-row"><span class="info-label">אירוע אחרון</span><span class="info-value">' + (stats.last_event_date ? formatDate(stats.last_event_date) : '—') + '</span></div>';\n    html += '<div class="info-row"><span class="info-label">אירוע קרוב</span><span class="info-value">' + (stats.next_event_date ? formatDate(stats.next_event_date) : '—') + '</span></div>';\n    html += '</div>';\n\n    html += '<div class="info-section"><div class="info-section-title">מעקב</div>';\n    html += '<div class="info-row"><span class="info-label">קשר אחרון</span><span class="info-value">' + (c.last_contact_date ? formatDate(c.last_contact_date) : '—') + '</span></div>';\n    html += '<div class="info-row"><span class="info-label">קשר קרוב</span><span class="info-value">' + (c.next_contact_date ? formatDate(c.next_contact_date) : '—') + '</span></div>';\n    html += '</div>';\n\n    html += '<div class="info-section"><div class="info-section-title">הערות כלליות</div>';\n    html += '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (c.general_notes || c.notes || 'אין הערות כלליות') + '</div>';\n    html += '</div>';\n    html += '</div>';\n\n    html += '<div class="table-card"><div class="table-toolbar" style="justify-content:space-between"><strong>אירועים של הלקוח</strong><span class="badge badge-gray">' + leads.length + ' אירועים</span></div>';\n    if (!leads.length) { html += '<div class="dash-empty">אין אירועים ללקוח הזה</div>'; }\n    else {\n      html += '<table><thead><tr><th>מספר אירוע</th><th>תאריך</th><th>סוג</th><th>אולם</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';\n      leads.forEach(function(l) {\n        html += '<tr data-event-id="' + l.id + '"><td class="bold" style="color:var(--accent)">אירוע #' + (l.lead_num || l.id) + '</td><td>' + (l.event_date ? formatDate(l.event_date) : '—') + '</td><td>' + (l.event_type || '—') + '</td><td>' + (l.venue || '—') + '</td><td>' + (l.price ? '₪' + fmtMoney(l.price) : '—') + '</td><td>' + statusBadge(l.status) + '</td></tr>';\n      });\n      html += '</tbody></table>';\n    }\n    html += '</div></div>';\n\n    grid.innerHTML = html;

    // force-event-modal-from-customer-card
    setTimeout(function() {
      grid.querySelectorAll('tr[data-event-id]').forEach(function(row) {
        row.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          openEventDetailsModal(parseInt(row.getAttribute('data-event-id')));
        }, true);
      });
    }, 100);


    // inline-customer-edit
    setTimeout(function() {
      var nameEl = grid.querySelector('.contact-card-name');
      if (nameEl && !nameEl.querySelector('.inline-edit-name')) {
        var b = makeTinyEditButton(c, 'name', 'שם לקוח', 'text');
        b.classList.add('inline-edit-name');
        nameEl.appendChild(b);
      }

      var phoneLink = grid.querySelector('a[href^="tel:"]');
      var phoneRow = phoneLink ? phoneLink.closest('.info-row') : null;
      if (phoneRow && !phoneRow.querySelector('.inline-edit-phone')) {
        var b = makeTinyEditButton(c, 'phone', 'טלפון', 'text');
        b.classList.add('inline-edit-phone');
        phoneRow.querySelector('.info-value').appendChild(b);
      }

      var mailLink = grid.querySelector('a[href^="mailto:"]');
      var mailRow = mailLink ? mailLink.closest('.info-row') : null;
      if (mailRow && !mailRow.querySelector('.inline-edit-email')) {
        var b = makeTinyEditButton(c, 'email', 'מייל', 'email');
        b.classList.add('inline-edit-email');
        mailRow.querySelector('.info-value').appendChild(b);
      }

      if (c.next_contact_date) {
        grid.querySelectorAll('.info-row').forEach(function(row) {
          if (row.textContent.indexOf(formatDate(c.next_contact_date)) !== -1 && !row.querySelector('.inline-edit-next')) {
            var b = makeTinyEditButton(c, 'next_contact_date', 'תאריך קשר קרוב', 'date');
            b.classList.add('inline-edit-next');
            row.querySelector('.info-value').appendChild(b);
          }
        });
      }

      grid.querySelectorAll('.info-section').forEach(function(sec) {
        if (sec.textContent.indexOf(c.general_notes || '') !== -1 && (c.general_notes || '').length > 0 && !sec.querySelector('.inline-edit-notes')) {
          var b = makeTinyEditButton(c, 'general_notes', 'הערות כלליות', 'text');
          b.classList.add('inline-edit-notes');
          sec.appendChild(b);
        }
      });
    }, 150);


    // mail-icon-force
    setTimeout(function() {
      grid.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
        a.innerHTML = '<img src="/mail-icon.png" alt="Mail" style="width:28px;height:28px;object-fit:contain;display:block">';
        a.style.padding = '4px';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.justifyContent = 'center';
      });
    }, 50);


    // render-extra-contacts-force
    setTimeout(function() {
      var extra = [];
      try {
        extra = c.extra_contacts ? JSON.parse(c.extra_contacts) : [];
        if (!Array.isArray(extra)) extra = [];
      } catch(e) {
        extra = [];
      }

      if (!extra.length) return;
      if (document.getElementById('extra-contacts-row')) return;

      var phoneLink = grid.querySelector('a[href^="tel:"]');
      var phoneRow = phoneLink ? phoneLink.closest('.info-row') : null;
      if (!phoneRow) return;

      var row = document.createElement('div');
      row.className = 'info-row';
      row.style.display = 'block';
      row.style.marginTop = '10px';
      row.id = 'extra-contacts-row';

      var htmlExtra = '<span class="info-label">אנשי קשר נוספים</span>';
      htmlExtra += '<div class="info-value" style="display:flex;flex-direction:column;gap:8px;margin-top:6px">';

      extra.forEach(function(ec, index) {
        var phone = ec.phone || '';
        var clean = String(phone).replace(/[^0-9]/g, '');
        var wa = clean.replace(/^0/, '972');

        htmlExtra += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:var(--bg2);padding:8px 10px;border-radius:10px">';
        htmlExtra += '<span style="font-weight:700;color:var(--text);white-space:nowrap">' + (ec.name || 'איש קשר') + '</span>';
        htmlExtra += '<span style="font-weight:600;color:var(--text);white-space:nowrap">' + phone + '</span>';

        if (phone) {
          htmlExtra += '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + wa + '" style="padding:4px"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a>';
          htmlExtra += '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '" style="padding:4px"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a>';

        htmlExtra += '<button class="btn btn-danger btn-sm" onclick="removeExtraContact(' + c.id + ',' + index + ')" style="padding:4px 8px;font-weight:700;border-radius:8px">✕</button>';
        }

        htmlExtra += '</div>';
      });

      htmlExtra += '</div>';
      row.innerHTML = htmlExtra;

      phoneRow.insertAdjacentElement('afterend', row);
    }, 120);

    // phone-row-dom-align
    setTimeout(function() {
      var plusBtn = document.getElementById('add-extra-contact-btn');
      var phoneLink = grid.querySelector('a[href^="tel:"]');

      if (phoneLink) {
        var phoneRow = phoneLink.closest('.info-row');
        var phoneValue = phoneRow ? phoneRow.querySelector('.info-value') : null;

        if (phoneValue) {
          phoneValue.style.display = 'flex';
          phoneValue.style.alignItems = 'center';
          phoneValue.style.gap = '8px';
          phoneValue.style.flexWrap = 'nowrap';

          phoneValue.querySelectorAll('img').forEach(function(img) {
            img.style.width = '28px';
            img.style.height = '28px';
          });

          phoneValue.querySelectorAll('a').forEach(function(a) {
            a.style.display = 'inline-flex';
            a.style.alignItems = 'center';
            a.style.justifyContent = 'center';
            a.style.padding = '4px';
          });

          if (plusBtn) {
            plusBtn.style.padding = '4px 9px';
            plusBtn.style.minWidth = '34px';
            plusBtn.style.height = '34px';
            plusBtn.style.fontWeight = '800';
            phoneValue.appendChild(plusBtn);
          }
        }
      }
    }, 0);
\n\n    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);

    var editBtn = document.getElementById('edit-customer-btn');
    if (editBtn) {
      editBtn.onclick = function() {
        openEditCustomerModal(c);
      };
    }
    var addExtraBtn = document.getElementById('add-extra-contact-btn');
    if (addExtraBtn) addExtraBtn.addEventListener('click', function() {
      openExtraContactModal(c.id);
    });\n    document.getElementById('customer-type-select').value = c.customer_type || 'פרטי';\n    document.getElementById('customer-status-select').value = c.status || 'active';\n\n    function saveContact(extra) {\n      apiCall('PUT', '/api/contacts/' + c.id, {\n        name: c.name, phone: c.phone, email: c.email, notes: c.notes,\n        customer_type: extra.customer_type !== undefined ? extra.customer_type : (c.customer_type || 'פרטי'),\n        status: extra.status !== undefined ? extra.status : (c.status || 'active'),\n        tags: extra.tags !== undefined ? extra.tags : c.tags,\n        last_contact_date: c.last_contact_date, next_contact_date: c.next_contact_date, general_notes: c.general_notes\n      }).then(function() { toast('נשמר בהצלחה', 'success'); openCustomerCard(c.id); }).catch(function(e) { toast(e.message, 'error'); });\n    }\n\n    document.getElementById('save-customer-type').addEventListener('click', function() {\n      saveContact({ customer_type: document.getElementById('customer-type-select').value });\n    });\n    document.getElementById('save-customer-status').addEventListener('click', function() {\n      saveContact({ status: document.getElementById('customer-status-select').value });\n    });\n    document.getElementById('save-customer-tags').addEventListener('click', function() {\n      var raw = document.getElementById('customer-tags-input').value || '';\n      var newTags = raw.split(',').map(function(t) { return t.trim(); }).filter(Boolean);\n      saveContact({ tags: JSON.stringify(newTags) });\n    });\n\n    document.getElementById('add-event-btn').addEventListener('click', function() {\n      openLeadModal();\n      setTimeout(function() {\n        document.getElementById('l-name').value = c.name || '';\n        document.getElementById('l-phone').value = c.phone || '';\n        document.getElementById('l-email').value = c.email || '';\n      }, 50);\n    });\n\n    grid.querySelectorAll('tr[data-event-id]').forEach(function(row) {\n      row.addEventListener('click', function() { openDrawer(parseInt(this.getAttribute('data-event-id'))); });\n    });\n  }).catch(function(e) { toast(e.message, 'error'); });\n}\n
function parseExtraContacts(c) {
  try {
    var arr = c.extra_contacts ? JSON.parse(c.extra_contacts) : [];
    return Array.isArray(arr) ? arr : [];
  } catch(e) {
    return [];
  }
}


function openExtraContactPrompt(customerId) {
  openExtraContactModal(customerId);
}


function renderContactQuickActions(phone) {
  if (!phone) return '';
  var clean = String(phone).replace(/[^0-9]/g, '');
  var wa = clean.replace(/^0/, '972');

  return '<a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + wa + '">' +
    '<img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block">' +
  '</a>' +
  '<a class="btn btn-ghost btn-sm" href="tel:' + phone + '">' +
    '<img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block">' +
  '</a>';
}

function closeCustomerModal() {
  document.getElementById('modal-customer').classList.remove('open');
}

function addEventForContact(contactId, name, phone, email) {
  // סגור את כרטיס הלקוח ופתח טופס ליד חדש עם פרטים ממולאים
  closeCustomerModal();
  openLeadModal();
  // מלא את פרטי הלקוח
  setTimeout(function() {
    document.getElementById('l-name').value = name;
    document.getElementById('l-phone').value = phone;
    document.getElementById('l-email').value = email;
    document.getElementById('lead-id').setAttribute('data-contact-id', contactId);
    document.getElementById('dup-name').style.display = 'none';
    document.getElementById('dup-phone').style.display = 'none';
  }, 50);
}


var currentCustomer = null;

function openCustomerModal(id) {
  document.getElementById('modal-customer').classList.add('open');
  document.getElementById('customer-modal-body').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">טוען...</div>';
  apiCall('GET', '/api/contacts/' + id).then(function(data) {
    currentCustomer = data.contact;
    var c = data.contact, leads = data.leads, stats = data.stats;
    document.getElementById('customer-modal-title').textContent = c.name + ' · לקוח #' + (c.contact_num || c.id);
    var html = '';
    // כפתור הוסף אירוע
    html += '<div style="margin-bottom:16px;display:flex;gap:10px;align-items:center">';
    html += '<button onclick="addEventForCustomer()" class="btn btn-primary">+ הוסף אירוע חדש</button>';
    if (c.phone) html += '<a href="tel:' + c.phone + '" class="btn btn-secondary"><img src="/phone-icon.png" alt="Phone" style="width:24px;height:24px;object-fit:contain;display:block"></a>';
    if (c.email) html += '<span class="btn btn-secondary">✉️ ' + c.email + '</span>';
    html += '</div>';
    // Stats
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">';
    html += '<div style="background:var(--accent-light);border-radius:var(--radius-sm);padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--accent)">' + (stats.total||0) + '</div><div style="font-size:10px;color:var(--text3)">סה"כ אירועים</div></div>';
    html += '<div style="background:var(--green-light);border-radius:var(--radius-sm);padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--green)">' + (stats.closed||0) + '</div><div style="font-size:10px;color:var(--text3)">סגורים</div></div>';
    html += '<div style="background:var(--blue-light);border-radius:var(--radius-sm);padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--blue)">₪' + fmtMoney(stats.revenue||0) + '</div><div style="font-size:10px;color:var(--text3)">הכנסות</div></div>';
    html += '</div>';
    // פרטי לקוח
    html += '<div class="info-section"><div class="info-section-title">פרטי לקוח</div>';
    html += '<div class="info-row"><span class="info-label">מספר לקוח</span><span class="info-value">#' + c.contact_num + '</span></div>';
    html += '<div class="info-row"><span class="info-label">שם</span><span class="info-value">' + c.name + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (c.phone||'—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אימייל</span><span class="info-value">' + (c.email||'—') + '</span></div>';
    html += '</div>';
    // אירועים
    html += '<div class="info-section"><div class="info-section-title">אירועים של הלקוח</div>';
    if (!leads || !leads.length) {
      html += '<div class="dash-empty">אין אירועים עדיין. לחץ "הוסף אירוע חדש" כדי לפתוח טופס ליד חדש עם פרטי הלקוח.</div>';
    } else {
      html += '<table><thead><tr><th>מספר</th><th>תאריך</th><th>סוג</th><th>אולם</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
      leads.forEach(function(l) {
        html += '<tr data-id="' + l.id + '">' +
          '<td class="bold">אירוע #' + (l.lead_num||l.id) + '</td>' +
          '<td>' + (l.event_date?formatDate(l.event_date):'—') + '</td>' +
          '<td>' + (l.event_type||'—') + '</td>' +
          '<td>' + (l.venue||'—') + '</td>' +
          '<td>' + (l.price?'₪'+fmtMoney(l.price):'—') + '</td>' +
          '<td>' + statusBadge(l.status) + '</td>' +
        '</tr>';
      });
      html += '</tbody></table>';
    }
    document.getElementById('customer-modal-body').innerHTML = html;
    document.querySelectorAll('#customer-modal-body tr[data-id]').forEach(function(row) {
      row.addEventListener('click', function() {
        closeCustomerModal();
        openDrawer(parseInt(this.getAttribute('data-id')));
      });
    });
  }).catch(function(e) { toast(e.message, 'error'); });
}

function addEventForCustomer() {
  if (!currentCustomer) return;
  closeCustomerModal();
  // פתח טופס ליד חדש עם פרטי הלקוח ממולאים
  openLeadModal();
  setTimeout(function() {
    fillFromContact(currentCustomer.id, currentCustomer);
  }, 50);
}

document.addEventListener('DOMContentLoaded', function() {
  init();
  var custClose = document.getElementById('customer-modal-close');
  if (custClose) custClose.addEventListener('click', closeCustomerModal);
  var newCustomerBtn = document.getElementById('btn-new-customer');
  if (newCustomerBtn) newCustomerBtn.addEventListener('click', openLeadModal);

  var custSearch = document.getElementById('customers-search');
  if (custSearch) custSearch.addEventListener('input', function() {
    clearTimeout(searchTimer); searchTimer = setTimeout(loadCustomers, 300);
  });
});
</script>
</body>
</html>`;
}
function selectCustomer(c) {
  selectedContactId = c.id;

  document.getElementById('l-name').value = c.name || '';
  document.getElementById('l-phone').value = c.phone || '';
  document.getElementById('l-email').value = c.email || '';

  // הסתר autocomplete
  document.getElementById('ac-name').style.display = 'none';
  document.getElementById('ac-phone').style.display = 'none';
  document.getElementById('ac-email').style.display = 'none';
}

