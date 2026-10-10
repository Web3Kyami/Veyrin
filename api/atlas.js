const { assertPrePack, getSourceIds, assertAtlas, assertVerifiedMarketInstruments } = require('../lib/case-validation');
const { invokeRole } = require('../lib/openrouter');
const { sha256, signToken, verifyToken } = require('../lib/security');
const { sendJson, method, readJson, softRateLimit, sendFailure } = require('../lib/http');
const { roleOutputSchemas } = require('../lib/role-output-schemas');

module.exports = async function atlas(req, res) {
  if (!method(req, res, 'POST') || !softRateLimit(req, res, 'atlas', 5, 60000)) return;
  try {
    const body = await readJson(req);
    if (!verifyToken(body.preToken, 'pre-pack')) throw Object.assign(new Error('The pre-event packet signature is missing or invalid.'), { code: 'PRE_PACKET_SIGNATURE_INVALID', statusCode: 400 });
    const { prePack, preHash, provider, model } = body.preToken.payload;
    assertPrePack(prePack);
    if (sha256(prePack) !== preHash) throw Object.assign(new Error('The pre-event packet changed after it was locked.'), { code: 'PRE_PACKET_HASH_INVALID', statusCode: 400 });
    const userThesis = typeof body.userThesis === 'string' ? body.userThesis.trim() : '';
    if (userThesis.length > 1200) throw Object.assign(new Error('Keep the optional thesis under 1,200 characters.'), { code: 'THESIS_TOO_LONG', statusCode: 400 });
    const result = await invokeRole('ATLAS', { case: prePack, userThesis: { text: userThesis, classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' }, outputSchema: roleOutputSchemas.ATLAS }, req, { provider, model });
    const sourceIds = getSourceIds(prePack);
    const claimIds = assertAtlas(result.output, sourceIds);
    assertVerifiedMarketInstruments(result.output, [prePack.bitgetPre.symbol]);
    const thesisCitations = result.output.thesisCitations;
    if (!Array.isArray(thesisCitations) || thesisCitations.length === 0) throw Object.assign(new Error('ATLAS thesis must cite supplied sources.'), { code: 'ATLAS_THESIS_UNCITED', statusCode: 502 });
    require('../lib/case-validation').assertCitations(thesisCitations, sourceIds);
    const atlasToken = signToken('agent-atlas', {
      preHash,
      userThesis,
      output: result.output,
      provider,
      model,
      promptVersion: result.promptVersion,
      completedAt: new Date().toISOString()
    });
    sendJson(res, 200, { atlasToken, claimCount: claimIds.size });
  } catch (error) { sendFailure(res, error); }
};
