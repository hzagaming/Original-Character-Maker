const fs = require('fs');
const file = 'src/docsContent/en.ts';
let content = fs.readFileSync(file, 'utf8');

function esc(s) { return s.replace(/'/g, "\\'"); }

function makeEntry({ code, message, severity, category, location, cause, solution, steps, relatedCodes, prevention }) {
  const stepsStr = steps ? `\n          steps: [\n            ${steps.map(s => `'${esc(s)}'`).join(',\n            ')}\n          ],` : '';
  const relatedStr = relatedCodes && relatedCodes.length ? `\n          relatedCodes: [${relatedCodes.map(c => `'${c}'`).join(', ')}],` : '';
  const preventionStr = prevention ? `\n          prevention: '${esc(prevention)}',` : '';
  return `        {\n          code: '${code}',\n          message: '${esc(message)}',\n          severity: '${severity}',\n          category: '${esc(category)}',\n          location: '${esc(location)}',\n          cause: '${esc(cause)}',\n          solution: '${esc(solution)}',${stepsStr}${relatedStr}${preventionStr}\n        },`;
}

function insertBeforeCategoryEnd(catId, newEntries) {
  const catStartRegex = new RegExp(`id: '${catId}',`);
  const catStartMatch = content.match(catStartRegex);
  if (!catStartMatch) { console.error('Category', catId, 'start not found'); return false; }
  const errorsStartIdx = content.indexOf('errors: [', catStartMatch.index);
  if (errorsStartIdx === -1) { console.error('Category', catId, 'errors array not found'); return false; }
  let depth = 1;
  let inString = false;
  let stringChar = null;
  let escape = false;
  for (let i = errorsStartIdx + 'errors: ['.length; i < content.length; i++) {
    const ch = content[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (!inString && (ch === "'" || ch === '"' || ch === '`')) {
      inString = true; stringChar = ch;
    } else if (inString && ch === stringChar) {
      inString = false; stringChar = null;
    } else if (!inString) {
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) {
          content = content.slice(0, i) + '\n' + newEntries + content.slice(i);
          return true;
        }
      }
    }
  }
  console.error('Category', catId, 'could not find end of errors array');
  return false;
}

const eExtra = [
  { code: 'WORKFLOW_STEP_TIMEOUT', message: 'Individual workflow step timed out', severity: 'error', category: 'E. Workflow & Conversion', location: 'Page: Paper2Gal', cause: 'A single workflow step exceeded its allocated execution time.', solution: 'Increase per-step timeout or optimize the step.', steps: ['Identify the slow step from logs', 'Simplify input or reduce resolution', 'Increase step timeout in settings', 'Retry the step individually'], relatedCodes: ['WORKFLOW_TIMEOUT', 'WORKFLOW_STEP_FAILED'], prevention: 'Set generous per-step timeouts; optimize heavy operations.' }
];

const fExtra = [
  { code: 'SECURITY_POLICY_VIOLATION', message: 'Content Security Policy blocked resource', severity: 'error', category: 'F. System & Permissions', location: 'Global / All pages', cause: 'A script, style, or other resource was blocked by the Content-Security-Policy header.', solution: 'Update CSP headers or load resources from allowed origins.', steps: ['Check browser console for CSP violation details', 'Add resource origin to CSP allowlist', 'Use nonce or hash for inline scripts', 'Retry after updating headers'], relatedCodes: ['CORS_POLICY_BLOCKED'], prevention: 'Define accurate CSP headers during deployment.' }
];

if (insertBeforeCategoryEnd('E', eExtra.map(makeEntry).join('\n'))) {
  console.log('Added 1 entry to category E');
} else {
  process.exit(1);
}

if (insertBeforeCategoryEnd('F', fExtra.map(makeEntry).join('\n'))) {
  console.log('Added 1 entry to category F');
} else {
  process.exit(1);
}

fs.writeFileSync(file, content);
console.log('Done!');
