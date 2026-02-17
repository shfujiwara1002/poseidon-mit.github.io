import React from 'react';
import { Card } from './Card';

interface TrustComponent {
  label: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrustIndexCardProps {
  /** Overall trust score 0–100 */
  score: number;
  /** Trend direction */
  trend: 'up' | 'down' | 'stable';
  /** Sub-component scores */
  components: TrustComponent[];
  /** Last updated label */
  updatedAt?: string;
}

const TREND_ICON: Record<string, string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const TREND_CLASS: Record<string, string> = {
  up: 'trust-index-trend--up',
  down: 'trust-index-trend--down',
  stable: 'trust-index-trend--stable',
};

function scoreColor(score: number): string {
  if (score >= 90) return 'var(--state-healthy)';
  if (score >= 75) return 'var(--state-primary)';
  if (score >= 50) return 'var(--state-warning)';
  return 'var(--state-critical)';
}

/**
 * W-V3-GOV-TRUST: TrustIndexCard — composite trust score visualization
 * with 4 sub-component gauges. Used on GOV01.
 */
export const TrustIndexCard: React.FC<TrustIndexCardProps> = ({
  score,
  trend,
  components,
  updatedAt,
}) => {
  // SVG ring parameters
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <Card variant="metric" as="div" className="trust-index-card" data-widget="TrustIndexCard">
      <div className="trust-index-card-score">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={scoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference - progress}`}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="trust-index-card-score-label">
          <span className="trust-index-card-score-value">{score}</span>
          <span className="trust-index-card-score-max">/ 100</span>
          <span className={`trust-index-card-trend ${TREND_CLASS[trend]}`}>
            {TREND_ICON[trend]} {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      <div className="trust-index-card-components">
        {components.map((comp) => (
          <div className="trust-index-card-component" key={comp.label}>
            <div className="trust-index-card-component-header">
              <span className="trust-index-card-component-label">{comp.label}</span>
              <span className="trust-index-card-component-score">{comp.score}%</span>
              <span className={`trust-index-card-component-trend ${TREND_CLASS[comp.trend]}`}>
                {TREND_ICON[comp.trend]}
              </span>
            </div>
            <div className="trust-index-card-component-bar">
              <div
                className="trust-index-card-component-fill"
                style={{
                  width: `${comp.score}%`,
                  backgroundColor: scoreColor(comp.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {updatedAt && (
        <div className="trust-index-card-updated">
          Last updated: {updatedAt}
        </div>
      )}
    </Card>
  );
};
