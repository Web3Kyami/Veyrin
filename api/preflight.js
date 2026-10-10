const { loadPrePack } = require('../lib/data/load-pre');
const { assertPrePack } = require('../lib/case-validation');
const { requireModelConfiguration } = require('../lib/openrouter');
const { sha256, signToken } = require('../lib/security');
const { sendJson, method, sendFailure } = require('../lib/http');

module.exports = async function preflight(req, res) {
  if (!method(req, res, 'POST')) return;
  try {
    const config = requireModelConfiguration();
    const prePack = await loadPrePack();
    assertPrePack(prePack);
    const preHash = sha256(prePack);
    const preToken = signToken('pre-pack', { prePack, preHash, provider: config.provider, model: config.model, issuedAt: new Date().toISOString() });
    sendJson(res, 200, { preToken });
  } catch (error) { sendFailure(res, error); }
};
