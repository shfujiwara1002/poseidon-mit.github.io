import React from 'react';
import { MissionStatusChip, type MissionTone } from './MissionStatusChip';
import { ProofLine } from './ProofLine';
import { getEngineSemantic } from '../design-system/engine-semantic';

type Severity = 'critical' | 'warning' | 'info';
type Engine = 'Protect' | 'Grow' | 'Execute' | 'Govern';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  engine: Engine;
  confidence: number;
  timestamp: string;
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-001',
    title: 'Unusual subscription charge detected',
    description: 'A recurring charge of $89 from an unrecognized vendor was flagged.',
    severity: 'critical',
    engine: 'Protect',
    confidence: 0.94,
    timestamp: '2h ago',
  },
  {
    id: 'ALT-002',
    title: 'Cash buffer below target threshold',
    description: 'Current buffer is 12 days vs. 21-day target. Consider deferring non-essential expenses.',
    severity: 'warning',
    engine: 'Execute',
    confidence: 0.88,
    timestamp: '4h ago',
  },
  {
    id: 'ALT-003',
    title: 'Savings goal on track for Q2',
    description: 'At current rate, the emergency fund goal will be met by June 15.',
    severity: 'info',
    engine: 'Grow',
    confidence: 0.91,
    timestamp: '6h ago',
  },
];

const severityTone: Record<Severity, MissionTone> = {
  critical: 'critical',
  warning: 'warning',
  info: 'primary',
};

const engineTone: Record<Engine, MissionTone> = {
  Protect: 'healthy',
  Grow: 'primary',
  Execute: 'warning',
  Govern: 'primary',
};

/**
 * DASH-03: Alerts Hub — prioritized alert feed
 */
export const AlertsHub: React.FC = () => {
  return (
    <article className="dashboard-main-card alerts-hub" data-widget="AlertsHub">
      <header className="alerts-hub-header">
        <strong>Alerts</strong>
        <MissionStatusChip tone="critical" label={String(MOCK_ALERTS.length)} />
      </header>
      <div className="alerts-hub-list">
        {MOCK_ALERTS.map((alert) => (
          <article key={alert.id} className="alerts-hub-item" data-severity={alert.severity}>
            <div className="alerts-hub-tags">
              <MissionStatusChip tone={severityTone[alert.severity]} label={alert.severity.toUpperCase()} />
              <MissionStatusChip tone={engineTone[alert.engine]} label={alert.engine} />
              <span>{alert.timestamp}</span>
            </div>
            <strong>{alert.title}</strong>
            <p>{alert.description}</p>
            <ProofLine
              claim={`Confidence ${alert.confidence}`}
              evidence={`Detected by ${alert.engine} engine`}
              source="Model v3.2"
              accent={getEngineSemantic(alert.engine).colorHex}
            />
          </article>
        ))}
      </div>
    </article>
  );
};
