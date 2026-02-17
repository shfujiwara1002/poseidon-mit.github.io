/**
 * SeverityBadge — Threat severity indicator for the Protect engine.
 *
 * Extracted from Protect.tsx inline definition.
 */

export type Severity = 'critical' | 'warning' | 'info'

export interface SeverityBadgeProps {
  severity: Severity
}

const config: Record<Severity, { bg: string; border: string; color: string; label: string }> = {
  critical: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', color: '#EF4444', label: 'Critical' },
  warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', color: '#F59E0B', label: 'Warning' },
  info: { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.3)', color: '#38BDF8', label: 'Info' },
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const c = config[severity]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      {c.label}
    </span>
  )
}

SeverityBadge.displayName = 'SeverityBadge'
