const { verifyReceipt } = require('../lib/receipt');
const { sendJson, method, readJson, sendFailure } = require('../lib/http');

module.exports = async function verify(req, res) {
  if (!method(req, res, 'POST')) return;
  try {
    const body = await readJson(req);
    const valid = verifyReceipt(body.sealToken);
    if (!valid) return sendJson(res, 200, { valid: false, message: 'The receipt is missing, altered, expired by key rotation, or has an invalid signature.' });
    sendJson(res, 200, { valid: true, digest: body.sealToken.payload.digest, sealedAt: body.sealToken.payload.sealedAt, message: 'Receipt bytes and server signature verified.' });
  } catch (error) { sendFailure(res, error); }
};
