import React from 'react';

interface ActionOutcomePreviewProps {
  /** Expected outcome description */
  outcome: string;
  /** Window during which action can be reversed, e.g. "24h" */
  reversibleWindow: string;
  /** List of potential side effects */
  sideEffects: string[];
  /** Optional monetary impact */
  impact?: string;
  /** Whether action is currently reversible */
  reversible?: boolean;
}

/**
 * W-V3-XAI03: ActionOutcomePreview — shows what will happen before user commits.
 * Used on 4 screens: PRT02, GRW02, GRW03, EXE02.
 * Semantic Charter Rule 5: "Show outcome before commitment"
 */
export const ActionOutcomePreview: React.FC<ActionOutcomePreviewProps> = ({
  outcome,
  reversibleWindow,
  sideEffects,
  impact,
  reversible = true,
}) => {
  return (
    <div
      className="action-outcome-preview"
      data-widget="ActionOutcomePreview"
      data-slot="action_preview"
    >
      <div className="action-outcome-preview-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="action-outcome-preview-title">Outcome preview</span>
      </div>

      <div className="action-outcome-preview-body">
        <p className="action-outcome-preview-outcome">{outcome}</p>

        {impact && (
          <div className="action-outcome-preview-impact">
            <span className="action-outcome-preview-impact-label">Impact:</span>
            <span className="action-outcome-preview-impact-value">{impact}</span>
          </div>
        )}

        <div className="action-outcome-preview-reversibility">
          <span
            className="action-outcome-preview-badge"
            data-reversible={reversible}
          >
            {reversible ? 'Reversible' : 'Irreversible'}
          </span>
          <span className="action-outcome-preview-window">
            Window: {reversibleWindow}
          </span>
        </div>

        {sideEffects.length > 0 && (
          <div className="action-outcome-preview-effects">
            <span className="action-outcome-preview-effects-label">Side effects:</span>
            <ul className="action-outcome-preview-effects-list">
              {sideEffects.map((effect) => (
                <li key={effect}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
