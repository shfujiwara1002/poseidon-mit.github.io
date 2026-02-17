import React from 'react';
import { cn } from '@/lib/utils';
import type { EngineKey } from './EngineIconBadge';

export interface ActivityRailItem {
  id: string;
  engine: EngineKey;
  title: string;
  detail: string;
  timestamp: string;
}

interface ActivityRailProps {
  items: ActivityRailItem[];
  className?: string;
}

export const ActivityRail: React.FC<ActivityRailProps> = ({ items, className }) => {
  return (
    <div className={cn('activity-rail', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <article
            key={item.id}
            className={cn('activity-rail-item', isLast && 'is-last')}
            data-engine={item.engine}
          >
            {!isLast ? <div className="activity-rail-line" aria-hidden="true" /> : null}
            <div className="activity-rail-node" aria-hidden="true" />

            <div className="activity-rail-meta">
              <span className="activity-rail-engine">{item.engine}</span>
              <span className="activity-rail-time">{item.timestamp}</span>
            </div>

            <div className="activity-rail-title">{item.title}</div>
            <div className="activity-rail-detail">{item.detail}</div>
          </article>
        );
      })}
    </div>
  );
};
