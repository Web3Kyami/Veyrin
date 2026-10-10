const { assertPrePack, getSourceIds, assertAtlas, assertVex, assertSealDraft, assertCitations, assertVerifiedMarketInstruments } = require('../lib/case-validation');
const { invokeRole } = require('../lib/openrouter');
const { canonicalize, sha256, signToken, verifyToken } = require('../lib/security');
const { sendJson, method, readJson, softRateLimit, sendFailure } = require('../lib/http');
const { roleOutputSchemas } = require('../lib/role-output-schemas');

module.exports = async function seal(req, res) {
  if (!method(req, res, 'POST') || !softRateLimit(req, res, 'seal', 5, 60000)) return;
  try {
    const body = await readJson(req);
    if (!verifyToken(body.preToken, 'pre-pack') || !verifyToken(body.atlasToken, 'agent-atlas') || !verifyToken(body.vexToken, 'agent-vex')) {
      throw Object.assign(new Error('A signed pre-packet or agent stage is missing or invalid.'), { code: 'UPSTREAM_STAGE_SIGNATURE_INVALID', statusCode: 400 });
    }
    const { prePack, preHash, provider, model } = body.preToken.payload;
    const atlas = body.atlasToken.payload;
    const vex = body.vexToken.payload;
    assertPrePack(prePack);
    if (sha256(prePack) !== preHash || atlas.preHash !== preHash || vex.preHash !== preHash || atlas.userThesis !== vex.userThesis || atlas.provider !== provider || vex.provider !== provider || atlas.model !== model || vex.model !== model) {
      throw Object.assign(new Error('The staged work does not match one locked pre-event packet.'), { code: 'PRE_PACKET_HASH_MISMATCH', statusCode: 400 });
    }
    const sourceIds = getSourceIds(prePack);
    const claimIds = assertAtlas(atlas.output, sourceIds);
    assertCitations(atlas.output.thesisCitations, sourceIds);
    assertVex(vex.output, sourceIds, claimIds);
    assertVerifiedMarketInstruments(atlas.output, [prePack.bitgetPre.symbol]);
    assertVerifiedMarketInstruments(vex.output, [prePack.bitgetPre.symbol]);
    const result = await invokeRole('SEAL', {
      case: prePack,
      userThesis: { text: atlas.userThesis, classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
      atlas: atlas.output,
      vex: vex.output,
      outputSchema: roleOutputSchemas.SEAL
    }, req, { provider, model });
    assertSealDraft(result.output, sourceIds, claimIds);
    assertVerifiedMarketInstruments(result.output, [prePack.bitgetPre.symbol]);
    const sealAgentToken = signToken('agent-seal', {
      preHash,
      userThesis: atlas.userThesis,
      output: result.output,
      provider,
      model,
      promptVersion: result.promptVersion,
      completedAt: new Date().toISOString()
    });
    const checkedAt = new Date().toISOString();
    const record = {
      schemaVersion: 'veyrin-receipt-v1',
      caseId: prePack.caseId,
      cutoffAt: prePack.cutoffAt,
      preHash,
      userThesis: { text: atlas.userThesis, classification: 'USER_HYPOTHESIS_NOT_EVIDENCE' },
      preEvidence: prePack,
      stages: { atlas: body.atlasToken, vex: body.vexToken, seal: sealAgentToken },
      deterministicCheck: {
        citationsAllowed: true,
        allSourceTimesEligible: true,
        bitgetInstrumentVerified: true,
        bitgetPreCandleEndsAtCutoff: prePack.bitgetPre.endAt === prePack.cutoffAt,
        claimCount: claimIds.size,
        preSourceCount: prePack.sources.length,
        checkedAt
      },
      model: { provider, id: model, promptVersion: result.promptVersion },
      historicalLimitation: 'A historical reconstruction cannot prove the model or builder lacked outcome knowledge. The model received only the supplied pre-cutoff packet.'
    };
    const digest = sha256(canonicalize(record));
    const sealedAt = new Date().toISOString();
    const sealToken = signToken('sealed-record', { record, digest, sealedAt });
    sendJson(res, 200, { sealToken, digest, sealedAt });
  } catch (error) { sendFailure(res, error); }
};
