import { cn } from '@/lib/utils';
import { useColorblindMode, type ColorblindMode } from '../hooks/useColorblindMode';
import { useAutonomy } from '../contexts/AutonomyContext';
import { useExpertMode } from '../contexts/ExpertModeContext';
import { MissionActionList } from './MissionActionList';
import { MissionDataRows } from './MissionDataRows';
import { MissionMetricTiles } from './MissionMetricTiles';
import { MissionSectionHeader } from './MissionSectionHeader';
import { MissionStatusChip } from './MissionStatusChip';
import { MissionToggle } from './MissionToggle';

const colorblindOptions: Array<{ value: ColorblindMode; label: string; description: string }> = [
  { value: 'none', label: 'Default', description: 'Standard palette' },
  { value: 'deuteranopia', label: 'Deuteranopia', description: 'Red-green balanced' },
  { value: 'protanopia', label: 'Protanopia', description: 'Red sensitivity support' },
  { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-yellow support' },
];

const autonomyLevels = ['Manual', 'Collaborative', 'Autonomous', 'Proactive'] as const;

export function SettingsPanel() {
  const { mode: colorblindMode, setMode: setColorblindMode } = useColorblindMode();
  const { autonomyLevel, setAutonomyLevel } = useAutonomy();
  const { isExpert, setExpertMode } = useExpertMode();

  return (
    <div className="settings-panel">
      <section className="settings-panel-section">
        <MissionSectionHeader
          title="Accessibility"
          right={<MissionStatusChip tone="primary" label={colorblindMode === 'none' ? 'Default' : 'Override active'} />}
        />
        <div className="settings-option-grid">
          {colorblindOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn('settings-option', colorblindMode === option.value && 'is-active')}
              onClick={() => setColorblindMode(option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-panel-section">
        <MissionSectionHeader
          title="AI autonomy"
          right={<MissionStatusChip tone="warning" label={autonomyLevels[autonomyLevel]} />}
        />
        <div className="settings-option-grid">
          {autonomyLevels.map((label, idx) => (
            <button
              key={label}
              type="button"
              className={cn('settings-option', autonomyLevel === idx && 'is-active')}
              onClick={() => setAutonomyLevel(idx as 0 | 1 | 2 | 3)}
            >
              <strong>{label}</strong>
              <span>Decision support profile {idx + 1}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-panel-section">
        <MissionSectionHeader
          title="Display mode"
          right={<MissionStatusChip tone={isExpert ? 'healthy' : 'neutral'} label={isExpert ? 'Expert' : 'Simplified'} />}
        />
        <MissionToggle
          checked={isExpert}
          onChange={(next) => setExpertMode(next ? 'expert' : 'novice')}
          label="Expert mode"
          description={isExpert ? 'Advanced financial terms + deeper metrics enabled.' : 'Plain-language summaries enabled.'}
        />
      </section>

      <section className="settings-panel-section">
        <MissionSectionHeader title="Policy summary" />
        <MissionMetricTiles
          items={[
            { id: 'SP-001', label: 'Active policies', value: '14', tone: 'primary' },
            { id: 'SP-002', label: 'Consent scopes', value: '6', tone: 'healthy' },
            { id: 'SP-003', label: 'Alert profile', value: 'Balanced', tone: 'warning' },
            { id: 'SP-004', label: 'Audit state', value: 'Clean', tone: 'healthy' },
          ]}
        />
        <MissionDataRows
          items={[
            {
              id: 'SP-ROW-1',
              title: 'Color mode',
              detail: 'Accessibility rendering profile',
              value: colorblindMode,
              tone: colorblindMode === 'none' ? 'healthy' : 'primary',
            },
            {
              id: 'SP-ROW-2',
              title: 'Autonomy tier',
              detail: 'Execution recommendation behavior',
              value: autonomyLevels[autonomyLevel],
              tone: autonomyLevel >= 2 ? 'warning' : 'primary',
            },
            {
              id: 'SP-ROW-3',
              title: 'Display language',
              detail: 'Narrative depth preference',
              value: isExpert ? 'Expert' : 'Simplified',
              tone: isExpert ? 'healthy' : 'neutral',
            },
          ]}
        />
      </section>

      <section className="settings-panel-section">
        <MissionSectionHeader title="Next best actions" />
        <MissionActionList
          items={[
            { title: 'Run policy health check', meta: 'Recommended', tone: 'primary' },
            { title: 'Review alert cadence', meta: 'Monthly', tone: 'warning' },
            { title: 'Export current config', meta: 'Audit', tone: 'healthy' },
          ]}
        />
      </section>
    </div>
  );
}
