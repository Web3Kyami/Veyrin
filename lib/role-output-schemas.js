const citation = {
  type: 'object',
  additionalProperties: false,
  required: ['sourceId'],
  properties: {
    sourceId: { type: 'string' },
    relevantQuote: { type: 'string', maxLength: 280 }
  }
};

const claimIds = ['C1', 'C2', 'C3', 'C4', 'C5'];

const schemas = {
  ATLAS: {
    type: 'object',
    additionalProperties: false,
    required: ['stance', 'thesis', 'thesisCitations', 'claims', 'unknowns', 'falsifiers', 'watchItems'],
    properties: {
      stance: { type: 'string', enum: ['BULLISH', 'BEARISH', 'MIXED', 'INSUFFICIENT'] },
      thesis: { type: 'string', maxLength: 900 },
      thesisCitations: { type: 'array', minItems: 1, maxItems: 8, items: citation },
      claims: {
        type: 'array', minItems: 3, maxItems: 5,
        items: {
          type: 'object', additionalProperties: false,
          required: ['id', 'statement', 'citations', 'strength', 'caveat'],
          properties: {
            id: { type: 'string', enum: claimIds },
            statement: { type: 'string', maxLength: 500 },
            citations: { type: 'array', minItems: 1, maxItems: 8, items: citation },
            strength: { type: 'string', enum: ['HIGH', 'MED', 'LOW'] },
            caveat: { type: 'string', maxLength: 400 }
          }
        }
      },
      unknowns: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 240 } },
      falsifiers: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 240 } },
      watchItems: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 240 } }
    }
  },
  VEX: {
    type: 'object',
    additionalProperties: false,
    required: ['challenges', 'concededClaimIds', 'missingEvidence', 'alternateHypotheses'],
    properties: {
      challenges: {
        type: 'array', maxItems: 5,
        items: {
          type: 'object', additionalProperties: false,
          required: ['targetClaimId', 'critique', 'citations', 'severity'],
          properties: {
            targetClaimId: { type: 'string', enum: claimIds },
            critique: { type: 'string', maxLength: 600 },
            citations: { type: 'array', minItems: 1, maxItems: 8, items: citation },
            severity: { type: 'string', enum: ['CRITICAL', 'MATERIAL', 'MINOR'] }
          }
        }
      },
      concededClaimIds: { type: 'array', maxItems: 5, items: { type: 'string', enum: claimIds } },
      missingEvidence: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 240 } },
      alternateHypotheses: { type: 'array', maxItems: 6, items: { type: 'string', maxLength: 300 } }
    }
  },
  SEAL: {
    type: 'object',
    additionalProperties: false,
    required: ['dispositions', 'executiveFinding', 'missedRisk', 'forwardChecklist'],
    properties: {
      dispositions: {
        type: 'array', minItems: 3, maxItems: 5,
        items: {
          type: 'object', additionalProperties: false,
          required: ['claimId', 'status', 'rationale', 'citations'],
          properties: {
            claimId: { type: 'string', enum: claimIds },
            status: { type: 'string', enum: ['SUPPORTED', 'CONTESTED', 'UNRESOLVED', 'EXCLUDED'] },
            rationale: { type: 'string', maxLength: 500 },
            citations: { type: 'array', minItems: 1, maxItems: 8, items: citation }
          }
        }
      },
      executiveFinding: { type: 'string', maxLength: 900 },
      missedRisk: { type: 'string', maxLength: 900 },
      forwardChecklist: { type: 'array', maxItems: 8, items: { type: 'string', maxLength: 240 } }
    }
  }
};

module.exports = { roleOutputSchemas: schemas };
