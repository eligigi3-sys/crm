const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-mobile-responsive.js', s, 'utf8');

const css = `
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
`;

if (!s.includes('/* ===== Mobile Responsive ===== */')) {
  s = s.replace('</style>', css + '\n</style>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('mobile responsive css added');