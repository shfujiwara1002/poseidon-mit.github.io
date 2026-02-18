import React from 'react';
import { ChartGlowDefs } from './ChartGlowDefs';

interface ChartRadarProps {
  axes: { label: string; value: number; maxValue: number; color?: string }[];
  width?: number;
  height?: number;
  rings?: number;
  showLabels?: boolean;
  showValues?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  style?: React.CSSProperties;
}

const getRadarPoint = (
  center: { x: number; y: number },
  radius: number,
  angleIndex: number,
  totalAngles: number,
  valueRatio: number
) => {
  const angle = (Math.PI * 2 * angleIndex) / totalAngles - Math.PI / 2;
  const dist = radius * valueRatio;
  return {
    x: center.x + dist * Math.cos(angle),
    y: center.y + dist * Math.sin(angle),
  };
};

export const ChartRadar: React.FC<ChartRadarProps> = ({
  axes,
  width = 300,
  height = 300,
  rings = 4,
  showLabels = true,
  showValues = true,
  fillColor = 'var(--accent-teal)',
  fillOpacity = 0.2,
  strokeColor = 'var(--accent-teal)',
  style,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  const totalAxes = axes.length;

  const points = axes.map((axis, i) =>
    getRadarPoint({ x: cx, y: cy }, radius, i, totalAxes, Math.min(1, Math.max(0, axis.value / axis.maxValue)))
  );
  const polyString = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" fill="none" style={{ overflow: 'visible', ...style }}>
      <ChartGlowDefs />

      {Array.from({ length: rings }).map((_, r) => {
        const ratio = (r + 1) / rings;
        const ringPoints = axes.map((_, i) => getRadarPoint({ x: cx, y: cy }, radius, i, totalAxes, ratio));
        const ringPoly = ringPoints.map((p) => `${p.x},${p.y}`).join(' ');

        return <polygon key={`ring-${r}`} points={ringPoly} fill="none" stroke="white" strokeWidth="1" strokeOpacity={0.06 + r * 0.03} />;
      })}

      {axes.map((_axis, i) => {
        const end = getRadarPoint({ x: cx, y: cy }, radius, i, totalAxes, 1);
        return <line key={`axis-${i}`} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="white" strokeOpacity="0.08" strokeWidth="1" />;
      })}

      <polygon points={polyString} fill={fillColor} fillOpacity={fillOpacity} stroke="none" filter="url(#neon-glow-small)" />
      <polygon points={polyString} fill="none" stroke={strokeColor} strokeWidth="2" filter="url(#neon-glow-small)" />

      {points.map((p, i) => {
        const axis = axes[i];
        const labelPos = getRadarPoint({ x: cx, y: cy }, radius + 20, i, totalAxes, 1);

        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={axis.color || strokeColor} stroke="white" strokeWidth="1" filter="url(#neon-glow-small)" />
            {showLabels && (
              <text x={labelPos.x} y={labelPos.y} fill="white" fillOpacity="0.7" fontFamily={'var(--font-mono)'} fontSize="11" textAnchor="middle" dominantBaseline="middle">
                {axis.label}
              </text>
            )}
            {showValues && (
              <text
                x={p.x + (p.x > cx ? 10 : -10)}
                y={p.y + (p.y > cy ? 10 : -10)}
                fill={axis.color || strokeColor}
                fontFamily={'var(--font-mono)'}
                fontSize="10"
                textAnchor={p.x > cx ? 'start' : 'end'}
                dominantBaseline="middle"
              >
                {axis.value}%
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
