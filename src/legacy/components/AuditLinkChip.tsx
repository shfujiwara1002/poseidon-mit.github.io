import React from 'react';
import { Link } from '../router';

interface AuditLinkChipProps {
  auditId?: string;
  to?: string;
}

/**
 * W-V3-XAI05: AuditLinkChip — clickable chip linking to audit detail
 * Govern Contract Set requirement: Audit IDs must be 1-click reachable
 */
export const AuditLinkChip: React.FC<AuditLinkChipProps> = ({
  auditId = 'GV-2026-0211-4821',
  to = '/govern',
}) => {
  return (
    <Link
      to={to}
      data-widget="AuditLinkChip"
      className="audit-link-chip"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      Audit {auditId}
    </Link>
  );
};
