import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionStatusChip } from './MissionStatusChip';
import { MissionToggle } from './MissionToggle';
import type { PrivacyControl } from '../services/mockGovern';

export interface PrivacyControlCardProps {
  control: PrivacyControl;
  onToggle?: (category: string) => void;
}

const categoryLabel: Record<string, string> = {
  transaction_history: 'Transaction History',
  location: 'Location',
  income: 'Income',
  investments: 'Investments',
  personal_info: 'Personal Info',
};

export function PrivacyControlCard({ control, onToggle }: PrivacyControlCardProps) {
  return (
    <Card variant="control">
      <header>
        <strong>{categoryLabel[control.category] ?? control.category}</strong>
        <MissionStatusChip tone={control.enabled ? 'healthy' : 'neutral'} label={control.enabled ? 'Enabled' : 'Disabled'} />
      </header>

      <MissionDataRows
        items={[
          {
            id: `${control.category}-retention`,
            title: 'Retention',
            value: control.retention > 365 ? `${Math.round(control.retention / 365)} years` : `${control.retention} days`,
            detail: control.purpose,
            tone: 'primary',
          },
          {
            id: `${control.category}-sharing`,
            title: 'Third-party sharing',
            value: String(control.thirdPartySharing.length),
            detail: control.collected ? 'Collection on' : 'Collection off',
            tone: control.thirdPartySharing.length > 0 ? 'warning' : 'healthy',
          },
        ]}
      />

      <MissionEvidencePanel
        title="Data policy"
        summary={control.thirdPartySharing.length > 0 ? 'Partner sharing configured with consent tracking.' : 'No partner sharing configured for this category.'}
        tone={control.thirdPartySharing.length > 0 ? 'warning' : 'healthy'}
      />

      <MissionToggle
        checked={control.enabled}
        onChange={() => onToggle?.(control.category)}
        label="Allow processing"
        description="Govern and audit traces remain attached."
      />
    </Card>
  );
}

