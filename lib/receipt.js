const { sha256, verifyToken } = require('./security');

function verifyReceipt(sealToken) {
  if (!verifyToken(sealToken, 'sealed-record')) return false;
  const { record, digest } = sealToken.payload;
  if (!record || record.schemaVersion !== 'veyrin-receipt-v1' || record.caseId !== 'nvda-2026-q2-fy27') return false;
  if (sha256(record) !== digest) return false;
  const expectedPreHash = sha256(record.preEvidence);
  if (record.preHash !== expectedPreHash) return false;
  const roles = record.stages || {};
  return verifyToken(roles.atlas, 'agent-atlas') && verifyToken(roles.vex, 'agent-vex') && verifyToken(roles.seal, 'agent-seal') &&
    roles.atlas.payload.preHash === expectedPreHash && roles.vex.payload.preHash === expectedPreHash && roles.seal.payload.preHash === expectedPreHash;
}

module.exports = { verifyReceipt };
