// Purely offline structural check. Does not import, start or contact research or market services.
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const js = fs.readFileSync('public/app.js', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');
const ui = fs.readFileSync('public/ui.js', 'utf8');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML ids must be unique');

for (const view of ['landing', 'case', 'investigation', 'reveal', 'sample', 'proof']) {
  assert.match(html, new RegExp('data-view="' + view + '"'), 'Missing page view: ' + view);
}
for (const id of [
  'main', 'how-it-works', 'main-navigation', 'enter-investigation', 'case-source-list',
  'evidence-ledger', 'stage-status', 'investigation-view', 'selected-role-duty',
  'user-thesis', 'check-availability', 'run-investigation', 'run-controls',
  'transcript-content', 'stage-actions', 'seal-record', 'seal-panel',
  'seal-digest', 'reveal-outcome', 'reveal-data', 'reveal-symbol',
  'locked-message', 'proof-verify', 'refresh-readiness',
]) {
  assert(ids.includes(id), 'Missing runtime-facing element #' + id);
}
assert.match(js, /if \(path === '\/sample'\) return 'sample'/, 'Missing recorded-study route mapping');
assert(vercel.rewrites.some((route) => route.source === '/sample' && route.destination === '/index.html'), 'Missing /sample Vercel direct-load rewrite');
assert(html.includes('Previously') || html.includes('previously'), 'Archived data must be identified as previously documented');
assert(html.includes('not a newly verified') || html.includes('not a newly verified browser'), 'Sample must not claim runtime verification');
assert(html.includes('209.63') && html.includes('207.262'), 'Sample must cite documented observations');
assert(html.includes('−1.1296%'), 'Sample must use the documented change');
assert(!html.includes('THREE MINDS.') && !html.includes('STAGE PREVIEW / 01'), 'Broadcast marketing remnants found');
assert(css.includes('color-scheme:light') && css.includes('--canvas:#fff'), 'Light design tokens missing');
assert(html.includes('/assets/agents/atlas-small.webp'), 'Original portrait thumbnails missing');

assert(html.includes('Research.<br>Challenged.'), 'New reference-based hero missing');
for (const role of ['atlas', 'vex', 'seal']) {
  assert(html.includes('/assets/agents/' + role + '.webp'), 'Hero portrait missing: ' + role);
}
assert(!html.slice(html.indexOf('class="hero page-width"'), html.indexOf('class="compare-section')).includes('eyebrow'), 'Hero must not contain an eyebrow');
assert(js.includes("$$('.workspace-steps > div')"), 'Workflow must iterate all stage elements');
assert(!/fetch\s*\(/.test(ui), 'Motion enhancement must not make network requests');
assert(ui.includes('prefers-reduced-motion'), 'Motion must respect reduced motion');

const styles = css.replace(/\/\*[\s\S]*?\*\//g, '');
let depth = 0;
for (const char of styles) {
  if (char === '{') depth += 1;
  if (char === '}') depth -= 1;
  assert(depth >= 0, 'CSS brace closed without opening');
}
assert.equal(depth, 0, 'Unclosed CSS brace');

console.log('UI offline structure check passed: routes, elements, recorded-data disclosures and CSS blocks.');
