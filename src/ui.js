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
.super-admin-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border);background:linear-gradient(180deg,#faf8ff 0%,#fff 100%)}
.super-admin-summary-title{font-size:14px;font-weight:800;color:var(--text)}
.super-admin-summary-sub{font-size:12px;color:var(--text3);margin-top:4px}
.super-admin-list-status{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800}
.super-admin-list-status.active{background:var(--green-light);color:var(--green)}
.super-admin-list-status.suspended{background:var(--orange-light);color:var(--orange)}
.super-admin-modal{width:760px;max-width:96vw}
.super-admin-modal .modal-body{padding:20px 22px 22px}
#super-admin-tenant-modal .modal-header h2{min-width:0;overflow-wrap:anywhere;line-height:1.35}
.super-admin-section{background:var(--white);border:1px solid var(--border);border-radius:14px;padding:14px 14px 12px;margin-bottom:14px;box-shadow:0 1px 2px rgba(15,23,42,0.04);max-width:100%;overflow:hidden}
.super-admin-section:last-child{margin-bottom:0}
.super-admin-section-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.super-admin-section-title{font-size:13px;font-weight:800;color:var(--text)}
.super-admin-section-sub{font-size:11px;color:var(--text3);margin-top:3px}
.super-admin-action-row{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:12px}
.super-admin-action-row .btn{min-height:38px}
.super-admin-primary-action{min-width:128px}
.super-admin-danger-soft{background:#fff7ed;border:1px solid rgba(234,88,12,0.25);color:#c2410c}
.super-admin-danger-soft:hover{background:#ffedd5}
.super-admin-owner-grid,.super-admin-meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.super-admin-info-card{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:10px 12px}
.super-admin-info-label{font-size:11px;font-weight:700;color:var(--text3);margin-bottom:4px}
.super-admin-info-value{font-size:13px;font-weight:700;color:var(--text);word-break:break-word}
.super-admin-audit-empty{padding:18px 12px;text-align:center;border:1px dashed var(--border);border-radius:12px;color:var(--text3);font-size:12px;background:var(--bg)}
.super-admin-loading{padding:30px 16px;text-align:center;color:var(--text3);font-size:13px}
.owner-setup-hero{padding:16px;border:1px solid rgba(124,58,237,0.16);border-radius:14px;background:linear-gradient(135deg,#f7f3ff 0%,#eef6ff 100%);margin-bottom:14px}
.owner-setup-title{font-size:20px;font-weight:800;color:var(--text);margin-bottom:8px}
.owner-setup-sub{font-size:13px;line-height:1.6;color:var(--text2)}
.owner-setup-steps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.owner-setup-step{padding:6px 10px;border-radius:999px;background:var(--bg);border:1px solid var(--border);font-size:11px;font-weight:700;color:var(--text3)}
.owner-setup-step.active{background:var(--accent-light);border-color:rgba(124,58,237,0.2);color:var(--accent)}
.owner-setup-card{border:1px solid var(--border);border-radius:14px;background:var(--white);padding:14px}
.owner-setup-card-title{font-size:14px;font-weight:800;color:var(--text);margin-bottom:6px}
.owner-setup-card-sub{font-size:12px;color:var(--text3);line-height:1.6;margin-bottom:14px}
.owner-setup-note{margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--bg);font-size:12px;color:var(--text2);line-height:1.6}
.owner-setup-quick-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.owner-setup-quick{display:flex;flex-direction:column;align-items:flex-start;gap:8px;padding:14px;border:1px solid var(--border);border-radius:14px;background:var(--bg);cursor:pointer;transition:all 0.12s;text-align:right}
.owner-setup-quick:hover{border-color:var(--accent);background:var(--accent-light)}
.owner-setup-quick-title{font-size:13px;font-weight:800;color:var(--text)}
.owner-setup-quick-sub{font-size:12px;color:var(--text3);line-height:1.5}
.guided-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:26px 16px;text-align:center;border:1px dashed var(--border);border-radius:14px;background:linear-gradient(180deg,#faf8ff 0%,#fff 100%)}
.guided-empty-title{font-size:14px;font-weight:800;color:var(--text)}
.guided-empty-sub{font-size:12px;line-height:1.6;color:var(--text3);max-width:420px}


.business-settings-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:14px}
.business-settings-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.business-settings-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fafbfc}
.business-settings-title{font-size:15px;font-weight:800;color:var(--text)}
.business-settings-sub{font-size:12px;color:var(--text3);line-height:1.5;margin-top:3px}
.business-settings-body{padding:16px}
.business-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.business-settings-grid.single{grid-template-columns:1fr}
.business-settings-section{padding:14px;border:1px solid var(--border);border-radius:14px;background:#fff;margin-bottom:14px}
.business-settings-section:last-child{margin-bottom:0}
.business-settings-section-title{font-size:13px;font-weight:900;color:var(--text);margin-bottom:4px}
.business-settings-section-sub{font-size:12px;color:var(--text3);line-height:1.5;margin-bottom:12px}
.business-settings-note{padding:10px 12px;border-radius:12px;background:var(--blue-light);color:var(--blue);font-size:12px;font-weight:700;line-height:1.5;margin-top:10px}
.business-settings-note.exempt{background:var(--yellow-light);color:var(--yellow)}
.business-logo-upload{border:1px dashed var(--border2);border-radius:14px;padding:12px;background:#fafbfc;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.business-logo-preview{width:110px;height:70px;border:1px solid var(--border);border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;color:var(--text3);font-size:12px;font-weight:800}
.business-logo-preview img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.business-logo-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.business-logo-file-input{position:absolute;width:1px;height:1px;opacity:.01;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap}
.business-logo-help{font-size:12px;color:var(--text3);line-height:1.5;flex-basis:100%}
.business-settings-permission{padding:12px 14px;border-radius:12px;background:var(--orange-light);color:var(--orange);font-size:13px;font-weight:700;margin-bottom:14px;line-height:1.5}
.business-settings-footer{position:sticky;bottom:0;background:rgba(255,255,255,0.96);border-top:1px solid var(--border);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.business-settings-status{font-size:12px;color:var(--text3)}
@media (max-width:760px){
  #page-business-settings{min-width:0;max-width:100%;overflow-x:hidden}
  #page-business-settings .page-header{gap:8px!important;margin-bottom:10px!important;min-width:0}
  #page-business-settings .page-title{font-size:18px!important;line-height:1.25;min-width:0;overflow-wrap:anywhere}
  #page-business-settings .page-title small{display:block;margin-right:0;font-size:11px!important;line-height:1.4;overflow-wrap:anywhere}
  #page-business-settings .page-header .btn{width:100%;justify-content:center;min-height:40px}
  #page-business-settings .business-settings-layout{display:block;width:100%;max-width:100%;min-width:0;overflow:visible}
  #page-business-settings .business-settings-card{border-radius:14px;overflow:visible;max-width:100%;min-width:0}
  #page-business-settings .business-settings-head{padding:12px;flex-direction:column;align-items:stretch!important;gap:8px}
  #page-business-settings .business-settings-title{font-size:14px;line-height:1.35}
  #page-business-settings .business-settings-sub{font-size:11px;line-height:1.45}
  #page-business-settings .business-settings-body{padding:10px}
  #page-business-settings .business-settings-section{padding:12px;border-radius:12px;margin-bottom:10px;max-width:100%;overflow:hidden}
  #page-business-settings .business-settings-section-title{font-size:13px;line-height:1.35}
  #page-business-settings .business-settings-section-sub{font-size:11px;line-height:1.45}
  .business-settings-grid{grid-template-columns:1fr}
  #page-business-settings .business-settings-grid{grid-template-columns:1fr!important;gap:10px;min-width:0}
  #page-business-settings .form-group{min-width:0}
  #page-business-settings .form-input,#page-business-settings .form-select,#page-business-settings .form-textarea{min-width:0;max-width:100%}
  #page-business-settings .business-logo-upload{display:grid;grid-template-columns:1fr;gap:10px;padding:10px;min-width:0}
  #page-business-settings .business-logo-preview{width:100%;height:92px}
  #page-business-settings .business-logo-actions{display:grid;grid-template-columns:1fr;gap:8px;width:100%;min-width:0}
  #page-business-settings .business-logo-actions .btn{width:100%;justify-content:center}
  #page-business-settings .mobile-settings-grid{grid-template-columns:1fr!important;gap:8px}
  #page-business-settings .mobile-settings-toggle{width:100%;min-width:0;padding:12px;gap:8px;align-items:center}
  #page-business-settings .mobile-settings-toggle span{min-width:0;overflow-wrap:anywhere;line-height:1.25}
  .business-settings-head{align-items:stretch}
  .business-settings-footer{margin:0;align-items:stretch;flex-direction:column}
  .business-settings-footer .btn{width:100%;justify-content:center}
  #page-business-settings .business-settings-footer{position:sticky;bottom:68px;z-index:10005;padding:10px 12px;align-items:stretch;flex-direction:column;background:rgba(255,255,255,.98);box-shadow:0 -4px 14px rgba(15,23,42,.08)}
  #page-business-settings .business-settings-footer .btn{width:100%;justify-content:center;min-height:42px}
  #page-business-settings .business-settings-status{text-align:center;font-size:11px}
}

.sales-doc-actions{display:flex;gap:8px;flex-wrap:wrap}
.sales-doc-table-wrap{overflow-x:auto}
.sales-doc-type-pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:var(--accent-light);color:var(--accent)}
.sales-doc-status-pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:var(--bg);color:var(--text2);border:1px solid var(--border)}
.sales-doc-status-pill.draft{background:var(--blue-light);color:var(--blue);border-color:rgba(37,99,235,0.15)}
.sales-doc-status-pill.sent{background:var(--accent-light);color:var(--accent);border-color:rgba(124,58,237,0.15)}
.sales-doc-status-pill.issued,.sales-doc-status-pill.accepted,.sales-doc-status-pill.paid{background:var(--green-light);color:var(--green);border-color:rgba(22,163,74,0.15)}
.sales-doc-status-pill.partially_paid{background:var(--yellow-light);color:var(--yellow);border-color:rgba(202,138,4,0.15)}
.sales-doc-status-pill.cancelled,.sales-doc-status-pill.void,.sales-doc-status-pill.rejected{background:var(--red-light);color:var(--red);border-color:rgba(220,38,38,0.15)}
.sales-doc-status-pill.converted{background:#eef2ff;color:#4338ca;border-color:rgba(67,56,202,0.18)}
.sales-doc-list-actions{display:flex;gap:6px;flex-wrap:wrap}
.sales-doc-empty-state{padding:34px 18px;text-align:center;color:var(--text3);line-height:1.7}
.sales-doc-empty-title{font-size:15px;font-weight:900;color:var(--text);margin-bottom:4px}
.sales-doc-empty-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.sales-doc-workspace{display:none;margin-top:16px;grid-template-columns:minmax(320px,0.9fr) minmax(420px,1.1fr);gap:16px;align-items:start;direction:ltr}
.sales-doc-workspace.open{display:grid}
.sales-doc-editor,.sales-doc-preview{direction:rtl;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.sales-doc-panel-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:#fafbfc}
.sales-doc-panel-title{font-size:15px;font-weight:800;color:var(--text)}
.sales-doc-panel-sub{font-size:12px;color:var(--text3);margin-top:2px}
.sales-doc-editor-body{padding:16px}
.sales-doc-section{padding:13px;border:1px solid var(--border);border-radius:12px;background:#fff;margin-bottom:12px}
.sales-doc-section-title{font-size:13px;font-weight:800;color:var(--text);margin-bottom:10px}
.sales-doc-section-sub{font-size:12px;color:var(--text3);line-height:1.5;margin:-4px 0 10px}
.sales-doc-billing-warning{padding:10px 12px;border-radius:12px;background:var(--yellow-light);color:var(--yellow);font-size:12px;font-weight:800;line-height:1.5;margin-bottom:10px}
.sales-doc-billing-warning.blocked{background:var(--red-light);color:var(--red)}
.sales-doc-billing-selector{border:1px solid var(--border);border-radius:12px;background:#fff;padding:10px;margin-top:0}
.sales-doc-billing-selector-title{font-size:12px;font-weight:900;color:var(--text2);margin-bottom:7px}
.sales-doc-billing-hint{font-size:11px;color:var(--text3);line-height:1.5;margin-top:6px}
.sales-doc-billing-group{border:1px solid var(--border);border-radius:14px;background:#fafbfc;padding:12px;margin-top:10px}
.sales-doc-billing-group-title{font-size:13px;font-weight:900;color:var(--text);margin-bottom:3px}
.sales-doc-billing-group-sub{font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:10px}
.sales-doc-billing-group-body{display:flex;flex-direction:column;gap:10px}
.sales-doc-billing-profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.sales-doc-billing-profile-item{border:1px solid #edf0f3;border-radius:10px;background:#fff;padding:8px 10px;font-size:12px;line-height:1.5;color:var(--text2)}
.sales-doc-billing-profile-item strong{display:block;font-size:11px;color:var(--text3);margin-bottom:2px}
.sales-doc-snapshot-note{padding:10px 12px;border-radius:12px;background:#eef2ff;color:#4338ca;font-size:12px;font-weight:800;line-height:1.5;margin-bottom:10px}
.sales-doc-snapshot-note.locked{background:#f3f4f6;color:var(--text2)}
.sales-doc-manual-adjustments{margin-top:10px}
.sales-doc-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.sales-doc-line-list{display:flex;flex-direction:column;gap:10px}
.sales-doc-line-card{border:1px solid var(--border);border-radius:12px;background:var(--bg);padding:10px}
.sales-doc-line-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.sales-doc-line-title{font-size:12px;font-weight:800;color:var(--text2)}
.sales-doc-line-grid{display:grid;grid-template-columns:2fr repeat(4,minmax(86px,1fr));gap:8px;align-items:end}
.sales-doc-preview-body{padding:18px;background:#f8fafc;overflow:auto}
.sales-doc-preview-card{--doc-primary:#7c3aed;background:#fff;border:1px solid var(--border);border-radius:14px;padding:30px;min-height:680px;box-shadow:0 10px 26px rgba(15,23,42,0.08);max-width:794px;margin:0 auto;color:#111827}
.sales-doc-preview-a4{aspect-ratio:210/297;width:100%;max-width:794px}
.sales-doc-preview-top{display:grid;grid-template-columns:minmax(0,1fr) 160px;gap:18px;border-bottom:3px solid var(--doc-primary);padding-bottom:16px;margin-bottom:18px;align-items:start;direction:rtl}
.sales-doc-preview-top>div{direction:rtl}
.sales-doc-preview-logo{max-width:150px;max-height:112px;width:auto;height:auto;object-fit:contain;background:transparent;padding:0;margin:0 auto 0 0;display:block;border:0;border-radius:0}
.sales-doc-preview-logo-placeholder{display:none}
.sales-doc-preview-header-business{font-size:13px;color:#334155;line-height:1.7;margin-bottom:10px}
.sales-doc-preview-title{font-size:26px;font-weight:900;color:var(--doc-primary);letter-spacing:-0.4px}
.sales-doc-preview-number{font-size:13px;color:#64748b;font-weight:700;margin-top:4px}
.sales-doc-preview-meta{font-size:12px;color:#475569;line-height:1.7;margin-top:8px}
.sales-doc-preview-business{text-align:left;font-size:13px;color:#334155;line-height:1.7}
.sales-doc-preview-business-name{font-size:18px;font-weight:900;color:#111827;margin-bottom:4px}
.sales-doc-preview-grid{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:14px}
.sales-doc-preview-box{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:11px 13px;margin-bottom:12px;font-size:13px;color:#334155;line-height:1.7}
.sales-doc-preview-box-title{font-size:11px;font-weight:900;color:#64748b;margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px}
.sales-doc-preview-table{width:100%;border-collapse:collapse;margin:14px 0;table-layout:fixed}
.sales-doc-preview-table th,.sales-doc-preview-table td{font-size:12px;padding:9px 8px;border-bottom:1px solid #e5e7eb;text-align:right;vertical-align:top;word-break:break-word}
.sales-doc-preview-table th{background:#f8fafc;color:#475569;font-weight:900}
.sales-doc-preview-table td:last-child,.sales-doc-preview-table th:last-child{text-align:left}
.sales-doc-preview-mobile-items{display:none;flex-direction:column;gap:8px;margin:12px 0}
.sales-doc-preview-mobile-item{border:1px solid #e5e7eb;border-radius:12px;padding:10px;background:#fff;font-size:12px;color:#334155;line-height:1.6}
.sales-doc-preview-mobile-row{display:flex;justify-content:space-between;gap:10px;border-top:1px solid #f1f5f9;margin-top:6px;padding-top:6px}
.sales-doc-vat-exempt-note{display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:900;margin:8px 0 2px}
.sales-doc-totals-box{margin-right:auto;max-width:300px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;background:#fff}
.sales-doc-total-row{display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#334155;gap:16px}
.sales-doc-total-row:last-child{border-bottom:none;font-weight:900;color:#111827;font-size:16px;background:color-mix(in srgb, var(--doc-primary) 12%, white)}
.sales-doc-preview-footer{border-top:2px solid #e5e7eb;margin-top:18px;padding-top:12px;font-size:12px;color:#64748b;text-align:center;line-height:1.6}
.sales-doc-print-root{direction:rtl}
.sales-doc-sticky-actions{position:sticky;bottom:0;background:rgba(255,255,255,0.96);border-top:1px solid var(--border);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;z-index:2}.sales-doc-workflow-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.sales-doc-sticky-total{font-size:13px;color:var(--text2)}
.sales-doc-sticky-total strong{display:block;font-size:18px;color:var(--accent)}
.sales-doc-locked-note{padding:10px 12px;border-radius:10px;background:var(--yellow-light);color:var(--yellow);font-size:12px;font-weight:700;margin-bottom:12px}
@media (max-width:900px){
  .sales-doc-workspace,.sales-doc-workspace.open{display:flex;flex-direction:column}
  .sales-doc-preview{order:2}.sales-doc-editor{order:1}
  .sales-doc-grid-2,.sales-doc-line-grid,.sales-doc-billing-profile-grid{grid-template-columns:1fr}
  .sales-doc-billing-group{padding:10px}
  .sales-doc-billing-selector{padding:10px}
  .sales-doc-billing-hint,.sales-doc-billing-group-sub{font-size:11px}
  .sales-doc-actions{width:100%}.sales-doc-actions .btn{flex:1;justify-content:center}
  .sales-doc-table-wrap table{min-width:720px}
  .sales-doc-preview-card{min-height:auto;padding:14px;aspect-ratio:auto}
  .sales-doc-preview-top{grid-template-columns:minmax(0,1fr) 120px}
  .sales-doc-preview-grid{grid-template-columns:1fr}
  .sales-doc-preview-business{text-align:left}
  .sales-doc-preview-logo{max-width:116px;max-height:88px}
  .sales-doc-preview-table{display:table}
  .sales-doc-preview-mobile-items{display:none}
  .sales-doc-totals-box{max-width:none;width:100%}
  .sales-doc-sticky-actions{margin:0 -16px -16px;align-items:stretch;flex-direction:column}
  .sales-doc-sticky-actions .btn{justify-content:center}
}
@media print{
  body.sales-doc-printing *{visibility:hidden!important}
  body.sales-doc-printing #sales-document-preview,body.sales-doc-printing #sales-document-preview *{visibility:visible!important}
  body.sales-doc-printing #sales-document-preview{position:absolute;inset:0;background:#fff!important;padding:0!important;overflow:visible!important}
  body.sales-doc-printing .sales-doc-preview-card{box-shadow:none!important;border:none!important;border-radius:0!important;max-width:none!important;width:210mm!important;min-height:297mm!important;margin:0!important;padding:16mm!important}
  body.sales-doc-printing .sales-doc-preview-body{background:#fff!important}
  body.sales-doc-printing .sales-doc-preview-table{display:table!important}
  body.sales-doc-printing .sales-doc-preview-mobile-items{display:none!important}
  @page{size:A4;margin:0}
}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:11050;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal-overlay.open{display:flex}
.modal{background:var(--white);border-radius:16px;width:620px;max-width:96vw;max-height:92vh;overflow-y:auto;box-shadow:var(--shadow-md)}
.modal-header{padding:18px 24px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--white);z-index:1}
.modal-header h2{font-size:16px;font-weight:800;color:var(--text)}
.modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);padding:4px;border-radius:6px}
.modal-close:hover{background:var(--bg)}
.modal-body{padding:18px 24px}
.modal-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;position:sticky;bottom:0;background:var(--white);flex-wrap:wrap}
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
.module-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);cursor:pointer;transition:all 0.12s}
.module-toggle:hover{border-color:var(--accent);background:var(--accent-light)}
.module-toggle.checked{border-color:var(--accent);background:var(--accent-light);box-shadow:0 0 0 2px rgba(124,58,237,0.08)}
.module-toggle input{display:none}
.module-toggle-text{display:flex;flex-direction:column;gap:4px;min-width:0}
.module-toggle-title{font-size:13px;font-weight:700;color:var(--text)}
.module-toggle-status{font-size:11px;font-weight:700;color:var(--text3)}
.module-toggle.checked .module-toggle-title,.module-toggle.checked .module-toggle-status{color:var(--accent)}
.module-toggle-pill{display:inline-flex;align-items:center;justify-content:center;min-width:54px;padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--white);font-size:11px;font-weight:800;color:var(--text3)}
.module-toggle.checked .module-toggle-pill{border-color:rgba(124,58,237,0.25);background:var(--accent);color:#fff}
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
.force-password-page{display:none;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#ede9fe 0%,#f5f3ff 50%,#eff6ff 100%)}
.force-password-card{background:var(--white);border:1px solid var(--border);border-radius:20px;padding:40px;width:min(440px,100%);max-width:100%;box-shadow:var(--shadow-md)}
.force-password-title{font-size:22px;font-weight:800;color:var(--text);margin-bottom:8px;text-align:center}
.force-password-sub{font-size:14px;color:var(--text2);line-height:1.6;text-align:center;margin-bottom:18px}
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
.monthly-client-report-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border);background:#fafbfc}
.monthly-client-report-title{font-size:14px;font-weight:900;color:var(--text)}
.monthly-client-report-sub{font-size:12px;color:var(--text3);line-height:1.5;margin-top:3px}
.monthly-client-report-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.monthly-client-report-actions .form-input{width:150px;background:#fff}
.monthly-client-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:12px 16px;border-bottom:1px solid var(--border)}
.monthly-client-summary-card{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:10px;text-align:center}
.monthly-client-summary-value{font-size:17px;font-weight:900;color:var(--accent)}
.monthly-client-summary-label{font-size:11px;color:var(--text3);margin-top:3px}
.monthly-client-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.monthly-client-table{min-width:760px}
.monthly-client-table td,.monthly-client-table th{font-size:12px}
@media (max-width:768px){.monthly-client-report-head{padding:12px}.monthly-client-report-actions{display:grid;grid-template-columns:1fr;width:100%}.monthly-client-report-actions .form-input,.monthly-client-report-actions .btn{width:100%;justify-content:center}.monthly-client-summary{grid-template-columns:1fr 1fr;padding:10px}.monthly-client-table{min-width:680px}}
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

.customer-billing-panel{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:16px;overflow:hidden}
.customer-billing-header{padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fafbfc}
.customer-billing-title{font-size:16px;font-weight:900;color:var(--text)}
.customer-billing-subtitle{font-size:12px;color:var(--text3);line-height:1.5;margin-top:4px}
.customer-billing-tabs{display:flex;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--white);overflow-x:auto}
.customer-billing-tab{border:1px solid var(--border);background:#fff;color:var(--text2);border-radius:999px;padding:8px 12px;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap}
.customer-billing-tab.active{background:var(--accent);border-color:var(--accent);color:#fff}
.customer-billing-content{padding:16px;display:flex;flex-direction:column;gap:14px}
.customer-billing-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.customer-billing-grid.single{grid-template-columns:1fr}
.customer-billing-section{border:1px solid var(--border);border-radius:12px;background:#fff;padding:14px;display:flex;flex-direction:column;gap:12px}
.customer-billing-section-title{font-size:14px;font-weight:900;color:var(--text)}
.customer-billing-section-sub{font-size:12px;color:var(--text3);line-height:1.5}
.customer-billing-actions{position:sticky;bottom:0;background:rgba(255,255,255,.96);border-top:1px solid var(--border);padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;z-index:2}
.customer-billing-status{font-size:12px;color:var(--text3);line-height:1.5}
.customer-billing-permission{border:1px solid #fde68a;background:#fffbeb;color:#92400e;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:700;line-height:1.6}
.customer-billing-list{display:flex;flex-direction:column;gap:10px}
.customer-billing-card{border:1px solid var(--border);border-radius:12px;background:#fafbfc;padding:12px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.customer-billing-card-main{flex:1;display:flex;flex-direction:column;gap:7px;min-width:0}
.customer-billing-card-title{font-size:14px;font-weight:900;color:var(--text)}
.customer-billing-card-meta{font-size:12px;color:var(--text2);line-height:1.5;display:flex;gap:8px;flex-wrap:wrap}
.customer-billing-card-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}
.customer-billing-inline-form{border:1px solid var(--accent);border-radius:12px;background:#fbf8ff;padding:14px;display:flex;flex-direction:column;gap:12px}
.customer-billing-empty{padding:18px;border:1px dashed var(--border);border-radius:12px;background:#f8fafc;color:var(--text3);text-align:center;font-size:13px;line-height:1.6}
.customer-billing-chip{display:inline-flex;align-items:center;gap:4px;border-radius:999px;background:#eef2ff;color:#4338ca;padding:4px 8px;font-size:11px;font-weight:800}
.customer-billing-chip.muted{background:#f3f4f6;color:var(--text3)}
.customer-billing-chip.green{background:#dcfce7;color:#166534}
.customer-billing-chip.orange{background:#ffedd5;color:#c2410c}
.customer-financial-panel{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:16px;overflow:hidden}
.customer-financial-header{padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#f8fafc}
.customer-financial-title{font-size:16px;font-weight:900;color:var(--text)}
.customer-financial-subtitle{font-size:12px;color:var(--text3);line-height:1.5;margin-top:4px}
.customer-financial-content{padding:16px;display:flex;flex-direction:column;gap:14px}
.customer-financial-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.customer-financial-card{border:1px solid var(--border);border-radius:12px;background:#fff;padding:12px;min-width:0}
.customer-financial-label{font-size:11px;font-weight:900;color:var(--text3);line-height:1.4}
.customer-financial-value{font-size:20px;font-weight:900;color:var(--text);margin-top:4px;word-break:break-word}
.customer-financial-note{font-size:11px;color:var(--text3);line-height:1.5;margin-top:4px}
.customer-financial-section{border:1px solid var(--border);border-radius:12px;background:#fff;padding:13px}
.customer-financial-section-title{font-size:13px;font-weight:900;color:var(--text);margin-bottom:9px}
.customer-financial-list{display:flex;flex-direction:column;gap:8px}
.customer-financial-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid #f1f5f9;padding-bottom:8px;font-size:12px;color:var(--text2);line-height:1.5}
.customer-financial-row:last-child{border-bottom:none;padding-bottom:0}
.customer-financial-row-main{font-weight:800;color:var(--text)}
.customer-financial-row-meta{color:var(--text3);font-size:11px;margin-top:2px}
.customer-financial-row-amount{font-weight:900;color:var(--accent);white-space:nowrap}
.customer-financial-status-grid{display:flex;gap:7px;flex-wrap:wrap}
.customer-financial-status-chip{display:inline-flex;gap:5px;align-items:center;border:1px solid var(--border);border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800;background:#fff;color:var(--text2)}
.customer-financial-warning{padding:10px 12px;border-radius:12px;background:var(--yellow-light);color:var(--yellow);font-size:12px;font-weight:800;line-height:1.5}
.customer-financial-warning.blocked{background:var(--red-light);color:var(--red)}
.customer-financial-empty{padding:16px;border:1px dashed var(--border);border-radius:12px;background:#f8fafc;color:var(--text3);text-align:center;font-size:13px;line-height:1.6}
.strategic-contacts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.strategic-contact-card{border:1px solid var(--border);border-radius:14px;background:#fff;padding:14px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:all .12s}
.strategic-contact-card:hover{border-color:var(--accent);box-shadow:0 2px 10px rgba(124,58,237,.12)}
.strategic-contact-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.strategic-contact-name{font-size:15px;font-weight:900;color:var(--text);line-height:1.35}
.strategic-contact-person{font-size:12px;color:var(--text2);margin-top:3px;line-height:1.5}
.strategic-contact-meta{font-size:12px;color:var(--text3);line-height:1.5;display:flex;gap:6px;flex-wrap:wrap}
.strategic-contact-actions{display:flex;gap:7px;flex-wrap:wrap}
.strategic-contact-note{font-size:12px;color:var(--text2);line-height:1.5;background:#f8fafc;border-radius:10px;padding:8px}
.strategic-contact-linked-notice{border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:12px;padding:10px 12px;font-size:12px;font-weight:800;line-height:1.5;margin-bottom:12px}
.strategic-contact-activities{margin-top:16px;border-top:1px solid var(--line);padding-top:14px}
.strategic-contact-activity-list{display:flex;flex-direction:column;gap:8px;margin:10px 0}
.strategic-contact-activity-item{border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}
.strategic-contact-activity-title{font-weight:800;font-size:13px;color:var(--text)}
.strategic-contact-activity-meta{font-size:12px;color:var(--text3);margin-top:4px}
.strategic-contact-activity-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:end}
.strategic-contact-seasonal-tags{display:flex;flex-wrap:wrap;gap:8px}
.strategic-contact-seasonal-tags label{display:flex;align-items:center;gap:5px;font-size:12px;border:1px solid var(--line);border-radius:999px;padding:6px 9px;background:#fff}
.strategic-contact-template-textarea{min-height:190px;direction:rtl}
.strategic-contact-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.strategic-contact-form-grid.single{grid-template-columns:1fr}
@media (max-width:900px){.strategic-contacts-grid,.strategic-contact-form-grid,.strategic-contact-activity-form{grid-template-columns:1fr}.strategic-contact-card{padding:12px}.strategic-contact-actions .btn{flex:1;justify-content:center}}
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

  .customer-billing-header,
  .customer-billing-actions,
  .customer-billing-card {
    align-items: stretch;
  }

  .customer-billing-grid {
    grid-template-columns: 1fr !important;
  }

  .customer-billing-tabs {
    padding: 10px 12px;
  }

  .customer-billing-content {
    padding: 12px;
  }

  .customer-billing-card {
    flex-direction: column;
  }

  .customer-billing-card-actions,
  .customer-billing-actions .btn {
    width: 100%;
  }

  .customer-financial-grid {
    grid-template-columns: 1fr;
  }

  .customer-financial-row {
    flex-direction: column;
  }

  .customer-financial-row-amount {
    white-space: normal;
  }

  .customer-billing-card-actions .btn {
    flex: 1;
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
  html,
  body {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  #app,
  #main,
  .page {
    width: 100% !important;
    max-width: 100vw !important;
    min-width: 0 !important;
    overflow-x: hidden !important;
  }

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
    max-width: 100vw !important;
    min-width: 0 !important;
    flex-direction: row !important;
    z-index: 9999 !important;
    border-top: 1px solid var(--border) !important;
    overflow: hidden !important;
  }

  .sidebar-logo,
  .nav-section,
  .sidebar-bottom,
  #gcal-status {
    display: none !important;
  }

  #sidebar .nav-item {
    flex: 1 1 0 !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: 20vw !important;
    margin: 0 !important;
    padding: 7px 2px !important;
    border-radius: 0 !important;
    flex-direction: column !important;
    justify-content: center !important;
    font-size: 11px !important;
    gap: 2px !important;
    overflow: hidden !important;
  }

  #sidebar .nav-icon {
    width: auto !important;
    max-width: 100% !important;
    line-height: 1 !important;
    font-size: 17px !important;
  }

  #sidebar .nav-label {
    max-width: 100% !important;
    min-width: 0 !important;
    overflow: hidden !important;
    text-overflow: clip !important;
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
.team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.team-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;display:flex;flex-direction:column;gap:12px}
.team-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.team-card-name{font-size:16px;font-weight:800;color:var(--text)}
.team-card-meta{font-size:13px;color:var(--text2);line-height:1.6;word-break:break-word}
.team-card-actions{display:flex;flex-wrap:wrap;gap:8px}
.team-role-badge,.team-status-badge{display:inline-flex;align-items:center;justify-content:center;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:800}
.team-role-badge.owner{background:#fef3c7;color:#92400e}
.team-role-badge.admin{background:#ede9fe;color:#6d28d9}
.team-role-badge.manager{background:#dbeafe;color:#1d4ed8}
.team-role-badge.employee{background:#f3f4f6;color:#374151}
.team-status-badge.active{background:var(--green-light);color:var(--green)}
.team-status-badge.inactive{background:var(--red-light);color:var(--red)}
.team-card-badges{display:flex;flex-wrap:wrap;gap:8px}
.team-inline-note{font-size:12px;color:var(--text3)}
.team-empty{padding:28px 14px;text-align:center;color:var(--text3)}
@media (max-width:768px){
  .team-grid{grid-template-columns:1fr}
  .team-card{padding:14px}
  .team-card-actions .btn{flex:1 1 calc(50% - 8px);justify-content:center}
  .super-admin-summary{align-items:flex-start}
  #super-admin-tenant-modal{align-items:stretch;justify-content:center;padding:0}
  .super-admin-modal{width:100vw!important;max-width:100vw!important;height:100dvh;max-height:100dvh!important;border-radius:0;display:flex;flex-direction:column;overflow:hidden}
  .super-admin-modal .modal-header{flex:0 0 auto;padding:12px 14px!important}
  .super-admin-modal .modal-body{flex:1 1 auto;min-height:0;overflow-y:auto;padding:12px!important;-webkit-overflow-scrolling:touch}
  .super-admin-modal .modal-footer{flex:0 0 auto;padding:10px 14px!important}
  .super-admin-owner-grid,.super-admin-meta-grid,.admin-module-grid,.check-grid,.owner-setup-quick-grid{grid-template-columns:1fr!important}
  .super-admin-action-row{display:grid;grid-template-columns:1fr;gap:8px;justify-content:stretch}
  .super-admin-action-row .btn,.super-admin-modal .modal-footer .btn{width:100%;justify-content:center;min-width:0}
  .super-admin-module-row .super-admin-action-row{grid-template-columns:1fr 1fr}
  .super-admin-section{padding:12px;overflow:visible}
  .module-toggle{align-items:flex-start;gap:8px;padding:11px 12px;min-width:0}
  .module-toggle-title,.module-toggle-status{overflow-wrap:anywhere}
  .module-toggle-pill{flex:0 0 auto}
}



/* ===== CRM Mobile Navigation ===== */
.mobile-crm-topbar{display:none}
.mobile-nav-overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,.38);z-index:10020}
.mobile-nav-overlay.open{display:block}
.mobile-nav-drawer{position:fixed;top:0;right:0;bottom:0;width:min(86vw,340px);background:var(--white);box-shadow:-8px 0 24px rgba(15,23,42,.18);z-index:10030;transform:translateX(110%);transition:transform .22s ease;display:flex;flex-direction:column}
.mobile-nav-drawer.open{transform:translateX(0)}
.mobile-nav-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--border);background:#fafbfc}
.mobile-nav-title{font-size:16px;font-weight:900;color:var(--text)}
.mobile-nav-list{padding:10px;overflow-y:auto;display:flex;flex-direction:column;gap:4px}
.mobile-nav-link{display:flex;align-items:center;gap:10px;width:100%;border:0;background:transparent;border-radius:12px;padding:12px 12px;font-family:var(--font);font-size:14px;font-weight:800;color:var(--text2);cursor:pointer;text-align:right}
.mobile-nav-link:hover,.mobile-nav-link.active{background:var(--accent-light);color:var(--accent)}
.mobile-settings-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.mobile-settings-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:#fff;cursor:pointer;font-weight:800;color:var(--text2)}
.mobile-settings-toggle.checked{border-color:rgba(124,58,237,.35);background:var(--accent-light);color:var(--accent)}
.mobile-settings-toggle input{display:none}
.mobile-settings-hint{font-size:12px;color:var(--text3);line-height:1.5;margin-top:10px}
@media (max-width:768px){
  body.crm-shell .mobile-crm-topbar{display:flex;position:fixed;top:0;right:0;left:0;height:54px;background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);z-index:10010;align-items:center;justify-content:space-between;padding:8px 12px;box-shadow:0 1px 8px rgba(15,23,42,.06)}
  body.crm-shell .mobile-menu-btn{width:40px;height:40px;border:1px solid var(--border);border-radius:12px;background:#fff;color:var(--text);font-size:22px;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
  body.crm-shell .mobile-crm-title{font-size:14px;font-weight:900;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100vw - 120px)}
  body.crm-shell #main{padding-top:66px!important;padding-bottom:92px!important}
  body.crm-shell #sidebar{overflow:hidden!important;justify-content:stretch;box-shadow:0 -2px 14px rgba(15,23,42,.08)}
  body.crm-shell #sidebar .nav-item.mobile-bottom-hidden{display:none!important}
  body.crm-shell #sidebar .nav-item.mobile-bottom-visible{display:flex!important;flex:1 1 0!important;width:auto!important;min-width:0!important;max-width:20vw!important}
  body.crm-shell #sidebar .nav-badge{display:none!important}
  body.crm-shell #sidebar .nav-item.mobile-bottom-visible .nav-label{font-size:0}
  body.crm-shell #sidebar .nav-item.mobile-bottom-visible .nav-label::after{content:attr(data-mobile);font-size:10px;line-height:1.05;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:normal;text-align:center;overflow:hidden}
  body.crm-shell #page-business-settings{min-width:0;max-width:100%;overflow-x:hidden}
  body.crm-shell #page-business-settings .page-header{gap:8px!important;margin-bottom:10px!important;min-width:0}
  body.crm-shell #page-business-settings .page-title{font-size:18px!important;line-height:1.25;min-width:0;overflow-wrap:anywhere}
  body.crm-shell #page-business-settings .page-title small{display:block;margin-right:0;font-size:11px!important;line-height:1.4;overflow-wrap:anywhere}
  body.crm-shell #page-business-settings .page-header .btn{width:100%;justify-content:center;min-height:40px}
  body.crm-shell #page-business-settings .business-settings-layout{display:block;width:100%;max-width:100%;min-width:0;overflow:visible}
  body.crm-shell #page-business-settings .business-settings-card{border-radius:14px;overflow:visible;max-width:100%;min-width:0}
  body.crm-shell #page-business-settings .business-settings-head{padding:12px;flex-direction:column;align-items:stretch!important;gap:8px}
  body.crm-shell #page-business-settings .business-settings-title{font-size:14px;line-height:1.35}
  body.crm-shell #page-business-settings .business-settings-sub{font-size:11px;line-height:1.45}
  body.crm-shell #page-business-settings .business-settings-body{padding:10px}
  body.crm-shell #page-business-settings .business-settings-section{padding:12px;border-radius:12px;margin-bottom:10px;max-width:100%;overflow:hidden}
  body.crm-shell #page-business-settings .business-settings-section-title{font-size:13px;line-height:1.35}
  body.crm-shell #page-business-settings .business-settings-section-sub{font-size:11px;line-height:1.45}
  body.crm-shell #page-business-settings .business-settings-grid{grid-template-columns:1fr!important;gap:10px;min-width:0}
  body.crm-shell #page-business-settings .form-group{min-width:0}
  body.crm-shell #page-business-settings .form-input,body.crm-shell #page-business-settings .form-select,body.crm-shell #page-business-settings .form-textarea{min-width:0;max-width:100%}
  body.crm-shell #page-business-settings .business-logo-upload{display:grid;grid-template-columns:1fr;gap:10px;padding:10px;min-width:0}
  body.crm-shell #page-business-settings .business-logo-preview{width:100%;height:92px}
  body.crm-shell #page-business-settings .business-logo-actions{display:grid;grid-template-columns:1fr;gap:8px;width:100%;min-width:0}
  body.crm-shell #page-business-settings .business-logo-actions .btn{width:100%;justify-content:center}
  body.crm-shell #page-business-settings .mobile-settings-grid{grid-template-columns:1fr!important;gap:8px}
  body.crm-shell #page-business-settings .mobile-settings-toggle{width:100%;min-width:0;padding:12px;gap:8px;align-items:center}
  body.crm-shell #page-business-settings .mobile-settings-toggle span{min-width:0;overflow-wrap:anywhere;line-height:1.25}
  body.crm-shell #page-business-settings .business-settings-footer{position:sticky;bottom:68px;z-index:10005;padding:10px 12px;align-items:stretch;flex-direction:column;background:rgba(255,255,255,.98);box-shadow:0 -4px 14px rgba(15,23,42,.08)}
  body.crm-shell #page-business-settings .business-settings-footer .btn{width:100%;justify-content:center;min-height:42px}
  body.crm-shell #page-business-settings .business-settings-status{text-align:center;font-size:11px}
  body.crm-shell #sidebar::-webkit-scrollbar{display:none}
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
<div id="force-password-page" class="force-password-page">
  <div class="force-password-card">
    <div class="login-top">
      <div class="login-icon">🔐</div>
      <div class="force-password-title">החלפת סיסמה ראשונית</div>
      <div class="force-password-sub">הסיסמה הראשונית שלך זמנית. יש להחליף אותה לפני הכניסה למערכת.</div>
    </div>
    <div class="login-error" id="force-password-error"></div>
    <div class="form-group"><label class="form-label">סיסמה חדשה</label><input class="form-input" type="password" id="force-password-new" placeholder=""></div>
    <div class="form-group"><label class="form-label">אישור סיסמה חדשה</label><input class="form-input" type="password" id="force-password-confirm" placeholder=""></div>
    <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;margin-top:6px" id="force-password-btn">החלף סיסמה</button>
  </div>
</div>
<div id="app" style="display:none">
  <div id="mobile-crm-topbar" class="mobile-crm-topbar">
    <button type="button" class="mobile-menu-btn" id="mobile-nav-open" aria-label="פתח תפריט">☰</button>
    <div class="mobile-crm-title" id="mobile-crm-title">Comics Events CRM</div>
    <span style="width:40px"></span>
  </div>
  <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
  <div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-hidden="true">
    <div class="mobile-nav-head"><div class="mobile-nav-title">כל המודולים</div><button type="button" class="modal-close" id="mobile-nav-close">✕</button></div>
    <div class="mobile-nav-list" id="mobile-nav-list"></div>
  </div>
  <div id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-row">
        <div class="logo-icon">🎈</div>
        <div><div class="logo-title" id="shell-logo-title">אטרקציות CRM</div><div class="logo-sub" id="shell-logo-sub">ניהול אירועים</div></div>
      </div>
    </div>
    <div class="nav-section">תפריט</div>
    <div class="nav-item active" id="nav-dashboard"><span class="nav-icon">📊</span> <span class="nav-label" data-mobile="דאשבורד">דאשבורד</span></div>
    <div class="nav-item" id="nav-leads"><span class="nav-icon">👥</span> <span class="nav-label" data-mobile="לקוחות">לקוחות</span> <span class="nav-badge" id="nav-leads-count" style="display:none">0</span></div>
    <div class="nav-item" id="nav-employees"><span class="nav-icon">🧑‍💼</span> <span class="nav-label" data-mobile="עובדים">עובדים</span></div>
    <div class="nav-item" id="nav-team" style="display:none"><span class="nav-icon">👤</span> <span class="nav-label" data-mobile="צוות">צוות</span></div>
    <div class="nav-item" id="nav-products"><span class="nav-icon">📦</span> <span class="nav-label" data-mobile="מוצרים">מוצרים</span></div>
    <div class="nav-item" id="nav-shopping"><span class="nav-icon">🛒</span> <span class="nav-label" data-mobile="רשימת קניות">רשימות קניות</span></div>
    <div class="nav-item" id="nav-strategic-contacts"><span class="nav-icon">🤝</span> <span class="nav-label" data-mobile="קשרים">קשרים אסטרטגיים</span></div>
    <div class="nav-item" id="nav-sales-documents"><span class="nav-icon">🧾</span> <span class="nav-label" data-mobile="מסמכים">מסמכי מכירה</span></div>
    <div class="nav-item" id="nav-business-settings"><span class="nav-icon">⚙️</span> <span class="nav-label" data-mobile="הגדרות">הגדרות עסק</span></div>
    <div class="nav-item" id="nav-calendar"><span class="nav-icon">📅</span> <span class="nav-label" data-mobile="יומן אירועים">יומן אירועים</span></div>
    <div class="nav-item" id="nav-archive"><span class="nav-icon">🗂️</span> <span class="nav-label" data-mobile="ארכיון">ארכיון אירועים</span></div>
    <div class="nav-item" id="nav-super-admin" style="display:none"><span class="nav-icon">🛠️</span> <span class="nav-label" data-mobile="Admin">Super Admin</span></div>
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
      <div class="dash-section" id="monthly-client-report" style="margin-bottom:18px">
        <div class="monthly-client-report-head">
          <div><div class="monthly-client-report-title">📊 סיכום אירועים חודשי לפי לקוח</div><div class="monthly-client-report-sub">מרכז את כל אירועי החודש לפי לקוח, כולל עתידיים, ומאפשר יצוא מהיר לאקסל.</div></div>
          <div class="monthly-client-report-actions">
            <input class="form-input" type="month" id="monthly-client-month">
            <button class="btn btn-secondary" id="monthly-client-refresh">רענן</button>
            <button class="btn btn-primary" id="monthly-client-export">יצוא לאקסל</button>
          </div>
        </div>
        <div id="monthly-client-summary"><div class="dash-empty">טוען סיכום חודשי...</div></div>
        <div class="monthly-client-table-wrap"><table class="monthly-client-table"><thead><tr><th>לקוח</th><th>טלפון</th><th>אירועים</th><th>עתידיים</th><th>ראשון</th><th>אחרון</th><th>סה״כ</th><th>יתרה</th></tr></thead><tbody id="monthly-client-body"><tr class="empty-row"><td colspan="8">טוען...</td></tr></tbody></table></div>
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
    <div id="page-strategic-contacts" class="page">
      <div class="page-header">
        <div class="page-title">קשרים אסטרטגיים <small>מקורות קשר, שיתופי פעולה ומעקב יזום</small></div>
        <button class="btn btn-primary" id="btn-new-strategic-contact">+ קשר אסטרטגי חדש</button>
      </div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש לפי ארגון / איש קשר / עיר / תגיות..." id="strategic-contacts-search">
          <select class="filter-select" id="strategic-contacts-category-filter"><option value="">כל הקטגוריות</option></select>
          <select class="filter-select" id="strategic-contacts-status-filter"><option value="">כל הסטטוסים</option></select>
          <select class="filter-select" id="strategic-contacts-priority-filter"><option value="">כל העדיפויות</option></select>
          <select class="filter-select" id="strategic-contacts-follow-up-filter"><option value="">כל המעקבים</option></select>
          <select class="filter-select" id="strategic-contacts-seasonal-filter"><option value="">כל העונות</option></select>
          <select class="filter-select" id="strategic-contacts-value-filter"><option value="">כל ערכי הקשר</option></select>
        </div>
        <div id="strategic-contacts-grid" style="padding:16px"><div class="dash-empty">טוען...</div></div>
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
    <div id="page-team" class="page">
      <div class="page-header">
        <div class="page-title">צוות <small>ניהול משתמשים והרשאות לעסק</small></div>
        <button class="btn btn-primary" id="btn-new-team-member" style="display:none">+ הוסף משתמש</button>
      </div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש לפי שם / אימייל..." id="team-search">
          <select class="filter-select" id="team-status-filter">
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעילים בלבד</option>
            <option value="inactive">לא פעילים</option>
          </select>
          <select class="filter-select" id="team-role-filter">
            <option value="">כל התפקידים</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div id="team-grid" style="padding:16px">
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


    <div id="page-business-settings" class="page">
      <div class="page-header">
        <div class="page-title">הגדרות עסק <small>פרטי עסק, מע״מ וברירות מחדל למסמכים</small></div>
        <button class="btn btn-secondary" id="btn-refresh-business-settings">רענן</button>
      </div>
      <div class="business-settings-layout">
        <div class="business-settings-card">
          <div class="business-settings-head">
            <div>
              <div class="business-settings-title">פרטי העסק למסמכי מכירה</div>
              <div class="business-settings-sub">הגדרות אלו ישמשו כברירת מחדל למסמכים חדשים בלבד. מסמכים קיימים/נעולים לא ישתנו.</div>
            </div>
            <span class="badge badge-blue" id="business-settings-role-badge">טוען...</span>
          </div>
          <div class="business-settings-body" id="business-settings-body"><div class="dash-empty">טוען...</div></div>
          <div class="business-settings-footer" id="business-settings-footer" style="display:none"></div>
        </div>
      </div>
    </div>
    <div id="page-sales-documents" class="page">
      <div class="page-header">
        <div class="page-title">מסמכי מכירה <small>הצעות מחיר וחשבוניות</small></div>
        <div class="sales-doc-actions">
          <button class="btn btn-secondary" id="btn-refresh-sales-documents">רענן</button>
          <button class="btn btn-primary" id="btn-new-sales-quote">צור הצעת מחיר</button>
          <button class="btn btn-primary" id="btn-new-sales-invoice">צור חשבונית</button>
        </div>
      </div>
      <div class="table-card">
        <div class="table-toolbar">
          <input class="search-input" type="text" placeholder="חיפוש מספר / לקוח / טלפון..." id="sales-documents-search">
          <select class="filter-select" id="sales-documents-type-filter"><option value="">כל הסוגים</option><option value="quote">הצעות מחיר</option><option value="invoice">חשבוניות</option></select>
          <select class="filter-select" id="sales-documents-status-filter"><option value="">כל הסטטוסים</option><option value="draft">טיוטה</option><option value="sent">נשלח</option><option value="accepted">אושר</option><option value="rejected">נדחה</option><option value="cancelled">בוטל</option><option value="issued">הונפק</option><option value="paid">שולם</option><option value="partially_paid">שולם חלקית</option><option value="void">מבוטל</option></select>
        </div>
        <div class="sales-doc-table-wrap">
          <table><thead><tr><th>מספר</th><th>סוג</th><th>לקוח</th><th>סטטוס</th><th>סה״כ</th><th>תאריך</th><th></th></tr></thead><tbody id="sales-documents-body"><tr class="empty-row"><td colspan="7">טוען...</td></tr></tbody></table>
        </div>
      </div>
      <div class="sales-doc-workspace" id="sales-document-workspace">
        <div class="sales-doc-preview">
          <div class="sales-doc-panel-head"><div><div class="sales-doc-panel-title">תצוגה מקדימה</div><div class="sales-doc-panel-sub">מסמך חי להדפסה — PDF יגיע בהמשך</div></div><button class="btn btn-secondary btn-sm" id="sales-document-print-preview">הדפס תצוגה</button></div>
          <div class="sales-doc-preview-body" id="sales-document-preview"><div class="dash-empty">בחר או צור מסמך</div></div>
        </div>
        <div class="sales-doc-editor">
          <div class="sales-doc-panel-head"><div><div class="sales-doc-panel-title" id="sales-document-editor-title">עורך מסמך</div><div class="sales-doc-panel-sub">טיוטת quote/invoice משותפת</div></div><button class="btn btn-ghost btn-sm" id="sales-document-close-editor">סגור</button></div>
          <div class="sales-doc-editor-body" id="sales-document-editor-body"></div>
          <div class="sales-doc-sticky-actions" id="sales-document-sticky-actions" style="display:none"></div>
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
        <button class="btn btn-primary" id="super-admin-open-create-modal">פתיחת עסק חדש</button>
      </div>
      <div class="table-card">
        <div class="super-admin-summary">
          <div>
            <div class="super-admin-summary-title">ניהול עסקים ומודולים</div>
            <div class="super-admin-summary-sub">פתח עסק חדש, ערוך פרטי עסק, נהל מודולים ובצע פעולות בעלים מתוך מסך אחד.</div>
          </div>
        </div>
        <table>
          <thead><tr><th>ID</th><th>שם</th><th>Slug</th><th>סטטוס</th><th>נוצר</th><th></th></tr></thead>
          <tbody id="super-admin-tenants-body"><tr class="empty-row"><td colspan="6">טוען...</td></tr></tbody>
        </table>
      </div>
      <div class="table-card" style="margin-top:16px">
        <div class="super-admin-summary">
          <div>
            <div class="super-admin-summary-title">כלי ניקוי מערכת</div>
            <div class="super-admin-summary-sub">מחיקה מלאה — לא ניתן לשחזר. פעולות מוצגות רק אחרי בדיקת תלותים וחסימות.</div>
          </div>
          <button class="btn btn-secondary" id="super-admin-refresh-cleanup">רענן</button>
        </div>
        <div class="filters-row" style="padding:0 16px 12px">
          <select class="filter-select" id="super-admin-cleanup-entity">
            <option value="tenants">Tenants</option>
            <option value="users">Users</option>
            <option value="employees">Employees</option>
            <option value="leads">Events / Leads</option>
            <option value="contacts">Customers</option>
            <option value="products">Products</option>
            <option value="strategic_contacts">Strategic Contacts</option>
            <option value="shopping">Shopping</option>
            <option value="sales_documents">Draft/Test Sales Docs</option>
            <option value="orphans">Orphans / System leftovers</option>
            <option value="all">All</option>
          </select>
          <input class="filter-input" id="super-admin-cleanup-search" placeholder="חיפוש לפי שם / אימייל / ID">
        </div>
        <table>
          <thead><tr><th>סוג</th><th>רשומה</th><th>סטטוס</th><th>תלויות</th><th>חסימה / סיבה</th><th>פעולות</th></tr></thead>
          <tbody id="super-admin-cleanup-body"><tr class="empty-row"><td colspan="6">טוען...</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<div class="modal-overlay" id="super-admin-create-modal">
  <div class="modal super-admin-modal">
    <div class="modal-header"><h2>פתיחת עסק חדש</h2><button class="modal-close" id="super-admin-create-close">✕</button></div>
    <div class="modal-body">
      <div class="super-admin-section">
        <div class="super-admin-section-header">
          <div>
            <div class="super-admin-section-title">פרטי העסק והבעלים</div>
            <div class="super-admin-section-sub">מלא את הפרטים הבסיסיים בלבד. כתובת המערכת והגדרות ברירת המחדל ייווצרו אוטומטית.</div>
          </div>
        </div>
        <div class="form-row" style="margin-bottom:10px">
          <div class="form-group" style="margin-bottom:0"><label class="form-label">שם העסק *</label><input class="form-input" id="super-admin-create-name" placeholder="שם העסק"></div>
          <div class="form-group" style="margin-bottom:0"><label class="form-label">שם איש קשר *</label><input class="form-input" id="super-admin-create-contact-name" placeholder="ישראל ישראלי"></div>
        </div>
        <div class="form-row" style="margin-bottom:10px">
          <div class="form-group" style="margin-bottom:0"><label class="form-label">טלפון איש קשר *</label><input class="form-input" id="super-admin-create-contact-phone" placeholder="050-0000000" type="tel"></div>
          <div class="form-group" style="margin-bottom:0"><label class="form-label">אימייל איש קשר *</label><input class="form-input" id="super-admin-create-contact-email" placeholder="owner@example.com" type="email"></div>
        </div>
        <div class="form-group" style="margin-bottom:0"><label class="form-label">סיסמה ראשונית *</label><input class="form-input" id="super-admin-create-password" placeholder="סיסמה ראשונית" type="password"></div>
      </div>
      <div class="super-admin-section" style="margin-bottom:0">
        <div class="super-admin-section-header">
          <div>
            <div class="super-admin-section-title">מודולים פעילים</div>
            <div class="super-admin-section-sub">בחר אילו אזורים יהיו זמינים לבעל העסק מיד אחרי ההקמה.</div>
          </div>
        </div>
        <div class="check-grid" id="super-admin-create-modules">
          <label class="module-toggle checked"><input type="checkbox" data-module-key="leads" checked><span class="module-toggle-text"><span class="module-toggle-title">לידים / אירועים</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="contacts" checked><span class="module-toggle-text"><span class="module-toggle-title">לקוחות / אנשי קשר</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="employees" checked><span class="module-toggle-text"><span class="module-toggle-title">עובדים</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="products" checked><span class="module-toggle-text"><span class="module-toggle-title">מוצרים ומלאי</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="shopping" checked><span class="module-toggle-text"><span class="module-toggle-title">קניות / רכישות</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="reports" checked><span class="module-toggle-text"><span class="module-toggle-title">דוחות</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="sales_documents" checked><span class="module-toggle-text"><span class="module-toggle-title">מסמכי מכירה</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
          <label class="module-toggle checked"><input type="checkbox" data-module-key="strategic_contacts" checked><span class="module-toggle-text"><span class="module-toggle-title">קשרים אסטרטגיים</span><span class="module-toggle-status">פעיל</span></span><span class="module-toggle-pill">ON</span></label>
        </div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" id="super-admin-create-cancel">ביטול</button><button class="btn btn-primary super-admin-primary-action" id="super-admin-create-btn">צור עסק</button></div>
  </div>
</div>
<div class="modal-overlay" id="super-admin-tenant-modal">
  <div class="modal super-admin-modal">
    <div class="modal-header"><h2 id="super-admin-tenant-title">Tenant Details</h2><button class="modal-close" id="super-admin-tenant-close">✕</button></div>
    <div class="modal-body" id="super-admin-tenant-body">טוען...</div>
    <div class="modal-footer"><button class="btn btn-secondary" id="super-admin-tenant-close-footer">סגור</button></div>
  </div>
</div>
<div class="modal-overlay" id="tenant-owner-setup-modal">
  <div class="modal" style="width:720px;max-width:96vw">
    <div class="modal-header"><h2>הקמה ראשונית לעסק</h2><button class="modal-close" id="tenant-owner-setup-close">✕</button></div>
    <div class="modal-body" id="tenant-owner-setup-body">טוען...</div>
    <div class="modal-footer" id="tenant-owner-setup-footer"></div>
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
    <div class="modal-footer"><button class="btn btn-danger" id="modal-delete-btn" style="display:none;margin-left:auto">מחק אירוע</button><button class="btn btn-secondary" id="modal-cancel-btn">ביטול</button><button class="btn btn-primary" id="modal-save-btn">שמור</button></div>
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
    reports: { is_enabled: true, source: 'default_enabled' },
    sales_documents: { is_enabled: true, source: 'default_enabled' },
    strategic_contacts: { is_enabled: true, source: 'default_enabled' }
  }
};
var searchTimer, currentLeadId, dupLeadId, selectedContactId = null, currentEmployeeId = null, currentProductId = null, currentProductPurchases = [], currentProductPurchaseEditId = null, currentProductPurchaseFormMode = null, currentProductPurchaseSaving = false, currentProductStock = null, currentProductStockMovements = [], currentProductAdjustmentMode = null, currentProductAdjustmentSaving = false, currentProductReceiveStockPurchaseId = null;
var currentLowStockProducts = [];
var currentOperationalUnreceivedPurchases = [];
var currentOperationalRecentMovements = [];
var currentSalesDocuments = [];
var currentSalesDocumentDraft = null;
var currentSalesDocumentId = null;
var salesDocumentSaving = false;
var currentBusinessSettings = null;
var salesDocumentContactOptions = [];
var salesDocumentContactsLoading = false;
var salesDocumentBillingState = { contactId: null, loading: false, profile: null, addresses: [], people: [], error: null };
var businessSettingsLoading = false;
var businessSettingsSaving = false;
var currentCustomerBillingState = null;
var allLeadsCache = [];
var monthlyClientReportData = null;
var calYear, calMonth;
var currentTenantContext = null;

var CRM_MOBILE_NAV_ITEMS = [
  { navId: 'nav-dashboard', page: 'dashboard', label: 'דאשבורד', icon: '📊' },
  { navId: 'nav-calendar', page: 'calendar', label: 'יומן אירועים', icon: '📅', moduleKey: 'leads' },
  { navId: 'nav-leads', page: 'customers', label: 'לקוחות', icon: '👥', moduleKey: 'contacts' },
  { navId: 'nav-employees', page: 'employees', label: 'עובדים', icon: '🧑💼', moduleKey: 'employees' },
  { navId: 'nav-team', page: 'team', label: 'צוות', icon: '👤', teamOnly: true },
  { navId: 'nav-products', page: 'products', label: 'מוצרים', icon: '📦', moduleKey: 'products' },
  { navId: 'nav-shopping', page: 'shopping', label: 'רשימות קניות', icon: '🛒', moduleKey: 'shopping' },
  { navId: 'nav-sales-documents', page: 'sales-documents', label: 'מסמכים', icon: '🧾', moduleKey: 'sales_documents' },
  { navId: 'nav-strategic-contacts', page: 'strategic-contacts', label: 'קשרים אסטרטגיים', icon: '🤝', moduleKey: 'strategic_contacts' },
  { navId: 'nav-archive', page: 'archive', label: 'ארכיון אירועים', icon: '🗂️', moduleKey: 'leads' },
  { navId: 'nav-business-settings', page: 'business-settings', label: 'הגדרות', icon: '⚙️' }
];
var DEFAULT_MOBILE_BOTTOM_NAV = ['nav-calendar', 'nav-leads', 'nav-shopping', 'nav-sales-documents', 'nav-business-settings'];
var currentTeamMembers = [];
var currentSuperAdminTenantDetail = null;
var tenantOwnerSetupStep = 0;
var forcePasswordChangeActive = false;
var sessionTransitionInProgress = false;
var sessionRevalidationInFlight = false;
var lastSessionRevalidationAt = 0;
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

function isForcePasswordChangeRequired() {
  return !!(currentUser && currentUser.must_change_password === true);
}

function getTenantRole() {
  return currentTenantContext && currentTenantContext.membership ? String(currentTenantContext.membership.role || '').trim().toLowerCase() : '';
}

function isTeamManagerAllowed() {
  var role = getTenantRole();
  return role === 'owner' || role === 'admin';
}

function getTenantRoleLabel(role) {
  var map = {
    owner: 'Owner',
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee'
  };
  return map[role] || 'משתמש';
}

function canManageTeamMember(member) {
  if (!member) return false;
  var actorRole = getTenantRole();
  var targetRole = String(member.role || '').trim().toLowerCase();
  if (actorRole === 'owner') return Number(member.user_id) !== Number(currentTenantContext && currentTenantContext.user ? currentTenantContext.user.id : 0);
  if (actorRole === 'admin') return targetRole === 'manager' || targetRole === 'employee';
  return false;
}

function canAssignTeamRole(member, nextRole) {
  if (!member) return false;
  var actorRole = getTenantRole();
  var targetRole = String(member.role || '').trim().toLowerCase();
  nextRole = String(nextRole || '').trim().toLowerCase();
  if (Number(member.user_id) === Number(currentTenantContext && currentTenantContext.user ? currentTenantContext.user.id : 0)) return false;
  if (actorRole === 'owner') return ['owner', 'admin', 'manager', 'employee'].indexOf(nextRole) !== -1;
  if (actorRole === 'admin') {
    if (targetRole === 'owner' || targetRole === 'admin') return false;
    return nextRole === 'manager' || nextRole === 'employee';
  }
  return false;
}

function getAssignableTeamRoles(member) {
  var roles = ['owner', 'admin', 'manager', 'employee'];
  return roles.filter(function(role) {
    return canAssignTeamRole(member, role);
  });
}

function isModuleEnabled(moduleKey) {
  var item = moduleStateCache && moduleStateCache.byKey ? moduleStateCache.byKey[moduleKey] : null;
  return !item || item.is_enabled !== false;
}

function getModuleSortOrder(moduleKey, fallback) {
  var item = moduleStateCache && moduleStateCache.byKey ? moduleStateCache.byKey[moduleKey] : null;
  return item && item.sort_order !== undefined && item.sort_order !== null ? Number(item.sort_order) : fallback;
}


function getAvailableCrmMobileNavItems() {
  return CRM_MOBILE_NAV_ITEMS.filter(function(item) {
    if (item.teamOnly && !isTeamManagerAllowed()) return false;
    if (item.moduleKey && !isModuleEnabled(item.moduleKey)) return false;
    return true;
  });
}

function getMobileBottomNavStorageKey() {
  var tenantId = currentTenantContext && currentTenantContext.tenant ? currentTenantContext.tenant.id : 'tenant';
  var userId = currentUser && currentUser.id ? currentUser.id : 'user';
  return 'crm_mobile_bottom_nav_v1_' + tenantId + '_' + userId;
}

function getMobileBottomNavSelection() {
  var validIds = getAvailableCrmMobileNavItems().map(function(item) { return item.navId; });
  var selected = null;
  try {
    selected = JSON.parse(localStorage.getItem(getMobileBottomNavStorageKey()) || 'null');
  } catch (e) {
    selected = null;
  }
  if (!Array.isArray(selected) || !selected.length) selected = DEFAULT_MOBILE_BOTTOM_NAV.slice();
  selected = selected.filter(function(id, idx) { return validIds.indexOf(id) !== -1 && selected.indexOf(id) === idx; }).slice(0, 5);
  if (!selected.length) selected = DEFAULT_MOBILE_BOTTOM_NAV.filter(function(id) { return validIds.indexOf(id) !== -1; }).slice(0, 5);
  return selected.length ? selected : validIds.slice(0, 5);
}

function saveMobileBottomNavSelection(selected) {
  var validIds = getAvailableCrmMobileNavItems().map(function(item) { return item.navId; });
  selected = (selected || []).filter(function(id, idx) { return validIds.indexOf(id) !== -1 && selected.indexOf(id) === idx; }).slice(0, 5);
  if (!selected.length) selected = DEFAULT_MOBILE_BOTTOM_NAV.filter(function(id) { return validIds.indexOf(id) !== -1; }).slice(0, 5);
  localStorage.setItem(getMobileBottomNavStorageKey(), JSON.stringify(selected));
  applyMobileNavigationPreferences();
}

function renderMobileNavigationDrawer() {
  var list = document.getElementById('mobile-nav-list');
  if (!list) return;
  list.innerHTML = getAvailableCrmMobileNavItems().map(function(item) {
    return '<button type="button" class="mobile-nav-link" data-mobile-nav-id="' + escapeHtml(item.navId) + '"><span class="nav-icon">' + escapeHtml(item.icon) + '</span><span>' + escapeHtml(item.label) + '</span></button>';
  }).join('');
  list.querySelectorAll('[data-mobile-nav-id]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = CRM_MOBILE_NAV_ITEMS.find(function(x) { return x.navId === btn.getAttribute('data-mobile-nav-id'); });
      if (!item) return;
      closeMobileNavigationDrawer();
      goTo(item.page, document.getElementById(item.navId));
    });
  });
  syncMobileNavigationState();
}

function applyMobileNavigationPreferences() {
  var selected = getMobileBottomNavSelection();
  CRM_MOBILE_NAV_ITEMS.forEach(function(item) {
    var el = document.getElementById(item.navId);
    if (!el) return;
    el.classList.toggle('mobile-bottom-visible', selected.indexOf(item.navId) !== -1);
    el.classList.toggle('mobile-bottom-hidden', selected.indexOf(item.navId) === -1);
  });
  renderMobileNavigationDrawer();
  syncMobileNavigationState();
}

function getActivePageName() {
  var active = document.querySelector('.page.active');
  return active && active.id ? active.id.replace(/^page-/, '') : '';
}

function syncMobileNavigationState(page) {
  page = page || getActivePageName();
  var activeItem = CRM_MOBILE_NAV_ITEMS.find(function(item) { return item.page === page; });
  var title = document.getElementById('mobile-crm-title');
  if (title && activeItem) title.textContent = activeItem.label;
  document.querySelectorAll('.mobile-nav-link').forEach(function(btn) {
    btn.classList.toggle('active', activeItem && btn.getAttribute('data-mobile-nav-id') === activeItem.navId);
  });
}

function openMobileNavigationDrawer() {
  var drawer = document.getElementById('mobile-nav-drawer');
  var overlay = document.getElementById('mobile-nav-overlay');
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  if (overlay) overlay.classList.add('open');
}

function closeMobileNavigationDrawer() {
  var drawer = document.getElementById('mobile-nav-drawer');
  var overlay = document.getElementById('mobile-nav-overlay');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (overlay) overlay.classList.remove('open');
}

function applySidebarModuleOrder() {
  var orderedNav = [
    { module_key: 'contacts', ids: ['nav-leads'], fallback: 20 },
    { module_key: 'employees', ids: ['nav-employees', 'nav-team'], fallback: 30 },
    { module_key: 'products', ids: ['nav-products'], fallback: 40 },
    { module_key: 'shopping', ids: ['nav-shopping'], fallback: 50 },
    { module_key: 'sales_documents', ids: ['nav-sales-documents'], fallback: 70 },
    { module_key: 'strategic_contacts', ids: ['nav-strategic-contacts'], fallback: 80 },
    { module_key: 'leads', ids: ['nav-calendar', 'nav-archive'], fallback: 90 }
  ];
  var dashboard = document.getElementById('nav-dashboard');
  if (dashboard) dashboard.style.order = 10;
  var businessSettings = document.getElementById('nav-business-settings');
  if (businessSettings) businessSettings.style.order = 95;
  orderedNav.forEach(function(item) {
    var order = 20 + getModuleSortOrder(item.module_key, item.fallback) * 10;
    item.ids.forEach(function(id, idx) {
      var el = document.getElementById(id);
      if (el) el.style.order = order + idx;
    });
  });
  var superAdmin = document.getElementById('nav-super-admin');
  if (superAdmin) superAdmin.style.order = 120;
}

function renderModuleDisabledPage(page, moduleKey) {
  var map = {
    leads: { bodyId: 'leads-body', colspan: 10 },
    customers: { bodyId: 'customers-grid' },
    shopping: { bodyId: 'shopping-grid' },
    calendar: { bodyId: 'calendar-body', colspan: 8 },
    employees: { bodyId: 'employees-grid' },
    products: { bodyId: 'products-page-content' },
    archive: { bodyId: 'archive-events-grid' },
    salesDocuments: { bodyId: 'sales-documents-body', colspan: 7 },
    strategicContacts: { bodyId: 'strategic-contacts-grid' }
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
  var navTeam = document.getElementById('nav-team');
  if (navTeam) navTeam.style.display = isTeamManagerAllowed() ? 'flex' : 'none';
  var navProducts = document.getElementById('nav-products');
  if (navProducts) navProducts.style.display = isModuleEnabled('products') ? 'flex' : 'none';
  var navShopping = document.getElementById('nav-shopping');
  if (navShopping) navShopping.style.display = isModuleEnabled('shopping') ? 'flex' : 'none';
  var navStrategicContacts = document.getElementById('nav-strategic-contacts');
  if (navStrategicContacts) navStrategicContacts.style.display = isModuleEnabled('strategic_contacts') ? 'flex' : 'none';
  var navSalesDocuments = document.getElementById('nav-sales-documents');
  if (navSalesDocuments) navSalesDocuments.style.display = isModuleEnabled('sales_documents') ? 'flex' : 'none';
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
  var btnNewTeamMember = document.getElementById('btn-new-team-member');
  if (btnNewTeamMember) btnNewTeamMember.style.display = isTeamManagerAllowed() ? 'inline-flex' : 'none';
  var btnNewProduct = document.getElementById('btn-new-product');
  if (btnNewProduct) btnNewProduct.style.display = isModuleEnabled('products') ? 'inline-flex' : 'none';
  var btnNewShoppingList = document.getElementById('btn-new-shopping-list');
  if (btnNewShoppingList) btnNewShoppingList.style.display = isModuleEnabled('shopping') ? 'inline-flex' : 'none';
  var btnNewStrategicContact = document.getElementById('btn-new-strategic-contact');
  if (btnNewStrategicContact) btnNewStrategicContact.style.display = isModuleEnabled('strategic_contacts') ? 'inline-flex' : 'none';
  var btnNewSalesQuote = document.getElementById('btn-new-sales-quote');
  if (btnNewSalesQuote) btnNewSalesQuote.style.display = isModuleEnabled('sales_documents') ? 'inline-flex' : 'none';
  var btnNewSalesInvoice = document.getElementById('btn-new-sales-invoice');
  if (btnNewSalesInvoice) btnNewSalesInvoice.style.display = isModuleEnabled('sales_documents') ? 'inline-flex' : 'none';
  var reportsBtn = document.getElementById('btn-product-reports');
  if (reportsBtn) reportsBtn.style.display = isModuleEnabled('reports') ? 'inline-flex' : 'none';
  var lowStockSummary = document.getElementById('products-low-stock-summary');
  if (lowStockSummary) lowStockSummary.style.display = isModuleEnabled('reports') ? 'block' : 'none';
  var operationalWidgets = document.getElementById('products-operational-widgets');
  if (operationalWidgets) operationalWidgets.style.display = isModuleEnabled('reports') ? 'block' : 'none';
  applySidebarModuleOrder();
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
  document.body.classList.toggle('crm-shell', isCrmShell);
  document.body.classList.toggle('admin-shell', isAdminShell);
  var isAdminUser = isSuperAdmin();
  var crmNavIds = ['nav-dashboard', 'nav-leads', 'nav-employees', 'nav-team', 'nav-products', 'nav-shopping', 'nav-strategic-contacts', 'nav-sales-documents', 'nav-business-settings', 'nav-calendar', 'nav-archive'];
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
  applyMobileNavigationPreferences();
}

function loadModuleStates() {
  moduleStateCache.loaded = false;
  return apiCall('GET', '/api/auth/modules').then(function(data) {
    var next = {
      leads: { is_enabled: true, sort_order: 1, source: 'default_enabled' },
      contacts: { is_enabled: true, sort_order: 2, source: 'default_enabled' },
      employees: { is_enabled: true, sort_order: 3, source: 'default_enabled' },
      products: { is_enabled: true, sort_order: 4, source: 'default_enabled' },
      shopping: { is_enabled: true, sort_order: 5, source: 'default_enabled' },
      reports: { is_enabled: true, sort_order: 6, source: 'default_enabled' },
      sales_documents: { is_enabled: true, sort_order: 7, source: 'default_enabled' },
      strategic_contacts: { is_enabled: true, sort_order: 8, source: 'default_enabled' }
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
  if (roleEl) {
    roleEl.textContent = isSuperAdmin() ? 'Super Admin' : getTenantRoleLabel(getTenantRole());
  }
  applyModuleVisibility();
  applyShellVisibility();
}

function init() {
  var now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  var el = document.getElementById('dash-date');
  if (el) el.textContent = now.toLocaleDateString('he-IL', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  var monthlyClientMonth = document.getElementById('monthly-client-month');
  if (monthlyClientMonth) monthlyClientMonth.value = now.getFullYear() + '-' + pad2(now.getMonth() + 1);
  var monthlyClientRefresh = document.getElementById('monthly-client-refresh');
  if (monthlyClientRefresh) monthlyClientRefresh.addEventListener('click', loadMonthlyClientReport);
  var monthlyClientExport = document.getElementById('monthly-client-export');
  if (monthlyClientExport) monthlyClientExport.addEventListener('click', exportMonthlyClientReportToExcel);

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('force-password-btn').addEventListener('click', submitForcedPasswordChange);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('logout-btn-mobile').addEventListener('click', logout);
  var mobileNavOpen = document.getElementById('mobile-nav-open');
  if (mobileNavOpen) mobileNavOpen.addEventListener('click', openMobileNavigationDrawer);
  var mobileNavClose = document.getElementById('mobile-nav-close');
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNavigationDrawer);
  var mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNavigationDrawer);
document.getElementById('btn-new-lead').addEventListener('click', function() {
  goTo('customers', document.getElementById('nav-leads'));
});

document.getElementById('btn-new-lead2').addEventListener('click', function() {
  goTo('customers', document.getElementById('nav-leads'));
});  document.getElementById('modal-close-btn').addEventListener('click', closeLeadModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeLeadModal);
  document.getElementById('modal-save-btn').addEventListener('click', saveLead);
  var modalDeleteBtn = document.getElementById('modal-delete-btn');
  if (modalDeleteBtn) modalDeleteBtn.addEventListener('click', function() {
    var id = document.getElementById('lead-id').value;
    if (id) deleteLead(parseInt(id));
  });
  document.getElementById('drawer-close-btn').addEventListener('click', closeDrawer);
  document.getElementById('drawer-sync-btn').addEventListener('click', function() { if (currentLeadId) syncToGoogle(currentLeadId); });
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  document.getElementById('drawer-edit-btn').addEventListener('click', function() { if (currentLeadId) editLead(currentLeadId); });
  document.getElementById('add-note-btn').addEventListener('click', addNote);
  document.getElementById('nav-dashboard').addEventListener('click', function() { goTo('dashboard', this); });
  document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });
  var navEmployees = document.getElementById('nav-employees');
  if (navEmployees) navEmployees.addEventListener('click', function() { goTo('employees', this); });
  var navTeam = document.getElementById('nav-team');
  if (navTeam) navTeam.addEventListener('click', function() { goTo('team', this); });
  var navProducts = document.getElementById('nav-products');
  if (navProducts) navProducts.addEventListener('click', function() { goTo('products', this); });
  var navShopping = document.getElementById('nav-shopping');
  if (navShopping) navShopping.addEventListener('click', function() { goTo('shopping', this); });
  var navStrategicContacts = document.getElementById('nav-strategic-contacts');
  if (navStrategicContacts) navStrategicContacts.addEventListener('click', function() { goTo('strategic-contacts', this); });
  var navSalesDocuments = document.getElementById('nav-sales-documents');
  if (navSalesDocuments) navSalesDocuments.addEventListener('click', function() { goTo('sales-documents', this); });
  var navBusinessSettings = document.getElementById('nav-business-settings');
  if (navBusinessSettings) navBusinessSettings.addEventListener('click', function() { goTo('business-settings', this); });
  document.getElementById('nav-calendar').addEventListener('click', function() { goTo('calendar', this); });
  var navArchive = document.getElementById('nav-archive');
  if (navArchive) navArchive.addEventListener('click', function() { goTo('archive', this); });
  var navSuperAdmin = document.getElementById('nav-super-admin');
  if (navSuperAdmin) navSuperAdmin.addEventListener('click', function() { goTo('super-admin', this); });
  var strategicContactsSearch = document.getElementById('strategic-contacts-search');
  if (strategicContactsSearch) strategicContactsSearch.addEventListener('input', function() { clearTimeout(searchTimer); searchTimer = setTimeout(loadStrategicContacts, 300); });
  ['strategic-contacts-category-filter','strategic-contacts-status-filter','strategic-contacts-priority-filter','strategic-contacts-follow-up-filter','strategic-contacts-seasonal-filter','strategic-contacts-value-filter'].forEach(function(id) { var el = document.getElementById(id); if (el) el.addEventListener('change', loadStrategicContacts); });
  var newStrategicContact = document.getElementById('btn-new-strategic-contact');
  if (newStrategicContact) newStrategicContact.addEventListener('click', function() { openStrategicContactModal(); });
  var salesDocumentsSearch = document.getElementById('sales-documents-search');
  if (salesDocumentsSearch) salesDocumentsSearch.addEventListener('input', function() { clearTimeout(searchTimer); searchTimer = setTimeout(loadSalesDocuments, 300); });
  var salesDocumentsTypeFilter = document.getElementById('sales-documents-type-filter');
  if (salesDocumentsTypeFilter) salesDocumentsTypeFilter.addEventListener('change', loadSalesDocuments);
  var salesDocumentsStatusFilter = document.getElementById('sales-documents-status-filter');
  if (salesDocumentsStatusFilter) salesDocumentsStatusFilter.addEventListener('change', loadSalesDocuments);
  var refreshSalesDocuments = document.getElementById('btn-refresh-sales-documents');
  if (refreshSalesDocuments) refreshSalesDocuments.addEventListener('click', loadSalesDocuments);
  var newSalesQuote = document.getElementById('btn-new-sales-quote');
  if (newSalesQuote) newSalesQuote.addEventListener('click', function() { openSalesDocumentEditor('quote'); });
  var newSalesInvoice = document.getElementById('btn-new-sales-invoice');
  if (newSalesInvoice) newSalesInvoice.addEventListener('click', function() { openSalesDocumentEditor('invoice'); });
  var closeSalesDocumentEditor = document.getElementById('sales-document-close-editor');
  if (closeSalesDocumentEditor) closeSalesDocumentEditor.addEventListener('click', closeSalesDocumentEditorPanel);
  var printSalesDocumentPreview = document.getElementById('sales-document-print-preview');
  if (printSalesDocumentPreview) printSalesDocumentPreview.addEventListener('click', printSalesDocumentPreviewPanel);
  var refreshBusinessSettings = document.getElementById('btn-refresh-business-settings');
  if (refreshBusinessSettings) refreshBusinessSettings.addEventListener('click', loadBusinessSettings);

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
  var teamSearch = document.getElementById('team-search');
  if (teamSearch) teamSearch.addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadTeamMembers, 300);
  });
  var teamStatusFilter = document.getElementById('team-status-filter');
  if (teamStatusFilter) teamStatusFilter.addEventListener('change', loadTeamMembers);
  var teamRoleFilter = document.getElementById('team-role-filter');
  if (teamRoleFilter) teamRoleFilter.addEventListener('change', loadTeamMembers);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeLeadModal(); closeDrawer(); closeCustomerModal(); closeMobileNavigationDrawer(); skipTenantOwnerSetup(); closeSuperAdminCreateModal(); closeSuperAdminTenantModal(); }
  });
  window.addEventListener('storage', function(e) {
    if (e.key !== 'crm_token' && e.key !== 'crm_user') return;
    if (!token || !currentUser) return;
    var nextToken = localStorage.getItem('crm_token');
    var nextUserRaw = localStorage.getItem('crm_user');
    if (nextToken === token && nextUserRaw === JSON.stringify(currentUser)) return;
    handleExpiredSession({ message: 'ההתחברות עודכנה בחלון אחר, נא להתחבר מחדש', skipToast: true });
  });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) scheduleSessionRevalidation();
  });
  window.addEventListener('focus', function() {
    scheduleSessionRevalidation();
  });
  var ownerSetupClose = document.getElementById('tenant-owner-setup-close');
  if (ownerSetupClose) ownerSetupClose.addEventListener('click', skipTenantOwnerSetup);
  var ownerSetupModal = document.getElementById('tenant-owner-setup-modal');
  if (ownerSetupModal) ownerSetupModal.addEventListener('click', function(e) { if (e.target === this) skipTenantOwnerSetup(); });
  var superAdminCreateOpen = document.getElementById('super-admin-open-create-modal');
  if (superAdminCreateOpen) superAdminCreateOpen.addEventListener('click', openSuperAdminCreateModal);
  var superAdminCreateClose = document.getElementById('super-admin-create-close');
  if (superAdminCreateClose) superAdminCreateClose.addEventListener('click', closeSuperAdminCreateModal);
  var superAdminCreateCancel = document.getElementById('super-admin-create-cancel');
  if (superAdminCreateCancel) superAdminCreateCancel.addEventListener('click', closeSuperAdminCreateModal);
  var superAdminCreateModal = document.getElementById('super-admin-create-modal');
  if (superAdminCreateModal) superAdminCreateModal.addEventListener('click', function(e) { if (e.target === this) closeSuperAdminCreateModal(); });
  var superAdminCreateModules = document.getElementById('super-admin-create-modules');
  if (superAdminCreateModules) bindModuleToggleGroup(superAdminCreateModules);
  var superAdminClose = document.getElementById('super-admin-tenant-close');
  if (superAdminClose) superAdminClose.addEventListener('click', closeSuperAdminTenantModal);
  var superAdminCloseFooter = document.getElementById('super-admin-tenant-close-footer');
  if (superAdminCloseFooter) superAdminCloseFooter.addEventListener('click', closeSuperAdminTenantModal);
  var superAdminModal = document.getElementById('super-admin-tenant-modal');
  if (superAdminModal) superAdminModal.addEventListener('click', function(e) { if (e.target === this) closeSuperAdminTenantModal(); });
  var superAdminCreateBtn = document.getElementById('super-admin-create-btn');
  if (superAdminCreateBtn) superAdminCreateBtn.addEventListener('click', createTenantFromSuperAdmin);
  var superAdminRefreshCleanup = document.getElementById('super-admin-refresh-cleanup');
  if (superAdminRefreshCleanup) superAdminRefreshCleanup.addEventListener('click', loadSuperAdminCleanupCandidates);
  var superAdminCleanupEntity = document.getElementById('super-admin-cleanup-entity');
  if (superAdminCleanupEntity) superAdminCleanupEntity.addEventListener('change', loadSuperAdminCleanupCandidates);
  var superAdminCleanupSearch = document.getElementById('super-admin-cleanup-search');
  if (superAdminCleanupSearch) superAdminCleanupSearch.addEventListener('input', function() { clearTimeout(searchTimer); searchTimer = setTimeout(loadSuperAdminCleanupCandidates, 300); });

  if (token && currentUser) showApp();
}

function goTo(page, el) {
  var pageModuleMap = {
    leads: 'leads',
    customers: 'contacts',
    employees: 'employees',
    products: 'products',
    shopping: 'shopping',
    'strategic-contacts': 'strategic_contacts',
    'sales-documents': 'sales_documents',
    calendar: 'leads',
    archive: 'leads'
  };
  if (page === 'team' && !isTeamManagerAllowed()) {
    toast('Permission denied', 'error');
    return;
  }
  var requiredModule = pageModuleMap[page];
  if (requiredModule && !isModuleEnabled(requiredModule)) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    var blockedPage = document.getElementById('page-' + page);
    if (!blockedPage) return;
    blockedPage.classList.add('active');
    if (el) el.classList.add('active');
    renderModuleDisabledPage(page === 'sales-documents' ? 'salesDocuments' : (page === 'strategic-contacts' ? 'strategicContacts' : page), requiredModule);
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
  if (page === 'strategic-contacts') loadStrategicContacts();
  if (page === 'sales-documents') loadSalesDocuments();
  if (page === 'business-settings') loadBusinessSettings();
  if (page === 'calendar') loadCalendar();
  if (page === 'customers') loadCustomers();
  if (page === 'employees') loadEmployees();
  if (page === 'team') loadTeamMembers();
  if (page === 'products') loadProducts();
  if (page === 'archive') loadEventArchive();
  if (page === 'super-admin') { loadSuperAdminTenants(); loadSuperAdminCleanupCandidates(); }
  syncMobileNavigationState(page);
}

function resetSessionState() {
  localStorage.removeItem('crm_token');
  localStorage.removeItem('crm_user');
  token = null;
  currentUser = null;
  forcePasswordChangeActive = false;
  sessionRevalidationInFlight = false;
  lastSessionRevalidationAt = 0;
  moduleStateCache = {
    loaded: false,
    byKey: {
      leads: { is_enabled: true, sort_order: 1, source: 'default_enabled' },
      contacts: { is_enabled: true, sort_order: 2, source: 'default_enabled' },
      employees: { is_enabled: true, sort_order: 3, source: 'default_enabled' },
      products: { is_enabled: true, sort_order: 4, source: 'default_enabled' },
      shopping: { is_enabled: true, sort_order: 5, source: 'default_enabled' },
      reports: { is_enabled: true, sort_order: 6, source: 'default_enabled' },
      sales_documents: { is_enabled: true, sort_order: 7, source: 'default_enabled' },
      strategic_contacts: { is_enabled: true, sort_order: 8, source: 'default_enabled' }
    }
  };
}

function showLoggedOutState(message, options) {
  options = options || {};
  resetSessionState();
  closeTenantOwnerSetupModal();
  applySuperAdminVisibility();
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('force-password-page').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  var errEl = document.getElementById('login-error');
  if (errEl) {
    if (message) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    } else {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
  }
  if (message && !options.skipToast) {
    toast(message, 'error');
  }
}

function handleExpiredSession(options) {
  options = options || {};
  if (sessionTransitionInProgress) return;
  sessionTransitionInProgress = true;
  try {
    showLoggedOutState(options.message || 'פג תוקף ההתחברות, נא להתחבר מחדש', { skipToast: !!options.skipToast });
  } finally {
    setTimeout(function() {
      sessionTransitionInProgress = false;
    }, 0);
  }
}

function loadTenantContext() {
  return apiCall('GET', '/api/auth/tenant-context').then(function(data) {
    currentTenantContext = data || null;
    applySuperAdminVisibility();
    maybeShowTenantOwnerSetup();
    return data;
  }).catch(function(err) {
    currentTenantContext = null;
    applySuperAdminVisibility();
    throw err;
  });
}

function getTenantOwnerSetupStorageKey(kind) {
  if (!currentUser || !currentTenantContext || !currentTenantContext.tenant) return null;
  return 'crm_owner_setup_' + kind + '_' + currentUser.id + '_' + currentTenantContext.tenant.id;
}

function shouldOfferTenantOwnerSetup() {
  if (!currentUser || !currentTenantContext || !currentTenantContext.tenant || !currentTenantContext.membership) return false;
  if (isSuperAdmin()) return false;
  if (String(currentTenantContext.membership.role || '').trim().toLowerCase() !== 'owner') return false;
  var pendingKey = getTenantOwnerSetupStorageKey('pending');
  var doneKey = getTenantOwnerSetupStorageKey('done');
  if (!pendingKey || !doneKey) return false;
  return localStorage.getItem(pendingKey) === '1' && localStorage.getItem(doneKey) !== '1';
}

function markTenantOwnerSetupPending() {
  var pendingKey = getTenantOwnerSetupStorageKey('pending');
  var doneKey = getTenantOwnerSetupStorageKey('done');
  if (!pendingKey || !doneKey) return;
  if (localStorage.getItem(doneKey) === '1') return;
  localStorage.setItem(pendingKey, '1');
}

function completeTenantOwnerSetup() {
  var pendingKey = getTenantOwnerSetupStorageKey('pending');
  var doneKey = getTenantOwnerSetupStorageKey('done');
  var draftKey = getTenantOwnerSetupStorageKey('draft');
  if (pendingKey) localStorage.removeItem(pendingKey);
  if (doneKey) localStorage.setItem(doneKey, '1');
  if (draftKey) localStorage.removeItem(draftKey);
}

function getTenantOwnerSetupDraft() {
  var draftKey = getTenantOwnerSetupStorageKey('draft');
  if (!draftKey) return {};
  try {
    return JSON.parse(localStorage.getItem(draftKey) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function saveTenantOwnerSetupDraft(draft) {
  var draftKey = getTenantOwnerSetupStorageKey('draft');
  if (!draftKey) return;
  localStorage.setItem(draftKey, JSON.stringify(draft || {}));
}

function renderGuidedEmptyState(title, description, buttonLabel, action) {
  return '<div class="guided-empty"><div class="guided-empty-title">' + escapeHtml(title || '') + '</div><div class="guided-empty-sub">' + escapeHtml(description || '') + '</div>' + (buttonLabel && action ? '<button class="btn btn-primary btn-sm" onclick="' + action + '">' + escapeHtml(buttonLabel) + '</button>' : '') + '</div>';
}

function scheduleSessionRevalidation() {
  if (!token || !currentUser) return;
  if (document.hidden) return;
  if (document.getElementById('app').style.display === 'none') return;
  var now = Date.now();
  if (sessionRevalidationInFlight) return;
  if (now - lastSessionRevalidationAt < 5000) return;
  sessionRevalidationInFlight = true;
  lastSessionRevalidationAt = now;
  loadTenantContext().catch(function() {
  }).finally(function() {
    sessionRevalidationInFlight = false;
  });
}

function apiCall(method, path, body) {
  var opts = { method: method, headers: { 'Content-Type': 'application/json' } };
  var hasAuthToken = !!token;
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body) opts.body = JSON.stringify(body);
  return fetch(path, opts).then(function(res) {
    return res.text().then(function(text) {
      var data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = {};
        }
      }
      if (res.status === 401 && hasAuthToken && path !== '/api/auth/login') {
        handleExpiredSession();
        throw new Error('פג תוקף ההתחברות, נא להתחבר מחדש');
      }
      if (data && data.error) throw new Error(data.error);
      return data;
    });
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
    if (res.must_change_password || isForcePasswordChangeRequired()) {
      showForcePasswordChange();
      return null;
    }
    return loadTenantContext().catch(function() { return null; });
  }).then(function(result) {
    if (result === null && isForcePasswordChangeRequired()) return;
    showApp();
  }).catch(function(e) {
    errEl.textContent = e.message || 'שגיאה בכניסה';
    errEl.style.display = 'block';
  });
}

function closeTenantOwnerSetupModal() {
  var modal = document.getElementById('tenant-owner-setup-modal');
  if (modal) modal.classList.remove('open');
}

function skipTenantOwnerSetup() {
  var modal = document.getElementById('tenant-owner-setup-modal');
  if (!modal || !modal.classList.contains('open')) return;
  completeTenantOwnerSetup();
  closeTenantOwnerSetupModal();
  toast('אפשר להשלים את ההקמה גם בהמשך', 'success');
}

function collectTenantOwnerSetupForm() {
  return {
    name: (document.getElementById('tenant-owner-setup-name') ? document.getElementById('tenant-owner-setup-name').value : '') || '',
    contact_phone: (document.getElementById('tenant-owner-setup-phone') ? document.getElementById('tenant-owner-setup-phone').value : '') || '',
    address: (document.getElementById('tenant-owner-setup-address') ? document.getElementById('tenant-owner-setup-address').value : '') || ''
  };
}

function renderTenantOwnerSetup() {
  var modal = document.getElementById('tenant-owner-setup-modal');
  var body = document.getElementById('tenant-owner-setup-body');
  var footer = document.getElementById('tenant-owner-setup-footer');
  if (!modal || !body || !footer || !currentTenantContext || !currentTenantContext.tenant) return;
  var draft = getTenantOwnerSetupDraft();
  var tenantName = draft.name || currentTenantContext.tenant.name || '';
  var tenantPhone = draft.contact_phone || currentTenantContext.tenant.contact_phone || '';
  var tenantAddress = draft.address || '';
  var steps = ['ברוכים הבאים', 'פרטי העסק', 'התחלה מהירה'];
  body.innerHTML = '<div class="owner-setup-steps">' + steps.map(function(step, index) {
    return '<div class="owner-setup-step' + (index === tenantOwnerSetupStep ? ' active' : '') + '">' + escapeHtml(step) + '</div>';
  }).join('') + '</div>';
  if (tenantOwnerSetupStep === 0) {
    body.innerHTML += '<div class="owner-setup-hero"><div class="owner-setup-title">ברוכים הבאים ל-CRM 🎉</div><div class="owner-setup-sub">סיימת להגדיר סיסמה ראשונית. עכשיו נעשה הקמה קצרה כדי שהמערכת תרגיש מוכנה לעבודה כבר מהכניסה הראשונה.</div></div>' +
      '<div class="owner-setup-card"><div class="owner-setup-card-title">מה נגדיר עכשיו?</div><div class="owner-setup-card-sub">נעדכן את פרטי העסק הבסיסיים ונראה לך את הצעדים הראשונים שכדאי לעשות.</div>' +
      '<div class="owner-setup-note">ההקמה קלה, ניתנת לדילוג, ולא תחסום אותך מלהשתמש במערכת.</div></div>';
    footer.innerHTML = '<button class="btn btn-secondary" id="tenant-owner-setup-skip">דלג לעכשיו</button><button class="btn btn-primary" id="tenant-owner-setup-next">המשך</button>';
  } else if (tenantOwnerSetupStep === 1) {
    body.innerHTML += '<div class="owner-setup-card"><div class="owner-setup-card-title">פרטי העסק</div><div class="owner-setup-card-sub">אפשר לעדכן עכשיו את שם העסק והטלפון הראשי. הכתובת היא שדה אופציונלי לשלב הבא ונשמרת מקומית בדפדפן הזה בלבד.</div>' +
      '<div class="form-row"><div class="form-group"><label class="form-label">שם העסק</label><input class="form-input" id="tenant-owner-setup-name" value="' + escapeHtml(tenantName) + '" placeholder="שם העסק"></div><div class="form-group"><label class="form-label">טלפון</label><input class="form-input" id="tenant-owner-setup-phone" value="' + escapeHtml(tenantPhone) + '" placeholder="050-0000000"></div></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">כתובת (אופציונלי)</label><input class="form-input" id="tenant-owner-setup-address" value="' + escapeHtml(tenantAddress) + '" placeholder="עיר / כתובת מלאה"></div>' +
      '<div class="owner-setup-note">לוגו יתווסף בהמשך. כרגע שמרנו על ההקמה מהירה ופשוטה.</div></div>';
    footer.innerHTML = '<button class="btn btn-secondary" id="tenant-owner-setup-back">חזרה</button><button class="btn btn-secondary" id="tenant-owner-setup-skip">דלג לעכשיו</button><button class="btn btn-primary" id="tenant-owner-setup-save">שמור והמשך</button>';
  } else {
    body.innerHTML += '<div class="owner-setup-card"><div class="owner-setup-card-title">התחלה מהירה</div><div class="owner-setup-card-sub">הנה שלוש פעולות שיעזרו לך להתחיל לעבוד מיד.</div><div class="owner-setup-quick-grid">' +
      '<button class="owner-setup-quick" id="owner-setup-action-lead"><div class="owner-setup-quick-title">צור ליד ראשון</div><div class="owner-setup-quick-sub">פתח ליד חדש והתחל למלא פרטי לקוח ואירוע.</div></button>' +
      '<button class="owner-setup-quick" id="owner-setup-action-customer"><div class="owner-setup-quick-title">הוסף לקוח ראשון</div><div class="owner-setup-quick-sub">עבור למסך הלקוחות ופתח כרטיס ראשון.</div></button>' +
      '<button class="owner-setup-quick" id="owner-setup-action-event"><div class="owner-setup-quick-title">פתח אירוע ראשון</div><div class="owner-setup-quick-sub">התחל אירוע חדש והוסף תאריך, אולם ופרטים חשובים.</div></button>' +
      '</div></div>';
    footer.innerHTML = '<button class="btn btn-secondary" id="tenant-owner-setup-back">חזרה</button><button class="btn btn-secondary" id="tenant-owner-setup-skip">דלג לעכשיו</button><button class="btn btn-primary" id="tenant-owner-setup-finish">סיום</button>';
  }
  var skipBtn = document.getElementById('tenant-owner-setup-skip');
  if (skipBtn) skipBtn.onclick = skipTenantOwnerSetup;
  var nextBtn = document.getElementById('tenant-owner-setup-next');
  if (nextBtn) nextBtn.onclick = function() { tenantOwnerSetupStep = 1; renderTenantOwnerSetup(); };
  var backBtn = document.getElementById('tenant-owner-setup-back');
  if (backBtn) backBtn.onclick = function() { tenantOwnerSetupStep = Math.max(0, tenantOwnerSetupStep - 1); renderTenantOwnerSetup(); };
  var saveBtn = document.getElementById('tenant-owner-setup-save');
  if (saveBtn) saveBtn.onclick = saveTenantOwnerSetupProfile;
  var finishBtn = document.getElementById('tenant-owner-setup-finish');
  if (finishBtn) finishBtn.onclick = function() { completeTenantOwnerSetup(); closeTenantOwnerSetupModal(); toast('ההקמה הראשונית הושלמה', 'success'); };
  var leadBtn = document.getElementById('owner-setup-action-lead');
  if (leadBtn) leadBtn.onclick = function() { completeTenantOwnerSetup(); closeTenantOwnerSetupModal(); goTo('leads', document.getElementById('nav-leads')); openLeadModal(); };
  var customerBtn = document.getElementById('owner-setup-action-customer');
  if (customerBtn) customerBtn.onclick = function() { completeTenantOwnerSetup(); closeTenantOwnerSetupModal(); goTo('customers', document.getElementById('nav-customers')); openLeadModal(); };
  var eventBtn = document.getElementById('owner-setup-action-event');
  if (eventBtn) eventBtn.onclick = function() { completeTenantOwnerSetup(); closeTenantOwnerSetupModal(); goTo('leads', document.getElementById('nav-leads')); openLeadModal(); setTimeout(function() { var eventDate = document.getElementById('l-event-date'); if (eventDate) eventDate.focus(); }, 30); };
}

function saveTenantOwnerSetupProfile() {
  var body = collectTenantOwnerSetupForm();
  saveTenantOwnerSetupDraft(body);
  if (!body.name.trim()) { toast('שם העסק חובה', 'error'); return; }
  if (!body.contact_phone.trim()) { toast('טלפון חובה', 'error'); return; }
  apiCall('PUT', '/api/auth/tenant-setup-profile', {
    name: body.name.trim(),
    contact_phone: body.contact_phone.trim()
  }).then(function(res) {
    if (currentTenantContext && currentTenantContext.tenant && res && res.tenant) {
      currentTenantContext.tenant.name = res.tenant.name || currentTenantContext.tenant.name;
      currentTenantContext.tenant.contact_phone = res.tenant.contact_phone || currentTenantContext.tenant.contact_phone;
      currentTenantContext.tenant.contact_email = res.tenant.contact_email || currentTenantContext.tenant.contact_email;
    }
    tenantOwnerSetupStep = 2;
    renderTenantOwnerSetup();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בשמירת פרטי העסק', 'error');
  });
}

function maybeShowTenantOwnerSetup() {
  var modal = document.getElementById('tenant-owner-setup-modal');
  if (!modal) return;
  if (!shouldOfferTenantOwnerSetup()) return;
  if (modal.classList.contains('open')) return;
  tenantOwnerSetupStep = 0;
  renderTenantOwnerSetup();
  modal.classList.add('open');
}

function showForcePasswordChange() {
  forcePasswordChangeActive = true;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('force-password-page').style.display = 'flex';
  var errEl = document.getElementById('force-password-error');
  if (errEl) {
    errEl.textContent = '';
    errEl.style.display = 'none';
  }
  var newEl = document.getElementById('force-password-new');
  var confirmEl = document.getElementById('force-password-confirm');
  if (newEl) newEl.value = '';
  if (confirmEl) confirmEl.value = '';
}

function submitForcedPasswordChange() {
  var errEl = document.getElementById('force-password-error');
  var newPassword = document.getElementById('force-password-new').value || '';
  var confirmPassword = document.getElementById('force-password-confirm').value || '';
  if (errEl) {
    errEl.textContent = '';
    errEl.style.display = 'none';
  }
  if (!newPassword) {
    if (errEl) { errEl.textContent = 'סיסמה חדשה חובה'; errEl.style.display = 'block'; }
    return;
  }
  if (newPassword.length < 4) {
    if (errEl) { errEl.textContent = 'הסיסמה חייבת להכיל לפחות 4 תווים'; errEl.style.display = 'block'; }
    return;
  }
  if (newPassword !== confirmPassword) {
    if (errEl) { errEl.textContent = 'אישור הסיסמה אינו תואם'; errEl.style.display = 'block'; }
    return;
  }
  apiCall('POST', '/api/auth/change-password', { new_password: newPassword }).then(function(res) {
    if (res && res.user) {
      currentUser = res.user;
      localStorage.setItem('crm_user', JSON.stringify(currentUser));
    }
    forcePasswordChangeActive = false;
    document.getElementById('force-password-page').style.display = 'none';
    return loadTenantContext().then(function(ctx) {
      if (ctx && ctx.membership && String(ctx.membership.role || '').trim().toLowerCase() === 'owner') {
        markTenantOwnerSetupPending();
      }
      return ctx;
    }).catch(function() { return null; });
  }).then(function() {
    toast('הסיסמה הוחלפה בהצלחה', 'success');
    showApp();
  }).catch(function(e) {
    if (errEl) {
      errEl.textContent = e.message || 'שגיאה בהחלפת סיסמה';
      errEl.style.display = 'block';
    }
  });
}

function showApp() {
  if (isForcePasswordChangeRequired()) {
    showForcePasswordChange();
    return;
  }
  forcePasswordChangeActive = false;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('force-password-page').style.display = 'none';
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
  if (shouldOfferTenantOwnerSetup()) {
    setTimeout(function() {
      maybeShowTenantOwnerSetup();
    }, 120);
  }
  loadTenantContext().catch(function() {
  });
  loadModuleStates();
}

function logout() {
  currentTenantContext = null;
  currentTeamMembers = [];
  showLoggedOutState();
}

function getTeamRoleBadge(role) {
  role = String(role || '').trim().toLowerCase();
  return '<span class="team-role-badge ' + role + '">' + escapeHtml(getTenantRoleLabel(role)) + '</span>';
}

function getTeamStatusBadge(status) {
  status = String(status || '').trim().toLowerCase();
  return '<span class="team-status-badge ' + status + '">' + escapeHtml(status === 'inactive' ? 'לא פעיל' : 'פעיל') + '</span>';
}

function getTeamMemberRoleOptions(member) {
  return getAssignableTeamRoles(member).map(function(role) {
    return '<option value="' + role + '"' + (String(member.role || '').trim().toLowerCase() === role ? ' selected' : '') + '>' + escapeHtml(getTenantRoleLabel(role)) + '</option>';
  }).join('');
}

function loadTeamMembers() {
  var grid = document.getElementById('team-grid');
  if (!grid) return;
  if (!isTeamManagerAllowed()) {
    grid.innerHTML = '<div class="team-empty">אין הרשאה לצפייה בעמוד הזה</div>';
    return;
  }
  var search = document.getElementById('team-search') ? document.getElementById('team-search').value.trim().toLowerCase() : '';
  var statusFilter = document.getElementById('team-status-filter') ? document.getElementById('team-status-filter').value : 'all';
  var roleFilter = document.getElementById('team-role-filter') ? document.getElementById('team-role-filter').value : '';
  grid.innerHTML = '<div class="dash-empty">טוען...</div>';
  apiCall('GET', '/api/tenant-members').then(function(data) {
    var members = (data.members || []).slice();
    currentTeamMembers = members;
    members = members.filter(function(member) {
      if (statusFilter === 'active' && String(member.status || '').toLowerCase() !== 'active') return false;
      if (statusFilter === 'inactive' && String(member.status || '').toLowerCase() !== 'inactive') return false;
      if (roleFilter && String(member.role || '').toLowerCase() !== roleFilter) return false;
      if (search) {
        var hay = ((member.name || '') + ' ' + (member.email || '')).toLowerCase();
        if (hay.indexOf(search) === -1) return false;
      }
      return true;
    });
    if (!members.length) {
      grid.innerHTML = '<div class="team-empty">אין משתמשים להצגה</div>';
      return;
    }
    grid.innerHTML = '<div class="team-grid">' + members.map(function(member) {
      var actions = [];
      if (getAssignableTeamRoles(member).length > 0) {
        actions.push('<button class="btn btn-secondary btn-sm team-role-btn" data-id="' + member.membership_id + '">שנה תפקיד</button>');
      }
      if (canManageTeamMember(member) && String(member.status || '').toLowerCase() === 'active') {
        actions.push('<button class="btn btn-danger btn-sm team-deactivate-btn" data-id="' + member.membership_id + '">השבת</button>');
      }
      if (canManageTeamMember(member) && String(member.status || '').toLowerCase() === 'inactive') {
        actions.push('<button class="btn btn-secondary btn-sm team-reactivate-btn" data-id="' + member.membership_id + '">הפעל מחדש</button>');
      }
      if (canManageTeamMember(member)) {
        actions.push('<button class="btn btn-danger btn-sm team-delete-btn" data-id="' + member.membership_id + '">מחק</button>');
      }
      return '<div class="team-card">' +
        '<div class="team-card-header">' +
          '<div style="flex:1">' +
            '<div class="team-card-name">' + escapeHtml(member.name || 'ללא שם') + '</div>' +
            '<div class="team-card-meta">' + escapeHtml(member.email || '—') + '</div>' +
          '</div>' +
          getTeamStatusBadge(member.status) +
        '</div>' +
        '<div class="team-card-badges">' + getTeamRoleBadge(member.role) + '</div>' +
        '<div class="team-card-meta">נוצר: ' + escapeHtml(formatDate(member.created_at) || '—') + '</div>' +
        '<div class="team-inline-note">כניסה אחרונה: ' + escapeHtml(formatDate(member.last_login_at) || '—') + '</div>' +
        '<div class="team-card-actions">' + (actions.join('') || '<span class="team-inline-note">אין פעולות זמינות</span>') + '</div>' +
      '</div>';
    }).join('') + '</div>';

    grid.querySelectorAll('.team-role-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        openTeamRoleModal(parseInt(this.getAttribute('data-id')));
      });
    });
    grid.querySelectorAll('.team-deactivate-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deactivateTeamMember(parseInt(this.getAttribute('data-id')));
      });
    });
    grid.querySelectorAll('.team-reactivate-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        reactivateTeamMember(parseInt(this.getAttribute('data-id')));
      });
    });
    grid.querySelectorAll('.team-delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        deleteTeamMember(parseInt(this.getAttribute('data-id')));
      });
    });
  }).catch(function(e) {
    grid.innerHTML = '<div class="team-empty">שגיאה בטעינת המשתמשים</div>';
    toast(e.message, 'error');
  });
}

function openTeamMemberModal() {
  if (!isTeamManagerAllowed()) {
    toast('Permission denied', 'error');
    return;
  }
  var old = document.getElementById('team-member-modal');
  if (old) old.remove();
  var roleOptions = ['employee', 'manager'];
  if (getTenantRole() === 'owner') roleOptions = ['employee', 'manager', 'admin', 'owner'];
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'team-member-modal';
  overlay.innerHTML =
    '<div class="modal" style="width:560px">' +
      '<div class="modal-header"><h2>הוסף משתמש</h2><button class="modal-close" id="team-member-close">✕</button></div>' +
      '<div class="modal-body">' +
        '<div class="form-group"><label class="form-label">שם *</label><input class="form-input" id="team-member-name" placeholder="שם מלא"></div>' +
        '<div class="form-group"><label class="form-label">אימייל *</label><input class="form-input" id="team-member-email" type="email" placeholder="user@example.com"></div>' +
        '<div class="form-group"><label class="form-label">סיסמה זמנית *</label><input class="form-input" id="team-member-password" type="text" placeholder="סיסמה זמנית"></div>' +
        '<div class="form-group"><label class="form-label">תפקיד *</label><select class="filter-select" id="team-member-role">' + roleOptions.map(function(role) {
          return '<option value="' + role + '">' + escapeHtml(getTenantRoleLabel(role)) + '</option>';
        }).join('') + '</select></div>' +
      '</div>' +
      '<div class="modal-footer"><button class="btn btn-secondary" id="team-member-cancel">ביטול</button><button class="btn btn-primary" id="team-member-save">שמור</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  document.getElementById('team-member-close').onclick = close;
  document.getElementById('team-member-cancel').onclick = close;
  document.getElementById('team-member-save').onclick = function() {
    var body = {
      name: document.getElementById('team-member-name').value.trim(),
      email: document.getElementById('team-member-email').value.trim(),
      password: document.getElementById('team-member-password').value.trim(),
      role: document.getElementById('team-member-role').value
    };
    if (!body.name || !body.email || !body.password || !body.role) {
      toast('יש למלא את כל השדות החובה', 'error');
      return;
    }
    document.getElementById('team-member-save').disabled = true;
    apiCall('POST', '/api/tenant-members', body).then(function() {
      close();
      toast('המשתמש נוסף', 'success');
      loadTeamMembers();
    }).catch(function(e) {
      document.getElementById('team-member-save').disabled = false;
      toast(e.message, 'error');
    });
  };
}

function openTeamRoleModal(membershipId) {
  var member = currentTeamMembers.find(function(item) { return Number(item.membership_id) === Number(membershipId); });
  if (!member) {
    toast('המשתמש לא נמצא', 'error');
    return;
  }
  var options = getAssignableTeamRoles(member);
  if (!options.length) {
    toast('אין הרשאה לשנות את התפקיד של המשתמש הזה', 'error');
    return;
  }
  var old = document.getElementById('team-role-modal');
  if (old) old.remove();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'team-role-modal';
  overlay.innerHTML =
    '<div class="modal" style="width:460px">' +
      '<div class="modal-header"><h2>שנה תפקיד</h2><button class="modal-close" id="team-role-close">✕</button></div>' +
      '<div class="modal-body">' +
        '<div class="team-card-meta" style="margin-bottom:12px">' + escapeHtml(member.name || member.email || '') + '</div>' +
        '<div class="form-group"><label class="form-label">תפקיד חדש</label><select class="filter-select" id="team-role-select">' + getTeamMemberRoleOptions(member) + '</select></div>' +
      '</div>' +
      '<div class="modal-footer"><button class="btn btn-secondary" id="team-role-cancel">ביטול</button><button class="btn btn-primary" id="team-role-save">שמור</button></div>' +
    '</div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  document.getElementById('team-role-close').onclick = close;
  document.getElementById('team-role-cancel').onclick = close;
  document.getElementById('team-role-save').onclick = function() {
    var nextRole = document.getElementById('team-role-select').value;
    if (!canAssignTeamRole(member, nextRole)) {
      toast('אין הרשאה לשנות לתפקיד הזה', 'error');
      return;
    }
    apiCall('PUT', '/api/tenant-members/' + membershipId + '/role', { role: nextRole }).then(function() {
      close();
      toast('התפקיד עודכן', 'success');
      loadTeamMembers();
    }).catch(function(e) { toast(e.message, 'error'); });
  };
}

function deactivateTeamMember(membershipId) {
  var member = currentTeamMembers.find(function(item) { return Number(item.membership_id) === Number(membershipId); });
  if (!member) {
    toast('המשתמש לא נמצא', 'error');
    return;
  }
  if (!confirm('להשבית את המשתמש הזה? הוא לא יוכל להיכנס לעסק עד להפעלה מחדש.')) return;
  apiCall('POST', '/api/tenant-members/' + membershipId + '/deactivate').then(function() {
    toast('המשתמש הושבת', 'success');
    loadTeamMembers();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function reactivateTeamMember(membershipId) {
  var member = currentTeamMembers.find(function(item) { return Number(item.membership_id) === Number(membershipId); });
  if (!member) {
    toast('המשתמש לא נמצא', 'error');
    return;
  }
  if (!confirm('להפעיל מחדש את המשתמש הזה?')) return;
  apiCall('POST', '/api/tenant-members/' + membershipId + '/reactivate').then(function() {
    toast('המשתמש הופעל מחדש', 'success');
    loadTeamMembers();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function deleteTeamMember(membershipId) {
  var member = currentTeamMembers.find(function(item) { return Number(item.membership_id) === Number(membershipId); });
  if (!member) {
    toast('המשתמש לא נמצא', 'error');
    return;
  }
  if (!confirm('למחוק את המשתמש מהעסק? אם הוא לא משויך לעסק נוסף, המשתמש יימחק לגמרי.')) return;
  apiCall('DELETE', '/api/tenant-members/' + membershipId).then(function() {
    toast('המשתמש נמחק', 'success');
    loadTeamMembers();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function loadSuperAdminTenants() {
  var body = document.getElementById('super-admin-tenants-body');
  if (!body) return;
  body.innerHTML = '<tr class="empty-row"><td colspan="6">טוען עסקים...</td></tr>';
  apiCall('GET', '/api/admin/tenants').then(function(data) {
    var tenants = data.tenants || [];
    if (!tenants.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="6">אין עסקים להצגה</td></tr>';
      return;
    }
    body.innerHTML = tenants.map(function(t) {
      var isSuspended = t.status === 'suspended';
      var isTenantOne = Number(t.id) === 1;
      var actionBtn = isTenantOne
        ? '<button class="btn btn-secondary btn-sm" disabled title="tenant 1 protected">מוגן</button>'
        : (isSuspended
          ? '<button class="btn btn-secondary btn-sm" data-tenant-activate="' + t.id + '">הפעל</button>'
          : '<button class="btn btn-danger btn-sm" data-tenant-suspend="' + t.id + '">השהה</button>');
      var statusBadge = '<span class="super-admin-list-status ' + (isSuspended ? 'suspended' : 'active') + '">' + escapeHtml(isSuspended ? 'מושהה' : 'פעיל') + '</span>';
      return '<tr data-tenant-id="' + t.id + '"><td>' + t.id + '</td><td class="bold">' + escapeHtml(t.name || '—') + '<div class="text-muted">' + escapeHtml(t.owner_email || t.contact_email || '—') + '</div></td><td>' + escapeHtml(t.slug || '—') + '</td><td>' + statusBadge + '</td><td>' + escapeHtml(formatDate(t.created_at) || '—') + '</td><td>' + actionBtn + '</td></tr>';
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

function formatCleanupDependencies(deps) {
  deps = deps || [];
  if (!deps.length) return 'אין';
  return deps.map(function(dep) {
    var ids = (dep.ids || []).slice(0, 6).join(',');
    return dep.table + '=' + dep.count + (ids ? ' #' + ids : '');
  }).join(' · ');
}

function cleanupActionButtons(c) {
  var actions = c.actions || [];
  if (!actions.length) return '<span class="text-muted">אין פעולה</span>';
  return actions.map(function(a) {
    var danger = a.action === 'delete';
    var label = escapeHtml(a.label || a.action);
    if (!a.allowed) return '<button class="btn btn-secondary btn-sm" disabled title="' + escapeHtml(a.blocked_reason || 'חסום') + '">' + label + '</button>';
    return '<button class="btn ' + (danger ? 'btn-danger' : 'btn-secondary') + ' btn-sm" data-cleanup-action="' + escapeHtml([c.type, c.id, a.action].join(':')) + '" data-cleanup-preview="' + escapeHtml(formatCleanupDependencies(c.dependencies)) + '">' + label + '</button>';
  }).join(' ');
}

function loadSuperAdminCleanupCandidates() {
  var body = document.getElementById('super-admin-cleanup-body');
  if (!body) return;
  var entity = document.getElementById('super-admin-cleanup-entity');
  var search = document.getElementById('super-admin-cleanup-search');
  var path = '/api/admin/cleanup/candidates?entity=' + encodeURIComponent(entity ? entity.value : 'tenants') + '&search=' + encodeURIComponent(search ? search.value || '' : '');
  body.innerHTML = '<tr class="empty-row"><td colspan="6">טוען רשומות...</td></tr>';
  apiCall('GET', path).then(function(data) {
    var candidates = data.candidates || [];
    if (!candidates.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="6">אין רשומות להצגה</td></tr>';
      return;
    }
    body.innerHTML = candidates.map(function(c) {
      var blocked = c.blocked_reason || c.reason || '—';
      return '<tr>' +
        '<td>' + escapeHtml(c.type || '—') + '</td>' +
        '<td><strong>' + escapeHtml(c.label || ('#' + c.id)) + '</strong><div class="text-muted">tenant ' + escapeHtml(c.tenant_id || '—') + ' · id ' + escapeHtml(c.id || '—') + (c.owner_email ? ' · owner ' + escapeHtml(c.owner_email) : '') + '</div></td>' +
        '<td>' + escapeHtml(c.status || '—') + '</td>' +
        '<td style="max-width:300px;white-space:normal">' + escapeHtml(formatCleanupDependencies(c.dependencies)) + '</td>' +
        '<td style="max-width:280px;white-space:normal">' + escapeHtml(blocked) + '</td>' +
        '<td style="min-width:220px">' + cleanupActionButtons(c) + '</td>' +
      '</tr>';
    }).join('');
    body.querySelectorAll('[data-cleanup-action]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var parts = String(this.getAttribute('data-cleanup-action') || '').split(':');
        runCleanupAction(parts[0], Number(parts[1]), parts[2], this.getAttribute('data-cleanup-preview') || '');
      });
    });
  }).catch(function(err) {
    body.innerHTML = '<tr class="empty-row"><td colspan="6">' + escapeHtml(err.message || 'שגיאה בטעינת רשומות') + '</td></tr>';
  });
}

function runCleanupAction(type, id, action, dependencyPreview) {
  var body = { type: type, id: id, action: action };
  if (action === 'delete') {
    var previewText = dependencyPreview || 'אין';
    var confirmation = window.prompt('Dependency preview / תצוגת תלותים לפני מחיקה:\\n' + previewText + '\\n\\nמחיקה מלאה — לא ניתן לשחזר. להקליד DELETE כדי למחוק קשיח');
    if (confirmation === null) return;
    if (confirmation !== 'DELETE') { toast('אישור לא תואם — המחיקה בוטלה', 'error'); return; }
    body.confirmation = confirmation;
  }
  apiCall('POST', '/api/admin/cleanup/action', body).then(function() {
    toast(action === 'delete' ? 'הרשומה נמחקה ונרשמה ב-audit' : 'הפעולה בוצעה ונרשמה ב-audit', 'success');
    loadSuperAdminCleanupCandidates();
    loadSuperAdminTenants();
  }).catch(function(err) {
    toast(err.message || 'הפעולה נחסמה', 'error');
    loadSuperAdminCleanupCandidates();
  });
}

function openSuperAdminCreateModal() {
  var modal = document.getElementById('super-admin-create-modal');
  if (modal) modal.classList.add('open');
}

function closeSuperAdminCreateModal() {
  var modal = document.getElementById('super-admin-create-modal');
  if (modal) modal.classList.remove('open');
}

function syncModuleToggleLabel(label, checked) {
  if (!label) return;
  label.classList.toggle('checked', !!checked);
  var status = label.querySelector('.module-toggle-status');
  if (status) status.textContent = checked ? 'פעיל' : 'כבוי';
  var pill = label.querySelector('.module-toggle-pill');
  if (pill) pill.textContent = checked ? 'ON' : 'OFF';
}

function bindModuleToggleGroup(container) {
  if (!container) return;
  container.querySelectorAll('label.module-toggle').forEach(function(label) {
    var input = label.querySelector('input[data-module-key]');
    if (!input) return;
    syncModuleToggleLabel(label, !!input.checked);
    if (label.getAttribute('data-module-bound') === '1') return;
    label.setAttribute('data-module-bound', '1');
    label.addEventListener('click', function(e) {
      e.preventDefault();
      input.checked = !input.checked;
      syncModuleToggleLabel(label, !!input.checked);
    });
  });
}

function resetSuperAdminCreateForm() {
  document.getElementById('super-admin-create-name').value = '';
  document.getElementById('super-admin-create-contact-name').value = '';
  document.getElementById('super-admin-create-contact-phone').value = '';
  document.getElementById('super-admin-create-contact-email').value = '';
  document.getElementById('super-admin-create-password').value = '';
  Array.prototype.slice.call(document.querySelectorAll('#super-admin-create-modules input[data-module-key]')).forEach(function(input) {
    input.checked = true;
    syncModuleToggleLabel(input.closest('label'), true);
  });
}

function createTenantFromSuperAdmin() {
  var moduleInputs = Array.prototype.slice.call(document.querySelectorAll('#super-admin-create-modules input[data-module-key]'));
  var body = {
    name: (document.getElementById('super-admin-create-name').value || '').trim(),
    contact_name: (document.getElementById('super-admin-create-contact-name').value || '').trim(),
    contact_phone: (document.getElementById('super-admin-create-contact-phone').value || '').trim(),
    contact_email: (document.getElementById('super-admin-create-contact-email').value || '').trim(),
    initial_password: document.getElementById('super-admin-create-password').value || '',
    modules: moduleInputs.map(function(input) {
      return {
        module_key: input.getAttribute('data-module-key'),
        is_enabled: !!input.checked
      };
    })
  };
  if (!body.name) { toast('שם עסק חובה', 'error'); return; }
  if (!body.contact_name) { toast('שם איש קשר חובה', 'error'); return; }
  if (!body.contact_phone) { toast('טלפון איש קשר חובה', 'error'); return; }
  if (!body.contact_email) { toast('אימייל איש קשר חובה', 'error'); return; }
  if (!body.initial_password) { toast('סיסמה ראשונית חובה', 'error'); return; }
  apiCall('POST', '/api/admin/tenants', body).then(function() {
    resetSuperAdminCreateForm();
    closeSuperAdminCreateModal();
    loadSuperAdminTenants();
    toast('העסק נפתח בהצלחה', 'success');
  }).catch(function(err) {
    toast(err.message || 'שגיאה בפתיחת עסק', 'error');
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
  currentSuperAdminTenantDetail = null;
  if (modal) modal.classList.remove('open');
}

function getAdminModuleLabel(moduleKey) {
  var map = {
    leads: 'לידים / אירועים',
    contacts: 'לקוחות / אנשי קשר',
    employees: 'עובדים',
    products: 'מוצרים ומלאי',
    shopping: 'קניות / רכישות',
    reports: 'דוחות',
    sales_documents: 'מסמכי מכירה',
    strategic_contacts: 'קשרים אסטרטגיים'
  };
  return map[moduleKey] || moduleKey;
}

function getAdminAuditActionLabel(action) {
  var map = {
    tenant_create: 'יצירת עסק',
    tenant_update: 'עדכון פרטי עסק',
    tenant_activate: 'הפעלת עסק',
    tenant_suspend: 'השהיית עסק',
    tenant_modules_update: 'עדכון מודולים',
    tenant_owner_password_reset: 'איפוס סיסמת בעלים'
  };
  return map[action] || action;
}

function saveSuperAdminTenantDetails(tenantId) {
  var body = {
    name: (document.getElementById('super-admin-edit-name').value || '').trim(),
    contact_name: (document.getElementById('super-admin-edit-contact-name').value || '').trim(),
    contact_phone: (document.getElementById('super-admin-edit-contact-phone').value || '').trim(),
    contact_email: (document.getElementById('super-admin-edit-contact-email').value || '').trim(),
    status: (document.getElementById('super-admin-edit-status').value || '').trim()
  };
  if (!body.name) { toast('שם עסק חובה', 'error'); return; }
  if (!body.contact_name) { toast('שם איש קשר חובה', 'error'); return; }
  if (!body.contact_phone) { toast('טלפון איש קשר חובה', 'error'); return; }
  if (!body.contact_email) { toast('אימייל איש קשר חובה', 'error'); return; }
  apiCall('PUT', '/api/admin/tenants/' + tenantId, body).then(function() {
    toast('פרטי העסק עודכנו', 'success');
    loadSuperAdminTenants();
    openSuperAdminTenantModal(tenantId);
  }).catch(function(err) {
    toast(err.message || 'שגיאה בעדכון פרטי העסק', 'error');
  });
}

function saveSuperAdminTenantModules(tenantId) {
  var moduleRows = Array.prototype.slice.call(document.querySelectorAll('#super-admin-tenant-modules-form .super-admin-module-row'));
  var body = {
    modules: moduleRows.map(function(row, index) {
      var input = row.querySelector('input[data-module-key]');
      return {
        module_key: input.getAttribute('data-module-key'),
        is_enabled: !!input.checked,
        sort_order: index + 1
      };
    })
  };
  apiCall('PUT', '/api/admin/tenants/' + tenantId + '/modules', body).then(function() {
    toast('המודולים עודכנו', 'success');
    openSuperAdminTenantModal(tenantId);
  }).catch(function(err) {
    toast(err.message || 'שגיאה בעדכון מודולים', 'error');
  });
}

function resetSuperAdminTenantOwnerPassword(tenantId) {
  var password = window.prompt('הכנס סיסמה זמנית חדשה לבעלים הראשי');
  if (password === null) return;
  password = String(password || '');
  if (!password) {
    toast('סיסמה זמנית חובה', 'error');
    return;
  }
  apiCall('POST', '/api/admin/tenants/' + tenantId + '/owner/reset-password', { password: password }).then(function() {
    toast('הסיסמה הזמנית של הבעלים אופסה', 'success');
    openSuperAdminTenantModal(tenantId);
  }).catch(function(err) {
    toast(err.message || 'שגיאה באיפוס סיסמת בעלים', 'error');
  });
}

function bindSuperAdminModuleOrdering(container) {
  if (!container) return;
  container.querySelectorAll('[data-module-move]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var row = this.closest('.super-admin-module-row');
      if (!row) return;
      var direction = this.getAttribute('data-module-move');
      if (direction === 'up' && row.previousElementSibling) {
        container.insertBefore(row, row.previousElementSibling);
      }
      if (direction === 'down' && row.nextElementSibling) {
        container.insertBefore(row.nextElementSibling, row);
      }
    });
  });
}

function openSuperAdminTenantModal(tenantId) {
  var modal = document.getElementById('super-admin-tenant-modal');
  var title = document.getElementById('super-admin-tenant-title');
  var body = document.getElementById('super-admin-tenant-body');
  if (!modal || !title || !body) return;
  title.textContent = 'Tenant #' + tenantId;
  body.innerHTML = '<div class="super-admin-loading">טוען פרטי עסק...</div>';
  modal.classList.add('open');
  Promise.all([
    apiCall('GET', '/api/admin/tenants/' + tenantId),
    apiCall('GET', '/api/admin/tenants/' + tenantId + '/modules')
  ]).then(function(results) {
    var tenant = results[0].tenant || {};
    var owner = results[0].owner || null;
    var auditLogs = results[0].audit_logs || [];
    var modules = results[1].modules || [];
    currentSuperAdminTenantDetail = { tenant: tenant, owner: owner, modules: modules, audit_logs: auditLogs };
    title.textContent = (tenant.name || 'Tenant') + ' · #' + tenant.id;
    body.innerHTML = '' +
      '<div class="super-admin-section">' +
        '<div class="super-admin-section-header">' +
          '<div><div class="super-admin-section-title">פרטי העסק</div><div class="super-admin-section-sub">ערוך את פרטי העסק, פרטי הקשר וסטטוס הפעילות.</div></div>' +
        '</div>' +
        '<div class="form-row-3">' +
          '<div class="form-group"><label class="form-label">שם העסק</label><input class="form-input" id="super-admin-edit-name" value="' + escapeHtml(tenant.name || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">Slug</label><input class="form-input" value="' + escapeHtml(tenant.slug || '') + '" disabled></div>' +
          '<div class="form-group"><label class="form-label">סטטוס</label><select class="form-select" id="super-admin-edit-status"><option value="active"' + (tenant.status === 'active' ? ' selected' : '') + '>פעיל</option><option value="suspended"' + (tenant.status === 'suspended' ? ' selected' : '') + '>מושהה</option></select></div>' +
        '</div>' +
        '<div class="form-row-3">' +
          '<div class="form-group"><label class="form-label">שם איש קשר</label><input class="form-input" id="super-admin-edit-contact-name" value="' + escapeHtml(tenant.contact_name || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">טלפון איש קשר</label><input class="form-input" id="super-admin-edit-contact-phone" value="' + escapeHtml(tenant.contact_phone || '') + '"></div>' +
          '<div class="form-group"><label class="form-label">אימייל איש קשר</label><input class="form-input" id="super-admin-edit-contact-email" value="' + escapeHtml(tenant.contact_email || '') + '"></div>' +
        '</div>' +
        '<div class="super-admin-meta-grid">' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">Timezone</div><div class="super-admin-info-value">' + escapeHtml(tenant.timezone || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">Currency</div><div class="super-admin-info-value">' + escapeHtml(tenant.currency || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">Locale</div><div class="super-admin-info-value">' + escapeHtml(tenant.locale || '—') + '</div></div>' +
        '</div>' +
        '<div class="super-admin-action-row"><button class="btn btn-primary super-admin-primary-action" id="super-admin-save-tenant">שמור פרטי עסק</button></div>' +
      '</div>' +
      '<div class="super-admin-section">' +
        '<div class="super-admin-section-header">' +
          '<div><div class="super-admin-section-title">בעלים ראשי</div><div class="super-admin-section-sub">צפייה בפרטי הבעלים הראשי ואיפוס סיסמה זמנית במקרה הצורך.</div></div>' +
        '</div>' +
      (owner ?
        '<div class="super-admin-owner-grid">' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">שם</div><div class="super-admin-info-value">' + escapeHtml(owner.name || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">אימייל</div><div class="super-admin-info-value">' + escapeHtml(owner.email || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">סטטוס שיוך</div><div class="super-admin-info-value">' + escapeHtml(owner.membership_status || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">כניסה אחרונה</div><div class="super-admin-info-value">' + escapeHtml(formatDate(owner.last_login_at) || '—') + '</div></div>' +
          '<div class="super-admin-info-card"><div class="super-admin-info-label">חובת החלפת סיסמה</div><div class="super-admin-info-value">' + escapeHtml(owner.must_change_password ? 'כן' : 'לא') + '</div></div>' +
        '</div>' +
        '<div class="super-admin-action-row"><button class="btn super-admin-danger-soft" id="super-admin-reset-owner-password">איפוס סיסמה זמנית לבעלים</button></div>'
      : '<div class="super-admin-audit-empty">לא נמצא בעלים ראשי</div>') +
      '</div>' +
      '<div class="super-admin-section">' +
        '<div class="super-admin-section-header">' +
          '<div><div class="super-admin-section-title">מודולים וסדר תפריט</div><div class="super-admin-section-sub">הפעל/השבת מודולים ושנה את סדר הופעתם בסרגל הצד של העסק.</div></div>' +
        '</div>' +
        '<div class="admin-module-grid" id="super-admin-tenant-modules-form">' + modules.map(function(module) {
        return '<div class="admin-module-card super-admin-module-row" data-module-key="' + escapeHtml(module.module_key) + '">' +
          '<label class="module-toggle' + (module.is_enabled ? ' checked' : '') + '"><input type="checkbox" data-module-key="' + escapeHtml(module.module_key) + '"' + (module.is_enabled ? ' checked' : '') + '><span class="module-toggle-text"><span class="module-toggle-title">' + escapeHtml(getAdminModuleLabel(module.module_key)) + '</span><span class="module-toggle-status">' + (module.is_enabled ? 'פעיל' : 'כבוי') + '</span></span><span class="module-toggle-pill">' + (module.is_enabled ? 'ON' : 'OFF') + '</span></label>' +
          '<div class="super-admin-action-row" style="margin-top:8px"><button class="btn btn-secondary btn-sm" data-module-move="up">↑</button><button class="btn btn-secondary btn-sm" data-module-move="down">↓</button></div>' +
        '</div>';
      }).join('') + '</div>' +
        '<div class="super-admin-action-row"><button class="btn btn-primary super-admin-primary-action" id="super-admin-save-modules">שמור מודולים וסדר</button></div>' +
      '</div>' +
      '<div class="super-admin-section" style="margin-bottom:0">' +
        '<div class="super-admin-section-header">' +
          '<div><div class="super-admin-section-title">Audit Log</div><div class="super-admin-section-sub">רישום פעולות אחרונות עבור העסק הנבחר.</div></div>' +
        '</div>' +
      (auditLogs.length ? '<div class="admin-module-grid">' + auditLogs.map(function(item) {
        var details = item.details_json || '';
        if (details && details.length > 180) details = details.slice(0, 177) + '...';
        return '<div class="admin-module-card">' +
          '<div class="admin-module-title">' + escapeHtml(getAdminAuditActionLabel(item.action)) + '</div>' +
          '<div class="admin-module-sub">' + escapeHtml(formatDate(item.created_at) || '—') + '</div>' +
          '<div class="admin-module-sub">' + escapeHtml(item.actor_email || '—') + '</div>' +
          '<div class="admin-module-sub" style="margin-top:6px;white-space:pre-wrap;word-break:break-word">' + escapeHtml(details || 'ללא פרטים') + '</div>' +
        '</div>';
      }).join('') + '</div>' : '<div class="super-admin-audit-empty">אין אירועי audit להצגה</div>') +
      '</div>';

    var saveTenantBtn = document.getElementById('super-admin-save-tenant');
    if (saveTenantBtn) saveTenantBtn.onclick = function() { saveSuperAdminTenantDetails(tenantId); };
    var saveModulesBtn = document.getElementById('super-admin-save-modules');
    if (saveModulesBtn) saveModulesBtn.onclick = function() { saveSuperAdminTenantModules(tenantId); };
    var resetOwnerPasswordBtn = document.getElementById('super-admin-reset-owner-password');
    if (resetOwnerPasswordBtn) resetOwnerPasswordBtn.onclick = function() { resetSuperAdminTenantOwnerPassword(tenantId); };
    bindModuleToggleGroup(document.getElementById('super-admin-tenant-modules-form'));
    bindSuperAdminModuleOrdering(document.getElementById('super-admin-tenant-modules-form'));
  }).catch(function(err) {
    body.innerHTML = '<div class="super-admin-audit-empty">' + escapeHtml(err.message || 'שגיאה בטעינת העסק') + '</div>';
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
    if (nb) { nb.textContent = ''; nb.style.display = 'none'; }
    var fuEl = document.getElementById('dash-followups');
    fuEl.innerHTML = d.followUps.length ? d.followUps.map(function(l) {
      return '<div class="dash-item" data-id="' + l.id + '"><div><div class="dash-item-name">' + l.name + '</div><div class="dash-item-sub">' + (l.event_type||'') + (l.event_date ? ' - ' + formatDate(l.event_date) : '') + '</div></div>' + statusBadge(l.status) + '</div>';
    }).join('') : renderGuidedEmptyState('אין מעקבים להיום', 'כשתוסיף לידים ואירועים, המשימות הקרובות יופיעו כאן.', 'צור ליד ראשון', 'openLeadModal()');
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
    }).join('') : renderGuidedEmptyState('אין לידים עדיין', 'זה מקום טוב להתחיל ממנו. הוסף ליד ראשון ותראה כאן את הפעילות האחרונה שלך.', 'צור ליד ראשון', 'openLeadModal()');
    document.querySelectorAll('.dash-item[data-id]').forEach(function(el) {
      el.addEventListener('click', function() { openEventDetailsModal(parseInt(this.getAttribute('data-id'))); });
    });
    allLeadsCache = d.allLeads || allLeadsCache;
    renderMiniCal(d.allLeads || []);
    loadMonthlyClientReport();
  }).catch(function(e) { toast(e.message, 'error'); });
}

function getMonthlyClientReportMonth() {
  var input = document.getElementById('monthly-client-month');
  var now = new Date();
  var fallback = now.getFullYear() + '-' + pad2(now.getMonth() + 1);
  return input && input.value ? input.value : fallback;
}

function loadMonthlyClientReport() {
  var body = document.getElementById('monthly-client-body');
  var summary = document.getElementById('monthly-client-summary');
  if (!body || !summary) return;
  var month = getMonthlyClientReportMonth();
  body.innerHTML = '<tr class="empty-row"><td colspan="8">טוען...</td></tr>';
  summary.innerHTML = '<div class="dash-empty">טוען סיכום חודשי...</div>';
  apiCall('GET', '/api/dashboard/monthly-client-events?month=' + encodeURIComponent(month)).then(function(data) {
    monthlyClientReportData = data;
    renderMonthlyClientReport(data);
  }).catch(function(err) {
    body.innerHTML = '<tr class="empty-row"><td colspan="8">שגיאה בטעינת הסיכום</td></tr>';
    summary.innerHTML = '<div class="dash-empty">' + escapeHtml(err.message || 'שגיאה בטעינת הסיכום') + '</div>';
  });
}

function renderMonthlyClientReport(data) {
  var body = document.getElementById('monthly-client-body');
  var summary = document.getElementById('monthly-client-summary');
  if (!body || !summary) return;
  var totals = data.totals || {};
  var clients = data.clients || [];
  summary.innerHTML = '<div class="monthly-client-summary">' +
    '<div class="monthly-client-summary-card"><div class="monthly-client-summary-value">' + Number(totals.client_count || 0) + '</div><div class="monthly-client-summary-label">לקוחות</div></div>' +
    '<div class="monthly-client-summary-card"><div class="monthly-client-summary-value">' + Number(totals.event_count || 0) + '</div><div class="monthly-client-summary-label">אירועים</div></div>' +
    '<div class="monthly-client-summary-card"><div class="monthly-client-summary-value">' + Number(totals.future_count || 0) + '</div><div class="monthly-client-summary-label">עתידיים</div></div>' +
    '<div class="monthly-client-summary-card"><div class="monthly-client-summary-value">₪' + fmtMoney(totals.total_amount || 0) + '</div><div class="monthly-client-summary-label">סה״כ לחיוב</div></div>' +
  '</div>';
  if (!clients.length) {
    body.innerHTML = '<tr class="empty-row"><td colspan="8">אין אירועים בחודש הנבחר</td></tr>';
    return;
  }
  body.innerHTML = clients.map(function(row) {
    return '<tr>' +
      '<td class="bold">' + escapeHtml(row.client_name || 'ללא שם') + '</td>' +
      '<td>' + escapeHtml(row.client_phone || '—') + '</td>' +
      '<td>' + Number(row.event_count || 0) + '</td>' +
      '<td>' + Number(row.future_count || 0) + '</td>' +
      '<td>' + escapeHtml(formatDate(row.first_event_date) || '—') + '</td>' +
      '<td>' + escapeHtml(formatDate(row.last_event_date) || '—') + '</td>' +
      '<td class="bold">₪' + fmtMoney(row.total_amount || 0) + '</td>' +
      '<td>₪' + fmtMoney(row.total_balance || 0) + '</td>' +
    '</tr>';
  }).join('');
}

function excelCell(value) {
  value = value === undefined || value === null ? '' : String(value);
  return '<td style="border:1px solid #ddd;padding:6px">' + escapeHtml(value) + '</td>';
}

function exportMonthlyClientReportToExcel() {
  var data = monthlyClientReportData;
  if (!data) { loadMonthlyClientReport(); toast('טוען נתונים ליצוא, נסה שוב בעוד רגע', 'error'); return; }
  var totals = data.totals || {};
  var clients = data.clients || [];
  var events = data.events || [];
  var title = 'סיכום אירועים חודשי לפי לקוח - ' + (data.month || getMonthlyClientReportMonth());
  var html = '<html><head><meta charset="UTF-8"></head><body dir="rtl">' +
    '<h2>' + escapeHtml(title) + '</h2>' +
    '<p>לקוחות: ' + Number(totals.client_count || 0) + ' | אירועים: ' + Number(totals.event_count || 0) + ' | עתידיים: ' + Number(totals.future_count || 0) + ' | סה״כ: ₪' + fmtMoney(totals.total_amount || 0) + '</p>' +
    '<h3>סיכום לפי לקוח</h3><table><tr><th>לקוח</th><th>טלפון</th><th>אירועים</th><th>סגורים</th><th>עתידיים</th><th>אירוע ראשון</th><th>אירוע אחרון</th><th>סה״כ</th><th>מקדמות</th><th>יתרה</th></tr>' +
    clients.map(function(row) { return '<tr>' + [row.client_name, row.client_phone, row.event_count, row.closed_count, row.future_count, row.first_event_date, row.last_event_date, row.total_amount, row.total_deposit, row.total_balance].map(excelCell).join('') + '</tr>'; }).join('') +
    '</table><h3>פירוט אירועים</h3><table><tr><th>תאריך</th><th>שעה</th><th>לקוח</th><th>טלפון</th><th>סוג אירוע</th><th>מקום</th><th>סטטוס</th><th>סכום</th><th>מקדמה</th><th>יתרה</th></tr>' +
    events.map(function(row) { return '<tr>' + [row.event_date, row.event_time, row.client_name, row.client_phone, row.event_type, row.venue, row.status, row.price, row.deposit, row.balance].map(excelCell).join('') + '</tr>'; }).join('') +
    '</table></body></html>';
  var blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'monthly-client-events-' + (data.month || getMonthlyClientReportMonth()) + '.xls';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); a.remove(); }, 0);
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
    if (!leads.length) { tbody.innerHTML = '<tr class="empty-row"><td colspan="10"><div class="guided-empty"><div class="guided-empty-title">אין לידים עדיין</div><div class="guided-empty-sub">אפשר להתחיל בקלות עם ליד ראשון ולהוסיף ממנו גם אירוע ופרטי לקוח.</div><button class="btn btn-primary btn-sm" onclick="openLeadModal()">צור ליד ראשון</button></div></td></tr>'; return; }

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



function canEditBusinessSettings() {
  var role = getTenantRole();
  return role === 'owner' || role === 'admin';
}

function getBusinessTypeLabel(type) {
  var labels = { licensed_dealer: 'עוסק מורשה', exempt_dealer: 'עוסק פטור', company: 'חברה בע״מ' };
  return labels[type] || type || '—';
}

function getVatModeLabel(mode) {
  var labels = { standard: 'מע״מ רגיל', exempt: 'פטור ממע״מ' };
  return labels[mode] || mode || '—';
}

function loadBusinessSettings() {
  var body = document.getElementById('business-settings-body');
  var footer = document.getElementById('business-settings-footer');
  var roleBadge = document.getElementById('business-settings-role-badge');
  if (!body) return;
  businessSettingsLoading = true;
  currentBusinessSettings = null;
  body.innerHTML = '<div class="dash-empty">טוען הגדרות עסק...</div>';
  if (footer) footer.style.display = 'none';
  if (roleBadge) roleBadge.textContent = getTenantRoleLabel(getTenantRole());
  apiCall('GET', '/api/tenant-business-settings').then(function(data) {
    currentBusinessSettings = data.settings || {};
    renderBusinessSettingsForm();
  }).catch(function(err) {
    body.innerHTML = '<div class="dash-empty">שגיאה בטעינת הגדרות עסק: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
  }).finally(function() {
    businessSettingsLoading = false;
  });
}

function renderBusinessSettingsForm() {
  var body = document.getElementById('business-settings-body');
  var footer = document.getElementById('business-settings-footer');
  if (!body || !currentBusinessSettings) return;
  var canEdit = canEditBusinessSettings();
  var disabled = !canEdit || businessSettingsSaving;
  var s = currentBusinessSettings;
  var isExemptDealer = s.business_type === 'exempt_dealer';
  var isVatExempt = isExemptDealer || s.vat_mode === 'exempt';
  body.innerHTML =
    (!canEdit ? '<div class="business-settings-permission">אין הרשאה לערוך הגדרות עסק. Owner/Admin יכולים לשנות; משתמשים אחרים יכולים לצפות בלבד.</div>' : '') +
    '<div class="business-settings-section"><div class="business-settings-section-title">א. פרטי עסק</div><div class="business-settings-section-sub">השם והזיהוי שיופיעו במסמכי מכירה חדשים.</div><div class="business-settings-grid">' +
      businessSettingsInput('business_legal_name', 'שם משפטי', s.business_legal_name, disabled) +
      businessSettingsInput('business_display_name', 'שם לתצוגה', s.business_display_name, disabled) +
      businessSettingsInput('business_tax_id', 'ח.פ / עוסק / מזהה מס', s.business_tax_id, disabled) +
      businessSettingsSelect('business_type', 'סוג עסק', s.business_type, [
        ['licensed_dealer', 'עוסק מורשה'],
        ['exempt_dealer', 'עוסק פטור'],
        ['company', 'חברה בע״מ']
      ], disabled) +
    '</div></div>' +
    '<div class="business-settings-section"><div class="business-settings-section-title">ב. מע״מ</div><div class="business-settings-section-sub">השרת מחשב את המע״מ בפועל. במסמכים חדשים בלבד, עוסק פטור תמיד נשמר ללא מע״מ.</div><div class="business-settings-grid">' +
      businessSettingsSelect('vat_mode', 'מצב מע״מ', isExemptDealer ? 'exempt' : s.vat_mode, [
        ['standard', 'מע״מ רגיל'],
        ['exempt', 'פטור ממע״מ']
      ], disabled || isExemptDealer) +
      businessSettingsInput('default_vat_rate', 'אחוז מע״מ ברירת מחדל', isVatExempt ? 0 : s.default_vat_rate, disabled || isVatExempt, 'number', '0.01') +
    '</div><div class="business-settings-note ' + (isVatExempt ? 'exempt' : '') + '" id="business-settings-vat-note">' +
      (isExemptDealer ? 'עוסק פטור — ללא מע״מ. אחוז המע״מ נעול ל־0 והשרת יאכוף זאת גם אם לקוח שולח ערך אחר.' : (isVatExempt ? 'מצב פטור ממע״מ — מסמכים חדשים יחושבו עם 0% מע״מ.' : 'ברירת המחדל לעסקים חייבי מע״מ בישראל היא 18%.')) +
    '</div></div>' +
    '<div class="business-settings-section"><div class="business-settings-section-title">ג. פרטי מסמך</div><div class="business-settings-section-sub">פרטי יצירת קשר ולוגו שיופיעו במסמכים חדשים.</div><div class="business-settings-grid">' +
      businessSettingsInput('business_address', 'כתובת העסק', s.business_address, disabled) +
      businessSettingsInput('business_phone', 'טלפון עסק', s.business_phone, disabled, 'tel') +
      businessSettingsInput('business_email', 'אימייל עסק', s.business_email, disabled, 'email') +
      businessSettingsLogoControl(s.logo_url, disabled) +
    '</div></div>' +
    '<div class="business-settings-section"><div class="business-settings-section-title">ד. ברירות מחדל למסמכים</div><div class="business-settings-section-sub">יועתקו למסמך חדש ואז ניתן יהיה לערוך במסמך עצמו.</div><div class="business-settings-grid single">' +
      businessSettingsTextarea('default_payment_terms', 'תנאי תשלום', s.default_payment_terms, disabled) +
      businessSettingsTextarea('default_cancellation_policy', 'מדיניות ביטול', s.default_cancellation_policy, disabled) +
      businessSettingsTextarea('default_document_footer', 'Footer קבוע למסמך', s.default_document_footer, disabled) +
      businessSettingsTextarea('default_notes', 'הערות ברירת מחדל', s.default_notes, disabled) +
    '</div></div>' +
    businessSettingsMobileNavControl();
  bindBusinessSettingsForm();
  bindMobileNavSettings();
  if (footer) {
    footer.style.display = 'flex';
    footer.innerHTML = '<div class="business-settings-status">' + (canEdit ? 'השינויים ישפיעו על מסמכים חדשים בלבד.' : 'מצב צפייה בלבד') + '</div>' +
      (canEdit ? '<button class="btn btn-primary" id="business-settings-save">שמור הגדרות</button>' : '<button class="btn btn-secondary" disabled>אין הרשאת עריכה</button>');
    var saveBtn = document.getElementById('business-settings-save');
    if (saveBtn) saveBtn.addEventListener('click', saveBusinessSettings);
  }
}


function businessSettingsMobileNavControl() {
  var selected = getMobileBottomNavSelection();
  var options = getAvailableCrmMobileNavItems().map(function(item) {
    var checked = selected.indexOf(item.navId) !== -1;
    return '<label class="mobile-settings-toggle' + (checked ? ' checked' : '') + '"><span><span class="nav-icon">' + escapeHtml(item.icon) + '</span> ' + escapeHtml(item.label) + '</span><input type="checkbox" data-mobile-bottom-nav="' + escapeHtml(item.navId) + '"' + (checked ? ' checked' : '') + '><span>' + (checked ? 'מוצג' : 'מוסתר') + '</span></label>';
  }).join('');
  return '<div class="business-settings-section"><div class="business-settings-section-title">ה. הגדרות בנייד</div><div class="business-settings-section-sub">בחר אילו מודולים יופיעו בתפריט התחתון בנייד. כל המודולים זמינים תמיד דרך תפריט ההמבורגר למעלה.</div><div class="mobile-settings-grid" id="mobile-bottom-nav-settings">' + options + '</div><div class="mobile-settings-hint">ההגדרה נשמרת למכשיר/משתמש הזה ולא משנה את הרשאות המודולים של העסק.</div></div>';
}

function bindMobileNavSettings() {
  var container = document.getElementById('mobile-bottom-nav-settings');
  if (!container) return;
  container.querySelectorAll('input[data-mobile-bottom-nav]').forEach(function(input) {
    input.addEventListener('change', function() {
      var selected = Array.prototype.slice.call(container.querySelectorAll('input[data-mobile-bottom-nav]:checked')).map(function(el) { return el.getAttribute('data-mobile-bottom-nav'); });
      if (!selected.length) {
        input.checked = true;
        toast('צריך להשאיר לפחות מודול אחד בתפריט התחתון', 'error');
        return;
      }
      if (selected.length > 5) {
        input.checked = false;
        toast('אפשר להציג עד 5 מודולים בתפריט התחתון. השאר זמינים מהתפריט העליון.', 'error');
        return;
      }
      saveMobileBottomNavSelection(selected);
      renderBusinessSettingsForm();
      toast('הגדרות התפריט בנייד נשמרו', 'success');
    });
  });
}

function businessSettingsInput(field, label, value, disabled, type, step) {
  var attrs = type === 'number' ? ' min="0" step="' + escapeHtml(step || '1') + '" inputmode="decimal"' : '';
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><input class="form-input business-settings-field" data-business-settings-field="' + escapeHtml(field) + '" type="' + escapeHtml(type || 'text') + '" value="' + escapeHtml(value === undefined || value === null ? '' : value) + '"' + attrs + (disabled ? ' disabled' : '') + '></div>';
}

function businessSettingsLogoControl(value, disabled) {
  var hasLogo = !!value;
  var preview = hasLogo ? '<img alt="לוגו העסק" src="' + escapeHtml(value) + '">' : 'אין לוגו';
  return '<div class="form-group" style="margin-bottom:0;grid-column:1/-1">' +
    '<label class="form-label">לוגו להצעות מחיר וחשבוניות</label>' +
    '<input type="hidden" class="business-settings-field" data-business-settings-field="logo_url" id="business-logo-value" value="' + escapeHtml(value || '') + '">' +
    '<div class="business-logo-upload">' +
      '<div class="business-logo-preview" id="business-logo-preview">' + preview + '</div>' +
      '<div class="business-logo-actions">' +
        '<button type="button" class="btn btn-secondary btn-sm" id="business-logo-pick"' + (disabled ? ' disabled' : '') + '>בחר תמונת לוגו</button>' +
        '<input id="business-logo-file" class="business-logo-file-input" type="file" accept="image/*"' + (disabled ? ' disabled' : '') + '>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="business-logo-clear"' + (disabled || !hasLogo ? ' disabled' : '') + '>הסר לוגו</button>' +
      '</div>' +
      '<div class="business-logo-help">אפשר לבחור תמונה עד 8MB. המערכת תדחוס אותה אוטומטית ללוגו קל למסמכים חדשים.</div>' +
    '</div>' +
  '</div>';
}

function businessSettingsSelect(field, label, value, options, disabled) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><select class="form-select business-settings-field" data-business-settings-field="' + escapeHtml(field) + '"' + (disabled ? ' disabled' : '') + '>' +
    options.map(function(option) { return '<option value="' + escapeHtml(option[0]) + '"' + (String(value || '') === option[0] ? ' selected' : '') + '>' + escapeHtml(option[1]) + '</option>'; }).join('') +
  '</select></div>';
}

function businessSettingsTextarea(field, label, value, disabled) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><textarea class="form-textarea business-settings-field" data-business-settings-field="' + escapeHtml(field) + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(value || '') + '</textarea></div>';
}

function bindBusinessSettingsForm() {
  document.querySelectorAll('.business-settings-field').forEach(function(input) {
    input.addEventListener('input', function() { updateBusinessSettingsDraft(this); });
    input.addEventListener('change', function() { updateBusinessSettingsDraft(this); });
  });
  var logoFile = document.getElementById('business-logo-file');
  if (logoFile) logoFile.addEventListener('change', handleBusinessLogoFile);
  var logoPick = document.getElementById('business-logo-pick');
  if (logoPick && logoFile) logoPick.addEventListener('click', function() { logoFile.click(); });
  var logoClear = document.getElementById('business-logo-clear');
  if (logoClear) logoClear.addEventListener('click', clearBusinessLogo);
}

function setBusinessLogoValue(value) {
  if (!currentBusinessSettings || businessSettingsSaving) return;
  currentBusinessSettings.logo_url = value || '';
  var hidden = document.getElementById('business-logo-value');
  if (hidden) hidden.value = currentBusinessSettings.logo_url;
  var preview = document.getElementById('business-logo-preview');
  if (preview) {
    preview.innerHTML = currentBusinessSettings.logo_url ? '<img alt="לוגו העסק" src="' + escapeHtml(currentBusinessSettings.logo_url) + '">' : 'אין לוגו';
  }
  var clearBtn = document.getElementById('business-logo-clear');
  if (clearBtn) clearBtn.disabled = !currentBusinessSettings.logo_url;
}

function handleBusinessLogoFile(event) {
  var input = event.target;
  var file = input && input.files && input.files[0];
  if (!file) return;
  if (!/^image\\//.test(file.type || '')) {
    toast('אפשר להעלות קובץ תמונה בלבד', 'error');
    input.value = '';
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    toast('הלוגו גדול מדי. עד 8MB', 'error');
    input.value = '';
    return;
  }
  optimizeBusinessLogoFile(file).then(function(dataUrl) {
    setBusinessLogoValue(dataUrl || '');
    toast('הלוגו עבר אופטימיזציה — לא לשכוח לשמור הגדרות', 'success');
  }).catch(function() {
    toast('שגיאה בעיבוד קובץ הלוגו', 'error');
    input.value = '';
  });
}

function optimizeBusinessLogoFile(file) {
  return new Promise(function(resolve, reject) {
    var objectUrl = URL.createObjectURL(file);
    var image = new Image();
    image.onload = function() {
      try {
        var targetBytes = 420000;
        var maxWidth = 700;
        var maxHeight = 350;
        var ratio = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);

        var dataUrl = '';
        var qualities = [0.82, 0.68, 0.54, 0.42, 0.32, 0.24];
        for (var attempt = 0; attempt < 8; attempt++) {
          for (var q = 0; q < qualities.length; q++) {
            dataUrl = canvas.toDataURL('image/webp', qualities[q]);
            if (!dataUrl || dataUrl.indexOf('data:image/webp') !== 0) dataUrl = canvas.toDataURL('image/jpeg', qualities[q]);
            if (dataUrl.length <= targetBytes) {
              resolve(dataUrl);
              return;
            }
          }
          var smaller = document.createElement('canvas');
          smaller.width = Math.max(1, Math.round(canvas.width * 0.75));
          smaller.height = Math.max(1, Math.round(canvas.height * 0.75));
          var smallerCtx = smaller.getContext('2d');
          smallerCtx.clearRect(0, 0, smaller.width, smaller.height);
          smallerCtx.drawImage(canvas, 0, 0, smaller.width, smaller.height);
          canvas = smaller;
        }

        dataUrl = canvas.toDataURL('image/jpeg', 0.2);
        if (dataUrl.length > 800000) throw new Error('optimized logo too large');
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    image.onerror = function(err) {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    image.src = objectUrl;
  });
}

function clearBusinessLogo() {
  if (!confirm('להסיר את הלוגו מהגדרות העסק?')) return;
  setBusinessLogoValue('');
  var input = document.getElementById('business-logo-file');
  if (input) input.value = '';
}

function updateBusinessSettingsDraft(input) {
  if (!currentBusinessSettings || businessSettingsSaving) return;
  var field = input.getAttribute('data-business-settings-field');
  var value = input.value;
  currentBusinessSettings[field] = field === 'default_vat_rate' ? Number(value || 0) : value;
  if (field === 'business_type' && value === 'exempt_dealer') {
    currentBusinessSettings.vat_mode = 'exempt';
    currentBusinessSettings.default_vat_rate = 0;
    renderBusinessSettingsForm();
    return;
  }
  if (field === 'vat_mode' && value === 'exempt') {
    currentBusinessSettings.default_vat_rate = 0;
    renderBusinessSettingsForm();
    return;
  }
  if (field === 'vat_mode' && value === 'standard' && Number(currentBusinessSettings.default_vat_rate || 0) === 0) {
    currentBusinessSettings.default_vat_rate = 18;
    renderBusinessSettingsForm();
  }
}

function buildBusinessSettingsPayload() {
  var s = currentBusinessSettings || {};
  return {
    business_legal_name: s.business_legal_name || null,
    business_display_name: s.business_display_name || null,
    business_tax_id: s.business_tax_id || null,
    business_type: s.business_type || 'licensed_dealer',
    vat_mode: s.business_type === 'exempt_dealer' ? 'exempt' : (s.vat_mode || 'standard'),
    default_vat_rate: (s.business_type === 'exempt_dealer' || s.vat_mode === 'exempt') ? 0 : Number(s.default_vat_rate || 18),
    business_address: s.business_address || null,
    business_phone: s.business_phone || null,
    business_email: s.business_email || null,
    logo_url: s.logo_url || null,
    default_payment_terms: s.default_payment_terms || null,
    default_cancellation_policy: s.default_cancellation_policy || null,
    default_document_footer: s.default_document_footer || null,
    default_notes: s.default_notes || null
  };
}

function saveBusinessSettings() {
  if (businessSettingsLoading || businessSettingsSaving || !currentBusinessSettings) return;
  if (!canEditBusinessSettings()) { toast('אין הרשאה לעריכת הגדרות עסק', 'error'); return; }
  businessSettingsSaving = true;
  var footer = document.getElementById('business-settings-footer');
  if (footer) footer.innerHTML = '<div class="business-settings-status">שומר...</div><button class="btn btn-primary" disabled>שומר...</button>';
  apiCall('PUT', '/api/tenant-business-settings', buildBusinessSettingsPayload()).then(function(data) {
    currentBusinessSettings = data.settings || currentBusinessSettings;
    toast('הגדרות העסק נשמרו', 'success');
    renderBusinessSettingsForm();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בשמירת הגדרות עסק', 'error');
    renderBusinessSettingsForm();
  }).finally(function() {
    businessSettingsSaving = false;
    renderBusinessSettingsForm();
  });
}

function getSalesDocumentTypeLabel(type) {
  return type === 'invoice' ? 'חשבונית' : 'הצעת מחיר';
}

function getSalesDocumentStatusLabel(status) {
  var labels = { draft: 'טיוטה', sent: 'נשלח', accepted: 'אושר', rejected: 'נדחה', cancelled: 'בוטל', expired: 'פג תוקף', converted: 'הומר', issued: 'הונפק', paid: 'שולם', partially_paid: 'שולם חלקית', void: 'מבוטל' };
  return labels[status] || status || '—';
}

function roundSalesMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function formatSalesMoney(value) {
  return '₪' + roundSalesMoney(value).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isSalesDocumentLocked(doc) {
  return !!(doc && (doc.locked_at || doc.issued_at || doc.status !== 'draft'));
}

function ensureTenantBusinessSettings() {
  if (currentBusinessSettings) return Promise.resolve(currentBusinessSettings);
  return apiCall('GET', '/api/tenant-business-settings').then(function(data) {
    currentBusinessSettings = data.settings || {};
    return currentBusinessSettings;
  });
}

function getSalesDocumentBusinessSettings() {
  return currentBusinessSettings || {};
}

function isSalesDocumentVatExempt(doc) {
  var settings = getSalesDocumentBusinessSettings();
  return !!(doc && (doc.business_type_snapshot === 'exempt_dealer' || doc.vat_mode_snapshot === 'exempt')) || settings.business_type === 'exempt_dealer' || settings.vat_mode === 'exempt';
}

function getSalesDocumentDefaultVatRate(doc) {
  if (isSalesDocumentVatExempt(doc)) return 0;
  var rate = doc && doc.default_vat_rate_snapshot !== undefined && doc.default_vat_rate_snapshot !== null && doc.default_vat_rate_snapshot !== '' ? Number(doc.default_vat_rate_snapshot) : Number(getSalesDocumentBusinessSettings().default_vat_rate);
  return Number.isFinite(rate) && rate >= 0 ? rate : 18;
}

function getDefaultBusinessSnapshot() {
  var tenant = currentTenantContext && currentTenantContext.tenant ? currentTenantContext.tenant : {};
  var settings = getSalesDocumentBusinessSettings();
  var businessName = settings.business_display_name || settings.business_legal_name || tenant.name || '';
  var isExempt = settings.business_type === 'exempt_dealer' || settings.vat_mode === 'exempt';
  return {
    business_name_snapshot: businessName,
    business_phone_snapshot: settings.business_phone || tenant.contact_phone || '',
    business_email_snapshot: settings.business_email || tenant.contact_email || '',
    business_address_snapshot: settings.business_address || '',
    business_tax_id: settings.business_tax_id || '',
    business_legal_name_snapshot: settings.business_legal_name || businessName,
    business_display_name_snapshot: settings.business_display_name || businessName,
    business_type_snapshot: settings.business_type || 'licensed_dealer',
    vat_mode_snapshot: isExempt ? 'exempt' : (settings.vat_mode || 'standard'),
    default_vat_rate_snapshot: isExempt ? 0 : Number(settings.default_vat_rate || 18),
    business_logo_url_snapshot: settings.logo_url || '',
    payment_terms_snapshot: settings.default_payment_terms || '',
    cancellation_policy_snapshot: settings.default_cancellation_policy || '',
    document_footer_snapshot: settings.default_document_footer || '',
    default_notes: settings.default_notes || ''
  };
}

function createEmptySalesDocumentDraft(documentType) {
  var business = getDefaultBusinessSnapshot();
  return {
    document_type: documentType === 'invoice' ? 'invoice' : 'quote',
    document_number: 'טיוטה חדשה',
    status: 'draft',
    issue_date: getTodayYMD(),
    valid_until: '',
    due_date: documentType === 'invoice' ? getTodayYMD() : '',
    currency: 'ILS',
    contact_id: null,
    customer_name_snapshot: '',
    customer_phone_snapshot: '',
    customer_email_snapshot: '',
    customer_tax_id: '',
    customer_address_snapshot: '',
    customer_service_address_snapshot: '',
    customer_finance_contact_snapshot: '',
    customer_document_contact_snapshot: '',
    customer_vat_treatment_hint: '',
    customer_credit_status_snapshot: '',
    customer_credit_notes_snapshot: '',
    customer_default_discount_percent: 0,
    customer_default_discount_amount: 0,
    internal_notes: '',
    business_name_snapshot: business.business_name_snapshot,
    business_phone_snapshot: business.business_phone_snapshot,
    business_email_snapshot: business.business_email_snapshot,
    business_address_snapshot: business.business_address_snapshot,
    business_tax_id: business.business_tax_id,
    business_legal_name_snapshot: business.business_legal_name_snapshot,
    business_display_name_snapshot: business.business_display_name_snapshot,
    business_type_snapshot: business.business_type_snapshot,
    vat_mode_snapshot: business.vat_mode_snapshot,
    default_vat_rate_snapshot: business.default_vat_rate_snapshot,
    business_logo_url_snapshot: business.business_logo_url_snapshot,
    payment_terms_snapshot: business.payment_terms_snapshot,
    cancellation_policy_snapshot: business.cancellation_policy_snapshot,
    document_footer_snapshot: business.document_footer_snapshot,
    notes: business.default_notes || '',
    terms: [business.payment_terms_snapshot, business.cancellation_policy_snapshot].filter(Boolean).join('\\n\\n'),
    items: [createEmptySalesDocumentItem(1)]
  };
}

function createEmptySalesDocumentItem(order) {
  return { line_order: order || 1, description: '', quantity: 1, unit_price: 0, vat_rate: getSalesDocumentDefaultVatRate(currentSalesDocumentDraft), discount_amount: 0 };
}

function applySalesDocumentVatRules(doc) {
  if (!doc) return doc;
  var rate = getSalesDocumentDefaultVatRate(doc);
  if (isSalesDocumentVatExempt(doc)) {
    doc.vat_mode_snapshot = 'exempt';
    doc.default_vat_rate_snapshot = 0;
  }
  (doc.items || []).forEach(function(item) {
    if (isSalesDocumentVatExempt(doc)) item.vat_rate = 0;
    else if (item.vat_rate === undefined || item.vat_rate === null || item.vat_rate === '') item.vat_rate = rate;
  });
  return doc;
}

function calculateSalesDocumentPreviewTotals(doc) {
  if (doc) applySalesDocumentVatRules(doc);
  var items = (doc && Array.isArray(doc.items)) ? doc.items : [];
  var vatExempt = isSalesDocumentVatExempt(doc);
  var subtotal = 0;
  var discount = 0;
  var vat = 0;
  var total = 0;
  items.forEach(function(item) {
    var qty = Number(item.quantity || 0);
    var unit = Number(item.unit_price || 0);
    var itemDiscount = Number(item.discount_amount || 0);
    var rate = vatExempt ? 0 : Number(item.vat_rate || 0);
    var gross = roundSalesMoney(qty * unit);
    var net = Math.max(0, roundSalesMoney(gross - itemDiscount));
    var itemVat = roundSalesMoney(net * rate / 100);
    subtotal += gross;
    discount += itemDiscount;
    vat += itemVat;
    total += net + itemVat;
  });
  return { subtotal: roundSalesMoney(subtotal), discount: roundSalesMoney(discount), vat: roundSalesMoney(vat), total: roundSalesMoney(total) };
}

function loadSalesDocuments() {
  var body = document.getElementById('sales-documents-body');
  if (!body) return;
  if (!isModuleEnabled('sales_documents')) {
    renderModuleDisabledPage('salesDocuments', 'sales_documents');
    return;
  }
  body.innerHTML = '<tr class="empty-row"><td colspan="7">טוען...</td></tr>';
  var params = [];
  var typeEl = document.getElementById('sales-documents-type-filter');
  var statusEl = document.getElementById('sales-documents-status-filter');
  var searchEl = document.getElementById('sales-documents-search');
  if (typeEl && typeEl.value) params.push('type=' + encodeURIComponent(typeEl.value));
  if (statusEl && statusEl.value) params.push('status=' + encodeURIComponent(statusEl.value));
  if (searchEl && searchEl.value.trim()) params.push('search=' + encodeURIComponent(searchEl.value.trim()));
  apiCall('GET', '/api/sales-documents' + (params.length ? '?' + params.join('&') : '')).then(function(data) {
    currentSalesDocuments = data.documents || [];
    renderSalesDocumentsList(currentSalesDocuments);
  }).catch(function(err) {
    body.innerHTML = '<tr class="empty-row"><td colspan="7">שגיאה בטעינת מסמכים: ' + escapeHtml(err.message || 'שגיאה') + '</td></tr>';
  });
}

function renderSalesDocumentsList(documents) {
  var body = document.getElementById('sales-documents-body');
  if (!body) return;
  if (!documents || documents.length === 0) {
    body.innerHTML = '<tr class="empty-row"><td colspan="7"><div class="sales-doc-empty-state"><div class="sales-doc-empty-title">אין עדיין מסמכי מכירה</div><div>אפשר ליצור הצעת מחיר או חשבונית חדשה, והמסמך יקבל את הגדרות העסק אוטומטית.</div><div class="sales-doc-empty-actions"><button class="btn btn-primary btn-sm" id="sales-doc-empty-quote">צור הצעת מחיר</button><button class="btn btn-secondary btn-sm" id="sales-doc-empty-invoice">צור חשבונית</button></div></div></td></tr>';
    var emptyQuote = document.getElementById('sales-doc-empty-quote');
    if (emptyQuote) emptyQuote.addEventListener('click', function() { openSalesDocumentEditor('quote'); });
    var emptyInvoice = document.getElementById('sales-doc-empty-invoice');
    if (emptyInvoice) emptyInvoice.addEventListener('click', function() { openSalesDocumentEditor('invoice'); });
    return;
  }
  body.innerHTML = documents.map(function(doc) {
    var dateText = doc.issue_date || (doc.created_at ? String(doc.created_at).slice(0, 10) : '—');
    var canConvert = doc.document_type === 'quote' && ['draft', 'sent', 'accepted'].indexOf(doc.status || 'draft') !== -1;
    return '<tr data-sales-document-id="' + doc.id + '">' +
      '<td class="bold">' + escapeHtml(doc.document_number || '—') + '</td>' +
      '<td><span class="sales-doc-type-pill">' + escapeHtml(getSalesDocumentTypeLabel(doc.document_type)) + '</span></td>' +
      '<td>' + escapeHtml(doc.customer_name_snapshot || '—') + '</td>' +
      '<td><span class="sales-doc-status-pill ' + escapeHtml(doc.status || '') + '">' + escapeHtml(getSalesDocumentStatusLabel(doc.status)) + '</span></td>' +
      '<td class="bold">' + escapeHtml(formatSalesMoney(doc.total_amount || 0)) + '</td>' +
      '<td>' + escapeHtml(dateText) + '</td>' +
      '<td><div class="sales-doc-list-actions"><button class="btn btn-ghost btn-sm" data-open-sales-document="' + doc.id + '">פתח</button><button class="btn btn-secondary btn-sm" data-duplicate-sales-document="' + doc.id + '">שכפל</button>' + (canConvert ? '<button class="btn btn-primary btn-sm" data-convert-sales-document="' + doc.id + '">המר</button>' : '') + '</div></td>' +
    '</tr>';
  }).join('');
  body.querySelectorAll('[data-open-sales-document]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      openExistingSalesDocument(this.getAttribute('data-open-sales-document'));
    });
  });
  body.querySelectorAll('[data-duplicate-sales-document]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      duplicateSalesDocument(this.getAttribute('data-duplicate-sales-document'));
    });
  });
  body.querySelectorAll('[data-convert-sales-document]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      convertSalesDocumentToInvoice(this.getAttribute('data-convert-sales-document'));
    });
  });
  body.querySelectorAll('tr[data-sales-document-id]').forEach(function(row) {
    row.addEventListener('click', function() { openExistingSalesDocument(this.getAttribute('data-sales-document-id')); });
  });
}

function openSalesDocumentEditor(documentType) {
  currentSalesDocumentId = null;
  currentSalesDocumentDraft = null;
  salesDocumentBillingState = { contactId: null, loading: false, profile: null, addresses: [], people: [], error: null };
  var workspace = document.getElementById('sales-document-workspace');
  var body = document.getElementById('sales-document-editor-body');
  var preview = document.getElementById('sales-document-preview');
  var title = document.getElementById('sales-document-editor-title');
  if (workspace) workspace.classList.add('open');
  if (title) title.textContent = getSalesDocumentTypeLabel(documentType) + ' · טוען הגדרות עסק';
  if (body) body.innerHTML = '<div class="dash-empty">טוען הגדרות עסק למסמך חדש...</div>';
  if (preview) preview.innerHTML = '<div class="dash-empty">מכין תצוגה מקדימה...</div>';
  ensureTenantBusinessSettings().then(function() {
    currentSalesDocumentDraft = applySalesDocumentVatRules(createEmptySalesDocumentDraft(documentType));
    renderSalesDocumentEditor();
  }).catch(function(err) {
    currentSalesDocumentDraft = applySalesDocumentVatRules(createEmptySalesDocumentDraft(documentType));
    renderSalesDocumentEditor();
    toast((err && err.message) || 'לא ניתן לטעון הגדרות עסק, נטען מסמך עם ברירות מחדל', 'error');
  });
}

function openExistingSalesDocument(id) {
  if (!id) return;
  apiCall('GET', '/api/sales-documents/' + encodeURIComponent(id)).then(function(data) {
    currentSalesDocumentId = data.document && data.document.id ? data.document.id : id;
    currentSalesDocumentDraft = applySalesDocumentVatRules(data.document);
    renderSalesDocumentEditor();
    if (currentSalesDocumentDraft && currentSalesDocumentDraft.contact_id) loadSalesDocumentBillingForContact(currentSalesDocumentDraft.contact_id, false);
  }).catch(function(err) {
    toast(err.message || 'שגיאה בטעינת המסמך', 'error');
  });
}

function closeSalesDocumentEditorPanel() {
  var workspace = document.getElementById('sales-document-workspace');
  if (workspace) workspace.classList.remove('open');
  currentSalesDocumentDraft = null;
  currentSalesDocumentId = null;
  salesDocumentBillingState = { contactId: null, loading: false, profile: null, addresses: [], people: [], error: null };
}


function ensureSalesDocumentContactOptions() {
  if (salesDocumentContactOptions.length || salesDocumentContactsLoading) return;
  salesDocumentContactsLoading = true;
  apiCall('GET', '/api/contacts').then(function(data) {
    salesDocumentContactOptions = Array.isArray(data.contacts) ? data.contacts : [];
    salesDocumentContactsLoading = false;
    renderSalesDocumentContactSelectOptions();
  }).catch(function(err) {
    salesDocumentContactsLoading = false;
    console.warn('Failed loading sales document contacts', err);
  });
}

function getSalesDocumentContactLabel(contact) {
  if (!contact) return '';
  return (contact.name || 'לקוח #' + contact.id) + (contact.phone ? ' · ' + contact.phone : '') + (contact.email ? ' · ' + contact.email : '');
}

function renderSalesDocumentContactSelectOptions() {
  var select = document.getElementById('sales-document-contact-select');
  if (!select) return;
  var selected = currentSalesDocumentDraft && currentSalesDocumentDraft.contact_id ? Number(currentSalesDocumentDraft.contact_id) : 0;
  var options = '<option value="">ללא קישור — מילוי ידני</option>';
  salesDocumentContactOptions.forEach(function(contact) {
    options += '<option value="' + escapeHtml(contact.id) + '"' + (Number(contact.id) === selected ? ' selected' : '') + '>' + escapeHtml(getSalesDocumentContactLabel(contact)) + '</option>';
  });
  select.innerHTML = options;
}

function findSalesDocumentContact(contactId) {
  return (salesDocumentContactOptions || []).find(function(c) { return Number(c.id) === Number(contactId); }) || null;
}

function formatSalesDocumentAddress(address) {
  if (!address) return '';
  return address.full_address || [address.street, address.city, address.region, address.postal_code, address.country].filter(Boolean).join(', ');
}

function formatSalesDocumentPerson(person) {
  if (!person) return '';
  var parts = [person.name || '', person.title || '', person.phone || '', person.email || ''].filter(Boolean);
  return parts.join(' · ');
}

function findDefaultSalesDocumentAddress(addresses, id, flagName, types) {
  if (!Array.isArray(addresses) || !addresses.length) return null;
  if (id) {
    var byId = addresses.find(function(a) { return Number(a.id) === Number(id) && Number(a.active) !== 0; });
    if (byId) return byId;
  }
  var byFlag = addresses.find(function(a) { return Number(a.active) !== 0 && Number(a[flagName]) === 1; });
  if (byFlag) return byFlag;
  return addresses.find(function(a) { return Number(a.active) !== 0 && types.indexOf(a.address_type) !== -1; }) || addresses.find(function(a) { return Number(a.active) !== 0; }) || null;
}

function findDefaultSalesDocumentPerson(people, id, flagName, roleTypes) {
  if (!Array.isArray(people) || !people.length) return null;
  if (id) {
    var byId = people.find(function(p) { return Number(p.id) === Number(id) && Number(p.active) !== 0; });
    if (byId) return byId;
  }
  var byFlag = people.find(function(p) { return Number(p.active) !== 0 && Number(p[flagName]) === 1; });
  if (byFlag) return byFlag;
  return people.find(function(p) { return Number(p.active) !== 0 && roleTypes.indexOf(p.role_type) !== -1; }) || people.find(function(p) { return Number(p.active) !== 0; }) || null;
}

function buildSalesDocumentAddressOptions(addresses, selectedId) {
  var html = '<option value="">בחירה ידנית / ללא</option>';
  (addresses || []).filter(function(a) { return Number(a.active) !== 0; }).forEach(function(address) {
    var flags = [];
    if (Number(address.is_default_billing) === 1) flags.push('ברירת חיוב');
    if (Number(address.is_default_service) === 1) flags.push('ברירת שירות');
    html += '<option value="' + escapeHtml(address.id) + '"' + (Number(address.id) === Number(selectedId) ? ' selected' : '') + '>' +
      escapeHtml((address.label || address.address_type || 'כתובת') + ' — ' + formatSalesDocumentAddress(address) + (flags.length ? ' (' + flags.join(', ') + ')' : '')) +
    '</option>';
  });
  return html;
}

function buildSalesDocumentPersonOptions(people, selectedId) {
  var html = '<option value="">בחירה ידנית / ללא</option>';
  (people || []).filter(function(p) { return Number(p.active) !== 0; }).forEach(function(person) {
    var flags = [];
    if (Number(person.is_document_recipient) === 1) flags.push('מסמכים');
    if (Number(person.is_finance) === 1) flags.push('כספים');
    if (Number(person.is_primary) === 1) flags.push('ראשי');
    html += '<option value="' + escapeHtml(person.id) + '"' + (Number(person.id) === Number(selectedId) ? ' selected' : '') + '>' +
      escapeHtml(formatSalesDocumentPerson(person) + (flags.length ? ' (' + flags.join(', ') + ')' : '')) +
    '</option>';
  });
  return html;
}

function getSalesDocumentCreditWarning(doc) {
  var status = doc && doc.customer_credit_status_snapshot;
  if (status !== 'watch' && status !== 'blocked') return '';
  var text = status === 'blocked' ? 'סטטוס אשראי חסום בפרופיל הלקוח — אזהרה בלבד, יצירת המסמך לא נחסמת כרגע.' : 'סטטוס אשראי במעקב בפרופיל הלקוח — מומלץ לבדוק לפני שליחה.';
  if (doc.customer_credit_notes_snapshot) text += ' הערות: ' + doc.customer_credit_notes_snapshot;
  return '<div class="sales-doc-billing-warning ' + escapeHtml(status) + '">' + escapeHtml(text) + '</div>';
}

function getSalesDocumentVatHintText(doc) {
  var hint = doc && doc.customer_vat_treatment_hint;
  if (!hint) return 'מע״מ נקבע לפי הגדרות העסק בלבד.';
  var labels = { standard: 'רגיל', exempt: 'פטור', reverse_charge: 'חיוב הפוך', foreign: 'לקוח חו״ל', custom: 'מותאם' };
  return 'רמז מע״מ מהלקוח: ' + (labels[hint] || hint) + '. הגדרות העסק עדיין קובעות חוקית.';
}

function buildSalesDocumentInternalNotesSnapshot(doc) {
  var marker = '--- פרופיל חיוב לקוח (Snapshot) ---';
  var manual = String(doc.internal_notes || '').split(marker)[0].trim();
  var billingLines = [];
  if (doc.customer_service_address_snapshot) billingLines.push('כתובת שירות/אירוע: ' + doc.customer_service_address_snapshot);
  if (doc.customer_finance_contact_snapshot) billingLines.push('איש קשר כספים: ' + doc.customer_finance_contact_snapshot);
  if (doc.customer_document_contact_snapshot) billingLines.push('איש קשר למסמכים: ' + doc.customer_document_contact_snapshot);
  if (doc.customer_vat_treatment_hint) billingLines.push('רמז מע״מ לקוח: ' + doc.customer_vat_treatment_hint + ' (הגדרות העסק קובעות)');
  if (doc.customer_credit_status_snapshot && doc.customer_credit_status_snapshot !== 'normal') billingLines.push('סטטוס אשראי בעת יצירה: ' + doc.customer_credit_status_snapshot + (doc.customer_credit_notes_snapshot ? ' — ' + doc.customer_credit_notes_snapshot : ''));
  if (doc.customer_default_discount_percent) billingLines.push('הנחת לקוח ברירת מחדל %: ' + doc.customer_default_discount_percent);
  if (doc.customer_default_discount_amount) billingLines.push('הנחת לקוח ברירת מחדל ₪: ' + doc.customer_default_discount_amount);
  if (!billingLines.length) return manual || null;
  return [manual, marker, billingLines.join('\\n')].filter(Boolean).join('\\n');
}

function applySalesDocumentCustomerDiscount(doc, profile) {
  if (!doc || !profile) return;
  doc.customer_default_discount_percent = Number(profile.default_discount_percent || 0);
  doc.customer_default_discount_amount = Number(profile.default_discount_amount || 0);
}

function applySalesDocumentBillingDefaults(data, options) {
  if (!currentSalesDocumentDraft || !data) return;
  options = options || {};
  var doc = currentSalesDocumentDraft;
  var profile = data.profile || {};
  var addresses = data.addresses || [];
  var people = data.contact_people || data.people || [];
  var contact = findSalesDocumentContact(doc.contact_id) || {};
  var billingAddress = findDefaultSalesDocumentAddress(addresses, options.billingAddressId || profile.default_billing_address_id, 'is_default_billing', ['billing']);
  var serviceAddress = findDefaultSalesDocumentAddress(addresses, options.serviceAddressId || profile.default_service_address_id, 'is_default_service', ['service', 'event']);
  var financePerson = findDefaultSalesDocumentPerson(people, options.financePersonId || profile.default_finance_contact_id, 'is_finance', ['finance']);
  var documentPerson = findDefaultSalesDocumentPerson(people, options.documentPersonId, 'is_document_recipient', ['main', 'finance']);
  doc.sales_document_billing_address_id = billingAddress ? billingAddress.id : '';
  doc.sales_document_service_address_id = serviceAddress ? serviceAddress.id : '';
  doc.sales_document_finance_contact_id = financePerson ? financePerson.id : '';
  doc.sales_document_document_contact_id = documentPerson ? documentPerson.id : '';
  doc.customer_billing_address_id_snapshot = billingAddress ? billingAddress.id : '';
  doc.customer_service_address_id_snapshot = serviceAddress ? serviceAddress.id : '';
  doc.customer_finance_contact_id_snapshot = financePerson ? financePerson.id : '';
  doc.customer_document_contact_id_snapshot = documentPerson ? documentPerson.id : '';
  doc.customer_billing_profile_id_snapshot = profile.id || '';
  doc.customer_billing_name_snapshot = profile.billing_name || '';
  doc.customer_invoice_recipient_name_snapshot = profile.invoice_recipient_name || (documentPerson && documentPerson.name) || '';
  doc.customer_invoice_recipient_email_snapshot = profile.invoice_recipient_email || (documentPerson && documentPerson.email) || '';
  doc.customer_invoice_recipient_phone_snapshot = profile.invoice_recipient_phone || (documentPerson && documentPerson.phone) || '';
  doc.customer_name_snapshot = profile.invoice_recipient_name || (documentPerson && documentPerson.name) || profile.billing_name || contact.name || doc.customer_name_snapshot || '';
  doc.customer_email_snapshot = profile.invoice_recipient_email || (documentPerson && documentPerson.email) || contact.email || doc.customer_email_snapshot || '';
  doc.customer_phone_snapshot = profile.invoice_recipient_phone || (documentPerson && documentPerson.phone) || contact.phone || doc.customer_phone_snapshot || '';
  doc.customer_tax_id = profile.tax_id || doc.customer_tax_id || '';
  doc.customer_address_snapshot = formatSalesDocumentAddress(billingAddress) || doc.customer_address_snapshot || '';
  doc.customer_billing_address_snapshot = doc.customer_address_snapshot;
  doc.customer_service_address_snapshot = formatSalesDocumentAddress(serviceAddress) || doc.customer_service_address_snapshot || '';
  doc.customer_finance_contact_snapshot = formatSalesDocumentPerson(financePerson) || doc.customer_finance_contact_snapshot || '';
  doc.customer_document_contact_snapshot = formatSalesDocumentPerson(documentPerson) || doc.customer_document_contact_snapshot || '';
  doc.payment_terms_snapshot = profile.payment_terms || doc.payment_terms_snapshot || '';
  doc.document_footer_snapshot = profile.default_document_footer || doc.document_footer_snapshot || '';
  doc.notes = profile.default_notes || doc.notes || '';
  doc.currency = profile.preferred_currency || doc.currency || 'ILS';
  doc.customer_vat_treatment_hint = profile.vat_treatment || '';
  doc.customer_credit_status_snapshot = profile.credit_status || '';
  doc.customer_credit_notes_snapshot = profile.credit_notes || '';
  applySalesDocumentCustomerDiscount(doc, profile);
  applySalesDocumentVatRules(doc);
}

function loadSalesDocumentBillingForContact(contactId, applyDefaults) {
  if (!contactId || !currentSalesDocumentDraft) return;
  salesDocumentBillingState = { contactId: Number(contactId), loading: true, profile: null, addresses: [], people: [], error: null };
  renderSalesDocumentEditor();
  Promise.all([
    apiCall('GET', '/api/contacts/' + encodeURIComponent(contactId) + '/billing-profile'),
    apiCall('GET', '/api/contacts/' + encodeURIComponent(contactId) + '/addresses'),
    apiCall('GET', '/api/contacts/' + encodeURIComponent(contactId) + '/contact-people')
  ]).then(function(results) {
    var data = { profile: results[0].profile || {}, addresses: results[1].addresses || [], contact_people: results[2].contact_people || [] };
    salesDocumentBillingState = { contactId: Number(contactId), loading: false, profile: data.profile, addresses: data.addresses, people: data.contact_people, error: null };
    if (applyDefaults) applySalesDocumentBillingDefaults(data);
    renderSalesDocumentEditor();
  }).catch(function(err) {
    salesDocumentBillingState = { contactId: Number(contactId), loading: false, profile: null, addresses: [], people: [], error: err.message || 'שגיאה בטעינת פרופיל חיוב' };
    renderSalesDocumentEditor();
  });
}

function getSalesDocumentSnapshotHelper(locked) {
  return '<div class="sales-doc-snapshot-note ' + (locked ? 'locked' : '') + '">' +
    (locked ? 'Snapshot היסטורי — פרטים אלה לא מתעדכנים מפרופיל הלקוח.' : 'הפרטים יישמרו כ־Snapshot במסמך בעת שמירה/הפקה.') +
  '</div>';
}

function renderSalesDocumentBillingGroup(title, subtitle, body, extraClass) {
  return '<div class="sales-doc-billing-group ' + (extraClass || '') + '">' +
    '<div class="sales-doc-billing-group-title">' + escapeHtml(title) + '</div>' +
    (subtitle ? '<div class="sales-doc-billing-group-sub">' + escapeHtml(subtitle) + '</div>' : '') +
    '<div class="sales-doc-billing-group-body">' + body + '</div>' +
  '</div>';
}

function renderSalesDocumentBillingProfileSummary(doc, state) {
  var profile = (state && state.profile) || {};
  var credit = doc.customer_credit_status_snapshot || profile.credit_status || 'normal';
  var parts = [
    ['שם לחיוב', doc.customer_billing_name_snapshot || profile.billing_name || '—'],
    ['נמען', doc.customer_invoice_recipient_name_snapshot || doc.customer_name_snapshot || profile.invoice_recipient_name || '—'],
    ['רמז מע״מ', getSalesDocumentVatHintText(doc)],
    ['אשראי', credit === 'blocked' ? 'חסום' : (credit === 'watch' ? 'במעקב' : 'רגיל')]
  ];
  return '<div class="sales-doc-billing-profile-grid">' + parts.map(function(part) {
    return '<div class="sales-doc-billing-profile-item"><strong>' + escapeHtml(part[0]) + '</strong>' + escapeHtml(part[1]) + '</div>';
  }).join('') + '</div>';
}

function renderSalesDocumentBillingSelectors(doc, locked) {
  var state = salesDocumentBillingState || {};
  var helper = getSalesDocumentSnapshotHelper(locked);
  if (!doc.contact_id) {
    return helper + renderSalesDocumentBillingGroup('פרופיל חיוב', 'בחרו לקוח כדי לטעון פרופיל חיוב, כתובות ואנשי קשר.', '<div class="sales-doc-section-sub" style="margin:0">אפשר עדיין למלא את שדות המסמך ידנית.</div>');
  }
  if (state.loading && Number(state.contactId) === Number(doc.contact_id)) {
    return helper + renderSalesDocumentBillingGroup('פרופיל חיוב', 'טוען נתוני חיוב שמורים ללקוח.', '<div class="sales-doc-section-sub" style="margin:0">טוען פרופיל חיוב, כתובות ואנשי קשר...</div>');
  }
  if (state.error && Number(state.contactId) === Number(doc.contact_id)) {
    return helper + '<div class="sales-doc-billing-warning blocked">' + escapeHtml(state.error) + '</div>';
  }
  var addresses = state.addresses || [];
  var people = state.people || [];
  var profileBody = getSalesDocumentCreditWarning(doc) + renderSalesDocumentBillingProfileSummary(doc, state);
  var addressBody = '<div class="sales-doc-grid-2">' +
    '<div class="sales-doc-billing-selector"><div class="sales-doc-billing-selector-title">כתובת חיוב</div><select class="form-input sales-doc-billing-select" data-billing-select="billing_address"' + (locked ? ' disabled' : '') + '>' + buildSalesDocumentAddressOptions(addresses, doc.sales_document_billing_address_id || doc.customer_billing_address_id_snapshot) + '</select><div class="sales-doc-billing-hint">נשמרת בשדה כתובת הלקוח במסמך.</div></div>' +
    '<div class="sales-doc-billing-selector"><div class="sales-doc-billing-selector-title">כתובת שירות/אירוע</div><select class="form-input sales-doc-billing-select" data-billing-select="service_address"' + (locked ? ' disabled' : '') + '>' + buildSalesDocumentAddressOptions(addresses, doc.sales_document_service_address_id || doc.customer_service_address_id_snapshot) + '</select><div class="sales-doc-billing-hint">נשמרת כ־Snapshot פנימי של המסמך.</div></div>' +
  '</div>';
  var peopleBody = '<div class="sales-doc-grid-2">' +
    '<div class="sales-doc-billing-selector"><div class="sales-doc-billing-selector-title">נמען למסמכים</div><select class="form-input sales-doc-billing-select" data-billing-select="document_contact"' + (locked ? ' disabled' : '') + '>' + buildSalesDocumentPersonOptions(people, doc.sales_document_document_contact_id || doc.customer_document_contact_id_snapshot) + '</select><div class="sales-doc-billing-hint">יכול לעדכן את שם/אימייל/טלפון הנמען בטיוטה.</div></div>' +
    '<div class="sales-doc-billing-selector"><div class="sales-doc-billing-selector-title">איש קשר כספים</div><select class="form-input sales-doc-billing-select" data-billing-select="finance_contact"' + (locked ? ' disabled' : '') + '>' + buildSalesDocumentPersonOptions(people, doc.sales_document_finance_contact_id || doc.customer_finance_contact_id_snapshot) + '</select><div class="sales-doc-billing-hint">נשמר כהקשר כספים למסמך.</div></div>' +
  '</div>';
  return helper +
    renderSalesDocumentBillingGroup('פרופיל חיוב', 'סיכום נתוני ברירת המחדל מהלקוח. הגדרות העסק עדיין קובעות מע״מ וחישוב.', profileBody) +
    renderSalesDocumentBillingGroup('כתובות', 'בחר כתובת שמורה או השאר בחירה ידנית.', addressBody) +
    renderSalesDocumentBillingGroup('אנשי קשר', 'בחר נמען למסמכים ואיש קשר כספים מתוך אנשי הקשר של הלקוח.', peopleBody);
}

function renderSalesDocumentEditor() {
  var workspace = document.getElementById('sales-document-workspace');
  var body = document.getElementById('sales-document-editor-body');
  var title = document.getElementById('sales-document-editor-title');
  if (!workspace || !body || !currentSalesDocumentDraft) return;
  var doc = currentSalesDocumentDraft;
  var locked = isSalesDocumentLocked(doc);
  ensureSalesDocumentContactOptions();
  workspace.classList.add('open');
  if (title) title.textContent = getSalesDocumentTypeLabel(doc.document_type) + ' · ' + (doc.document_number || 'טיוטה חדשה');
  body.innerHTML = (locked ? '<div class="sales-doc-locked-note">מסמך זה אינו טיוטה פתוחה ולכן אינו ניתן לעריכה.</div>' : '') +
    '<div class="sales-doc-section"><div class="sales-doc-section-title">פרטי מסמך</div><div class="sales-doc-grid-2">' +
      salesDocumentInput('issue_date', 'תאריך מסמך', doc.issue_date, 'date', locked) +
      (doc.document_type === 'invoice' ? salesDocumentInput('due_date', 'תאריך לתשלום', doc.due_date, 'date', locked) : salesDocumentInput('valid_until', 'אירוע בתאריך', doc.valid_until, 'date', locked)) +
    '</div></div>' +
    '<div class="sales-doc-section"><div class="sales-doc-section-title">לקוח וחיוב</div>' +
      renderSalesDocumentBillingGroup('לקוח', 'קישור ללקוח קיים טוען ברירות מחדל בלבד. ניתן עדיין לבצע התאמות ידניות למסמך.', '<div class="form-group" style="margin-bottom:0"><label class="form-label">בחר לקוח קיים</label><select id="sales-document-contact-select" class="form-input"' + (locked ? ' disabled' : '') + '><option value="">' + (salesDocumentContactsLoading ? 'טוען לקוחות...' : 'ללא קישור — מילוי ידני') + '</option></select></div>') +
      renderSalesDocumentBillingSelectors(doc, locked) +
      renderSalesDocumentBillingGroup('שדות ידניים / התאמות למסמך', 'שדות אלה הם ה־Snapshot שיופיע/יישמר במסמך הנוכחי. שינוי כאן לא משנה את פרופיל הלקוח.', '<div class="sales-doc-grid-2 sales-doc-manual-adjustments">' +
        salesDocumentInput('customer_name_snapshot', 'שם/נמען לחשבונית', doc.customer_name_snapshot, 'text', locked) +
        salesDocumentInput('customer_phone_snapshot', 'טלפון נמען', doc.customer_phone_snapshot, 'tel', locked) +
        salesDocumentInput('customer_email_snapshot', 'אימייל נמען', doc.customer_email_snapshot, 'email', locked) +
        salesDocumentInput('customer_tax_id', 'ח.פ / ת.ז', doc.customer_tax_id, 'text', locked) +
        salesDocumentInput('customer_address_snapshot', 'כתובת חיוב במסמך', doc.customer_address_snapshot, 'text', locked) +
        salesDocumentInput('customer_service_address_snapshot', 'כתובת שירות/אירוע', doc.customer_service_address_snapshot, 'text', locked) +
        salesDocumentInput('customer_document_contact_snapshot', 'איש קשר למסמכים', doc.customer_document_contact_snapshot, 'text', locked) +
        salesDocumentInput('customer_finance_contact_snapshot', 'איש קשר כספים', doc.customer_finance_contact_snapshot, 'text', locked) +
        salesDocumentInput('customer_default_discount_percent', 'הנחת לקוח % (ידני)', doc.customer_default_discount_percent, 'number', locked) +
        salesDocumentInput('customer_default_discount_amount', 'הנחת לקוח ₪ (ידני)', doc.customer_default_discount_amount, 'number', locked) +
      '</div>') +
    '</div>' +
    '<div class="sales-doc-section"><div class="sales-doc-section-title">פרטי העסק במסמך</div><div class="sales-doc-grid-2">' +
      salesDocumentInput('business_name_snapshot', 'שם העסק במסמך', doc.business_name_snapshot, 'text', locked) +
      salesDocumentInput('business_legal_name_snapshot', 'שם משפטי', doc.business_legal_name_snapshot, 'text', locked) +
      salesDocumentInput('business_display_name_snapshot', 'שם לתצוגה', doc.business_display_name_snapshot, 'text', locked) +
      salesDocumentInput('business_tax_id', 'ח.פ / עוסק', doc.business_tax_id, 'text', locked) +
      salesDocumentInput('business_phone_snapshot', 'טלפון עסק', doc.business_phone_snapshot, 'tel', locked) +
      salesDocumentInput('business_email_snapshot', 'אימייל עסק', doc.business_email_snapshot, 'email', locked) +
      salesDocumentInput('business_address_snapshot', 'כתובת עסק', doc.business_address_snapshot, 'text', locked) +
      salesDocumentInput('business_logo_url_snapshot', 'לוגו העסק', doc.business_logo_url_snapshot, 'text', locked) +
    '</div><div class="business-settings-note ' + (isSalesDocumentVatExempt(doc) ? 'exempt' : '') + '">' + (isSalesDocumentVatExempt(doc) ? 'עוסק פטור — ללא מע״מ. התצוגה והשרת יאכפו 0% מע״מ.' : 'ברירת המחדל למסמך חדש: מע״מ ' + escapeHtml(getSalesDocumentDefaultVatRate(doc)) + '%.') + '</div></div>' +
    '<div class="sales-doc-section"><div class="sales-doc-section-title" style="display:flex;justify-content:space-between;align-items:center;gap:8px">שורות מסמך ' + (locked ? '' : '<button class="btn btn-secondary btn-sm" id="sales-document-add-item">+ שורה</button>') + '</div><div class="sales-doc-line-list" id="sales-document-items-list"></div></div>' +
    '<div class="sales-doc-section"><div class="sales-doc-section-title">הערות, תנאים ומיתוג</div>' +
      salesDocumentTextarea('notes', 'הערות', doc.notes, locked) +
      salesDocumentTextarea('payment_terms_snapshot', 'תנאי תשלום', doc.payment_terms_snapshot, locked) +
      salesDocumentTextarea('cancellation_policy_snapshot', 'מדיניות ביטול', doc.cancellation_policy_snapshot, locked) +
      salesDocumentTextarea('document_footer_snapshot', 'Footer קבוע', doc.document_footer_snapshot, locked) +
      salesDocumentTextarea('terms', 'תנאים כלליים / טקסט נוסף', doc.terms, locked) +
      salesDocumentTextarea('internal_notes', 'Snapshot פנימי / הערות לצוות', doc.internal_notes, locked) +
    '</div>';
  renderSalesDocumentItems();
  bindSalesDocumentEditorInputs();
  bindSalesDocumentBillingControls();
  renderSalesDocumentContactSelectOptions();
  var addBtn = document.getElementById('sales-document-add-item');
  if (addBtn) addBtn.addEventListener('click', addSalesDocumentItem);
  renderSalesDocumentPreview();
  renderSalesDocumentStickyActions();
}

function salesDocumentInput(field, label, value, type, disabled) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><input class="form-input sales-doc-field" data-sales-field="' + escapeHtml(field) + '" type="' + escapeHtml(type || 'text') + '" value="' + escapeHtml(value || '') + '"' + (disabled ? ' disabled' : '') + '></div>';
}

function salesDocumentTextarea(field, label, value, disabled) {
  return '<div class="form-group"><label class="form-label">' + escapeHtml(label) + '</label><textarea class="form-textarea sales-doc-field" data-sales-field="' + escapeHtml(field) + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(value || '') + '</textarea></div>';
}


function bindSalesDocumentBillingControls() {
  var contactSelect = document.getElementById('sales-document-contact-select');
  if (contactSelect && currentSalesDocumentDraft) {
    contactSelect.addEventListener('change', function() {
      if (!currentSalesDocumentDraft) return;
      var contactId = this.value ? Number(this.value) : null;
      currentSalesDocumentDraft.contact_id = contactId;
      if (!contactId) {
        salesDocumentBillingState = { contactId: null, loading: false, profile: null, addresses: [], people: [], error: null };
        renderSalesDocumentEditor();
        return;
      }
      var contact = findSalesDocumentContact(contactId);
      if (contact) {
        currentSalesDocumentDraft.customer_name_snapshot = currentSalesDocumentDraft.customer_name_snapshot || contact.name || '';
        currentSalesDocumentDraft.customer_phone_snapshot = currentSalesDocumentDraft.customer_phone_snapshot || contact.phone || '';
        currentSalesDocumentDraft.customer_email_snapshot = currentSalesDocumentDraft.customer_email_snapshot || contact.email || '';
      }
      loadSalesDocumentBillingForContact(contactId, true);
    });
  }

  document.querySelectorAll('.sales-doc-billing-select').forEach(function(select) {
    select.addEventListener('change', function() {
      if (!currentSalesDocumentDraft) return;
      var kind = this.getAttribute('data-billing-select');
      var value = this.value ? Number(this.value) : null;
      var state = salesDocumentBillingState || {};
      var addresses = state.addresses || [];
      var people = state.people || [];
      if (kind === 'billing_address') {
        currentSalesDocumentDraft.sales_document_billing_address_id = value || '';
        currentSalesDocumentDraft.customer_billing_address_id_snapshot = value || '';
        currentSalesDocumentDraft.customer_address_snapshot = formatSalesDocumentAddress(findDefaultSalesDocumentAddress(addresses, value, 'is_default_billing', ['billing'])) || '';
        currentSalesDocumentDraft.customer_billing_address_snapshot = currentSalesDocumentDraft.customer_address_snapshot;
      } else if (kind === 'service_address') {
        currentSalesDocumentDraft.sales_document_service_address_id = value || '';
        currentSalesDocumentDraft.customer_service_address_id_snapshot = value || '';
        currentSalesDocumentDraft.customer_service_address_snapshot = formatSalesDocumentAddress(findDefaultSalesDocumentAddress(addresses, value, 'is_default_service', ['service', 'event'])) || '';
      } else if (kind === 'document_contact') {
        var documentPerson = findDefaultSalesDocumentPerson(people, value, 'is_document_recipient', ['main', 'finance']);
        currentSalesDocumentDraft.sales_document_document_contact_id = value || '';
        currentSalesDocumentDraft.customer_document_contact_id_snapshot = value || '';
        currentSalesDocumentDraft.customer_document_contact_snapshot = formatSalesDocumentPerson(documentPerson) || '';
        if (documentPerson) {
          currentSalesDocumentDraft.customer_name_snapshot = documentPerson.name || currentSalesDocumentDraft.customer_name_snapshot;
          currentSalesDocumentDraft.customer_email_snapshot = documentPerson.email || currentSalesDocumentDraft.customer_email_snapshot;
          currentSalesDocumentDraft.customer_phone_snapshot = documentPerson.phone || currentSalesDocumentDraft.customer_phone_snapshot;
        }
      } else if (kind === 'finance_contact') {
        currentSalesDocumentDraft.sales_document_finance_contact_id = value || '';
        currentSalesDocumentDraft.customer_finance_contact_id_snapshot = value || '';
        currentSalesDocumentDraft.customer_finance_contact_snapshot = formatSalesDocumentPerson(findDefaultSalesDocumentPerson(people, value, 'is_finance', ['finance'])) || '';
      }
      renderSalesDocumentEditor();
    });
  });
}

function renderSalesDocumentItems() {
  var list = document.getElementById('sales-document-items-list');
  if (!list || !currentSalesDocumentDraft) return;
  var locked = isSalesDocumentLocked(currentSalesDocumentDraft);
  var vatExempt = isSalesDocumentVatExempt(currentSalesDocumentDraft);
  var items = currentSalesDocumentDraft.items || [];
  list.innerHTML = items.map(function(item, index) {
    if (vatExempt) item.vat_rate = 0;
    return '<div class="sales-doc-line-card" data-sales-line-index="' + index + '">' +
      '<div class="sales-doc-line-head"><div class="sales-doc-line-title">שורה ' + (index + 1) + '</div>' + (locked ? '' : '<button class="btn btn-danger btn-sm" data-remove-sales-line="' + index + '">הסר</button>') + '</div>' +
      '<div class="sales-doc-line-grid">' +
        salesDocumentLineInput(index, 'description', 'תיאור', item.description, 'text', locked) +
        salesDocumentLineInput(index, 'quantity', 'כמות', item.quantity, 'number', locked, '0.01') +
        salesDocumentLineInput(index, 'unit_price', 'מחיר יחידה', item.unit_price, 'number', locked, '0.01') +
        salesDocumentLineInput(index, 'vat_rate', vatExempt ? 'מע״מ — פטור' : 'מע״מ %', vatExempt ? 0 : item.vat_rate, 'number', locked || vatExempt, '0.01') +
        salesDocumentLineInput(index, 'discount_amount', 'הנחה ₪', item.discount_amount, 'number', locked, '0.01') +
      '</div>' + (vatExempt ? '<div class="business-settings-note exempt" style="margin-top:8px">עוסק פטור — שורת המסמך ללא מע״מ</div>' : '') +
    '</div>';
  }).join('');
  list.querySelectorAll('[data-remove-sales-line]').forEach(function(btn) {
    btn.addEventListener('click', function() { removeSalesDocumentItem(Number(this.getAttribute('data-remove-sales-line'))); });
  });
  list.querySelectorAll('.sales-doc-line-field').forEach(function(input) {
    input.addEventListener('input', function() {
      updateSalesDocumentItemField(Number(this.getAttribute('data-sales-line')), this.getAttribute('data-sales-line-field'), this.value);
    });
  });
}

function salesDocumentLineInput(index, field, label, value, type, disabled, step) {
  var attrs = type === 'number' ? ' min="0" step="' + escapeHtml(step || '1') + '" inputmode="decimal"' : '';
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><input class="form-input sales-doc-line-field" data-sales-line="' + index + '" data-sales-line-field="' + escapeHtml(field) + '" type="' + escapeHtml(type || 'text') + '" value="' + escapeHtml(value === undefined || value === null ? '' : value) + '"' + attrs + (disabled ? ' disabled' : '') + '></div>';
}

function bindSalesDocumentEditorInputs() {
  document.querySelectorAll('.sales-doc-field').forEach(function(input) {
    input.addEventListener('input', function() {
      if (!currentSalesDocumentDraft) return;
      currentSalesDocumentDraft[this.getAttribute('data-sales-field')] = this.value;
      renderSalesDocumentPreview();
      renderSalesDocumentStickyActions();
    });
  });
}

function updateSalesDocumentItemField(index, field, value) {
  if (!currentSalesDocumentDraft || !currentSalesDocumentDraft.items || !currentSalesDocumentDraft.items[index]) return;
  currentSalesDocumentDraft.items[index][field] = ['quantity', 'unit_price', 'vat_rate', 'discount_amount'].indexOf(field) !== -1 ? Number(value || 0) : value;
  applySalesDocumentVatRules(currentSalesDocumentDraft);
  renderSalesDocumentPreview();
  renderSalesDocumentStickyActions();
}

function addSalesDocumentItem() {
  if (!currentSalesDocumentDraft || isSalesDocumentLocked(currentSalesDocumentDraft)) return;
  currentSalesDocumentDraft.items = currentSalesDocumentDraft.items || [];
  currentSalesDocumentDraft.items.push(createEmptySalesDocumentItem(currentSalesDocumentDraft.items.length + 1));
  renderSalesDocumentItems();
  renderSalesDocumentPreview();
  renderSalesDocumentStickyActions();
}

function removeSalesDocumentItem(index) {
  if (!currentSalesDocumentDraft || isSalesDocumentLocked(currentSalesDocumentDraft)) return;
  if ((currentSalesDocumentDraft.items || []).length <= 1) { toast('נדרשת לפחות שורה אחת', 'error'); return; }
  currentSalesDocumentDraft.items.splice(index, 1);
  currentSalesDocumentDraft.items.forEach(function(item, i) { item.line_order = i + 1; });
  renderSalesDocumentItems();
  renderSalesDocumentPreview();
  renderSalesDocumentStickyActions();
}

function getSalesDocumentTemplateSettings(doc) {
  return {
    primary_color: '#7c3aed',
    logo_position: 'left',
    show_payment_terms: true,
    show_cancellation_policy: true,
    show_footer: true,
    footer_text: (doc && doc.document_footer_snapshot) || ''
  };
}

function renderSalesDocumentTextBlock(title, value) {
  if (!value) return '';
  return '<div class="sales-doc-preview-box"><div class="sales-doc-preview-box-title">' + escapeHtml(title) + '</div>' + escapeHtml(value).replace(/\\n/g, '<br>') + '</div>';
}

function renderSalesDocumentPreview() {
  var preview = document.getElementById('sales-document-preview');
  if (!preview || !currentSalesDocumentDraft) return;
  var doc = applySalesDocumentVatRules(currentSalesDocumentDraft);
  var totals = calculateSalesDocumentPreviewTotals(doc);
  var items = doc.items || [];
  var template = getSalesDocumentTemplateSettings(doc);
  var vatExempt = isSalesDocumentVatExempt(doc);
  var businessName = doc.business_display_name_snapshot || doc.business_name_snapshot || doc.business_legal_name_snapshot || 'שם העסק';
  var businessDetails = [
    doc.business_legal_name_snapshot && doc.business_legal_name_snapshot !== businessName ? doc.business_legal_name_snapshot : '',
    doc.business_tax_id ? 'מספר עוסק: ' + doc.business_tax_id : '',
    doc.business_address_snapshot || '',
    doc.business_phone_snapshot || '',
    doc.business_email_snapshot || ''
  ].filter(Boolean).map(escapeHtml).join('<br>');
  var customerDetails = [
    doc.customer_name_snapshot || 'שם לקוח',
    doc.customer_tax_id ? 'ח.פ/ת.ז: ' + doc.customer_tax_id : '',
    doc.customer_phone_snapshot || '',
    doc.customer_email_snapshot || '',
    doc.customer_address_snapshot || ''
  ].filter(Boolean).map(escapeHtml).join('<br>');
  var invoiceDueDate = doc.document_type === 'invoice' ? doc.due_date : '';
  var quoteEventDate = doc.document_type === 'quote' ? doc.valid_until : '';
  var itemRows = items.map(function(item) {
    var qty = Number(item.quantity || 0);
    var unit = Number(item.unit_price || 0);
    return '<tr><td>' + escapeHtml(item.description || 'שורת פריט') + '</td><td>' + escapeHtml(qty) + '</td><td>' + escapeHtml(formatSalesMoney(unit)) + '</td></tr>';
  }).join('');
  var mobileItems = items.map(function(item) {
    var qty = Number(item.quantity || 0);
    var unit = Number(item.unit_price || 0);
    return '<div class="sales-doc-preview-mobile-item"><strong>' + escapeHtml(item.description || 'שורת פריט') + '</strong>' +
      '<div class="sales-doc-preview-mobile-row"><span>כמות</span><b>' + escapeHtml(qty) + '</b></div>' +
      '<div class="sales-doc-preview-mobile-row"><span>מחיר</span><b>' + escapeHtml(formatSalesMoney(unit)) + '</b></div></div>';
  }).join('');
  var metaHtml = 'תאריך: ' + escapeHtml(doc.issue_date || '—') + (invoiceDueDate ? '<br>לתשלום עד: ' + escapeHtml(invoiceDueDate) : '') + (quoteEventDate ? '<br>אירוע בתאריך: ' + escapeHtml(quoteEventDate) : '');
  preview.innerHTML = '<div class="sales-doc-print-root"><div class="sales-doc-preview-card sales-doc-preview-a4" style="--doc-primary:' + escapeHtml(template.primary_color) + '">' +
    '<div class="sales-doc-preview-top"><div>' +
      '<div class="sales-doc-preview-header-business"><div class="sales-doc-preview-business-name">' + escapeHtml(businessName) + '</div>' + businessDetails + '</div>' +
      '<div class="sales-doc-preview-title">' + escapeHtml(getSalesDocumentTypeLabel(doc.document_type)) + '</div>' +
      '<div class="sales-doc-preview-meta">' + metaHtml + '</div>' +
    '</div><div class="sales-doc-preview-business">' +
      (doc.business_logo_url_snapshot ? '<img class="sales-doc-preview-logo" alt="לוגו" src="' + escapeHtml(doc.business_logo_url_snapshot) + '">' : '') +
    '</div></div>' +
    '<div class="sales-doc-preview-grid">' +
      '<div class="sales-doc-preview-box"><div class="sales-doc-preview-box-title">לקוח</div>' + customerDetails + '</div>' +
    '</div>' +
    '<table class="sales-doc-preview-table"><thead><tr><th>תיאור</th><th>כמות</th><th>מחיר</th></tr></thead><tbody>' + itemRows + '</tbody></table>' +
    '<div class="sales-doc-preview-mobile-items">' + mobileItems + '</div>' +
    renderSalesDocumentTotalsHtml(totals, vatExempt, getSalesDocumentDefaultVatRate(doc)) +
    renderSalesDocumentTextBlock('כתובת שירות/אירוע', doc.customer_service_address_snapshot) +
    renderSalesDocumentTextBlock('נמען למסמכים', doc.customer_document_contact_snapshot) +
    renderSalesDocumentTextBlock('איש קשר כספים', doc.customer_finance_contact_snapshot) +
    renderSalesDocumentTextBlock('הערות', doc.notes) +
    (template.show_payment_terms ? renderSalesDocumentTextBlock('תנאי תשלום', doc.payment_terms_snapshot) : '') +
    (template.show_cancellation_policy ? renderSalesDocumentTextBlock('מדיניות ביטול', doc.cancellation_policy_snapshot) : '') +
    renderSalesDocumentTextBlock('תנאים כלליים', doc.terms) +
    (template.show_footer && template.footer_text ? '<div class="sales-doc-preview-footer">' + escapeHtml(template.footer_text).replace(/\\n/g, '<br>') + '</div>' : '') +
  '</div></div>';
}

function renderSalesDocumentTotalsHtml(totals, vatExempt, defaultVatRate) {
  if (vatExempt) {
    return '<div class="sales-doc-totals-box">' +
      '<div class="sales-doc-total-row"><span>סה״כ מחיר</span><strong>' + escapeHtml(formatSalesMoney(totals.total)) + '</strong></div>' +
    '</div>';
  }
  return '<div class="sales-doc-totals-box">' +
    '<div class="sales-doc-total-row"><span>ביניים</span><strong>' + escapeHtml(formatSalesMoney(totals.subtotal)) + '</strong></div>' +
    '<div class="sales-doc-total-row"><span>הנחות</span><strong>' + escapeHtml(formatSalesMoney(totals.discount)) + '</strong></div>' +
    '<div class="sales-doc-total-row"><span>מע״מ ' + escapeHtml(defaultVatRate) + '%</span><strong>' + escapeHtml(formatSalesMoney(totals.vat)) + '</strong></div>' +
    '<div class="sales-doc-total-row"><span>סה״כ</span><strong>' + escapeHtml(formatSalesMoney(totals.total)) + '</strong></div>' +
  '</div>';
}

function printSalesDocumentPreviewPanel() {
  if (!currentSalesDocumentDraft) { toast('אין מסמך פתוח להדפסה', 'error'); return; }
  renderSalesDocumentPreview();
  var preview = document.getElementById('sales-document-preview');
  if (!preview) { toast('לא נמצאה תצוגה להדפסה', 'error'); return; }
  var frame = document.createElement('iframe');
  frame.setAttribute('title', 'sales-document-print-frame');
  frame.style.position = 'fixed';
  frame.style.left = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  frame.style.opacity = '0';
  document.body.appendChild(frame);
  var printWindow = frame.contentWindow;
  var printDocument = frame.contentDocument || (printWindow && printWindow.document);
  if (!printWindow || !printDocument) {
    frame.remove();
    document.body.classList.add('sales-doc-printing');
    var cleanupFallback = function() { document.body.classList.remove('sales-doc-printing'); window.removeEventListener('afterprint', cleanupFallback); };
    window.addEventListener('afterprint', cleanupFallback);
    window.print();
    setTimeout(cleanupFallback, 1200);
    return;
  }
  var appStyles = Array.prototype.map.call(document.querySelectorAll('style'), function(style) { return style.textContent || ''; }).join('\\n');
  var printCss = '@page{size:A4;margin:0}html,body{margin:0!important;padding:0!important;background:#fff!important}.sales-doc-print-root{width:210mm;margin:0 auto;direction:rtl}.sales-doc-preview-card{box-shadow:none!important;border:none!important;border-radius:0!important;width:210mm!important;max-width:210mm!important;min-height:auto!important;margin:0!important;padding:12mm!important;break-after:auto!important;page-break-after:auto!important}.sales-doc-preview-a4{aspect-ratio:auto!important}.sales-doc-preview-body{padding:0!important;background:#fff!important;overflow:visible!important}.sales-doc-preview-top{direction:rtl!important}.sales-doc-preview-top>div{direction:rtl!important}.sales-doc-preview-business{text-align:left!important}.sales-doc-preview-logo,.sales-doc-preview-logo-placeholder{margin:0 auto 0 0!important;border:0!important;background:transparent!important;padding:0!important;border-radius:0!important}.sales-doc-preview-table,.sales-doc-preview-box,.sales-doc-totals-box,.sales-doc-preview-footer{break-inside:avoid;page-break-inside:avoid}';
  printDocument.open();
  printDocument.write('<!doctype html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><title>הדפסת מסמך</title><style>' + appStyles + '\\n' + printCss + '</style></head><body>' + preview.innerHTML + '</body></html>');
  printDocument.close();
  var cleanup = function() { setTimeout(function() { if (frame && frame.parentNode) frame.parentNode.removeChild(frame); }, 500); };
  var printNow = function() {
    try {
      printWindow.focus();
      printWindow.print();
      cleanup();
    } catch (e) {
      cleanup();
      toast('לא ניתן לפתוח הדפסה, נסה שוב', 'error');
    }
  };
  var images = Array.prototype.slice.call(printDocument.images || []);
  var pendingImages = images.filter(function(img) { return !img.complete; });
  if (!pendingImages.length) { setTimeout(printNow, 100); return; }
  var remaining = pendingImages.length;
  var done = false;
  var finish = function() {
    if (done) return;
    remaining -= 1;
    if (remaining <= 0) {
      done = true;
      setTimeout(printNow, 100);
    }
  };
  pendingImages.forEach(function(img) {
    img.addEventListener('load', finish, { once: true });
    img.addEventListener('error', finish, { once: true });
  });
  setTimeout(function() { if (!done) { done = true; printNow(); } }, 1200);
}

function saveSalesDocumentAsPdfHint() {
  toast('ייפתח חלון הדפסה — בחר/י “Save as PDF” בדפדפן', 'success');
  printSalesDocumentPreviewPanel();
}

function sendSalesDocumentPlaceholder() {
  toast('שליחה ללקוח עדיין לא מחוברת. בשלב הבא נחבר קישור ציבורי/אימייל.', 'success');
}

function canConvertSalesDocument(doc) {
  return !!(doc && doc.id && doc.document_type === 'quote' && ['draft', 'sent', 'accepted'].indexOf(doc.status || 'draft') !== -1);
}

function canMarkSalesDocumentSent(doc) {
  return !!(doc && doc.id && ['draft', 'sent', 'accepted', 'issued', 'paid', 'partially_paid'].indexOf(doc.status || 'draft') !== -1);
}

function renderSalesDocumentStickyActions() {
  var bar = document.getElementById('sales-document-sticky-actions');
  if (!bar || !currentSalesDocumentDraft) return;
  var doc = currentSalesDocumentDraft;
  var totals = calculateSalesDocumentPreviewTotals(doc);
  var locked = isSalesDocumentLocked(doc);
  var saved = !!currentSalesDocumentId;
  bar.style.display = 'flex';
  bar.innerHTML = '<div class="sales-doc-sticky-total">' +
      '<span class="sales-doc-status-pill ' + escapeHtml(doc.status || 'draft') + '">' + escapeHtml(getSalesDocumentStatusLabel(doc.status || 'draft')) + '</span>' +
      '<strong>' + escapeHtml(formatSalesMoney(totals.total)) + '</strong>' +
    '</div>' +
    '<div class="sales-doc-workflow-actions">' +
      '<button class="btn btn-secondary" id="sales-document-cancel-edit">סגור</button>' +
      (locked ? '' : '<button class="btn btn-primary" id="sales-document-save-draft">שמירה מהירה</button>') +
      '<button class="btn btn-secondary" id="sales-document-print-action">הדפס</button>' +
      '<button class="btn btn-secondary" id="sales-document-pdf-action">הורד PDF</button>' +
      '<button class="btn btn-secondary" id="sales-document-send-placeholder">שלח ללקוח</button>' +
      (saved && canMarkSalesDocumentSent(doc) ? '<button class="btn btn-secondary" id="sales-document-mark-sent">סמן כנשלח</button>' : '') +
      (saved ? '<button class="btn btn-secondary" id="sales-document-duplicate">שכפל מסמך</button>' : '') +
      (canConvertSalesDocument(doc) ? '<button class="btn btn-primary" id="sales-document-convert">המר לחשבונית</button>' : '') +
    '</div>';
  var cancelBtn = document.getElementById('sales-document-cancel-edit');
  if (cancelBtn) cancelBtn.addEventListener('click', closeSalesDocumentEditorPanel);
  var saveBtn = document.getElementById('sales-document-save-draft');
  if (saveBtn) saveBtn.addEventListener('click', saveSalesDocumentDraft);
  var printBtn = document.getElementById('sales-document-print-action');
  if (printBtn) printBtn.addEventListener('click', printSalesDocumentPreviewPanel);
  var pdfBtn = document.getElementById('sales-document-pdf-action');
  if (pdfBtn) pdfBtn.addEventListener('click', saveSalesDocumentAsPdfHint);
  var sendBtn = document.getElementById('sales-document-send-placeholder');
  if (sendBtn) sendBtn.addEventListener('click', sendSalesDocumentPlaceholder);
  var markSentBtn = document.getElementById('sales-document-mark-sent');
  if (markSentBtn) markSentBtn.addEventListener('click', function() { markSalesDocumentSent(currentSalesDocumentId); });
  var duplicateBtn = document.getElementById('sales-document-duplicate');
  if (duplicateBtn) duplicateBtn.addEventListener('click', function() { duplicateSalesDocument(currentSalesDocumentId); });
  var convertBtn = document.getElementById('sales-document-convert');
  if (convertBtn) convertBtn.addEventListener('click', function() { convertSalesDocumentToInvoice(currentSalesDocumentId); });
}

function markSalesDocumentSent(id) {
  if (!id || salesDocumentSaving) return;
  salesDocumentSaving = true;
  apiCall('POST', '/api/sales-documents/' + encodeURIComponent(id) + '/mark-sent').then(function(data) {
    toast('המסמך סומן כנשלח', 'success');
    currentSalesDocumentDraft = data.document || currentSalesDocumentDraft;
    currentSalesDocumentId = currentSalesDocumentDraft && currentSalesDocumentDraft.id ? currentSalesDocumentDraft.id : currentSalesDocumentId;
    renderSalesDocumentEditor();
    loadSalesDocuments();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בסימון המסמך כנשלח', 'error');
  }).finally(function() {
    salesDocumentSaving = false;
    renderSalesDocumentStickyActions();
  });
}

function duplicateSalesDocument(id) {
  if (!id || salesDocumentSaving) return;
  salesDocumentSaving = true;
  apiCall('POST', '/api/sales-documents/' + encodeURIComponent(id) + '/duplicate').then(function(data) {
    toast('נוצר עותק חדש כטיוטה', 'success');
    currentSalesDocumentDraft = applySalesDocumentVatRules(data.document || currentSalesDocumentDraft);
    currentSalesDocumentId = currentSalesDocumentDraft && currentSalesDocumentDraft.id ? currentSalesDocumentDraft.id : null;
    renderSalesDocumentEditor();
    loadSalesDocuments();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בשכפול המסמך', 'error');
  }).finally(function() {
    salesDocumentSaving = false;
    renderSalesDocumentStickyActions();
  });
}

function convertSalesDocumentToInvoice(id) {
  if (!id || salesDocumentSaving) return;
  salesDocumentSaving = true;
  apiCall('POST', '/api/sales-documents/' + encodeURIComponent(id) + '/convert-to-invoice').then(function(data) {
    toast('הצעת המחיר הומרה לחשבונית טיוטה', 'success');
    currentSalesDocumentDraft = applySalesDocumentVatRules(data.document || currentSalesDocumentDraft);
    currentSalesDocumentId = currentSalesDocumentDraft && currentSalesDocumentDraft.id ? currentSalesDocumentDraft.id : null;
    renderSalesDocumentEditor();
    loadSalesDocuments();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בהמרת הצעת המחיר לחשבונית', 'error');
  }).finally(function() {
    salesDocumentSaving = false;
    renderSalesDocumentStickyActions();
  });
}

function buildSalesDocumentPayload() {
  var doc = applySalesDocumentVatRules(currentSalesDocumentDraft || {});
  return {
    document_type: doc.document_type,
    issue_date: doc.issue_date || null,
    due_date: doc.due_date || null,
    valid_until: doc.valid_until || null,
    contact_id: doc.contact_id || null,
    currency: doc.currency || 'ILS',
    customer_name_snapshot: doc.customer_name_snapshot || null,
    customer_phone_snapshot: doc.customer_phone_snapshot || null,
    customer_email_snapshot: doc.customer_email_snapshot || null,
    customer_address_snapshot: doc.customer_address_snapshot || null,
    customer_tax_id: doc.customer_tax_id || null,
    customer_billing_profile_id_snapshot: doc.customer_billing_profile_id_snapshot || null,
    customer_billing_name_snapshot: doc.customer_billing_name_snapshot || null,
    customer_invoice_recipient_name_snapshot: doc.customer_invoice_recipient_name_snapshot || doc.customer_name_snapshot || null,
    customer_invoice_recipient_email_snapshot: doc.customer_invoice_recipient_email_snapshot || doc.customer_email_snapshot || null,
    customer_invoice_recipient_phone_snapshot: doc.customer_invoice_recipient_phone_snapshot || doc.customer_phone_snapshot || null,
    customer_billing_address_id_snapshot: doc.customer_billing_address_id_snapshot || doc.sales_document_billing_address_id || null,
    customer_billing_address_snapshot: doc.customer_billing_address_snapshot || doc.customer_address_snapshot || null,
    customer_service_address_id_snapshot: doc.customer_service_address_id_snapshot || doc.sales_document_service_address_id || null,
    customer_service_address_snapshot: doc.customer_service_address_snapshot || null,
    customer_document_contact_id_snapshot: doc.customer_document_contact_id_snapshot || doc.sales_document_document_contact_id || null,
    customer_document_contact_snapshot: doc.customer_document_contact_snapshot || null,
    customer_finance_contact_id_snapshot: doc.customer_finance_contact_id_snapshot || doc.sales_document_finance_contact_id || null,
    customer_finance_contact_snapshot: doc.customer_finance_contact_snapshot || null,
    customer_vat_treatment_hint: doc.customer_vat_treatment_hint || null,
    customer_credit_status_snapshot: doc.customer_credit_status_snapshot || null,
    customer_credit_notes_snapshot: doc.customer_credit_notes_snapshot || null,
    customer_default_discount_percent: Number(doc.customer_default_discount_percent || 0),
    customer_default_discount_amount: Number(doc.customer_default_discount_amount || 0),
    business_name_snapshot: doc.business_name_snapshot || null,
    business_phone_snapshot: doc.business_phone_snapshot || null,
    business_email_snapshot: doc.business_email_snapshot || null,
    business_address_snapshot: doc.business_address_snapshot || null,
    business_tax_id: doc.business_tax_id || null,
    business_legal_name_snapshot: doc.business_legal_name_snapshot || null,
    business_display_name_snapshot: doc.business_display_name_snapshot || null,
    business_logo_url_snapshot: doc.business_logo_url_snapshot || null,
    payment_terms_snapshot: doc.payment_terms_snapshot || null,
    cancellation_policy_snapshot: doc.cancellation_policy_snapshot || null,
    document_footer_snapshot: doc.document_footer_snapshot || null,
    notes: doc.notes || null,
    terms: doc.terms || null,
    internal_notes: buildSalesDocumentInternalNotesSnapshot(doc),
    items: (doc.items || []).map(function(item, index) {
      return {
        line_order: index + 1,
        description: item.description,
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.unit_price || 0),
        vat_rate: isSalesDocumentVatExempt(doc) ? 0 : Number(item.vat_rate || 0),
        discount_amount: Number(item.discount_amount || 0)
      };
    })
  };
}

function validateSalesDocumentDraft() {
  var doc = currentSalesDocumentDraft;
  if (!doc) return 'אין מסמך פתוח';
  if (!doc.customer_name_snapshot || !String(doc.customer_name_snapshot).trim()) return 'שם לקוח חובה';
  var items = doc.items || [];
  if (!items.length) return 'נדרשת לפחות שורה אחת';
  for (var i = 0; i < items.length; i += 1) {
    if (!String(items[i].description || '').trim()) return 'תיאור חובה בשורה ' + (i + 1);
    if (Number(items[i].quantity || 0) <= 0) return 'כמות לא תקינה בשורה ' + (i + 1);
    if (Number(items[i].unit_price || 0) < 0) return 'מחיר לא תקין בשורה ' + (i + 1);
  }
  return null;
}

function saveSalesDocumentDraft() {
  if (salesDocumentSaving || !currentSalesDocumentDraft || isSalesDocumentLocked(currentSalesDocumentDraft)) return;
  var validationError = validateSalesDocumentDraft();
  if (validationError) { toast(validationError, 'error'); return; }
  salesDocumentSaving = true;
  var saveBtn = document.getElementById('sales-document-save-draft');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'שומר...'; }
  var method = currentSalesDocumentId ? 'PUT' : 'POST';
  var path = currentSalesDocumentId ? '/api/sales-documents/' + encodeURIComponent(currentSalesDocumentId) : '/api/sales-documents';
  apiCall(method, path, buildSalesDocumentPayload()).then(function(data) {
    toast('הטיוטה נשמרה', 'success');
    currentSalesDocumentDraft = data.document || currentSalesDocumentDraft;
    currentSalesDocumentId = currentSalesDocumentDraft.id || currentSalesDocumentId;
    renderSalesDocumentEditor();
    loadSalesDocuments();
  }).catch(function(err) {
    toast(err.message || 'שגיאה בשמירת המסמך', 'error');
  }).finally(function() {
    salesDocumentSaving = false;
    renderSalesDocumentStickyActions();
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
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    html += '<button class="btn btn-danger btn-sm" id="delete-shopping-list-btn">מחק חנות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר לרשימה</button>';
    html += '</div>';
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
  html += '</div><div class="info-section"><div class="info-section-title">מקור אסטרטגי</div><div id="lead-strategic-source-list"><div class="dash-empty">טוען מקור אסטרטגי...</div></div></div><div class="info-section"><div class="info-section-title">יומן הערות (' + notes.length + ')</div>';
  html += notes.length ? notes.map(function(n) { return '<div class="note-item">' + n.note + '<div class="note-date">' + fmtDT(n.created_at) + '</div></div>'; }).join('') : '<div style="color:var(--text3);font-size:13px">אין הערות עדיין</div>';
  html += '</div>';
  document.getElementById('drawer-body').innerHTML = html;
  loadLeadStrategicSource(l.id);
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
  var deleteBtn = document.getElementById('modal-delete-btn');
  if (deleteBtn) deleteBtn.style.display = 'none';
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
    document.getElementById('modal-lead-title').textContent = 'עריכת אירוע';
    var deleteBtn = document.getElementById('modal-delete-btn');
    if (deleteBtn) deleteBtn.style.display = '';
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
  if (!confirm('למחוק את האירוע הזה? פעולה זו תמחק גם נתונים קשורים לאירוע שלא ננעלו.')) return;
  apiCall('DELETE', '/api/leads/' + id).then(function() {
    closeLeadModal();
    closeDrawer();
    invalidatePages();
    refreshAfterLeadMutation('האירוע נמחק');
  }).catch(function(e) { toast(e.message, 'error'); });
}

function deleteCustomer(id, onDone) {
  if (!confirm('למחוק את הלקוח הזה? פעולה זו תמחק גם אירועים ונתונים קשורים שלא ננעלו.')) return;
  apiCall('DELETE', '/api/contacts/' + id).then(function() {
    if (typeof onDone === 'function') onDone();
    loadCustomers();
    toast('הלקוח נמחק', 'success');
  }).catch(function(e) { toast(e.message, 'error'); });
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
      el.innerHTML = '<span style="color:#16a34a;font-weight:600">✓ Google Calendar מחובר</span><br><div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap"><button onclick="disconnectGoogle()" style="font-size:11px;background:none;border:none;color:#dc2626;cursor:pointer">נתק חיבור</button><button id="sync-google-backlog-btn" style="font-size:11px;background:var(--blue);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">סנכרן את כל האירועים לגוגל</button></div>';
      document.getElementById('drawer-sync-btn').style.display = '';
      document.getElementById('sync-google-backlog-btn').onclick = function() {
        if (!confirm('זה יסנכרן/יעדכן את כל האירועים הקיימים ב-CRM ליומן Google, כולל אירועי עבר ועתיד. להמשיך?')) return;
        toast('מסנכרן את כל האירועים ל-Google Calendar...', 'success');
        apiCall('POST', '/api/google/resync-all').then(function(result) {
          var firstError = result.errors && result.errors.length ? ' — ' + result.errors[0].name + ': ' + result.errors[0].error : '';
          toast('הסתיים: סונכרנו ' + (result.synced || 0) + ' מתוך ' + (result.total || 0) + ', נכשלו ' + (result.failed || 0) + firstError, result.failed ? 'error' : 'success');
        }).catch(function(e) { toast('שגיאה: ' + e.message, 'error'); });
      };
    } else {
      el.style.display = 'block';
      el.style.background = data.needs_reconnect ? '#fef3c7' : '#eff6ff';
      el.style.border = data.needs_reconnect ? '1px solid #f59e0b' : '1px solid #bfdbfe';
      var message = data.needs_reconnect ? '⚠️ יש להתחבר מחדש ל-Google Calendar' : '📅 Google Calendar לא מחובר';
      var detail = data.message ? '<div style="font-size:11px;color:#92400e;margin-top:4px">' + escapeHtml(data.message) + '</div>' : '';
      el.innerHTML = '<span style="color:' + (data.needs_reconnect ? '#92400e' : '#2563eb') + '">' + message + '</span>' + detail + '<br><button onclick="connectGoogle()" style="margin-top:6px;font-size:11px;background:var(--blue);color:white;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">חבר יומן</button>';
      document.getElementById('drawer-sync-btn').style.display = 'none';
    }
  }).catch(function(e) {
    var el = document.getElementById('gcal-status');
    if (!el) return;
    el.style.display = 'block';
    el.style.background = '#fef2f2';
    el.style.border = '1px solid #fecaca';
    el.innerHTML = '<span style="color:#dc2626">שגיאה בבדיקת Google Calendar</span>' + (e && e.message ? '<div style="font-size:11px;margin-top:4px">' + escapeHtml(e.message) + '</div>' : '');
  });
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
    if (data.skipped) { toast('ניתן לסנכרן רק אירועים עם תאריך', 'error'); }
    else if (data.deleted) { toast('האירוע הוסר מ-Google Calendar ✓', 'success'); }
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


var strategicContactCategoryOptions = [
  ['school', 'בית ספר'],
  ['kindergarten', 'גן ילדים'],
  ['hr_welfare', 'מנהלת רווחה / HR'],
  ['employee_committee', 'ועד עובדים'],
  ['dj', 'דיג׳יי'],
  ['hall', 'אולם אירועים'],
  ['producer', 'מפיק אירועים'],
  ['supplier', 'ספק משלים'],
  ['other', 'אחר']
];
var strategicContactStatusOptions = [
  ['new', 'חדש'],
  ['need_first_contact', 'צריך פנייה ראשונה'],
  ['contacted', 'נוצר קשר'],
  ['in_conversation', 'בשיחה'],
  ['meeting_scheduled', 'נקבעה פגישה'],
  ['active_relationship', 'קשר פעיל'],
  ['dormant', 'רדום'],
  ['not_relevant', 'לא רלוונטי']
];
var strategicContactPriorityOptions = [
  ['low', 'נמוכה'],
  ['normal', 'רגילה'],
  ['high', 'גבוהה']
];
var strategicContactRelationshipGradeOptions = [
  ['', 'לא צוין'],
  ['A', 'אסטרטגי מאוד'],
  ['B', 'כדאי לתחזק'],
  ['C', 'נמוך']
];
var strategicContactWarmthLevelOptions = [
  ['', 'לא צוין'],
  ['cold', 'קר'],
  ['warm', 'חם'],
  ['hot', 'חם מאוד']
];
var strategicContactRelationshipValueFilterOptions = [
  ['grade_a', 'דירוג A'],
  ['warm_hot', 'חם / חם מאוד'],
  ['high_potential', 'פוטנציאל גבוה']
];
var strategicContactChannelOptions = [
  ['', 'לא צוין'],
  ['phone', 'טלפון'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'אימייל'],
  ['meeting', 'פגישה'],
  ['other', 'אחר']
];
var strategicContactActivityTypeOptions = [
  ['note', 'הערה'],
  ['call', 'שיחה'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'אימייל'],
  ['meeting', 'פגישה'],
  ['followup', 'מעקב'],
  ['other', 'אחר']
];
var strategicContactFollowUpFilterOptions = [
  ['today', 'צריך פנייה היום'],
  ['week', 'צריך פנייה השבוע'],
  ['overdue', 'עבר תאריך פנייה'],
  ['high_priority', 'עדיפות גבוהה'],
  ['dormant_90', 'לא פניתי מעל 90 יום']
];
var strategicContactSeasonalTagOptions = [
  ['school_start', 'תחילת שנה'],
  ['school_end', 'סוף שנה / מסיבות סיום'],
  ['purim', 'פורים'],
  ['pesach', 'פסח'],
  ['rosh_hashana', 'ראש השנה'],
  ['hanukkah', 'חנוכה'],
  ['civil_year_end', 'סוף שנה אזרחית'],
  ['team_building', 'ימי גיבוש'],
  ['wedding_season', 'עונת חתונות'],
  ['summer', 'קיץ'],
  ['bar_bat_mitzvah', 'בר/בת מצווה'],
  ['all_year', 'כל השנה']
];
var strategicContactMessageTemplateOptions = [
  ['school_end', 'סוף שנה / מסיבות סיום'],
  ['school_start', 'תחילת שנה'],
  ['purim', 'פורים'],
  ['pesach', 'פסח'],
  ['rosh_hashana', 'ראש השנה'],
  ['hr_welfare_holiday', 'רווחה / חג לעובדים'],
  ['dj_collaboration', 'שיתוף פעולה עם דיג׳יי'],
  ['hall_collaboration', 'שיתוף פעולה עם אולם'],
  ['general_followup', 'מעקב כללי']
];
var strategicContactAttributionTypeOptions = [
  ['referral', 'הפניה'],
  ['repeat_business', 'עבודה חוזרת'],
  ['partner', 'שותף / ספק מפנה'],
  ['school_cycle', 'מחזור פעילות קבוע'],
  ['campaign_response', 'תגובה לפנייה']
];

function getStrategicContactOptionLabel(options, value) {
  var found = options.find(function(item) { return item[0] === value; });
  return found ? found[1] : (value || '—');
}

function renderStrategicContactOptions(options, selected, includeAllLabel) {
  var html = includeAllLabel ? '<option value="">' + includeAllLabel + '</option>' : '';
  return html + options.map(function(item) {
    return '<option value="' + escapeHtml(item[0]) + '"' + (String(selected || '') === item[0] ? ' selected' : '') + '>' + escapeHtml(item[1]) + '</option>';
  }).join('');
}
function formatStrategicContactNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  var number = Number(value);
  if (!isFinite(number)) return '';
  return number.toLocaleString('he-IL');
}

function renderStrategicContactRelationshipBadges(item) {
  item = item || {};
  var badges = [];
  if (item.relationship_grade) badges.push('<span class="badge badge-purple">דירוג קשר: ' + escapeHtml(item.relationship_grade + ' · ' + getStrategicContactOptionLabel(strategicContactRelationshipGradeOptions, item.relationship_grade)) + '</span>');
  if (item.warmth_level) badges.push('<span class="badge badge-orange">רמת חום: ' + escapeHtml(getStrategicContactOptionLabel(strategicContactWarmthLevelOptions, item.warmth_level)) + '</span>');
  if (item.estimated_annual_value !== null && item.estimated_annual_value !== undefined && item.estimated_annual_value !== '') badges.push('<span class="badge badge-green">פוטנציאל שנתי: ₪' + escapeHtml(formatStrategicContactNumber(item.estimated_annual_value)) + '</span>');
  if (item.potential_events_per_year !== null && item.potential_events_per_year !== undefined && item.potential_events_per_year !== '') badges.push('<span class="badge badge-blue">אירועים פוטנציאליים בשנה: ' + escapeHtml(formatStrategicContactNumber(item.potential_events_per_year)) + '</span>');
  if (!badges.length) return '';
  return '<div class="strategic-contact-meta strategic-contact-value-badges">' + badges.join('') + '</div>';
}


function parseStrategicContactTags(value) {
  if (!value) return [];
  var text = String(value || '').trim();
  if (!text) return [];
  try {
    var parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(function(tag) { return String(tag || '').trim(); }).filter(Boolean);
  } catch (e) {}
  return text.split(/[,،\\n]+/).map(function(tag) { return String(tag || '').trim(); }).filter(Boolean);
}

function dedupeStrategicContactTags(tags) {
  var seen = {};
  return (tags || []).filter(function(tag) {
    tag = String(tag || '').trim();
    if (!tag || seen[tag]) return false;
    seen[tag] = true;
    return true;
  });
}

function isStrategicContactSeasonalTag(tag) {
  return strategicContactSeasonalTagOptions.some(function(item) { return item[0] === tag; });
}

function getStrategicContactSeasonalTags(value) {
  return parseStrategicContactTags(value).filter(isStrategicContactSeasonalTag);
}

function getStrategicContactFreeTags(value) {
  return parseStrategicContactTags(value).filter(function(tag) { return !isStrategicContactSeasonalTag(tag); });
}

function renderStrategicContactSeasonalBadges(value) {
  var tags = getStrategicContactSeasonalTags(value);
  if (!tags.length) return '';
  return '<div class="strategic-contact-meta">' + tags.map(function(tag) {
    return '<span class="badge badge-green">' + escapeHtml(getStrategicContactOptionLabel(strategicContactSeasonalTagOptions, tag)) + '</span>';
  }).join('') + '</div>';
}

function renderStrategicContactSeasonalChecklist(value) {
  var selected = getStrategicContactSeasonalTags(value);
  return '<div class="form-group" style="grid-column:1/-1;margin-bottom:0"><label class="form-label">תגיות עונתיות</label><div class="strategic-contact-seasonal-tags">' + strategicContactSeasonalTagOptions.map(function(item) {
    return '<label><input type="checkbox" class="strategic-contact-seasonal-field" value="' + escapeHtml(item[0]) + '"' + (selected.indexOf(item[0]) !== -1 ? ' checked' : '') + '> ' + escapeHtml(item[1]) + '</label>';
  }).join('') + '</div></div>';
}

function setupStrategicContactFilters() {
  var category = document.getElementById('strategic-contacts-category-filter');
  var status = document.getElementById('strategic-contacts-status-filter');
  var priority = document.getElementById('strategic-contacts-priority-filter');
  var followUp = document.getElementById('strategic-contacts-follow-up-filter');
  var seasonal = document.getElementById('strategic-contacts-seasonal-filter');
  var relationshipValue = document.getElementById('strategic-contacts-value-filter');
  if (category && category.options.length <= 1) category.innerHTML = renderStrategicContactOptions(strategicContactCategoryOptions, '', 'כל הקטגוריות');
  if (status && status.options.length <= 1) status.innerHTML = renderStrategicContactOptions(strategicContactStatusOptions, '', 'כל הסטטוסים');
  if (priority && priority.options.length <= 1) priority.innerHTML = renderStrategicContactOptions(strategicContactPriorityOptions, '', 'כל העדיפויות');
  if (followUp && followUp.options.length <= 1) followUp.innerHTML = renderStrategicContactOptions(strategicContactFollowUpFilterOptions, '', 'כל המעקבים');
  if (seasonal && seasonal.options.length <= 1) seasonal.innerHTML = renderStrategicContactOptions(strategicContactSeasonalTagOptions, '', 'כל העונות');
  if (relationshipValue && relationshipValue.options.length <= 1) relationshipValue.innerHTML = renderStrategicContactOptions(strategicContactRelationshipValueFilterOptions, '', 'כל ערכי הקשר');
}

function buildStrategicContactsQuery() {
  var params = new URLSearchParams();
  var search = document.getElementById('strategic-contacts-search');
  var category = document.getElementById('strategic-contacts-category-filter');
  var status = document.getElementById('strategic-contacts-status-filter');
  var priority = document.getElementById('strategic-contacts-priority-filter');
  var followUp = document.getElementById('strategic-contacts-follow-up-filter');
  var seasonal = document.getElementById('strategic-contacts-seasonal-filter');
  var relationshipValue = document.getElementById('strategic-contacts-value-filter');
  if (search && search.value.trim()) params.set('search', search.value.trim());
  if (category && category.value) params.set('category', category.value);
  if (status && status.value) params.set('status', status.value);
  if (priority && priority.value) params.set('priority', priority.value);
  if (followUp && followUp.value) params.set('follow_up', followUp.value);
  if (seasonal && seasonal.value) params.set('seasonal_tag', seasonal.value);
  if (relationshipValue && relationshipValue.value) params.set('relationship_value', relationshipValue.value);
  var query = params.toString();
  return query ? '?' + query : '';
}

function buildStrategicContactMessageTemplate(item, templateKey) {
  item = item || {};
  var contactName = item.contact_person_name || item.organization_name || 'שלום';
  var organization = item.organization_name || 'הארגון שלכם';
  var category = getStrategicContactOptionLabel(strategicContactCategoryOptions, item.category);
  var seasonalTags = getStrategicContactSeasonalTags(item.tags).map(function(tag) { return getStrategicContactOptionLabel(strategicContactSeasonalTagOptions, tag); });
  var seasonText = seasonalTags.length ? seasonalTags.join(', ') : 'התקופה הקרובה';
  var lines = [];
  lines.push('שלום ' + contactName + ',');
  if (templateKey === 'school_end') {
    lines.push('לקראת סוף השנה ומסיבות הסיום, רציתי להציע פעילות חווייתית של קומיקס ואמנות ל־' + organization + '.');
  } else if (templateKey === 'school_start') {
    lines.push('לקראת תחילת השנה, יש לנו פעילות פתיחה קלילה ומגבשת שמתאימה ל־' + organization + '.');
  } else if (templateKey === 'purim') {
    lines.push('לקראת פורים, יש לנו פעילות קומיקס צבעונית שמתאימה לאווירת חג ולחוויה קבוצתית.');
  } else if (templateKey === 'pesach') {
    lines.push('לקראת פסח, רציתי להציע פעילות חווייתית ומגבשת שיכולה להתאים ל־' + organization + '.');
  } else if (templateKey === 'rosh_hashana') {
    lines.push('לקראת ראש השנה, יש לנו פעילות פתיחת שנה יצירתית שמתאימה לצוותים ולקבוצות.');
  } else if (templateKey === 'hr_welfare_holiday') {
    lines.push('אני פונה אליכם סביב ' + seasonText + ' עם רעיון לפעילות רווחה/גיבוש יצירתית לעובדים.');
  } else if (templateKey === 'dj_collaboration') {
    lines.push('חשבתי שיכול להיות שיתוף פעולה מעניין בינינו באירועים — אתם מביאים מוזיקה ואווירה, ואנחנו מוסיפים חוויית קומיקס לאורחים.');
  } else if (templateKey === 'hall_collaboration') {
    lines.push('רציתי לבדוק אפשרות לשיתוף פעולה עם ' + organization + ' סביב אירועים, משפחות וחוויות תוכן משלימות לאורחים.');
  } else {
    lines.push('רציתי לחזור אליכם בהמשך לשיחה/עניין קודם ולבדוק אם פעילות קומיקס יצירתית יכולה להתאים לכם בקרוב.');
  }
  lines.push('ראיתי שזה יכול להתאים במיוחד לקטגוריה: ' + category + (seasonalTags.length ? ', סביב: ' + seasonText : '') + '.');
  lines.push('אשמח לשלוח פרטים קצרים ולבדוק יחד אם זה רלוונטי.');
  lines.push('אלי');
  return lines.join(String.fromCharCode(10) + String.fromCharCode(10));
}

function openStrategicContactMessageTemplateModal(item) {
  if (!item || !item.id) return;
  var phone = item.whatsapp || item.phone || '';
  var cleanWhatsapp = String(phone).replace(/[^0-9]/g, '').replace(/^0/, '972');
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'strategic-contact-message-template-modal';
  overlay.innerHTML = '<div class="modal"><div class="modal-header"><h2>הכן הודעה</h2><button class="modal-close" id="message-template-close">✕</button></div><div class="modal-body">' +
    '<div class="strategic-contact-form-grid single">' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">תבנית</label><select class="form-input" id="message-template-select">' + renderStrategicContactOptions(strategicContactMessageTemplateOptions, 'general_followup', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">טקסט הודעה</label><textarea class="form-textarea strategic-contact-template-textarea" id="message-template-text"></textarea></div>' +
    '</div>' +
    '</div><div class="modal-footer"><button class="btn btn-secondary" id="message-template-cancel">סגור</button><button class="btn btn-primary" id="message-template-copy">העתק</button>' +
    (cleanWhatsapp ? '<a class="btn btn-success" id="message-template-whatsapp" target="_blank" rel="noopener">פתח WhatsApp</a>' : '') +
    '</div></div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  function updateText() {
    var select = document.getElementById('message-template-select');
    var textarea = document.getElementById('message-template-text');
    if (textarea && select) textarea.value = buildStrategicContactMessageTemplate(item, select.value);
    updateWhatsappLink();
  }
  function updateWhatsappLink() {
    var link = document.getElementById('message-template-whatsapp');
    var textarea = document.getElementById('message-template-text');
    if (link && textarea) link.href = 'https://wa.me/' + cleanWhatsapp + '?text=' + encodeURIComponent(textarea.value || '');
  }
  document.getElementById('message-template-close').onclick = close;
  document.getElementById('message-template-cancel').onclick = close;
  document.getElementById('message-template-select').addEventListener('change', updateText);
  document.getElementById('message-template-text').addEventListener('input', updateWhatsappLink);
  document.getElementById('message-template-copy').onclick = function() {
    var textarea = document.getElementById('message-template-text');
    var text = textarea ? textarea.value : '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() { toast('ההודעה הועתקה', 'success'); }).catch(function() {
        if (textarea) { textarea.focus(); textarea.select(); document.execCommand('copy'); toast('ההודעה הועתקה', 'success'); }
      });
    } else if (textarea) {
      textarea.focus(); textarea.select(); document.execCommand('copy'); toast('ההודעה הועתקה', 'success');
    }
  };
  updateText();
}

function openStrategicContactMarkContactedModal(item) {
  if (!item || !item.id) return;
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'strategic-contact-mark-contacted-modal';
  overlay.innerHTML = '<div class="modal"><div class="modal-header"><h2>סמן שפניתי</h2><button class="modal-close" id="mark-contacted-close">✕</button></div><div class="modal-body">' +
    '<div class="strategic-contact-form-grid">' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">סוג פעילות</label><select class="form-input" id="mark-contacted-activity-type">' + renderStrategicContactOptions(strategicContactActivityTypeOptions, 'call', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">ערוץ</label><select class="form-input" id="mark-contacted-channel">' + renderStrategicContactOptions(strategicContactChannelOptions, item.preferred_channel || '', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">קשר הבא</label><input class="form-input" id="mark-contacted-next" type="date" value="' + escapeHtml(item.next_contact_at || '') + '"></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">סיבת מעקב</label><input class="form-input" id="mark-contacted-followup" type="text" value="' + escapeHtml(item.followup_reason || '') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;margin-bottom:0"><label class="form-label">סיכום</label><textarea class="form-textarea" id="mark-contacted-summary" placeholder="סיכום הפנייה"></textarea></div>' +
    '</div>' +
    '</div><div class="modal-footer"><button class="btn btn-secondary" id="mark-contacted-cancel">ביטול</button><button class="btn btn-primary" id="mark-contacted-save">שמור</button></div></div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  document.getElementById('mark-contacted-close').onclick = close;
  document.getElementById('mark-contacted-cancel').onclick = close;
  document.getElementById('mark-contacted-save').onclick = function() {
    var payload = {
      activity_type: document.getElementById('mark-contacted-activity-type').value,
      channel: document.getElementById('mark-contacted-channel').value,
      next_contact_at: document.getElementById('mark-contacted-next').value,
      followup_reason: document.getElementById('mark-contacted-followup').value,
      summary: document.getElementById('mark-contacted-summary').value
    };
    if (!payload.summary || !payload.summary.trim()) { toast('סיכום פעילות חובה', 'error'); return; }
    apiCall('POST', '/api/strategic-contacts/' + item.id + '/mark-contacted', payload).then(function() {
      toast('הפנייה נשמרה', 'success');
      close();
      loadStrategicContacts();
    }).catch(function(err) { toast(err.message || 'שגיאה בסימון פנייה', 'error'); });
  };
}

function renderStrategicContactCard(item) {
  var phone = item.phone || '';
  var whatsapp = item.whatsapp || phone || '';
  var cleanWhatsapp = String(whatsapp).replace(/[^0-9]/g, '').replace(/^0/, '972');
  var note = item.notes ? String(item.notes).slice(0, 140) : '';
  return '<div class="strategic-contact-card" data-strategic-contact-id="' + item.id + '">' +
    '<div class="strategic-contact-head"><div>' +
      '<div class="strategic-contact-name">' + escapeHtml(item.organization_name || 'ללא שם ארגון') + '</div>' +
      '<div class="strategic-contact-person">' + escapeHtml([item.contact_person_name, item.role_title].filter(Boolean).join(' · ') || 'איש קשר לא צוין') + '</div>' +
    '</div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">' +
      '<span class="badge badge-purple">' + escapeHtml(getStrategicContactOptionLabel(strategicContactCategoryOptions, item.category)) + '</span>' +
      '<span class="badge badge-gray">' + escapeHtml(getStrategicContactOptionLabel(strategicContactStatusOptions, item.status)) + '</span>' +
      '<span class="badge badge-blue">עדיפות ' + escapeHtml(getStrategicContactOptionLabel(strategicContactPriorityOptions, item.priority)) + '</span>' +
      (item.linked_contact_id ? '<span class="badge badge-green">מקושר ללקוח קיים</span>' : '') +
    '</div></div>' +
    '<div class="strategic-contact-meta"><span>' + escapeHtml([item.city, item.area].filter(Boolean).join(' · ') || 'אזור לא צוין') + '</span></div>' +
    '<div class="strategic-contact-actions">' +
      '<button class="btn btn-primary btn-sm strategic-contact-mark-contacted-btn" data-strategic-contact-id="' + item.id + '" onclick="event.stopPropagation()">סמן שפניתי</button>' +
      '<button class="btn btn-secondary btn-sm strategic-contact-message-template-btn" data-strategic-contact-id="' + item.id + '" onclick="event.stopPropagation()">הכן הודעה</button>' +
      (phone ? '<a class="btn btn-ghost btn-sm" onclick="event.stopPropagation()" href="tel:' + escapeHtml(phone) + '">טלפון</a>' : '') +
      (cleanWhatsapp ? '<a class="btn btn-ghost btn-sm" onclick="event.stopPropagation()" target="_blank" href="https://wa.me/' + escapeHtml(cleanWhatsapp) + '">WhatsApp</a>' : '') +
      (item.email ? '<a class="btn btn-ghost btn-sm" onclick="event.stopPropagation()" href="mailto:' + escapeHtml(item.email) + '">אימייל</a>' : '') +
    '</div>' +
    '<div class="strategic-contact-meta"><span>קשר אחרון: ' + escapeHtml(formatDate(item.last_contact_at) || '—') + '</span><span>קשר הבא: ' + escapeHtml(formatDate(item.next_contact_at) || '—') + '</span></div>' +
    (item.followup_reason ? '<div class="strategic-contact-meta"><strong>סיבת מעקב:</strong> ' + escapeHtml(item.followup_reason) + '</div>' : '') +
    renderStrategicContactSeasonalBadges(item.tags) +
    renderStrategicContactRelationshipBadges(item) +
    (item.relevant_services ? '<div class="strategic-contact-meta"><strong>שירותים רלוונטיים:</strong> ' + escapeHtml(item.relevant_services) + '</div>' : '') +
    (note ? '<div class="strategic-contact-note">' + escapeHtml(note) + (String(item.notes).length > 140 ? '…' : '') + '</div>' : '') +
    (Number(item.active) === 0 ? '<div class="strategic-contact-meta"><span class="badge badge-gray">לא פעיל</span></div>' : '') +
  '</div>';
}

function loadStrategicContacts() {
  if (!isModuleEnabled('strategic_contacts')) {
    renderModuleDisabledPage('strategicContacts', 'strategic_contacts');
    return;
  }
  setupStrategicContactFilters();
  var grid = document.getElementById('strategic-contacts-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="dash-empty">טוען קשרים אסטרטגיים...</div>';
  apiCall('GET', '/api/strategic-contacts' + buildStrategicContactsQuery()).then(function(data) {
    var items = data.strategic_contacts || [];
    if (!items.length) {
      grid.innerHTML = '<div class="dash-empty">אין עדיין קשרים אסטרטגיים להצגה</div>';
      return;
    }
    grid.innerHTML = '<div class="strategic-contacts-grid">' + items.map(renderStrategicContactCard).join('') + '</div>';
    grid.querySelectorAll('.strategic-contact-card[data-strategic-contact-id]').forEach(function(card) {
      card.addEventListener('click', function() { openStrategicContactModal(parseInt(this.getAttribute('data-strategic-contact-id'))); });
    });
    grid.querySelectorAll('.strategic-contact-mark-contacted-btn[data-strategic-contact-id]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var sid = parseInt(this.getAttribute('data-strategic-contact-id'));
        var item = items.find(function(x) { return Number(x.id) === Number(sid); });
        if (item) openStrategicContactMarkContactedModal(item);
      });
    });
    grid.querySelectorAll('.strategic-contact-message-template-btn[data-strategic-contact-id]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var sid = parseInt(this.getAttribute('data-strategic-contact-id'));
        var item = items.find(function(x) { return Number(x.id) === Number(sid); });
        if (item) openStrategicContactMessageTemplateModal(item);
      });
    });
  }).catch(function(err) {
    grid.innerHTML = '<div class="dash-empty">שגיאה בטעינת קשרים אסטרטגיים: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
  });
}

function strategicContactInput(field, label, value, type) {
  var inputValue = value === undefined || value === null ? '' : value;
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><input class="form-input strategic-contact-field" data-strategic-contact-field="' + escapeHtml(field) + '" type="' + escapeHtml(type || 'text') + '" value="' + escapeHtml(inputValue) + '"></div>';
}

function strategicContactSelect(field, label, value, options) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><select class="form-input strategic-contact-field" data-strategic-contact-field="' + escapeHtml(field) + '">' + renderStrategicContactOptions(options, value || '', '') + '</select></div>';
}

function strategicContactTextarea(field, label, value) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><textarea class="form-textarea strategic-contact-field" data-strategic-contact-field="' + escapeHtml(field) + '">' + escapeHtml(value || '') + '</textarea></div>';
}

function renderStrategicContactActivitiesSection(strategicContactId) {
  if (!strategicContactId) return '';
  return '<div class="strategic-contact-activities">' +
    '<h3 style="margin:0 0 8px">פעילויות אחרונות</h3>' +
    '<div id="strategic-contact-activities-list" class="strategic-contact-activity-list"><div class="dash-empty">טוען פעילויות...</div></div>' +
    '<div class="strategic-contact-activity-form">' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">סוג פעילות</label><select class="form-input" id="strategic-contact-activity-type">' + renderStrategicContactOptions(strategicContactActivityTypeOptions, 'note', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">ערוץ</label><select class="form-input" id="strategic-contact-activity-channel">' + renderStrategicContactOptions(strategicContactChannelOptions, '', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">תאריך פעילות</label><input class="form-input" id="strategic-contact-activity-at" type="date"></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">קשר הבא</label><input class="form-input" id="strategic-contact-activity-next" type="date"></div>' +
      '<div class="form-group" style="grid-column:1/-1;margin-bottom:0"><label class="form-label">סיכום</label><textarea class="form-textarea" id="strategic-contact-activity-summary" placeholder="מה קרה בשיחה / פגישה?"></textarea></div>' +
      '<div style="grid-column:1/-1"><button class="btn btn-secondary btn-sm" id="strategic-contact-activity-add" type="button">הוסף פעילות</button></div>' +
    '</div>' +
  '</div>';
}

function renderStrategicContactActivityItem(item) {
  return '<div class="strategic-contact-activity-item">' +
    '<div class="strategic-contact-activity-title">' + escapeHtml(getStrategicContactOptionLabel(strategicContactActivityTypeOptions, item.activity_type)) + (item.channel ? ' · ' + escapeHtml(getStrategicContactOptionLabel(strategicContactChannelOptions, item.channel)) : '') + '</div>' +
    '<div class="strategic-contact-activity-meta">' + escapeHtml(formatDate(item.activity_at || item.created_at) || '—') + (item.next_contact_at ? ' · קשר הבא: ' + escapeHtml(formatDate(item.next_contact_at)) : '') + '</div>' +
    '<div class="strategic-contact-note" style="margin-top:6px">' + escapeHtml(item.summary || '') + '</div>' +
  '</div>';
}

function loadStrategicContactActivities(strategicContactId) {
  var list = document.getElementById('strategic-contact-activities-list');
  if (!list || !strategicContactId) return;
  list.innerHTML = '<div class="dash-empty">טוען פעילויות...</div>';
  apiCall('GET', '/api/strategic-contacts/' + strategicContactId + '/activities').then(function(data) {
    var activities = data.activities || [];
    list.innerHTML = activities.length ? activities.map(renderStrategicContactActivityItem).join('') : '<div class="dash-empty">אין עדיין פעילויות</div>';
  }).catch(function(err) {
    list.innerHTML = '<div class="dash-empty">שגיאה בטעינת פעילויות: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
  });
}

function setupStrategicContactActivityForm(strategicContactId) {
  var btn = document.getElementById('strategic-contact-activity-add');
  if (!btn || !strategicContactId) return;
  btn.addEventListener('click', function() {
    var summary = document.getElementById('strategic-contact-activity-summary');
    var payload = {
      activity_type: document.getElementById('strategic-contact-activity-type').value,
      channel: document.getElementById('strategic-contact-activity-channel').value,
      activity_at: document.getElementById('strategic-contact-activity-at').value,
      next_contact_at: document.getElementById('strategic-contact-activity-next').value,
      summary: summary ? summary.value : ''
    };
    if (!payload.summary || !payload.summary.trim()) { toast('סיכום פעילות חובה', 'error'); return; }
    apiCall('POST', '/api/strategic-contacts/' + strategicContactId + '/activities', payload).then(function() {
      toast('הפעילות נשמרה', 'success');
      if (summary) summary.value = '';
      loadStrategicContactActivities(strategicContactId);
    }).catch(function(err) { toast(err.message || 'שגיאה בשמירת פעילות', 'error'); });
  });
}

function renderStrategicContactAttributionsSection(strategicContactId) {
  if (!strategicContactId) return '';
  return '<div class="strategic-contact-activities strategic-contact-attributions">' +
    '<h3 style="margin:0 0 8px">לידים / אירועים משויכים</h3>' +
    '<div id="strategic-contact-attributions-list" class="strategic-contact-activity-list"><div class="dash-empty">טוען שיוכים...</div></div>' +
    '<div class="strategic-contact-activity-form">' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">סוג שיוך</label><select class="form-input" id="strategic-contact-attribution-type">' + renderStrategicContactOptions(strategicContactAttributionTypeOptions, 'referral', '') + '</select></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">מספר לקוח</label><input class="form-input" id="strategic-contact-attribution-contact-id" type="number" placeholder="ID לקוח קיים"></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">מספר ליד</label><input class="form-input" id="strategic-contact-attribution-lead-id" type="number" placeholder="ID ליד קיים"></div>' +
      '<div class="form-group" style="margin-bottom:0"><label class="form-label">מספר אירוע</label><input class="form-input" id="strategic-contact-attribution-event-id" type="number" placeholder="ID אירוע קיים"></div>' +
      '<div class="form-group" style="grid-column:1/-1;margin-bottom:0"><label class="form-label">הערות שיוך</label><textarea class="form-textarea" id="strategic-contact-attribution-notes" placeholder="למשל: הגיע דרך מנהלת הרווחה / ספק מפנה"></textarea></div>' +
      '<div style="grid-column:1/-1"><button class="btn btn-secondary btn-sm" id="strategic-contact-attribution-add" type="button">הוסף שיוך</button></div>' +
    '</div>' +
  '</div>';
}

function renderStrategicContactAttributionItem(item) {
  var target = [];
  if (item.contact_id) target.push('לקוח #' + item.contact_id + (item.contact_name ? ' · ' + item.contact_name : ''));
  if (item.lead_id) target.push('ליד #' + (item.lead_num || item.lead_id) + (item.lead_name ? ' · ' + item.lead_name : ''));
  if (item.event_id) target.push('אירוע #' + (item.event_num || item.event_id) + (item.event_name ? ' · ' + item.event_name : '') + (item.event_date ? ' · ' + formatDate(item.event_date) : ''));
  return '<div class="strategic-contact-activity-item strategic-contact-attribution-item">' +
    '<div class="strategic-contact-activity-title">' + escapeHtml(getStrategicContactOptionLabel(strategicContactAttributionTypeOptions, item.attribution_type)) + '</div>' +
    '<div class="strategic-contact-activity-meta">' + escapeHtml(target.join(' | ') || 'ללא יעד') + '</div>' +
    (item.notes ? '<div class="strategic-contact-note" style="margin-top:6px">' + escapeHtml(item.notes) + '</div>' : '') +
  '</div>';
}

function loadStrategicContactAttributions(strategicContactId) {
  var list = document.getElementById('strategic-contact-attributions-list');
  if (!list || !strategicContactId) return;
  list.innerHTML = '<div class="dash-empty">טוען שיוכים...</div>';
  apiCall('GET', '/api/strategic-contacts/' + strategicContactId + '/attributions').then(function(data) {
    var attributions = data.attributions || [];
    list.innerHTML = attributions.length ? attributions.map(renderStrategicContactAttributionItem).join('') : '<div class="dash-empty">אין עדיין לידים / אירועים משויכים</div>';
  }).catch(function(err) {
    list.innerHTML = '<div class="dash-empty">שגיאה בטעינת שיוכים: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
  });
}

function setupStrategicContactAttributionForm(strategicContactId) {
  var btn = document.getElementById('strategic-contact-attribution-add');
  if (!btn || !strategicContactId) return;
  btn.addEventListener('click', function() {
    var payload = {
      attribution_type: document.getElementById('strategic-contact-attribution-type').value,
      contact_id: document.getElementById('strategic-contact-attribution-contact-id').value,
      lead_id: document.getElementById('strategic-contact-attribution-lead-id').value,
      event_id: document.getElementById('strategic-contact-attribution-event-id').value,
      notes: document.getElementById('strategic-contact-attribution-notes').value
    };
    if (!payload.contact_id && !payload.lead_id && !payload.event_id) { toast('יש לבחור לקוח או ליד/אירוע לשיוך', 'error'); return; }
    apiCall('POST', '/api/strategic-contacts/' + strategicContactId + '/attributions', payload).then(function() {
      toast('השיוך נשמר', 'success');
      ['strategic-contact-attribution-contact-id','strategic-contact-attribution-lead-id','strategic-contact-attribution-event-id','strategic-contact-attribution-notes'].forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });
      loadStrategicContactAttributions(strategicContactId);
      loadStrategicContactBusinessSummary(strategicContactId);
    }).catch(function(err) { toast(err.message || 'שגיאה בשמירת שיוך', 'error'); });
  });
}

function renderStrategicContactBusinessSummarySection(strategicContactId) {
  if (!strategicContactId) return '';
  return '<div class="strategic-contact-activities strategic-contact-business-summary">' +
    '<h3 style="margin:0 0 8px">סיכום עסקי</h3>' +
    '<div id="strategic-contact-business-summary" class="dashboard-grid"><div class="dash-empty">טוען סיכום עסקי...</div></div>' +
  '</div>';
}

function strategicContactSummaryCard(label, value) {
  return '<div class="kpi-card" style="min-height:auto"><div class="kpi-label">' + escapeHtml(label) + '</div><div class="kpi-value" style="font-size:20px">' + escapeHtml(value) + '</div></div>';
}

function renderStrategicContactBusinessSummary(summary) {
  summary = summary || {};
  var linkedCount = Number(summary.attribution_count || 0) + ' שיוכים · ' + Number(summary.linked_customers_count || 0) + ' לקוחות · ' + Number(summary.linked_leads_count || 0) + ' לידים/אירועים';
  return strategicContactSummaryCard('שיוכים', linkedCount) +
    strategicContactSummaryCard('חשבוניות', Number(summary.invoices_count || 0) + ' חשבוניות · ' + Number(summary.quotes_count || 0) + ' הצעות') +
    strategicContactSummaryCard('הכנסה משויכת', '₪' + formatStrategicContactNumber(summary.issued_invoices_total || 0)) +
    strategicContactSummaryCard('יתרה פתוחה', '₪' + formatStrategicContactNumber(summary.open_unpaid_amount || 0));
}

function loadStrategicContactBusinessSummary(strategicContactId) {
  var box = document.getElementById('strategic-contact-business-summary');
  if (!box || !strategicContactId) return;
  box.innerHTML = '<div class="dash-empty">טוען סיכום עסקי...</div>';
  apiCall('GET', '/api/strategic-contacts/' + strategicContactId + '/business-summary').then(function(data) {
    box.innerHTML = renderStrategicContactBusinessSummary(data.summary || {});
  }).catch(function(err) {
    box.innerHTML = '<div class="dash-empty">שגיאה בטעינת סיכום עסקי: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
  });
}


function renderStrategicSourceAttributions(items) {
  items = items || [];
  if (!items.length) return '<div class="dash-empty">אין מקור אסטרטגי משויך</div>';
  return items.map(function(item) {
    return '<div class="strategic-contact-activity-item">' +
      '<div class="strategic-contact-activity-title">' + escapeHtml(item.strategic_contact_name || 'קשר אסטרטגי') + ' · ' + escapeHtml(getStrategicContactOptionLabel(strategicContactAttributionTypeOptions, item.attribution_type)) + '</div>' +
      (item.notes ? '<div class="strategic-contact-note" style="margin-top:6px">' + escapeHtml(item.notes) + '</div>' : '') +
    '</div>';
  }).join('');
}

function loadCustomerStrategicSource(contactId) {
  var box = document.getElementById('customer-strategic-source-list');
  if (!box || !contactId) return;
  apiCall('GET', '/api/strategic-contacts/attributions?contact_id=' + encodeURIComponent(contactId)).then(function(data) {
    box.innerHTML = renderStrategicSourceAttributions(data.attributions || []);
  }).catch(function() { box.innerHTML = '<div class="dash-empty">אין מקור אסטרטגי משויך</div>'; });
}

function loadLeadStrategicSource(leadId) {
  var box = document.getElementById('lead-strategic-source-list');
  if (!box || !leadId) return;
  apiCall('GET', '/api/strategic-contacts/attributions?lead_id=' + encodeURIComponent(leadId)).then(function(data) {
    box.innerHTML = renderStrategicSourceAttributions(data.attributions || []);
  }).catch(function() { box.innerHTML = '<div class="dash-empty">אין מקור אסטרטגי משויך</div>'; });
}


function openStrategicContactModal(id, defaults) {
  var isEdit = !!id;
  defaults = defaults || null;
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'strategic-contact-modal-runtime';
  overlay.innerHTML = '<div class="modal"><div class="modal-header"><h2>' + (isEdit ? 'עריכת קשר אסטרטגי' : 'קשר אסטרטגי חדש') + '</h2><button class="modal-close" id="strategic-contact-close">✕</button></div><div class="modal-body" id="strategic-contact-modal-body"><div class="dash-empty">טוען...</div></div><div class="modal-footer">' + (isEdit ? '<button class="btn btn-danger" id="strategic-contact-delete" style="margin-left:auto">מחק קשר</button>' : '') + '<button class="btn btn-secondary" id="strategic-contact-cancel">ביטול</button><button class="btn btn-primary" id="strategic-contact-save">שמור</button></div></div>';
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
  document.getElementById('strategic-contact-close').onclick = close;
  document.getElementById('strategic-contact-cancel').onclick = close;
  if (isEdit && document.getElementById('strategic-contact-delete')) {
    document.getElementById('strategic-contact-delete').onclick = function() { deleteStrategicContact(id, close); };
  }
  overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

  function renderForm(item) {
    item = item || { category: 'other', status: 'new', priority: 'normal', preferred_channel: '', active: 1 };
    item = Object.assign({}, item, defaults || {});
    if (!item.category) item.category = 'other';
    if (!item.status) item.status = 'new';
    if (!item.priority) item.priority = 'normal';
    if (item.active === undefined || item.active === null) item.active = 1;
    var body = document.getElementById('strategic-contact-modal-body');
    var linkedNotice = item.linked_contact_id ? '<div class="strategic-contact-linked-notice">מקושר ללקוח קיים</div>' : '';
    body.innerHTML = linkedNotice + '<input type="hidden" class="strategic-contact-field" data-strategic-contact-field="linked_contact_id" value="' + escapeHtml(item.linked_contact_id || '') + '">' + '<div class="strategic-contact-form-grid">' +
      strategicContactInput('organization_name', 'שם ארגון', item.organization_name, 'text') +
      strategicContactInput('contact_person_name', 'שם איש קשר', item.contact_person_name, 'text') +
      strategicContactInput('role_title', 'תפקיד', item.role_title, 'text') +
      strategicContactSelect('category', 'קטגוריה', item.category || 'other', strategicContactCategoryOptions) +
      strategicContactSelect('status', 'סטטוס', item.status || 'new', strategicContactStatusOptions) +
      strategicContactSelect('priority', 'עדיפות', item.priority || 'normal', strategicContactPriorityOptions) +
      strategicContactSelect('relationship_grade', 'דירוג קשר', item.relationship_grade || '', strategicContactRelationshipGradeOptions) +
      strategicContactSelect('warmth_level', 'רמת חום', item.warmth_level || '', strategicContactWarmthLevelOptions) +
      strategicContactInput('estimated_annual_value', 'פוטנציאל שנתי', item.estimated_annual_value, 'number') +
      strategicContactInput('potential_events_per_year', 'אירועים פוטנציאליים בשנה', item.potential_events_per_year, 'number') +
      strategicContactInput('phone', 'טלפון', item.phone, 'tel') +
      strategicContactInput('whatsapp', 'WhatsApp', item.whatsapp, 'tel') +
      strategicContactInput('email', 'אימייל', item.email, 'email') +
      strategicContactInput('website', 'אתר', item.website, 'url') +
      strategicContactInput('city', 'עיר', item.city, 'text') +
      strategicContactInput('area', 'אזור', item.area, 'text') +
      strategicContactSelect('preferred_channel', 'ערוץ מועדף', item.preferred_channel || '', strategicContactChannelOptions) +
      strategicContactInput('source', 'מקור', item.source, 'text') +
      strategicContactInput('tags', 'תגיות חופשיות', getStrategicContactFreeTags(item.tags).join(', '), 'text') +
      renderStrategicContactSeasonalChecklist(item.tags) +
      strategicContactInput('last_contact_at', 'קשר אחרון', item.last_contact_at, 'date') +
      strategicContactInput('next_contact_at', 'קשר הבא', item.next_contact_at, 'date') +
      strategicContactSelect('active', 'פעיל', String(item.active) === '0' ? '0' : '1', [['1','פעיל'],['0','לא פעיל']]) +
    '</div><div class="strategic-contact-form-grid single" style="margin-top:12px">' +
      strategicContactInput('followup_reason', 'סיבת מעקב', item.followup_reason, 'text') +
      strategicContactTextarea('relevant_services', 'שירותים רלוונטיים', item.relevant_services) +
      strategicContactTextarea('notes', 'הערות', item.notes) +
    '</div>' + renderStrategicContactBusinessSummarySection(isEdit ? id : null) + renderStrategicContactActivitiesSection(isEdit ? id : null) + renderStrategicContactAttributionsSection(isEdit ? id : null);
    if (isEdit) {
      loadStrategicContactBusinessSummary(id);
      loadStrategicContactActivities(id);
      setupStrategicContactActivityForm(id);
      loadStrategicContactAttributions(id);
      setupStrategicContactAttributionForm(id);
    }
  }

  function collectPayload() {
    var payload = {};
    overlay.querySelectorAll('.strategic-contact-field').forEach(function(input) {
      payload[input.getAttribute('data-strategic-contact-field')] = input.value;
    });
    if (!payload.organization_name || !payload.organization_name.trim()) throw new Error('שם ארגון חובה');
    var seasonalTags = [];
    overlay.querySelectorAll('.strategic-contact-seasonal-field:checked').forEach(function(input) { seasonalTags.push(input.value); });
    payload.tags = dedupeStrategicContactTags(getStrategicContactFreeTags(payload.tags).concat(seasonalTags)).join(', ');
    payload.active = payload.active === '0' ? 0 : 1;
    return payload;
  }

  document.getElementById('strategic-contact-save').onclick = function() {
    var payload;
    try { payload = collectPayload(); } catch (err) { toast(err.message, 'error'); return; }
    apiCall(isEdit ? 'PUT' : 'POST', '/api/strategic-contacts' + (isEdit ? '/' + id : ''), payload).then(function() {
      toast('הקשר האסטרטגי נשמר', 'success');
      close();
      loadStrategicContacts();
      if (defaults && defaults.return_to_customer_id) openCustomerCard(defaults.return_to_customer_id);
    }).catch(function(err) { toast(err.message || 'שגיאה בשמירה', 'error'); });
  };

  if (isEdit) {
    apiCall('GET', '/api/strategic-contacts/' + id).then(function(data) {
      renderForm(data.strategic_contact || {});
    }).catch(function(err) {
      document.getElementById('strategic-contact-modal-body').innerHTML = '<div class="dash-empty">שגיאה בטעינת קשר: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
    });
  } else {
    renderForm(null);
  }
}



function deleteStrategicContact(id, onDone) {
  if (!confirm('למחוק את הקשר האסטרטגי? הפעילויות והשיוכים שלו יימחקו.')) return;
  apiCall('DELETE', '/api/strategic-contacts/' + id).then(function() {
    if (typeof onDone === 'function') onDone();
    toast('הקשר האסטרטגי נמחק', 'success');
    loadStrategicContacts();
  }).catch(function(e) { toast(e.message || 'שגיאה במחיקה', 'error'); });
}

function buildStrategicContactDefaultsFromCustomer(customer) {
  customer = customer || {};
  var notes = [];
  if (customer.general_notes) notes.push(customer.general_notes);
  else if (customer.notes) notes.push(customer.notes);
  return {
    linked_contact_id: customer.id,
    return_to_customer_id: customer.id,
    organization_name: customer.name || '',
    contact_person_name: customer.name || '',
    phone: customer.phone || '',
    whatsapp: customer.phone || '',
    email: customer.email || '',
    city: customer.city || '',
    area: customer.area || '',
    source: 'נוצר מכרטיס לקוח קיים #' + (customer.contact_num || customer.id || ''),
    notes: notes.join('\\n'),
    category: 'other',
    status: 'need_first_contact',
    priority: 'normal',
    preferred_channel: customer.email ? 'email' : (customer.phone ? 'whatsapp' : '')
  };
}

function openStrategicContactFromCustomer(customer) {
  customer = customer || {};
  if (!isModuleEnabled('strategic_contacts')) {
    toast('מודול קשרים אסטרטגיים כבוי', 'error');
    return;
  }
  var customerId = customer.id;
  if (!customerId) return;
  apiCall('GET', '/api/strategic-contacts?linked_contact_id=' + encodeURIComponent(customerId) + '&active=all').then(function(data) {
    var existing = (data.strategic_contacts || [])[0];
    if (existing && existing.id) {
      var shouldOpen = window.confirm('לקוח זה כבר מקושר לקשר אסטרטגי. לפתוח את הקשר הקיים לעריכה?');
      if (shouldOpen) openStrategicContactModal(existing.id);
      return;
    }
    openStrategicContactModal(null, buildStrategicContactDefaultsFromCustomer(customer));
  }).catch(function(err) {
    toast(err.message || 'שגיאה בבדיקת קשר אסטרטגי קיים', 'error');
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
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
        '<button class="btn btn-ghost btn-sm customer-to-strategic-btn" data-cid="' + c.id + '" onclick="event.stopPropagation()">הוסף לקשרים אסטרטגיים</button>' +
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
      grid.innerHTML = (search || statusFilter || typeFilter || sortBy)
        ? '<div class="dash-empty">' + msg + '</div>'
        : renderGuidedEmptyState('אין לקוחות עדיין', 'כדאי להתחיל מכרטיס לקוח ראשון. אפשר לפתוח אותו מיד ולהמשיך משם לליד או לאירוע.', 'הוסף לקוח ראשון', 'openLeadModal()');
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
    grid.querySelectorAll('.customer-to-strategic-btn[data-cid]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var cid = parseInt(this.getAttribute('data-cid'));
        var customer = contacts.find(function(item) { return Number(item.id) === Number(cid); });
        if (customer) openStrategicContactFromCustomer(customer);
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

function deleteProductHard(id, onDone) {
  if (!confirm('למחוק את המוצר לגמרי? לא ניתן למחוק מוצר שמופיע במסמך מכירה או חשבונית.')) return;
  apiCall('DELETE', '/api/products/' + id + '/hard-delete').then(function() {
    if (typeof onDone === 'function') onDone();
    toast('המוצר נמחק', 'success');
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
        (id ? '<button class="btn btn-danger" id="product-modal-delete" style="margin-left:auto">מחק מוצר</button>' : '') +
        '<button class="btn btn-secondary" id="product-modal-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="product-modal-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); currentProductId = null; currentProductPurchaseEditId = null; currentProductPurchaseFormMode = null; currentProductPurchaseSaving = false; currentProductStock = null; currentProductStockMovements = []; currentProductAdjustmentMode = null; currentProductAdjustmentSaving = false; }
  document.getElementById('product-modal-close').onclick = close;
  document.getElementById('product-modal-cancel').onclick = close;
  if (id && document.getElementById('product-modal-delete')) {
    document.getElementById('product-modal-delete').onclick = function() { deleteProductHard(id, close); };
  }

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
        (id ? '<button class="btn btn-danger" id="employee-modal-delete" style="margin-left:auto">מחק עובד</button>' : '') +
        '<button class="btn btn-secondary" id="employee-modal-cancel">ביטול</button>' +
        '<button class="btn btn-primary" id="employee-modal-save">שמור</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function close() { overlay.remove(); currentEmployeeId = null; }
  document.getElementById('employee-modal-close').onclick = close;
  document.getElementById('employee-modal-cancel').onclick = close;
  if (id && document.getElementById('employee-modal-delete')) {
    document.getElementById('employee-modal-delete').onclick = function() { deleteEmployeeHard(id, close); };
  }

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

function deleteEmployeeHard(id, onDone) {
  if (!confirm('למחוק את העובד לגמרי? השיוכים שלו לאירועים יימחקו.')) return;
  apiCall('DELETE', '/api/employees/' + id + '/hard-delete').then(function() {
    if (typeof onDone === 'function') onDone();
    toast('העובד נמחק', 'success');
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
        '<button class="btn btn-danger" id="edit-customer-delete" style="margin-left:auto">מחק לקוח</button>' +
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
  document.getElementById('edit-customer-delete').onclick = function() { deleteCustomer(c.id, close); };

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


function canEditCustomerBilling() {
  var role = getTenantRole();
  return role === 'owner' || role === 'admin' || role === 'manager';
}

function customerBillingEmptyState(text) {
  return '<div class="customer-billing-empty">' + escapeHtml(text) + '</div>';
}

function getCustomerBillingVatLabel(value) {
  var map = { standard: 'רגיל', exempt: 'פטור', reverse_charge: 'חיוב הפוך', foreign: 'חו״ל', custom: 'מותאם' };
  return map[value] || value || '—';
}

function getCustomerBillingCreditLabel(value) {
  var map = { normal: 'רגיל', watch: 'במעקב', blocked: 'חסום' };
  return map[value] || value || '—';
}

function getCustomerAddressTypeLabel(value) {
  var map = { billing: 'חיוב', shipping: 'משלוח', service: 'שירות', event: 'אירוע', other: 'אחר' };
  return map[value] || value || '—';
}

function getCustomerContactRoleLabel(value) {
  var map = { main: 'ראשי', finance: 'כספים', assistant: 'עוזר/ת', onsite: 'בשטח', producer: 'מפיק/ה', other: 'אחר' };
  return map[value] || value || '—';
}

function customerBillingValue(value) {
  return value === undefined || value === null ? '' : String(value);
}

function customerBillingInput(field, label, value, disabled, type, attrs) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><input class="form-input customer-billing-field" data-billing-field="' + escapeHtml(field) + '" type="' + escapeHtml(type || 'text') + '" value="' + escapeHtml(customerBillingValue(value)) + '"' + (attrs || '') + (disabled ? ' disabled' : '') + '></div>';
}

function customerBillingTextarea(field, label, value, disabled) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><textarea class="form-textarea customer-billing-field" data-billing-field="' + escapeHtml(field) + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(customerBillingValue(value)) + '</textarea></div>';
}

function customerBillingSelect(field, label, value, options, disabled) {
  return '<div class="form-group" style="margin-bottom:0"><label class="form-label">' + escapeHtml(label) + '</label><select class="form-input customer-billing-field" data-billing-field="' + escapeHtml(field) + '"' + (disabled ? ' disabled' : '') + '>' +
    options.map(function(option) { return '<option value="' + escapeHtml(option[0]) + '"' + (String(value || '') === String(option[0]) ? ' selected' : '') + '>' + escapeHtml(option[1]) + '</option>'; }).join('') +
  '</select></div>';
}

function customerBillingCheckbox(field, label, checked, disabled) {
  return '<label style="display:flex;gap:8px;align-items:center;font-size:13px;font-weight:700;color:var(--text2)"><input type="checkbox" class="customer-billing-check" data-billing-field="' + escapeHtml(field) + '"' + (Number(checked) === 1 || checked === true ? ' checked' : '') + (disabled ? ' disabled' : '') + '> ' + escapeHtml(label) + '</label>';
}

function getCustomerBillingShell(customerId) {
  return '<div class="customer-billing-panel" id="customer-billing-root" data-contact-id="' + customerId + '">' +
    '<div class="customer-billing-header">' +
      '<div><div class="customer-billing-title">חיוב וחשבונאות</div><div class="customer-billing-subtitle">פרטי חיוב, כתובות ואנשי קשר למסמכים עתידיים. לא משנה מסמכים קיימים.</div></div>' +
      '<span class="badge badge-gray" id="customer-billing-role-badge">' + escapeHtml(getTenantRoleLabel(getTenantRole())) + '</span>' +
    '</div>' +
    '<div class="customer-billing-tabs">' +
      '<button class="customer-billing-tab active" data-billing-tab="profile">פרופיל חיוב</button>' +
      '<button class="customer-billing-tab" data-billing-tab="addresses">כתובות</button>' +
      '<button class="customer-billing-tab" data-billing-tab="people">אנשי קשר</button>' +
    '</div>' +
    '<div class="customer-billing-content" id="customer-billing-content">טוען...</div>' +
  '</div>';
}

function initCustomerBillingUI(customerId) {
  currentCustomerBillingState = {
    contactId: customerId,
    activeTab: 'profile',
    loading: true,
    saving: false,
    profile: null,
    addresses: [],
    people: [],
    editingAddressId: null,
    creatingAddress: false,
    editingPersonId: null,
    creatingPerson: false,
    error: null
  };
  renderCustomerBillingUI();
  return loadCustomerBillingData(customerId);
}

function loadCustomerBillingData(customerId) {
  if (!currentCustomerBillingState || Number(currentCustomerBillingState.contactId) !== Number(customerId)) return Promise.resolve();
  currentCustomerBillingState.loading = true;
  currentCustomerBillingState.error = null;
  renderCustomerBillingUI();
  return Promise.all([
    apiCall('GET', '/api/contacts/' + customerId + '/billing-profile'),
    apiCall('GET', '/api/contacts/' + customerId + '/addresses'),
    apiCall('GET', '/api/contacts/' + customerId + '/contact-people')
  ]).then(function(results) {
    currentCustomerBillingState.profile = results[0].profile || {};
    currentCustomerBillingState.addresses = results[1].addresses || [];
    currentCustomerBillingState.people = results[2].contact_people || [];
    currentCustomerBillingState.loading = false;
    renderCustomerBillingUI();
  }).catch(function(e) {
    currentCustomerBillingState.loading = false;
    currentCustomerBillingState.error = e.message || 'שגיאה בטעינת נתוני חיוב';
    renderCustomerBillingUI();
  });
}

function renderCustomerBillingUI() {
  var root = document.getElementById('customer-billing-root');
  var content = document.getElementById('customer-billing-content');
  if (!root || !content || !currentCustomerBillingState) return;
  var state = currentCustomerBillingState;
  root.querySelectorAll('.customer-billing-tab').forEach(function(tab) {
    tab.classList.toggle('active', tab.getAttribute('data-billing-tab') === state.activeTab);
    tab.onclick = function() {
      state.activeTab = this.getAttribute('data-billing-tab');
      state.editingAddressId = null;
      state.creatingAddress = false;
      state.editingPersonId = null;
      state.creatingPerson = false;
      renderCustomerBillingUI();
    };
  });
  if (state.loading) {
    content.innerHTML = customerBillingEmptyState('טוען נתוני חיוב...');
    return;
  }
  if (state.error) {
    content.innerHTML = '<div class="customer-billing-empty">שגיאה: ' + escapeHtml(state.error) + '</div>';
    return;
  }
  if (state.activeTab === 'addresses') content.innerHTML = renderCustomerAddressesUI();
  else if (state.activeTab === 'people') content.innerHTML = renderCustomerPeopleUI();
  else content.innerHTML = renderCustomerBillingProfileUI();
  bindCustomerBillingUI();
}

function renderCustomerBillingProfileUI() {
  var state = currentCustomerBillingState;
  var profile = state.profile || {};
  var canEdit = canEditCustomerBilling();
  var disabled = !canEdit || state.saving;
  var html = '';
  if (!canEdit) html += '<div class="customer-billing-permission">מצב צפייה בלבד — Owner/Admin/Manager יכולים לערוך פרטי חיוב. Employee יכול לצפות בלבד.</div>';
  html += '<div class="customer-billing-section"><div class="customer-billing-section-title">פרטי חיוב</div><div class="customer-billing-section-sub">נתונים לשימוש עתידי במסמכים חדשים בלבד. אין עדכון אוטומטי למסמכים קיימים.</div><div class="customer-billing-grid">' +
    customerBillingInput('billing_name', 'שם לחיוב', profile.billing_name, disabled) +
    customerBillingInput('tax_id', 'ח.פ / עוסק / ת.ז', profile.tax_id, disabled) +
    customerBillingInput('invoice_recipient_name', 'שם נמען חשבונית', profile.invoice_recipient_name, disabled) +
    customerBillingInput('invoice_recipient_email', 'אימייל נמען חשבונית', profile.invoice_recipient_email, disabled, 'email') +
    customerBillingInput('invoice_recipient_phone', 'טלפון נמען חשבונית', profile.invoice_recipient_phone, disabled, 'tel') +
    customerBillingInput('preferred_currency', 'מטבע מועדף', profile.preferred_currency || 'ILS', disabled, 'text', ' maxlength="3"') +
    customerBillingInput('payment_terms', 'תנאי תשלום', profile.payment_terms, disabled) +
    customerBillingSelect('vat_treatment', 'טיפול מע״מ', profile.vat_treatment || 'standard', [['standard','רגיל'],['exempt','פטור'],['reverse_charge','חיוב הפוך'],['foreign','חו״ל'],['custom','מותאם']], disabled) +
    customerBillingInput('default_vat_rate', 'אחוז מע״מ ברירת מחדל', profile.default_vat_rate, disabled, 'number', ' min="0" max="100" step="0.01" inputmode="decimal"') +
    customerBillingInput('credit_limit', 'מסגרת אשראי', profile.credit_limit, disabled, 'number', ' min="0" step="0.01" inputmode="decimal"') +
    customerBillingSelect('credit_status', 'סטטוס אשראי', profile.credit_status || 'normal', [['normal','רגיל'],['watch','במעקב'],['blocked','חסום']], disabled) +
    customerBillingInput('default_discount_percent', 'הנחת ברירת מחדל %', profile.default_discount_percent, disabled, 'number', ' min="0" max="100" step="0.01" inputmode="decimal"') +
    customerBillingInput('default_discount_amount', 'הנחת ברירת מחדל סכום', profile.default_discount_amount, disabled, 'number', ' min="0" step="0.01" inputmode="decimal"') +
  '</div></div>';
  html += '<div class="customer-billing-section"><div class="customer-billing-section-title">הערות וטקסטים</div><div class="customer-billing-grid single">' +
    customerBillingTextarea('default_notes', 'הערות ברירת מחדל', profile.default_notes, disabled) +
    customerBillingTextarea('default_document_footer', 'Footer ברירת מחדל', profile.default_document_footer, disabled) +
    customerBillingTextarea('credit_notes', 'הערות אשראי', profile.credit_notes, disabled) +
    customerBillingTextarea('pricing_notes', 'הערות מחיר / הנחות', profile.pricing_notes, disabled) +
  '</div></div>';
  html += '<div class="customer-billing-actions"><div class="customer-billing-status">' + (canEdit ? 'השמירה מעדכנת רק את פרופיל הלקוח. מסמכי מכירה קיימים לא משתנים.' : 'אין הרשאת עריכה') + '</div>' +
    (canEdit ? '<button class="btn btn-primary" id="customer-billing-save-profile"' + (state.saving ? ' disabled' : '') + '>' + (state.saving ? 'שומר...' : 'שמור פרופיל חיוב') + '</button>' : '<button class="btn btn-secondary" disabled>צפייה בלבד</button>') + '</div>';
  return html;
}

function bindCustomerBillingProfileForm() {
  document.querySelectorAll('.customer-billing-field').forEach(function(field) {
    field.addEventListener('input', function() {
      if (!currentCustomerBillingState || !currentCustomerBillingState.profile) return;
      currentCustomerBillingState.profile[this.getAttribute('data-billing-field')] = this.value;
    });
    field.addEventListener('change', function() {
      if (!currentCustomerBillingState || !currentCustomerBillingState.profile) return;
      currentCustomerBillingState.profile[this.getAttribute('data-billing-field')] = this.value;
    });
  });
  var saveBtn = document.getElementById('customer-billing-save-profile');
  if (saveBtn) saveBtn.onclick = saveCustomerBillingProfile;
}

function buildCustomerBillingProfilePayload() {
  var p = currentCustomerBillingState.profile || {};
  function nullable(field) { return p[field] === undefined || p[field] === null || p[field] === '' ? null : p[field]; }
  function numberOrZero(field) { var n = Number(p[field] || 0); return Number.isFinite(n) ? n : 0; }
  function numberOrNull(field) { if (p[field] === undefined || p[field] === null || p[field] === '') return null; var n = Number(p[field]); return Number.isFinite(n) ? n : null; }
  return {
    billing_name: nullable('billing_name'),
    tax_id: nullable('tax_id'),
    invoice_recipient_name: nullable('invoice_recipient_name'),
    invoice_recipient_email: nullable('invoice_recipient_email'),
    invoice_recipient_phone: nullable('invoice_recipient_phone'),
    preferred_currency: (p.preferred_currency || 'ILS').toUpperCase(),
    payment_terms: nullable('payment_terms'),
    default_notes: nullable('default_notes'),
    default_document_footer: nullable('default_document_footer'),
    vat_treatment: p.vat_treatment || 'standard',
    default_vat_rate: numberOrNull('default_vat_rate'),
    credit_limit: numberOrZero('credit_limit'),
    credit_status: p.credit_status || 'normal',
    credit_notes: nullable('credit_notes'),
    default_discount_percent: numberOrZero('default_discount_percent'),
    default_discount_amount: numberOrZero('default_discount_amount'),
    pricing_notes: nullable('pricing_notes'),
    default_billing_address_id: p.default_billing_address_id || null,
    default_service_address_id: p.default_service_address_id || null,
    default_finance_contact_id: p.default_finance_contact_id || null
  };
}

function saveCustomerBillingProfile() {
  var state = currentCustomerBillingState;
  if (!state || state.saving || !canEditCustomerBilling()) return;
  state.saving = true;
  renderCustomerBillingUI();
  apiCall('PUT', '/api/contacts/' + state.contactId + '/billing-profile', buildCustomerBillingProfilePayload()).then(function(data) {
    state.profile = data.profile || state.profile;
    toast('פרופיל החיוב נשמר', 'success');
  }).catch(function(e) {
    toast(e.message || 'שגיאה בשמירת פרופיל חיוב', 'error');
  }).finally(function() {
    state.saving = false;
    renderCustomerBillingUI();
  });
}

function renderCustomerAddressesUI() {
  var state = currentCustomerBillingState;
  var canEdit = canEditCustomerBilling();
  var html = '';
  if (!canEdit) html += '<div class="customer-billing-permission">מצב צפייה בלבד — רק Owner/Admin/Manager יכולים להוסיף או לערוך כתובות.</div>';
  html += '<div class="customer-billing-section"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><div class="customer-billing-section-title">כתובות לקוח</div><div class="customer-billing-section-sub">ניתן לשמור כמה כתובות ולסמן ברירות מחדל לחיוב, שירות או משלוח.</div></div>' +
    (canEdit ? '<button class="btn btn-primary btn-sm" id="customer-address-add">+ הוסף כתובת</button>' : '') + '</div>';
  if (state.creatingAddress) html += renderCustomerAddressForm(null);
  html += '<div class="customer-billing-list">';
  if (!state.addresses.length) html += customerBillingEmptyState('אין כתובות עדיין. הוסף כתובת חיוב או שירות ראשונה.');
  state.addresses.forEach(function(address) {
    html += Number(state.editingAddressId) === Number(address.id) ? renderCustomerAddressForm(address) : renderCustomerAddressCard(address, canEdit);
  });
  html += '</div></div>';
  return html;
}

function renderCustomerAddressCard(address, canEdit) {
  var chips = [];
  if (Number(address.is_default_billing) === 1) chips.push('<span class="customer-billing-chip green">ברירת מחדל לחיוב</span>');
  if (Number(address.is_default_service) === 1) chips.push('<span class="customer-billing-chip">ברירת מחדל לשירות</span>');
  if (Number(address.is_default_shipping) === 1) chips.push('<span class="customer-billing-chip">ברירת מחדל למשלוח</span>');
  if (Number(address.active) !== 1) chips.push('<span class="customer-billing-chip muted">לא פעיל</span>');
  return '<div class="customer-billing-card">' +
    '<div class="customer-billing-card-main"><div class="customer-billing-card-title">' + escapeHtml(address.label || getCustomerAddressTypeLabel(address.address_type)) + '</div>' +
      '<div class="customer-billing-card-meta"><span>' + escapeHtml(getCustomerAddressTypeLabel(address.address_type)) + '</span><span>' + escapeHtml(address.full_address || [address.street, address.city, address.region, address.postal_code, address.country].filter(Boolean).join(', ') || 'אין כתובת מלאה') + '</span></div>' +
      (chips.length ? '<div class="customer-billing-card-meta">' + chips.join('') + '</div>' : '') +
      (address.notes ? '<div class="customer-billing-card-meta">' + escapeHtml(address.notes) + '</div>' : '') +
    '</div>' +
    '<div class="customer-billing-card-actions">' + (canEdit ? '<button class="btn btn-secondary btn-sm customer-address-edit" data-address-id="' + address.id + '">עריכה</button>' : '') + '</div>' +
  '</div>';
}

function renderCustomerAddressForm(address) {
  var a = address || { address_type: 'billing', country: 'IL', active: 1 };
  var isEdit = !!address;
  return '<div class="customer-billing-inline-form" data-address-form-id="' + (isEdit ? a.id : 'new') + '">' +
    '<div class="customer-billing-section-title">' + (isEdit ? 'עריכת כתובת' : 'כתובת חדשה') + '</div>' +
    '<div class="customer-billing-grid">' +
      customerBillingInput('label', 'שם/תווית', a.label, false) +
      customerBillingSelect('address_type', 'סוג כתובת', a.address_type || 'billing', [['billing','חיוב'],['shipping','משלוח'],['service','שירות'],['event','אירוע'],['other','אחר']], false) +
      customerBillingInput('full_address', 'כתובת מלאה', a.full_address, false) +
      customerBillingInput('street', 'רחוב', a.street, false) +
      customerBillingInput('city', 'עיר', a.city, false) +
      customerBillingInput('region', 'אזור/מחוז', a.region, false) +
      customerBillingInput('postal_code', 'מיקוד', a.postal_code, false) +
      customerBillingInput('country', 'מדינה', a.country || 'IL', false) +
    '</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
      customerBillingCheckbox('is_default_billing', 'ברירת מחדל לחיוב', a.is_default_billing, false) +
      customerBillingCheckbox('is_default_service', 'ברירת מחדל לשירות', a.is_default_service, false) +
      customerBillingCheckbox('is_default_shipping', 'ברירת מחדל למשלוח', a.is_default_shipping, false) +
      customerBillingCheckbox('active', 'פעיל', a.active === undefined ? 1 : a.active, false) +
    '</div>' +
    customerBillingTextarea('notes', 'הערות כתובת', a.notes, false) +
    '<div class="customer-billing-actions" style="position:static;padding:0;border:0;background:transparent"><span class="customer-billing-status">' + (isEdit ? 'עדכון כתובת קיימת' : 'יצירת כתובת חדשה') + '</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-secondary btn-sm customer-address-cancel">ביטול</button><button class="btn btn-primary btn-sm customer-address-save" data-address-id="' + (isEdit ? a.id : '') + '">שמור כתובת</button></div></div>' +
  '</div>';
}

function collectCustomerBillingFormPayload(container) {
  var payload = {};
  container.querySelectorAll('.customer-billing-field').forEach(function(field) {
    payload[field.getAttribute('data-billing-field')] = field.value;
  });
  container.querySelectorAll('.customer-billing-check').forEach(function(field) {
    payload[field.getAttribute('data-billing-field')] = field.checked;
  });
  return payload;
}

function saveCustomerAddress(addressId) {
  var state = currentCustomerBillingState;
  var form = document.querySelector('[data-address-form-id="' + (addressId ? addressId : 'new') + '"]');
  if (!state || !form) return;
  var payload = collectCustomerBillingFormPayload(form);
  state.saving = true;
  var method = addressId ? 'PUT' : 'POST';
  var path = '/api/contacts/' + state.contactId + '/addresses' + (addressId ? '/' + addressId : '');
  apiCall(method, path, payload).then(function() {
    toast(addressId ? 'הכתובת עודכנה' : 'הכתובת נוספה', 'success');
    state.creatingAddress = false;
    state.editingAddressId = null;
    return apiCall('GET', '/api/contacts/' + state.contactId + '/addresses');
  }).then(function(data) {
    state.addresses = data.addresses || [];
  }).catch(function(e) {
    toast(e.message || 'שגיאה בשמירת כתובת', 'error');
  }).finally(function() {
    state.saving = false;
    renderCustomerBillingUI();
  });
}

function renderCustomerPeopleUI() {
  var state = currentCustomerBillingState;
  var canEdit = canEditCustomerBilling();
  var html = '';
  if (!canEdit) html += '<div class="customer-billing-permission">מצב צפייה בלבד — רק Owner/Admin/Manager יכולים להוסיף או לערוך אנשי קשר.</div>';
  html += '<div class="customer-billing-section"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><div class="customer-billing-section-title">אנשי קשר לחיוב ומסמכים</div><div class="customer-billing-section-sub">אנשי כספים, נמעני מסמכים ואנשי קשר ראשיים ללקוח.</div></div>' +
    (canEdit ? '<button class="btn btn-primary btn-sm" id="customer-person-add">+ הוסף איש קשר</button>' : '') + '</div>';
  if (state.creatingPerson) html += renderCustomerPersonForm(null);
  html += '<div class="customer-billing-list">';
  if (!state.people.length) html += customerBillingEmptyState('אין אנשי קשר ייעודיים עדיין. אפשר להוסיף איש קשר פיננסי או נמען מסמכים.');
  state.people.forEach(function(person) {
    html += Number(state.editingPersonId) === Number(person.id) ? renderCustomerPersonForm(person) : renderCustomerPersonCard(person, canEdit);
  });
  html += '</div></div>';
  return html;
}

function renderCustomerPersonCard(person, canEdit) {
  var chips = [];
  if (Number(person.is_primary) === 1) chips.push('<span class="customer-billing-chip green">ראשי</span>');
  if (Number(person.is_finance) === 1) chips.push('<span class="customer-billing-chip">כספים</span>');
  if (Number(person.is_document_recipient) === 1) chips.push('<span class="customer-billing-chip orange">נמען מסמכים</span>');
  if (Number(person.active) !== 1) chips.push('<span class="customer-billing-chip muted">לא פעיל</span>');
  return '<div class="customer-billing-card">' +
    '<div class="customer-billing-card-main"><div class="customer-billing-card-title">' + escapeHtml(person.name || 'איש קשר') + '</div>' +
      '<div class="customer-billing-card-meta"><span>' + escapeHtml(getCustomerContactRoleLabel(person.role_type)) + '</span>' + (person.title ? '<span>' + escapeHtml(person.title) + '</span>' : '') + (person.phone ? '<span>' + escapeHtml(person.phone) + '</span>' : '') + (person.email ? '<span>' + escapeHtml(person.email) + '</span>' : '') + '</div>' +
      (chips.length ? '<div class="customer-billing-card-meta">' + chips.join('') + '</div>' : '') +
      (person.notes ? '<div class="customer-billing-card-meta">' + escapeHtml(person.notes) + '</div>' : '') +
    '</div>' +
    '<div class="customer-billing-card-actions">' + (canEdit ? '<button class="btn btn-secondary btn-sm customer-person-edit" data-person-id="' + person.id + '">עריכה</button>' : '') + '</div>' +
  '</div>';
}

function renderCustomerPersonForm(person) {
  var p = person || { role_type: 'main', active: 1, display_order: 0 };
  var isEdit = !!person;
  return '<div class="customer-billing-inline-form" data-person-form-id="' + (isEdit ? p.id : 'new') + '">' +
    '<div class="customer-billing-section-title">' + (isEdit ? 'עריכת איש קשר' : 'איש קשר חדש') + '</div>' +
    '<div class="customer-billing-grid">' +
      customerBillingInput('name', 'שם', p.name, false) +
      customerBillingSelect('role_type', 'תפקיד', p.role_type || 'main', [['main','ראשי'],['finance','כספים'],['assistant','עוזר/ת'],['onsite','בשטח'],['producer','מפיק/ה'],['other','אחר']], false) +
      customerBillingInput('title', 'טייטל / תפקיד בארגון', p.title, false) +
      customerBillingInput('phone', 'טלפון', p.phone, false, 'tel') +
      customerBillingInput('email', 'אימייל', p.email, false, 'email') +
      customerBillingInput('display_order', 'סדר תצוגה', p.display_order || 0, false, 'number', ' step="1"') +
    '</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
      customerBillingCheckbox('is_primary', 'איש קשר ראשי', p.is_primary, false) +
      customerBillingCheckbox('is_finance', 'איש קשר פיננסי', p.is_finance, false) +
      customerBillingCheckbox('is_document_recipient', 'נמען מסמכים', p.is_document_recipient, false) +
      customerBillingCheckbox('active', 'פעיל', p.active === undefined ? 1 : p.active, false) +
    '</div>' +
    customerBillingTextarea('notes', 'הערות איש קשר', p.notes, false) +
    '<div class="customer-billing-actions" style="position:static;padding:0;border:0;background:transparent"><span class="customer-billing-status">' + (isEdit ? 'עדכון איש קשר קיים' : 'יצירת איש קשר חדש') + '</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-secondary btn-sm customer-person-cancel">ביטול</button><button class="btn btn-primary btn-sm customer-person-save" data-person-id="' + (isEdit ? p.id : '') + '">שמור איש קשר</button></div></div>' +
  '</div>';
}

function saveCustomerPerson(personId) {
  var state = currentCustomerBillingState;
  var form = document.querySelector('[data-person-form-id="' + (personId ? personId : 'new') + '"]');
  if (!state || !form) return;
  var payload = collectCustomerBillingFormPayload(form);
  payload.display_order = Number(payload.display_order || 0);
  state.saving = true;
  var method = personId ? 'PUT' : 'POST';
  var path = '/api/contacts/' + state.contactId + '/contact-people' + (personId ? '/' + personId : '');
  apiCall(method, path, payload).then(function() {
    toast(personId ? 'איש הקשר עודכן' : 'איש הקשר נוסף', 'success');
    state.creatingPerson = false;
    state.editingPersonId = null;
    return apiCall('GET', '/api/contacts/' + state.contactId + '/contact-people');
  }).then(function(data) {
    state.people = data.contact_people || [];
  }).catch(function(e) {
    toast(e.message || 'שגיאה בשמירת איש קשר', 'error');
  }).finally(function() {
    state.saving = false;
    renderCustomerBillingUI();
  });
}

function bindCustomerBillingUI() {
  var state = currentCustomerBillingState;
  if (!state) return;
  if (state.activeTab === 'profile') bindCustomerBillingProfileForm();
  var addAddress = document.getElementById('customer-address-add');
  if (addAddress) addAddress.onclick = function() { state.creatingAddress = true; state.editingAddressId = null; renderCustomerBillingUI(); };
  document.querySelectorAll('.customer-address-edit').forEach(function(btn) {
    btn.onclick = function() { state.editingAddressId = Number(this.getAttribute('data-address-id')); state.creatingAddress = false; renderCustomerBillingUI(); };
  });
  document.querySelectorAll('.customer-address-cancel').forEach(function(btn) {
    btn.onclick = function() { state.creatingAddress = false; state.editingAddressId = null; renderCustomerBillingUI(); };
  });
  document.querySelectorAll('.customer-address-save').forEach(function(btn) {
    btn.onclick = function() { saveCustomerAddress(this.getAttribute('data-address-id') || null); };
  });
  var addPerson = document.getElementById('customer-person-add');
  if (addPerson) addPerson.onclick = function() { state.creatingPerson = true; state.editingPersonId = null; renderCustomerBillingUI(); };
  document.querySelectorAll('.customer-person-edit').forEach(function(btn) {
    btn.onclick = function() { state.editingPersonId = Number(this.getAttribute('data-person-id')); state.creatingPerson = false; renderCustomerBillingUI(); };
  });
  document.querySelectorAll('.customer-person-cancel').forEach(function(btn) {
    btn.onclick = function() { state.creatingPerson = false; state.editingPersonId = null; renderCustomerBillingUI(); };
  });
  document.querySelectorAll('.customer-person-save').forEach(function(btn) {
    btn.onclick = function() { saveCustomerPerson(this.getAttribute('data-person-id') || null); };
  });
}

function getCustomerFinancialSummaryShell(customerId) {
  return '<div class="customer-financial-panel" id="customer-financial-summary" data-customer-financial-summary data-contact-id="' + customerId + '">' +
    '<div class="customer-financial-header">' +
      '<div><div class="customer-financial-title">סיכום פיננסי</div><div class="customer-financial-subtitle">תצוגה לקריאה בלבד — מחושב ממסמכים קיימים, לידים ואירועים מקושרים.</div></div>' +
      '<span class="badge badge-gray">מחושב ממסמכים קיימים</span>' +
    '</div>' +
    '<div class="customer-financial-content" id="customer-financial-content"><div class="customer-financial-empty">טוען סיכום פיננסי...</div></div>' +
  '</div>';
}

function customerFinancialMoney(value, currency) {
  return (currency || '₪') + fmtMoney(value || 0);
}

function renderCustomerFinancialCard(label, value, note, cls) {
  return '<div class="customer-financial-card ' + (cls || '') + '">' +
    '<div class="customer-financial-label">' + escapeHtml(label) + '</div>' +
    '<div class="customer-financial-value">' + escapeHtml(value) + '</div>' +
    (note ? '<div class="customer-financial-note">' + escapeHtml(note) + '</div>' : '') +
  '</div>';
}

function getFinancialStatusLabel(status) {
  var labels = {
    draft: 'טיוטה',
    sent: 'נשלח',
    issued: 'הונפק',
    paid: 'שולם',
    partially_paid: 'שולם חלקית',
    cancelled: 'בוטל',
    void: 'מבוטל'
  };
  return labels[status] || getSalesDocumentStatusLabel(status);
}

function renderCustomerFinancialDocument(doc) {
  var title = (doc.document_number || ('#' + doc.id)) + ' · ' + getSalesDocumentTypeLabel(doc.document_type);
  var meta = getSalesDocumentStatusLabel(doc.status) + (doc.issue_date ? ' · ' + formatDate(doc.issue_date) : '') + (doc.due_date ? ' · לתשלום עד ' + formatDate(doc.due_date) : '');
  if (doc.lead_name) meta += ' · ' + doc.lead_name;
  return '<div class="customer-financial-row">' +
    '<div><div class="customer-financial-row-main">' + escapeHtml(title) + '</div><div class="customer-financial-row-meta">' + escapeHtml(meta) + '</div></div>' +
    '<div class="customer-financial-row-amount">₪' + fmtMoney(doc.total_amount || 0) + '</div>' +
  '</div>';
}

function renderCustomerFinancialEvent(event) {
  var title = 'אירוע #' + escapeHtml(event.lead_num || event.id || '') + (event.event_type ? ' · ' + escapeHtml(event.event_type) : '');
  var meta = (event.event_date ? formatDate(event.event_date) : 'ללא תאריך') + (event.venue ? ' · ' + event.venue : '') + (event.status ? ' · ' + event.status : '');
  return '<div class="customer-financial-row">' +
    '<div><div class="customer-financial-row-main">' + title + '</div><div class="customer-financial-row-meta">' + escapeHtml(meta) + '</div></div>' +
    '<div class="customer-financial-row-amount">' + (event.price ? '₪' + fmtMoney(event.price) : '—') + '</div>' +
  '</div>';
}

function renderCustomerFinancialSummary(data) {
  var content = document.getElementById('customer-financial-content');
  if (!content) return;
  var summary = data.summary || {};
  var credit = data.credit || { status: 'normal' };
  var breakdown = data.invoice_status_breakdown || {};
  var docs = data.recent_sales_documents || [];
  var events = data.recent_events || [];
  var html = '';

  if (credit.status === 'watch' || credit.status === 'blocked') {
    html += '<div class="customer-financial-warning ' + (credit.status === 'blocked' ? 'blocked' : '') + '">' +
      (credit.status === 'blocked' ? 'סטטוס אשראי חסום בפרופיל החיוב — אזהרה בלבד.' : 'סטטוס אשראי במעקב בפרופיל החיוב — מומלץ לבדוק לפני חיוב נוסף.') +
      (credit.notes ? '<br>' + escapeHtml(credit.notes) : '') +
    '</div>';
  }

  html += '<div class="customer-financial-grid">' +
    renderCustomerFinancialCard('סה״כ הכנסות', customerFinancialMoney(summary.total_revenue), 'מחשבוניות שהונפקו/שולמו') +
    renderCustomerFinancialCard('יתרה פתוחה', customerFinancialMoney(summary.open_balance), 'חשבוניות פתוחות בלבד') +
    renderCustomerFinancialCard('יתרה באיחור', customerFinancialMoney(summary.overdue_balance), 'לפי תאריך לתשלום') +
    renderCustomerFinancialCard('מספר חשבוניות', String(summary.invoice_count || 0), 'כולל טיוטות ופתוחות') +
    renderCustomerFinancialCard('אירועים / עבודות', String(summary.total_events || 0), 'לידים המקושרים ללקוח') +
    renderCustomerFinancialCard('ממוצע חשבונית', customerFinancialMoney(summary.average_invoice_value), 'מחושב מחשבוניות מוכרות') +
  '</div>';

  html += '<div class="customer-financial-section"><div class="customer-financial-section-title">סטטוס חשבוניות</div><div class="customer-financial-status-grid">' +
    ['draft', 'sent', 'issued', 'paid', 'partially_paid', 'cancelled', 'void'].map(function(status) {
      return '<span class="customer-financial-status-chip">' + escapeHtml(getFinancialStatusLabel(status)) + ': ' + escapeHtml(String(breakdown[status] || 0)) + '</span>';
    }).join('') +
  '</div><div class="customer-financial-note">הספירה מחושבת ממסמכי invoice קיימים שמקושרים ישירות ללקוח או דרך ליד/אירוע.</div></div>';

  html += '<div class="customer-financial-section"><div class="customer-financial-section-title">מסמכים אחרונים</div>' +
    (docs.length ? '<div class="customer-financial-list">' + docs.map(renderCustomerFinancialDocument).join('') + '</div>' : '<div class="customer-financial-empty">אין עדיין מסמכי מכירה מקושרים ללקוח הזה.</div>') +
  '</div>';

  html += '<div class="customer-financial-section"><div class="customer-financial-section-title">אירועים / עבודות אחרונות</div>' +
    (events.length ? '<div class="customer-financial-list">' + events.map(renderCustomerFinancialEvent).join('') + '</div>' : '<div class="customer-financial-empty">אין אירועים או עבודות מקושרים ללקוח הזה.</div>') +
  '</div>';

  html += '<div class="customer-financial-note">מגבלות החישוב: עדיין אין טבלת קישור חשבונית↔אירועים ואין הקצאת תשלומים מלאה, לכן זה סיכום קשר לקוח בטוח — לא ספר חשבונות.</div>';
  content.innerHTML = html;
}

function loadCustomerFinancialSummary(customerId) {
  var content = document.getElementById('customer-financial-content');
  if (content) content.innerHTML = '<div class="customer-financial-empty">טוען סיכום פיננסי...</div>';
  apiCall('GET', '/api/contacts/' + customerId + '/financial-summary').then(function(data) {
    renderCustomerFinancialSummary(data || {});
  }).catch(function(err) {
    var target = document.getElementById('customer-financial-content');
    if (target) target.innerHTML = '<div class="customer-financial-empty">שגיאה בטעינת הסיכום הפיננסי: ' + escapeHtml(err.message || 'שגיאה') + '</div>';
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
    html += '<button class="btn btn-secondary btn-sm" id="customer-to-strategic-detail-btn">הוסף לקשרים אסטרטגיים</button>';
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

    html += '<div>';
    html += getCustomerBillingShell(c.id);
    html += getCustomerFinancialSummaryShell(c.id);
    html += '<div class="info-section"><div class="info-section-title">מקור אסטרטגי</div><div id="customer-strategic-source-list"><div class="dash-empty">טוען מקור אסטרטגי...</div></div></div>';

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
    initCustomerBillingUI(c.id);
    loadCustomerFinancialSummary(c.id);
    loadCustomerStrategicSource(c.id);

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
    var strategicDetailBtn = document.getElementById('customer-to-strategic-detail-btn');
    if (strategicDetailBtn) strategicDetailBtn.addEventListener('click', function() {
      openStrategicContactFromCustomer(c);
    });
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

  var newTeamMemberBtn = document.getElementById('btn-new-team-member');
  if (newTeamMemberBtn) newTeamMemberBtn.addEventListener('click', function() {
    openTeamMemberModal();
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
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
    html += '<button class="btn btn-danger btn-sm" id="delete-shopping-list-btn">מחק חנות</button>';
    html += '<button class="btn btn-primary btn-sm" id="add-shopping-item-btn">+ מוצר לרשימה</button>';
    html += '</div>';
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

    var deleteShoppingListBtn = document.getElementById('delete-shopping-list-btn');
    if (deleteShoppingListBtn) {
      deleteShoppingListBtn.onclick = function() {
        if (!confirm('למחוק את החנות וכל רשימת הקניות והעסקאות שלה?')) return;
        apiCall('DELETE', '/api/shopping-lists/' + id).then(function() {
          toast('החנות נמחקה', 'success');
          loadShoppingLists();
        }).catch(function(e) { toast(e.message, 'error'); });
      };
    }

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

