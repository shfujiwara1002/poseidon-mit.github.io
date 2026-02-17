import React from 'react';
import { Card } from './Card';
import type { Action } from '../services/mockExecute';

type UrgencyTone = 'critical' | 'warning' | 'primary' | 'healthy';

interface ActionQueueCardProps {
  /** Action data from the queue */
  action: Action;
  /** Approve callback */
  onApprove?: (id: string) => void;
  /** Decline callback */
  onDecline?: (id: string) => void;
  /** Defer/snooze callback */
  onDefer?: (id: string) => void;
}

const PRIORITY_TONE: Record<string, UrgencyTone> = {
  critical: 'critical',
  high: 'warning',
  medium: 'primary',
  low: 'healthy',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  executing: 'Executing...',
  completed: 'Completed',
  failed: 'Failed',
  declined: 'Declined',
};

function formatDueWindow(date?: Date): string {
  if (!date) return 'No deadline';
  const now = Date.now();
  const diff = date.getTime() - now;
  if (diff < 0) return 'Overdue';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `Due in ${days}d`;
  if (hours > 0) return `Due in ${hours}h`;
  const mins = Math.floor(diff / (1000 * 60));
  return `Due in ${mins}m`;
}

/**
 * W-V3-EXE-CARD: ActionQueueCard — per-action display with
 * impact, confidence, urgency, due window metadata,
 * and approve/decline/defer controls.
 */
export const ActionQueueCard: React.FC<ActionQueueCardProps> = ({
  action,
  onApprove,
  onDecline,
  onDefer,
}) => {
  const tone = PRIORITY_TONE[action.priority] ?? 'primary';
  const isActionable = action.status === 'pending';

  return (
    <Card
      variant="action"
      tone={tone}
      as="div"
      data-widget="ActionQueueCard"
      data-status={action.status}
      data-priority={action.priority}
    >
      <div className="action-queue-card-header">
        <div className="action-queue-card-title-row">
          <span className={`action-queue-card-priority action-queue-card-priority--${tone}`}>
            {PRIORITY_LABELS[action.priority]}
          </span>
          <h4 className="action-queue-card-title">{action.title}</h4>
        </div>
        <span className={`action-queue-card-status action-queue-card-status--${action.status}`}>
          {STATUS_LABELS[action.status]}
        </span>
      </div>

      <p className="action-queue-card-description">{action.description}</p>

      <div className="action-queue-card-meta">
        <div className="action-queue-card-meta-item">
          <span className="action-queue-card-meta-label">Impact</span>
          <span className="action-queue-card-meta-value">${action.estimatedImpact.savings}/yr</span>
        </div>
        <div className="action-queue-card-meta-item">
          <span className="action-queue-card-meta-label">Risk</span>
          <span className="action-queue-card-meta-value">{action.estimatedImpact.riskLevel}</span>
        </div>
        <div className="action-queue-card-meta-item">
          <span className="action-queue-card-meta-label">Execution</span>
          <span className="action-queue-card-meta-value">{action.estimatedImpact.timeToExecute}m</span>
        </div>
        <div className="action-queue-card-meta-item">
          <span className="action-queue-card-meta-label">Window</span>
          <span className="action-queue-card-meta-value">{formatDueWindow(action.scheduledDate)}</span>
        </div>
      </div>

      {action.aiRecommendation && (
        <div className="action-queue-card-recommendation">
          <span className="action-queue-card-recommendation-label">AI rationale</span>
          <p>{action.aiRecommendation}</p>
        </div>
      )}

      {isActionable && (
        <div className="action-queue-card-actions">
          {onApprove && (
            <button
              type="button"
              className="entry-btn entry-btn--primary"
              onClick={() => onApprove(action.id)}
            >
              Approve
            </button>
          )}
          {onDefer && (
            <button
              type="button"
              className="entry-btn entry-btn--ghost"
              onClick={() => onDefer(action.id)}
            >
              Defer
            </button>
          )}
          {onDecline && (
            <button
              type="button"
              className="entry-btn entry-btn--ghost action-queue-card-decline"
              onClick={() => onDecline(action.id)}
            >
              Decline
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
