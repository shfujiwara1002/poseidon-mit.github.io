import React, { type ErrorInfo, type ReactNode } from 'react';
import { GovernVerifiedBadge } from './GovernVerifiedBadge';
import { AuditLinkChip } from './AuditLinkChip';
import { HumanReviewCTA } from './HumanReviewCTA';
import type { GovernContractSetProps } from '../contracts/domain-models';

/**
 * GovernContractSet — fail-closed governance wrapper
 * Semantic Charter Rule 6: "Govern controls are visible on the same screen"
 * Widget Contract 6.2: All AI surfaces must contain GovernVerifiedBadge + AuditLinkChip + HumanReviewCTA
 *
 * If any required prop is missing or a child fails to render, the component
 * enters fail-closed mode: hides AI output and shows a governance fallback.
 */

interface GovernContractSetState {
  hasError: boolean;
}

class GovernErrorBoundary extends React.Component<{ children: ReactNode; fallback: ReactNode }, GovernContractSetState> {
  state: GovernContractSetState = { hasError: false };

  static getDerivedStateFromError(): GovernContractSetState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[GovernContractSet] Fail-closed triggered:', error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const GovernFallback: React.FC = () => (
  <div
    className="govern-contract-set govern-contract-set--fallback"
    role="alert"
    data-widget="GovernContractSet"
    data-slot="govern_controls"
  >
    <div className="govern-fallback-message">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>Governance data unavailable — AI output hidden for safety.</span>
    </div>
  </div>
);

export const GovernContractSet: React.FC<GovernContractSetProps> = ({
  auditId,
  modelVersion,
  explanationVersion,
  onRequestReview,
}) => {
  if (!auditId || !modelVersion) {
    return <GovernFallback />;
  }

  return (
    <GovernErrorBoundary fallback={<GovernFallback />}>
      <footer
        className="govern-contract-set"
        data-widget="GovernContractSet"
        data-slot="govern_controls"
      >
        <GovernVerifiedBadge auditId={auditId} modelVersion={modelVersion} explanationVersion={explanationVersion} />
        <AuditLinkChip auditId={auditId} to="/govern/audit-detail" />
        <div className="govern-contract-set-spacer" />
        <HumanReviewCTA onClick={onRequestReview} />
      </footer>
    </GovernErrorBoundary>
  );
};
