import React, { type CSSProperties } from 'react';

type SourceType = 'model' | 'audit' | 'regulation' | 'observed' | 'system' | 'policy' | 'human';

interface ProofLineProps {
  claim: string;
  evidence: string;
  source?: string;
  accent?: string;
  /** Measurement basis, e.g. "rolling 90d" */
  basis?: string;
  /** Evidence provenance classification */
  sourceType?: SourceType;
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  model: 'Model',
  audit: 'Audit',
  regulation: 'Regulation',
  observed: 'Observed',
  system: 'System',
  policy: 'Policy',
  human: 'Human',
};

/**
 * W-V3-EVD01: ProofLine — pairs a claim with its evidence, forming the atomic trust unit.
 * Semantic Charter: Evidence adjacency — every claim must show its supporting evidence.
 */
export const ProofLine: React.FC<ProofLineProps> = ({
  claim,
  evidence,
  source,
  accent = '#00F0FF',
  basis,
  sourceType,
}) => {
  return (
    <div
      className="proof-line"
      data-widget="ProofLine"
      style={{ ['--proof-accent' as string]: accent } as CSSProperties}
    >
      <span className="proof-line-claim">{claim}</span>
      <span className="proof-line-sep">—</span>
      <span className="proof-line-evidence">{evidence}</span>
      {basis && <span className="proof-line-basis">{basis}</span>}
      {source && <span className="proof-line-source">| {source}</span>}
      {sourceType && (
        <span className="proof-line-source-type" data-source-type={sourceType}>
          {SOURCE_TYPE_LABELS[sourceType]}
        </span>
      )}
    </div>
  );
};
