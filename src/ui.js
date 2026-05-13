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
.admin-module-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:12px}
.admin-module-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px}
.admin-module-title{font-size:12px;font-weight:700;color:var(--text);margin-bottom:5px}
.admin-module-sub{font-size:11px;color:var(--text3)}
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
.login-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:40px;width:min(390px,100%);max-width:100%;box-shadow:var(--shadow-md)}
.mobile-shell-switcher{display:none}
.mobile-shell-switcher-inner{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.mobile-shell-switcher .btn{width:100%;justify-content:center}
.mobile-session-actions{display:none;margin-bottom:14px}
.mobile-session-actions .logout-btn{width:100%;min-height:42px;justify-content:center;display:inline-flex;align-items:center;margin-right:0;font-size:13px;padding:10px 14px}
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
.activity-item{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;margin-bottom:8px}
.activity-date{font-size:10px;color:var(--text3);margin-bottom:4px}
.activity-title{font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px}
.activity-text{font-size:13px;color:var(--text2);line-height:1.5;white-space:pre-wrap}
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px}
.dot-red{background:var(--red)}.dot-orange{background:var(--orange)}.dot-green{background:var(--green)}.dot-gray{background:var(--border2)}
.customer-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;transition:all 0.12s;display:flex;flex-direction:column;gap:8px}
.customer-card:hover{border-color:var(--accent);box-shadow:0 2px 8px rgba(124,58,237,0.1)}
.customer-card-name{font-size:14px;font-weight:700;color:var(--text)}
.customer-card-meta{font-size:12px;color:var(--text3)}
.customer-card-stats{display:flex;gap:8px;margin-top:4px}
.customer-stat-pill{background:var(--bg);border-radius:20px;padding:3px 10px;font-size:11px;color:var(--text2);font-weight:600}
.employee-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.employee-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px}
.employee-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.employee-card-name{font-size:15px;font-weight:800;color:var(--text)}
.employee-card-meta{font-size:12px;color:var(--text3)}
.employee-card-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.employee-status-active{background:var(--green-light);color:var(--green)}
.employee-status-inactive{background:var(--bg);color:var(--text3);border:1px solid var(--border)}
.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.product-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px}
.product-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.product-card-name{font-size:15px;font-weight:800;color:var(--text)}
.product-card-meta{font-size:12px;color:var(--text3)}
.product-card-notes{font-size:13px;color:var(--text2);line-height:1.6;white-space:pre-wrap}
.product-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.product-stat{background:#fafbfc;border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px}
.product-stat-label{font-size:11px;color:var(--text3);margin-bottom:4px}
.product-stat-value{font-size:13px;font-weight:700;color:var(--text)}
.product-card-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.product-status-active{background:var(--green-light);color:var(--green)}
.product-status-inactive{background:var(--bg);color:var(--text3);border:1px solid var(--border)}
.product-stock-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.product-stock-value{font-size:13px;font-weight:700;color:var(--text)}
.product-stock-helper{font-size:11px;color:var(--text3)}
.product-low-stock-banner{margin-bottom:16px;padding:14px 16px;border:1px solid #fdba74;background:#fff7ed;border-radius:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
.product-low-stock-title{font-size:14px;font-weight:800;color:#9a3412}
.product-low-stock-text{font-size:12px;color:#9a3412;line-height:1.6}
.product-low-stock-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.product-low-stock-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#fff;border:1px solid #fdba74;font-size:12px;color:#9a3412;font-weight:700}
.product-low-stock-chip-muted{color:var(--text3);border-color:var(--border);background:#fafbfc}
.product-ops-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:16px}
.product-ops-card{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:14px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:12px;min-width:0}
.product-ops-card-title{font-size:14px;font-weight:800;color:var(--text)}
.product-ops-card-subtitle{font-size:12px;color:var(--text3);line-height:1.5}
.product-ops-list{display:flex;flex-direction:column;gap:10px}
.product-ops-item{border:1px solid var(--border);border-radius:10px;padding:10px;background:#fafbfc;display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.product-ops-item-main{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.product-ops-item-title{font-size:13px;font-weight:700;color:var(--text)}
.product-ops-item-meta{font-size:12px;color:var(--text2);line-height:1.5;display:flex;gap:8px;flex-wrap:wrap}
.product-ops-empty{padding:16px;border:1px dashed var(--border);border-radius:10px;background:#f8fafc;color:var(--text3);text-align:center;font-size:13px}
.product-ops-action{flex-shrink:0;display:flex;align-items:flex-start;gap:8px}
.badge-urgent{background:#fef2f2;color:#b91c1c}
.badge-attention{background:#fff7ed;color:#c2410c}
.badge-stable{background:#ecfdf3;color:#166534}
.product-inventory-section{margin-top:18px;padding-top:18px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:14px}
.product-inventory-actions{display:flex;gap:8px;flex-wrap:wrap}
.product-inventory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.product-inventory-card{background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px}
.product-inventory-label{font-size:12px;color:var(--text3)}
.product-inventory-value{font-size:16px;font-weight:800;color:var(--text)}
.product-adjustment-form{border:1px solid var(--border);border-radius:12px;background:#f8fafc;padding:14px;display:flex;flex-direction:column;gap:12px}
.product-adjustment-title{font-size:14px;font-weight:800;color:var(--text)}
.product-adjustment-helper{font-size:12px;color:var(--text3);line-height:1.5}
.product-adjustment-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.product-inventory-list{display:flex;flex-direction:column;gap:10px}
.product-inventory-row{background:#fff;border:1px solid var(--border);border-radius:12px;padding:12px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.product-inventory-row-main{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.product-inventory-row-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.product-inventory-row-stats{display:flex;gap:12px;flex-wrap:wrap;font-size:13px;color:var(--text2)}
.product-inventory-date{font-weight:700;color:var(--text)}
.product-inventory-note{font-size:13px;color:var(--text2);line-height:1.6;white-space:pre-wrap}
.product-purchases-section{margin-top:18px;padding-top:18px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:14px}
.product-purchases-header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.product-purchases-title{font-size:16px;font-weight:800;color:var(--text)}
.product-purchases-summary{display:flex;flex-direction:column;gap:10px}
.product-purchase-summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.product-purchase-summary-card{background:#f8fafc;border:1px solid var(--border);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px}
.product-purchase-summary-card-alert{background:#fff7ed;border-color:#fdba74}
.product-purchase-summary-label{font-size:12px;color:var(--text3)}
.product-purchase-summary-value{font-size:16px;font-weight:800;color:var(--text)}
.product-purchase-summary-subtext{font-size:12px;color:var(--text3);line-height:1.5}
.product-purchase-inline-form{border:1px solid var(--border);border-radius:12px;background:#f8fafc;padding:14px;display:flex;flex-direction:column;gap:12px}
.product-purchase-inline-title{font-size:14px;font-weight:800;color:var(--text)}
.product-purchase-inline-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.product-purchases-list{display:flex;flex-direction:column;gap:10px}
.product-purchase-row{background:#fff;border:1px solid var(--border);border-radius:12px;padding:12px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.product-purchase-row-main{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0}
.product-purchase-row-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.product-purchase-row-stats{display:flex;gap:12px;flex-wrap:wrap;font-size:13px;color:var(--text2)}
.product-purchase-row-notes{font-size:13px;color:var(--text2);line-height:1.6;white-space:pre-wrap}
.product-purchase-row-actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.product-purchase-date{font-weight:700;color:var(--text)}
.product-purchase-type,.product-purchase-supplier{font-size:12px;color:var(--text3);background:#f8fafc;border:1px solid var(--border);border-radius:999px;padding:3px 8px}
.product-purchase-change{font-size:12px;font-weight:700;border-radius:999px;padding:3px 8px}
.product-purchase-change-up{background:#fef3f2;color:#b42318}
.product-purchase-change-down{background:#ecfdf3;color:#027a48}
.product-purchase-change-neutral{background:#f8fafc;color:var(--text3)}
.product-purchases-empty{padding:18px;border:1px dashed var(--border);border-radius:12px;background:#f8fafc;color:var(--text3);text-align:center}
.assignment-card{border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;background:#fafbfc;margin-bottom:12px}
.assignment-card-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.assignment-card-title{font-size:14px;font-weight:700;color:var(--text)}
.assignment-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.assignment-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.employee-profile-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 14px}
.employee-summary-card{background:#fafbfc;border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;text-align:center}
.employee-summary-value{font-size:18px;font-weight:800;color:var(--accent)}
.employee-summary-label{font-size:11px;color:var(--text3);margin-top:4px}
.employee-assignment-row{border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;background:#fafbfc;margin-bottom:10px}
.employee-assignment-title{font-size:14px;font-weight:700;color:var(--text)}
.employee-assignment-meta{font-size:12px;color:var(--text3);margin-top:4px}
.employee-assignment-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
.customers-type-layout{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}
.customer-type-section{background:transparent;display:flex;flex-direction:column;gap:12px}
.customer-type-header{font-size:16px;font-weight:800;color:var(--text);padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:#fafbfc}
.customer-type-empty{font-size:13px;color:var(--text3);padding:10px 12px;border:1px dashed var(--border);border-radius:var(--radius-sm);background:var(--white)}
.leads-section-row td{background:#fafbfc;font-size:13px;font-weight:800;color:var(--text);padding:12px 10px;border-top:1px solid var(--border)}
.dash-subsection-title{padding:10px 12px;font-size:12px;font-weight:800;color:var(--text);background:#fafbfc;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.archive-month-section{margin-bottom:18px}
.archive-month-title{font-size:16px;font-weight:800;color:var(--text);margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.archive-event-item{border:1px solid var(--border);border-radius:var(--radius-sm);background:#fafbfc;padding:12px;margin-bottom:10px;cursor:pointer}
.archive-event-item:hover{border-color:var(--accent);box-shadow:var(--shadow)}
.archive-event-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
.archive-event-name{font-size:14px;font-weight:800;color:var(--text)}
.archive-event-meta{font-size:12px;color:var(--text3);margin-top:4px}
.archive-event-pills{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.customer-tag-pill{display:inline-flex;align-items:center;gap:6px;background:var(--accent-light);color:var(--accent);border-radius:999px;padding:6px 10px;font-size:12px;font-weight:700}
.customer-tag-remove{border:none;background:transparent;color:var(--accent);cursor:pointer;font-size:13px;font-weight:800;line-height:1;padding:0}
.customer-tag-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
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

  .mobile-shell-switcher {
    display: block;
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

  #event-details-modal .info-row {
    margin-bottom: 12px !important;
  }

  #event-details-modal .info-value {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  #event-details-modal .info-value .btn,
  #event-details-modal .info-value a.btn {
    min-width: 100%;
    justify-content: center;
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

  body,
  #main,
  .page,
  .table-card,
  .dash-section,
  .mini-cal,
  .customer-card,
  .contact-card,
  .modal,
  .drawer,
  .info-value,
  .info-section,
  .modal-body,
  .drawer-body {
    overflow-wrap: anywhere;
  }

  .page-header,
  .table-toolbar,
  .modal-header,
  .modal-footer,
  .drawer-header,
  .drawer-footer {
    gap: 12px !important;
  }

  .btn,
  .btn-sm,
  .modal-close,
  .logout-btn,
  .calendar-add-btn,
  .cal-nav {
    min-height: 42px;
  }

  .btn,
  .btn-sm {
    padding: 10px 14px !important;
  }

  .search-input,
  .filter-select,
  .form-input,
  .form-select,
  .form-textarea {
    min-height: 44px;
    font-size: 16px !important;
  }

  .form-textarea {
    min-height: 96px;
  }

  .dash-item,
  .table-toolbar,
  .stat-card,
  .info-section,
  .drawer-body,
  .modal-body {
    padding-left: 14px !important;
    padding-right: 14px !important;
  }

  .dash-item {
    gap: 10px;
    align-items: flex-start;
  }

  .dash-item-name,
  .dash-item-sub,
  td,
  .info-value,
  .activity-text {
    overflow-wrap: anywhere;
  }

  .table-card {
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 640px !important;
  }

  #main,
  .page,
  #page-calendar {
    min-width: 0;
  }

  #page-super-admin .table-card {
    max-width: 100%;
    overflow-x: auto !important;
  }

  #page-super-admin table {
    min-width: 0 !important;
    table-layout: fixed;
    width: 100%;
  }

  #page-super-admin th,
  #page-super-admin td {
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  #page-calendar .table-card {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  #page-calendar .calendar-month-wrap {
    width: 720px;
    min-width: 720px;
  }

  #page-calendar .calendar-top {
    align-items: stretch !important;
  }

  #page-calendar .calendar-top > div {
    width: 100%;
  }

  #page-calendar .calendar-top > div[style*="display:flex"] {
    display: flex !important;
    flex-wrap: wrap !important;
  }

  #page-calendar .calendar-top .form-select,
  #page-calendar .calendar-top .btn {
    flex: 1 1 100%;
    width: 100% !important;
    justify-content: center;
  }

  #page-calendar .calendar-day-real {
    min-height: 84px;
  }

  #page-calendar .calendar-event-pill {
    white-space: normal;
    overflow: hidden;
    text-overflow: initial;
    line-height: 1.35;
  }

  .mobile-session-actions {
    display: block;
  }

  .modal {
    width: min(96vw, 640px) !important;
    margin: 8px !important;
    max-height: calc(100vh - 16px) !important;
  }

  .modal-header,
  .modal-footer {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .drawer-body,
  .drawer-footer {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  #back-to-customers,
  #edit-customer-btn,
  #add-event-btn,
  #save-customer-tags,
  #save-customer-type,
  #save-customer-status,
  #add-customer-note-btn,
  #add-extra-contact-btn {
    min-height: 42px;
  }

  #back-to-customers,
  #edit-customer-btn,
  #add-event-btn {
    width: 100%;
    justify-content: center;
  }

  #customers-grid > div:first-child,
  #customers-grid div[style*="margin-bottom:16px;display:flex"] {
    gap: 10px !important;
  }

  #customers-grid div[style*="margin-bottom:16px;display:flex"] {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  #customers-grid .contact-card-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
  }

  #customers-grid .info-value[style*="display:flex"],
  #customers-grid .info-value > div,
  #customers-grid .note-input-row {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    width: 100% !important;
  }

  #customer-note-input,
  #add-customer-note-btn {
    width: 100% !important;
  }

  #customer-note-input {
    min-height: 110px !important;
  }

  #customers-grid a.btn,
  #customers-grid button.btn {
    justify-content: center;
  }

  #customers-grid a[href^="https://wa.me"],
  #customers-grid a[href^="tel:"],
  #customers-grid a[href^="mailto:"],
  #customers-grid #add-extra-contact-btn {
    min-width: 42px;
    min-height: 42px;
    padding: 6px !important;
  }

  #customers-grid table {
    min-width: 560px !important;
  }

  #customers-grid .activity-item {
    padding: 12px 0;
  }

  #customers-grid .activity-date {
    margin-bottom: 4px;
  }

  .employee-grid {
    grid-template-columns: 1fr !important;
  }

  .product-grid,
  .product-stats {
    grid-template-columns: 1fr !important;
  }

  .employee-card-actions .btn,
  .employee-card-actions a.btn,
  .product-card-actions .btn,
  .assignment-actions .btn,
  .assignment-grid .btn {
    width: 100%;
    justify-content: center;
  }

  .product-purchase-row {
    flex-direction: column;
  }

  .product-purchase-row-actions {
    width: 100%;
  }

  .product-purchase-row-actions .btn {
    width: 100%;
  }

  .product-purchase-summary-grid {
    grid-template-columns: 1fr 1fr !important;
  }

  .assignment-grid,
  .employee-profile-summary,
  .employee-assignment-grid,
  .customers-type-layout {
    grid-template-columns: 1fr !important;
  }

  .archive-event-top,
  .customer-tag-controls {
    flex-direction: column;
    align-items: stretch;
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

  #event-details-modal .modal-header h2 {
    font-size: 15px !important;
  }

  #event-details-modal .info-label {
    font-size: 11px !important;
  }

  #customers-grid .info-section {
    margin-bottom: 16px !important;
  }

  #customers-grid .badge {
    max-width: 100%;
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
.calendar-mobile-list{display:flex;flex-direction:column;gap:12px;padding:14px}
.calendar-mobile-day{border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--white);overflow:hidden}
.calendar-mobile-day-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:#fafbfc;border-bottom:1px solid var(--border)}
.calendar-mobile-day-title{font-size:14px;font-weight:800;color:var(--text)}
.calendar-mobile-day-sub{font-size:11px;color:var(--text3);margin-top:2px}
.calendar-mobile-add{flex-shrink:0}
.calendar-mobile-events{padding:10px}
.calendar-mobile-event{width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:6px;border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--white);margin-bottom:8px;text-align:right;font-family:var(--font);cursor:pointer}
.calendar-mobile-event:last-child{margin-bottom:0}
.calendar-mobile-event-top{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%}
.calendar-mobile-event-name{font-size:13px;font-weight:800;color:var(--text)}
.calendar-mobile-event-meta{font-size:12px;color:var(--text2);line-height:1.5}
.calendar-mobile-empty{padding:20px 14px;text-align:center;color:var(--text3);font-size:13px}

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
        <div><div class="logo-title" id="shell-logo-title">אטרקציות CRM</div><div class="logo-sub" id="shell-logo-sub">ניהול אירועים</div></div>
      </div>
    </div>
    <div class="nav-section">תפריט</div>
    <div class="nav-item active" id="nav-dashboard"><span class="nav-icon">📊</span> דאשבורד</div>
    <div class="nav-item" id="nav-leads"><span class="nav-icon">👥</span> לקוחות <span class="nav-badge" id="nav-leads-count" style="display:none">0</span></div>
    <div class="nav-item" id="nav-employees"><span class="nav-icon">🧑‍💼</span> עובדים</div>
    <div class="nav-item" id="nav-products"><span class="nav-icon">📦</span> מוצרים</div>
    <div class="nav-item" id="nav-shopping"><span class="nav-icon">🛒</span> רשימות קניות</div>
    <div class="nav-item" id="nav-calendar"><span class="nav-icon">📅</span> יומן אירועים</div>
    <div class="nav-item" id="nav-archive"><span class="nav-icon">🗂️</span> ארכיון אירועים</div>
    <div class="nav-item" id="nav-super-admin" style="display:none"><span class="nav-icon">🛠️</span> Super Admin</div>
    <div id="gcal-status" style="margin:8px;padding:10px 12px;border-radius:8px;font-size:12px;display:none"></div>
    <div class="sidebar-bottom">
      <div id="shell-switcher" style="display:none;flex-direction:column;gap:8px;margin:0 8px 12px 8px">
        <button class="btn btn-secondary" id="btn-enter-crm" style="display:none;width:100%;justify-content:center">Enter CRM</button>
        <button class="btn btn-secondary" id="btn-back-platform" style="display:none;width:100%;justify-content:center">Back to Platform Admin</button>
      </div>
      <div class="user-row">
        <div class="user-avatar" id="user-avatar">מ</div>
        <div><div class="user-name" id="user-name">טוען...</div><div class="user-role" id="user-role-text">מנהל</div></div>
        <button class="logout-btn" id="logout-btn">יציאה</button>
      </div>
    </div>
  </div>
  <div id="main">
    <div id="mobile-shell-switcher" class="mobile-shell-switcher" style="display:none">
      <div class="mobile-shell-switcher-inner">
        <button class="btn btn-secondary" id="btn-enter-crm-mobile" style="display:none">Enter CRM</button>
        <button class="btn btn-secondary" id="btn-back-platform-mobile" style="display:none">Back to Platform Admin</button>
      </div>
    </div>
    <div id="mobile-session-actions" class="mobile-session-actions">
      <button class="logout-btn" id="logout-btn-mobile">יציאה</button>
    </div>
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
        <div class="dash-section"><div class="dash-section-title">📅 אירועים בתאריכים קרובים</div><div id="dash-upcoming"><div class="dash-empty">טוען...</div></div></div>
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
          <option value="next_event">אירוע בתאריך</option>
        </select>
>
        </div>
        <div id="customers-grid" style="padding:16px">
          <div class="dash-empty">טוען...</div>
        </div>
      </div>
    </div>
    <div id="page-shopping" class="page">
      <div class="page-header">
        <div class="page-title">רשימות קניות <small>חנויות ופריטים לקנייה</small></div>
        <button class="btn btn-primary" id="btn-new-shopping-list">+ חנות חדשה</button>
      </div>

      <div class="table-toolbar">
        <input class="search-input" id="shopping-search" placeholder="חיפוש חנות...">
      </div>

      <div id="shopping-grid" style="padding:16px">
        <div class="dash-empty">אין עדיין רשימות קניות</div>
      </div>
    </div>

    <div id="page-calendar" class="page">
      <div class="page-header"><div class="page-title">יומן אירועים 📅</div></div>
      <div class="table-card">
        <table><thead><tr><th>תאריך</th><th>שם לקוח</th><th>סוג אירוע</th><th>אולם</th><th>שעה</th><th>אטרקציות</th><th>מחיר</th><th>סטטוס תשלום</th></tr></thead><tbody id="calendar-body"><tr class="empty-row"><td colspan="8">טוען...</td></tr></tbody></table>
      </div>
    </div>
    <div id="page-employees" class="page">
      <div class="page-header">
        <div class="page-title">עובדים <small>ניהול עובדים פעילים ולא פעילים</small></div>
        <button class="btn btn-primary" id="btn-new-employee">+ עובד חדש</button>
      </div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש לפי שם / טלפון / אימייל / תפקיד..." id="employees-search">
          <select class="filter-select" id="employees-status-filter">
            <option value="active">פעילים בלבד</option>
            <option value="all">כל העובדים</option>
            <option value="inactive">לא פעילים</option>
          </select>
        </div>
        <div id="employees-grid" style="padding:16px">
          <div class="dash-empty">טוען...</div>
        </div>
      </div>
    </div>
    <div id="page-products" class="page">
      <div class="page-header">
        <div class="page-title">מוצרים / מלאי</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-secondary" id="btn-product-reports">דוחות רכישות</button>
          <button class="btn btn-primary" id="btn-new-product">+ מוצר חדש</button>
        </div>
      </div>
      <div id="products-page-content">
        <div class="table-card">
          <div class="table-toolbar">
            <input class="search-input" type="text" placeholder="חיפוש לפי שם / קטגוריה / SKU..." id="products-search">
          </div>
          <div id="products-grid" style="padding:16px">
            <div class="dash-empty">טוען...</div>
          </div>
        </div>
      </div>
    </div>
    <div id="page-archive" class="page">
      <div class="page-header">
        <div class="page-title">ארכיון אירועים <small>אירועים שחלף התאריך שלהם</small></div>
      </div>
      <div class="table-card">
        <div id="archive-events-grid" style="padding:16px">
          <div class="dash-empty">טוען...</div>
        </div>
      </div>
    </div>
    <div id="page-super-admin" class="page">
      <div class="page-header">
        <div class="page-title">Super Admin <small>צפייה וניהול בסיסי של עסקים</small></div>
      </div>
      <div class="table-card" style="margin-bottom:16px">
        <div class="table-toolbar" style="display:block">
          <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:10px">Create Tenant</div>
          <div class="form-row-3" style="margin-bottom:10px">
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Name *</label><input class="form-input" id="super-admin-create-name" placeholder="Business name"></div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Slug *</label><input class="form-input" id="super-admin-create-slug" placeholder="business-slug"></div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Timezone</label><input class="form-input" id="super-admin-create-timezone" placeholder="Asia/Jerusalem"></div>
          </div>
          <div class="form-row-3" style="align-items:end">
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Currency</label><input class="form-input" id="super-admin-create-currency" placeholder="ILS"></div>
            <div class="form-group" style="margin-bottom:0"><label class="form-label">Locale</label><input class="form-input" id="super-admin-create-locale" placeholder="he-IL"></div>
            <div class="form-group" style="margin-bottom:0;display:flex;align-items:end"><button class="btn btn-primary" id="super-admin-create-btn">+ Create Tenant</button></div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <table>
          <thead><tr><th>ID</th><th>שם</th><th>Slug</th><th>סטטוס</th><th>נוצר</th><th></th></tr></thead>
          <tbody id="super-admin-tenants-body"><tr class="empty-row"><td colspan="6">טוען...</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="super-admin-tenant-modal">
  <div class="modal" style="width:700px">
    <div class="modal-header"><h2 id="super-admin-tenant-title">Tenant Details</h2><button class="modal-close" id="super-admin-tenant-close">✕</button></div>
    <div class="modal-body" id="super-admin-tenant-body">טוען...</div>
    <div class="modal-footer"><button class="btn btn-secondary" id="super-admin-tenant-close-footer">סגור</button></div>
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
var moduleStateCache = {
  loaded: false,
  byKey: {
    leads: { is_enabled: true, source: 'default_enabled' },
    contacts: { is_enabled: true, source: 'default_enabled' },
    employees: { is_enabled: true, source: 'default_enabled' },
    products: { is_enabled: true, source: 'default_enabled' },
    shopping: { is_enabled: true, source: 'default_enabled' },
    reports: { is_enabled: true, source: 'default_enabled' }
  }
};
var searchTimer, currentLeadId, dupLeadId, selectedContactId = null, currentEmployeeId = null, currentProductId = null, currentProductPurchases = [], currentProductPurchaseEditId = null, currentProductPurchaseFormMode = null, currentProductPurchaseSaving = false, currentProductStock = null, currentProductStockMovements = [], currentProductAdjustmentMode = null, currentProductAdjustmentSaving = false, currentProductReceiveStockPurchaseId = null;
var currentLowStockProducts = [];
var currentOperationalUnreceivedPurchases = [];
var currentOperationalRecentMovements = [];
var allLeadsCache = [];
var calYear, calMonth;
var predefinedCustomerTags = [
  'לקוח חוזר', 'לקוח VIP', 'מחיר רגיש', 'דורש מעקב', 'סגירה מהירה', 'פוטנציאל גבוה',
  'ספק', 'מפיק', 'לקוח עסקי', 'לקוח פרטי', 'בעייתי', 'לא לפנות',
  'שילם מקדמה', 'שולם מלא', 'חייב תשלום', 'המלצה מחבר', 'הגיע מפייסבוק', 'הגיע מגוגל',
  'הגיע מוואטסאפ', 'אירוע גדול', 'אירוע קטן'
];

function getTodayYMD() {
  var parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  var map = {};
  parts.forEach(function(part) {
    if (part.type !== 'literal') map[part.type] = part.value;
  });
  return map.year + '-' + map.month + '-' + map.day;
}

function getMonthYearLabel(dateStr) {
  if (!dateStr) return 'ללא חודש';
  var parts = String(dateStr).substring(0, 10).split('-');
  if (parts.length !== 3) return 'ללא חודש';
  var monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var monthIndex = Number(parts[1]) - 1;
  return (monthNames[monthIndex] || parts[1]) + ' ' + parts[0];
}

function parseCustomerTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(function(tag) { return String(tag || '').trim(); }).filter(Boolean);
  try {
    var parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(function(tag) { return String(tag || '').trim(); }).filter(Boolean);
  } catch (e) {}
  return String(value).split(',').map(function(tag) { return tag.trim(); }).filter(Boolean);
}

function dedupeCustomerTags(tags) {
  var seen = {};
  return (tags || []).map(function(tag) { return String(tag || '').trim(); }).filter(function(tag) {
    if (!tag || seen[tag]) return false;
    seen[tag] = true;
    return true;
  });
}


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

function isSuperAdmin() {
  return !!(currentUser && String(currentUser.role || '').trim().toLowerCase() === 'super_admin');
}

function isModuleEnabled(moduleKey) {
  var item = moduleStateCache && moduleStateCache.byKey ? moduleStateCache.byKey[moduleKey] : null;
  return !item || item.is_enabled !== false;
}

function renderModuleDisabledPage(page, moduleKey) {
  var map = {
    leads: { bodyId: 'leads-body', colspan: 10 },
    customers: { bodyId: 'customers-grid' },
    shopping: { bodyId: 'shopping-grid' },
    calendar: { bodyId: 'calendar-body', colspan: 8 },
    employees: { bodyId: 'employees-grid' },
    products: { bodyId: 'products-page-content' },
    archive: { bodyId: 'archive-events-grid' }
  };
  var target = map[page];
  if (!target) return;
  var bodyEl = document.getElementById(target.bodyId);
  if (!bodyEl) return;
  if (target.colspan) {
    bodyEl.innerHTML = '<tr class="empty-row"><td colspan="' + target.colspan + '">Module disabled</td></tr>';
    return;
  }
  bodyEl.innerHTML = '<div class="table-card"><div class="dash-empty" style="padding:24px">Module disabled</div></div>';
}

function applyModuleVisibility() {
  var navLeads = document.getElementById('nav-leads');
  if (navLeads) navLeads.style.display = isModuleEnabled('contacts') ? 'flex' : 'none';
  var navEmployees = document.getElementById('nav-employees');
  if (navEmployees) navEmployees.style.display = isModuleEnabled('employees') ? 'flex' : 'none';
  var navProducts = document.getElementById('nav-products');
  if (navProducts) navProducts.style.display = isModuleEnabled('products') ? 'flex' : 'none';
  var navShopping = document.getElementById('nav-shopping');
  if (navShopping) navShopping.style.display = isModuleEnabled('shopping') ? 'flex' : 'none';
  var navCalendar = document.getElementById('nav-calendar');
  if (navCalendar) navCalendar.style.display = isModuleEnabled('leads') ? 'flex' : 'none';
  var navArchive = document.getElementById('nav-archive');
  if (navArchive) navArchive.style.display = isModuleEnabled('leads') ? 'flex' : 'none';
  var btnNewLead = document.getElementById('btn-new-lead');
  if (btnNewLead) btnNewLead.style.display = isModuleEnabled('leads') ? 'inline-flex' : 'none';
  var btnNewLead2 = document.getElementById('btn-new-lead2');
  if (btnNewLead2) btnNewLead2.style.display = isModuleEnabled('leads') ? 'inline-flex' : 'none';
  var btnNewCustomer = document.getElementById('btn-new-customer');
  if (btnNewCustomer) btnNewCustomer.style.display = isModuleEnabled('contacts') ? 'inline-flex' : 'none';
  var btnNewEmployee = document.getElementById('btn-new-employee');
  if (btnNewEmployee) btnNewEmployee.style.display = isModuleEnabled('employees') ? 'inline-flex' : 'none';
  var btnNewProduct = document.getElementById('btn-new-product');
  if (btnNewProduct) btnNewProduct.style.display = isModuleEnabled('products') ? 'inline-flex' : 'none';
  var btnNewShoppingList = document.getElementById('btn-new-shopping-list');
  if (btnNewShoppingList) btnNewShoppingList.style.display = isModuleEnabled('shopping') ? 'inline-flex' : 'none';
  var reportsBtn = document.getElementById('btn-product-reports');
  if (reportsBtn) reportsBtn.style.display = isModuleEnabled('reports') ? 'inline-flex' : 'none';
  var lowStockSummary = document.getElementById('products-low-stock-summary');
  if (lowStockSummary) lowStockSummary.style.display = isModuleEnabled('reports') ? 'block' : 'none';
  var operationalWidgets = document.getElementById('products-operational-widgets');
  if (operationalWidgets) operationalWidgets.style.display = isModuleEnabled('reports') ? 'block' : 'none';
}

function getShellMode() {
  var path = window.location.pathname || '/';
  if (path === '/admin') return 'admin';
  if (path === '/crm') return 'crm';
  return 'default';
}

function setShellPath(path) {
  if (window.location.pathname !== path) {
    window.history.replaceState({}, '', path);
  }
}

function goToAdminShell() {
  setShellPath('/admin');
  applyShellVisibility();
  goTo('super-admin', document.getElementById('nav-super-admin'));
}

function goToCrmShell() {
  setShellPath('/crm');
  applyShellVisibility();
  goTo('dashboard', document.getElementById('nav-dashboard'));
}

function applyShellVisibility() {
  var shellMode = getShellMode();
  var isAdminShell = shellMode === 'admin';
  var isCrmShell = shellMode === 'crm';
  var isAdminUser = isSuperAdmin();
  var crmNavIds = ['nav-dashboard', 'nav-leads', 'nav-employees', 'nav-products', 'nav-shopping', 'nav-calendar', 'nav-archive'];
  var logoTitle = document.getElementById('shell-logo-title');
  var logoSub = document.getElementById('shell-logo-sub');

  crmNavIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.display = isAdminShell ? 'none' : 'flex';
  });

  if (logoTitle) logoTitle.textContent = isAdminShell ? 'Platform Admin' : 'Comics Events CRM';
  if (logoSub) logoSub.textContent = isAdminShell ? 'Super Admin Control Plane' : 'Tenant Business Workspace';

  var navSuperAdmin = document.getElementById('nav-super-admin');
  if (navSuperAdmin) {
    navSuperAdmin.style.display = isAdminUser && !isCrmShell ? 'flex' : 'none';
  }

  var switcher = document.getElementById('shell-switcher');
  var enterCrm = document.getElementById('btn-enter-crm');
  var backPlatform = document.getElementById('btn-back-platform');
  var mobileSwitcher = document.getElementById('mobile-shell-switcher');
  var enterCrmMobile = document.getElementById('btn-enter-crm-mobile');
  var backPlatformMobile = document.getElementById('btn-back-platform-mobile');
  var isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
  if (switcher) switcher.style.display = isAdminUser ? 'flex' : 'none';
  if (enterCrm) enterCrm.style.display = isAdminUser && isAdminShell ? 'flex' : 'none';
  if (backPlatform) backPlatform.style.display = isAdminUser && isCrmShell ? 'flex' : 'none';
  if (mobileSwitcher) mobileSwitcher.style.display = isAdminUser && isMobileViewport ? 'block' : 'none';
  if (enterCrmMobile) enterCrmMobile.style.display = isAdminUser && isMobileViewport && isAdminShell ? 'inline-flex' : 'none';
  if (backPlatformMobile) backPlatformMobile.style.display = isAdminUser && isMobileViewport && isCrmShell ? 'inline-flex' : 'none';
}

function loadModuleStates() {
  moduleStateCache.loaded = false;
  return apiCall('GET', '/api/auth/modules').then(function(data) {
    var next = {
      leads: { is_enabled: true, source: 'default_enabled' },
      contacts: { is_enabled: true, source: 'default_enabled' },
      employees: { is_enabled: true, source: 'default_enabled' },
      products: { is_enabled: true, source: 'default_enabled' },
      shopping: { is_enabled: true, source: 'default_enabled' },
      reports: { is_enabled: true, source: 'default_enabled' }
    };
    (data.modules || []).forEach(function(module) {
      if (next[module.module_key]) next[module.module_key] = module;
    });
    moduleStateCache.byKey = next;
    moduleStateCache.loaded = true;
    applyModuleVisibility();
    applyShellVisibility();
  }).catch(function() {
    moduleStateCache.loaded = true;
    applyModuleVisibility();
    applyShellVisibility();
  });
}

function applySuperAdminVisibility() {
  var roleEl = document.getElementById('user-role-text');
  if (roleEl) roleEl.textContent = isSuperAdmin() ? 'Super Admin' : 'מנהל';
  applyModuleVisibility();
  applyShellVisibility();
}

function init() {
  var now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  var el = document.getElementById('dash-date');
  if (el) el.textContent = now.toLocaleDateString('he-IL', {weekday:'long',day:'numeric',month:'long',year:'numeric'});

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('logout-btn-mobile').addEventListener('click', logout);
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
  var navEmployees = document.getElementById('nav-employees');
  if (navEmployees) navEmployees.addEventListener('click', function() { goTo('employees', this); });
  var navProducts = document.getElementById('nav-products');
  if (navProducts) navProducts.addEventListener('click', function() { goTo('products', this); });
  var navShopping = document.getElementById('nav-shopping');
  if (navShopping) navShopping.addEventListener('click', function() { goTo('shopping', this); });
  document.getElementById('nav-calendar').addEventListener('click', function() { goTo('calendar', this); });
  var navArchive = document.getElementById('nav-archive');
  if (navArchive) navArchive.addEventListener('click', function() { goTo('archive', this); });
  var navSuperAdmin = document.getElementById('nav-super-admin');
  if (navSuperAdmin) navSuperAdmin.addEventListener('click', function() { goTo('super-admin', this); });
  var enterCrmBtn = document.getElementById('btn-enter-crm');
  if (enterCrmBtn) enterCrmBtn.addEventListener('click', goToCrmShell);
  var backPlatformBtn = document.getElementById('btn-back-platform');
  if (backPlatformBtn) backPlatformBtn.addEventListener('click', goToAdminShell);
  var enterCrmMobileBtn = document.getElementById('btn-enter-crm-mobile');
  if (enterCrmMobileBtn) enterCrmMobileBtn.addEventListener('click', goToCrmShell);
  var backPlatformMobileBtn = document.getElementById('btn-back-platform-mobile');
  if (backPlatformMobileBtn) backPlatformMobileBtn.addEventListener('click', goToAdminShell);
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
    if (e.key === 'Escape') { closeLeadModal(); closeDrawer(); closeCustomerModal(); closeSuperAdminTenantModal(); }
  });
  var superAdminClose = document.getElementById('super-admin-tenant-close');
  if (superAdminClose) superAdminClose.addEventListener('click', closeSuperAdminTenantModal);
  var superAdminCloseFooter = document.getElementById('super-admin-tenant-close-footer');
  if (superAdminCloseFooter) superAdminCloseFooter.addEventListener('click', closeSuperAdminTenantModal);
  var superAdminModal = document.getElementById('super-admin-tenant-modal');
  if (superAdminModal) superAdminModal.addEventListener('click', function(e) { if (e.target === this) closeSuperAdminTenantModal(); });
  var superAdminCreateBtn = document.getElementById('super-admin-create-btn');
  if (superAdminCreateBtn) superAdminCreateBtn.addEventListener('click', createTenantFromSuperAdmin);

  if (token && currentUser) showApp();
}

function goTo(page, el) {
  var pageModuleMap = {
    leads: 'leads',
    customers: 'contacts',
    employees: 'employees',
    products: 'products',
    shopping: 'shopping',
    calendar: 'leads',
    archive: 'leads'
  };
  var requiredModule = pageModuleMap[page];
  if (requiredModule && !isModuleEnabled(requiredModule)) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    var blockedPage = document.getElementById('page-' + page);
    if (!blockedPage) return;
    blockedPage.classList.add('active');
    if (el) el.classList.add('active');
    renderModuleDisabledPage(page, requiredModule);
    toast('Module disabled', 'error');
    return;
  }
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  pageEl.classList.add('active');
  if (el) el.classList.add('active');
  if (page === 'dashboard') loadDashboard();
  if (page === 'leads') loadLeads();
  if (page === 'shopping') loadShoppingLists();
  if (page === 'calendar') loadCalendar();
  if (page === 'customers') loadCustomers();
  if (page === 'employees') loadEmployees();
  if (page === 'products') loadProducts();
  if (page === 'archive') loadEventArchive();
  if (page === 'super-admin') loadSuperAdminTenants();
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
  
setTimeout(function() {

  grid.querySelectorAll('[data-shopping-id]').forEach(function(card) {

    card.addEventListener('click', function() {

      openShoppingList(parseInt(this.getAttribute('data-shopping-id')));

    });

  });

}, 50);

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

  var shellMode = getShellMode();
  if (shellMode === 'default') {
    setShellPath(isSuperAdmin() ? '/admin' : '/crm');
    shellMode = getShellMode();
  }

  applySuperAdminVisibility();
  if (shellMode === 'admin' && isSuperAdmin()) {
    goTo('super-admin', document.getElementById('nav-super-admin'));
  } else {
    if (shellMode === 'admin' && !isSuperAdmin()) {
      setShellPath('/crm');
      applySuperAdminVisibility();
    }
    goTo('dashboard', document.getElementById('nav-dashboard'));
    loadDashboard();
    preloadLeads();
    checkGoogleStatus();
  }
  loadModuleStates();
}

function logout() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_user');
  token = null; currentUser = null;
  moduleStateCache = {
    loaded: false,
    byKey: {
      leads: { is_enabled: true, source: 'default_enabled' },
      contacts: { is_enabled: true, source: 'default_enabled' },
      employees: { is_enabled: true, source: 'default_enabled' },
      products: { is_enabled: true, source: 'default_enabled' },
      shopping: { is_enabled: true, source: 'default_enabled' },
      reports: { is_enabled: true, source: 'default_enabled' }
    }
  };
  applySuperAdminVisibility();
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function loadSuperAdminTenants() {
  var body = document.getElementById('super-admin-tenants-body');
  if (!body) return;
  body.innerHTML = '<tr class="empty-row"><td colspan="6">טוען...</td></tr>';
  apiCall('GET', '/api/admin/tenants').then(function(data) {
    var tenants = data.tenants || [];
    if (!tenants.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="6">אין עסקים להצגה</td></tr>';
      return;
    }
    body.innerHTML = tenants.map(function(t) {
      var actionBtn = t.status === 'suspended'
        ? '<button class="btn btn-secondary btn-sm" data-tenant-activate="' + t.id + '">Activate</button>'
        : '<button class="btn btn-danger btn-sm" data-tenant-suspend="' + t.id + '">Suspend</button>';
      return '<tr data-tenant-id="' + t.id + '"><td>' + t.id + '</td><td class="bold">' + escapeHtml(t.name || '—') + '</td><td>' + escapeHtml(t.slug || '—') + '</td><td>' + escapeHtml(t.status || '—') + '</td><td>' + escapeHtml(formatDate(t.created_at) || '—') + '</td><td>' + actionBtn + '</td></tr>';
    }).join('');
    body.querySelectorAll('tr[data-tenant-id]').forEach(function(row) {
      row.addEventListener('click', function() {
        openSuperAdminTenantModal(Number(this.getAttribute('data-tenant-id')));
      });
    });
    body.querySelectorAll('[data-tenant-suspend]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateTenantStatus(Number(this.getAttribute('data-tenant-suspend')), 'suspend');
      });
    });
    body.querySelectorAll('[data-tenant-activate]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateTenantStatus(Number(this.getAttribute('data-tenant-activate')), 'activate');
      });
    });
  }).catch(function(err) {
    body.innerHTML = '<tr class="empty-row"><td colspan="6">' + escapeHtml(err.message || 'שגיאה בטעינת עסקים') + '</td></tr>';
  });
}

function createTenantFromSuperAdmin() {
  var body = {
    name: (document.getElementById('super-admin-create-name').value || '').trim(),
    slug: (document.getElementById('super-admin-create-slug').value || '').trim(),
    timezone: (document.getElementById('super-admin-create-timezone').value || '').trim(),
    currency: (document.getElementById('super-admin-create-currency').value || '').trim(),
    locale: (document.getElementById('super-admin-create-locale').value || '').trim()
  };
  if (!body.name) { toast('שם עסק חובה', 'error'); return; }
  if (!body.slug) { toast('slug חובה', 'error'); return; }
  apiCall('POST', '/api/admin/tenants', body).then(function(res) {
    document.getElementById('super-admin-create-name').value = '';
    document.getElementById('super-admin-create-slug').value = '';
    document.getElementById('super-admin-create-timezone').value = '';
    document.getElementById('super-admin-create-currency').value = '';
    document.getElementById('super-admin-create-locale').value = '';
    loadSuperAdminTenants();
    toast('העסק נוצר', 'success');
    if (res && res.tenant && res.tenant.id) openSuperAdminTenantModal(res.tenant.id);
  }).catch(function(err) {
    toast(err.message || 'שגיאה ביצירת עסק', 'error');
  });
}

function updateTenantStatus(tenantId, action) {
  var path = '/api/admin/tenants/' + tenantId + '/' + action;
  apiCall('POST', path, {}).then(function() {
    loadSuperAdminTenants();
    closeSuperAdminTenantModal();
    toast(action === 'activate' ? 'העסק הופעל' : 'העסק הושהה', 'success');
  }).catch(function(err) {
    toast(err.message || 'שגיאה בעדכון סטטוס עסק', 'error');
  });
}

function closeSuperAdminTenantModal() {
  var modal = document.getElementById('super-admin-tenant-modal');
  if (modal) modal.classList.remove('open');
}

function openSuperAdminTenantModal(tenantId) {
  var modal = document.getElementById('super-admin-tenant-modal');
  var title = document.getElementById('super-admin-tenant-title');
  var body = document.getElementById('super-admin-tenant-body');
  if (!modal || !title || !body) return;
  title.textContent = 'Tenant #' + tenantId;
  body.innerHTML = '<div class="dash-empty">טוען...</div>';
  modal.classList.add('open');
  Promise.all([
    apiCall('GET', '/api/admin/tenants/' + tenantId),
    apiCall('GET', '/api/admin/tenants/' + tenantId + '/modules')
  ]).then(function(results) {
    var tenant = results[0].tenant || {};
    var modules = results[1].modules || [];
    title.textContent = (tenant.name || 'Tenant') + ' · #' + tenant.id;
    body.innerHTML = '' +
      '<div class="info-grid">' +
        '<div class="info-row"><span class="info-label">ID</span><span class="info-value">' + escapeHtml(String(tenant.id || '—')) + '</span></div>' +
        '<div class="info-row"><span class="info-label">Slug</span><span class="info-value">' + escapeHtml(tenant.slug || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">סטטוס</span><span class="info-value">' + escapeHtml(tenant.status || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Timezone</span><span class="info-value">' + escapeHtml(tenant.timezone || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Currency</span><span class="info-value">' + escapeHtml(tenant.currency || '—') + '</span></div>' +
        '<div class="info-row"><span class="info-label">Locale</span><span class="info-value">' + escapeHtml(tenant.locale || '—') + '</span></div>' +
      '</div>' +
      '<div class="form-section">Modules</div>' +
      '<div class="admin-module-grid">' + modules.map(function(module) {
        var enabled = module.is_enabled === true;
        return '<div class="admin-module-card">' +
          '<div class="admin-module-title">' + escapeHtml(module.module_key) + '</div>' +
          '<div><span class="badge ' + (enabled ? 'badge-green' : 'badge-gray') + '">' + (enabled ? 'Enabled' : 'Disabled') + '</span></div>' +
          '<div class="admin-module-sub">' + escapeHtml(module.source === 'default_enabled' ? 'default_enabled' : 'configured') + '</div>' +
        '</div>';
      }).join('') + '</div>';
  }).catch(function(err) {
    body.innerHTML = '<div class="dash-empty">' + escapeHtml(err.message || 'שגיאה בטעינת tenant') + '</div>';
  });
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
    var today = getTodayYMD();
    var todayEvents = [];
    var futureEvents = [];
    (d.upcoming || []).forEach(function(l) {
      var eventDate = (l.event_date || '').substring(0, 10);
      if (eventDate === today) todayEvents.push(l);
      else if (!eventDate || eventDate > today) futureEvents.push(l);
    });
    function renderDashboardEvent(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.event_type||'') + ' - ' + (l.venue||'') + '</div></div><span style="font-size:12px;font-weight:700;color:var(--accent)">' + formatDate(l.event_date) + '</span></div>';
    }
    function renderDashboardSection(title, items, emptyText) {
      return '<div class="dash-subsection-title">' + title + '</div>' + (items.length ? items.map(renderDashboardEvent).join('') : '<div class="dash-empty">' + emptyText + '</div>');
    }
    upEl.innerHTML = renderDashboardSection('אירועים היום', todayEvents, 'אין אירועים להיום') + renderDashboardSection('אירועים עתידיים', futureEvents, 'אין אירועים עתידיים להצגה');
    var recEl = document.getElementById('dash-recent');
    recEl.innerHTML = d.recentLeads.length ? d.recentLeads.map(function(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.phone||'') + (l.event_type ? ' - ' + l.event_type : '') + '</div></div>' + statusBadge(l.status) + '</div>';
    }).join('') : '<div class="dash-empty">אין לידים עדיין</div>';
    document.querySelectorAll('.dash-item[data-id]').forEach(function(el) {
      el.addEventListener('click', function() { openEventDetailsModal(parseInt(this.getAttribute('data-id'))); });
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

    var today = new Date().toISOString().split('T')[0];
    var futureLeads = [];
    var archivedLeads = [];

    leads.forEach(function(l) {
      var eventDate = (l.event_date || '').substring(0, 10);
      if (eventDate && eventDate < today) archivedLeads.push(l);
      else futureLeads.push(l);
    });

    function renderLeadRow(l) {
      var payBadge = l.price > 0 ? (l.balance_paid ? '<span class="badge badge-green">שולם</span>' : (l.deposit > 0 ? '<span class="badge badge-yellow">מקדמה</span>' : '<span class="badge badge-red">טרם שולם</span>')) : '';
      return '<tr data-id="' + l.id + '"><td><div class="dot ' + getUrgencyDot(l.next_contact) + '"></div></td><td class="bold">' + l.name + '</td><td>' + (l.phone||'—') + '</td><td>' + (l.event_type||'—') + '</td><td>' + (l.event_date?formatDate(l.event_date):'—') + '</td><td>' + (l.venue||'—') + '</td><td>' + (l.price?'₪'+fmtMoney(l.price):payBadge||'—') + '</td><td>' + statusBadge(l.status) + '</td><td style="font-size:12px;' + (isOverdue(l.next_contact)?'color:var(--red);font-weight:700':'') + '">' + (l.next_contact?formatDate(l.next_contact):'—') + '</td><td><button class="btn btn-ghost btn-sm edit-btn" data-id="' + l.id + '">עריכה</button> <button class="btn btn-danger btn-sm del-btn" data-id="' + l.id + '">מחיקה</button></td></tr>';
    }

    function renderLeadSection(title, sectionLeads, emptyText) {
      var html = '<tr class="leads-section-row"><td colspan="10">' + title + '</td></tr>';
      html += sectionLeads.length ? sectionLeads.map(renderLeadRow).join('') : '<tr class="empty-row"><td colspan="10">' + emptyText + '</td></tr>';
      return html;
    }

    tbody.innerHTML =
      renderLeadSection('אירועים עתידיים', futureLeads, 'אין אירועים עתידיים להצגה') +
      renderLeadSection('ארכיון אירועים', archivedLeads, 'אין אירועים בארכיון');

    tbody.querySelectorAll('tr[data-id]').forEach(function(row) {
      row.addEventListener('click', function(e) { if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('del-btn')) openDrawer(parseInt(this.getAttribute('data-id'))); });
    });
    tbody.querySelectorAll('.edit-btn').forEach(function(btn) { btn.addEventListener('click', function(e) { e.stopPropagation(); editLead(parseInt(this.getAttribute('data-id'))); }); });
    tbody.querySelectorAll('.del-btn').forEach(function(btn) { btn.addEventListener('click', function(e) { e.stopPropagation(); deleteLead(parseInt(this.getAttribute('data-id'))); }); });
  }).catch(function(e) { toast(e.message, 'error'); });
}





function loadEventArchive() {
  var grid = document.getElementById('archive-events-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="dash-empty">טוען...</div>';

  apiCall('GET', '/api/leads').then(function(data) {
    var today = getTodayYMD();
    var leads = (data.leads || []).filter(function(l) {
      var eventDate = (l.event_date || '').substring(0, 10);
      return eventDate && eventDate < today;
    });

    if (!leads.length) {
      grid.innerHTML = '<div class="dash-empty">אין אירועים בארכיון</div>';
      return;
    }

    leads.sort(function(a, b) {
      var ad = (a.event_date || '').substring(0, 10);
      var bd = (b.event_date || '').substring(0, 10);
      return String(bd).localeCompare(String(ad));
    });

    var grouped = {};
    var monthKeys = [];

    leads.forEach(function(l) {
      var key = String(l.event_date || '').substring(0, 7);
      if (!grouped[key]) {
        grouped[key] = [];
        monthKeys.push(key);
      }
      grouped[key].push(l);
    });

    grid.innerHTML = monthKeys.map(function(key) {
      var monthLeads = grouped[key] || [];
      return '<div class="archive-month-section">' +
        '<div class="archive-month-title">' + getMonthYearLabel(key + '-01') + '</div>' +
        monthLeads.map(function(l) {
          return '<div class="archive-event-item" data-id="' + l.id + '">' +
            '<div class="archive-event-top">' +
              '<div>' +
                '<div class="archive-event-name">' + (l.name || 'ללא שם') + '</div>' +
                '<div class="archive-event-meta">' + (l.event_type || 'אירוע') + (l.venue ? ' · ' + l.venue : '') + '</div>' +
              '</div>' +
              '<div class="archive-event-meta" style="font-weight:800;color:var(--accent)">' + formatDate(l.event_date) + (l.event_time ? ' · ' + l.event_time : '') + '</div>' +
            '</div>' +
            '<div class="archive-event-pills">' +
              '<span class="customer-stat-pill">אירוע #' + (l.lead_num || l.id) + '</span>' +
              '<span class="customer-stat-pill">' + (l.phone || 'ללא טלפון') + '</span>' +
              '<span class="customer-stat-pill">' + statusBadge(l.status) + '</span>' +
              '<span class="customer-stat-pill">₪' + fmtMoney(l.price || 0) + '</span>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    }).join('');

    grid.querySelectorAll('.archive-event-item[data-id]').forEach(function(card) {
      card.addEventListener('click', function() {
        openEventDetailsModal(parseInt(this.getAttribute('data-id')));
      });
    });
  }).catch(function(e) {
    grid.innerHTML = '<div class="dash-empty">שגיאה בטעינת ארכיון האירועים</div>';
    toast(e.message, 'error');
  });
}

function loadShoppingLists() {
  var grid = document.getElementById('shopping-grid');
  if (!grid) return;

  apiCall('GET', '/api/shopping-lists').then(function(data) {
    var lists = data.lists || [];

    if (!lists.length) {
      grid.innerHTML = '<div class="dash-empty">אין עדיין רשימות קניות</div>';
      return;
    }

    grid.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">' +
      lists.map(function(l) {
        return '<div class="customer-card" data-shopping-id="' + l.id + '" style="cursor:pointer">' +
          '<div class="customer-card-name">' + (l.name || 'חנות ללא שם') + '</div>' +
          '<div class="customer-card-meta">' + (l.contact_name || '') + (l.contact_phone ? ' · ' + l.contact_phone : '') + '</div>' +
          '<div class="customer-card-meta">' + (l.address || '') + '</div>' +
          '<div class="customer-card-stats" style="margin-top:12px">' +
            '<span class="customer-stat-pill">' + (l.items_count || 0) + ' פריטים</span>' +
            '<span class="customer-stat-pill">' + (l.done_count || 0) + ' נקנו</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';

    grid.querySelectorAll('[data-shopping-id]').forEach(function(card) {
      card.onclick = function() {
        openShoppingList(parseInt(this.getAttribute('data-shopping-id')));
      };
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}



var currentShoppingListId = null;

var shoppingProductOptionsCache = null;
var shoppingProductOptionsPromise = null;

function escapeShoppingProductText(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getShoppingProductLabel(productId) {
  if (!productId || !shoppingProductOptionsCache || !shoppingProductOptionsCache.length) {
    return 'מוצר #' + productId;
  }
  var product = shoppingProductOptionsCache.find(function(p) { return Number(p.id) === Number(productId); });
  if (!product) return 'מוצר #' + productId;
  return product.name + (Number(product.is_active) === 0 ? ' (מושבת)' : '');
}

function buildShoppingProductOptions(selectedProductId) {
  var html = '<option value="">ללא קישור</option>';
  (shoppingProductOptionsCache || []).forEach(function(product) {
    html += '<option value="' + product.id + '"' + (Number(selectedProductId) === Number(product.id) ? ' selected' : '') + '>' +
      escapeShoppingProductText(product.name + (Number(product.is_active) === 0 ? ' (מושבת)' : '')) +
      '</option>';
  });
  return html;
}

function ensureShoppingProductOptions() {
  if (shoppingProductOptionsCache) return Promise.resolve(shoppingProductOptionsCache);
  if (shoppingProductOptionsPromise) return shoppingProductOptionsPromise;

  shoppingProductOptionsPromise = apiCall('GET', '/api/products?includeInactive=1').then(function(data) {
    shoppingProductOptionsCache = Array.isArray(data.products) ? data.products.slice() : [];
    shoppingProductOptionsCache.sort(function(a, b) {
      return String(a.name || '').localeCompare(String(b.name || ''), 'he');
    });
    return shoppingProductOptionsCache;
  }).catch(function(error) {
    shoppingProductOptionsPromise = null;
    throw error;
  });

  return shoppingProductOptionsPromise;
}

function populateShoppingProductSelect(selectId, selectedProductId) {
  var select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">טוען מוצרים...</option>';
  select.disabled = true;

  ensureShoppingProductOptions().then(function() {
    var currentSelect = document.getElementById(selectId);
    if (!currentSelect) return;
    currentSelect.innerHTML = buildShoppingProductOptions(selectedProductId);
    currentSelect.disabled = false;
  }).catch(function(error) {
    var currentSelect = document.getElementById(selectId);
    if (!currentSelect) return;
    currentSelect.innerHTML = '<option value="">שגיאה בטעינת מוצרים</option>';
    currentSelect.disabled = false;
    toast(error.message || 'שגיאה בטעינת מוצרים', 'error');
  });
}

function getShoppingSelectedProductId(selectId) {
  var select = document.getElementById(selectId);
  if (!select) return null;
  var value = String(select.value || '').trim();
  return value ? Number(value) : null;
}

function renderShoppingLinkedProductBadge(item) {
  if (!item || !item.product_id) return '';
  return '<div style="margin-top:4px"><span class="badge badge-purple">מוצר מקושר: ' + escapeShoppingProductText(getShoppingProductLabel(item.product_id)) + '</span></div>';
}

function openShoppingItemModal() {

  if (!currentShoppingListId) {
    toast('לא נבחרה חנות', 'error');
    return;
  }

  var old = document.getElementById('shopping-item-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-item-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:500px">' +

      '<div class="modal-header">' +
        '<h2>מוצר חדש</h2>' +
        '<button class="modal-close" id="shopping-item-close">✕</button>' +
      '</div>' +

      '<div class="modal-body">' +

        '<div class="form-group">' +
          '<label class="form-label">שם מוצר</label>' +
          '<input class="form-input" id="shopping-item-name">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">כמות</label>' +
          '<input class="form-input" id="shopping-item-quantity">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">מחיר</label>' +
          '<input class="form-input" type="number" id="shopping-item-price">' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">סטטוס</label>' +
          '<select class="form-input" id="shopping-item-status">' +
            '<option value="pending">ממתין</option>' +
            '<option value="done">נקנה</option>' +
          '</select>' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">מוצר מקושר</label>' +
          '<select class="form-input" id="shopping-item-product"><option value="">טוען מוצרים...</option></select>' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label">הערות</label>' +
          '<textarea class="form-input" id="shopping-item-notes" style="min-height:80px"></textarea>' +
        '</div>' +

      '</div>' +

      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="shopping-item-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="shopping-item-save">שמור</button>' +
      '</div>' +

    '</div>';

  document.body.appendChild(overlay);

  function closeModal() {
    overlay.remove();
  }

  document.getElementById('shopping-item-close').onclick = closeModal;
  document.getElementById('shopping-item-cancel').onclick = closeModal;
  populateShoppingProductSelect('shopping-item-product', null);

  document.getElementById('shopping-item-save').onclick = function() {

    var itemName = document.getElementById('shopping-item-name').value.trim();

    if (!itemName) {
      toast('שם מוצר חובה', 'error');
      return;
    }

    apiCall(
      'POST',
      '/api/shopping-lists/' + currentShoppingListId + '/items',
      {
        item_name: itemName,
        quantity: document.getElementById('shopping-item-quantity').value.trim(),
        price: Number(document.getElementById('shopping-item-price').value || 0),
        status: document.getElementById('shopping-item-status').value,
        product_id: getShoppingSelectedProductId('shopping-item-product'),
        notes: document.getElementById('shopping-item-notes').value.trim()
      }
    )
    .then(function() {

      closeModal();

      toast('מוצר נוסף', 'success');

      openShoppingList(currentShoppingListId);

    })
    .catch(function(e) {

      toast(e.message, 'error');

    });
  };
}



function openShoppingList(id) {
  currentShoppingListId = id;
  apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
    var grid = document.getElementById('shopping-grid');
    if (!grid) return;

    var list = data.list || {};
    var items = data.items || [];
    var purchases = data.purchases || [];
    var summary = data.summary || {};

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-shopping">← חזרה לחנויות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר לרשימה</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">';

    html += '<div>';

    html += '<div class="contact-card">';
    html += '<div class="contact-card-header"><div>';
    html += '<div class="contact-card-name">' + (list.name || 'חנות') + '</div>';
    html += '<div class="contact-card-meta">' + (list.address || '') + '</div>';
    html += '</div><span class="badge badge-purple">' + items.length + ' פריטים</span></div>';

    html += '<div class="info-section"><div class="info-section-title">פרטי חנות</div>';
    html += '<div class="info-row"><span class="info-label">איש קשר</span><span class="info-value">' + (list.contact_name || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (list.contact_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון נוסף</span><span class="info-value">' + (list.extra_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">שעות פתיחה</span><span class="info-value">' + (list.opening_hours || '—') + '</span></div>';
    html += '</div></div>';

    html += '<div class="stats-grid" style="margin-top:16px">';
    html += '<div class="stat-card"><div class="stat-label">החודש</div><div class="stat-value">₪' + fmtMoney(summary.current_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">חודש שעבר</div><div class="stat-value">₪' + fmtMoney(summary.previous_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">מתחילת השנה</div><div class="stat-value">₪' + fmtMoney(summary.year_total || 0) + '</div></div>';
    html += '</div>';

    html += '<div class="table-card" style="margin-top:16px">';
    html += '<div class="table-toolbar" style="justify-content:space-between"><strong>רשימת קניות פעילה</strong><button class="btn btn-primary btn-sm" id="shopping-purchased-btn">קניתי</button></div>';

    if (!items.length) {
      html += '<div class="dash-empty">אין מוצרים ברשימה</div>';
    } else {
      html += '<table><thead><tr><th>מוצר</th><th>כמות</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
      items.forEach(function(it) {
        html += '<tr><td>' + (it.item_name || '') + '</td><td>' + (it.quantity || '') + '</td><td>₪' + fmtMoney(it.price || 0) + '</td><td>' + (it.status || 'pending') + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    html += '<div class="table-card">';
    html += '<div class="table-toolbar"><strong>עסקאות קודמות</strong></div>';

    if (!purchases.length) {
      html += '<div class="dash-empty">אין עסקאות קודמות</div>';
    } else {
      html += '<table><thead><tr><th>תאריך</th><th>סכום</th><th>הערות</th></tr></thead><tbody>';
      purchases.forEach(function(p) {
        html += '<tr class="shopping-purchase-row" data-purchase-id="' + p.id + '" style="cursor:pointer"><td>' + (p.purchase_date || '') + '</td><td>₪' + fmtMoney(p.total_amount || 0) + '</td><td>' + (p.notes || '') + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    grid.innerHTML = html;

    
document.getElementById('back-to-shopping').onclick = loadShoppingLists;

var addBtn = document.getElementById('add-shopping-item-btn');

if (addBtn) {
  addBtn.onclick = openShoppingItemModal;
}

  }).catch(function(e) {
    toast(e.message, 'error');
  });
}

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
  var mobileDayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  var year = window.calendarViewYear;
  var month = window.calendarViewMonth;
  var isMobileCalendar = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

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

  if (isMobileCalendar) {
    var monthEvents = leads.filter(function(l) {
      var parts = String(l.event_date || '').substring(0, 10).split('-');
      return Number(parts[0]) === year && Number(parts[1]) === (month + 1);
    }).sort(function(a, b) {
      var ad = String(a.event_date || '') + ' ' + String(a.event_time || '');
      var bd = String(b.event_date || '') + ' ' + String(b.event_time || '');
      return ad.localeCompare(bd);
    });

    if (!monthEvents.length) {
      html += '<div class="calendar-mobile-empty">אין אירועים לחודש זה</div>';
    } else {
      var grouped = {};
      monthEvents.forEach(function(item) {
        var key = String(item.event_date || '').substring(0, 10);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      html += '<div class="calendar-mobile-list">';
      Object.keys(grouped).sort().forEach(function(dateKey) {
        var parts = dateKey.split('-');
        var dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        html += '<div class="calendar-mobile-day">';
        html += '<div class="calendar-mobile-day-header">';
        html += '<div><div class="calendar-mobile-day-title">' + formatDate(dateKey) + '</div><div class="calendar-mobile-day-sub">' + mobileDayNames[dateObj.getDay()] + ' · ' + grouped[dateKey].length + ' אירועים</div></div>';
        html += '<button class="btn btn-secondary btn-sm calendar-mobile-add" data-date="' + dateKey + '">+ אירוע</button>';
        html += '</div>';
        html += '<div class="calendar-mobile-events">';
        grouped[dateKey].forEach(function(l) {
          html += '<button class="calendar-mobile-event" data-event-id="' + l.id + '">';
          html += '<div class="calendar-mobile-event-top"><div class="calendar-mobile-event-name">' + escapeHtml(l.name || 'ללא שם') + '</div>' + statusBadge(l.status) + '</div>';
          html += '<div class="calendar-mobile-event-meta">' + escapeHtml((l.event_time || 'שעה לא צוינה') + (l.event_type ? ' · ' + l.event_type : '')) + '</div>';
          if (l.venue) html += '<div class="calendar-mobile-event-meta">' + escapeHtml(l.venue) + '</div>';
          html += '</button>';
        });
        html += '</div></div>';
      });
      html += '</div>';
    }
  } else {
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

    html += '</div>';
  }

  html += '</div>';

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

  tableCard.querySelectorAll('.calendar-add-btn, .calendar-mobile-add').forEach(function(btn) {
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

  tableCard.querySelectorAll('.calendar-event-pill[data-event-id], .calendar-mobile-event[data-event-id]').forEach(function(btn) {
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      openEventDetailsModal(parseInt(this.getAttribute('data-event-id')));
    };
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

function addCustomerNote(customerId) {
  var input = document.getElementById('customer-note-input');
  var note = input ? input.value.trim() : '';
  if (!note || !customerId) return;
  apiCall('POST', '/api/contacts/' + customerId + '/notes', { note: note }).then(function() {
    if (input) input.value = '';
    openCustomerCard(customerId);
    toast('הערת לקוח נוספה', 'success');
  }).catch(function(e) { toast(e.message, 'error'); });
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

function invalidatePages() {
  // kept for future page-cache invalidation, no behavior change currently
}

function refreshAfterLeadMutation(successMessage) {
  loadLeads();
  loadDashboard();
  preloadLeads();
  toast(successMessage, 'success');
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
    invalidatePages();
    refreshAfterLeadMutation(id ? 'ליד עודכן בהצלחה' : 'ליד נוסף בהצלחה');
  }).catch(function(e) { toast(e.message, 'error'); });
}

function deleteLead(id) {
  if (!confirm('למחוק ליד זה?')) return;
  apiCall('DELETE', '/api/leads/' + id).then(function() { invalidatePages(); refreshAfterLeadMutation('נמחק'); }).catch(function(e) { toast(e.message, 'error'); });
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
      el.innerHTML = '<span style="color:#16a34a;font-weight:600">✓ Google Calendar מחובר</span><br><div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap"><button onclick="disconnectGoogle()" style="font-size:11px;background:none;border:none;color:#dc2626;cursor:pointer">נתק חיבור</button><button id="sync-google-backlog-btn" style="font-size:11px;background:var(--blue);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">סנכרן את כל האירועים עכשיו</button></div>';
      document.getElementById('drawer-sync-btn').style.display = '';
      document.getElementById('sync-google-backlog-btn').onclick = function() {
        if (!confirm('זה יסנכרן מחדש את כל האירועים מהיום והלאה ליומן Google. להמשיך?')) return;
        toast('מסנכרן מחדש אירועים מהיום והלאה ל-Google Calendar...', 'success');
        apiCall('POST', '/api/google/resync-future').then(function(result) {
          toast('הסתיים: סונכרנו ' + (result.synced || 0) + ' מתוך ' + (result.total || 0) + ', נכשלו ' + (result.failed || 0), result.failed ? 'error' : 'success');
        }).catch(function(e) { toast('שגיאה: ' + e.message, 'error'); });
      };
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

  function getCustomerTypeGroup(value) {
    var type = String(value || 'פרטי').trim();
    if (type === 'עסקי') return 'business';
    if (type === 'ספק' || type === 'מפיק/ספק' || type === 'מפיק') return 'supplier';
    return 'private';
  }

  function renderCustomerCard(c) {
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
      (c.next_event_date ? '<div class="customer-card-meta" style="color:var(--blue);font-weight:800;margin-top:10px;font-size:13px">אירוע בתאריך: ' + formatDate(c.next_event_date) + '</div>' : '') +
    '</div>';
  }

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

    var grouped = {
      private: contacts.filter(function(c) { return getCustomerTypeGroup(c.customer_type) === 'private'; }),
      business: contacts.filter(function(c) { return getCustomerTypeGroup(c.customer_type) === 'business'; }),
      supplier: contacts.filter(function(c) { return getCustomerTypeGroup(c.customer_type) === 'supplier'; })
    };

    function renderSection(title, items, emptyText) {
      return '<div class="customer-type-section">' +
        '<div class="customer-type-header">' + title + '</div>' +
        (items.length ? items.map(renderCustomerCard).join('') : '<div class="customer-type-empty">' + emptyText + '</div>') +
      '</div>';
    }

    grid.innerHTML = '<div class="customers-type-layout">' +
      renderSection('לקוחות פרטיים', grouped.private, 'אין לקוחות פרטיים להצגה') +
      renderSection('לקוחות עסקיים', grouped.business, 'אין לקוחות עסקיים להצגה') +
      renderSection('ספקים / מפיקים', grouped.supplier, 'אין ספקים או מפיקים להצגה') +
    '</div>';

    grid.querySelectorAll('.customer-card[data-cid]').forEach(function(card) {
      card.addEventListener('click', function() {
        openCustomerCard(parseInt(this.getAttribute('data-cid')));
      });
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}


function employeeStatusBadge(isActive) {
  return '<span class="badge ' + (Number(isActive) === 0 ? 'employee-status-inactive' : 'employee-status-active') + '">' + (Number(isActive) === 0 ? 'לא פעיל' : 'פעיל') + '</span>';
}

function getEmployeeWaPhone(phone) {
  var cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
  return cleanPhone.charAt(0) === '0' ? '972' + cleanPhone.substring(1) : cleanPhone;
}

function productStatusBadge(isActive) {
  return '<span class="status-badge ' + (Number(isActive) === 0 ? 'product-status-inactive">לא פעיל' : 'product-status-active">פעיל') + '</span>';
}

function formatProductMoney(value) {
  return value !== null && value !== undefined && value !== '' ? '₪' + fmtMoney(value) : '—';
}

function formatProductPurchaseMoney(value) {
  if (value === null || value === undefined || value === '') return '—';
  var num = Number(value);
  if (!Number.isFinite(num)) return '—';
  return '₪' + num.toFixed(2);
}

function escapeProductPurchaseFormValue(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderProductPurchasesUI(productId) {
  var summaryEl = document.getElementById('product-purchases-summary');
  var formEl = document.getElementById('product-purchase-inline-form');
  var listEl = document.getElementById('product-purchases-list');
  var addBtn = document.getElementById('btn-add-product-purchase');
  if (!summaryEl || !formEl || !listEl) return;

  summaryEl.innerHTML = renderProductPurchaseSummary(calculateProductPurchaseSummary(currentProductPurchases));
  formEl.innerHTML = renderProductPurchaseInlineForm();
  listEl.innerHTML = renderProductPurchasesSection(productId, currentProductPurchases);

  if (addBtn) {
    addBtn.disabled = currentProductPurchaseSaving || currentProductReceiveStockPurchaseId !== null;
    addBtn.onclick = function() {
      startProductPurchaseCreate(productId);
    };
  }

  var cancelBtn = document.getElementById('btn-cancel-product-purchase');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      cancelProductPurchaseInlineForm(productId);
    };
  }

  var saveBtn = document.getElementById('btn-save-product-purchase');
  if (saveBtn) {
    saveBtn.disabled = currentProductPurchaseSaving;
    saveBtn.onclick = function() {
      saveProductPurchaseInline(productId);
    };
  }

  var quantityEl = document.getElementById('product-purchase-quantity');
  var unitPriceEl = document.getElementById('product-purchase-unit-price');
  if (quantityEl) quantityEl.oninput = calculateInlineProductPurchaseTotal;
  if (unitPriceEl) unitPriceEl.oninput = calculateInlineProductPurchaseTotal;
  if (quantityEl || unitPriceEl) calculateInlineProductPurchaseTotal();

  listEl.querySelectorAll('.product-purchase-edit-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      startProductPurchaseEdit(productId, parseInt(this.getAttribute('data-id')));
    });
  });

  listEl.querySelectorAll('.product-purchase-receive-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      receiveProductPurchaseStock(productId, parseInt(this.getAttribute('data-id')));
    });
  });
}

function loadProductPurchases(productId) {
  var summaryEl = document.getElementById('product-purchases-summary');
  var formEl = document.getElementById('product-purchase-inline-form');
  var listEl = document.getElementById('product-purchases-list');
  if (!summaryEl || !formEl || !listEl) return;

  summaryEl.innerHTML = '<div class="dash-empty">טוען...</div>';
  formEl.innerHTML = '';
  listEl.innerHTML = '';

  apiCall('GET', '/api/products/' + productId + '/purchases').then(function(data) {
    currentProductPurchases = (data && data.purchases) || [];
    renderProductPurchasesUI(productId);
  }).catch(function(e) {
    currentProductPurchases = [];
    currentProductPurchaseFormMode = null;
    currentProductPurchaseEditId = null;
    currentProductPurchaseSaving = false;
    currentProductReceiveStockPurchaseId = null;
    summaryEl.innerHTML = '<div class="dash-empty">שגיאה בטעינת סיכום רכישות</div>';
    formEl.innerHTML = '';
    listEl.innerHTML = '<div class="product-purchases-empty">לא ניתן לטעון את היסטוריית הרכישות</div>';
    toast(e.message, 'error');
  });
}

function getCurrentProductPurchaseFormData() {
  if (currentProductPurchaseFormMode === 'edit' && currentProductPurchaseEditId !== null) {
    var purchase = currentProductPurchases.find(function(item) { return Number(item.id) === Number(currentProductPurchaseEditId); });
    if (purchase) {
      return {
        purchase_date: purchase.purchase_date || getTodayYMD(),
        purchase_type: purchase.purchase_type || 'manual',
        quantity: purchase.quantity !== null && purchase.quantity !== undefined ? String(purchase.quantity) : '',
        unit_price: purchase.unit_price !== null && purchase.unit_price !== undefined ? String(purchase.unit_price) : '',
        total_price: purchase.total_price !== null && purchase.total_price !== undefined ? String(purchase.total_price) : '',
        supplier_name: purchase.supplier_name || '',
        notes: purchase.notes || ''
      };
    }
  }

  return {
    purchase_date: getTodayYMD(),
    purchase_type: 'manual',
    quantity: '',
    unit_price: '',
    total_price: '',
    supplier_name: '',
    notes: ''
  };
}

function renderProductPurchaseInlineForm() {
  if (!currentProductPurchaseFormMode) return '';

  var formData = getCurrentProductPurchaseFormData();
  return '<div class="product-purchase-inline-form">' +
    '<div class="product-purchase-inline-title">' + (currentProductPurchaseFormMode === 'edit' ? 'עריכת רכישה' : 'הוספת רכישה') + '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label class="form-label">תאריך רכישה *</label><input class="form-input" id="product-purchase-date" type="date" value="' + escapeProductPurchaseFormValue(formData.purchase_date) + '"></div>' +
      '<div class="form-group"><label class="form-label">סוג רכישה</label><select class="form-select" id="product-purchase-type"><option value="manual"' + (formData.purchase_type === 'manual' ? ' selected' : '') + '>ידני</option><option value="shopping"' + (formData.purchase_type === 'shopping' ? ' selected' : '') + '>Shopping</option><option value="import"' + (formData.purchase_type === 'import' ? ' selected' : '') + '>ייבוא</option></select></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label class="form-label">כמות *</label><input class="form-input" id="product-purchase-quantity" type="number" step="0.01" min="0" placeholder="0" value="' + escapeProductPurchaseFormValue(formData.quantity) + '"></div>' +
      '<div class="form-group"><label class="form-label">מחיר יחידה *</label><input class="form-input" id="product-purchase-unit-price" type="number" step="0.01" min="0" placeholder="0.00" value="' + escapeProductPurchaseFormValue(formData.unit_price) + '"></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label class="form-label">סה"כ</label><input class="form-input" id="product-purchase-total-price" type="number" step="0.01" readonly value="' + escapeProductPurchaseFormValue(formData.total_price) + '"></div>' +
      '<div class="form-group"><label class="form-label">ספק</label><input class="form-input" id="product-purchase-supplier-name" placeholder="שם הספק" value="' + escapeProductPurchaseFormValue(formData.supplier_name) + '"></div>' +
    '</div>' +
    '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-textarea" id="product-purchase-notes" placeholder="הערות על הרכישה">' + escapeProductPurchaseFormValue(formData.notes) + '</textarea></div>' +
    '<div class="product-purchase-inline-actions">' +
      '<button class="btn btn-secondary" type="button" id="btn-cancel-product-purchase">ביטול</button>' +
      '<button class="btn btn-primary" type="button" id="btn-save-product-purchase">' + (currentProductPurchaseFormMode === 'edit' ? 'שמור שינויים' : 'שמור רכישה') + '</button>' +
    '</div>' +
  '</div>';
}

function startProductPurchaseCreate(productId) {
  currentProductPurchaseFormMode = 'create';
  currentProductPurchaseEditId = null;
  renderProductPurchasesUI(productId);
}

function startProductPurchaseEdit(productId, purchaseId) {
  var purchase = currentProductPurchases.find(function(item) { return Number(item.id) === Number(purchaseId); });
  if (!purchase) {
    toast('הרכישה לא נמצאה', 'error');
    return;
  }

  currentProductPurchaseFormMode = 'edit';
  currentProductPurchaseEditId = Number(purchaseId);
  renderProductPurchasesUI(productId);
}

function cancelProductPurchaseInlineForm(productId) {
  currentProductPurchaseFormMode = null;
  currentProductPurchaseEditId = null;
  currentProductPurchaseSaving = false;
  renderProductPurchasesUI(productId);
}

function calculateInlineProductPurchaseTotal() {
  var quantityEl = document.getElementById('product-purchase-quantity');
  var unitPriceEl = document.getElementById('product-purchase-unit-price');
  var totalEl = document.getElementById('product-purchase-total-price');
  if (!quantityEl || !unitPriceEl || !totalEl) return;

  var quantity = Number(quantityEl.value);
  var unitPrice = Number(unitPriceEl.value);
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice <= 0) {
    totalEl.value = '';
    return;
  }

  totalEl.value = (Math.round(quantity * unitPrice * 100) / 100).toFixed(2);
}

function collectProductPurchaseInlineForm() {
  var quantity = Number(document.getElementById('product-purchase-quantity').value);
  var unitPrice = Number(document.getElementById('product-purchase-unit-price').value);
  var totalPrice = Math.round(quantity * unitPrice * 100) / 100;

  return {
    purchase_date: document.getElementById('product-purchase-date').value,
    purchase_type: document.getElementById('product-purchase-type').value,
    quantity: quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
    supplier_name: document.getElementById('product-purchase-supplier-name').value.trim(),
    notes: document.getElementById('product-purchase-notes').value.trim()
  };
}

function saveProductPurchaseInline(productId) {
  if (currentProductPurchaseSaving) return;

  var body = collectProductPurchaseInlineForm();
  var isEdit = currentProductPurchaseFormMode === 'edit';
  if (!body.purchase_date) { toast('תאריך רכישה חובה', 'error'); return; }
  if (!['manual', 'shopping', 'import'].includes(body.purchase_type)) { toast('סוג רכישה לא תקין', 'error'); return; }
  if (!Number.isFinite(body.quantity) || body.quantity <= 0) { toast('כמות חייבת להיות גדולה מ-0', 'error'); return; }
  if (!Number.isFinite(body.unit_price) || body.unit_price <= 0) { toast('מחיר יחידה חייב להיות גדול מ-0', 'error'); return; }
  if (!Number.isFinite(body.total_price) || body.total_price <= 0) { toast('סה"כ חייב להיות גדול מ-0', 'error'); return; }

  currentProductPurchaseSaving = true;
  var addBtn = document.getElementById('btn-add-product-purchase');
  var cancelBtn = document.getElementById('btn-cancel-product-purchase');
  var saveBtn = document.getElementById('btn-save-product-purchase');
  if (addBtn) addBtn.disabled = true;
  if (cancelBtn) cancelBtn.disabled = true;
  if (saveBtn) saveBtn.disabled = true;

  apiCall(isEdit ? 'PUT' : 'POST', isEdit ? '/api/product-purchases/' + currentProductPurchaseEditId : '/api/products/' + productId + '/purchases', body).then(function() {
    currentProductPurchaseSaving = false;
    currentProductPurchaseFormMode = null;
    currentProductPurchaseEditId = null;
    toast(isEdit ? 'הרכישה עודכנה' : 'הרכישה נוספה', 'success');
    loadProductPurchases(productId);
  }).catch(function(e) {
    currentProductPurchaseSaving = false;
    if (addBtn) addBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = false;
    if (saveBtn) saveBtn.disabled = false;
    toast(e.message, 'error');
  });
}

function calculateProductPurchaseSummary(purchases) {
  var unitPrices = purchases.map(function(p) { return Number(p.unit_price || 0); }).filter(function(price) { return Number.isFinite(price); });
  var count = purchases.length;
  var latestPurchase = count ? purchases[0] : null;
  var lastPrice = latestPurchase ? Number(latestPurchase.unit_price || 0) : null;
  var avgPrice = unitPrices.length ? unitPrices.reduce(function(sum, price) { return sum + price; }, 0) / unitPrices.length : null;
  var minPrice = unitPrices.length ? Math.min.apply(null, unitPrices) : null;
  var maxPrice = unitPrices.length ? Math.max.apply(null, unitPrices) : null;
  var changeFromPrevious = count >= 2 ? Number(purchases[0].unit_price || 0) - Number(purchases[1].unit_price || 0) : null;
  var latestAboveAverage = lastPrice !== null && avgPrice !== null && lastPrice > avgPrice + 0.01;
  var priceTrendText = 'אין מספיק נתונים למגמה';

  if (changeFromPrevious !== null) {
    if (changeFromPrevious > 0.01) {
      priceTrendText = 'מגמת עלייה במחיר';
    } else if (changeFromPrevious < -0.01) {
      priceTrendText = 'מגמת ירידה במחיר';
    } else {
      priceTrendText = 'המחיר יציב לעומת הרכישה הקודמת';
    }
  }

  return {
    count: count,
    latestPurchase: latestPurchase,
    lastPrice: lastPrice,
    avgPrice: avgPrice,
    minPrice: minPrice,
    maxPrice: maxPrice,
    changeFromPrevious: changeFromPrevious,
    latestAboveAverage: latestAboveAverage,
    priceTrendText: priceTrendText,
    bestPrice: minPrice,
    lastPurchaseDate: latestPurchase ? (latestPurchase.purchase_date || '—') : '—',
    lastSupplier: latestPurchase && latestPurchase.supplier_name ? latestPurchase.supplier_name : 'לא צוין'
  };
}

function getProductPurchaseTrendWording(diff) {
  if (diff === null || diff === undefined) {
    return { text: 'ללא רכישה קודמת להשוואה', className: 'product-purchase-change-neutral' };
  }

  if (diff > 0.01) {
    return { text: 'עלייה של ' + formatProductPurchaseMoney(diff) + ' לעומת הרכישה הקודמת', className: 'product-purchase-change-up' };
  }

  if (diff < -0.01) {
    return { text: 'ירידה של ' + formatProductPurchaseMoney(Math.abs(diff)) + ' לעומת הרכישה הקודמת', className: 'product-purchase-change-down' };
  }

  return { text: 'ללא שינוי לעומת הרכישה הקודמת', className: 'product-purchase-change-neutral' };
}

function getProductPurchaseChangeText(purchases, index) {
  if (!purchases[index + 1]) {
    return { text: 'ללא רכישה קודמת', className: 'product-purchase-change-neutral' };
  }

  var currentPrice = Number(purchases[index].unit_price || 0);
  var previousPrice = Number(purchases[index + 1].unit_price || 0);
  var diff = Math.round((currentPrice - previousPrice) * 100) / 100;

  if (diff > 0.01) {
    return { text: 'יקר יותר ב-' + formatProductPurchaseMoney(diff), className: 'product-purchase-change-up' };
  }

  if (diff < -0.01) {
    return { text: 'זול יותר ב-' + formatProductPurchaseMoney(Math.abs(diff)), className: 'product-purchase-change-down' };
  }

  return { text: 'ללא שינוי במחיר', className: 'product-purchase-change-neutral' };
}

function renderProductPurchaseSummary(summary) {
  if (!summary.count) {
    return '';
  }

  var trend = getProductPurchaseTrendWording(summary.changeFromPrevious);

  return '<div class="product-purchase-summary-grid">' +
    '<div class="product-purchase-summary-card' + (summary.latestAboveAverage ? ' product-purchase-summary-card-alert' : '') + '"><div class="product-purchase-summary-label">מחיר אחרון</div><div class="product-purchase-summary-value">' + formatProductPurchaseMoney(summary.lastPrice) + '</div>' + (summary.latestAboveAverage ? '<div class="product-purchase-summary-subtext">המחיר האחרון גבוה מהממוצע</div>' : '<div class="product-purchase-summary-subtext">רכישה אחרונה ב-' + summary.lastPurchaseDate + '</div>') + '</div>' +
    '<div class="product-purchase-summary-card"><div class="product-purchase-summary-label">ספק אחרון</div><div class="product-purchase-summary-value">' + summary.lastSupplier + '</div><div class="product-purchase-summary-subtext">תאריך רכישה אחרון: ' + summary.lastPurchaseDate + '</div></div>' +
    '<div class="product-purchase-summary-card"><div class="product-purchase-summary-label">המחיר הטוב ביותר</div><div class="product-purchase-summary-value">' + formatProductPurchaseMoney(summary.bestPrice) + '</div><div class="product-purchase-summary-subtext">המחיר הנמוך ביותר שנרשם</div></div>' +
    '<div class="product-purchase-summary-card"><div class="product-purchase-summary-label">מחיר ממוצע</div><div class="product-purchase-summary-value">' + formatProductPurchaseMoney(summary.avgPrice) + '</div><div class="product-purchase-summary-subtext">מחושב מכל הרכישות</div></div>' +
    '<div class="product-purchase-summary-card"><div class="product-purchase-summary-label">מגמת מחיר</div><div class="product-purchase-summary-value"><span class="product-purchase-change ' + trend.className + '">' + summary.priceTrendText + '</span></div><div class="product-purchase-summary-subtext">' + trend.text + '</div></div>' +
    '</div>';
}

function renderProductPurchasesSection(productId, purchases) {
  if (!purchases.length) {
    return '<div class="product-purchases-empty">אין היסטוריית רכישות עדיין</div>';
  }

  return '<div class="product-purchases-list">' + purchases.map(function(purchase, index) {
    var change = getProductPurchaseChangeText(purchases, index);
    var purchaseTypeMap = { manual: 'ידני', shopping: 'Shopping', import: 'ייבוא' };
    var isReceived = Number(purchase.stock_received) === 1;
    var isReceiving = Number(currentProductReceiveStockPurchaseId) === Number(purchase.id);
    return '<div class="product-purchase-row">' +
      '<div class="product-purchase-row-main">' +
        '<div class="product-purchase-row-top">' +
          '<span class="product-purchase-date">' + (purchase.purchase_date || '—') + '</span>' +
          '<span class="product-purchase-type">' + (purchaseTypeMap[purchase.purchase_type] || purchase.purchase_type || '—') + '</span>' +
          (purchase.supplier_name ? '<span class="product-purchase-supplier">' + purchase.supplier_name + '</span>' : '') +
          '<span class="product-purchase-change ' + change.className + '">' + change.text + '</span>' +
          (isReceived ? '<span class="badge badge-green">כבר נקלט למלאי</span>' : '') +
        '</div>' +
        '<div class="product-purchase-row-stats">' +
          '<span>כמות: ' + (purchase.quantity !== null && purchase.quantity !== undefined && purchase.quantity !== '' ? purchase.quantity : '—') + '</span>' +
          '<span>מחיר יחידה: ' + formatProductPurchaseMoney(purchase.unit_price) + '</span>' +
          '<span>סה"כ: ' + formatProductPurchaseMoney(purchase.total_price) + '</span>' +
        '</div>' +
        (purchase.notes ? '<div class="product-purchase-row-notes">' + purchase.notes + '</div>' : '') +
      '</div>' +
      '<div class="product-purchase-row-actions">' +
        (!isReceived ? '<button class="btn btn-primary btn-sm product-purchase-receive-btn" type="button" data-id="' + purchase.id + '"' + (isReceiving ? ' disabled' : '') + '>' + (isReceiving ? 'קולט...' : 'הכנס למלאי') + '</button>' : '') +
        '<button class="btn btn-secondary btn-sm product-purchase-edit-btn" type="button" data-id="' + purchase.id + '"' + (isReceiving ? ' disabled' : '') + '>עריכה</button>' +
      '</div>' +
    '</div>';
  }).join('') + '</div>';
}

function receiveProductPurchaseStock(productId, purchaseId) {
  if (currentProductReceiveStockPurchaseId !== null) return;
  currentProductReceiveStockPurchaseId = Number(purchaseId);
  renderProductPurchasesUI(productId);

  apiCall('POST', '/api/product-purchases/' + purchaseId + '/receive-stock').then(function(data) {
    currentProductReceiveStockPurchaseId = null;
    return Promise.all([
      loadProductInventory(productId),
      new Promise(function(resolve) {
        apiCall('GET', '/api/products/' + productId + '/purchases').then(function(resp) {
          currentProductPurchases = (resp && resp.purchases) || [];
          renderProductPurchasesUI(productId);
          resolve();
        }).catch(function(err) {
          resolve(err);
        });
      })
    ]).then(function() {
      loadProducts();
      toast(data && data.already_received ? 'הרכישה כבר נקלטה למלאי' : 'המלאי נקלט מהרכישה', 'success');
    });
  }).catch(function(e) {
    currentProductReceiveStockPurchaseId = null;
    renderProductPurchasesUI(productId);
    toast(e.message, 'error');
  });
}

var currentProductsView = 'list';

function formatProductStockValue(value) {
  var num = Number(value);
  if (!Number.isFinite(num)) return '—';
  if (Math.abs(num - Math.round(num)) < 0.001) return String(Math.round(num));
  return num.toFixed(2);
}

function getProductInventoryStatusBadge(stockInfo) {
  if (!stockInfo) return '<span class="badge badge-gray">מלאי לא זמין</span>';
  return stockInfo.is_low_stock ? '<span class="badge badge-orange">מלאי נמוך</span>' : '<span class="badge badge-green">מלאי תקין</span>';
}

function renderProductLowStockSummary(products) {
  if (!products || !products.length) {
    return '<div class="product-low-stock-banner">' +
      '<div>' +
        '<div class="product-low-stock-title">מוצרים במלאי נמוך</div>' +
        '<div class="product-low-stock-text">כרגע אין מוצרים פעילים שנמצאים מתחת לסף ההתראה.</div>' +
      '</div>' +
    '</div>';
  }

  return '<div class="product-low-stock-banner">' +
    '<div style="flex:1;min-width:220px">' +
      '<div class="product-low-stock-title">מוצרים במלאי נמוך</div>' +
      '<div class="product-low-stock-text">' + products.length + ' מוצרים פעילים דורשים תשומת לב. הרשימה מוצגת מקריאת ה-API של low-stock בלבד.</div>' +
      '<div class="product-low-stock-list">' + products.slice(0, 8).map(function(entry) {
        var product = entry.product || {};
        return '<span class="product-low-stock-chip">' +
          '<span>' + (product.name || ('מוצר #' + product.id)) + '</span>' +
          '<span class="product-low-stock-chip-muted">' + formatProductStockValue(entry.current_stock) + ' / מינימום ' + formatProductStockValue(entry.min_stock_alert) + '</span>' +
        '</span>';
      }).join('') + (products.length > 8 ? '<span class="product-low-stock-chip product-low-stock-chip-muted">ועוד ' + (products.length - 8) + '</span>' : '') + '</div>' +
    '</div>' +
    '<button class="btn btn-secondary btn-sm" type="button" id="btn-refresh-low-stock">רענן מלאי</button>' +
  '</div>';
}

function renderProductAdjustmentForm() {
  if (!currentProductAdjustmentMode) return '';
  var isDecrease = currentProductAdjustmentMode === 'decrease';
  return '<div class="product-adjustment-form" id="product-adjustment-form">' +
    '<div class="product-adjustment-title">' + (isDecrease ? 'הפחתת מלאי' : 'הוספת מלאי') + '</div>' +
    '<div class="product-adjustment-helper">' + (isDecrease ? 'הזן כמות חיובית שתופחת מהמלאי. המערכת תשמור תנועה שלילית ב-ledger.' : 'הזן כמות חיובית שתתווסף למלאי. המערכת תשמור תנועה חיובית ב-ledger.') + '</div>' +
    '<div class="form-row">' +
      '<div class="form-group"><label class="form-label">כמות *</label><input class="form-input" id="product-adjustment-quantity" type="number" step="0.01" min="0.01" placeholder="0"></div>' +
      '<div class="form-group"><label class="form-label">סיבה *</label><input class="form-input" id="product-adjustment-reason" placeholder="למשל: ספירת מלאי / תיקון"></div>' +
    '</div>' +
    '<div class="form-group"><label class="form-label">הערה</label><textarea class="form-textarea" id="product-adjustment-note" placeholder="הערה פנימית אופציונלית"></textarea></div>' +
    '<div class="product-adjustment-actions">' +
      '<button class="btn btn-secondary" type="button" id="btn-cancel-product-adjustment">ביטול</button>' +
      '<button class="btn btn-primary" type="button" id="btn-save-product-adjustment">' + (currentProductAdjustmentSaving ? 'שומר...' : (isDecrease ? 'שמור הפחתה' : 'שמור הוספה')) + '</button>' +
    '</div>' +
  '</div>';
}

function bindProductAdjustmentForm(productId) {
  var cancelBtn = document.getElementById('btn-cancel-product-adjustment');
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      currentProductAdjustmentMode = null;
      currentProductAdjustmentSaving = false;
      renderProductInventoryUI(productId);
    };
  }

  var saveBtn = document.getElementById('btn-save-product-adjustment');
  if (saveBtn) {
    saveBtn.disabled = currentProductAdjustmentSaving;
    saveBtn.onclick = function() {
      saveProductStockAdjustment(productId);
    };
  }
}

function renderProductInventorySection(stockInfo, movements) {
  if (!stockInfo) {
    return '<div class="product-inventory-section" id="product-inventory-section">' +
      '<div class="product-purchases-header"><div class="product-purchases-title">תמונת מלאי</div></div>' +
      '<div class="dash-empty">לא הצלחנו לטעון כרגע את נתוני המלאי למוצר הזה.</div>' +
    '</div>';
  }

  var recentMovements = (movements || []).slice(0, 5);
  return '<div class="product-inventory-section" id="product-inventory-section">' +
    '<div class="product-purchases-header">' +
      '<div class="product-purchases-title">תמונת מלאי</div>' +
      '<div class="product-inventory-actions">' +
        '<button class="btn btn-secondary btn-sm" type="button" id="btn-product-stock-increase">הוסף מלאי</button>' +
        '<button class="btn btn-secondary btn-sm" type="button" id="btn-product-stock-decrease">הפחת מלאי</button>' +
      '</div>' +
    '</div>' +
    '<div class="product-inventory-grid">' +
      '<div class="product-inventory-card"><div class="product-inventory-label">מלאי נוכחי</div><div class="product-inventory-value">' + formatProductStockValue(stockInfo.current_stock) + '</div></div>' +
      '<div class="product-inventory-card"><div class="product-inventory-label">מינימום התראה</div><div class="product-inventory-value">' + (stockInfo.min_stock_alert !== null && stockInfo.min_stock_alert !== undefined && stockInfo.min_stock_alert !== '' ? formatProductStockValue(stockInfo.min_stock_alert) : 'לא הוגדר') + '</div></div>' +
      '<div class="product-inventory-card"><div class="product-inventory-label">סטטוס</div><div class="product-inventory-value">' + (stockInfo.is_low_stock ? 'מלאי נמוך' : 'מלאי תקין') + '</div></div>' +
    '</div>' +
    renderProductAdjustmentForm() +
    '<div>' +
      '<div class="product-purchase-summary-subtext" style="margin-bottom:8px">תנועות המלאי מוצגות מהחדשה לישנה, על בסיס ledger בלבד.</div>' +
      (recentMovements.length ? '<div class="product-inventory-list">' + recentMovements.map(function(movement) {
        return '<div class="product-inventory-row">' +
          '<div class="product-inventory-row-main">' +
            '<div class="product-inventory-row-top">' +
              '<span class="product-inventory-date">' + formatDate(movement.created_at) + '</span>' +
              '<span class="badge ' + (Number(movement.quantity_change) < 0 ? 'badge-red' : 'badge-blue') + '">' + (movement.movement_type || 'movement') + '</span>' +
              (movement.reference_type ? '<span class="badge badge-gray">' + movement.reference_type + '</span>' : '') +
            '</div>' +
            '<div class="product-inventory-row-stats">' +
              '<span>שינוי: ' + (Number(movement.quantity_change) > 0 ? '+' : '') + formatProductStockValue(movement.quantity_change) + '</span>' +
              (movement.reason ? '<span>סיבה: ' + movement.reason + '</span>' : '') +
              (movement.reference_id ? '<span>מזהה מקור: ' + movement.reference_id + '</span>' : '') +
            '</div>' +
            (movement.note ? '<div class="product-inventory-note">' + movement.note + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('') + '</div>' : '<div class="dash-empty">אין עדיין תנועות מלאי למוצר הזה.</div>') +
    '</div>' +
  '</div>';
}

function renderProductInventoryUI(productId) {
  var inventoryRoot = document.getElementById('product-inventory-root');
  if (!inventoryRoot) return;
  inventoryRoot.innerHTML = renderProductInventorySection(currentProductStock, currentProductStockMovements);

  if (!currentProductStock) return;

  var increaseBtn = document.getElementById('btn-product-stock-increase');
  if (increaseBtn) {
    increaseBtn.disabled = currentProductAdjustmentSaving;
    increaseBtn.onclick = function() {
      currentProductAdjustmentMode = 'increase';
      currentProductAdjustmentSaving = false;
      renderProductInventoryUI(productId);
    };
  }

  var decreaseBtn = document.getElementById('btn-product-stock-decrease');
  if (decreaseBtn) {
    decreaseBtn.disabled = currentProductAdjustmentSaving;
    decreaseBtn.onclick = function() {
      currentProductAdjustmentMode = 'decrease';
      currentProductAdjustmentSaving = false;
      renderProductInventoryUI(productId);
    };
  }

  bindProductAdjustmentForm(productId);
}

function loadProductInventory(productId) {
  return Promise.all([
    apiCall('GET', '/api/products/' + productId + '/stock').catch(function() { return null; }),
    apiCall('GET', '/api/products/' + productId + '/stock-movements?limit=5&offset=0').catch(function() { return { movements: [] }; })
  ]).then(function(results) {
    currentProductStock = results[0];
    currentProductStockMovements = (results[1] && results[1].movements) || [];
    renderProductInventoryUI(productId);
    return currentProductStock;
  });
}

function saveProductStockAdjustment(productId) {
  if (currentProductAdjustmentSaving) return;
  var quantityInput = document.getElementById('product-adjustment-quantity');
  var reasonInput = document.getElementById('product-adjustment-reason');
  var noteInput = document.getElementById('product-adjustment-note');
  if (!quantityInput || !reasonInput) return;

  var rawQuantity = Number(quantityInput.value);
  if (!Number.isFinite(rawQuantity) || rawQuantity <= 0) {
    toast('כמות חובה וצריכה להיות גדולה מ-0', 'error');
    return;
  }

  var reason = reasonInput.value.trim();
  if (!reason) {
    toast('סיבת התאמה חובה', 'error');
    return;
  }

  var signedQuantity = currentProductAdjustmentMode === 'decrease' ? -rawQuantity : rawQuantity;
  currentProductAdjustmentSaving = true;
  renderProductInventoryUI(productId);

  apiCall('POST', '/api/products/' + productId + '/stock-adjustments', {
    quantity_change: signedQuantity,
    reason: reason,
    note: noteInput ? noteInput.value.trim() : ''
  }).then(function() {
    currentProductAdjustmentMode = null;
    currentProductAdjustmentSaving = false;
    return loadProductInventory(productId);
  }).then(function() {
    toast('התאמת המלאי נשמרה', 'success');
    loadProducts();
  }).catch(function(e) {
    currentProductAdjustmentSaving = false;
    renderProductInventoryUI(productId);
    toast(e.message, 'error');
  });
}

function getLowStockUrgencyBadge(entry) {
  var current = Number(entry && entry.current_stock || 0);
  var min = Number(entry && entry.min_stock_alert || 0);
  if (current <= 0) return '<span class="badge badge-urgent">דחוף</span>';
  if (current < min) return '<span class="badge badge-attention">לטיפול</span>';
  return '<span class="badge badge-stable">במעקב</span>';
}

function getMovementTypeLabel(type) {
  var map = {
    adjustment: 'התאמה',
    purchase_intake: 'קליטת מלאי',
    event_usage: 'שימוש באירוע',
    correction: 'תיקון'
  };
  return map[type] || type || 'תנועה';
}

function renderOperationalIntelligenceWidgets() {
  var lowStockHtml = currentLowStockProducts.length ? '<div class="product-ops-list">' + currentLowStockProducts.slice(0, 6).map(function(entry) {
    var product = entry.product || {};
    return '<div class="product-ops-item">' +
      '<div class="product-ops-item-main">' +
        '<div class="product-ops-item-title">' + (product.name || ('מוצר #' + product.id)) + '</div>' +
        '<div class="product-ops-item-meta"><span>מלאי: ' + formatProductStockValue(entry.current_stock) + '</span><span>מינימום: ' + formatProductStockValue(entry.min_stock_alert) + '</span></div>' +
      '</div>' +
      '<div class="product-ops-action">' + getLowStockUrgencyBadge(entry) + '</div>' +
    '</div>';
  }).join('') + '</div>' : '<div class="product-ops-empty">אין כרגע מוצרים פעילים במלאי נמוך.</div>';

  var unreceivedHtml = currentOperationalUnreceivedPurchases.length ? '<div class="product-ops-list">' + currentOperationalUnreceivedPurchases.slice(0, 6).map(function(entry) {
    var purchase = entry.purchase || {};
    var product = entry.product || {};
    var isReceiving = Number(currentProductReceiveStockPurchaseId) === Number(purchase.id);
    return '<div class="product-ops-item">' +
      '<div class="product-ops-item-main">' +
        '<div class="product-ops-item-title">' + (product.name || ('מוצר #' + product.id)) + '</div>' +
        '<div class="product-ops-item-meta"><span>ספק: ' + (purchase.supplier_name || '—') + '</span><span>כמות: ' + formatProductStockValue(purchase.quantity) + '</span><span>תאריך: ' + formatProductReportDate(purchase.purchase_date) + '</span></div>' +
      '</div>' +
      '<div class="product-ops-action"><button class="btn btn-primary btn-sm operational-receive-stock-btn" type="button" data-product-id="' + product.id + '" data-purchase-id="' + purchase.id + '"' + (isReceiving ? ' disabled' : '') + '>' + (isReceiving ? 'קולט...' : 'הכנס למלאי') + '</button></div>' +
    '</div>';
  }).join('') + '</div>' : '<div class="product-ops-empty">אין כרגע רכישות שממתינות לקליטת מלאי.</div>';

  var movementsHtml = currentOperationalRecentMovements.length ? '<div class="product-ops-list">' + currentOperationalRecentMovements.slice(0, 6).map(function(entry) {
    var movement = entry.movement || {};
    var product = entry.product || {};
    return '<div class="product-ops-item">' +
      '<div class="product-ops-item-main">' +
        '<div class="product-ops-item-title">' + (product.name || ('מוצר #' + product.id)) + '</div>' +
        '<div class="product-ops-item-meta"><span>' + getMovementTypeLabel(movement.movement_type) + '</span><span>שינוי: ' + (Number(movement.quantity_change) > 0 ? '+' : '') + formatProductStockValue(movement.quantity_change) + '</span><span>' + formatDate(movement.created_at) + '</span></div>' +
        '<div class="product-ops-item-meta"><span>' + (movement.reason || movement.reference_type || 'ללא סיבה') + '</span>' + (movement.reference_id ? '<span>מקור #' + movement.reference_id + '</span>' : '') + '</div>' +
      '</div>' +
    '</div>';
  }).join('') + '</div>' : '<div class="product-ops-empty">אין עדיין תנועות מלאי להצגה.</div>';

  return '<div class="product-ops-grid">' +
    '<div class="product-ops-card"><div class="product-ops-card-title">מוצרים במלאי נמוך</div><div class="product-ops-card-subtitle">פוקוס מהיר על מוצרים שדורשים תשומת לב עכשיו.</div>' + lowStockHtml + '</div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">רכישות שעדיין לא נקלטו למלאי</div><div class="product-ops-card-subtitle">רכישות קיימות שאפשר לקלוט ידנית למלאי בלי לפתוח אוטומציה.</div>' + unreceivedHtml + '</div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">תנועות מלאי אחרונות</div><div class="product-ops-card-subtitle">פיד תפעולי קצר של intake והתאמות אחרונות.</div>' + movementsHtml + '</div>' +
  '</div>';
}

function bindOperationalIntelligenceWidgets() {
  var root = document.getElementById('products-operational-widgets');
  if (!root) return;
  root.querySelectorAll('.operational-receive-stock-btn').forEach(function(btn) {
    btn.onclick = function() {
      receiveOperationalPurchaseStock(parseInt(this.getAttribute('data-product-id')), parseInt(this.getAttribute('data-purchase-id')));
    };
  });
}

function renderOperationalIntelligenceLoading() {
  return '<div class="product-ops-grid">' +
    '<div class="product-ops-card"><div class="product-ops-card-title">מוצרים במלאי נמוך</div><div class="product-ops-empty">טוען...</div></div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">רכישות שעדיין לא נקלטו למלאי</div><div class="product-ops-empty">טוען...</div></div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">תנועות מלאי אחרונות</div><div class="product-ops-empty">טוען...</div></div>' +
  '</div>';
}

function renderOperationalIntelligenceError() {
  return '<div class="product-ops-grid">' +
    '<div class="product-ops-card"><div class="product-ops-card-title">מוצרים במלאי נמוך</div><div class="product-ops-empty">לא הצלחנו לטעון כרגע את הווידג׳טים התפעוליים.</div></div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">רכישות שעדיין לא נקלטו למלאי</div><div class="product-ops-empty">נסה לרענן שוב בעוד רגע.</div></div>' +
    '<div class="product-ops-card"><div class="product-ops-card-title">תנועות מלאי אחרונות</div><div class="product-ops-empty">העמוד הראשי של המוצרים עדיין אמור להישאר זמין.</div></div>' +
  '</div>';
}

function renderOperationalIntelligenceWidgetsIntoPage() {
  var root = document.getElementById('products-operational-widgets');
  if (!root) return;
  root.innerHTML = renderOperationalIntelligenceWidgets();
  bindOperationalIntelligenceWidgets();
}

function receiveOperationalPurchaseStock(productId, purchaseId) {
  receiveProductPurchaseStock(productId, purchaseId);
  renderOperationalIntelligenceWidgetsIntoPage();
}

function renderProductsListView() {
  return '<div id="products-operational-widgets"></div>' +
    '<div id="products-low-stock-summary"></div>' +
    '<div class="table-card">' +
      '<div class="table-toolbar">' +
        '<input class="search-input" type="text" placeholder="חיפוש לפי שם / קטגוריה / SKU..." id="products-search">' +
      '</div>' +
      '<div id="products-grid" style="padding:16px">' +
        '<div class="dash-empty">טוען...</div>' +
      '</div>' +
    '</div>';
}

function formatProductReportDate(dateStr) {
  return dateStr ? formatDate(dateStr) : '—';
}

function getProductReportLast30Start() {
  var today = getTodayYMD();
  var base = new Date(today + 'T00:00:00');
  base.setDate(base.getDate() - 29);
  return base.toISOString().slice(0, 10);
}

function getProductReportSourceLabel(purchase, shoppingListsMap) {
  if (purchase.supplier_name) return purchase.supplier_name;
  if (purchase.shopping_list_id && shoppingListsMap[purchase.shopping_list_id]) return shoppingListsMap[purchase.shopping_list_id];
  if (purchase.purchase_type === 'shopping') return 'קניית Shopping';
  return '—';
}

function formatProductReportPercent(value) {
  return Number(value || 0).toFixed(1) + '%';
}

function getProductReportTrendBadge(kind, text) {
  var styles = {
    up: 'background:#fee2e2;color:#b91c1c',
    down: 'background:#dcfce7;color:#166534',
    shopping: 'background:#dbeafe;color:#1d4ed8',
    inactive: 'background:#f3f4f6;color:#4b5563'
  };
  return '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:700;' + (styles[kind] || styles.shopping) + '">' + text + '</span>';
}

function renderProductReportsTable(title, emptyText, rowsHtml, columnsHtml, subtitle) {
  return '<div class="table-card" style="margin-bottom:16px">' +
    '<div class="table-toolbar" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
      '<div><strong>' + title + '</strong>' + (subtitle ? '<div style="font-size:12px;color:var(--text3);margin-top:4px">' + subtitle + '</div>' : '') + '</div>' +
    '</div>' +
    (rowsHtml ? '<div style="padding:16px;overflow:auto"><table><thead><tr>' + columnsHtml + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div>' : '<div class="dash-empty" style="padding:16px">' + emptyText + '</div>') +
  '</div>';
}

function getOperationalAlertSeverityBadge(kind) {
  var map = {
    urgent: '<span class="badge badge-urgent">דחוף</span>',
    attention: '<span class="badge badge-attention">לטיפול</span>',
    info: '<span class="badge badge-stable">במעקב</span>'
  };
  return map[kind] || map.info;
}

function renderOperationalAlertsCard(title, count, subtitle, itemsHtml, emptyText, severity) {
  return '<div class="product-ops-card">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap">' +
      '<div><div class="product-ops-card-title">' + title + '</div><div class="product-ops-card-subtitle">' + subtitle + '</div></div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="badge badge-purple">' + count + '</span>' + getOperationalAlertSeverityBadge(severity) + '</div>' +
    '</div>' +
    (itemsHtml ? '<div class="product-ops-list" style="margin-top:12px">' + itemsHtml + '</div>' : '<div class="product-ops-empty" style="margin-top:12px">' + emptyText + '</div>') +
  '</div>';
}

function loadProductPurchaseReports() {
  currentProductsView = 'reports';
  var content = document.getElementById('products-page-content');
  if (!content) return;

  content.innerHTML = '<div class="table-card"><div class="dash-empty" style="padding:24px">טוען דוחות רכישות...</div></div>';

  Promise.all([
    apiCall('GET', '/api/products?includeInactive=1'),
    apiCall('GET', '/api/shopping-lists'),
    apiCall('GET', '/api/inventory/low-stock').catch(function() { return { products: [] }; })
  ]).then(function(results) {
    var products = results[0].products || [];
    var shoppingLists = results[1].lists || [];
    var lowStockProducts = (results[2] && results[2].products) || [];
    var shoppingListsMap = {};
    shoppingLists.forEach(function(list) { shoppingListsMap[list.id] = list.name || ('חנות #' + list.id); });

    return Promise.all(products.map(function(product) {
      return Promise.all([
        apiCall('GET', '/api/products/' + product.id + '/purchases?limit=200&offset=0').catch(function() { return { purchases: [] }; }),
        apiCall('GET', '/api/products/' + product.id + '/stock-movements?limit=10&offset=0').catch(function() { return { movements: [] }; })
      ]).then(function(productResults) {
        return {
          product: product,
          purchases: (productResults[0] && productResults[0].purchases) || [],
          movements: (productResults[1] && productResults[1].movements) || []
        };
      });
    })).then(function(productEntries) {
      var allPurchases = [];
      var currentMonth = getTodayYMD().slice(0, 7);
      var last30Start = getProductReportLast30Start();
      var totalThisMonth = 0;
      var totalLast30 = 0;
      var topProductsMap = {};
      var sourceMap = {};
      var priceIncreases = [];
      var recentShoppingLinked = [];
      var supplierVariationProducts = [];
      var supplierPriceIncreases = [];
      var unreceivedPurchases = [];
      var unusualMovements = [];
      var productUnreceivedMap = {};
      var productPriceIncreaseMap = {};

      productEntries.forEach(function(entry) {
        entry.purchases.forEach(function(purchase) {
          var normalized = {
            product: entry.product,
            purchase: purchase,
            date: String(purchase.purchase_date || '').slice(0, 10),
            total: Number(purchase.total_price || 0),
            unitPrice: Number(purchase.unit_price || 0),
            sourceLabel: getProductReportSourceLabel(purchase, shoppingListsMap),
            isShopping: purchase.purchase_type === 'shopping' || !!purchase.shopping_purchase_id || !!purchase.shopping_list_id || !!purchase.shopping_purchase_item_id,
            isInactive: Number(entry.product.is_active) === 0
          };
          allPurchases.push(normalized);

          if (normalized.date.slice(0, 7) === currentMonth) totalThisMonth += normalized.total;
          if (normalized.date && normalized.date >= last30Start) totalLast30 += normalized.total;

          if (!topProductsMap[entry.product.id]) {
            topProductsMap[entry.product.id] = { product: entry.product, spend: 0, count: 0, shoppingCount: 0, lastPurchaseDate: '' };
          }
          topProductsMap[entry.product.id].spend += normalized.total;
          topProductsMap[entry.product.id].count += 1;
          if (normalized.isShopping) topProductsMap[entry.product.id].shoppingCount += 1;
          if (normalized.date && normalized.date > topProductsMap[entry.product.id].lastPurchaseDate) {
            topProductsMap[entry.product.id].lastPurchaseDate = normalized.date;
          }

          if (normalized.sourceLabel && normalized.sourceLabel !== '—') {
            if (!sourceMap[normalized.sourceLabel]) sourceMap[normalized.sourceLabel] = { name: normalized.sourceLabel, count: 0, total: 0, shoppingCount: 0 };
            sourceMap[normalized.sourceLabel].count += 1;
            sourceMap[normalized.sourceLabel].total += normalized.total;
            if (normalized.isShopping) sourceMap[normalized.sourceLabel].shoppingCount += 1;
          }

          if (normalized.isShopping) recentShoppingLinked.push(normalized);
          if (Number(purchase.stock_received) !== 1) {
            unreceivedPurchases.push({
              product: entry.product,
              purchase: purchase
            });
            productUnreceivedMap[entry.product.id] = true;
          }
        });

        (entry.movements || []).forEach(function(movement) {
          var quantityChange = Math.abs(Number(movement.quantity_change || 0));
          var isManual = movement.movement_type === 'adjustment' || movement.movement_type === 'correction';
          var isLarge = quantityChange >= 10;
          if (!isManual && !isLarge) return;
          unusualMovements.push({
            product: entry.product,
            movement: movement,
            isManual: isManual,
            isLarge: isLarge
          });
        });
      });

      productEntries.forEach(function(entry) {
        var sorted = (entry.purchases || []).slice().sort(function(a, b) {
          return String(b.purchase_date || '').localeCompare(String(a.purchase_date || '')) || Number(b.id || 0) - Number(a.id || 0);
        });
        if (sorted.length >= 2) {
          var latest = sorted[0];
          var previous = sorted[1];
          var latestPrice = Number(latest.unit_price || 0);
          var previousPrice = Number(previous.unit_price || 0);
          if (latestPrice > previousPrice) {
            var increaseEntry = {
              product: entry.product,
              latest: latest,
              previous: previous,
              delta: latestPrice - previousPrice,
              percent: previousPrice > 0 ? ((latestPrice - previousPrice) / previousPrice) * 100 : null,
              isInactive: Number(entry.product.is_active) === 0
            };
            priceIncreases.push(increaseEntry);
            productPriceIncreaseMap[entry.product.id] = increaseEntry;
          }
        }

        var bySupplier = {};
        (entry.purchases || []).forEach(function(purchase) {
          var sourceLabel = getProductReportSourceLabel(purchase, shoppingListsMap);
          if (!sourceLabel || sourceLabel === '—') return;
          var unitPrice = Number(purchase.unit_price || 0);
          if (!Number.isFinite(unitPrice) || unitPrice <= 0) return;
          if (!bySupplier[sourceLabel]) bySupplier[sourceLabel] = [];
          bySupplier[sourceLabel].push(purchase);
        });

        var supplierNames = Object.keys(bySupplier);
        if (supplierNames.length >= 2) {
          var supplierStats = supplierNames.map(function(name) {
            var purchases = bySupplier[name];
            var prices = purchases.map(function(p) { return Number(p.unit_price || 0); }).filter(function(v) { return Number.isFinite(v) && v > 0; });
            var latestPurchase = purchases.slice().sort(function(a, b) {
              return String(b.purchase_date || '').localeCompare(String(a.purchase_date || '')) || Number(b.id || 0) - Number(a.id || 0);
            })[0];
            return {
              name: name,
              minPrice: Math.min.apply(null, prices),
              maxPrice: Math.max.apply(null, prices),
              latestPrice: Number(latestPurchase && latestPurchase.unit_price || 0),
              latestDate: String(latestPurchase && latestPurchase.purchase_date || ''),
              count: purchases.length
            };
          }).filter(function(stat) {
            return Number.isFinite(stat.minPrice) && Number.isFinite(stat.maxPrice) && Number.isFinite(stat.latestPrice) && stat.latestPrice > 0;
          });

          if (supplierStats.length >= 2) {
            var lowestSupplier = supplierStats.slice().sort(function(a, b) {
              return a.minPrice - b.minPrice || a.name.localeCompare(b.name);
            })[0];
            var highestSupplier = supplierStats.slice().sort(function(a, b) {
              return b.maxPrice - a.maxPrice || a.name.localeCompare(b.name);
            })[0];
            if (highestSupplier && lowestSupplier && highestSupplier.maxPrice > lowestSupplier.minPrice) {
              supplierVariationProducts.push({
                product: entry.product,
                lowestSupplier: lowestSupplier,
                highestSupplier: highestSupplier,
                delta: highestSupplier.maxPrice - lowestSupplier.minPrice,
                supplierCount: supplierStats.length,
                isInactive: Number(entry.product.is_active) === 0
              });
            }

            var latestBySupplier = supplierStats.slice().sort(function(a, b) {
              return b.latestPrice - a.latestPrice || b.latestDate.localeCompare(a.latestDate);
            });
            var cheapestCurrentSupplier = supplierStats.slice().sort(function(a, b) {
              return a.latestPrice - b.latestPrice || b.latestDate.localeCompare(a.latestDate);
            })[0];
            var expensiveCurrentSupplier = latestBySupplier[0];
            if (expensiveCurrentSupplier && cheapestCurrentSupplier && expensiveCurrentSupplier.name !== cheapestCurrentSupplier.name && expensiveCurrentSupplier.latestPrice > cheapestCurrentSupplier.latestPrice) {
              supplierPriceIncreases.push({
                product: entry.product,
                expensiveSupplier: expensiveCurrentSupplier,
                cheaperSupplier: cheapestCurrentSupplier,
                delta: expensiveCurrentSupplier.latestPrice - cheapestCurrentSupplier.latestPrice,
                percent: cheapestCurrentSupplier.latestPrice > 0 ? ((expensiveCurrentSupplier.latestPrice - cheapestCurrentSupplier.latestPrice) / cheapestCurrentSupplier.latestPrice) * 100 : null,
                isInactive: Number(entry.product.is_active) === 0
              });
            }
          }
        }
      });

      var syncedShoppingPurchaseItemIds = {};
      recentShoppingLinked.forEach(function(entry) {
        var key = Number(entry.purchase.shopping_purchase_item_id || 0);
        if (key > 0) syncedShoppingPurchaseItemIds[key] = true;
      });

      return Promise.all(shoppingLists.map(function(list) {
        return apiCall('GET', '/api/shopping-lists/' + list.id).catch(function() { return { purchases: [] }; });
      })).then(function(shoppingListEntries) {
        var shoppingPurchaseIds = {};
        shoppingListEntries.forEach(function(listEntry) {
          (listEntry.purchases || []).forEach(function(purchase) {
            if (purchase && purchase.id !== undefined && purchase.id !== null) shoppingPurchaseIds[purchase.id] = true;
          });
        });

        return Promise.all(Object.keys(shoppingPurchaseIds).map(function(id) {
          return apiCall('GET', '/api/shopping-purchases/' + id).catch(function() { return null; });
        })).then(function(shoppingPurchaseEntries) {
          var unsyncedShoppingItems = [];
          shoppingPurchaseEntries.forEach(function(entry) {
            if (!entry || !entry.purchase) return;
            var purchase = entry.purchase || {};
            var items = entry.items || [];
            items.forEach(function(item) {
              var linkedProductId = Number(item.product_id || 0);
              var shoppingPurchaseItemId = Number(item.id || 0);
              if (!linkedProductId || !shoppingPurchaseItemId) return;
              if (syncedShoppingPurchaseItemIds[shoppingPurchaseItemId]) return;
              unsyncedShoppingItems.push({
                purchase: purchase,
                item: item,
                sourceLabel: shoppingListsMap[purchase.list_id] || 'חנות #' + purchase.list_id
              });
            });
          });

      var recentRows = allPurchases.slice().sort(function(a, b) {
        return String(b.purchase.purchase_date || '').localeCompare(String(a.purchase.purchase_date || '')) || Number(b.purchase.id || 0) - Number(a.purchase.id || 0);
      }).slice(0, 12).map(function(entry) {
        var badges = [];
        if (entry.isShopping) badges.push(getProductReportTrendBadge('shopping', 'Shopping'));
        if (entry.isInactive) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        return '<tr>' +
          '<td>' + formatProductReportDate(entry.purchase.purchase_date) + '</td>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div>' + (badges.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div>' : '') + '</div></td>' +
          '<td>' + formatProductMoney(entry.purchase.total_price) + '</td>' +
          '<td>' + entry.sourceLabel + '</td>' +
          '<td>' + (entry.purchase.notes || '—') + '</td>' +
        '</tr>';
      }).join('');

      var topRows = Object.keys(topProductsMap).map(function(key) { return topProductsMap[key]; }).sort(function(a, b) {
        return b.count - a.count || b.spend - a.spend;
      }).slice(0, 10).map(function(entry) {
        var badges = [];
        if (Number(entry.product.is_active) === 0) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        if (entry.shoppingCount > 0) badges.push(getProductReportTrendBadge('shopping', entry.shoppingCount + ' משופינג'));
        return '<tr>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div>' + (badges.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div>' : '') + '</div></td>' +
          '<td>' + entry.count + '</td>' +
          '<td>' + formatProductMoney(entry.spend) + '</td>' +
          '<td>' + formatProductReportDate(entry.lastPurchaseDate) + '</td>' +
        '</tr>';
      }).join('');

      var increaseRows = priceIncreases.sort(function(a, b) { return b.delta - a.delta; }).slice(0, 10).map(function(entry) {
        var extra = entry.percent === null ? 'ללא בסיס להשוואה' : 'עלייה של ' + formatProductReportPercent(entry.percent);
        var badges = [getProductReportTrendBadge('up', 'מחיר גבוה יותר')];
        if (entry.isInactive) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        return '<tr>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div></div></td>' +
          '<td>' + formatProductMoney(entry.previous.unit_price) + '</td>' +
          '<td>' + formatProductMoney(entry.latest.unit_price) + '</td>' +
          '<td><div>' + formatProductMoney(entry.delta) + '</div><div style="font-size:12px;color:var(--text3)">' + extra + '</div></td>' +
          '<td>' + formatProductReportDate(entry.latest.purchase_date) + '</td>' +
        '</tr>';
      }).join('');

      var recentShoppingRows = recentShoppingLinked.slice().sort(function(a, b) {
        return String(b.purchase.purchase_date || '').localeCompare(String(a.purchase.purchase_date || '')) || Number(b.purchase.id || 0) - Number(a.purchase.id || 0);
      }).slice(0, 10).map(function(entry) {
        var badges = [getProductReportTrendBadge('shopping', 'משופינג')];
        if (entry.isInactive) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        return '<tr>' +
          '<td>' + formatProductReportDate(entry.purchase.purchase_date) + '</td>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div></div></td>' +
          '<td>' + formatProductMoney(entry.purchase.total_price) + '</td>' +
          '<td>' + entry.sourceLabel + '</td>' +
        '</tr>';
      }).join('');

      var sourceRows = Object.keys(sourceMap).map(function(key) { return sourceMap[key]; }).sort(function(a, b) {
        return b.total - a.total || b.count - a.count;
      }).slice(0, 20).map(function(entry) {
        var shoppingBadge = entry.shoppingCount > 0 ? getProductReportTrendBadge('shopping', entry.shoppingCount + ' משופינג') : '';
        var avgPurchase = entry.count > 0 ? entry.total / entry.count : 0;
        return '<tr>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + entry.name + '</div>' + (shoppingBadge ? '<div>' + shoppingBadge + '</div>' : '') + '</div></td>' +
          '<td>' + entry.count + '</td>' +
          '<td>' + formatProductMoney(entry.total) + '</td>' +
          '<td>' + formatProductMoney(avgPurchase) + '</td>' +
        '</tr>';
      }).join('');

      var supplierVariationRows = supplierVariationProducts.sort(function(a, b) {
        return b.delta - a.delta;
      }).slice(0, 10).map(function(entry) {
        var badges = [];
        if (entry.isInactive) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        badges.push(getProductReportTrendBadge('shopping', entry.supplierCount + ' ספקים'));
        return '<tr>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div></div></td>' +
          '<td><div>' + entry.lowestSupplier.name + '</div><div style="font-size:12px;color:var(--text3)">' + formatProductMoney(entry.lowestSupplier.minPrice) + '</div></td>' +
          '<td><div>' + entry.highestSupplier.name + '</div><div style="font-size:12px;color:var(--text3)">' + formatProductMoney(entry.highestSupplier.maxPrice) + '</div></td>' +
          '<td>' + formatProductMoney(entry.delta) + '</td>' +
        '</tr>';
      }).join('');

      var supplierIncreaseRows = supplierPriceIncreases.sort(function(a, b) {
        return b.delta - a.delta;
      }).slice(0, 10).map(function(entry) {
        var badges = [getProductReportTrendBadge('up', 'ספק יקר יותר')];
        if (entry.isInactive) badges.push(getProductReportTrendBadge('inactive', 'מוצר מושבת'));
        return '<tr>' +
          '<td><div style="display:flex;flex-direction:column;gap:4px"><div>' + (entry.product.name || 'מוצר') + '</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + badges.join('') + '</div></div></td>' +
          '<td><div>' + entry.cheaperSupplier.name + '</div><div style="font-size:12px;color:var(--text3)">' + formatProductMoney(entry.cheaperSupplier.latestPrice) + '</div></td>' +
          '<td><div>' + entry.expensiveSupplier.name + '</div><div style="font-size:12px;color:var(--text3)">' + formatProductMoney(entry.expensiveSupplier.latestPrice) + '</div></td>' +
          '<td><div>' + formatProductMoney(entry.delta) + '</div><div style="font-size:12px;color:var(--text3)">' + (entry.percent === null ? '—' : formatProductReportPercent(entry.percent)) + '</div></td>' +
        '</tr>';
      }).join('');

      var lowStockAlertItems = lowStockProducts.slice(0, 5).map(function(entry) {
        var product = entry.product || {};
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title">' + (product.name || ('מוצר #' + product.id)) + '</div>' +
            '<div class="product-ops-item-meta"><span>מלאי: ' + formatProductStockValue(entry.current_stock) + '</span><span>מינימום: ' + formatProductStockValue(entry.min_stock_alert) + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var unreceivedAlertItems = unreceivedPurchases.slice().sort(function(a, b) {
        return String(b.purchase.purchase_date || '').localeCompare(String(a.purchase.purchase_date || '')) || Number(b.purchase.id || 0) - Number(a.purchase.id || 0);
      }).slice(0, 5).map(function(entry) {
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title">' + (entry.product.name || ('מוצר #' + entry.product.id)) + '</div>' +
            '<div class="product-ops-item-meta"><span>כמות: ' + formatProductStockValue(entry.purchase.quantity) + '</span><span>תאריך: ' + formatProductReportDate(entry.purchase.purchase_date) + '</span><span>ספק: ' + (entry.purchase.supplier_name || '—') + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var priceIncreaseAlertItems = priceIncreases.slice().sort(function(a, b) {
        return b.delta - a.delta;
      }).slice(0, 5).map(function(entry) {
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title">' + (entry.product.name || ('מוצר #' + entry.product.id)) + '</div>' +
            '<div class="product-ops-item-meta"><span>מחיר קודם: ' + formatProductMoney(entry.previous.unit_price) + '</span><span>מחיר אחרון: ' + formatProductMoney(entry.latest.unit_price) + '</span><span>פער: ' + formatProductMoney(entry.delta) + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var unusualMovementItems = unusualMovements.slice().sort(function(a, b) {
        return String(b.movement.created_at || '').localeCompare(String(a.movement.created_at || '')) || Number(b.movement.id || 0) - Number(a.movement.id || 0);
      }).slice(0, 5).map(function(entry) {
        var movement = entry.movement || {};
        var tags = [];
        if (entry.isManual) tags.push('תנועה ידנית');
        if (entry.isLarge) tags.push('כמות גדולה');
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title">' + (entry.product.name || ('מוצר #' + entry.product.id)) + '</div>' +
            '<div class="product-ops-item-meta"><span>' + getMovementTypeLabel(movement.movement_type) + '</span><span>שינוי: ' + (Number(movement.quantity_change) > 0 ? '+' : '') + formatProductStockValue(movement.quantity_change) + '</span><span>' + formatDate(movement.created_at) + '</span></div>' +
            '<div class="product-ops-item-meta"><span>' + (tags.join(' | ') || 'חריג') + '</span><span>' + (movement.reason || movement.reference_type || 'ללא סיבה') + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var unsyncedShoppingAlertItems = unsyncedShoppingItems.slice().sort(function(a, b) {
        return String(b.purchase.purchase_date || '').localeCompare(String(a.purchase.purchase_date || '')) || Number(b.purchase.id || 0) - Number(a.purchase.id || 0);
      }).slice(0, 5).map(function(entry) {
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title">' + (entry.item.item_name || ('פריט #' + entry.item.id)) + '</div>' +
            '<div class="product-ops-item-meta"><span>חנות: ' + entry.sourceLabel + '</span><span>תאריך: ' + formatProductReportDate(entry.purchase.purchase_date) + '</span><span>כמות: ' + formatProductStockValue(entry.item.quantity) + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var alertsHtml = '<div class="table-card" style="margin-bottom:16px">' +
        '<div class="table-toolbar" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<div><strong>מרכז התראות תפעולי</strong><div style="font-size:12px;color:var(--text3);margin-top:4px">ריכוז קצר של נושאים שדורשים תשומת לב, על בסיס הנתונים הקיימים בלבד.</div></div>' +
        '</div>' +
        '<div class="product-ops-grid" style="padding:16px;padding-top:0">' +
          renderOperationalAlertsCard('מוצרים במלאי נמוך', lowStockProducts.length, 'מוצרים פעילים שמתקרבים או ירדו מתחת למינימום.', lowStockAlertItems, 'אין כרגע מוצרים פעילים במלאי נמוך.', lowStockProducts.length ? 'urgent' : 'info') +
          renderOperationalAlertsCard('רכישות שלא נקלטו למלאי', unreceivedPurchases.length, 'רכישות קיימות שהיסטוריית המוצרים עדיין מסמנת כלא נקלטו.', unreceivedAlertItems, 'אין כרגע רכישות שממתינות לקליטת מלאי.', unreceivedPurchases.length ? 'attention' : 'info') +
          renderOperationalAlertsCard('מוצרים שהתייקרו', priceIncreases.length, 'השוואה בין שתי הרכישות האחרונות של כל מוצר.', priceIncreaseAlertItems, 'אין כרגע מוצרים עם עליית מחיר אחרונה.', priceIncreases.length ? 'attention' : 'info') +
          renderOperationalAlertsCard('תנועות מלאי חריגות', unusualMovements.length, 'מוצגות רק תנועות ידניות או תנועות גדולות במיוחד, כדי להישאר שמרניים.', unusualMovementItems, 'לא זוהו כרגע תנועות מלאי חריגות לפי הכללים השמרניים.', unusualMovements.length ? 'attention' : 'info') +
          renderOperationalAlertsCard('רכישות שופינג שלא סונכרנו', unsyncedShoppingItems.length, 'פריטי Shopping עם מוצר מקושר שעדיין לא הופיעו בהיסטוריית המוצרים.', unsyncedShoppingAlertItems, 'לא זוהו כרגע רכישות Shopping מקושרות שממתינות לסנכרון.', unsyncedShoppingItems.length ? 'attention' : 'info') +
        '</div>' +
      '</div>';

      var shoppingSuggestions = lowStockProducts.map(function(entry) {
        var product = entry.product || {};
        var currentStock = Number(entry.current_stock || 0);
        var minStock = Number(entry.min_stock_alert || 0);
        var latestMovementDate = '';
        var productEntry = productEntries.find(function(candidate) { return Number(candidate.product && candidate.product.id) === Number(product.id); });
        if (productEntry && Array.isArray(productEntry.movements) && productEntry.movements.length) {
          latestMovementDate = String(productEntry.movements.slice().sort(function(a, b) {
            return String(b.created_at || '').localeCompare(String(a.created_at || '')) || Number(b.id || 0) - Number(a.id || 0);
          })[0].created_at || '').slice(0, 10);
        }
        var isNearThreshold = minStock > 0 && currentStock <= (minStock + 1);
        var noRecentMovement = !latestMovementDate || latestMovementDate < last30Start;
        return {
          product: product,
          currentStock: currentStock,
          minStock: minStock,
          hasUnreceived: !!productUnreceivedMap[product.id],
          priceIncrease: productPriceIncreaseMap[product.id] || null,
          latestMovementDate: latestMovementDate,
          noRecentMovement: noRecentMovement,
          isNearThreshold: isNearThreshold,
          priority: (currentStock <= 0 ? 100 : 0) + (currentStock < minStock ? 50 : 0) + (isNearThreshold ? 20 : 0) + (noRecentMovement ? 10 : 0)
        };
      }).sort(function(a, b) {
        return b.priority - a.priority || a.currentStock - b.currentStock || a.product.name.localeCompare(b.product.name);
      });

      var shoppingSuggestionItems = shoppingSuggestions.slice(0, 6).map(function(entry) {
        var notes = [];
        var badge = getOperationalAlertSeverityBadge(entry.currentStock <= 0 ? 'urgent' : 'attention');
        if (entry.hasUnreceived) {
          notes.push('יש רכישה פתוחה שעדיין לא נקלטה, כדאי לבדוק לפני קנייה נוספת');
        } else {
          notes.push('מומלץ לבדוק אם צריך לחדש מלאי בקרוב');
        }
        if (entry.priceIncrease) {
          notes.push('זהירות מחיר: עלייה אחרונה של ' + formatProductMoney(entry.priceIncrease.delta));
        }
        if (entry.noRecentMovement && entry.isNearThreshold) {
          notes.push('לא זוהתה תנועת מלאי עדכנית לאחרונה, למרות שהמוצר קרוב לסף');
        }
        return '<div class="product-ops-item">' +
          '<div class="product-ops-item-main">' +
            '<div class="product-ops-item-title" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + (entry.product.name || ('מוצר #' + entry.product.id)) + badge + '</div>' +
            '<div class="product-ops-item-meta"><span>מלאי: ' + formatProductStockValue(entry.currentStock) + '</span><span>מינימום: ' + formatProductStockValue(entry.minStock) + '</span>' + (entry.latestMovementDate ? '<span>תנועה אחרונה: ' + formatProductReportDate(entry.latestMovementDate) + '</span>' : '<span>אין תנועה עדכנית</span>') + '</div>' +
            '<div class="product-ops-item-meta"><span>' + notes.join(' | ') + '</span></div>' +
          '</div>' +
        '</div>';
      }).join('');

      var suggestionsHtml = '<div class="table-card" style="margin-bottom:16px">' +
        '<div class="table-toolbar" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<div><strong>המלצות לבדיקה לפני קנייה</strong><div style="font-size:12px;color:var(--text3);margin-top:4px">רשימת מוצרים שכדאי לשקול לבדוק, בלי לפתוח רשימת קניות ובלי לבצע פעולה אוטומטית.</div></div>' +
        '</div>' +
        (shoppingSuggestionItems ? '<div class="product-ops-list" style="padding:16px;padding-top:0">' + shoppingSuggestionItems + '</div>' : '<div class="dash-empty" style="padding:16px">אין כרגע מוצרים שדורשים בדיקת קנייה לפי הכללים השמרניים.</div>') +
      '</div>';

      content.innerHTML = '' +
        '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<div><div class="page-title" style="font-size:22px">דוחות רכישות</div><div style="font-size:12px;color:var(--text3);margin-top:4px">מבט מהיר על התייקרויות, רכישות משופינג, ספקים והוצאות חריגות.</div></div>' +
          '<button class="btn btn-secondary" id="btn-back-to-products-list">חזרה למוצרים</button>' +
        '</div>' +
        '<div class="stats-grid" style="margin-bottom:16px">' +
          '<div class="stat-card"><div class="stat-label">סה"כ החודש</div><div class="stat-value">₪' + fmtMoney(totalThisMonth) + '</div></div>' +
          '<div class="stat-card"><div class="stat-label">סה"כ 30 יום</div><div class="stat-value">₪' + fmtMoney(totalLast30) + '</div></div>' +
          '<div class="stat-card"><div class="stat-label">מספר רכישות</div><div class="stat-value">' + allPurchases.length + '</div></div>' +
          '<div class="stat-card"><div class="stat-label">מקורות/ספקים</div><div class="stat-value">' + Object.keys(sourceMap).length + '</div></div>' +
        '</div>' +
        alertsHtml +
        suggestionsHtml +
        renderProductReportsTable('רכישות אחרונות', 'אין רכישות להצגה עדיין. ברגע שתתווסף היסטוריית רכישות, היא תופיע כאן.', recentRows, '<th>תאריך</th><th>מוצר</th><th>סה"כ</th><th>ספק / חנות</th><th>הערות</th>', 'כולל איתור מהיר של רכישות משופינג ומוצרים מושבתים.') +
        renderProductReportsTable('סיכום הוצאה לפי ספק / חנות', 'אין עדיין ספקים או חנויות להצגה.', sourceRows, '<th>ספק / חנות</th><th>מספר רכישות</th><th>סה"כ הוצאה</th><th>ממוצע לרכישה</th>', 'ממויין לפי סך הוצאה, עם ממוצע רכישה שיעזור להבין לאן הכסף הולך.') +
        renderProductReportsTable('המוצרים שנרכשו הכי הרבה', 'אין עדיין מוצרים עם היסטוריית רכישות.', topRows, '<th>מוצר</th><th>מספר רכישות</th><th>סה"כ הוצאה</th><th>רכישה אחרונה</th>', 'ממויין קודם לפי תדירות רכישה, ואז לפי סך הוצאה.') +
        renderProductReportsTable('מוצרים עם פערי מחיר בין ספקים', 'אין עדיין מספיק נתונים כדי להציג פערי מחיר בין ספקים לאותו מוצר.', supplierVariationRows, '<th>מוצר</th><th>ספק זול</th><th>ספק יקר</th><th>פער</th>', 'מוצג רק כאשר אותו מוצר נרכש מכמה ספקים או חנויות ובמחירים שונים.') +
        renderProductReportsTable('מוצרים שהתייקרו', 'אין כרגע מוצרים עם עלייה בין הרכישה האחרונה לזו שלפניה.', increaseRows, '<th>מוצר</th><th>מחיר קודם</th><th>מחיר אחרון</th><th>פער</th><th>תאריך אחרון</th>', 'השוואה בין שתי הרכישות האחרונות לכל מוצר, כולל אחוז שינוי כשאפשר.') +
        renderProductReportsTable('מוצרים יקרים יותר לפי ספק', 'אין עדיין מספיק נתונים כדי להציג ספק יקר יותר מול ספק זול יותר לאותו מוצר.', supplierIncreaseRows, '<th>מוצר</th><th>ספק זול יותר</th><th>ספק יקר יותר</th><th>פער</th>', 'מבוסס על המחיר האחרון הידוע לכל ספק עבור אותו מוצר, רק כשיש לפחות שני ספקים להשוואה.') +
        renderProductReportsTable('רכישות אחרונות שהגיעו משופינג', 'עדיין אין רכישות שמקורן בסנכרון משופינג.', recentShoppingRows, '<th>תאריך</th><th>מוצר</th><th>סה"כ</th><th>מקור</th>', 'מראה רק רכישות שנוצרו מסנכרון Shopping → Products.');

      var backBtn = document.getElementById('btn-back-to-products-list');
      if (backBtn) {
        backBtn.onclick = function() {
          currentProductsView = 'list';
          var pageContent = document.getElementById('products-page-content');
          if (!pageContent) return;
          pageContent.innerHTML = renderProductsListView();
          loadProducts();
        };
      }
        });
      });
    });
  }).catch(function(e) {
    content.innerHTML = '<div class="table-card"><div class="dash-empty" style="padding:24px">שגיאה בטעינת דוחות רכישות</div></div>';
    toast(e.message, 'error');
  });
}

function loadProducts() {
  currentProductsView = 'list';
  var content = document.getElementById('products-page-content');
  if (content && (!document.getElementById('products-grid') || !document.getElementById('products-low-stock-summary') || !document.getElementById('products-operational-widgets'))) {
    content.innerHTML = renderProductsListView();
  }

  var reportsBtn = document.getElementById('btn-product-reports');
  if (reportsBtn && !reportsBtn.dataset.bound) {
    reportsBtn.dataset.bound = '1';
    reportsBtn.onclick = function() {
      if (!isModuleEnabled('reports')) {
        toast('Module disabled', 'error');
        var contentBlocked = document.getElementById('products-page-content');
        if (contentBlocked) contentBlocked.innerHTML = '<div class="table-card"><div class="dash-empty" style="padding:24px">Module disabled</div></div>';
        return;
      }
      loadProductPurchaseReports();
    };
  }

  var grid = document.getElementById('products-grid');
  var lowStockSummary = document.getElementById('products-low-stock-summary');
  var operationalWidgets = document.getElementById('products-operational-widgets');
  applyModuleVisibility();
  if (!grid) return;

  var search = document.getElementById('products-search') ? document.getElementById('products-search').value.trim() : '';
  var path = '/api/products?search=' + encodeURIComponent(search) + '&includeInactive=1';

  grid.innerHTML = '<div class="dash-empty">טוען...</div>';
  if (lowStockSummary) lowStockSummary.innerHTML = renderProductLowStockSummary([]);
  if (operationalWidgets) operationalWidgets.innerHTML = renderOperationalIntelligenceLoading();

  Promise.all([
    apiCall('GET', path),
    apiCall('GET', '/api/inventory/low-stock').catch(function() { return { products: [] }; })
  ]).then(function(results) {
    var data = results[0] || {};
    var lowStockData = results[1] || {};
    var products = data.products || [];
    currentLowStockProducts = lowStockData.products || [];

    if (lowStockSummary) {
      lowStockSummary.innerHTML = renderProductLowStockSummary(currentLowStockProducts);
      var refreshBtn = document.getElementById('btn-refresh-low-stock');
      if (refreshBtn) refreshBtn.onclick = function() { loadProducts(); };
    }

    if (!products.length) {
      currentOperationalUnreceivedPurchases = [];
      currentOperationalRecentMovements = [];
      renderOperationalIntelligenceWidgetsIntoPage();
      grid.innerHTML = '<div class="dash-empty">אין מוצרים להצגה</div>';
      return;
    }

    return Promise.all(products.map(function(product) {
      return Promise.all([
        apiCall('GET', '/api/products/' + product.id + '/stock').catch(function() { return null; }),
        apiCall('GET', '/api/products/' + product.id + '/purchases?limit=20&offset=0').catch(function() { return { purchases: [] }; }),
        apiCall('GET', '/api/products/' + product.id + '/stock-movements?limit=5&offset=0').catch(function() { return { movements: [] }; })
      ]).then(function(results) {
        return {
          product: product,
          stock: results[0],
          purchases: (results[1] && results[1].purchases) || [],
          movements: (results[2] && results[2].movements) || []
        };
      });
    })).then(function(productEntries) {
      var lowStockMap = {};
      currentLowStockProducts.forEach(function(entry) {
        if (entry && entry.product && entry.product.id !== undefined) lowStockMap[entry.product.id] = true;
      });

      currentOperationalUnreceivedPurchases = [];
      currentOperationalRecentMovements = [];
      productEntries.forEach(function(entry) {
        (entry.purchases || []).forEach(function(purchase) {
          if (Number(purchase.stock_received) === 1) return;
          currentOperationalUnreceivedPurchases.push({
            product: entry.product,
            purchase: purchase
          });
        });

        (entry.movements || []).forEach(function(movement) {
          currentOperationalRecentMovements.push({
            product: entry.product,
            movement: movement
          });
        });
      });

      currentOperationalUnreceivedPurchases.sort(function(a, b) {
        return String(b.purchase.purchase_date || '').localeCompare(String(a.purchase.purchase_date || '')) || Number(b.purchase.id || 0) - Number(a.purchase.id || 0);
      });
      currentOperationalRecentMovements.sort(function(a, b) {
        return String(b.movement.created_at || '').localeCompare(String(a.movement.created_at || '')) || Number(b.movement.id || 0) - Number(a.movement.id || 0);
      });
      renderOperationalIntelligenceWidgetsIntoPage();

      grid.innerHTML = '<div class="product-grid">' + productEntries.map(function(entry) {
        var product = entry.product;
        var stockInfo = entry.stock;
        var cardStockValue = stockInfo ? formatProductStockValue(stockInfo.current_stock) : 'לא זמין';
        var minAlertValue = stockInfo && stockInfo.min_stock_alert !== null && stockInfo.min_stock_alert !== undefined && stockInfo.min_stock_alert !== ''
          ? formatProductStockValue(stockInfo.min_stock_alert)
          : '—';
        var showLowStock = !!lowStockMap[product.id] || !!(stockInfo && stockInfo.is_low_stock);

        return '<div class="product-card">' +
          '<div class="product-card-header">' +
            '<div style="flex:1">' +
              '<div class="product-card-name">' + (product.name || 'מוצר ללא שם') + '</div>' +
              '<div class="product-card-meta" style="margin-top:4px">' + (product.category || 'ללא קטגוריה') + '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
              (showLowStock ? '<span class="badge badge-orange">מלאי נמוך</span>' : '') +
              productStatusBadge(product.is_active) +
            '</div>' +
          '</div>' +
          '<div class="product-card-meta">SKU: ' + (product.sku || '—') + '</div>' +
          '<div class="product-card-meta">יחידה: ' + (product.unit || '—') + '</div>' +
          '<div class="product-stock-row">' +
            '<div><div class="product-stock-helper">מלאי נוכחי (ledger)</div><div class="product-stock-value">' + cardStockValue + '</div></div>' +
            getProductInventoryStatusBadge(stockInfo) +
          '</div>' +
          '<div class="product-stats">' +
            '<div class="product-stat"><div class="product-stat-label">עלות</div><div class="product-stat-value">' + formatProductMoney(product.cost_price) + '</div></div>' +
            '<div class="product-stat"><div class="product-stat-label">מחיר מכירה</div><div class="product-stat-value">' + formatProductMoney(product.sale_price) + '</div></div>' +
            '<div class="product-stat"><div class="product-stat-label">מלאי שמור במוצר</div><div class="product-stat-value">' + (product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity !== '' ? product.stock_quantity : '—') + '</div></div>' +
            '<div class="product-stat"><div class="product-stat-label">מינימום התראה</div><div class="product-stat-value">' + minAlertValue + '</div></div>' +
          '</div>' +
          (product.notes ? '<div class="product-card-notes">' + product.notes + '</div>' : '') +
          '<div class="product-card-actions">' +
            '<button class="btn btn-secondary btn-sm product-edit-btn" data-id="' + product.id + '">עריכה</button>' +
            (Number(product.is_active) === 0 ? '' : '<button class="btn btn-danger btn-sm product-deactivate-btn" data-id="' + product.id + '">השבת</button>') +
          '</div>' +
        '</div>';
      }).join('') + '</div>';

      grid.querySelectorAll('.product-edit-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          openProductModal(parseInt(this.getAttribute('data-id')));
        });
      });

      grid.querySelectorAll('.product-deactivate-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          deactivateProduct(parseInt(this.getAttribute('data-id')));
        });
      });
    });
  }).catch(function(e) {
    grid.innerHTML = '<div class="dash-empty">שגיאה בטעינת מוצרים</div>';
    if (lowStockSummary) {
      lowStockSummary.innerHTML = '<div class="product-low-stock-banner"><div><div class="product-low-stock-title">מוצרים במלאי נמוך</div><div class="product-low-stock-text">לא הצלחנו לטעון כרגע את רשימת המלאי הנמוך.</div></div></div>';
    }
    if (operationalWidgets) operationalWidgets.innerHTML = renderOperationalIntelligenceError();
    toast(e.message, 'error');
  });
}

function deactivateProduct(id) {
  if (!confirm('להשבית את המוצר? המוצר יישאר במערכת אך יסומן כלא פעיל.')) return;
  apiCall('DELETE', '/api/products/' + id).then(function() {
    toast('המוצר הושבת', 'success');
    loadProducts();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function openProductModal(id) {
  currentProductId = id || null;
  currentProductStock = null;
  currentProductStockMovements = [];
  currentProductAdjustmentMode = null;
  currentProductAdjustmentSaving = false;
  var old = document.getElementById('product-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'product-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:620px">' +
      '<div class="modal-header">' +
        '<h2>' + (id ? 'עריכת מוצר' : 'מוצר חדש') + '</h2>' +
        '<button class="modal-close" id="product-modal-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">שם מוצר *</label><input class="form-input" id="product-name" placeholder="שם המוצר"></div>' +
          '<div class="form-group"><label class="form-label">קטגוריה</label><input class="form-input" id="product-category" placeholder="קטגוריה"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">SKU</label><input class="form-input" id="product-sku" placeholder="SKU"></div>' +
          '<div class="form-group"><label class="form-label">יחידה</label><input class="form-input" id="product-unit" placeholder="יחידה"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">עלות</label><input class="form-input" id="product-cost-price" type="number" step="0.01" placeholder="0"></div>' +
          '<div class="form-group"><label class="form-label">מחיר מכירה</label><input class="form-input" id="product-sale-price" type="number" step="0.01" placeholder="0"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">כמות במלאי</label><input class="form-input" id="product-stock-quantity" type="number" step="1" placeholder="0"></div>' +
          '<div class="form-group"><label class="form-label">מינימום התראה</label><input class="form-input" id="product-min-stock-alert" type="number" step="1" placeholder="0"></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-textarea" id="product-notes" placeholder="הערות על המוצר"></textarea></div>' +
        '<div class="form-group"><label class="check-item" style="display:inline-flex;width:auto"><input type="checkbox" id="product-is-active" checked> מוצר פעיל</label></div>' +
        (id ? '<div id="product-inventory-root">' + renderProductInventorySection(null, []) + '</div>' : '') +
        (id ? '<div class="product-purchases-section" id="product-purchases-section">' +
          '<div class="product-purchases-header">' +
            '<div class="product-purchases-title">היסטוריית רכישות</div>' +
            '<button class="btn btn-primary btn-sm" type="button" id="btn-add-product-purchase">הוסף רכישה</button>' +
          '</div>' +
          '<div class="product-purchases-summary" id="product-purchases-summary"><div class="dash-empty">טוען...</div></div>' +
          '<div id="product-purchase-inline-form"></div>' +
          '<div id="product-purchases-list"></div>' +
        '</div>' : '') +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="product-modal-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="product-modal-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); currentProductId = null; currentProductPurchaseEditId = null; currentProductPurchaseFormMode = null; currentProductPurchaseSaving = false; currentProductStock = null; currentProductStockMovements = []; currentProductAdjustmentMode = null; currentProductAdjustmentSaving = false; }
  document.getElementById('product-modal-close').onclick = close;
  document.getElementById('product-modal-cancel').onclick = close;

  if (id) {
    Promise.all([
      apiCall('GET', '/api/products/' + id),
      loadProductInventory(id).catch(function() {
        currentProductStock = null;
        currentProductStockMovements = [];
        renderProductInventoryUI(id);
        return null;
      })
    ]).then(function(results) {
      var product = ((results[0] || {}).product) || {};
      document.getElementById('product-name').value = product.name || '';
      document.getElementById('product-category').value = product.category || '';
      document.getElementById('product-sku').value = product.sku || '';
      document.getElementById('product-unit').value = product.unit || '';
      document.getElementById('product-cost-price').value = product.cost_price || '';
      document.getElementById('product-sale-price').value = product.sale_price || '';
      document.getElementById('product-stock-quantity').value = (product.stock_quantity !== null && product.stock_quantity !== undefined) ? product.stock_quantity : '';
      document.getElementById('product-min-stock-alert').value = (product.min_stock_alert !== null && product.min_stock_alert !== undefined) ? product.min_stock_alert : '';
      document.getElementById('product-notes').value = product.notes || '';
      document.getElementById('product-is-active').checked = Number(product.is_active) !== 0;
      renderProductInventoryUI(id);
      loadProductPurchases(id);
    }).catch(function(e) { toast(e.message, 'error'); close(); });
  }

  document.getElementById('product-modal-save').onclick = function() {
    var body = {
      name: document.getElementById('product-name').value.trim(),
      category: document.getElementById('product-category').value.trim(),
      sku: document.getElementById('product-sku').value.trim(),
      unit: document.getElementById('product-unit').value.trim(),
      cost_price: document.getElementById('product-cost-price').value,
      sale_price: document.getElementById('product-sale-price').value,
      stock_quantity: document.getElementById('product-stock-quantity').value,
      min_stock_alert: document.getElementById('product-min-stock-alert').value,
      notes: document.getElementById('product-notes').value.trim(),
      is_active: document.getElementById('product-is-active').checked ? 1 : 0
    };

    if (!body.name) { toast('שם מוצר חובה', 'error'); return; }

    apiCall(id ? 'PUT' : 'POST', id ? '/api/products/' + id : '/api/products', body).then(function() {
      close();
      toast(id ? 'המוצר עודכן' : 'המוצר נוסף', 'success');
      loadProducts();
    }).catch(function(e) { toast(e.message, 'error'); });
  };
}

function loadEmployees() {
  var grid = document.getElementById('employees-grid');
  if (!grid) return;

  var search = document.getElementById('employees-search') ? document.getElementById('employees-search').value.trim() : '';
  var statusFilter = document.getElementById('employees-status-filter') ? document.getElementById('employees-status-filter').value : 'active';
  var path = '/api/employees?search=' + encodeURIComponent(search);
  if (statusFilter === 'all' || statusFilter === 'inactive') path += '&includeInactive=1';

  grid.innerHTML = '<div class="dash-empty">טוען...</div>';

  apiCall('GET', path).then(function(data) {
    var employees = data.employees || [];

    if (statusFilter === 'inactive') {
      employees = employees.filter(function(emp) { return Number(emp.is_active) === 0; });
    }

    if (!employees.length) {
      grid.innerHTML = '<div class="dash-empty">אין עובדים להצגה</div>';
      return;
    }

    grid.innerHTML = '<div class="employee-grid">' + employees.map(function(emp) {
      var waPhone = getEmployeeWaPhone(emp.phone || '');
      var hourlyRate = emp.hourly_rate !== null && emp.hourly_rate !== undefined && emp.hourly_rate !== '' ? '₪' + fmtMoney(emp.hourly_rate) + ' לשעה' : 'לא הוגדר';
      return '<div class="employee-card">' +
        '<div class="employee-card-header">' +
          '<div style="flex:1">' +
            '<div class="employee-card-name">' + (emp.full_name || 'עובד ללא שם') + '</div>' +
            '<div class="employee-card-meta" style="margin-top:4px">' + (emp.role || 'ללא תפקיד') + '</div>' +
          '</div>' +
          employeeStatusBadge(emp.is_active) +
        '</div>' +
        '<div class="employee-card-meta">📞 ' + (emp.phone || '—') + '</div>' +
        (emp.email ? '<div class="employee-card-meta">✉️ ' + emp.email + '</div>' : '') +
        '<div class="employee-card-meta">💸 ' + hourlyRate + '</div>' +
        (emp.notes ? '<div style="font-size:13px;color:var(--text2);line-height:1.6;white-space:pre-wrap">' + emp.notes + '</div>' : '') +
        '<div class="employee-card-actions">' +
          (emp.phone ? '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:24px;height:24px;object-fit:contain;display:block"></a>' : '') +
          (emp.phone ? '<a class="btn btn-ghost btn-sm" href="tel:' + emp.phone + '"><img src="/phone-icon.png" alt="Phone" style="width:24px;height:24px;object-fit:contain;display:block"></a>' : '') +
          (emp.email ? '<a class="btn btn-ghost btn-sm" href="mailto:' + emp.email + '"><img src="/mail-icon.png" alt="Mail" style="width:24px;height:24px;object-fit:contain;display:block"></a>' : '') +
          '<button class="btn btn-secondary btn-sm employee-edit-btn" data-id="' + emp.id + '">עריכה</button>' +
          (Number(emp.is_active) === 0 ? '' : '<button class="btn btn-danger btn-sm employee-deactivate-btn" data-id="' + emp.id + '">השבת</button>') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    grid.querySelectorAll('.employee-edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        openEmployeeModal(parseInt(this.getAttribute('data-id')));
      });
    });

    grid.querySelectorAll('.employee-deactivate-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deactivateEmployee(parseInt(this.getAttribute('data-id')));
      });
    });
  }).catch(function(e) {
    grid.innerHTML = '<div class="dash-empty">שגיאה בטעינת עובדים</div>';
    toast(e.message, 'error');
  });
}

function openEmployeeModal(id) {
  currentEmployeeId = id || null;
  var old = document.getElementById('employee-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'employee-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:620px">' +
      '<div class="modal-header">' +
        '<h2>' + (id ? 'עריכת עובד' : 'עובד חדש') + '</h2>' +
        '<button class="modal-close" id="employee-modal-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">שם מלא *</label><input class="form-input" id="employee-full-name" placeholder="שם העובד"></div>' +
          '<div class="form-group"><label class="form-label">טלפון *</label><input class="form-input" id="employee-phone" type="tel" placeholder="050-0000000"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">אימייל</label><input class="form-input" id="employee-email" type="email" placeholder="employee@example.com"></div>' +
          '<div class="form-group"><label class="form-label">תפקיד</label><input class="form-input" id="employee-role" placeholder="תפקיד"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">שכר שעתי</label><input class="form-input" id="employee-hourly-rate" type="number" step="0.01" placeholder="0"></div>' +
          '<div class="form-group"><label class="form-label">תאריך לידה</label><input class="form-input" id="employee-birth-date" type="date"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">איש קשר לחירום</label><input class="form-input" id="employee-emergency-name" placeholder="שם"></div>' +
          '<div class="form-group"><label class="form-label">טלפון חירום</label><input class="form-input" id="employee-emergency-phone" type="tel" placeholder="050-0000000"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-group"><label class="form-label">אזור עבודה מועדף</label><input class="form-input" id="employee-work-area" placeholder="מרכז / צפון / דרום"></div>' +
          '<div class="form-group"><label class="form-label">אופן תשלום</label><input class="form-input" id="employee-payment-method" placeholder="מזומן / העברה / ביט"></div>' +
        '</div>' +
        '<div class="form-group"><label class="form-label">הערות פרטי תשלום</label><textarea class="form-textarea" id="employee-bank-notes" placeholder="הערות בלבד"></textarea></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-textarea" id="employee-notes" placeholder="הערות כלליות"></textarea></div>' +
        '<div class="form-group"><label class="form-label">הערות פנימיות</label><textarea class="form-textarea" id="employee-internal-notes" placeholder="לשימוש פנימי"></textarea></div>' +
        '<div class="form-group"><label class="check-item" style="display:inline-flex;width:auto"><input type="checkbox" id="employee-is-active" checked> עובד פעיל</label></div>' +
        (id ? '<div id="employee-assignments-profile"><div class="info-section"><div class="info-section-title">אירועים ושכר</div><div style="font-size:13px;color:var(--text3)">טוען נתונים...</div></div></div>' : '') +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="employee-modal-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="employee-modal-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); currentEmployeeId = null; }
  document.getElementById('employee-modal-close').onclick = close;
  document.getElementById('employee-modal-cancel').onclick = close;

  if (id) {
    Promise.all([
      apiCall('GET', '/api/employees/' + id),
      apiCall('GET', '/api/employees/' + id + '/assignments').catch(function() { return { assignments: [] }; })
    ]).then(function(results) {
      var emp = (results[0] || {}).employee || {};
      var assignments = (results[1] || {}).assignments || [];
      document.getElementById('employee-full-name').value = emp.full_name || '';
      document.getElementById('employee-phone').value = emp.phone || '';
      document.getElementById('employee-email').value = emp.email || '';
      document.getElementById('employee-role').value = emp.role || '';
      document.getElementById('employee-hourly-rate').value = emp.hourly_rate || '';
      document.getElementById('employee-birth-date').value = emp.birth_date || '';
      document.getElementById('employee-emergency-name').value = emp.emergency_contact_name || '';
      document.getElementById('employee-emergency-phone').value = emp.emergency_contact_phone || '';
      document.getElementById('employee-work-area').value = emp.preferred_work_area || '';
      document.getElementById('employee-payment-method').value = emp.payment_method || '';
      document.getElementById('employee-bank-notes').value = emp.bank_details_notes || '';
      document.getElementById('employee-notes').value = emp.notes || '';
      document.getElementById('employee-internal-notes').value = emp.internal_notes || '';
      document.getElementById('employee-is-active').checked = Number(emp.is_active) !== 0;
      renderEmployeeAssignmentsProfile(document.getElementById('employee-assignments-profile'), emp, assignments);
    }).catch(function(e) { toast(e.message, 'error'); close(); });
  }

  document.getElementById('employee-modal-save').onclick = function() {
    var body = {
      full_name: document.getElementById('employee-full-name').value.trim(),
      phone: document.getElementById('employee-phone').value.trim(),
      email: document.getElementById('employee-email').value.trim(),
      role: document.getElementById('employee-role').value.trim(),
      hourly_rate: document.getElementById('employee-hourly-rate').value,
      birth_date: document.getElementById('employee-birth-date').value,
      notes: document.getElementById('employee-notes').value.trim(),
      is_active: document.getElementById('employee-is-active').checked ? 1 : 0,
      emergency_contact_name: document.getElementById('employee-emergency-name').value.trim(),
      emergency_contact_phone: document.getElementById('employee-emergency-phone').value.trim(),
      preferred_work_area: document.getElementById('employee-work-area').value.trim(),
      payment_method: document.getElementById('employee-payment-method').value.trim(),
      bank_details_notes: document.getElementById('employee-bank-notes').value.trim(),
      internal_notes: document.getElementById('employee-internal-notes').value.trim()
    };

    if (!body.full_name) { toast('שם מלא חובה', 'error'); return; }
    if (!body.phone) { toast('טלפון חובה', 'error'); return; }

    apiCall(id ? 'PUT' : 'POST', id ? '/api/employees/' + id : '/api/employees', body).then(function() {
      close();
      toast(id ? 'העובד עודכן' : 'העובד נוסף', 'success');
      loadEmployees();
    }).catch(function(e) { toast(e.message, 'error'); });
  };
}

function deactivateEmployee(id) {
  if (!confirm('להשבית את העובד? ניתן להציג אותו שוב דרך מסנן כל העובדים.')) return;
  apiCall('DELETE', '/api/employees/' + id).then(function() {
    toast('העובד הושבת', 'success');
    loadEmployees();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function buildAssignmentEmployeeOptions(employees, selectedId, assignedIds) {
  selectedId = Number(selectedId || 0);
  assignedIds = assignedIds || [];
  var html = '<option value="">בחר עובד</option>';
  employees.forEach(function(emp) {
    var id = Number(emp.id);
    if (selectedId !== id && assignedIds.indexOf(id) !== -1) return;
    html += '<option value="' + id + '"' + (selectedId === id ? ' selected' : '') + '>' + (emp.full_name || 'ללא שם') + (emp.role ? ' · ' + emp.role : '') + '</option>';
  });
  return html;
}

function renderEmployeeAssignmentsProfile(container, employee, assignments) {
  if (!container) return;
  employee = employee || {};
  assignments = assignments || [];

  var today = new Date().toISOString().split('T')[0];
  var upcoming = [];
  var past = [];
  var totalPlanned = 0;
  var totalActual = 0;
  var totalPayout = 0;

  assignments.forEach(function(a) {
    var planned = Number(a.hours_planned || 0);
    var actual = Number(a.hours_actual || 0);
    var effectiveRate = Number(a.hourly_rate_override || a.employee_hourly_rate || employee.hourly_rate || 0);
    a._effectiveRate = effectiveRate;
    a._calculatedPayout = actual * effectiveRate;
    totalPlanned += planned;
    totalActual += actual;
    totalPayout += a._calculatedPayout;

    if (a.event_date && String(a.event_date).substring(0, 10) < today) past.push(a);
    else upcoming.push(a);
  });

  function section(title, rows, emptyText) {
    var html = '<div class="info-section"><div class="info-section-title">' + title + '</div>';
    if (!rows.length) {
      html += '<div style="font-size:13px;color:var(--text3)">' + emptyText + '</div>';
    } else {
      rows.forEach(function(a) {
        var eventName = a.contact_name || a.customer_name || 'ללא שם';
        html += '<div class="employee-assignment-row">';
        html += '<div class="employee-assignment-title">' + eventName + ' · ' + (a.event_type || 'אירוע') + '</div>';
        html += '<div class="employee-assignment-meta">' + (a.event_date ? formatDate(a.event_date) : 'ללא תאריך') + (a.event_time ? ' · ' + a.event_time : '') + '</div>';
        html += '<div class="employee-assignment-grid">';
        html += '<div class="info-row"><span class="info-label">תפקיד</span><span class="info-value">' + (a.role_on_event || '—') + '</span></div>';
        html += '<div class="info-row"><span class="info-label">שעות מתוכננות</span><span class="info-value">' + (a.hours_planned || 0) + '</span></div>';
        html += '<div class="info-row"><span class="info-label">שעות בפועל</span><span class="info-value">' + (a.hours_actual || 0) + '</span></div>';
        html += '<div class="info-row"><span class="info-label">סטטוס תשלום</span><span class="info-value">' + (a.payment_status || 'pending') + '</span></div>';
        html += '<div class="info-row"><span class="info-label">תעריף בשימוש</span><span class="info-value">₪' + fmtMoney(a._effectiveRate || 0) + '</span></div>';
        html += '<div class="info-row"><span class="info-label">תשלום מחושב</span><span class="info-value">₪' + fmtMoney(a._calculatedPayout || 0) + '</span></div>';
        html += '</div>';
        if (a.notes) html += '<div style="font-size:12px;color:var(--text2);line-height:1.6;white-space:pre-wrap;margin-top:8px">' + a.notes + '</div>';
        html += '</div>';
      });
    }
    html += '</div>';
    return html;
  }

  container.innerHTML =
    '<div class="info-section">' +
      '<div class="info-section-title">סיכום שכר בסיסי</div>' +
      '<div class="employee-profile-summary">' +
        '<div class="employee-summary-card"><div class="employee-summary-value">' + totalPlanned.toFixed(1).replace(/\.0$/, '') + '</div><div class="employee-summary-label">סה"כ שעות מתוכננות</div></div>' +
        '<div class="employee-summary-card"><div class="employee-summary-value">' + totalActual.toFixed(1).replace(/\.0$/, '') + '</div><div class="employee-summary-label">סה"כ שעות בפועל</div></div>' +
        '<div class="employee-summary-card"><div class="employee-summary-value">₪' + fmtMoney(totalPayout) + '</div><div class="employee-summary-label">סה"כ תשלום מחושב</div></div>' +
      '</div>' +
    '</div>' +
    section('אירועים בתאריכים קרובים', upcoming, 'אין אירועים משויכים בתאריכים קרובים') +
    section('אירועים קודמים', past, 'אין אירועים קודמים משויכים');
}

function renderEventAssignments(container, eventId, assignments, employees) {
  if (!container) return;

  assignments = assignments || [];
  employees = employees || [];
  var assignedIds = assignments.map(function(a) { return Number(a.employee_id); });

  var html = '<div class="info-section"><div class="info-section-title">צוות לאירוע</div>';

  if (!assignments.length) {
    html += '<div style="font-size:13px;color:var(--text3);margin-bottom:12px">אין עובדים משויכים עדיין</div>';
  } else {
    assignments.forEach(function(a) {
      html += '<div class="assignment-card" data-assignment-id="' + a.id + '">';
      html += '<div class="assignment-card-header">';
      html += '<div class="assignment-card-title">' + (a.full_name || 'עובד') + '</div>';
      html += '<span class="badge ' + (Number(a.is_active) === 0 ? 'badge-gray' : 'badge-green') + '">' + (Number(a.is_active) === 0 ? 'לא פעיל' : 'פעיל') + '</span>';
      html += '</div>';
      html += '<div class="assignment-grid">';
      html += '<div class="form-group"><label class="form-label">עובד</label><select class="form-input assignment-employee-id">' + buildAssignmentEmployeeOptions(employees, a.employee_id, assignedIds) + '</select></div>';
      html += '<div class="form-group"><label class="form-label">תפקיד באירוע</label><input class="form-input assignment-role" value="' + (a.role_on_event || '') + '"></div>';
      html += '<div class="form-group"><label class="form-label">תעריף שעתי</label><input class="form-input assignment-rate" type="number" step="0.01" value="' + (a.hourly_rate_override || '') + '"></div>';
      html += '<div class="form-group"><label class="form-label">שעות מתוכננות</label><input class="form-input assignment-hours-planned" type="number" step="0.1" value="' + (a.hours_planned || '') + '"></div>';
      html += '<div class="form-group"><label class="form-label">שעות בפועל</label><input class="form-input assignment-hours-actual" type="number" step="0.1" value="' + (a.hours_actual || '') + '"></div>';
      html += '<div class="form-group"><label class="form-label">סטטוס תשלום</label><select class="form-input assignment-payment-status"><option value="pending"' + (String(a.payment_status || 'pending') === 'pending' ? ' selected' : '') + '>ממתין</option><option value="approved"' + (String(a.payment_status || '') === 'approved' ? ' selected' : '') + '>מאושר</option><option value="paid"' + (String(a.payment_status || '') === 'paid' ? ' selected' : '') + '>שולם</option></select></div>';
      html += '</div>';
      html += '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-textarea assignment-notes">' + (a.notes || '') + '</textarea></div>';
      html += '<div class="assignment-actions"><button class="btn btn-primary btn-sm assignment-save-btn" data-id="' + a.id + '">שמור שיוך</button><button class="btn btn-danger btn-sm assignment-remove-btn" data-id="' + a.id + '">הסר מהאירוע</button></div>';
      html += '</div>';
    });
  }

  html += '<div class="assignment-card">';
  html += '<div class="assignment-card-header"><div class="assignment-card-title">הוסף עובד לאירוע</div></div>';
  html += '<div class="assignment-grid">';
  html += '<div class="form-group"><label class="form-label">עובד</label><select class="form-input" id="new-assignment-employee">' + buildAssignmentEmployeeOptions(employees, null, assignedIds) + '</select></div>';
  html += '<div class="form-group"><label class="form-label">תפקיד באירוע</label><input class="form-input" id="new-assignment-role"></div>';
  html += '<div class="form-group"><label class="form-label">תעריף שעתי</label><input class="form-input" id="new-assignment-rate" type="number" step="0.01"></div>';
  html += '<div class="form-group"><label class="form-label">שעות מתוכננות</label><input class="form-input" id="new-assignment-hours-planned" type="number" step="0.1"></div>';
  html += '<div class="form-group"><label class="form-label">שעות בפועל</label><input class="form-input" id="new-assignment-hours-actual" type="number" step="0.1"></div>';
  html += '<div class="form-group"><label class="form-label">סטטוס תשלום</label><select class="form-input" id="new-assignment-payment-status"><option value="pending">ממתין</option><option value="approved">מאושר</option><option value="paid">שולם</option></select></div>';
  html += '</div>';
  html += '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-textarea" id="new-assignment-notes"></textarea></div>';
  html += '<div class="assignment-actions"><button class="btn btn-primary btn-sm" id="add-assignment-btn">הוסף עובד</button></div>';
  html += '</div>';
  html += '</div>';

  container.innerHTML = html;

  var addBtn = document.getElementById('add-assignment-btn');
  if (addBtn) {
    addBtn.onclick = function() {
      apiCall('POST', '/api/leads/' + eventId + '/employees', {
        employee_id: Number(document.getElementById('new-assignment-employee').value || 0),
        role_on_event: document.getElementById('new-assignment-role').value.trim(),
        hourly_rate_override: document.getElementById('new-assignment-rate').value,
        hours_planned: document.getElementById('new-assignment-hours-planned').value,
        hours_actual: document.getElementById('new-assignment-hours-actual').value,
        payment_status: document.getElementById('new-assignment-payment-status').value,
        notes: document.getElementById('new-assignment-notes').value.trim()
      }).then(function() {
        toast('העובד שויך לאירוע', 'success');
        openEventDetailsModal(eventId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };
  }

  container.querySelectorAll('.assignment-save-btn').forEach(function(btn) {
    btn.onclick = function() {
      var card = this.closest('.assignment-card');
      var assignmentId = this.getAttribute('data-id');
      apiCall('PUT', '/api/lead-employees/' + assignmentId, {
        employee_id: Number(card.querySelector('.assignment-employee-id').value || 0),
        role_on_event: card.querySelector('.assignment-role').value.trim(),
        hourly_rate_override: card.querySelector('.assignment-rate').value,
        hours_planned: card.querySelector('.assignment-hours-planned').value,
        hours_actual: card.querySelector('.assignment-hours-actual').value,
        payment_status: card.querySelector('.assignment-payment-status').value,
        notes: card.querySelector('.assignment-notes').value.trim()
      }).then(function() {
        toast('שיוך העובד עודכן', 'success');
        openEventDetailsModal(eventId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };
  });

  container.querySelectorAll('.assignment-remove-btn').forEach(function(btn) {
    btn.onclick = function() {
      var assignmentId = this.getAttribute('data-id');
      if (!confirm('להסיר את העובד מהאירוע?')) return;
      apiCall('DELETE', '/api/lead-employees/' + assignmentId).then(function() {
        toast('העובד הוסר מהאירוע', 'success');
        openEventDetailsModal(eventId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };
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


function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getAllocationStatusLabel(status) {
  var labels = { draft: 'תכנון', reserved: 'שמור', cancelled: 'בוטל' };
  return labels[status] || status || '—';
}

function getInventoryActionTypeLabel(actionType) {
  var labels = { usage: 'שימוש', return: 'החזרה', damage: 'נזק', loss: 'אובדן' };
  return labels[actionType] || actionType || '—';
}

function getInventoryActionTypeBadge(actionType) {
  var badgeClass = {
    usage: 'badge-blue',
    return: 'badge-green',
    damage: 'badge-orange',
    loss: 'badge-red'
  }[actionType] || 'badge-gray';
  return '<span class="badge ' + badgeClass + '">' + escapeHtml(getInventoryActionTypeLabel(actionType)) + '</span>';
}

function parseAllocationPreviewNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  var num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function getAllocationFormPreview(formState, currentAllocation) {
  var planned = parseAllocationPreviewNumber(formState && formState.planned_quantity);
  var reserved = parseAllocationPreviewNumber(formState && formState.reserved_quantity);
  var currentStock = currentAllocation ? Number(currentAllocation.current_stock || 0) : null;
  var reservedElsewhere = currentAllocation ? Number(currentAllocation.reserved_elsewhere || 0) : null;
  var availableStock = currentAllocation ? Number(currentAllocation.available_stock || 0) : null;
  var warnings = [];

  if (availableStock !== null && planned > availableStock) {
    warnings.push({
      tone: 'warning',
      text: 'הכמות המתוכננת גבוהה מהמלאי הזמין כרגע. זה מותר לצורך תכנון בלבד, אבל לא מבצע שמירה אמיתית במלאי.'
    });
  }
  if (availableStock !== null && reserved > availableStock) {
    warnings.push({
      tone: 'danger',
      text: 'הכמות השמורה גבוהה מהמלאי הזמין כרגע. השרת יחסום שמירה כזו.'
    });
  }

  return {
    planned: planned,
    reserved: reserved,
    currentStock: currentStock,
    reservedElsewhere: reservedElsewhere,
    availableStock: availableStock,
    warnings: warnings
  };
}

function getEventReadinessStatus(summary) {
  if (!summary || !summary.hasPlanning) return { label: 'ללא תכנון', badgeClass: 'badge-gray' };
  if (summary.shortageCount > 0) return { label: 'חסר מלאי', badgeClass: 'badge-red' };
  if (summary.reservedCount <= 0 && summary.usedQuantity <= 0) return { label: 'דורש טיפול', badgeClass: 'badge-orange' };
  return { label: 'מוכן', badgeClass: 'badge-green' };
}

function buildEventReadinessSummary(inventoryData, actionsData) {
  var allAllocations = (inventoryData && inventoryData.allocations) || [];
  var allocations = allAllocations.filter(function(item) { return item.status !== 'cancelled'; });
  var actions = (actionsData && actionsData.actions) || [];
  var totalPlannedQuantity = allocations.reduce(function(sum, item) { return sum + Number(item.planned_quantity || 0); }, 0);
  var totalReservedQuantity = allocations.reduce(function(sum, item) { return sum + Number(item.reserved_quantity || 0); }, 0);
  var totalUsedQuantity = actions.filter(function(action) { return action.action_type === 'usage'; }).reduce(function(sum, action) { return sum + Number(action.quantity || 0); }, 0);
  var shortageItems = allocations.filter(function(item) { return Number(item.shortage_amount || 0) > 0; });

  return {
    allocationCount: allocations.length,
    shortageCount: shortageItems.length,
    totalPlannedQuantity: totalPlannedQuantity,
    totalReservedQuantity: totalReservedQuantity,
    totalUsedQuantity: totalUsedQuantity,
    shortageItems: shortageItems,
    usageActions: actions.filter(function(action) { return action.action_type === 'usage'; }),
    hasPlanning: allocations.length > 0
  };
}

function renderEventOperationalReadinessSection(inventoryData, actionsData) {
  var summary = buildEventReadinessSummary(inventoryData, actionsData);
  var readiness = getEventReadinessStatus(summary);
  var cards = [
    { label: 'מספר הקצאות', value: summary.allocationCount },
    { label: 'חוסרים', value: summary.shortageCount },
    { label: 'סה"כ מתוכנן', value: formatProductStockValue(summary.totalPlannedQuantity) },
    { label: 'סה"כ שמור', value: formatProductStockValue(summary.totalReservedQuantity) },
    { label: 'סה"כ בשימוש', value: formatProductStockValue(summary.totalUsedQuantity) }
  ];

  if (!summary.hasPlanning) {
    return '<div class="info-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="info-section-title">מוכנות תפעולית</div><span class="badge ' + readiness.badgeClass + '">' + readiness.label + '</span></div><div style="font-size:13px;color:var(--text3);padding:8px 0">אין עדיין תכנון מלאי לאירוע הזה, לכן עדיין אי אפשר להעריך מוכנות תפעולית על בסיס מלאי.</div></div>';
  }

  var shortageListHtml = summary.shortageItems.length
    ? '<div style="margin-top:10px"><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px">חוסרים פתוחים</div>' + summary.shortageItems.map(function(item) {
        return '<div style="font-size:12px;color:var(--text2);padding:6px 0;border-top:1px solid var(--border)">' +
          '<strong>' + escapeHtml(item.product_name || ('מוצר #' + item.product_id)) + '</strong>' +
          ' · חוסר ' + escapeHtml(formatProductStockValue(item.shortage_amount)) +
          ' · זמין ' + escapeHtml(formatProductStockValue(item.available_stock)) +
          ' · שמור ' + escapeHtml(formatProductStockValue(item.reserved_quantity)) +
        '</div>';
      }).join('') + '</div>'
    : '<div style="margin-top:10px;font-size:12px;color:var(--text3)">אין כרגע חוסרי מלאי פתוחים לפי התכנון הקיים.</div>';

  var usageListHtml = summary.usageActions.length
    ? '<div style="margin-top:10px"><div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px">שימושים שנרשמו בפועל</div>' + summary.usageActions.slice(0, 5).map(function(action) {
        return '<div style="font-size:12px;color:var(--text2);padding:6px 0;border-top:1px solid var(--border)">' +
          '<strong>' + escapeHtml(action.product_name || ('מוצר #' + action.product_id)) + '</strong>' +
          ' · כמות ' + escapeHtml(formatProductStockValue(action.quantity)) +
          ' · ' + escapeHtml(formatProductReportDate(action.performed_at)) +
        '</div>';
      }).join('') + '</div>'
    : '<div style="margin-top:10px;font-size:12px;color:var(--text3)">אין עדיין שימושים שנרשמו בפועל לאירוע הזה.</div>';

  return '<div class="info-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="info-section-title">מוכנות תפעולית</div><span class="badge ' + readiness.badgeClass + '">' + readiness.label + '</span></div><div style="font-size:12px;color:var(--text3);margin-bottom:10px">סיכום קריאה בלבד על בסיס תכנון המלאי, החוסרים והשימושים שנרשמו בפועל.</div><div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px">' + cards.map(function(card) {
    return '<div style="border:1px solid var(--border);border-radius:10px;background:#fafbfc;padding:8px 10px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px">' + escapeHtml(card.label) + '</div><div style="font-weight:700;color:var(--text)">' + escapeHtml(String(card.value)) + '</div></div>';
  }).join('') + '</div>' + shortageListHtml + usageListHtml + '</div>';
}

function renderEventInventoryActionsSection(actionsData, inventoryData, productOptions, formState) {
  var actions = (actionsData && actionsData.actions) || [];
  var allocations = (inventoryData && inventoryData.allocations) || [];
  var products = Array.isArray(productOptions) ? productOptions : [];
  var matchingAllocation = null;
  var formHtml = '';

  if (formState) {
    matchingAllocation = allocations.find(function(item) {
      if (formState.allocation_id) return Number(item.id) === Number(formState.allocation_id);
      if (formState.product_id) return Number(item.product_id) === Number(formState.product_id);
      return false;
    }) || null;

    var productOptionsHtml = ['<option value="">בחר מוצר</option>'].concat(products.map(function(product) {
      var selected = Number(formState.product_id) === Number(product.id) ? ' selected' : '';
      var activeLabel = Number(product.is_active) === 0 ? ' (לא פעיל)' : '';
      return '<option value="' + product.id + '"' + selected + '>' + escapeHtml(product.name || ('מוצר #' + product.id)) + activeLabel + '</option>';
    })).join('');

    var allocationOptions = allocations.filter(function(item) {
      if (item.status === 'cancelled') return false;
      if (!formState.product_id) return true;
      return Number(item.product_id) === Number(formState.product_id);
    });

    var allocationOptionsHtml = ['<option value="">ללא הקצאה</option>'].concat(allocationOptions.map(function(item) {
      var selected = Number(formState.allocation_id) === Number(item.id) ? ' selected' : '';
      return '<option value="' + item.id + '"' + selected + '>#' + item.id + ' · ' + escapeHtml(item.product_name || ('מוצר #' + item.product_id)) + ' · שמור ' + escapeHtml(formatProductStockValue(item.reserved_quantity)) + '</option>';
    })).join('');

    formHtml =
      '<div style="border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px;background:#f8fafc">' +
        '<div style="font-weight:700;margin-bottom:10px">רישום שימוש בפועל</div>' +
        '<div style="margin-bottom:10px;padding:8px 10px;border-radius:8px;background:#fef2f2;color:#b91c1c;font-size:12px">פעולה זו מורידה מלאי אמיתי</div>' +
        (formState.error ? '<div style="margin-bottom:10px;padding:8px 10px;border-radius:8px;background:#fef2f2;color:#b91c1c;font-size:12px">' + escapeHtml(formState.error) + '</div>' : '') +
        '<div style="display:grid;grid-template-columns:1.2fr 0.8fr 1fr;gap:8px;margin-bottom:8px">' +
          '<select class="form-input" id="event-usage-product">' + productOptionsHtml + '</select>' +
          '<input class="form-input" id="event-usage-quantity" type="number" min="0.01" step="0.01" placeholder="כמות בשימוש" value="' + escapeHtml(formState.quantity) + '">' +
          '<select class="form-input" id="event-usage-allocation">' + allocationOptionsHtml + '</select>' +
        '</div>' +
        '<textarea class="form-input" id="event-usage-note" rows="2" placeholder="הערה...">' + escapeHtml(formState.note) + '</textarea>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--text3);margin-top:8px">' +
          '<span>הקצאה מקושרת: ' + (matchingAllocation ? ('#' + matchingAllocation.id) : 'ללא') + '</span>' +
          '<span>מלאי נוכחי: ' + (matchingAllocation ? formatProductStockValue(matchingAllocation.current_stock) : '—') + '</span>' +
          '<span>מלאי זמין בתכנון: ' + (matchingAllocation ? formatProductStockValue(matchingAllocation.available_stock) : '—') + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">' +
          '<button class="btn btn-secondary btn-sm" id="event-usage-form-reset">נקה</button>' +
          '<button class="btn btn-primary btn-sm" id="event-usage-form-save">רשום שימוש</button>' +
        '</div>' +
      '</div>';
  }

  var rows = actions.map(function(action) {
    var stockMovementText = action.stock_movement && action.stock_movement.exists
      ? 'תנועת מלאי #' + action.stock_movement.id + ' (' + (action.stock_movement.movement_type || '—') + ', ' + (Number(action.stock_movement.quantity_change) > 0 ? '+' : '') + formatProductStockValue(action.stock_movement.quantity_change) + ')'
      : 'עדיין אין תנועת מלאי מקושרת';

    return '<div style="border-right:3px solid var(--border);padding:0 12px 14px 0;margin:0 0 14px 0">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px">' +
        '<div><div style="font-weight:700;color:var(--text)">' + escapeHtml(action.product_name || ('מוצר #' + action.product_id)) + '</div><div style="font-size:12px;color:var(--text3)">' + escapeHtml(action.product_category || 'ללא קטגוריה') + (action.product_sku ? ' | SKU: ' + escapeHtml(action.product_sku) : '') + '</div></div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + getInventoryActionTypeBadge(action.action_type) + '<span class="badge badge-gray">כמות ' + escapeHtml(formatProductStockValue(action.quantity)) + '</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--text3);margin-bottom:6px">' +
        '<span>בוצע: ' + formatProductReportDate(action.performed_at) + '</span>' +
        '<span>נרשם: ' + formatProductReportDate(action.created_at) + '</span>' +
        '<span>הקצאה: ' + (action.allocation_id ? ('#' + action.allocation_id) : 'ללא') + '</span>' +
        '<span>' + escapeHtml(stockMovementText) + '</span>' +
      '</div>' +
      (action.note ? '<div style="font-size:12px;color:var(--text2);white-space:pre-wrap"><strong>הערה:</strong> ' + escapeHtml(action.note) + '</div>' : '') +
    '</div>';
  }).join('');

  return '<div class="info-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="info-section-title">פעילות מלאי בפועל</div><button class="btn btn-secondary btn-sm" id="event-usage-add-btn">רישום שימוש</button></div><div style="font-size:12px;color:var(--text3);margin-bottom:10px">פעולות מלאי אמיתיות נרשמות כאן בנפרד מתכנון ההקצאות. אין עריכה או מחיקה לפעולות שכבר נרשמו.</div>' + formHtml + (rows || '<div style="font-size:13px;color:var(--text3);padding:8px 0">אין עדיין פעולות מלאי בפועל לאירוע הזה.</div>') + '</div>';
}

function renderEventInventoryPlanningSection(inventoryData, productOptions, formState) {
  var allocations = (inventoryData && inventoryData.allocations) || [];
  var allProducts = Array.isArray(productOptions) ? productOptions : [];
  var currentAllocation = null;
  var formHtml = '';

  if (formState && formState.allocationId) {
    currentAllocation = allocations.find(function(item) { return Number(item.id) === Number(formState.allocationId); }) || null;
  }

  if (formState) {
    var isEdit = formState.mode === 'edit';
    var selectableProducts = allProducts.filter(function(product) {
      if (isEdit && currentAllocation && Number(product.id) === Number(currentAllocation.product_id)) return true;
      return Number(product.is_active) === 1;
    });
    var preview = getAllocationFormPreview(formState, currentAllocation);
    var contextCards = [
      { label: 'מלאי נוכחי', value: preview.currentStock === null ? '—' : formatProductStockValue(preview.currentStock) },
      { label: 'שמור באירועים אחרים', value: preview.reservedElsewhere === null ? '—' : formatProductStockValue(preview.reservedElsewhere) },
      { label: 'זמין כרגע', value: preview.availableStock === null ? '—' : formatProductStockValue(preview.availableStock) },
      { label: 'מתוכנן', value: formatProductStockValue(preview.planned) },
      { label: 'שמור', value: formatProductStockValue(preview.reserved) }
    ];

    var productOptionsHtml = ['<option value="">בחר מוצר</option>'].concat(selectableProducts.map(function(product) {
      var selected = Number(formState.product_id) === Number(product.id) ? ' selected' : '';
      var activeLabel = Number(product.is_active) === 0 ? ' (לא פעיל)' : '';
      return '<option value="' + product.id + '"' + selected + '>' + escapeHtml(product.name || ('מוצר #' + product.id)) + activeLabel + '</option>';
    })).join('');

    var warningsHtml = preview.warnings.map(function(warning) {
      var colors = warning.tone === 'danger'
        ? 'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;'
        : 'background:#fff7ed;color:#c2410c;border:1px solid #fdba74;';
      return '<div style="margin-bottom:8px;padding:8px 10px;border-radius:8px;font-size:12px;' + colors + '">' + escapeHtml(warning.text) + '</div>';
    }).join('');

    formHtml =
      '<div style="border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:12px;background:#f8fafc">' +
        '<div style="font-weight:700;margin-bottom:10px">' + (isEdit ? 'עריכת הקצאה' : 'הוספת מוצר לתכנון') + '</div>' +
        (formState.error ? '<div style="margin-bottom:10px;padding:8px 10px;border-radius:8px;background:#fef2f2;color:#b91c1c;font-size:12px">' + escapeHtml(formState.error) + '</div>' : '') +
        warningsHtml +
        '<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:8px;margin-bottom:8px">' +
          '<select class="form-input" id="event-allocation-product">' + productOptionsHtml + '</select>' +
          '<input class="form-input" id="event-allocation-planned" type="number" min="0" step="0.01" placeholder="כמות מתוכננת" value="' + escapeHtml(formState.planned_quantity) + '">' +
          '<input class="form-input" id="event-allocation-reserved" type="number" min="0" step="0.01" placeholder="כמות שמורה" value="' + escapeHtml(formState.reserved_quantity) + '">' +
          '<select class="form-input" id="event-allocation-status">' +
            '<option value="draft"' + (formState.status === 'draft' ? ' selected' : '') + '>תכנון</option>' +
            '<option value="reserved"' + (formState.status === 'reserved' ? ' selected' : '') + '>שמור</option>' +
            '<option value="cancelled"' + (formState.status === 'cancelled' ? ' selected' : '') + '>בוטל</option>' +
          '</select>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-bottom:8px">' + contextCards.map(function(card) {
          return '<div style="border:1px solid var(--border);border-radius:10px;background:white;padding:8px 10px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px">' + escapeHtml(card.label) + '</div><div style="font-weight:700;color:var(--text)">' + escapeHtml(card.value) + '</div></div>';
        }).join('') + '</div>' +
        '<textarea class="form-input" id="event-allocation-note" rows="2" placeholder="הערה...">' + escapeHtml(formState.note) + '</textarea>' +
        '<div style="margin-top:8px;font-size:12px;color:var(--text3)">תכנון הקצאה לא משנה את המלאי האמיתי. השרת עדיין בודק כל שמירה בפועל.</div>' +
        (preview.availableStock === null ? '<div style="margin-top:6px;font-size:12px;color:var(--text3)">במסך יצירה הנתונים המלאים על מלאי זמין יוצגו במדויק אחרי שמירה או בעריכת הקצאה קיימת.</div>' : '') +
        '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">' +
          '<button class="btn btn-secondary btn-sm" id="event-allocation-form-cancel">ביטול</button>' +
          '<button class="btn btn-primary btn-sm" id="event-allocation-form-save">שמור</button>' +
        '</div>' +
      '</div>';
  }

  var rows = allocations.map(function(item) {
    var stockBadge = item.is_short ? '<span class="badge badge-red">חסר מלאי</span>' : '<span class="badge badge-green">מספיק מלאי</span>';
    return '<div style="border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px;background:#fafbfc">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:8px">' +
        '<div><div style="font-weight:700;color:var(--text)">' + escapeHtml(item.product_name || ('מוצר #' + item.product_id)) + '</div><div style="font-size:12px;color:var(--text3)">' + escapeHtml(item.product_category || 'ללא קטגוריה') + (item.product_sku ? ' | SKU: ' + escapeHtml(item.product_sku) : '') + (item.product_unit ? ' | יחידה: ' + escapeHtml(item.product_unit) : '') + '</div></div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + stockBadge + '<span class="badge badge-purple">' + escapeHtml(getAllocationStatusLabel(item.status)) + '</span></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:8px">' +
        '<div style="font-size:12px;color:var(--text2)"><strong>מתוכנן:</strong> ' + formatProductStockValue(item.planned_quantity) + '</div>' +
        '<div style="font-size:12px;color:var(--text2)"><strong>שמור:</strong> ' + formatProductStockValue(item.reserved_quantity) + '</div>' +
        '<div style="font-size:12px;color:var(--text2)"><strong>מלאי נוכחי:</strong> ' + formatProductStockValue(item.current_stock) + '</div>' +
        '<div style="font-size:12px;color:var(--text2)"><strong>שמור באירועים אחרים:</strong> ' + formatProductStockValue(item.reserved_elsewhere) + '</div>' +
        '<div style="font-size:12px;color:var(--text2)"><strong>מלאי זמין:</strong> ' + formatProductStockValue(item.available_stock) + '</div>' +
        '<div style="font-size:12px;color:var(--text2)"><strong>חוסר:</strong> ' + formatProductStockValue(item.shortage_amount) + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--text3)">' +
        '<span>רכישה אחרונה: ' + formatProductReportDate(item.latest_purchase_date) + '</span>' +
        '<span>תנועת מלאי אחרונה: ' + formatProductReportDate(item.latest_stock_movement_date) + '</span>' +
        '<span>רכישות לא נקלטו: ' + (item.has_unreceived_purchases ? 'כן' : 'לא') + '</span>' +
        '<span>מוצר ' + (Number(item.product_is_active) === 0 ? 'מושבת' : 'פעיל') + '</span>' +
      '</div>' +
      (item.note ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);white-space:pre-wrap"><strong>הערה:</strong> ' + escapeHtml(item.note) + '</div>' : '') +
      '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">' +
        '<button class="btn btn-secondary btn-sm event-allocation-edit-btn" data-allocation-id="' + item.id + '">עריכה</button>' +
        (item.status === 'cancelled' ? '' : '<button class="btn btn-ghost btn-sm event-allocation-cancel-btn" data-allocation-id="' + item.id + '">ביטול הקצאה</button>') +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="info-section"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="info-section-title">תכנון מלאי לאירוע</div><button class="btn btn-secondary btn-sm" id="event-allocation-add-btn">הוסף מוצר לתכנון</button></div><div style="font-size:12px;color:var(--text3);margin-bottom:10px">תכנון ושמירה ידניים בלבד, בלי לבצע שינוי במלאי האמיתי או לכתוב תנועת מלאי.</div>' + formHtml + (rows || '<div style="font-size:13px;color:var(--text3);padding:10px 0">אין עדיין תכנון מלאי לאירוע הזה. אפשר להוסיף מוצר לתכנון בלי לשנות את המלאי בפועל.</div>') + '</div>';
}

function openEventDetailsModal(id) {
  Promise.all([
    apiCall('GET', '/api/leads/' + id),
    apiCall('GET', '/api/leads/' + id + '/employees').catch(function() { return { assignments: [] }; }),
    apiCall('GET', '/api/employees').catch(function() { return { employees: [] }; }),
    apiCall('GET', '/api/leads/' + id + '/inventory').catch(function() { return { allocations: [] }; }),
    apiCall('GET', '/api/leads/' + id + '/inventory-actions').catch(function() { return { actions: [] }; }),
    apiCall('GET', '/api/products?includeInactive=1').catch(function() { return { products: [] }; })
  ]).then(function(results) {
    var data = results[0] || {};
    var assignmentsData = results[1] || { assignments: [] };
    var employeesData = results[2] || { employees: [] };
    var inventoryData = results[3] || { allocations: [] };
    var inventoryActionsData = results[4] || { actions: [] };
    var productsData = results[5] || { products: [] };
    var l = data.lead || {};
    var assignments = assignmentsData.assignments || [];
    var employees = employeesData.employees || [];
    var inventoryProducts = productsData.products || [];
    var currentInventoryData = inventoryData;
    var currentInventoryActionsData = inventoryActionsData;
    var old = document.getElementById('event-details-modal');
    if (old) old.remove();

    var drawerSyncBtn = document.getElementById('drawer-sync-btn');
    var showGoogleSyncBtn = !!(drawerSyncBtn && drawerSyncBtn.style.display !== 'none');

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
          '<div class="info-row"><span class="info-label">אולם</span><span class="info-value">' + (l.venue || '—') + ((l.venue && String(l.venue).trim()) ? ' <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer" href="https://waze.com/ul?q=' + encodeURIComponent(l.venue) + '&navigate=yes">נווט ב-Waze</a>' : '') + '</span></div>' +
          '<div class="info-row"><span class="info-label">סטטוס</span><span class="info-value">' + statusBadge(l.status) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">כספים</div>' +
          '<div class="info-row"><span class="info-label">מחיר</span><span class="info-value">₪' + fmtMoney(l.price || 0) + '</span></div>' +
          '<div class="info-row"><span class="info-label">מקדמה</span><span class="info-value">₪' + fmtMoney(l.deposit || 0) + '</span></div>' +
          '</div>' +
          '<div class="info-section"><div class="info-section-title">הערות</div>' +
          '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (l.details || l.notes || 'אין הערות') + '</div>' +
          '</div>' +
          '<div id="event-readiness-section"></div>' +
          '<div id="event-inventory-section"></div>' +
          '<div id="event-inventory-actions-section"></div>' +
          '<div id="event-assignments-section"></div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" id="event-details-cancel">סגור</button>' +
          (showGoogleSyncBtn ? '<button class="btn btn-secondary" id="event-details-sync-google">סנכרן ליומן Google</button>' : '') +
          '<button class="btn btn-primary" id="event-details-edit">✏️ עריכת אירוע</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    renderEventAssignments(document.getElementById('event-assignments-section'), id, assignments, employees);

    var readinessSectionEl = document.getElementById('event-readiness-section');
    var inventorySectionEl = document.getElementById('event-inventory-section');
    var inventoryActionsSectionEl = document.getElementById('event-inventory-actions-section');

    function buildAllocationFormState(allocation, extra) {
      extra = extra || {};
      return {
        mode: extra.mode || (allocation ? 'edit' : 'create'),
        allocationId: allocation ? allocation.id : null,
        product_id: extra.product_id !== undefined ? extra.product_id : (allocation ? allocation.product_id : ''),
        planned_quantity: extra.planned_quantity !== undefined ? extra.planned_quantity : (allocation ? String(allocation.planned_quantity) : ''),
        reserved_quantity: extra.reserved_quantity !== undefined ? extra.reserved_quantity : (allocation ? String(allocation.reserved_quantity) : ''),
        status: extra.status !== undefined ? extra.status : (allocation ? allocation.status : 'draft'),
        note: extra.note !== undefined ? extra.note : (allocation ? (allocation.note || '') : ''),
        error: extra.error || ''
      };
    }

    function buildUsageActionFormState(extra) {
      extra = extra || {};
      return {
        product_id: extra.product_id !== undefined ? extra.product_id : '',
        quantity: extra.quantity !== undefined ? extra.quantity : '',
        allocation_id: extra.allocation_id !== undefined ? extra.allocation_id : '',
        note: extra.note !== undefined ? extra.note : '',
        error: extra.error || ''
      };
    }

    function bindInventorySectionActions() {
      var addBtn = document.getElementById('event-allocation-add-btn');
      if (addBtn) {
        addBtn.onclick = function() {
          renderInventorySection(buildAllocationFormState(null, { mode: 'create' }));
        };
      }

      var formCancelBtn = document.getElementById('event-allocation-form-cancel');
      if (formCancelBtn) {
        formCancelBtn.onclick = function() {
          renderInventorySection(null);
        };
      }

      function rerenderAllocationFormPreview() {
        var formSaveEl = document.getElementById('event-allocation-form-save');
        if (!formSaveEl) return;
        var liveMode = formSaveEl.getAttribute('data-mode') || 'create';
        var liveAllocationId = formSaveEl.getAttribute('data-allocation-id') || '';
        var baseAllocation = liveMode === 'edit'
          ? currentInventoryData.allocations.find(function(item) { return String(item.id) === String(liveAllocationId); })
          : null;
        renderInventorySection(buildAllocationFormState(baseAllocation, {
          mode: liveMode,
          allocationId: liveAllocationId,
          product_id: document.getElementById('event-allocation-product') ? document.getElementById('event-allocation-product').value : '',
          planned_quantity: document.getElementById('event-allocation-planned') ? document.getElementById('event-allocation-planned').value : '',
          reserved_quantity: document.getElementById('event-allocation-reserved') ? document.getElementById('event-allocation-reserved').value : '',
          status: document.getElementById('event-allocation-status') ? document.getElementById('event-allocation-status').value : 'draft',
          note: document.getElementById('event-allocation-note') ? document.getElementById('event-allocation-note').value : ''
        }));
      }

      ['event-allocation-product', 'event-allocation-planned', 'event-allocation-reserved', 'event-allocation-status'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.onchange = rerenderAllocationFormPreview;
      });

      ['event-allocation-planned', 'event-allocation-reserved'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.oninput = rerenderAllocationFormPreview;
      });

      var formSaveBtn = document.getElementById('event-allocation-form-save');
      if (formSaveBtn) {
        formSaveBtn.onclick = function() {
          var formState = {
            mode: formSaveBtn.getAttribute('data-mode') || 'create',
            allocationId: formSaveBtn.getAttribute('data-allocation-id') || '',
            product_id: document.getElementById('event-allocation-product').value,
            planned_quantity: document.getElementById('event-allocation-planned').value,
            reserved_quantity: document.getElementById('event-allocation-reserved').value,
            status: document.getElementById('event-allocation-status').value,
            note: document.getElementById('event-allocation-note').value
          };

          var payload = {
            product_id: formState.product_id,
            planned_quantity: formState.planned_quantity,
            reserved_quantity: formState.reserved_quantity,
            status: formState.status,
            note: formState.note
          };
          var isEdit = formState.mode === 'edit' && formState.allocationId;
          var requestPath = isEdit ? '/api/leads/' + id + '/inventory/' + formState.allocationId : '/api/leads/' + id + '/inventory';
          var requestMethod = isEdit ? 'PUT' : 'POST';

          apiCall(requestMethod, requestPath, payload).then(function() {
            toast(isEdit ? 'הקצאה עודכנה' : 'הקצאה נוספה', 'success');
            refreshInventorySection();
          }).catch(function(e) {
            renderInventorySection(buildAllocationFormState(isEdit ? currentInventoryData.allocations.find(function(item) { return String(item.id) === String(formState.allocationId); }) : null, {
              mode: isEdit ? 'edit' : 'create',
              allocationId: formState.allocationId,
              product_id: formState.product_id,
              planned_quantity: formState.planned_quantity,
              reserved_quantity: formState.reserved_quantity,
              status: formState.status,
              note: formState.note,
              error: e.message
            }));
          });
        };
      }

      document.querySelectorAll('.event-allocation-edit-btn').forEach(function(btn) {
        btn.onclick = function() {
          var allocationId = Number(btn.getAttribute('data-allocation-id'));
          var allocation = currentInventoryData.allocations.find(function(item) { return Number(item.id) === allocationId; });
          if (!allocation) return;
          renderInventorySection(buildAllocationFormState(allocation, { mode: 'edit' }));
        };
      });

      document.querySelectorAll('.event-allocation-cancel-btn').forEach(function(btn) {
        btn.onclick = function() {
          var allocationId = btn.getAttribute('data-allocation-id');
          if (!confirm('לבטל את ההקצאה הזו?')) return;
          apiCall('POST', '/api/leads/' + id + '/inventory/' + allocationId + '/cancel').then(function() {
            toast('ההקצאה בוטלה', 'success');
            refreshInventorySection();
          }).catch(function(e) {
            toast(e.message, 'error');
          });
        };
      });

      var saveBtnEl = document.getElementById('event-allocation-form-save');
      if (saveBtnEl && inventorySectionEl) {
        var modeHolder = inventorySectionEl.getAttribute('data-form-mode') || '';
        var allocationIdHolder = inventorySectionEl.getAttribute('data-form-allocation-id') || '';
        saveBtnEl.setAttribute('data-mode', modeHolder);
        saveBtnEl.setAttribute('data-allocation-id', allocationIdHolder);
      }
    }

    function renderReadinessSection() {
      if (!readinessSectionEl) return;
      readinessSectionEl.innerHTML = renderEventOperationalReadinessSection(currentInventoryData, currentInventoryActionsData);
    }

    function renderInventorySection(formState) {
      inventorySectionEl.innerHTML = renderEventInventoryPlanningSection(currentInventoryData, inventoryProducts, formState);
      inventorySectionEl.setAttribute('data-form-mode', formState ? formState.mode : '');
      inventorySectionEl.setAttribute('data-form-allocation-id', formState && formState.allocationId ? formState.allocationId : '');
      bindInventorySectionActions();
      renderReadinessSection();
    }

    function refreshInventorySection(formState) {
      return apiCall('GET', '/api/leads/' + id + '/inventory').then(function(data) {
        currentInventoryData = data || { allocations: [] };
        renderInventorySection(formState || null);
      }).catch(function(e) {
        toast(e.message, 'error');
      });
    }

    function bindInventoryActionsSection(formState) {
      var addBtn = document.getElementById('event-usage-add-btn');
      if (addBtn) {
        addBtn.onclick = function() {
          renderInventoryActionsSection(buildUsageActionFormState());
        };
      }

      var resetBtn = document.getElementById('event-usage-form-reset');
      if (resetBtn) {
        resetBtn.onclick = function() {
          renderInventoryActionsSection(buildUsageActionFormState());
        };
      }

      var productSelect = document.getElementById('event-usage-product');
      if (productSelect) {
        productSelect.onchange = function() {
          var matchingAllocation = currentInventoryData.allocations.find(function(item) {
            return Number(item.product_id) === Number(productSelect.value) && item.status !== 'cancelled';
          });
          renderInventoryActionsSection(buildUsageActionFormState({
            product_id: productSelect.value,
            quantity: document.getElementById('event-usage-quantity') ? document.getElementById('event-usage-quantity').value : '',
            allocation_id: document.getElementById('event-usage-allocation') ? document.getElementById('event-usage-allocation').value : (matchingAllocation ? String(matchingAllocation.id) : ''),
            note: document.getElementById('event-usage-note') ? document.getElementById('event-usage-note').value : ''
          }));
        };
      }

      var saveBtn = document.getElementById('event-usage-form-save');
      if (saveBtn) {
        saveBtn.onclick = function() {
          if (saveBtn.disabled) return;
          var formState = {
            product_id: document.getElementById('event-usage-product').value,
            quantity: document.getElementById('event-usage-quantity').value,
            allocation_id: document.getElementById('event-usage-allocation').value,
            note: document.getElementById('event-usage-note').value
          };
          var payload = {
            product_id: formState.product_id,
            quantity: formState.quantity,
            allocation_id: formState.allocation_id || null,
            note: formState.note
          };

          saveBtn.disabled = true;
          apiCall('POST', '/api/leads/' + id + '/inventory-actions', payload).then(function(response) {
            toast(response && response.already_processed ? 'השימוש כבר נרשם קודם' : 'השימוש נרשם', 'success');
            return Promise.all([
              apiCall('GET', '/api/leads/' + id + '/inventory-actions'),
              apiCall('GET', '/api/leads/' + id + '/inventory')
            ]);
          }).then(function(results) {
            currentInventoryActionsData = results[0] || { actions: [] };
            currentInventoryData = results[1] || { allocations: [] };
            renderInventorySection(null);
            renderInventoryActionsSection(buildUsageActionFormState());
          }).catch(function(e) {
            renderInventoryActionsSection(buildUsageActionFormState({
              product_id: formState.product_id,
              quantity: formState.quantity,
              allocation_id: formState.allocation_id,
              note: formState.note,
              error: e.message
            }));
          }).finally(function() {
            saveBtn.disabled = false;
          });
        };
      }
    }

    function renderInventoryActionsSection(formState) {
      if (!inventoryActionsSectionEl) return;
      inventoryActionsSectionEl.innerHTML = renderEventInventoryActionsSection(currentInventoryActionsData, currentInventoryData, inventoryProducts, formState);
      bindInventoryActionsSection(formState || null);
    }

    renderReadinessSection();
    renderInventorySection(null);
    renderInventoryActionsSection(buildUsageActionFormState());

    function close() { overlay.remove(); }

    document.getElementById('event-details-close').onclick = close;
    document.getElementById('event-details-cancel').onclick = close;
    if (showGoogleSyncBtn) {
      document.getElementById('event-details-sync-google').onclick = function() {
        syncToGoogle(id);
      };
    }
    document.getElementById('event-details-edit').onclick = function() {
      close();
      editLead(id);
    };
  }).catch(function(e) {
    toast(e.message, 'error');
  });
}


function openCustomerCard(id) {
  Promise.all([
    apiCall('GET', '/api/contacts/' + id),
    apiCall('GET', '/api/contacts/' + id + '/timeline').catch(function() { return { timeline: [] }; })
  ]).then(function(results) {
    var data = results[0] || {};
    var timelineData = results[1] || { timeline: [] };
    var c = data.contact || {};
    var leads = data.leads || [];
    var stats = data.stats || {};
    var timeline = timelineData.timeline || [];
    var grid = document.getElementById('customers-grid');
    if (!grid) return;

    var tags = dedupeCustomerTags(parseCustomerTags(c.tags));
    var extraContacts = parseExtraContacts(c);

    var cleanPhone = (c.phone || '').replace(/[^0-9]/g, '');
    var waPhone = cleanPhone.charAt(0) === '0' ? '972' + cleanPhone.substring(1) : cleanPhone;

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-customers">← חזרה לרשימת לקוחות</button>';
    html += '<button class="btn btn-secondary btn-sm" id="edit-customer-btn">✏️ עריכה</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-event-btn">+ אירוע חדש ללקוח</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:360px 1fr;gap:20px;align-items:start">';

    html += '<div class="contact-card" style="position:sticky;top:20px">';
    html += '<div class="contact-card-header"><div>';
    html += '<div class="contact-card-name">' + (c.name || 'לקוח ללא שם') + '</div>';
    html += '<div class="contact-card-meta">מספר לקוח #' + (c.contact_num || c.id || '') + '</div>';
    html += '</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
    html += '<span class="badge badge-purple">' + (c.customer_type || 'פרטי') + '</span>';
    html += '<span class="badge ' + getCustomerStatusBadgeClass(c.status || 'active') + '">' + getStatusLabel(c.status || 'active') + '</span>';
    html += '</div></div>';

    html += '<div class="info-section"><div class="info-section-title">תגיות לקוח</div>';
    if (tags.length) {
      html += '<div class="attraction-tags" style="margin-bottom:10px">';
      tags.forEach(function(t, idx) { html += '<span class="customer-tag-pill">' + t + ' <button class="customer-tag-remove" data-tag-index="' + idx + '" title="הסר תגית">×</button></span>'; });
      html += '</div>';
    } else {
      html += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">אין תגיות עדיין</div>';
    }
    html += '<div class="customer-tag-controls">';
    html += '<select class="form-input" id="customer-tag-select" style="flex:1">';
    html += '<option value="">בחר תגית</option>';
    predefinedCustomerTags.forEach(function(tag) { html += '<option value="' + tag + '">' + tag + '</option>'; });
    html += '</select>';
    html += '<input class="form-input" id="customer-tag-custom" placeholder="תגית חדשה..." style="flex:1">';
    html += '<button class="btn btn-primary btn-sm" id="add-customer-tag-btn" style="white-space:nowrap">הוסף תגית</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">פרטי לקוח</div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (c.phone || '—');
    if (c.phone) html += ' <a class="btn btn-ghost btn-sm" target="_blank" href="https://wa.me/' + waPhone + '"><img src="/whatsapp-icon.png" alt="WhatsApp" style="width:28px;height:28px;object-fit:contain;display:block"></a> <a class="btn btn-ghost btn-sm" href="tel:' + c.phone + '"><img src="/phone-icon.png" alt="Phone" style="width:28px;height:28px;object-fit:contain;display:block"></a> <button class="btn btn-ghost btn-sm" id="add-extra-contact-btn" style="padding:6px 10px;font-weight:800">+</button>';
    html += '</span></div>';
    html += '<div class="info-row"><span class="info-label">מייל</span><span class="info-value">' + (c.email || '—');
    if (c.email) html += ' <a class="btn btn-ghost btn-sm" href="mailto:' + c.email + '">שלח מייל</a>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">סוג לקוח</span><span class="info-value" style="display:flex;gap:8px;align-items:center">';
    html += '<select id="customer-type-select" class="form-input" style="flex:1"><option value="פרטי">פרטי</option><option value="עסקי">עסקי</option><option value="מפיק/ספק">מפיק/ספק</option></select>';
    html += '<button class="btn btn-primary btn-sm" id="save-customer-type" style="padding:4px 8px;font-size:11px">שמור</button>';
    html += '</span></div>';

    html += '<div class="info-row"><span class="info-label">סטטוס לקוח</span><span class="info-value" style="display:flex;gap:8px;align-items:center">';
    html += '<select id="customer-status-select" class="form-input" style="flex:1"><option value="hot">🔥 חם</option><option value="cold">❄️ קר</option><option value="offer">⏳ בהצעה</option><option value="active">🟢 פעיל</option><option value="closed">✅ סגור</option><option value="cancelled">❌ בוטל</option></select>';
    html += '<button class="btn btn-primary btn-sm" id="save-customer-status" style="padding:4px 8px;font-size:11px">שמור</button>';
    html += '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">נתונים עסקיים</div>';
    html += '<div class="info-row"><span class="info-label">מספר אירועים</span><span class="info-value">' + (stats.total || leads.length || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">סך הכנסות</span><span class="info-value">₪' + fmtMoney(stats.revenue || 0) + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע אחרון</span><span class="info-value">' + (stats.last_event_date ? formatDate(stats.last_event_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">אירוע בתאריך</span><span class="info-value">' + (stats.next_event_date ? formatDate(stats.next_event_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">מעקב</div>';
    html += '<div class="info-row"><span class="info-label">קשר אחרון</span><span class="info-value">' + (c.last_contact_date ? formatDate(c.last_contact_date) : '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">קשר קרוב</span><span class="info-value">' + (c.next_contact_date ? formatDate(c.next_contact_date) : '—') + '</span></div>';
    html += '</div>';

    html += '<div class="info-section"><div class="info-section-title">הערות כלליות</div>';
    html += '<div style="font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">' + (c.general_notes || c.notes || 'אין הערות כלליות') + '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="table-card"><div class="table-toolbar" style="justify-content:space-between"><strong>אירועים של הלקוח</strong><span class="badge badge-gray">' + leads.length + ' אירועים</span></div>';
    if (!leads.length) { html += '<div class="dash-empty">אין אירועים ללקוח הזה</div>'; }
    else {
      html += '<table><thead><tr><th>מספר אירוע</th><th>תאריך</th><th>סוג</th><th>אולם</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
      leads.forEach(function(l) {
        html += '<tr data-event-id="' + l.id + '"><td class="bold" style="color:var(--accent)">אירוע #' + (l.lead_num || l.id) + '</td><td>' + (l.event_date ? formatDate(l.event_date) : '—') + '</td><td>' + (l.event_type || '—') + '</td><td>' + (l.venue || '—') + '</td><td>' + (l.price ? '₪' + fmtMoney(l.price) : '—') + '</td><td>' + statusBadge(l.status) + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    html += '</div>';

    html += '<div class=\"info-section\"><div class=\"info-section-title\">יומן פעילות</div>';
    html += '<div class=\"note-input-row\" style=\"margin-bottom:12px;align-items:flex-start\">';
    html += '<textarea class=\"note-input\" id=\"customer-note-input\" placeholder=\"הוסף הערת לקוח...\" style=\"min-height:74px;resize:vertical\"></textarea>';
    html += '<button class=\"btn btn-primary btn-sm\" id=\"add-customer-note-btn\" style=\"white-space:nowrap\">הוסף הערה</button>';
    html += '</div>';
    if (!timeline.length) {
      html += '<div class=\"dash-empty\">אין פעילות עדיין</div>';
    } else {
      timeline.forEach(function(item) {
        html += '<div class=\"activity-item\">';
        html += '<div class=\"activity-date\">' + fmtDT(item.created_at) + '</div>';
        html += '<div class=\"activity-title\">' + (item.title || 'פעילות') + '</div>';
        html += '<div class=\"activity-text\">' + (item.text || '') + '</div>';
        html += '</div>';
      });
    }

    html += '</div></div>';

    grid.innerHTML = html;

    // force-event-modal-from-customer-card
    setTimeout(function() {
      var addCustomerNoteBtn = document.getElementById('add-customer-note-btn');
    if (addCustomerNoteBtn) {
      addCustomerNoteBtn.addEventListener('click', function() {
        addCustomerNote(c.id);
      });
    }

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


    document.getElementById('back-to-customers').addEventListener('click', loadCustomers);

    var editBtn = document.getElementById('edit-customer-btn');
    if (editBtn) {
      editBtn.onclick = function() {
        openEditCustomerModal(c);
      };
    }
    var addExtraBtn = document.getElementById('add-extra-contact-btn');
    if (addExtraBtn) addExtraBtn.addEventListener('click', function() {
      openExtraContactModal(c.id);
    });
    document.getElementById('customer-type-select').value = c.customer_type || 'פרטי';
    document.getElementById('customer-status-select').value = c.status || 'active';

    function saveContact(extra) {
      apiCall('PUT', '/api/contacts/' + c.id, {
        name: c.name, phone: c.phone, email: c.email, notes: c.notes,
        customer_type: extra.customer_type !== undefined ? extra.customer_type : (c.customer_type || 'פרטי'),
        status: extra.status !== undefined ? extra.status : (c.status || 'active'),
        tags: extra.tags !== undefined ? extra.tags : c.tags,
        last_contact_date: c.last_contact_date, next_contact_date: c.next_contact_date, general_notes: c.general_notes
      }).then(function() { toast('נשמר בהצלחה', 'success'); openCustomerCard(c.id); }).catch(function(e) { toast(e.message, 'error'); });
    }

    document.getElementById('save-customer-type').addEventListener('click', function() {
      saveContact({ customer_type: document.getElementById('customer-type-select').value });
    });
    document.getElementById('save-customer-status').addEventListener('click', function() {
      saveContact({ status: document.getElementById('customer-status-select').value });
    });
    var addCustomerTagBtn = document.getElementById('add-customer-tag-btn');
    if (addCustomerTagBtn) {
      addCustomerTagBtn.addEventListener('click', function() {
        var select = document.getElementById('customer-tag-select');
        var customInput = document.getElementById('customer-tag-custom');
        var selectedTag = select ? String(select.value || '').trim() : '';
        var customTag = customInput ? String(customInput.value || '').trim() : '';
        var tagToAdd = customTag || selectedTag;
        if (!tagToAdd) { toast('בחר או כתוב תגית להוספה', 'error'); return; }
        var updatedTags = dedupeCustomerTags(tags.concat([tagToAdd]));
        if (updatedTags.length === tags.length) { toast('התגית כבר קיימת', 'error'); return; }
        saveContact({ tags: JSON.stringify(updatedTags) });
      });
    }
    grid.querySelectorAll('.customer-tag-remove[data-tag-index]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = Number(this.getAttribute('data-tag-index'));
        var updatedTags = tags.filter(function(_, tagIndex) { return tagIndex !== idx; });
        saveContact({ tags: JSON.stringify(updatedTags) });
      });
    });

    document.getElementById('add-event-btn').addEventListener('click', function() {
      openLeadModal();
      setTimeout(function() {
        document.getElementById('l-name').value = c.name || '';
        document.getElementById('l-phone').value = c.phone || '';
        document.getElementById('l-email').value = c.email || '';
      }, 50);
    });

    grid.querySelectorAll('tr[data-event-id]').forEach(function(row) {
      row.addEventListener('click', function() { openDrawer(parseInt(this.getAttribute('data-event-id'))); });
    });
  }).catch(function(e) { toast(e.message, 'error'); });
}

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
  Promise.all([
    apiCall('GET', '/api/contacts/' + id),
    apiCall('GET', '/api/contacts/' + id + '/timeline').catch(function() { return { timeline: [] }; })
  ]).then(function(results) {
    var data = results[0];
    var timelineData = results[1] || { timeline: [] };
    currentCustomer = data.contact;
    var c = data.contact, leads = data.leads, stats = data.stats, timeline = timelineData.timeline || [];
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
    html += '</div>';
    // יומן פעילות
    html += '<div class="info-section"><div class="info-section-title">יומן פעילות</div>';
    if (!timeline.length) {
      html += '<div class="dash-empty">אין פעילות עדיין</div>';
    } else {
      timeline.forEach(function(item) {
        html += '<div class="activity-item">';
        html += '<div class="activity-date">' + fmtDT(item.created_at) + '</div>';
        html += '<div class="activity-title">' + (item.title || 'פעילות') + '</div>';
        html += '<div class="activity-text">' + (item.text || '') + '</div>';
        html += '</div>';
      });
    }
    html += '</div>';
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

  var newEmployeeBtn = document.getElementById('btn-new-employee');
  if (newEmployeeBtn) newEmployeeBtn.addEventListener('click', function() {
    openEmployeeModal();
  });

  var employeesSearch = document.getElementById('employees-search');
  if (employeesSearch) employeesSearch.addEventListener('input', function() {
    clearTimeout(searchTimer); searchTimer = setTimeout(loadEmployees, 300);
  });

  var employeesStatusFilter = document.getElementById('employees-status-filter');
  if (employeesStatusFilter) employeesStatusFilter.addEventListener('change', loadEmployees);

  var newProductBtn = document.getElementById('btn-new-product');
  if (newProductBtn) newProductBtn.addEventListener('click', function() {
    openProductModal();
  });

  var productsSearch = document.getElementById('products-search');
  if (productsSearch) productsSearch.addEventListener('input', function() {
    clearTimeout(searchTimer); searchTimer = setTimeout(loadProducts, 300);
  });
});

function openShoppingStoreModalV2() {
  var old = document.getElementById('shopping-store-modal-v2');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-store-modal-v2';

  overlay.innerHTML =
    '<div class="modal" style="width:520px">' +
      '<div class="modal-header">' +
        '<h2>חנות חדשה</h2>' +
        '<button class="modal-close" id="shop-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם חנות</label><input class="form-input" id="shop-name"></div>' +
        '<div class="form-group"><label class="form-label">איש קשר</label><input class="form-input" id="shop-contact"></div>' +
        '<div class="form-group"><label class="form-label">טלפון איש קשר</label><input class="form-input" id="shop-phone"></div>' +
        '<div class="form-group"><label class="form-label">טלפון נוסף</label><input class="form-input" id="shop-extra-phone"></div>' +
        '<div class="form-group"><label class="form-label">כתובת חנות</label><input class="form-input" id="shop-address"></div>' +
        '<div class="form-group"><label class="form-label">שעות פתיחה</label><input class="form-input" id="shop-hours"></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="shop-notes" style="min-height:90px"></textarea></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="shop-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="shop-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('shop-close').onclick = close;
  document.getElementById('shop-cancel').onclick = close;

  document.getElementById('shop-save').onclick = function() {
    var name = document.getElementById('shop-name').value.trim();

    if (!name) {
      toast('שם חנות חובה', 'error');
      return;
    }

    apiCall('POST', '/api/shopping-lists', {
      name: name,
      contact_name: document.getElementById('shop-contact').value.trim(),
      contact_phone: document.getElementById('shop-phone').value.trim(),
      extra_phone: document.getElementById('shop-extra-phone').value.trim(),
      address: document.getElementById('shop-address').value.trim(),
      opening_hours: document.getElementById('shop-hours').value.trim(),
      notes: document.getElementById('shop-notes').value.trim()
    }).then(function() {
      close();
      toast('חנות נוספה', 'success');
      if (typeof loadShoppingLists === 'function') loadShoppingLists();
    }).catch(function(e) {
      toast(e.message, 'error');
    });
  };
}

document.addEventListener('click', function(e) {
  var btn = e.target.closest('#btn-new-shopping-list');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();
  openShoppingStoreModalV2();
}, true);



window.shoppingStatusBadge = function(status) {
  if (status === 'done') return '<span class="badge badge-green">נקנה</span>';
  return '<span class="badge badge-orange">ממתין</span>';
};

window.openEditShoppingItemModal = function(listId, item) {
  var old = document.getElementById('shopping-item-edit-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-item-edit-modal';

  overlay.innerHTML =
    '<div class="modal" style="width:500px">' +
      '<div class="modal-header"><h2>עריכת מוצר</h2><button class="modal-close" id="shopping-edit-close">✕</button></div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם מוצר</label><input class="form-input" id="shopping-edit-name" value="' + (item.item_name || '') + '"></div>' +
        '<div class="form-group"><label class="form-label">כמות</label><input class="form-input" id="shopping-edit-quantity" value="' + (item.quantity || '') + '"></div>' +
        '<div class="form-group"><label class="form-label">מחיר</label><input class="form-input" type="number" id="shopping-edit-price" value="' + (item.price || 0) + '"></div>' +
        '<div class="form-group"><label class="form-label">סטטוס</label><select class="form-input" id="shopping-edit-status"><option value="pending">ממתין</option><option value="done">נקנה</option></select></div>' +
        '<div class="form-group"><label class="form-label">מוצר מקושר</label><select class="form-input" id="shopping-edit-product"><option value="">טוען מוצרים...</option></select></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="shopping-edit-notes" style="min-height:90px">' + (item.notes || '') + '</textarea></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-danger" id="shopping-edit-delete">מחק</button>' +
        '<button class="btn btn-secondary" id="shopping-edit-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="shopping-edit-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.getElementById('shopping-edit-status').value = item.status || 'pending';
  populateShoppingProductSelect('shopping-edit-product', item.product_id || null);

  function close() { overlay.remove(); }

  document.getElementById('shopping-edit-close').onclick = close;
  document.getElementById('shopping-edit-cancel').onclick = close;

  document.getElementById('shopping-edit-save').onclick = function() {
    apiCall('PUT', '/api/shopping-items/' + item.id, {
      item_name: document.getElementById('shopping-edit-name').value.trim(),
      quantity: document.getElementById('shopping-edit-quantity').value.trim(),
      price: Number(document.getElementById('shopping-edit-price').value || 0),
      status: document.getElementById('shopping-edit-status').value,
      product_id: getShoppingSelectedProductId('shopping-edit-product'),
      notes: document.getElementById('shopping-edit-notes').value.trim()
    }).then(function() {
      close();
      toast('המוצר עודכן', 'success');
      openShoppingList(listId);
    }).catch(function(e) { toast(e.message, 'error'); });
  };

  document.getElementById('shopping-edit-delete').onclick = function() {
    if (!confirm('האם למחוק את המוצר?')) return;

    apiCall('DELETE', '/api/shopping-items/' + item.id).then(function() {
      close();
      toast('המוצר נמחק', 'success');
      openShoppingList(listId);
    }).catch(function(e) { toast(e.message, 'error'); });
  };
};

openShoppingList = function(id) {
  window.currentShoppingListId = id;

  apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
    var grid = document.getElementById('shopping-grid');
    if (!grid) return;

    var list = data.list || {};
    var items = data.items || [];
    var purchases = data.purchases || [];
    var summary = data.summary || {};

    ensureShoppingProductOptions().catch(function() { return null; });

    var html = '';

    html += '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px">';
    html += '<button class="btn btn-secondary btn-sm" id="back-to-shopping">← חזרה לחנויות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר לרשימה</button>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">';

    html += '<div>';
    html += '<div class="contact-card">';
    html += '<div class="contact-card-header"><div>';
    html += '<div class="contact-card-name">' + (list.name || 'חנות') + '</div>';
    html += '<div class="contact-card-meta">' + (list.address || '') + '</div>';
    html += '</div><span class="badge badge-purple">' + items.length + ' פריטים</span></div>';

    html += '<div class="info-section"><div class="info-section-title">פרטי חנות</div>';
    html += '<div class="info-row"><span class="info-label">איש קשר</span><span class="info-value">' + (list.contact_name || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון</span><span class="info-value">' + (list.contact_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">טלפון נוסף</span><span class="info-value">' + (list.extra_phone || '—') + '</span></div>';
    html += '<div class="info-row"><span class="info-label">שעות פתיחה</span><span class="info-value">' + (list.opening_hours || '—') + '</span></div>';
    html += '</div></div>';

    html += '<div class="stats-grid" style="margin-top:16px">';
    html += '<div class="stat-card"><div class="stat-label">החודש</div><div class="stat-value">₪' + fmtMoney(summary.current_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">חודש שעבר</div><div class="stat-value">₪' + fmtMoney(summary.previous_month || 0) + '</div></div>';
    html += '<div class="stat-card"><div class="stat-label">מתחילת השנה</div><div class="stat-value">₪' + fmtMoney(summary.year_total || 0) + '</div></div>';
    html += '</div>';

    html += '<div class="table-card" style="margin-top:16px">';
    html += '<div class="table-toolbar"><strong>רשימת קניות פעילה</strong></div>';

    if (!items.length) {
      html += '<div class="dash-empty">אין מוצרים ברשימה</div>';
    } else {
      html += '<table><thead><tr><th>מוצר</th><th>כמות</th><th>מחיר</th><th>סטטוס</th></tr></thead><tbody>';
      items.forEach(function(it) {
        html += '<tr class="shopping-item-row" data-item-id="' + it.id + '" style="cursor:pointer">';
        html += '<td>' + escapeShoppingProductText(it.item_name || '') + renderShoppingLinkedProductBadge(it) + '</td>';
        html += '<td>' + escapeShoppingProductText(it.quantity || '') + '</td>';
        html += '<td>₪' + fmtMoney(it.price || 0) + '</td>';
        html += '<td>' + shoppingStatusBadge(it.status) + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    html += '<div class="table-card">';
    html += '<div class="table-toolbar"><strong>עסקאות קודמות</strong></div>';

    if (!purchases.length) {
      html += '<div class="dash-empty">אין עסקאות קודמות</div>';
    } else {
      html += '<table><thead><tr><th>תאריך</th><th>סכום</th><th>הערות</th></tr></thead><tbody>';
      purchases.forEach(function(p) {
        html += '<tr><td>' + (p.purchase_date || '') + '</td><td>₪' + fmtMoney(p.total_amount || 0) + '</td><td>' + (p.notes || '') + '</td></tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';

    grid.innerHTML = html;

    document.getElementById('back-to-shopping').onclick = loadShoppingLists;

    var addBtn = document.getElementById('add-shopping-item-btn');
    if (addBtn && typeof openShoppingItemModal === 'function') {
      addBtn.onclick = openShoppingItemModal;
    }

    var purchasedBtn = document.getElementById('shopping-purchased-btn');
    if (purchasedBtn) {
      purchasedBtn.onclick = function() {
        openShoppingPurchaseModal(id, items);
      };
    }

    grid.querySelectorAll('.shopping-purchase-row').forEach(function(row) {
      row.onclick = function() {
        openShoppingPurchaseDetailsModal(parseInt(this.getAttribute('data-purchase-id')), id);
      };
    });

    grid.querySelectorAll('.shopping-item-row').forEach(function(row) {
      row.onclick = function() {
        var itemId = parseInt(this.getAttribute('data-item-id'));
        var item = items.find(function(x) { return Number(x.id) === itemId; });
        if (item) openEditShoppingItemModal(id, item);
      };
    });
  }).catch(function(e) {
    toast(e.message, 'error');
  });
};


window.openShoppingPurchaseModal = function(listId, items) {
  if (!items || !items.length) {
    toast('אין מוצרים ברשימה', 'error');
    return;
  }

  var old = document.getElementById('shopping-purchase-modal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'shopping-purchase-modal';

  var defaultTotal = items.reduce(function(sum, it) {
    return sum + Number(it.price || 0);
  }, 0);

  overlay.innerHTML =
    '<div class="modal" style="width:520px">' +
      '<div class="modal-header">' +
        '<h2>סיום קנייה</h2>' +
        '<button class="modal-close" id="purchase-close">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">תאריך קנייה</label><input type="date" class="form-input" id="purchase-date" value="' + new Date().toISOString().slice(0,10) + '"></div>' +
        '<div class="form-group"><label class="form-label">סכום קנייה</label><input type="number" class="form-input" id="purchase-total" value="' + defaultTotal + '"></div>' +
        '<div class="form-group"><label class="form-label">תמונת חשבונית</label><input type="file" class="form-input" id="purchase-receipt" accept="image/*"></div>' +
        '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="purchase-notes" style="min-height:80px"></textarea></div>' +
      '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary" id="purchase-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="purchase-save">קניתי</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); }

  document.getElementById('purchase-close').onclick = close;
  document.getElementById('purchase-cancel').onclick = close;

  document.getElementById('purchase-save').onclick = function() {
    var fileInput = document.getElementById('purchase-receipt');
    var file = fileInput.files && fileInput.files[0];

    function save(receiptData) {
      apiCall('POST', '/api/shopping-lists/' + listId + '/purchases', {
        purchase_date: document.getElementById('purchase-date').value,
        total_amount: Number(document.getElementById('purchase-total').value || 0),
        notes: document.getElementById('purchase-notes').value.trim(),
        receipt_image: receiptData || null,
        items: items.map(function(it) {
          return {
            item_name: it.item_name,
            quantity: it.quantity,
            price: it.price,
            notes: it.notes
          };
        })
      }).then(function() {
        close();
        toast('הקנייה נשמרה', 'success');
        openShoppingList(listId);
      }).catch(function(e) {
        toast(e.message, 'error');
      });
    }

    if (!file) {
      save(null);
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      save(e.target.result);
    };
    reader.readAsDataURL(file);
  };
};


// force-purchased-button

(function() {
  var originalOpenShoppingList = window.openShoppingList || openShoppingList;

  window.openShoppingList = openShoppingList = function(id) {
    originalOpenShoppingList(id);

    setTimeout(function() {
      var grid = document.getElementById('shopping-grid');
      if (!grid) return;

      var toolbars = grid.querySelectorAll('.table-toolbar');
      if (!toolbars.length) return;

      var toolbar = toolbars[0];

      if (document.getElementById('shopping-purchased-btn')) return;

      var btn = document.createElement('button');
      btn.className = 'btn btn-primary btn-sm';
      btn.id = 'shopping-purchased-btn';
      btn.textContent = 'קניתי';

      btn.onclick = function() {
        apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
          var items = data.items || [];
          openShoppingPurchaseModal(id, items);
        }).catch(function(e) {
          toast(e.message, 'error');
        });
      };

      toolbar.style.justifyContent = 'space-between';
      toolbar.appendChild(btn);
    }, 500);
  };
})();


window.openShoppingPurchaseDetailsModal = function(purchaseId, currentListId) {
  apiCall('GET', '/api/shopping-purchases/' + purchaseId).then(function(data) {
    var p = data.purchase || {};
    var items = data.items || [];
    var stores = data.stores || [];

    var old = document.getElementById('shopping-purchase-details-modal');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'shopping-purchase-details-modal';

    var itemsHtml = items.length ? items.map(function(it, idx) {
      return '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:8px">' +
        '<input class="form-input purchase-item-name" data-idx="' + idx + '" value="' + (it.item_name || '') + '">' +
        '<input class="form-input purchase-item-qty" data-idx="' + idx + '" value="' + (it.quantity || '') + '">' +
        '<input class="form-input purchase-item-price" data-idx="' + idx + '" type="number" value="' + (it.price || 0) + '">' +
      '</div>';
    }).join('') : '<div class="dash-empty">אין פריטים בעסקה</div>';

    overlay.innerHTML =
      '<div class="modal" style="width:720px">' +
        '<div class="modal-header">' +
          '<h2>עסקה קודמת</h2>' +
          '<button class="modal-close" id="purchase-details-close">✕</button>' +
        '</div>' +

        '<div class="modal-body">' +

          '<div class="form-group">' +
            '<label class="form-label">חנות</label>' +
            '<select class="form-input" id="purchase-store-id">' +
              stores.map(function(st) {
                return '<option value="' + st.id + '">' + st.name + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +

          '<div class="form-group">' +
            '<label class="form-label">תאריך קנייה</label>' +
            '<input type="date" class="form-input" id="purchase-edit-date" value="' + (p.purchase_date || '') + '">' +
          '</div>' +

          '<div class="form-group">' +
            '<label class="form-label">סכום קנייה</label>' +
            '<input type="number" class="form-input" id="purchase-edit-total" value="' + (p.total_amount || 0) + '">' +
          '</div>' +

          '<div class="form-group">' +
            '<label class="form-label">הערות</label>' +
            '<textarea class="form-input" id="purchase-edit-notes" style="min-height:80px">' + (p.notes || '') + '</textarea>' +
          '</div>' +

          '<div class="info-section">' +
            '<div class="info-section-title">פריטים שנקנו</div>' +
            '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:6px;font-size:12px;color:var(--text3);font-weight:700">' +
              '<div>מוצר</div><div>כמות</div><div>מחיר</div>' +
            '</div>' +
            itemsHtml +
          '</div>' +

          (p.receipt_image ? '<div class="info-section"><div class="info-section-title">חשבונית</div><img src="' + p.receipt_image + '" style="max-width:100%;border-radius:12px;border:1px solid var(--border)"></div>' : '') +

        '</div>' +

        '<div class="modal-footer">' +
          '<button class="btn btn-danger" id="purchase-delete">מחק עסקה</button>' +
          '<button class="btn btn-secondary" id="purchase-details-cancel">ביטול</button>' +
          '<button class="btn btn-primary" id="purchase-details-save">שמור</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    document.getElementById('purchase-store-id').value = p.list_id;

    function close() {
      overlay.remove();
    }

    document.getElementById('purchase-details-close').onclick = close;
    document.getElementById('purchase-details-cancel').onclick = close;

    document.getElementById('purchase-details-save').onclick = function() {
      var updatedItems = items.map(function(it, idx) {
        return {
          item_name: document.querySelector('.purchase-item-name[data-idx="' + idx + '"]').value.trim(),
          quantity: document.querySelector('.purchase-item-qty[data-idx="' + idx + '"]').value.trim(),
          price: Number(document.querySelector('.purchase-item-price[data-idx="' + idx + '"]').value || 0),
          notes: it.notes || ''
        };
      }).filter(function(it) {
        return it.item_name;
      });

      var newListId = document.getElementById('purchase-store-id').value;

      apiCall('PUT', '/api/shopping-purchases/' + purchaseId, {
        list_id: Number(newListId),
        purchase_date: document.getElementById('purchase-edit-date').value,
        total_amount: Number(document.getElementById('purchase-edit-total').value || 0),
        notes: document.getElementById('purchase-edit-notes').value.trim(),
        receipt_image: p.receipt_image || null,
        items: updatedItems
      }).then(function() {
        close();
        toast('העסקה עודכנה', 'success');
        openShoppingList(Number(newListId));
      }).catch(function(e) {
        toast(e.message, 'error');
      });
    };

    document.getElementById('purchase-delete').onclick = function() {
      var ok = confirm('האם למחוק את העסקה הקודמת?');
      if (!ok) return;

      apiCall('DELETE', '/api/shopping-purchases/' + purchaseId).then(function() {
        close();
        toast('העסקה נמחקה', 'success');
        openShoppingList(currentListId);
      }).catch(function(e) {
        toast(e.message, 'error');
      });
    };
  }).catch(function(e) {
    toast(e.message, 'error');
  });
};



// force-purchase-click-final
function getShoppingProductSyncSummaryText(summary) {
  if (!summary) return 'הסנכרון הושלם';
  return [
    'נוצרו: ' + Number(summary.created_count || 0),
    'כבר סונכרנו: ' + Number(summary.skipped_existing || 0),
    'ללא קישור: ' + Number(summary.skipped_unlinked || 0),
    'נכשלו: ' + Number(summary.failed_count || 0)
  ].join(' | ');
}

function getShoppingProductSyncFailureText(summary) {
  if (!summary || !Array.isArray(summary.failures) || !summary.failures.length) return '';
  return summary.failures.map(function(failure) {
    return 'שורה ' + failure.item_id + ': ' + (failure.error || 'שגיאה לא ידועה');
  }).join('\\n');
}

window.openShoppingPurchaseDetailsModal = function(purchaseId, currentListId) {
  apiCall('GET', '/api/shopping-purchases/' + purchaseId).then(function(data) {
    var p = data.purchase || {};
    var items = data.items || [];
    var stores = data.stores || [];

    var old = document.getElementById('shopping-purchase-details-modal');
    if (old) old.remove();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'shopping-purchase-details-modal';

    var itemsHtml = items.map(function(it, idx) {
      return '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:8px">' +
        '<input class="form-input purchase-item-name" data-idx="' + idx + '" value="' + (it.item_name || '') + '">' +
        '<input class="form-input purchase-item-qty" data-idx="' + idx + '" value="' + (it.quantity || '') + '">' +
        '<input class="form-input purchase-item-price" data-idx="' + idx + '" type="number" value="' + (it.price || 0) + '">' +
      '</div>';
    }).join('');

    overlay.innerHTML =
      '<div class="modal" style="width:720px">' +
        '<div class="modal-header"><h2>עסקה קודמת</h2><button class="modal-close" id="purchase-details-close">✕</button></div>' +
        '<div class="modal-body">' +
          '<div class="form-group"><label class="form-label">חנות</label><select class="form-input" id="purchase-store-id">' +
            stores.map(function(st) { return '<option value="' + st.id + '">' + st.name + '</option>'; }).join('') +
          '</select></div>' +
          '<div class="form-group"><label class="form-label">תאריך קנייה</label><input type="date" class="form-input" id="purchase-edit-date" value="' + (p.purchase_date || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">סכום קנייה</label><input type="number" class="form-input" id="purchase-edit-total" value="' + (p.total_amount || 0) + '"></div>' +
          '<div class="form-group"><label class="form-label">הערות</label><textarea class="form-input" id="purchase-edit-notes" style="min-height:80px">' + (p.notes || '') + '</textarea></div>' +
          '<div class="info-section"><div class="info-section-title">פריטים שנקנו</div>' +
            '<div style="display:grid;grid-template-columns:1.4fr .7fr .7fr;gap:8px;margin-bottom:6px;font-size:12px;color:var(--text3);font-weight:700"><div>מוצר</div><div>כמות</div><div>מחיר</div></div>' +
            (itemsHtml || '<div class="dash-empty">אין פריטים בעסקה</div>') +
          '</div>' +
          '<div id="purchase-sync-summary" class="info-section" style="display:none"></div>' +
          (p.receipt_image ? '<div class="info-section"><div class="info-section-title">חשבונית</div><img src="' + p.receipt_image + '" style="max-width:100%;border-radius:12px;border:1px solid var(--border)"></div>' : '') +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-danger" id="purchase-delete">מחק עסקה</button>' +
          '<button class="btn btn-secondary" id="purchase-sync-products">סנכרן להיסטוריית מוצרים</button>' +
          '<button class="btn btn-secondary" id="purchase-details-cancel">ביטול</button>' +
          '<button class="btn btn-primary" id="purchase-details-save">שמור</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.getElementById('purchase-store-id').value = p.list_id;

    function close() { overlay.remove(); }
    function setSyncSummary(summary) {
      var box = document.getElementById('purchase-sync-summary');
      if (!box) return;
      var failureText = getShoppingProductSyncFailureText(summary);
      box.style.display = 'block';
      box.innerHTML = '<div class="info-section-title">סיכום סנכרון</div><div>' + getShoppingProductSyncSummaryText(summary) + '</div>' + (failureText ? '<pre style="margin-top:8px;white-space:pre-wrap;font-family:inherit;background:#fafbfc;padding:10px;border-radius:8px">' + failureText + '</pre>' : '');
    }

    document.getElementById('purchase-details-close').onclick = close;
    document.getElementById('purchase-details-cancel').onclick = close;

    document.getElementById('purchase-sync-products').onclick = function() {
      var btn = this;
      btn.disabled = true;
      btn.textContent = 'מסנכרן...';
      apiCall('POST', '/api/shopping-purchases/' + purchaseId + '/sync-products').then(function(summary) {
        setSyncSummary(summary);
        var summaryText = getShoppingProductSyncSummaryText(summary);
        if (summary.failed_count > 0) {
          toast(summaryText, 'error');
        } else {
          toast(summaryText, 'success');
        }
      }).catch(function(e) {
        toast(e.message, 'error');
      }).finally(function() {
        btn.disabled = false;
        btn.textContent = 'סנכרן להיסטוריית מוצרים';
      });
    };

    document.getElementById('purchase-details-save').onclick = function() {
      var updatedItems = items.map(function(it, idx) {
        return {
          item_name: document.querySelector('.purchase-item-name[data-idx="' + idx + '"]').value.trim(),
          quantity: document.querySelector('.purchase-item-qty[data-idx="' + idx + '"]').value.trim(),
          price: Number(document.querySelector('.purchase-item-price[data-idx="' + idx + '"]').value || 0),
          notes: it.notes || ''
        };
      }).filter(function(it) { return it.item_name; });

      var newListId = Number(document.getElementById('purchase-store-id').value);

      apiCall('PUT', '/api/shopping-purchases/' + purchaseId, {
        list_id: newListId,
        purchase_date: document.getElementById('purchase-edit-date').value,
        total_amount: Number(document.getElementById('purchase-edit-total').value || 0),
        notes: document.getElementById('purchase-edit-notes').value.trim(),
        receipt_image: p.receipt_image || null,
        items: updatedItems
      }).then(function() {
        close();
        toast('העסקה עודכנה', 'success');
        openShoppingList(newListId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };

    document.getElementById('purchase-delete').onclick = function() {
      if (!confirm('האם למחוק את העסקה הקודמת?')) return;

      apiCall('DELETE', '/api/shopping-purchases/' + purchaseId).then(function() {
        close();
        toast('העסקה נמחקה', 'success');
        openShoppingList(currentListId);
      }).catch(function(e) { toast(e.message, 'error'); });
    };
  }).catch(function(e) { toast(e.message, 'error'); });
};

(function() {
  var oldOpenShoppingList = openShoppingList;

  openShoppingList = window.openShoppingList = function(id) {
    oldOpenShoppingList(id);

    setTimeout(function() {
      apiCall('GET', '/api/shopping-lists/' + id).then(function(data) {
        var grid = document.getElementById('shopping-grid');
        if (!grid) return;

        var purchases = data.purchases || [];
        if (!purchases.length) return;

        var purchaseTables = Array.from(grid.querySelectorAll('.table-card')).filter(function(card) {
          return card.textContent.indexOf('עסקאות קודמות') !== -1;
        });

        if (!purchaseTables.length) return;

        var rows = purchaseTables[0].querySelectorAll('tbody tr');

        rows.forEach(function(row, idx) {
          var p = purchases[idx];
          if (!p) return;

          row.style.cursor = 'pointer';
          row.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openShoppingPurchaseDetailsModal(p.id, id);
          };
        });
      });
    }, 500);
  };
})();

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

