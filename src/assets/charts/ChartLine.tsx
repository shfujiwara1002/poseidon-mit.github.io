import React, { useRef, useEffect, useState } from 'react';
import { ChartGlowDefs } from './ChartGlowDefs';

interface ChartLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showArea?: boolean;
  showGrid?: boolean;
  highlightLastPoint?: boolean;
  calloutLabel?: string;
  smooth?: boolean;
  smoothTension?: number;
  showConfidenceBand?: boolean;
  confidenceUpper?: number[];
  confidenceLower?: number[];
  confidenceColor?: string;
  showDotGrid?: boolean;
  showAxisLabels?: boolean;
  xLabels?: string[];
  secondaryData?: number[];
  secondaryColor?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

const getCatmullRomPath = (points: { x: number; y: number }[], tension: number = 0.3): string => {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
};

export const ChartLine: React.FC<ChartLineProps> = ({
  data,
  width = 400,
  height = 200,
  color = 'var(--accent-cyan)',
  strokeWidth = 3,
  showArea = true,
  showGrid = true,
  highlightLastPoint = true,
  calloutLabel,
  smooth = true,
  smoothTension = 0.35,
  showConfidenceBand = false,
  confidenceUpper,
  confidenceLower,
  confidenceColor,
  showDotGrid = false,
  showAxisLabels = false,
  xLabels,
  secondaryData,
  secondaryColor = 'var(--accent-violet)',
  animated = false,
  style,
}) => {
  const mainPathRef = useRef<SVGPathElement>(null);
  const secondaryPathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(1000);
  const [secPathLength, setSecPathLength] = useState(1000);

  useEffect(() => {
    if (animated && mainPathRef.current) {
      setPathLength(mainPathRef.current.getTotalLength());
    }
  }, [animated, data]);

  useEffect(() => {
    if (animated && secondaryPathRef.current) {
      setSecPathLength(secondaryPathRef.current.getTotalLength());
    }
  }, [animated, secondaryData]);

  if (data.length < 2) return null;

  const allValues = [...data, ...(secondaryData || []), ...(confidenceUpper || []), ...(confidenceLower || [])];
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const paddedRange = range * 1.2;
  const paddedMin = min - range * 0.1;

  const mapPoint = (val: number, idx: number, total: number) => ({
    x: (idx / (total - 1)) * width,
    y: height - ((val - paddedMin) / paddedRange) * height,
  });

  const pointsArray = data.map((d, i) => mapPoint(d, i, data.length));

  const linePath = smooth
    ? getCatmullRomPath(pointsArray, smoothTension)
    : pointsArray.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const areaPath = `
    ${linePath}
    L ${width},${height}
    L 0,${height}
    Z
  `;

  let secondaryPoints: { x: number; y: number }[] = [];
  let secondaryPath = '';
  if (secondaryData && secondaryData.length > 0) {
    secondaryPoints = secondaryData.map((d, i) => mapPoint(d, i, secondaryData.length));
    secondaryPath = smooth
      ? getCatmullRomPath(secondaryPoints, smoothTension)
      : secondaryPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  }

  let bandPath = '';
  if (showConfidenceBand && confidenceUpper && confidenceLower && confidenceUpper.length === data.length) {
    const upperPoints = confidenceUpper.map((d, i) => mapPoint(d, i, confidenceUpper.length));
    const lowerPoints = confidenceLower.map((d, i) => mapPoint(d, i, confidenceLower.length));
    const lowerPointsReversed = [...lowerPoints].reverse();
    let d = getCatmullRomPath(upperPoints, smoothTension);
    const lastLower = lowerPoints[lowerPoints.length - 1];
    d += ` L ${lastLower.x},${lastLower.y}`;
    lowerPointsReversed.forEach((p) => {
      d += ` L ${p.x},${p.y}`;
    });
    d += ' Z';
    bandPath = d;
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" fill="none" style={{ overflow: 'visible', ...style }}>
      <ChartGlowDefs />

      {showDotGrid ? (
        <rect x="0" y="0" width={width} height={height} fill="url(#chart-dot-grid)" opacity="0.5" />
      ) : showGrid ? (
        <g>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = height * ratio;
            return (
              <line
                key={`h-${ratio}`}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke={'var(--glass-border)'}
                strokeWidth="1"
                strokeOpacity={ratio === 1 ? '0.3' : '0.1'}
              />
            );
          })}
        </g>
      ) : null}

      {showConfidenceBand && bandPath && (
        <path d={bandPath} fill={confidenceColor || color} fillOpacity="0.15" stroke="none" />
      )}

      {showArea && (
        <g className={animated ? 'chart-area-animated' : undefined}>
          <path d={areaPath} fill={color} fillOpacity="0.1" />
          <path d={areaPath} fill="url(#holo-scanlines)" opacity="0.2" />
          <path d={linePath} stroke="none" fill="url(#chart-fade-gradient)" />
        </g>
      )}

      {secondaryData && (
        <path
          ref={secondaryPathRef}
          d={secondaryPath}
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
          strokeOpacity="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#neon-glow-small)"
          className={animated ? 'chart-line-animated' : undefined}
          style={animated ? { '--path-length': secPathLength } as React.CSSProperties : undefined}
        />
      )}

      <path
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth + 6}
        strokeOpacity="0.2"
        fill="none"
        filter="url(#soft-halo)"
        className={animated ? 'chart-line-animated' : undefined}
        style={animated ? { '--path-length': pathLength } as React.CSSProperties : undefined}
      />
      <path
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth + 2}
        strokeOpacity="0.4"
        fill="none"
        filter="url(#neon-glow)"
        className={animated ? 'chart-line-animated' : undefined}
        style={animated ? { '--path-length': pathLength } as React.CSSProperties : undefined}
      />
      <path
        ref={mainPathRef}
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity="1"
        fill="none"
        filter="url(#neon-glow-small)"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'chart-line-animated' : undefined}
        style={animated ? { '--path-length': pathLength } as React.CSSProperties : undefined}
      />

      {pointsArray.map((p, i) => {
        const isLast = i === pointsArray.length - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 5 : 2.5}
              fill={color}
              stroke="white"
              strokeWidth={isLast ? 1.5 : 0.5}
              filter={isLast ? 'url(#strong-bloom)' : 'url(#neon-glow-small)'}
              className={animated ? 'chart-point-animated' : undefined}
              style={animated ? { animationDelay: `${1000 + i * 80}ms` } : undefined}
            />

            {isLast && highlightLastPoint && (
              <g>
                <rect x={p.x - 35} y={p.y - 35} width={70} height={24} rx={4} fill="rgba(2,4,16,0.8)" stroke={color} strokeWidth="1" />
                <text
                  x={p.x}
                  y={p.y - 18}
                  fill="white"
                  fontFamily={'var(--font-mono)'}
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  filter="url(#neon-glow-small)"
                >
                  {calloutLabel || data[i]}
                </text>
              </g>
            )}

            {showAxisLabels && xLabels && xLabels[i] && (
              <text x={p.x} y={height + 20} fill="white" fillOpacity="0.6" fontFamily={'var(--font-mono)'} fontSize="11" textAnchor="middle">
                {xLabels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
