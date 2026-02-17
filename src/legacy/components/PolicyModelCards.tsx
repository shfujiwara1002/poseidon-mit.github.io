import React from 'react';

export interface ModelCard {
  id: string;
  name: string;
  engine: 'protect' | 'grow' | 'execute' | 'govern';
  version: string;
  accuracy: number;
  limitations: string[];
  lastAudit: string;
  status: 'active' | 'deprecated' | 'beta';
}

interface PolicyModelCardsProps {
  models: ModelCard[];
  onSelect?: (model: ModelCard) => void;
}

const ENGINE_COLORS: Record<string, string> = {
  protect: '#22C55E',
  grow: '#8B5CF6',
  execute: '#EAB308',
  govern: '#3B82F6',
};

const STATUS_CONFIG: Record<ModelCard['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: 'var(--state-healthy)' },
  deprecated: { label: 'Deprecated', color: 'var(--state-critical)' },
  beta: { label: 'Beta', color: 'var(--state-warning)' },
};

function accuracyColor(accuracy: number): string {
  if (accuracy >= 98) return 'var(--state-healthy)';
  if (accuracy >= 95) return 'var(--state-primary)';
  if (accuracy >= 90) return 'var(--state-warning)';
  return 'var(--state-critical)';
}

/**
 * W-V3-GOV06: PolicyModelCards — grid of model cards showing
 * accuracy metrics, limitations, and audit status.
 */
export const PolicyModelCards: React.FC<PolicyModelCardsProps> = ({
  models,
  onSelect,
}) => {
  return (
    <div className="policy-model-cards" data-widget="PolicyModelCards">
      <div className="entry-surface-grid">
        {models.map((model) => {
          const statusCfg = STATUS_CONFIG[model.status];
          return (
            <article
              key={model.id}
              className={`engine-card policy-model-card ${onSelect ? 'audit-table-clickable' : ''}`}
              onClick={() => onSelect?.(model)}
            >
              <header className="policy-model-card-header">
                <strong>{model.name}</strong>
                <span
                  className="mission-status-chip"
                  style={{ borderColor: statusCfg.color, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </header>

              <div className="policy-model-card-meta">
                <span
                  className="audit-table-engine"
                  style={{ color: ENGINE_COLORS[model.engine] }}
                >
                  {model.engine}
                </span>
                <span className="policy-model-card-version">v{model.version}</span>
              </div>

              <div className="policy-model-card-accuracy">
                <span className="policy-model-card-label">Accuracy</span>
                <div className="policy-model-card-bar-track">
                  <div
                    className="policy-model-card-bar-fill"
                    style={{
                      width: `${model.accuracy}%`,
                      background: accuracyColor(model.accuracy),
                    }}
                  />
                </div>
                <span
                  className="policy-model-card-value"
                  style={{ color: accuracyColor(model.accuracy) }}
                >
                  {model.accuracy.toFixed(1)}%
                </span>
              </div>

              <div className="policy-model-card-limitations">
                <span className="policy-model-card-label">Limitations</span>
                <ul>
                  {model.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>

              <footer className="policy-model-card-footer">
                <span className="policy-model-card-audit">
                  Last audit: {model.lastAudit}
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
};
