import React from 'react';
import { GovernVerifiedBadge } from './GovernVerifiedBadge';
import { AuditLinkChip } from './AuditLinkChip';
import { HumanReviewCTA } from './HumanReviewCTA';

/**
 * GovernFooter — composes the full Govern Contract Set
 * Semantic Charter Rule 6: "Govern controls are visible on the same screen"
 * Widget Contract 6.2: All AI surfaces must contain GovernVerifiedBadge + AuditLinkChip + HumanReviewCTA
 */
export const GovernFooter: React.FC = () => {
  return (
    <footer className="govern-footer">
      <GovernVerifiedBadge />
      <AuditLinkChip />
      <div className="govern-footer-spacer" />
      <HumanReviewCTA />
    </footer>
  );
};
