/**
 * AuroraPulse — Animated gradient background for engine pages.
 *
 * Replaces static radial-gradient backgrounds with a subtle pulsing aurora.
 * Respects prefers-reduced-motion via useReducedMotionSafe.
 */

import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'

export interface AuroraPulseProps {
  color: string
  intensity?: 'subtle' | 'normal' | 'vivid'
}

const opacityMap = {
  subtle: { primary: 0.04, secondary: 0.02 },
  normal: { primary: 0.06, secondary: 0.03 },
  vivid: { primary: 0.1, secondary: 0.05 },
}

export function AuroraPulse({ color, intensity = 'normal' }: AuroraPulseProps) {
  const reducedMotion = useReducedMotionSafe()
  const { primary, secondary } = opacityMap[intensity]

  // Convert hex color to rgba with given opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(70% 50% at 50% 0%, ${hexToRgba(color, primary)}, transparent), radial-gradient(40% 40% at 80% 20%, ${hexToRgba(color, secondary)}, transparent)`,
        animation: reducedMotion ? 'none' : 'aurora-drift 8s ease-in-out infinite alternate',
      }}
    />
  )
}

AuroraPulse.displayName = 'AuroraPulse'
