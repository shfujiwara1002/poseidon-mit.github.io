import React from 'react';
import { ActivityRail } from './ActivityRail';

type Engine = 'Protect' | 'Grow' | 'Execute' | 'Govern';

interface TimelineEntry {
  id: string;
  engine: Engine;
  action: string;
  outcome: string;
  timestamp: string;
}

const MOCK_TIMELINE: TimelineEntry[] = [
  { id: 'TL-001', engine: 'Execute', action: 'Auto-paid electricity bill', outcome: '$142 processed', timestamp: '1h ago' },
  { id: 'TL-002', engine: 'Protect', action: 'Blocked suspicious login attempt', outcome: 'Access denied', timestamp: '3h ago' },
  { id: 'TL-003', engine: 'Grow', action: 'Rebalanced savings allocation', outcome: '+2.1% projected', timestamp: '5h ago' },
  { id: 'TL-004', engine: 'Govern', action: 'Audit trace verified', outcome: 'Clean', timestamp: '8h ago' },
  { id: 'TL-005', engine: 'Execute', action: 'Subscription consolidation queued', outcome: 'Pending approval', timestamp: '12h ago' },
];

/**
 * DASH-05: Activity Timeline — cross-engine history reconstruction
 */
export const ActivityTimeline: React.FC = () => {
  return (
    <div className="activity-timeline">
      <header className="activity-widget-header">
        <strong className="activity-widget-title">Activity</strong>
      </header>
      <ActivityRail
        items={MOCK_TIMELINE.map((entry) => ({
          id: entry.id,
          engine: entry.engine,
          title: entry.action,
          detail: entry.outcome,
          timestamp: entry.timestamp,
        }))}
      />
    </div>
  );
};
