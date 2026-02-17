/**
 * StatusBadge — Decision status indicator for the Govern engine.
 *
 * Extracted from Govern.tsx inline definition.
 */
import { CheckCircle2, Clock, AlertTriangle, type LucideIcon } from 'lucide-react'

export type DecisionStatus = 'Verified' | 'Pending review' | 'Flagged'

export interface StatusBadgeProps {
  status: DecisionStatus
}

const config: Record<DecisionStatus, { color: string; bg: string; icon: LucideIcon }> = {
  Verified: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: CheckCircle2 },
  'Pending review': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: Clock },
  Flagged: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: AlertTriangle },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = config[status]
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {status}
    </span>
  )
}

StatusBadge.displayName = 'StatusBadge'
