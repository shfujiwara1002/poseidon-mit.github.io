import { Button } from './Button';
import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';
import type { SubscriptionLeak } from '../services/mockProtect';

export interface SubscriptionLeakCardProps {
  leak: SubscriptionLeak;
  onCancel?: (id: string) => void;
  onKeep?: (id: string) => void;
}

export function SubscriptionLeakCard({ leak, onCancel, onKeep }: SubscriptionLeakCardProps) {
  const daysSinceLastUse = Math.floor((Date.now() - leak.lastUsed.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card variant="insight" tone="warning">
      <header>
        <strong>{leak.service}</strong>
        <MissionStatusChip tone="warning" label={`$${leak.monthlyCharge.toFixed(2)}/mo`} />
      </header>

      <MissionDataRows
        items={[
          {
            id: `${leak.id}-waste`,
            title: 'Estimated annual waste',
            value: `$${leak.estimatedWaste.toLocaleString()}`,
            detail: `${daysSinceLastUse} days since last use`,
            tone: 'warning',
          },
          {
            id: `${leak.id}-status`,
            title: 'Cancellation path',
            value: leak.cancellationLink ? 'Direct link available' : 'Manual review',
            detail: 'Protect recommendation',
            tone: 'primary',
          },
        ]}
      />

      <MissionEvidencePanel
        title="AI insight"
        summary={leak.aiInsight}
        tone="primary"
      />

      <div className="mission-dual-actions">
        <Button variant="ghost" onClick={() => onKeep?.(leak.id)}>
          Keep
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (leak.cancellationLink) {
              window.open(leak.cancellationLink, '_blank');
            }
            onCancel?.(leak.id);
          }}
        >
          {leak.cancellationLink ? 'Cancel now' : 'Review cancellation'}
        </Button>
      </div>
    </Card>
  );
}

