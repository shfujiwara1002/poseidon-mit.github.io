import React from 'react';

type RiskBand = 'critical' | 'high' | 'medium' | 'low';
type TrendDirection = 'up' | 'down' | 'stable';

interface RiskScoreDialProps {
  /** Composite risk score 0–1 */
  score: number;
  /** Risk band label */
  band: RiskBand;
  /** Score trend direction */
  trend: TrendDirection;
  /** Optional trend delta string, e.g. "+0.05" */
  trendDelta?: string;
  /** Optional label override */
  label?: string;
}

const BAND_COLORS: Record<RiskBand, { stroke: string; glow: string }> = {
  critical: { stroke: '#ff4d6a', glow: 'rgba(255,77,106,0.35)' },
  high: { stroke: '#ff9c60', glow: 'rgba(255,156,96,0.30)' },
  medium: { stroke: '#ffd78c', glow: 'rgba(255,215,140,0.25)' },
  low: { stroke: '#6ee6bb', glow: 'rgba(110,230,187,0.30)' },
};

const BAND_LABELS: Record<RiskBand, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const TREND_ARROWS: Record<TrendDirection, string> = {
  up: '\u2191',
  down: '\u2193',
  stable: '\u2192',
};

/**
 * W-V3-PRT-DIAL: RiskScoreDial — SVG arc gauge displaying composite threat level.
 * Shows score (0–1), risk band, and trend direction.
 */
export const RiskScoreDial: React.FC<RiskScoreDialProps> = ({
  score,
  band,
  trend,
  trendDelta,
  label,
}) => {
  const colors = BAND_COLORS[band];
  const clampedScore = Math.max(0, Math.min(1, score));

  // Arc geometry: 240° sweep from 150° to 390° (mapped to SVG coords)
  const cx = 100;
  const cy = 100;
  const r = 80;
  const startAngle = 150;
  const totalSweep = 240;
  const endAngle = startAngle + totalSweep * clampedScore;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (angle: number) => cx + r * Math.cos(toRad(angle));
  const arcY = (angle: number) => cy + r * Math.sin(toRad(angle));

  // Background arc
  const bgEndAngle = startAngle + totalSweep;
  const bgLargeArc = totalSweep > 180 ? 1 : 0;
  const bgPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${bgLargeArc} 1 ${arcX(bgEndAngle)} ${arcY(bgEndAngle)}`;

  // Value arc
  const valueSweep = totalSweep * clampedScore;
  const valueLargeArc = valueSweep > 180 ? 1 : 0;
  const valuePath =
    clampedScore > 0.01
      ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${valueLargeArc} 1 ${arcX(endAngle)} ${arcY(endAngle)}`
      : '';

  return (
    <div
      className="risk-score-dial"
      data-widget="RiskScoreDial"
      data-band={band}
    >
      <svg viewBox="0 0 200 160" className="risk-score-dial-svg">
        <defs>
          <filter id="riskGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={bgPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#riskGlow)"
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
        )}

        {/* Endpoint dot */}
        {clampedScore > 0.01 && (
          <circle
            cx={arcX(endAngle)}
            cy={arcY(endAngle)}
            r="6"
            fill={colors.stroke}
            style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
          />
        )}

        {/* Score text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="central"
          className="risk-score-dial-value"
          fill="white"
          fontSize="32"
          fontWeight="700"
        >
          {clampedScore.toFixed(2)}
        </text>

        {/* Band label */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          dominantBaseline="central"
          fill={colors.stroke}
          fontSize="13"
          fontWeight="600"
          letterSpacing="0.5"
        >
          {(label ?? BAND_LABELS[band]).toUpperCase()}
        </text>
      </svg>

      <div className="risk-score-dial-trend" data-trend={trend}>
        <span className="risk-score-dial-trend-arrow" style={{ color: colors.stroke }}>
          {TREND_ARROWS[trend]}
        </span>
        {trendDelta && (
          <span className="risk-score-dial-trend-delta">{trendDelta}</span>
        )}
      </div>
    </div>
  );
};
