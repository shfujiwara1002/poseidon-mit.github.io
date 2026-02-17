import React, { useState, useMemo } from 'react';
import { MissionDataRows } from './MissionDataRows';

type ScenarioVariable = 'income' | 'expenses' | 'savings_rate' | 'timeline';

interface ScenarioParameter {
  variable: ScenarioVariable;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

interface ScenarioControlsProps {
  /** Parameters available for adjustment */
  parameters?: ScenarioParameter[];
  /** Callback when parameters change */
  onChange?: (values: Record<ScenarioVariable, number>) => void;
  /** Whether to show the before/after comparison */
  showComparison?: boolean;
}

const DEFAULT_PARAMETERS: ScenarioParameter[] = [
  { variable: 'income', label: 'Income change', min: -30, max: 50, step: 5, unit: '%', defaultValue: 0 },
  { variable: 'expenses', label: 'Expense change', min: -50, max: 30, step: 5, unit: '%', defaultValue: 0 },
  { variable: 'savings_rate', label: 'Savings rate', min: 0, max: 40, step: 2, unit: '%', defaultValue: 10 },
  { variable: 'timeline', label: 'Projection horizon', min: 3, max: 24, step: 3, unit: 'months', defaultValue: 12 },
];

/**
 * W-V3-GRW-SC: ScenarioControls — slider-based parameter controls
 * with before/after preview. Used on GRW02 for scenario comparison.
 */
export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  parameters = DEFAULT_PARAMETERS,
  onChange,
  showComparison = true,
}) => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(parameters.map((p) => [p.variable, p.defaultValue])),
  );

  const handleChange = (variable: ScenarioVariable, value: number) => {
    const next = { ...values, [variable]: value };
    setValues(next);
    onChange?.(next as Record<ScenarioVariable, number>);
  };

  // Compute a simple before/after based on parameter changes
  const comparison = useMemo(() => {
    const baseMonthly = 4800; // base income
    const baseExpenses = 2200;
    const incomeChange = (values.income ?? 0) / 100;
    const expenseChange = (values.expenses ?? 0) / 100;
    const savingsRate = (values.savings_rate ?? 10) / 100;
    const months = values.timeline ?? 12;

    const newIncome = baseMonthly * (1 + incomeChange);
    const newExpenses = baseExpenses * (1 + expenseChange);
    const monthlySurplus = newIncome - newExpenses;
    const monthlySavings = monthlySurplus * savingsRate;
    const projectedTotal = monthlySavings * months;

    const baselineSurplus = baseMonthly - baseExpenses;
    const baselineSavings = baselineSurplus * 0.1 * months;
    const delta = projectedTotal - baselineSavings;

    return { projectedTotal, baselineSavings, delta, monthlySavings, months };
  }, [values]);

  return (
    <div className="scenario-controls" data-widget="ScenarioControls">
      <div className="scenario-controls-sliders">
        {parameters.map((param) => (
          <div className="scenario-controls-slider" key={param.variable}>
            <div className="scenario-controls-slider-header">
              <label htmlFor={`sc-${param.variable}`}>{param.label}</label>
              <span className="scenario-controls-slider-value">
                {param.variable !== 'timeline' && values[param.variable] > 0 ? '+' : ''}
                {values[param.variable]}{param.unit}
              </span>
            </div>
            <input
              id={`sc-${param.variable}`}
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={values[param.variable]}
              onChange={(e) => handleChange(param.variable, Number(e.target.value))}
              className="scenario-controls-range"
            />
            <div className="scenario-controls-slider-bounds">
              <span>{param.min}{param.unit}</span>
              <span>{param.max}{param.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {showComparison && (
        <div className="scenario-controls-comparison">
          <MissionDataRows
            items={[
              {
                id: 'SC-BASELINE',
                title: 'Baseline projection',
                value: `$${Math.round(comparison.baselineSavings).toLocaleString()}`,
                detail: `Over ${comparison.months} months`,
                tone: 'primary',
              },
              {
                id: 'SC-SCENARIO',
                title: 'Scenario projection',
                value: `$${Math.round(comparison.projectedTotal).toLocaleString()}`,
                detail: `$${Math.round(comparison.monthlySavings).toLocaleString()}/mo savings`,
                tone: comparison.delta >= 0 ? 'healthy' : 'critical',
              },
              {
                id: 'SC-DELTA',
                title: 'Net difference',
                value: `${comparison.delta >= 0 ? '+' : ''}$${Math.round(comparison.delta).toLocaleString()}`,
                detail: `Over ${comparison.months} months`,
                tone: comparison.delta >= 0 ? 'healthy' : 'warning',
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};
