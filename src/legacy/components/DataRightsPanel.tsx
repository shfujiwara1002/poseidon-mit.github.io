import React from 'react';

export interface DataRight {
  id: string;
  title: string;
  article: string;
  status: 'available' | 'pending' | 'completed' | 'restricted';
  lastExercised?: string;
}

export interface DataRightAction {
  id: string;
  type: 'export' | 'delete' | 'restrict' | 'revoke';
  label: string;
  description: string;
  destructive?: boolean;
}

interface DataRightsPanelProps {
  rights: DataRight[];
  actions: DataRightAction[];
  onAction?: (actionId: string) => void;
}

const STATUS_CONFIG: Record<DataRight['status'], { label: string; color: string }> = {
  available: { label: 'Available', color: 'var(--state-healthy)' },
  pending: { label: 'Pending', color: 'var(--state-warning)' },
  completed: { label: 'Completed', color: 'var(--state-primary)' },
  restricted: { label: 'Restricted', color: 'var(--state-critical)' },
};

const ACTION_ICONS: Record<DataRightAction['type'], string> = {
  export: '↓',
  delete: '✕',
  restrict: '⊘',
  revoke: '↩',
};

/**
 * W-V3-SET04: DataRightsPanel — GDPR rights display with
 * export/delete/restrict/revoke actions and status tracking.
 */
export const DataRightsPanel: React.FC<DataRightsPanelProps> = ({
  rights,
  actions,
  onAction,
}) => {
  return (
    <div className="data-rights-panel" data-widget="DataRightsPanel">
      <div className="data-rights-list">
        {rights.map((right) => {
          const statusCfg = STATUS_CONFIG[right.status];
          return (
            <div key={right.id} className="data-rights-item">
              <div className="data-rights-item-info">
                <strong className="data-rights-item-title">{right.title}</strong>
                <span className="data-rights-item-article">{right.article}</span>
              </div>
              <div className="data-rights-item-status">
                <span
                  className="mission-status-chip"
                  style={{ borderColor: statusCfg.color, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
                {right.lastExercised && (
                  <span className="data-rights-item-last">
                    Last: {right.lastExercised}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="data-rights-actions">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`entry-btn ${action.destructive ? 'entry-btn--ghost' : 'entry-btn--primary'}`}
            onClick={() => onAction?.(action.id)}
            style={action.destructive ? { borderColor: 'var(--state-critical)', color: 'var(--state-critical)' } : undefined}
          >
            <span className="data-rights-action-icon">{ACTION_ICONS[action.type]}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
