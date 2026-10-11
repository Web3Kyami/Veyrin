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
  'main', 'how-it-works', 'main-navigation', 'case-list', 'evidence-cutoff',
  'evidence-ledger', 'stage-status', 'investigation-view', 'selected-role-duty',
  'user-thesis', 'check-availability', 'run-investigation', 'run-controls',
  'transcript-content', 'stage-actions', 'seal-record', 'seal-panel',
  'seal-digest', 'reveal-outcome', 'reveal-data', 'reveal-symbol',
  'locked-message', 'proof-verify', 'refresh-readiness',
]) {
  assert(ids.includes(id), 'Missing runtime-facing element #' + id);
}
assert.match(js, /if \(path === '\/sample'\) return 'sample'/, 'Missing recorded-study route mapping');
assert.match(js, /function renderCaseSelection\(\)/, 'Missing dynamic supported-case selector');
assert.match(js, /open\.dataset\.route = casePath\(meta\.caseId\)/, 'Case cards must navigate to their own investigation');
assert.equal((js.match(/state\.atlasToken = atlasResult\.atlasToken/g) || []).length, 2, 'ATLAS response must be unwrapped into the signed token in both initial and retry paths');
assert.equal((js.match(/state\.vexToken = vexResult\.vexToken/g) || []).length, 2, 'VEX response must be unwrapped into the signed token in both initial and retry paths');
const roleRequest = js.slice(js.indexOf('async function requestRole'), js.indexOf('function showRunError'));
assert.ok(roleRequest.indexOf('if (!result?.[tokenName]?.payload)') < roleRequest.indexOf("setRole(keys[role], 'COMPLETE'"), 'A role cannot become complete until its signed stage token is captured');
assert.match(js, /if \(!preToken\?\.payload\?\.prePack \|\| !preToken\.payload\.preHash\)/, 'Preflight must capture its signed evidence packet before continuing');
assert.match(js, /const retryRole = state\.preToken \?/, 'Unexpected stage errors must select the next recoverable stage');
assert.match(js, /if \(\$\('#run-error'\)\.hidden\) showRunError\(error\.message/, 'Unexpected stage errors must be visible');
assert.match(js, /if \(!state\.vexToken\) \{[\s\S]{0,250}api\('\/api\/vex'/, 'Retrying a saved VEX result must not spend a second inference');
const investigationState = js.slice(js.indexOf('function renderInvestigationState'), js.indexOf('async function verifyReceipt'));
assert.match(investigationState, /renderSources\(caseMetadata\(\)\?\.sources \|\| \[\]\)/, 'Case route must render that case’s sources before preflight');
assert(html.includes('/chamber/tsla-2026-q2'), 'Tesla record must link to its actual supported case');
const caseCatalogue = fs.readFileSync('public/case-sources.js', 'utf8');
for (const caseId of ['nvda-2026-q2-fy27', 'tsla-2026-q2']) assert(caseCatalogue.includes(caseId), 'Missing public source catalogue for ' + caseId);
assert(vercel.rewrites.some((route) => route.source === '/sample' && route.destination === '/index.html'), 'Missing /sample Vercel direct-load rewrite');
assert(html.includes('Recorded end-to-end investigation'), 'Archived study must be visibly identified as a completed prior run');
assert(html.includes('not a newly verified') || html.includes('not a newly verified browser'), 'Sample must not claim runtime verification');
assert(html.includes('209.63') && html.includes('207.262'), 'Sample must cite documented observations');
assert(html.includes('374.55') && html.includes('364.70'), 'Tesla sample must display its real Bitget observations');
assert(html.includes('4a218ae5705ba3821ee73e2aa5e58d2786b7e204a1f649c57bbcdc28c01ea27d'), 'Tesla sample must show its recorded digest');
assert(html.includes('id="case-question"'), 'Case entry must provide an optional research question');
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

assert(html.includes('id="tesla-walkthrough"'), 'Missing historical research task walkthrough');
assert(html.includes('THE TRADING DESK TAKEAWAY'), 'Missing human research takeaway');
console.log('UI offline structure check passed: routes, elements, recorded-data disclosures and CSS blocks.');
