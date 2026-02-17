import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';
import { MissionToggle } from './MissionToggle';
import type { AutoSaveRule } from '../services/mockExecute';

export interface AutoSaveRuleCardProps {
  rule: AutoSaveRule;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
}

function amountLabel(rule: AutoSaveRule) {
  if (rule.amount.type === 'fixed') return `$${rule.amount.value}`;
  if (rule.amount.type === 'percentage') return `${rule.amount.value}%`;
  return 'AI auto-adjust';
}

export function AutoSaveRuleCard({ rule, onToggle, onEdit }: AutoSaveRuleCardProps) {
  return (
    <Card variant="rule">
      <header>
        <strong>{rule.name}</strong>
        <MissionStatusChip tone={rule.enabled ? 'healthy' : 'neutral'} label={rule.trigger.replace('_', ' ')} />
      </header>

      <MissionDataRows
        items={[
          {
            id: `${rule.id}-amount`,
            title: 'Contribution',
            value: amountLabel(rule),
            detail: `Destination ${rule.destination}`,
            tone: 'primary',
          },
          {
            id: `${rule.id}-guardrail`,
            title: 'Min balance',
            value: `$${rule.conditions.minBalance}`,
            detail: `${rule.conditions.excludeDates.length} excluded dates`,
            tone: 'warning',
          },
        ]}
      />

      <MissionEvidencePanel
        title="Execution policy"
        summary={rule.aiOptimization ? 'AI optimization enabled for timing and amount tuning.' : 'Manual optimization mode enabled.'}
        tone={rule.aiOptimization ? 'healthy' : 'primary'}
      />

      <MissionToggle
        checked={rule.enabled}
        onChange={() => onToggle?.(rule.id)}
        label="Rule enabled"
        description={rule.enabled ? 'Automation active' : 'Automation paused'}
      />

      <div className="mission-dual-actions">
        <button type="button" className="entry-btn entry-btn--ghost" onClick={() => onEdit?.(rule.id)}>
          Edit
        </button>
        <button type="button" className="entry-btn entry-btn--ghost">
          View history
        </button>
      </div>
    </Card>
  );
}

