const { assertPrePack, getSourceIds, assertAtlas, assertVex, assertCitations, assertVerifiedMarketInstruments } = require('../lib/case-validation');
const { invokeRole } = require('../lib/openrouter');
const { sha256, signToken, verifyToken } = require('../lib/security');
const { sendJson, method, readJson, softRateLimit, sendFailure } = require('../lib/http');
const { roleOutputSchemas } = require('../lib/role-output-schemas');

module.exports = async function vex(req, res) {
  if (!method(req, res, 'POST') || !softRateLimit(req, res, 'vex', 5, 60000)) return;
  try {
    const body = await readJson(req);
    if (!verifyToken(body.preToken, 'pre-pack') || !verifyToken(body.atlasToken, 'agent-atlas')) throw Object.assign(new Error('ATLAS or pre-packet signature is missing or invalid.'), { code: 'UPSTREAM_STAGE_SIGNATURE_INVALID', statusCode: 400 });
    const { prePack, preHash, provider, model } = body.preToken.payload;
    const atlas = body.atlasToken.payload;
    assertPrePack(prePack);
    if (sha256(prePack) !== preHash || atlas.preHash !== preHash || atlas.provider !== provider || atlas.model !== model) throw Object.assign(new Error('The agent stages do not share the same locked pre-event packet and model configuration.'), { code: 'PRE_PACKET_HASH_MISMATCH', statusCode: 400 });
    if (typeof atlas.userThesis !== 'string') throw Object.assign(new Error('The ATLAS thesis context is invalid.'), { code: 'UPSTREAM_STAGE_INVALID', statusCode: 400 });
    const sourceIds = getSourceIds(prePack);
    const claimIds = assertAtlas(atlas.output, sourceIds);
    assertCitations(atlas.output.thesisCitations, sourceIds);
    assertVerifiedMarketInstruments(atlas.output, [prePack.bitgetPre.symbol]);
    const result = await invokeRole('VEX', {
      case: prePack,
      userThesis: { text: atlas.userThesis, classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
      atlas: atlas.output,
      outputSchema: roleOutputSchemas.VEX
    }, req, { provider, model });
    assertVex(result.output, sourceIds, claimIds);
    assertVerifiedMarketInstruments(result.output, [prePack.bitgetPre.symbol]);
    const vexToken = signToken('agent-vex', {
      preHash,
      userThesis: atlas.userThesis,
      output: result.output,
      provider,
      model,
      promptVersion: result.promptVersion,
      completedAt: new Date().toISOString()
    });
    sendJson(res, 200, { vexToken, challengeCount: result.output.challenges.length });
  } catch (error) { sendFailure(res, error); }
};
