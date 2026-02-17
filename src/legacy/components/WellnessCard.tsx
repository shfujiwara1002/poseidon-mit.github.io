import React, { useMemo, useState } from 'react';
import { Card } from './Card';
import { MissionDataRows } from './MissionDataRows';
import { MissionMetricTiles } from './MissionMetricTiles';
import { MissionSectionHeader } from './MissionSectionHeader';
import { MissionStatusChip, type MissionTone } from './MissionStatusChip';
import { calculateWellness, type WellnessScore } from '../services/wellnessScoring';

interface WellnessCardProps {
  mockData?: {
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    investmentDiversity: number;
    emergencyMonths: number;
    debtToIncomeRatio: number;
  };
}

const axisLabels: Record<string, string> = {
  budgeting: 'Budgeting',
  saving: 'Saving',
  investing: 'Investing',
  emergencyFund: 'Emergency Fund',
  debtManagement: 'Debt Mgmt',
};

function wellnessTone(level: WellnessScore['level']): MissionTone {
  if (level === 'excellent' || level === 'healthy') return 'healthy';
  if (level === 'developing') return 'warning';
  return 'critical';
}

export const WellnessCard: React.FC<WellnessCardProps> = ({
  mockData = {
    monthlyIncome: 8000,
    monthlyExpenses: 5200,
    savingsRate: 18,
    investmentDiversity: 6,
    emergencyMonths: 3.5,
    debtToIncomeRatio: 0.25,
  },
}) => {
  const [tipsExpanded, setTipsExpanded] = useState(false);

  const wellnessScore = useMemo(() => calculateWellness(mockData), [mockData]);
  const tone = wellnessTone(wellnessScore.level);

  return (
    <Card variant="metric" className="dashboard-side-card wellness-card" data-widget="WellnessCard">
      <MissionSectionHeader
        title="Financial Wellness"
        right={<MissionStatusChip tone={tone} label={wellnessScore.level.replace('-', ' ')} />}
      />

      <MissionMetricTiles
        className="wellness-card-kpis"
        items={[
          { id: 'WELL-OVERALL', label: 'Overall score', value: String(Math.round(wellnessScore.overall)), tone },
          { id: 'WELL-INCOME', label: 'Income', value: `$${mockData.monthlyIncome.toLocaleString()}`, tone: 'primary' },
          { id: 'WELL-EXPENSE', label: 'Expense', value: `$${mockData.monthlyExpenses.toLocaleString()}`, tone: 'warning' },
          { id: 'WELL-SAVINGS', label: 'Savings rate', value: `${mockData.savingsRate}%`, tone: 'healthy' },
        ]}
      />

      <MissionDataRows
        items={Object.entries(wellnessScore.axes).map(([axis, score]) => ({
          id: `WELL-${axis}`,
          title: axisLabels[axis] ?? axis,
          value: `${Math.round(score)}%`,
          detail: 'Axis confidence',
          tone: score >= 75 ? 'healthy' : score >= 55 ? 'primary' : score >= 40 ? 'warning' : 'critical',
        }))}
      />

      <button type="button" className="entry-link-minor" onClick={() => setTipsExpanded((prev) => !prev)}>
        {tipsExpanded ? 'Hide tips ▲' : `Wellness tips (${wellnessScore.tips.length}) ▼`}
      </button>

      {tipsExpanded ? (
        <div className="wellness-card-tips">
          {wellnessScore.tips.map((tip, idx) => (
            <p key={`${tip.message}-${idx}`}>{tip.message}</p>
          ))}
        </div>
      ) : null}

      <p className="wellness-card-updated">Score updated: {new Date().toLocaleDateString()}</p>
    </Card>
  );
};

