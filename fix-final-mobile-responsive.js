const fs = require('fs');

const p = 'src/ui.js';
let s = fs.readFileSync(p, 'utf8');

fs.writeFileSync('src/ui.backup-before-final-mobile-responsive.js', s, 'utf8');

const css = `
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
`;

if (!s.includes('/* ===== Final Mobile Responsive Fix ===== */')) {
  s = s.replace('</style>', css + '\n</style>');
}

fs.writeFileSync(p, s, 'utf8');

console.log('final mobile responsive css added');