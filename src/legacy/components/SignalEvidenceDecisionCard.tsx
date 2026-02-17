import React, { useMemo } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import type { MissionTone } from './MissionStatusChip';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';

export interface SignalModel {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestampLabel: string;
  amountLabel: string;
  merchantLabel: string;
  locationLabel?: string;
  icon: React.ReactNode;
}

export interface EvidenceFactor {
  feature: string;
  shapValue: number;
  impact: 'increases' | 'decreases';
  explanation: string;
}

export interface EvidenceModel {
  summary: string;
  confidenceLabel: string;
  sourceLabel: string;
  falsePositiveRateLabel?: string;
  factors: EvidenceFactor[];
}

export interface DecisionModel {
  status: 'pending' | 'approved' | 'blocked' | 'reviewed';
  onPrimary?: () => void;
  onSecondary?: () => void;
  onTertiary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryLabel?: string;
}

export interface SignalEvidenceDecisionCardProps {
  signal: SignalModel;
  evidence: EvidenceModel;
  decision: DecisionModel;
  expanded?: boolean;
  onToggleExpanded?: (next: boolean) => void;
  summaryMaxLinesDesktop?: number;
  summaryMaxLinesMobile?: number;
  detailsDefault?: 'collapsed' | 'expanded';
}

const severityTone: Record<SignalModel['severity'], MissionTone> = {
  critical: 'critical',
  high: 'warning',
  medium: 'primary',
  low: 'healthy',
};

export function SignalEvidenceDecisionCard({
  signal,
  evidence,
  decision,
  expanded,
  onToggleExpanded,
  summaryMaxLinesDesktop = 3,
  summaryMaxLinesMobile = 2,
  detailsDefault = 'collapsed',
}: SignalEvidenceDecisionCardProps) {
  const resolvedExpanded = expanded ?? (detailsDefault === 'expanded');
  const tone = severityTone[signal.severity];

  const statusLabel = useMemo(() => {
    if (decision.status === 'approved') return 'Approved';
    if (decision.status === 'blocked') return 'Blocked';
    if (decision.status === 'reviewed') return 'Sent to review';
    return 'Pending decision';
  }, [decision.status]);

  return (
    <Card
      variant="alert"
      tone={tone}
      data-card-archetype="signal-evidence-decision"
      data-density-details-default={detailsDefault}
      data-density-lines-desktop={summaryMaxLinesDesktop}
      data-density-lines-mobile={summaryMaxLinesMobile}
      data-severity={signal.severity}
    >
      <section className="signal-evidence-card-header" aria-label="Signal header">
        <div className="signal-evidence-card-icon">{signal.icon}</div>
        <div className="signal-evidence-card-title">
          <strong>{signal.title}</strong>
          <span>{signal.timestampLabel}</span>
        </div>
        <MissionStatusChip tone={tone} label={statusLabel} />
      </section>

      <section className="signal-evidence-card-summary">
        <p className="signal-evidence-card-amount">{signal.amountLabel}</p>
        <p className="signal-evidence-card-merchant">{signal.merchantLabel}</p>
        {signal.locationLabel ? <p className="signal-evidence-card-location">{signal.locationLabel}</p> : null}
      </section>

      <MissionEvidencePanel
        title="AI analysis"
        summary={evidence.summary}
        meta={`${evidence.confidenceLabel} | ${evidence.sourceLabel}`}
        tone={tone}
      />

      {resolvedExpanded ? (
        <section className="signal-evidence-card-factors">
          <strong>Top decision factors</strong>
          <ul>
            {evidence.factors.map((feature) => (
              <li key={`${feature.feature}-${feature.shapValue}`}>
                <span>{feature.feature}</span>
                <em>{feature.shapValue > 0 ? '+' : ''}{feature.shapValue.toFixed(2)}</em>
                <small>{feature.explanation}</small>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="signal-evidence-card-meta">
        <button
          type="button"
          className="entry-link-minor"
          onClick={() => onToggleExpanded?.(!resolvedExpanded)}
        >
          {resolvedExpanded ? 'Hide factors ▲' : 'Show factors ▼'}
        </button>
        {evidence.falsePositiveRateLabel ? <span>{evidence.falsePositiveRateLabel}</span> : null}
      </div>

      <section className="signal-evidence-card-footer" aria-label="Decision footer">
        {decision.status === 'pending' ? (
          <div className="mission-dual-actions">
            <Button variant="ghost" onClick={decision.onSecondary}>
              {decision.secondaryLabel ?? 'Approve'}
            </Button>
            <Button variant="primary" onClick={decision.onPrimary}>
              {decision.primaryLabel ?? 'Block'}
            </Button>
            {decision.tertiaryLabel ? (
              <Button variant="soft" onClick={decision.onTertiary}>
                {decision.tertiaryLabel}
              </Button>
            ) : null}
          </div>
        ) : (
          <MissionStatusChip tone={tone} label={statusLabel} />
        )}
      </section>
    </Card>
  );
}

