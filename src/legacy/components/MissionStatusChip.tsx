import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type MissionTone = 'primary' | 'healthy' | 'warning' | 'critical' | 'neutral';

const chipCva = cva('dashboard-action-badge mission-badge', {
  variants: {
    tone: {
      primary: 'mission-badge--primary',
      healthy: 'mission-badge--healthy',
      warning: 'mission-badge--warning',
      critical: 'mission-badge--critical',
      neutral: 'mission-badge--neutral',
    },
  },
  defaultVariants: { tone: 'primary' },
});

interface MissionStatusChipProps {
  tone: MissionTone;
  label: string;
  className?: string;
}

export const MissionStatusChip: React.FC<MissionStatusChipProps> = ({
  tone,
  label,
  className,
}) => {
  return (
    <span
      className={cn(chipCva({ tone }), className)}
      data-widget="MissionStatusChip"
      data-tone={tone}
    >
      {label}
    </span>
  );
};
