import React, { memo } from 'react';

type AccentColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';
type StatSize = 'sm' | 'md' | 'lg';

interface StatCardProps {
  label: string;
  value: string;
  meta?: string;
  definition?: string;
  icon?: React.ReactNode;
  sparkline?: React.ReactNode;
  accent?: AccentColor;
  size?: StatSize;
}

const accentVar: Record<AccentColor, string> = {
  cyan: 'var(--accent-cyan)',
  teal: 'var(--accent-teal)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

export const StatCard = memo<StatCardProps>(({ label, value, meta, definition, icon, sparkline, accent, size = 'md' }) => {
  return (
    <div className={`stat-card stat-card--${size}`}>
      {/* Sparkline positioned at top-right corner */}
      {sparkline && (
        <div className="stat-sparkline">
          {sparkline}
        </div>
      )}
      {icon && (
        <div className="signal-icon" style={accent ? { color: accentVar[accent] } : undefined}>
          {icon}
        </div>
      )}
      <div className="stat-value" style={accent ? { color: accentVar[accent] } : undefined}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {meta && <div className="stat-meta">{meta}</div>}
      {definition && <div className="stat-definition">{definition}</div>}
    </div>
  );
});

StatCard.displayName = 'StatCard';
