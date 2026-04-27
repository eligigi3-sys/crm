const fs = require('fs');

const uiPath = 'src/ui.js';
let s = fs.readFileSync(uiPath, 'utf8');

fs.writeFileSync('src/ui.backup-before-split.js', s, 'utf8');

s = s.replace(/`r`n/g, '\n');

s = s.replace(
  /<div class="nav-item" id="nav-customers"[\s\S]*?<\/div>\s*/g,
  ''
);

s = s.replace(
  /document\.getElementById\('btn-new-lead'\)\.addEventListener\('click'[\s\S]*?document\.getElementById\('modal-close-btn'\)\.addEventListener/,
  [
    "document.getElementById('btn-new-lead').addEventListener('click', function() {",
    "  goTo('customers', document.getElementById('nav-leads'));",
    "});",
    "",
    "document.getElementById('btn-new-lead2').addEventListener('click', function() {",
    "  goTo('customers', document.getElementById('nav-leads'));",
    "});",
    "",
    "document.getElementById('modal-close-btn').addEventListener"
  ].join('\n')
);

s = s.replace(
  /document\.getElementById\('nav-leads'\)\.addEventListener\('click', function\(\) \{ goTo\('leads', this\); \}\);/g,
  "document.getElementById('nav-leads').addEventListener('click', function() { goTo('customers', this); });"
);

const start = s.indexOf('return `');
const styleStart = s.indexOf('<style>', start);
const styleEnd = s.indexOf('</style>', styleStart);
const scriptStart = s.indexOf('<script>', styleEnd);
const scriptEnd = s.lastIndexOf('</script>');

if (start === -1 || styleStart === -1 || styleEnd === -1 || scriptStart === -1 || scriptEnd === -1) {
  throw new Error('Could not find HTML/style/script sections');
}

const beforeStyle = s.slice(start + 'return `'.length, styleStart);
const styles = s.slice(styleStart + '<style>'.length, styleEnd);
const middle = s.slice(styleEnd + '</style>'.length, scriptStart);
const clientScript = s.slice(scriptStart + '<script>'.length, scriptEnd);
const afterScript = s.slice(scriptEnd + '</script>'.length);

fs.writeFileSync(
  'src/ui-style.js',
  'export const styles = ' + JSON.stringify(styles) + ';\n',
  'utf8'
);

fs.writeFileSync(
  'src/ui-client.js',
  'export const clientScript = ' + JSON.stringify(clientScript) + ';\n',
  'utf8'
);

const newUi = `import { styles } from './ui-style.js';
import { clientScript } from './ui-client.js';

const beforeStyle = ${JSON.stringify(beforeStyle)};
const middle = ${JSON.stringify(middle)};
const afterScript = ${JSON.stringify(afterScript)};

export function serveHTML() {
  return beforeStyle + '<style>' + styles + '</style>' + middle + '<script>' + clientScript + '</script>' + afterScript;
}
`;

fs.writeFileSync(uiPath, newUi, 'utf8');

console.log('Done');