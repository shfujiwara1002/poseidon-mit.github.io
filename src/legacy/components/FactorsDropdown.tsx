import React, { useState } from 'react';

interface Factor {
  label: string;
  contribution: number;
  note?: string;
}

interface FactorsDropdownProps {
  /** All contributing factors to display */
  allFactors: Factor[];
  /** Human-readable explanation of why this matters */
  whyItMatters: string;
  /** Number of factors to show before collapsing (default: 3) */
  initialVisible?: number;
}

/**
 * W-V3-XAI02: FactorsDropdown — expandable list of all contributing factors.
 * Used on 5 screens: CORE03, PRT02, GRW02, GRW03, EXE02, GOV03.
 * Semantic Charter Rule 3: "No magic numbers" — every factor shows its contribution.
 */
export const FactorsDropdown: React.FC<FactorsDropdownProps> = ({
  allFactors,
  whyItMatters,
  initialVisible = 3,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleFactors = expanded ? allFactors : allFactors.slice(0, initialVisible);
  const hasMore = allFactors.length > initialVisible;

  return (
    <div className="factors-dropdown" data-widget="FactorsDropdown" data-slot="factors_dropdown">
      <div className="factors-dropdown-header">
        <span className="factors-dropdown-title">Contributing factors</span>
        <span className="factors-dropdown-count">{allFactors.length} factors</span>
      </div>

      <div className="factors-dropdown-list">
        {visibleFactors.map((factor) => (
          <div className="factors-dropdown-row" key={factor.label}>
            <div className="factors-dropdown-label">
              <span>{factor.label}</span>
              {factor.note && <span className="factors-dropdown-note">{factor.note}</span>}
            </div>
            <div className="factors-dropdown-bar-track">
              <div
                className="factors-dropdown-bar-fill"
                style={{ width: `${Math.abs(factor.contribution) * 100}%` }}
                data-direction={factor.contribution >= 0 ? 'positive' : 'negative'}
              />
            </div>
            <span className="factors-dropdown-value">
              {factor.contribution >= 0 ? '+' : ''}{Math.round(factor.contribution * 100)}%
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="factors-dropdown-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show fewer' : `Show all ${allFactors.length} factors`}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={expanded ? 'factors-dropdown-chevron--up' : ''}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      <div className="factors-dropdown-why">
        <strong>Why it matters:</strong> {whyItMatters}
      </div>
    </div>
  );
};
