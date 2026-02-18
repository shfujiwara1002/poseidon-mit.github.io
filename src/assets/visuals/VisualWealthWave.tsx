import React from 'react';
interface VisualWealthWaveProps {
  width?: number;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const VisualWealthWave: React.FC<VisualWealthWaveProps> = ({
  width: _width = 400,
  height = 200,
  color = 'var(--engine-grow)',
  style,
}) => {
  const pathD = 'M0 150 C 100 150, 100 50, 200 50 C 300 50, 300 100, 400 20';
  const areaD = `${pathD} L 400 200 L 0 200 Z`;
  const uid = `ww-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width="100%" height={height} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" fill="none" style={style}>
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#${uid}-grad)`}
        stroke="none"
        className="wealth-wave-area"
      />
      <path
        d={pathD}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className="wealth-wave-line"
        pathLength="1"
      />
    </svg>
  );
};
