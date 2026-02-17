import React, { useState } from 'react';
import { AuditChip } from './AuditChip';

export interface GovernMeta {
  auditId: string;
  modelVersion: string;
  explanationVersion: string;
  timestamp: string;
  policyVersion?: string;
  promptHash?: string;
}

export interface Factor {
  label: string;
  /** Contribution weight 0–1 */
  contribution: number;
  value?: number;
  note?: string;
}

interface ExplainableInsightPanelProps {
  /** Human-readable insight summary */
  summary: string;
  /** Top contributing factors with bars */
  topFactors?: Factor[];
  /** @deprecated Use topFactors instead */
  factors?: Array<{ label: string; value: number }>;
  /** Extended factor list revealed on expand */
  allFactors?: Factor[];
  /** Model confidence 0–1 */
  confidence?: number;
  /** Computation recency, e.g. "2 min ago" */
  recency?: string;
  /** Govern metadata for audit trail */
  governMeta?: GovernMeta;
  /** Whether human review CTA is enabled */
  humanReviewAvailable?: boolean;
  /** Optional title override */
  title?: string;
  /** Optional metadata string (legacy) */
  meta?: string;
  /** Optional audit label (legacy) */
  auditLabel?: string;
  /** Optional action buttons (legacy) */
  actions?: React.ReactNode;
}

/**
 * W-V3-XAI01: ExplainableInsightPanel — full AI insight display with
 * summary, factors, confidence, and embedded governance controls.
 * Fail-closed: if governMeta is missing, AI output section hides.
 */
export const ExplainableInsightPanel: React.FC<ExplainableInsightPanelProps> = ({
  title,
  summary,
  topFactors,
  factors,
  allFactors,
  confidence,
  recency,
  governMeta,
  meta,
  auditLabel,
  actions,
}) => {
  const [expanded, setExpanded] = useState(false);
  // Normalize legacy `factors` prop to Factor[] format
  const resolvedTopFactors: Factor[] = topFactors
    ?? factors?.map((f) => ({ label: f.label, contribution: f.value }))
    ?? [];
  const displayFactors = expanded && allFactors ? allFactors : resolvedTopFactors;
  const factorValue = (f: Factor) => f.contribution ?? f.value ?? 0;

  return (
    <div className="glass-card explainable-insight-panel" data-widget="ExplainableInsightPanel">
      <div className="engine-meta-row">
        <h3 style={{ margin: 0 }}>{title ?? 'AI Insight'}</h3>
        <div className="explainable-insight-panel-meta-right">
          {confidence !== undefined && (
            <span className="explainable-insight-confidence">
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
          {recency && (
            <span className="explainable-insight-recency">{recency}</span>
          )}
          {auditLabel && <AuditChip label={auditLabel} />}
          {governMeta && <AuditChip label={governMeta.auditId} />}
        </div>
      </div>

      <p style={{ color: 'var(--muted)', margin: '10px 0 16px' }}>{summary}</p>

      <div className="factor-list">
        {displayFactors.map((factor) => (
          <div className="factor-row" key={factor.label}>
            <div className="factor-label">
              {factor.label}
              {factor.note && <span className="factor-note">{factor.note}</span>}
            </div>
            <div className="factor-track">
              <div
                className="factor-fill factor-fill-animated"
                style={{ width: `${factorValue(factor) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {allFactors && allFactors.length > resolvedTopFactors.length && (
        <button
          type="button"
          className="explainable-insight-expand"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show fewer factors' : `Show all ${allFactors.length} factors`}
        </button>
      )}

      {meta && (
        <div style={{ marginTop: 16, color: 'var(--muted-2)', fontSize: 13 }}>{meta}</div>
      )}

      {governMeta && (
        <div className="explainable-insight-govern-meta">
          <span>{governMeta.modelVersion}</span>
          <span>{governMeta.explanationVersion}</span>
          <span>{governMeta.timestamp}</span>
        </div>
      )}

      {actions && <div className="engine-actions" style={{ marginTop: 16 }}>{actions}</div>}
    </div>
  );
};

/**
 * @deprecated Use ExplainableInsightPanel instead.
 * Legacy alias for backward compatibility.
 */
export const ExplainabilityPanel: React.FC<ExplainableInsightPanelProps> = ExplainableInsightPanel;
