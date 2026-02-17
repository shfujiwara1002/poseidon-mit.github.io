import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

interface SparklineProps {
  data: Array<{ value: number }>;
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color,
  className = ''
}: SparklineProps) {
  const reducedMotion = useReducedMotionSafe();
  if (!data || data.length < 2) return null;

  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const span = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / span) * (height - 2) - 1;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const polylinePoints = points.join(' ');

  const lengths = data.slice(1).map((_, i) => {
    const [x1, y1] = points[i].split(',').map(Number);
    const [x2, y2] = points[i + 1].split(',').map(Number);
    return Math.hypot(x2 - x1, y2 - y1);
  });
  const pathLength = lengths.reduce((acc, v) => acc + v, 0);

  const trend = data[data.length - 1].value - data[0].value;
  const strokeColor = color || (trend >= 0 ? 'var(--state-healthy)' : 'var(--state-critical)');

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Sparkline trend"
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylinePoints}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: reducedMotion ? 0 : pathLength,
          animation: reducedMotion ? undefined : 'sparkline-draw 420ms ease-out forwards',
        }}
      />
    </svg>
  );
}
