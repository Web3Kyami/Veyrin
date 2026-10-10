const fs = require('node:fs');
const path = require('node:path');

const required = [
  'public/index.html',
  'public/styles.css',
  'public/app.js',
  'public/agents/atlas.svg',
  'public/agents/vex.svg',
  'public/agents/seal.svg',
  'api/preflight.js',
  'api/atlas.js',
  'api/vex.js',
  'api/seal.js',
  'api/verify.js',
  'api/reveal.js',
  'lib/openrouter.js',
  'lib/role-output-schemas.js',
  'lib/data/pre-case.js',
  'lib/data/post-outcome.js'
];

for (const file of required) {
  if (!fs.existsSync(path.join(process.cwd(), file))) throw new Error(`Required file is missing: ${file}`);
}

const html = fs.readFileSync('public/index.html', 'utf8');
const app = fs.readFileSync('public/app.js', 'utf8');
if (!/<meta name="viewport" content="width=device-width,initial-scale=1">/.test(html)) throw new Error('Mobile viewport declaration is missing.');
if (!/<title>VEYRIN — Research Chamber<\/title>/.test(html)) throw new Error('The public title must be VEYRIN — Research Chamber.');
if (/CROSSFIRE|(?:OPENROUTER|GEMINI)_API_KEY\s*[:=]|Bearer\s+[A-Za-z0-9_-]{12}/i.test(`${html}\n${app}`)) throw new Error('A reference brand or secret-like value appears in the public bundle.');

const postImport = /post-outcome/;
for (const route of ['readiness', 'preflight', 'atlas', 'vex', 'seal', 'verify']) {
  if (postImport.test(fs.readFileSync(`api/${route}.js`, 'utf8'))) throw new Error(`Post-outcome code leaked into the pre-reveal route: ${route}`);
}
if (!postImport.test(fs.readFileSync('api/reveal.js', 'utf8'))) throw new Error('The reveal route does not load the isolated post-outcome module.');

console.log(`Build checks passed: ${required.length} files, public brand, viewport and pre/post route boundaries.`);
