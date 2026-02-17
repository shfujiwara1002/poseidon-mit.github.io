/**
 * ConfidenceIndicator — Horizontal bar + numeric label for AI confidence scores.
 *
 * Extracted from Grow/Execute/Govern engine pages.
 * The 0.8+ tier uses an optional accentColor to match each engine's branding.
 */

export interface ConfidenceIndicatorProps {
  value: number
  accentColor?: string
}

function getConfidenceColor(c: number, accent?: string): string {
  if (c >= 0.9) return '#10B981'
  if (c >= 0.8) return accent ?? '#8B5CF6'
  if (c >= 0.7) return '#F59E0B'
  return '#EF4444'
}

export function ConfidenceIndicator({ value, accentColor }: ConfidenceIndicatorProps) {
  const color = getConfidenceColor(value, accentColor)
  const pct = value * 100
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  )
}

ConfidenceIndicator.displayName = 'ConfidenceIndicator'
