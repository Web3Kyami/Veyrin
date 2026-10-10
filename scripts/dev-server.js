const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const routeNames = new Set(['status', 'readiness', 'preflight', 'atlas', 'vex', 'seal', 'verify', 'reveal']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };

function safePath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const resolved = path.resolve(publicRoot, `.${decoded}`);
  return resolved.startsWith(publicRoot + path.sep) ? resolved : null;
}

const server = http.createServer(async (req, res) => {
  const route = (req.url || '').split('?')[0].match(/^\/api\/([a-z-]+)$/);
  if (route && routeNames.has(route[1])) {
    const handler = require(path.join(root, 'api', `${route[1]}.js`));
    req.headers.host ||= `localhost:${process.env.PORT || 3000}`;
    try { await handler(req, res); }
    catch (error) { require('../lib/http').sendFailure(res, error); }
    return;
  }
  let filePath = safePath(req.url || '/');
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(publicRoot, 'index.html');
  res.setHeader('content-type', mime[path.extname(filePath)] || 'application/octet-stream');
  res.setHeader('cache-control', 'no-store');
  fs.createReadStream(filePath).pipe(res);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () => process.stdout.write(`VEYRIN local preview: http://127.0.0.1:${port}\n`));
