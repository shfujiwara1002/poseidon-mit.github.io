import React from 'react';
import { ChartGlowDefs } from './ChartGlowDefs';

interface ChartFunnelProps {
  stages: { label: string; value: number; color: string }[];
  width?: number;
  height?: number;
  showPercentages?: boolean;
  animated?: boolean;
  style?: React.CSSProperties;
}

export const ChartFunnel: React.FC<ChartFunnelProps> = ({
  stages,
  width = 400,
  height = 300,
  showPercentages = true,
  animated = false,
  style,
}) => {
  const maxVal = Math.max(...stages.map((s) => s.value));
  const stageHeight = (height - (stages.length - 1) * 4) / stages.length;
  const gap = 4;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" fill="none" style={{ overflow: 'visible', ...style }}>
      <ChartGlowDefs />

      {stages.map((stage, i) => {
        const y = i * (stageHeight + gap);
        const topW = (stage.value / maxVal) * width;
        const topX = (width - topW) / 2;
        const bottomW = (stage.value / maxVal) * width * 0.9;
        const bottomX = (width - bottomW) / 2;

        const path = `
          M ${topX},${y} 
          L ${topX + topW},${y} 
          L ${bottomX + bottomW},${y + stageHeight} 
          L ${bottomX},${y + stageHeight} 
          Z
        `;

        return (
          <g
            key={i}
            className={animated ? 'reveal-up' : undefined}
            style={animated ? { animationDelay: `${i * 120}ms` } : undefined}
          >
            <path d={path} fill={stage.color} fillOpacity="0.15" stroke={stage.color} strokeWidth="1" strokeOpacity="0.5" filter="url(#neon-glow-small)" />

            <text x={width / 2} y={y + stageHeight / 2 - 5} fill="white" fontFamily={'var(--font-body)'} fontSize="13" textAnchor="middle">
              {stage.label}
            </text>

            <text x={width / 2} y={y + stageHeight / 2 + 12} fill="white" fontFamily={'var(--font-mono)'} fontSize="14" fontWeight="bold" textAnchor="middle">
              {stage.value.toLocaleString()}
            </text>

            {showPercentages && i < stages.length - 1 && (
              <g transform={`translate(${width - 40}, ${y + stageHeight})`}>
                <text x="0" y="4" fill="white" fillOpacity="0.5" fontFamily={'var(--font-mono)'} fontSize="10">
                  {Math.round((stages[i + 1].value / stage.value) * 100)}%
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
