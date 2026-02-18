import React from 'react';
import { ChartGlowDefs } from './ChartGlowDefs';

interface ChartBarProps {
  data: { value: number; label: string; color?: string }[];
  width?: number;
  height?: number;
  color?: string;
  showReflection?: boolean;
  showScanlines?: boolean;
  barRadius?: number;
  showValueLabels?: boolean;
  valueFormat?: (v: number) => string;
  showGrid?: boolean;
  barGap?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}

export const ChartBar: React.FC<ChartBarProps> = ({
  data,
  width = 400,
  height = 200,
  color = 'var(--accent-cyan)',
  showReflection = true,
  showScanlines = true,
  barRadius = 4,
  showValueLabels = true,
  valueFormat = (v) => v.toLocaleString(),
  showGrid = true,
  barGap = 0.4,
  animated = false,
  style,
}) => {
  const max = Math.max(...data.map((d) => d.value));
  const range = max * 1.1;
  const totalBars = data.length;
  const slotWidth = width / totalBars;
  const barWidth = slotWidth * (1 - barGap);
  const sidePadding = (slotWidth - barWidth) / 2;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" fill="none" style={{ overflow: 'visible', ...style }}>
      <ChartGlowDefs />

      {showGrid && (
        <g opacity="1">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const lineY = height * ratio;
            return (
              <line
                key={`h-${ratio}`}
                x1="0"
                y1={lineY}
                x2={width}
                y2={lineY}
                stroke={'var(--glass-border)'}
                strokeWidth="1"
                strokeOpacity={ratio === 1 ? '0.25' : '0.08'}
              />
            );
          })}
        </g>
      )}

      {data.map((d, i) => {
        const barColor = d.color || color;
        const barHeight = (d.value / range) * height;
        const x = i * slotWidth + sidePadding;
        const y = height - barHeight;
        const gradId = `bar-grad-${i}`;

        return (
          <g
            key={i}
            className={animated ? 'chart-bar-animated' : undefined}
            style={animated ? { animationDelay: `${i * 100}ms` } : undefined}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={barColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={barColor} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {showReflection && (
              <g opacity="0.4">
                <rect x={x} y={height} width={barWidth} height={barHeight * 0.3} fill={`url(#bar-reflection-gradient-colored-${i})`} />
                <defs>
                  <linearGradient id={`bar-reflection-gradient-colored-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={barColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={barColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
              </g>
            )}

            <rect x={x} y={y} width={barWidth} height={barHeight} rx={barRadius} fill={barColor} fillOpacity="0.03" />
            <rect x={x} y={y} width={barWidth} height={barHeight} rx={barRadius} fill={`url(#${gradId})`} stroke="none" />

            {showScanlines && (
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={barRadius} fill="url(#holo-scanlines)" fillOpacity="0.15" />
            )}

            <rect x={x} y={y} width={1} height={barHeight} fill="white" fillOpacity="0.15" />
            <rect x={x} y={y} width={barWidth} height={2} fill="white" filter="url(#neon-glow-small)" fillOpacity="0.8" />

            {showValueLabels && (
              <text
                x={x + barWidth / 2}
                y={y - 12}
                fill="white"
                fontFamily={'var(--font-display)'}
                fontSize="14"
                textAnchor="middle"
                filter="url(#neon-glow-small)"
              >
                {valueFormat(d.value)}
              </text>
            )}

            <text
              x={x + barWidth / 2}
              y={height + 20}
              fill="white"
              fillOpacity="0.6"
              fontFamily={'var(--font-mono)'}
              fontSize="12"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
