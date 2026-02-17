import type { CSSProperties } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';
import type { SavingsGoal } from '../services/mockGrow';

export interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onAdjust?: (id: string) => void;
}

export function SavingsGoalCard({ goal, onAdjust }: SavingsGoalCardProps) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const remaining = Math.max(goal.target - goal.current, 0);
  const monthsUntilDeadline = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
  const achievable = goal.aiRecommendation.achievable;

  return (
    <Card variant="metric" className="savings-goal-card" style={{ ['--goal-progress' as string]: `${progress}%` } as CSSProperties}>
      <header>
        <strong>{goal.name}</strong>
        <MissionStatusChip tone={achievable ? 'healthy' : 'warning'} label={`${Math.round(progress)}%`} />
      </header>

      <MissionDataRows
        items={[
          {
            id: `${goal.id}-current`,
            title: 'Current vs target',
            value: `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`,
            detail: `${Math.max(monthsUntilDeadline, 0)} months to deadline`,
            tone: 'primary',
          },
          {
            id: `${goal.id}-remaining`,
            title: 'Remaining',
            value: `$${remaining.toLocaleString()}`,
            detail: `Need $${goal.aiRecommendation.monthlyContribution}/mo`,
            tone: achievable ? 'healthy' : 'warning',
          },
        ]}
      />

      <div className="savings-goal-progress" aria-hidden="true">
        <div className="savings-goal-progress-bar" />
      </div>

      <MissionEvidencePanel
        title="AI recommendation"
        summary={achievable
          ? `Achievable at current pace with $${goal.aiRecommendation.monthlyContribution}/mo contribution.`
          : `Adjustment suggested: raise contribution to $${goal.aiRecommendation.monthlyContribution}/mo.`}
        tone={achievable ? 'healthy' : 'warning'}
      />

      <div className="mission-dual-actions">
        <Button variant="ghost" onClick={() => onAdjust?.(goal.id)}>
          Adjust goal
        </Button>
        <Button variant="primary">Set auto-save</Button>
      </div>
    </Card>
  );
}
