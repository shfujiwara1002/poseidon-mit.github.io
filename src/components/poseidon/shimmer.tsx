/**
 * Shimmer — Skeleton loading placeholder with configurable dimensions.
 */
import { cn } from '@/lib/utils'

export interface ShimmerProps {
  width?: string | number
  height?: string | number
  className?: string
}

export function Shimmer({ width, height = 16, className }: ShimmerProps) {
  return (
    <div
      className={cn('shimmer', className)}
      style={{ width: width ?? '100%', height }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

Shimmer.displayName = 'Shimmer'
