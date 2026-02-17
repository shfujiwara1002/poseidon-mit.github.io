import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { MissionDataRows } from './MissionDataRows';
import { MissionEvidencePanel } from './MissionEvidencePanel';
import { MissionSectionHeader } from './MissionSectionHeader';
import { MissionStatusChip } from './MissionStatusChip';
import { analyzeScenario, type ScenarioResult } from '../services/mockGrow';

type ScenarioType = 'income_increase' | 'expense_decrease' | 'new_expense';

const scenarioLabel: Record<ScenarioType, { title: string; tone: 'healthy' | 'primary' | 'warning' }> = {
  income_increase: { title: 'Income increase', tone: 'healthy' },
  expense_decrease: { title: 'Expense decrease', tone: 'primary' },
  new_expense: { title: 'New expense', tone: 'warning' },
};

export function ScenarioSimulator() {
  const [scenarioType, setScenarioType] = useState<ScenarioType>('income_increase');
  const [percentage, setPercentage] = useState(10);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const runSimulation = () => {
    setResult(analyzeScenario(scenarioType, percentage));
  };

  const selected = scenarioLabel[scenarioType];

  return (
    <article className="engine-card scenario-simulator-card">
      <MissionSectionHeader
        title="Scenario simulator"
        right={<MissionStatusChip tone={selected.tone} label={`${percentage}%`} />}
      />

      <div className="scenario-simulator-options">
        {(Object.keys(scenarioLabel) as ScenarioType[]).map((key) => (
          <button
            key={key}
            type="button"
            className={cn('settings-option', scenarioType === key && 'is-active')}
            onClick={() => setScenarioType(key)}
          >
            <strong>{scenarioLabel[key].title}</strong>
            <span>Set variable driver</span>
          </button>
        ))}
      </div>

      <label className="scenario-simulator-range">
        <span>Change rate</span>
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={percentage}
          onChange={(event) => setPercentage(Number(event.target.value))}
        />
      </label>

      <Button variant="primary" onClick={runSimulation}>
        Run simulation
      </Button>

      {result ? (
        <>
          <MissionDataRows
            items={[
              {
                id: 'SIM-IMPACT',
                title: 'Monthly impact',
                value: `${result.impact > 0 ? '+' : ''}$${result.impact.toLocaleString()}`,
                detail: 'Forecasted change',
                tone: result.impact >= 0 ? 'healthy' : 'critical',
              },
              {
                id: 'SIM-BALANCE',
                title: 'Balance in 6 months',
                value: `$${result.newBalance.toLocaleString()}`,
                detail: 'Projected scenario endpoint',
                tone: 'primary',
              },
            ]}
          />
          <MissionEvidencePanel
            title="Scenario insight"
            summary={result.explanation}
            tone={result.impact >= 0 ? 'healthy' : 'warning'}
          />
        </>
      ) : null}
    </article>
  );
}

