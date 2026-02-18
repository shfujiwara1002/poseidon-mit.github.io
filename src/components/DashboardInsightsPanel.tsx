export type InsightVariant = 'morning' | 'evening';

interface EngineIconBadgeProps {
  engine: string;
}

function EngineIconBadge({ engine }: EngineIconBadgeProps) {
  return (
    <span
      data-widget="EngineIconBadge"
      data-engine={engine}
      className={`engine-icon-badge engine-icon-badge--${engine.toLowerCase()}`}
    >
      {engine}
    </span>
  );
}

const MORNING_ACTIVITIES = [
  { label: 'Unusual charge flagged', engine: 'Protect' },
  { label: 'Emergency fund on track', engine: 'Grow' },
  { label: '3 actions queued for review', engine: 'Execute' },
];

const EVENING_METRICS = [
  { label: 'Decisions made', value: '12', tone: 'positive' },
  { label: 'Alerts resolved', value: '3', tone: 'neutral' },
  { label: 'Actions pending', value: '2', tone: 'warning' },
];

interface DashboardInsightsPanelProps {
  variant: InsightVariant;
}

export function DashboardInsightsPanel({ variant }: DashboardInsightsPanelProps) {
  return (
    <div
      data-widget="DashboardInsightsPanel"
      data-variant={variant}
      className="dashboard-insights-panel"
    >
      {variant === 'morning' ? (
        <div className="dashboard-main-card dashboard-insights-card dashboard-insights-card--activity">
          <h2 className="dashboard-insights-heading">Good morning</h2>
          <div className="dashboard-insights-activity-rail">
            {MORNING_ACTIVITIES.map((item) => (
              <div key={item.label} className="activity-rail-item">
                <span className="activity-rail-node">
                  <EngineIconBadge engine={item.engine} />
                </span>
                <span className="activity-rail-label">{item.label}</span>
              </div>
            ))}
          </div>
          <ul className="dashboard-action-list">
            <li>Review flagged charge in Protect</li>
            <li>Top-up emergency fund</li>
            <li>Approve queued transfers</li>
          </ul>
        </div>
      ) : (
        <div className="dashboard-main-card dashboard-insights-card">
          <h2 className="dashboard-insights-heading">Day in review</h2>
          <div className="dashboard-insights-metrics">
            {EVENING_METRICS.map((metric) => (
              <div key={metric.label} className="dashboard-insights-metric" data-tone={metric.tone}>
                <span className="dashboard-insights-metric-value">{metric.value}</span>
                <span className="dashboard-insights-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="dashboard-insights-signal-trend">
            <EngineIconBadge engine="Protect" />
            <EngineIconBadge engine="Grow" />
            <EngineIconBadge engine="Execute" />
          </div>
          <p className="dashboard-insights-proof">AI recommendations</p>
        </div>
      )}
    </div>
  );
}
