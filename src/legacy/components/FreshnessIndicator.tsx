import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFreshness } from '../hooks/useFreshness';

interface FreshnessIndicatorProps {
  timestamp: Date | null;
  isLive?: boolean;
  className?: string;
}

export function FreshnessIndicator({ timestamp, isLive = false, className }: FreshnessIndicatorProps) {
  const { label, isStale } = useFreshness(timestamp);

  if (isLive) {
    return (
      <span className={cn('freshness-indicator', 'freshness-indicator--live', className)}>
        <motion.span
          className="freshness-indicator-dot"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span>Live</span>
      </span>
    );
  }

  return (
    <span className={cn('freshness-indicator', isStale ? 'freshness-indicator--stale' : 'freshness-indicator--ok', className)}>
      <span className="freshness-indicator-dot" />
      <span>{label}</span>
    </span>
  );
}
