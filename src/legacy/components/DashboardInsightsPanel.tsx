import { cn } from '@/lib/utils';
import { ActivityRail } from './ActivityRail';
import { DefinitionLine } from './DefinitionLine';
import { EngineIconBadge, type EngineKey } from './EngineIconBadge';
import { MissionActionList } from './MissionActionList';
import { MissionSectionHeader } from './MissionSectionHeader';
import { MissionStatusChip, type MissionTone } from './MissionStatusChip';
import { ProofLine } from './ProofLine';

export type DashboardInsightsVariant = 'morning' | 'evening';

interface DashboardInsightsPanelProps {
  variant: DashboardInsightsVariant;
  headingOverride?: string;
}

interface InsightMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  timestamp?: string;
  detail: string;
  tone: MissionTone;
  engine: EngineKey;
}

interface InsightAction {
  title: string;
  meta: string;
  tone: MissionTone;
}

interface InsightConfig {
  title: string;
  subtitle: string;
  status: {
    label: string;
    tone: MissionTone;
  };
  metrics: InsightMetric[];
  actionsTitle: string;
  actions: InsightAction[];
  proofLine: {
    claim: string;
    evidence: string;
    source: string;
    accent: string;
  };
}

const INSIGHTS_CONFIG: Record<DashboardInsightsVariant, InsightConfig> = {
  morning: {
    title: 'Good morning',
    subtitle: 'Overnight movement summary with next actions in one view.',
    status: { label: 'Morning briefing', tone: 'healthy' },
    metrics: [
      {
        id: 'MORNING-PORTFOLIO',
        label: 'Portfolio Value',
        value: '+1.2%',
        delta: '↑ 1.2%',
        timestamp: 'Pre-open',
        detail: 'Since previous close | net move across all linked accounts',
        tone: 'healthy',
        engine: 'Grow',
      },
      {
        id: 'MORNING-ALERTS',
        label: 'New Alerts',
        value: '1 pending',
        delta: 'Needs review',
        timestamp: '42m ago',
        detail: 'Protect flagged one charge anomaly for verification',
        tone: 'warning',
        engine: 'Protect',
      },
      {
        id: 'MORNING-GOALS',
        label: 'Savings Goal',
        value: '73% complete',
        delta: '↑ 2.5%',
        timestamp: '2h ago',
        detail: 'Projected completion trend based on last 30 days',
        tone: 'primary',
        engine: 'Govern',
      },
    ],
    actionsTitle: 'Morning priorities',
    actions: [
      { title: 'Review actions', meta: 'Priority queue ready', tone: 'primary' },
      { title: 'Check alerts', meta: '1 pending', tone: 'warning' },
      { title: 'View goals', meta: 'Savings 73% complete', tone: 'healthy' },
    ],
    proofLine: {
      claim: 'Morning sync status',
      evidence: 'All 4 engines refreshed at 06:00 | Confidence composite 0.92',
      source: 'Govern audit trail',
      accent: 'var(--state-active)',
    },
  },
  evening: {
    title: 'Day in review',
    subtitle: 'Daily activity digest with spend context and recommended follow-ups.',
    status: { label: 'Evening review', tone: 'primary' },
    metrics: [
      {
        id: 'EVENING-TRANSACTIONS',
        label: 'Transactions',
        value: '12',
        delta: 'Today',
        detail: 'Posted ledger events across card, ACH, and transfer channels',
        tone: 'primary',
        engine: 'Execute',
      },
      {
        id: 'EVENING-SPEND',
        label: 'Total Spent',
        value: '$847',
        delta: 'MTD in budget',
        detail: '$847 of $2,400 monthly target consumed (35%)',
        tone: 'healthy',
        engine: 'Grow',
      },
      {
        id: 'EVENING-DINING',
        label: 'Dining Out',
        value: '37.8%',
        delta: 'Above target',
        detail: 'Category concentration exceeds 25% baseline threshold',
        tone: 'warning',
        engine: 'Protect',
      },
    ],
    actionsTitle: 'AI recommendations',
    actions: [
      { title: 'Save on recurring expenses', meta: 'Potential save $140/mo', tone: 'warning' },
      { title: 'Track budget progress', meta: '$847 of $2,400 used', tone: 'healthy' },
      { title: 'Optimize dining out', meta: '37.8% vs 25% target', tone: 'primary' },
    ],
    proofLine: {
      claim: 'Ledger integrity',
      evidence: '12 reconciled events | Category breakdown aligned to current model',
      source: 'Govern audit trail',
      accent: 'var(--state-primary)',
    },
  },
};

export function DashboardInsightsPanel({ variant, headingOverride }: DashboardInsightsPanelProps) {
  const config = INSIGHTS_CONFIG[variant];
  const isMorning = variant === 'morning';

  return (
    <article
      className={cn('dashboard-main-card', 'dashboard-insights-card', isMorning && 'dashboard-insights-card--activity')}
      data-widget="DashboardInsightsPanel"
      data-variant={variant}
    >
      <MissionSectionHeader
        title={headingOverride ?? config.title}
        right={<MissionStatusChip tone={config.status.tone} label={config.status.label} />}
      />

      <p className="dashboard-insights-subtitle">{config.subtitle}</p>

      {isMorning ? (
        <ActivityRail
          className="dashboard-insights-activity-rail"
          items={config.metrics.map((metric) => ({
            id: metric.id,
            engine: metric.engine,
            title: `${metric.label} — ${metric.value}`,
            detail: metric.detail,
            timestamp: metric.timestamp ?? metric.delta ?? 'Now',
          }))}
        />
      ) : (
        <div className="dashboard-insights-metrics">
          {config.metrics.map((metric) => (
            <section key={metric.label} className="dashboard-insights-metric" data-tone={metric.tone}>
              <div className="dashboard-insights-metric-header">
                <div className="dashboard-insights-metric-label">
                  <EngineIconBadge engine={metric.engine} size={14} />
                  <span>{metric.label}</span>
                </div>
                {metric.delta ? <MissionStatusChip tone={metric.tone} label={metric.delta} /> : null}
              </div>

              <strong className="dashboard-insights-metric-value">{metric.value}</strong>
              <DefinitionLine text={metric.detail} />
            </section>
          ))}
        </div>
      )}

      <div className="dashboard-insights-proof">
        <ProofLine
          claim={config.proofLine.claim}
          evidence={config.proofLine.evidence}
          source={config.proofLine.source}
          accent={config.proofLine.accent}
        />
      </div>

      <section className="dashboard-insights-actions">
        <MissionSectionHeader title={config.actionsTitle} />
        <MissionActionList items={config.actions} />
      </section>
    </article>
  );
}
