const { createHash, createHmac, timingSafeEqual } = require('node:crypto');

function canonicalize(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Non-finite values cannot be sealed');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`);
    return `{${entries.join(',')}}`;
  }
  throw new TypeError('Unsupported value in canonical record');
}

function sha256(value) {
  const input = typeof value === 'string' ? value : canonicalize(value);
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function signingKey() {
  // Prefer the existing key to preserve signatures on deployments that still have it.
  // A Google-only Preview can sign the same record format with its server key.
  const providerKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!providerKey) throw Object.assign(new Error('Server-side model configuration is missing.'), { code: 'MODEL_CONFIG_MISSING', statusCode: 503 });
  return createHmac('sha256', 'VEYRIN-RECEIPT-SUBKEY-v1').update(providerKey).digest();
}

function tokenSignature(kind, payload) {
  return createHmac('sha256', signingKey()).update(`${kind}\n${canonicalize(payload)}`).digest('hex');
}

function signToken(kind, payload) {
  return { kind, payload, signature: tokenSignature(kind, payload) };
}

function verifyToken(token, expectedKind) {
  if (!token || token.kind !== expectedKind || !token.payload || typeof token.signature !== 'string') return false;
  let expected;
  try { expected = Buffer.from(tokenSignature(expectedKind, token.payload), 'hex'); }
  catch { return false; }
  const actual = Buffer.from(token.signature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

module.exports = { canonicalize, sha256, signToken, verifyToken };
