import React, { useMemo } from 'react';
import type { CashFlowPrediction } from '../services/mockGrow';

interface ForecastBandChartProps {
  /** Forecast data with confidence bands */
  data: CashFlowPrediction[];
  /** Chart height in pixels */
  height?: number;
  /** Number of historical data points to highlight */
  historicalCount?: number;
}

/**
 * W-V3-GRW-CHART: ForecastBandChart — historical + forecast + confidence band
 * visualization. Shows uncertainty growing over time with shaded confidence bands.
 */
export const ForecastBandChart: React.FC<ForecastBandChartProps> = ({
  data,
  height = 280,
  historicalCount = 5,
}) => {
  const svgWidth = 720;
  const svgHeight = height;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const { balancePath, bandPath, xScale, yScale, gridLines, dateLabels, splitX } =
    useMemo(() => {
      if (data.length === 0) {
        return { balancePath: '', bandPath: '', xScale: () => 0, yScale: () => 0, gridLines: [], dateLabels: [], splitX: 0 };
      }

      const allValues = data.flatMap((d) => [d.balance, d.lower, d.upper]);
      const minVal = Math.min(...allValues);
      const maxVal = Math.max(...allValues);
      const yPad = (maxVal - minVal) * 0.1 || 100;
      const computedYMin = minVal - yPad;
      const computedYMax = maxVal + yPad;

      const xs = (i: number) => padding.left + (i / (data.length - 1)) * chartW;
      const ys = (v: number) =>
        padding.top + chartH - ((v - computedYMin) / (computedYMax - computedYMin)) * chartH;

      // Balance line path
      const bPath = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(d.balance)}`)
        .join(' ');

      // Confidence band (upper forward, lower backward)
      const upperPoints = data.map((d, i) => `${xs(i)} ${ys(d.upper)}`);
      const lowerPoints = [...data].reverse().map((d, i) => `${xs(data.length - 1 - i)} ${ys(d.lower)}`);
      const bBand = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

      // Y-axis grid lines (5 lines)
      const grid: number[] = [];
      const step = (computedYMax - computedYMin) / 4;
      for (let i = 0; i <= 4; i++) {
        grid.push(computedYMin + step * i);
      }

      // Date labels (show ~5 dates)
      const labels: Array<{ x: number; label: string }> = [];
      const labelCount = Math.min(5, data.length);
      for (let i = 0; i < labelCount; i++) {
        const idx = Math.round((i / (labelCount - 1)) * (data.length - 1));
        const d = data[idx];
        const month = d.date.toLocaleString('en-US', { month: 'short' });
        const day = d.date.getDate();
        labels.push({ x: xs(idx), label: `${month} ${day}` });
      }

      const hSplit = Math.min(historicalCount, data.length - 1);

      return {
        balancePath: bPath,
        bandPath: bBand,
        xScale: xs,
        yScale: ys,
        gridLines: grid,
        dateLabels: labels,
        splitX: xs(hSplit),
      };
    }, [data, chartW, chartH, historicalCount, padding.left, padding.top]);

  if (data.length === 0) {
    return (
      <div className="forecast-band-chart forecast-band-chart--empty" data-widget="ForecastBandChart">
        <p>No forecast data available.</p>
      </div>
    );
  }

  return (
    <div className="forecast-band-chart" data-widget="ForecastBandChart">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Forecast band chart"
      >
        <defs>
          <linearGradient id="forecastBand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(134,244,201,0.20)" />
            <stop offset="100%" stopColor="rgba(134,244,201,0.02)" />
          </linearGradient>
          <linearGradient id="forecastLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86f4c9" />
            <stop offset="100%" stopColor="#4ac9a1" />
          </linearGradient>
          <linearGradient id="historicalLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="#86f4c9" />
          </linearGradient>
          {/* Vertical dashed line at split point */}
        </defs>

        {/* Y-axis grid lines */}
        {gridLines.map((val) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={yScale(val)}
              x2={svgWidth - padding.right}
              y2={yScale(val)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={yScale(val)}
              textAnchor="end"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.35)"
              fontSize="11"
            >
              ${Math.round(val).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Historical/forecast split line */}
        <line
          x1={splitX}
          y1={padding.top}
          x2={splitX}
          y2={svgHeight - padding.bottom}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x={splitX}
          y={padding.top - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
        >
          Today
        </text>

        {/* Confidence band */}
        <path d={bandPath} fill="url(#forecastBand)" />

        {/* Balance line */}
        <path
          d={balancePath}
          fill="none"
          stroke="url(#forecastLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Endpoint dot */}
        {data.length > 0 && (
          <circle
            cx={xScale(data.length - 1)}
            cy={yScale(data[data.length - 1].balance)}
            r="4"
            fill="#4ac9a1"
            style={{ filter: 'drop-shadow(0 0 4px rgba(110,230,187,0.5))' }}
          />
        )}

        {/* X-axis date labels */}
        {dateLabels.map((dl) => (
          <text
            key={dl.label}
            x={dl.x}
            y={svgHeight - 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="11"
          >
            {dl.label}
          </text>
        ))}
      </svg>
    </div>
  );
};
