const rates = new Map();

function sendJson(res, statusCode, value) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
  res.end(JSON.stringify(value));
}

function method(req, res, allowed) {
  if (req.method === allowed) return true;
  res.setHeader('allow', allowed);
  sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED', message: `Use ${allowed}.` });
  return false;
}

async function readJson(req, maxBytes = 60000) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > maxBytes) throw Object.assign(new Error('Request is too large.'), { code: 'REQUEST_TOO_LARGE', statusCode: 413 });
    return JSON.parse(req.body || '{}');
  }
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > maxBytes) throw Object.assign(new Error('Request is too large.'), { code: 'REQUEST_TOO_LARGE', statusCode: 413 });
  }
  return JSON.parse(body || '{}');
}

function softRateLimit(req, res, bucket, max = 8, durationMs = 60000) {
  // Best-effort per warm function instance. Vercel can run parallel instances;
  // this limits accidental repeated calls but is not a durable abuse barrier.
  const now = Date.now();
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown';
  const key = `${bucket}:${ip}`;
  const record = rates.get(key);
  if (!record || now - record.start >= durationMs) {
    rates.set(key, { start: now, count: 1 });
    return true;
  }
  if (record.count >= max) {
    sendJson(res, 429, { error: 'RATE_LIMITED', message: 'Too many requests in this short window. Retry shortly.' });
    return false;
  }
  record.count += 1;
  return true;
}

function sendFailure(res, error) {
  const status = Number.isInteger(error && error.statusCode) ? error.statusCode : 500;
  const code = error && typeof error.code === 'string' ? error.code : 'INTERNAL_ERROR';
  const message = status >= 500 && code === 'INTERNAL_ERROR' ? 'The request could not be completed. No result was recorded.' : (error.message || 'The request could not be completed.');
  sendJson(res, status, { error: code, message });
}

module.exports = { sendJson, method, readJson, softRateLimit, sendFailure };
