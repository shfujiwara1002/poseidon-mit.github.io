import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

export interface ScoreRingProps {
  /** Score value (0-100) */
  score: number;
  /** Maximum score (default 100) */
  maxScore?: number;
  /** Label shown above the ring */
  label?: string;
  /** Status text below the score */
  statusText?: string;
  /** Subtitle below the score (e.g., "/ 100") */
  subtitle?: string;
  /** Ring stroke color — CSS variable or hex */
  color?: string;
  /** Optional gradient end color for gradient stroke */
  gradientEnd?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

const sizeConfig = {
  sm: { radius: 40, stroke: 6, svgSize: 100, textSize: 'text-2xl' },
  md: { radius: 60, stroke: 8, svgSize: 150, textSize: 'text-3xl' },
  lg: { radius: 80, stroke: 10, svgSize: 200, textSize: 'text-5xl' },
} as const;

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  maxScore = 100,
  label,
  statusText,
  subtitle,
  color = 'var(--accent-teal)',
  gradientEnd,
  size = 'lg',
  className,
}) => {
  const prefersReduced = useReducedMotionSafe();
  const circleRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(prefersReduced);
  const gradientId = `score-ring-grad-${size}-${score}`;

  const { radius, stroke, svgSize, textSize } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(score, maxScore) / maxScore) * circumference;
  const gap = circumference - progress;
  const center = radius + stroke;

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  useEffect(() => {
    if (visible && circleRef.current && !prefersReduced) {
      circleRef.current.style.transition = 'stroke-dashoffset 1.2s ease-out';
      circleRef.current.style.strokeDashoffset = String(gap);
    }
  }, [visible, gap, prefersReduced]);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {label && (
        <p className="mb-3 text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--muted-2)' }}>
          {label}
        </p>
      )}
      <div className="relative">
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${center * 2} ${center * 2}`}>
          {gradientEnd && (
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
          )}
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}
          />
          <circle
            ref={circleRef}
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={gradientEnd ? `url(#${gradientId})` : color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={prefersReduced ? gap : circumference}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(textSize, 'font-bold font-mono transition-opacity duration-500')}
            style={{ color: 'var(--text)', opacity: visible ? 1 : 0, transitionDelay: prefersReduced ? '0s' : '0.6s' }}
          >
            {score}
          </span>
          {subtitle && (
            <span className="text-sm" style={{ color: 'var(--muted-2)' }}>{subtitle}</span>
          )}
        </div>
      </div>
      {statusText && (
        <p
          className="mt-3 text-sm font-medium transition-opacity duration-500"
          style={{ color, opacity: visible ? 1 : 0, transitionDelay: prefersReduced ? '0s' : '1s' }}
        >
          {statusText}
        </p>
      )}
    </div>
  );
};

export default ScoreRing;
