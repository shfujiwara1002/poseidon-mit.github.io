import React from 'react';
import { ChartGlowDefs } from './ChartGlowDefs';

interface ChartTimelineProps {
  phases: {
    label: string;
    value?: string;
    color: string;
    progress?: number;
  }[];
  width?: number;
  height?: number;
  showConnectors?: boolean;
  showProgress?: boolean;
  style?: React.CSSProperties;
}

export const ChartTimeline: React.FC<ChartTimelineProps> = ({
  phases,
  width,
  height = 100,
  showConnectors = true,
  showProgress = true,
  style,
}) => {
  const svgWidth = width ?? 600;
  const trackWidth = svgWidth - 100;
  const startX = 50;
  const centerY = height / 2;
  const gap = trackWidth / (phases.length - 1);

  return (
    <svg
      width={width ?? '100%'}
      height={height}
      viewBox={`0 0 ${svgWidth} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      style={{ width: width ? undefined : '100%', height: width ? undefined : 'auto', overflow: 'visible', ...style }}
    >
      <ChartGlowDefs />

      <defs>
        <linearGradient id="timeline-track-grad" x1="0" y1="0" x2="1" y2="0">
          {phases.map((p, i) => (
            <stop key={i} offset={`${(i / (phases.length - 1)) * 100}%`} stopColor={p.color} stopOpacity="0.5" />
          ))}
        </linearGradient>
      </defs>

      {phases.map((p, i) => {
        if (i === phases.length - 1) return null;
        const x1 = startX + i * gap;
        const x2 = startX + (i + 1) * gap;

        return (
          <g key={`track-${i}`}>
            {showConnectors && (
              <line x1={x1} y1={centerY} x2={x2} y2={centerY} stroke={p.color} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            )}
            {showProgress && p.progress !== undefined && p.progress > 0 && (
              <line x1={x1} y1={centerY} x2={x1 + gap * p.progress} y2={centerY} stroke={p.color} strokeWidth="2" filter="url(#neon-glow-small)" />
            )}
          </g>
        );
      })}

      {phases.map((p, i) => {
        const x = startX + i * gap;
        return (
          <g key={i}>
            <circle cx={x} cy={centerY} r={8} fill={'var(--bg)'} stroke={p.color} strokeWidth="2" filter="url(#neon-glow-small)" />
            {(p.progress === 1 || p.progress === undefined) && <circle cx={x} cy={centerY} r={3} fill={p.color} />}

            <text x={x} y={centerY + 25} fill="white" fillOpacity="0.8" fontFamily={'var(--font-body)'} fontSize="13" textAnchor="middle">
              {p.label}
            </text>

            {p.value && (
              <text x={x} y={centerY + 40} fill={p.color} fontFamily={'var(--font-mono)'} fontSize="11" textAnchor="middle">
                {p.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
