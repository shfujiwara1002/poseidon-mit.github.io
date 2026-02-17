import React, { useState } from 'react';

export interface OversightCase {
  id: string;
  title: string;
  type: 'dispute' | 'escalation' | 'policy_exception' | 'review';
  status: 'pending' | 'in_review' | 'resolved' | 'overturned';
  assignee: string;
  slaDeadline: Date;
  engine: 'protect' | 'grow' | 'execute' | 'govern';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface OversightQueueTableProps {
  cases: OversightCase[];
  onSelect?: (caseItem: OversightCase) => void;
  onAssign?: (caseId: string) => void;
}

const STATUS_LABELS: Record<OversightCase['status'], string> = {
  pending: 'Pending',
  in_review: 'In Review',
  resolved: 'Resolved',
  overturned: 'Overturned',
};

const STATUS_TONES: Record<OversightCase['status'], string> = {
  pending: 'var(--state-warning)',
  in_review: 'var(--state-primary)',
  resolved: 'var(--state-healthy)',
  overturned: '#00F0FF',
};

const PRIORITY_COLORS: Record<OversightCase['priority'], string> = {
  low: 'var(--state-healthy)',
  medium: 'var(--state-primary)',
  high: 'var(--state-warning)',
  critical: 'var(--state-critical)',
};

const ENGINE_COLORS: Record<string, string> = {
  protect: '#22C55E',
  grow: '#8B5CF6',
  execute: '#EAB308',
  govern: '#3B82F6',
};

function formatSlaRemaining(deadline: Date): { text: string; urgent: boolean } {
  const remaining = deadline.getTime() - Date.now();
  if (remaining <= 0) return { text: 'Overdue', urgent: true };

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { text: `${days}d ${hours % 24}h`, urgent: false };
  }
  if (hours > 0) {
    return { text: `${hours}h ${minutes}m`, urgent: hours <= 2 };
  }
  return { text: `${minutes}m`, urgent: true };
}

type SortKey = 'priority' | 'slaDeadline' | 'status' | 'engine';

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/**
 * W-V3-GOV05: OversightQueueTable — sortable oversight case queue
 * with SLA countdown, status chips, and priority indicators.
 */
export const OversightQueueTable: React.FC<OversightQueueTableProps> = ({
  cases,
  onSelect,
  onAssign,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('slaDeadline');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...cases].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'priority':
        cmp = (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
        break;
      case 'slaDeadline':
        cmp = a.slaDeadline.getTime() - b.slaDeadline.getTime();
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'engine':
        cmp = a.engine.localeCompare(b.engine);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : '';

  return (
    <div className="oversight-queue-table" data-widget="OversightQueueTable">
      <table className="audit-table">
        <thead>
          <tr>
            <th
              className="audit-table-sortable"
              onClick={() => handleSort('priority')}
            >
              Priority{sortIndicator('priority')}
            </th>
            <th>Case</th>
            <th>Type</th>
            <th
              className="audit-table-sortable"
              onClick={() => handleSort('engine')}
            >
              Engine{sortIndicator('engine')}
            </th>
            <th
              className="audit-table-sortable"
              onClick={() => handleSort('status')}
            >
              Status{sortIndicator('status')}
            </th>
            <th>Assignee</th>
            <th
              className="audit-table-sortable"
              onClick={() => handleSort('slaDeadline')}
            >
              SLA{sortIndicator('slaDeadline')}
            </th>
            {onAssign && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => {
            const sla = formatSlaRemaining(c.slaDeadline);
            return (
              <tr
                key={c.id}
                className={onSelect ? 'audit-table-clickable' : undefined}
                onClick={() => onSelect?.(c)}
              >
                <td>
                  <span
                    className="oversight-priority-dot"
                    style={{ background: PRIORITY_COLORS[c.priority] }}
                    title={c.priority}
                  />
                </td>
                <td className="audit-table-decision">{c.title}</td>
                <td className="audit-table-type">{c.type.replace('_', ' ')}</td>
                <td>
                  <span
                    className="audit-table-engine"
                    style={{ color: ENGINE_COLORS[c.engine] }}
                  >
                    {c.engine}
                  </span>
                </td>
                <td>
                  <span
                    className="mission-status-chip"
                    style={{ borderColor: STATUS_TONES[c.status], color: STATUS_TONES[c.status] }}
                  >
                    {STATUS_LABELS[c.status]}
                  </span>
                </td>
                <td>{c.assignee || '—'}</td>
                <td>
                  <span
                    className={`oversight-sla ${sla.urgent ? 'oversight-sla--urgent' : ''}`}
                    style={sla.urgent ? { color: 'var(--state-critical)' } : undefined}
                  >
                    {sla.text}
                  </span>
                </td>
                {onAssign && (
                  <td>
                    {c.status === 'pending' && (
                      <button
                        type="button"
                        className="entry-btn entry-btn--ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssign(c.id);
                        }}
                      >
                        Assign
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
