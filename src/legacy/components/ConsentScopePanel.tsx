import React from 'react';

interface ConsentScopePanelProps {
  /** Data scope being consented to, e.g. "Financial transaction data" */
  scope: string;
  /** Duration of consent, e.g. "12 months" */
  duration: string;
  /** How to revoke consent, e.g. "/settings/rights" */
  revocationPath: string;
  /** Optional list of data categories included */
  dataCategories?: string[];
  /** Whether consent has already been granted */
  granted?: boolean;
  /** Callback when consent is granted or revoked */
  onToggle?: (granted: boolean) => void;
}

/**
 * W-V3-XAI05: ConsentScopePanel — transparent consent display.
 * Used on 4 screens: ACT04, ACT06, EXE02, SET04.
 * Semantic Charter Rule 9: "Consent is transparent" — scope, duration, revocation always visible.
 */
export const ConsentScopePanel: React.FC<ConsentScopePanelProps> = ({
  scope,
  duration,
  revocationPath,
  dataCategories,
  granted = false,
  onToggle,
}) => {
  return (
    <div
      className="consent-scope-panel"
      data-widget="ConsentScopePanel"
      data-slot="consent_scope"
      data-granted={granted}
      onClick={onToggle ? () => onToggle(!granted) : undefined}
      role={onToggle ? 'button' : undefined}
      tabIndex={onToggle ? 0 : undefined}
    >
      <div className="consent-scope-panel-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="consent-scope-panel-title">Consent scope</span>
        {granted && <span className="consent-scope-panel-status">Reviewed</span>}
      </div>

      <div className="consent-scope-panel-body">
        <div className="consent-scope-panel-row">
          <span className="consent-scope-panel-label">Scope</span>
          <span className="consent-scope-panel-value">{scope}</span>
        </div>
        <div className="consent-scope-panel-row">
          <span className="consent-scope-panel-label">Duration</span>
          <span className="consent-scope-panel-value">{duration}</span>
        </div>
        <div className="consent-scope-panel-row">
          <span className="consent-scope-panel-label">Revocation</span>
          <a className="consent-scope-panel-link" href={revocationPath}>
            Manage in Settings
          </a>
        </div>

        {dataCategories && dataCategories.length > 0 && (
          <div className="consent-scope-panel-categories">
            <span className="consent-scope-panel-label">Data categories</span>
            <div className="consent-scope-panel-tags">
              {dataCategories.map((cat) => (
                <span key={cat} className="consent-scope-panel-tag">{cat}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {onToggle && (
        <div className="consent-scope-panel-actions">
          <button
            type="button"
            className={`consent-scope-panel-btn ${granted ? 'consent-scope-panel-btn--revoke' : 'consent-scope-panel-btn--grant'}`}
            onClick={() => onToggle(!granted)}
          >
            {granted ? 'Revoke consent' : 'Grant consent'}
          </button>
        </div>
      )}
    </div>
  );
};
