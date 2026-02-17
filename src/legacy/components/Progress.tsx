import React from 'react';
import { cn } from '@/lib/utils';

type AccentColor = 'teal' | 'cyan' | 'violet' | 'amber' | 'blue' | 'red';

type ProgressProps = {
  value: number;
  accent?: AccentColor;
  className?: string;
};

export const Progress: React.FC<ProgressProps> = ({ value, accent, className }) => {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className={cn('progress', accent && `accent-${accent}`, className)} role="progressbar" aria-valuenow={Math.round(clamped * 100)}>
      <div className="progress-fill" style={{ width: `${clamped * 100}%` }} />
    </div>
  );
};
