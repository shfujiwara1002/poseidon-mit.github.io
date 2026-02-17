/**
 * PriorityBadge — Action priority indicator for the Execute engine.
 *
 * Extracted from Execute.tsx inline definition.
 */
import { AlertTriangle, Zap, Layers, type LucideIcon } from 'lucide-react'

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM'

export interface PriorityBadgeProps {
  priority: Priority
}

const config: Record<Priority, { color: string; bg: string; label: string; icon: LucideIcon }> = {
  CRITICAL: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'CRITICAL', icon: AlertTriangle },
  HIGH: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'HIGH', icon: Zap },
  MEDIUM: { color: '#64748B', bg: 'rgba(100,116,139,0.12)', label: 'MEDIUM', icon: Layers },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = config[priority]
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

PriorityBadge.displayName = 'PriorityBadge'
