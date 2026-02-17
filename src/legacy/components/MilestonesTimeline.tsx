import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Milestone {
  label: string;
  date: string;
  status: 'completed' | 'upcoming' | 'future';
}

export interface MilestonesTimelineProps {
  milestones: Milestone[];
  /** Accent color for "upcoming" items (default: var(--accent-violet)) */
  accentColor?: string;
  className?: string;
}

function MilestoneIcon({ status, accentColor }: { status: Milestone['status']; accentColor: string }) {
  if (status === 'completed') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ background: 'rgba(20,184,166,0.15)', boxShadow: 'inset 0 0 0 2px rgba(20,184,166,0.3)' }}>
        <Check className="h-4 w-4" style={{ color: 'var(--state-healthy)' }} />
      </div>
    );
  }
  if (status === 'upcoming') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ background: `color-mix(in srgb, ${accentColor} 15%, transparent)`, boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${accentColor} 30%, transparent)` }}>
        <div className="h-3 w-3 rounded-full" style={{ background: accentColor }} />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full"
      style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.1)' }}>
      <div className="h-3 w-3 rounded-full" style={{ background: '#6B7280' }} />
    </div>
  );
}

export const MilestonesTimeline: React.FC<MilestonesTimelineProps> = ({
  milestones,
  accentColor = 'var(--accent-violet)',
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        return (
          <div key={milestone.label} className="relative flex gap-4">
            {!isLast && (
              <div
                className="absolute left-4 top-8 h-full w-px -translate-x-1/2"
                style={{
                  background: milestone.status === 'completed'
                    ? 'linear-gradient(to bottom, rgba(20,184,166,0.3), rgba(20,184,166,0.1))'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                }}
              />
            )}
            <div className="z-10 shrink-0">
              <MilestoneIcon status={milestone.status} accentColor={accentColor} />
            </div>
            <div className={cn('flex flex-1 items-center justify-between', isLast ? 'pb-0' : 'pb-6')}>
              <div>
                <p className={cn('text-sm font-medium', {
                  'text-white': milestone.status === 'completed',
                  'text-slate-300': milestone.status === 'upcoming',
                  'text-gray-500': milestone.status === 'future',
                })}>
                  {milestone.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted-2)' }}>{milestone.date}</p>
              </div>
              {milestone.status === 'completed' && (
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: 'rgba(20,184,166,0.1)', color: 'var(--state-healthy)' }}>
                  Done
                </span>
              )}
              {milestone.status === 'upcoming' && (
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: `color-mix(in srgb, ${accentColor} 10%, transparent)`, color: accentColor }}>
                  Next
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestonesTimeline;
