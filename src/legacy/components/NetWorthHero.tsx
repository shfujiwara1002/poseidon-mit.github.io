import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

export interface NetWorthHeroProps {
  /** Formatted total (e.g., "$847,230") */
  total: string;
  /** Change description (e.g., "+$23,450 (2.8%)") */
  change: string;
  /** Positive or negative trend */
  trend: 'up' | 'down';
  /** Period label (e.g., "this month") */
  period?: string;
  /** Glow accent color */
  glowColor?: string;
  className?: string;
}

export const NetWorthHero: React.FC<NetWorthHeroProps> = ({
  total,
  change,
  trend,
  period = 'this month',
  glowColor = 'var(--engine-grow)',
  className,
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'var(--state-healthy)' : 'var(--state-critical)';
  const trendBg = trend === 'up' ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <div className={cn('relative flex flex-col items-center justify-center overflow-hidden py-6 md:py-8', className)}>
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      <p className="mb-3 text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--muted-2)' }}>
        Total Net Worth
      </p>
      <p className="relative text-4xl font-bold font-mono md:text-5xl" style={{ color: 'var(--text)' }}>
        {total}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full px-3 py-1" style={{ background: trendBg }}>
          <TrendIcon className="h-3.5 w-3.5" style={{ color: trendColor }} />
          <span className="text-sm font-medium" style={{ color: trendColor }}>{change}</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted-2)' }}>{period}</span>
      </div>
    </div>
  );
};

export default NetWorthHero;
