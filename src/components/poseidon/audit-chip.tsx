/**
 * AuditChip — Clickable audit trail link chip.
 *
 * Uses the .audit-link-chip class from engine-semantics.css.
 */
import { Link } from '@/router'

export interface AuditChipProps {
  auditId: string
  to?: string
}

export function AuditChip({ auditId, to = '/govern' }: AuditChipProps) {
  return (
    <Link to={to} className="audit-link-chip">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      Audit {auditId}
    </Link>
  )
}

AuditChip.displayName = 'AuditChip'
