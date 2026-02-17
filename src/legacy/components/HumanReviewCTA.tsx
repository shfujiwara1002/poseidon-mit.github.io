import React from 'react';

type CaseType = 'dispute' | 'review' | 'challenge' | 'concern' | 'rights';

interface HumanReviewCTAProps {
  label?: string;
  /** @deprecated Use slaTarget instead */
  sla?: string;
  /** Expected response time, e.g. "4h" */
  slaTarget?: string;
  /** Type of review case — affects routing and SLA defaults */
  caseType?: CaseType;
  /** @deprecated Use onCreate instead */
  onClick?: () => void;
  /** Callback when review is requested */
  onCreate?: () => void;
}

const CASE_TYPE_LABELS: Record<CaseType, string> = {
  dispute: 'Dispute Decision',
  review: 'Request Human Review',
  challenge: 'Challenge Outcome',
  concern: 'Raise Concern',
  rights: 'Exercise Data Rights',
};

const CASE_TYPE_SLA: Record<CaseType, string> = {
  dispute: '4h',
  review: '4h',
  challenge: '24h',
  concern: '48h',
  rights: '72h',
};

/**
 * W-V3-XAI06: HumanReviewCTA
 * Semantic Charter Rule 7: "Human override is always reachable"
 * Must never be hidden (no modal-only placement).
 */
export const HumanReviewCTA: React.FC<HumanReviewCTAProps> = ({
  label,
  sla,
  slaTarget,
  caseType,
  onClick,
  onCreate,
}) => {
  const resolvedLabel = label ?? (caseType ? CASE_TYPE_LABELS[caseType] : 'Request Human Review');
  const resolvedSla = slaTarget ?? sla ?? (caseType ? `SLA: ${CASE_TYPE_SLA[caseType]}` : 'SLA: 4h');
  const handler = onCreate ?? onClick;

  return (
    <button
      type="button"
      onClick={handler}
      data-widget="HumanReviewCTA"
      data-case-type={caseType}
      className="human-review-cta"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      {resolvedLabel}
      <span className="human-review-cta-sla">| {resolvedSla}</span>
    </button>
  );
};
