import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

export interface CategoryScore {
  name: string;
  score: number;
  icon: React.ElementType;
  color?: string;
}

export interface CategoryScoreBarProps {
  categories: CategoryScore[];
  /** Icon circle accent color (default: var(--accent-blue)) */
  iconAccent?: string;
  className?: string;
}

function AnimatedBar({ score, color, delay, reduced }: { score: number; color: string; delay: number; reduced: boolean }) {
  const [visible, setVisible] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reduced]);

  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: visible ? `${score}%` : '0%', backgroundColor: color }}
      />
    </div>
  );
}

export const CategoryScoreBar: React.FC<CategoryScoreBarProps> = ({
  categories,
  iconAccent = 'var(--accent-blue)',
  className,
}) => {
  const prefersReduced = useReducedMotionSafe();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {categories.map((cat, index) => {
        const Icon = cat.icon;
        const barColor = cat.color || 'var(--state-healthy)';
        return (
          <div
            key={cat.name}
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ background: `color-mix(in srgb, ${iconAccent} 15%, transparent)` }}
            >
              <Icon className="h-4 w-4" style={{ color: iconAccent }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{cat.name}</span>
                <span className="font-mono text-sm font-semibold" style={{ color: barColor }}>{cat.score}%</span>
              </div>
              <AnimatedBar score={cat.score} color={barColor} delay={400 + index * 150} reduced={prefersReduced} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryScoreBar;
