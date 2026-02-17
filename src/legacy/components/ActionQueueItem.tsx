import { useState } from 'react';
import { Button } from './Button';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip, type MissionTone } from './MissionStatusChip';
import type { Action } from '../services/mockExecute';

export interface ActionQueueItemProps {
  action: Action;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
  onSnooze?: (id: string, duration: '1d' | '1w' | '1m') => void;
}

const priorityTone: Record<Action['priority'], MissionTone> = {
  critical: 'critical',
  high: 'warning',
  medium: 'primary',
  low: 'neutral',
};

const riskTone: Record<Action['estimatedImpact']['riskLevel'], MissionTone> = {
  none: 'healthy',
  low: 'primary',
  medium: 'warning',
  high: 'critical',
};

function scheduleLabel(date?: Date) {
  if (!date) return 'Not scheduled';
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `in ${diffDays} days`;
}

export function ActionQueueItem({ action, onApprove, onDecline, onSnooze }: ActionQueueItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const tone = priorityTone[action.priority];
  const statusTone: MissionTone = action.status === 'failed' ? 'critical' : action.status === 'completed' ? 'healthy' : tone;

  return (
    <article className="engine-card action-queue-card" data-tone={tone}>
      <header className="action-queue-card-header">
        <strong>{action.title}</strong>
        <MissionStatusChip tone={tone} label={action.priority.toUpperCase()} />
      </header>

      <p className="action-queue-card-description">{action.description}</p>

      <MissionDataRows
        items={[
          {
            id: `${action.id}-savings`,
            title: 'Estimated savings',
            value: `$${action.estimatedImpact.savings.toLocaleString()}`,
            detail: 'Annualized estimate',
            tone: 'healthy',
          },
          {
            id: `${action.id}-risk`,
            title: 'Risk level',
            value: action.estimatedImpact.riskLevel,
            detail: `${action.estimatedImpact.timeToExecute}m execution`,
            tone: riskTone[action.estimatedImpact.riskLevel],
          },
          {
            id: `${action.id}-schedule`,
            title: 'Schedule',
            value: scheduleLabel(action.scheduledDate),
            detail: action.createdAt.toLocaleDateString('en-US'),
            tone: 'primary',
          },
        ]}
      />

      <MissionEvidencePanel
        title="AI recommendation"
        summary={action.aiRecommendation}
        meta={`Source ${action.sourceEngine.toUpperCase()}`}
        tone="primary"
      />

      {showDetails ? (
        <div className="action-queue-card-details">
          <span>Action ID: {action.id}</span>
          <span>Requires approval: {action.requiresApproval ? 'Yes' : 'No'}</span>
          <span>Status: {action.status}</span>
        </div>
      ) : null}

      <button type="button" className="entry-link-minor" onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? 'Hide details ▲' : 'Show details ▼'}
      </button>

      {action.status === 'pending' ? (
        <div className="action-queue-card-actions">
          <div className="mission-dual-actions">
            <Button variant="primary" onClick={() => onApprove?.(action.id)} className="entry-btn--block">
              Approve & Execute
            </Button>
            <Button variant="ghost" onClick={() => onDecline?.(action.id)} className="entry-btn--block">
              Decline
            </Button>
          </div>
          {onSnooze ? (
            <div className="action-queue-card-snooze">
              <button type="button" onClick={() => onSnooze(action.id, '1d')}>1 Day</button>
              <button type="button" onClick={() => onSnooze(action.id, '1w')}>1 Week</button>
              <button type="button" onClick={() => onSnooze(action.id, '1m')}>1 Month</button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="action-queue-card-status">
          <MissionStatusChip tone={statusTone} label={action.status} />
        </div>
      )}
    </article>
  );
}

