import { memo } from 'react';
import { Sparkline } from './Sparkline';
import { DefinitionLine } from './DefinitionLine';

type AccentColor = 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';

interface KPIContractCardProps {
  label: string;
  value: string;
  delta?: string;
  definition: string;
  accent?: AccentColor;
  sparklineData?: Array<{ value: number }>;
  sparklineColor?: string;
}

const accentVar: Record<AccentColor, string> = {
  cyan: 'var(--accent-cyan)',
  teal: 'var(--accent-teal)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
  blue: 'var(--accent-blue)',
  red: 'var(--accent-red)',
};

/**
 * W-V3-KPI01: KPIContractCard — StatCard + DefinitionLine composite
 * Semantic Charter Rule 3: "Every KPI has a nearby definition line"
 */
export const KPIContractCard = memo<KPIContractCardProps>(
  ({ label, value, delta, definition, accent = 'cyan', sparklineData, sparklineColor }) => {
    return (
      <div className="stat-card stat-card--md kpi-contract-card" data-accent={accent}>
        {sparklineData && sparklineData.length >= 2 && (
          <div className="stat-sparkline">
            <Sparkline
              data={sparklineData}
              color={sparklineColor ?? accentVar[accent]}
              width={64}
              height={22}
            />
          </div>
        )}
        <div className="stat-value kpi-contract-card-value">
          {value}
        </div>
        <div className="stat-label">{label}</div>
        {delta && <div className="stat-meta">{delta}</div>}
        <DefinitionLine text={definition} />
      </div>
    );
  },
);

KPIContractCard.displayName = 'KPIContractCard';
