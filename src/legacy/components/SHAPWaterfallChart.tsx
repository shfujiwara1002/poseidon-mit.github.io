import { theme } from '../shared/theme';
import type { ShapFeature } from '../services/mockProtect';

export interface SHAPWaterfallChartProps {
  features: ShapFeature[];
  baseValue: number;
  prediction: number;
}

export function SHAPWaterfallChart({ features, baseValue, prediction }: SHAPWaterfallChartProps) {
  // Sort features by absolute SHAP value
  const sortedFeatures = [...features].sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  // Calculate cumulative values for waterfall
  let cumulative = baseValue;
  const chartData = sortedFeatures.map(f => {
    const start = cumulative;
    const delta = f.impact === 'increases' ? Math.abs(f.shapValue) : -Math.abs(f.shapValue);
    cumulative += delta;
    return {
      feature: f,
      start,
      end: cumulative,
      delta,
      height: Math.abs(f.shapValue)
    };
  });

  // Find max/min for scaling
  const allValues = [baseValue, prediction, ...chartData.map(d => d.start), ...chartData.map(d => d.end)];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const scale = (value: number) => {
    return ((value - minValue + padding) / (range + 2 * padding)) * 100;
  };

  const barWidth = 60;
  const barGap = 40;
  const totalWidth = (chartData.length + 2) * (barWidth + barGap);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: `${Math.max(totalWidth, 600)}px`, position: 'relative', height: '400px' }}>
        {/* SVG Chart */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = `${100 - ratio * 100}%`;
            const value = minValue - padding + ratio * (range + 2 * padding);
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="3,3"
                />
                <text
                  x="8"
                  y={y}
                  dy="-4"
                  fill={theme.colors.neutral}
                  fontSize="11"
                >
                  {value.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Base value bar */}
          <g>
            <rect
              x={barGap}
              y={`${100 - scale(baseValue)}%`}
              width={barWidth}
              height="4"
              fill={theme.colors.neutral}
              opacity="0.8"
            />
            <text
              x={barGap + barWidth / 2}
              y="95%"
              fill={theme.colors.neutral}
              fontSize="11"
              textAnchor="middle"
            >
              Base
            </text>
            <text
              x={barGap + barWidth / 2}
              y={`${100 - scale(baseValue)}%`}
              dy="-8"
              fill="#fff"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
            >
              {baseValue.toFixed(2)}
            </text>
          </g>

          {/* Feature bars */}
          {chartData.map((d, i) => {
            const x = (i + 1) * (barWidth + barGap) + barGap;
            const barStart = Math.min(d.start, d.end);
            const barEnd = Math.max(d.start, d.end);
            const barY = `${100 - scale(barEnd)}%`;
            const barHeight = `${scale(barEnd) - scale(barStart)}%`;
            const color = d.delta > 0 ? theme.colors.error : theme.colors.success;

            return (
              <g key={i}>
                {/* Connector line from previous bar */}
                {i > 0 && (
                  <line
                    x1={x - barGap + barWidth / 2}
                    y1={`${100 - scale(chartData[i - 1].end)}%`}
                    x2={x + barWidth / 2}
                    y2={`${100 - scale(d.start)}%`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Bar */}
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={`${color}40`}
                  stroke={color}
                  strokeWidth="2"
                  rx="4"
                />

                {/* Feature name */}
                <text
                  x={x + barWidth / 2}
                  y="95%"
                  fill={theme.colors.neutral}
                  fontSize="10"
                  textAnchor="middle"
                >
                  {d.feature.feature}
                </text>

                {/* Impact value */}
                <text
                  x={x + barWidth / 2}
                  y={barY}
                  dy={d.delta > 0 ? '-8' : '16'}
                  fill={color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {d.delta > 0 ? '+' : ''}{d.delta.toFixed(3)}
                </text>
              </g>
            );
          })}

          {/* Final prediction bar */}
          <g>
            <rect
              x={(chartData.length + 1) * (barWidth + barGap) + barGap}
              y={`${100 - scale(prediction)}%`}
              width={barWidth}
              height="4"
              fill={theme.colors.info}
              opacity="0.9"
            />
            <text
              x={(chartData.length + 1) * (barWidth + barGap) + barGap + barWidth / 2}
              y="95%"
              fill={theme.colors.info}
              fontSize="11"
              textAnchor="middle"
            >
              Prediction
            </text>
            <text
              x={(chartData.length + 1) * (barWidth + barGap) + barGap + barWidth / 2}
              y={`${100 - scale(prediction)}%`}
              dy="-8"
              fill={theme.colors.info}
              fontSize="13"
              fontWeight="700"
              textAnchor="middle"
            >
              {prediction.toFixed(2)}
            </text>
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${theme.colors.error}40`, border: `2px solid ${theme.colors.error}` }} />
            <span className="text-gray-400">Increases risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: `${theme.colors.success}40`, border: `2px solid ${theme.colors.success}` }} />
            <span className="text-gray-400">Decreases risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
