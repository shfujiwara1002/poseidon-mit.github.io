import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

interface CountUpTextProps {
  target: number;
  startFrame: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  fontSize?: number;
  color?: string;
}

/**
 * Animated count-up number with neon glow effect.
 * Interpolates from 0 to target over the specified duration.
 */
export const CountUpText: React.FC<CountUpTextProps> = ({
  target,
  startFrame,
  duration = 30,
  decimals = 1,
  suffix = '%',
  fontSize = 96,
  color = theme.accent.cyan,
}) => {
  const frame = useCurrentFrame();

  const elapsed = frame - startFrame;
  const safeDuration = Math.max(1, duration);

  const progress = interpolate(elapsed, [0, safeDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const value = (target * progress).toFixed(decimals);

  // Scale entrance
  const scale = interpolate(elapsed, [0, 10], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(elapsed, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontSize,
        fontWeight: 800,
        color,
        fontFamily: theme.typography.fontMono,
        fontFeatureSettings: theme.typography.numericFeatureSettings,
        textShadow: `0 0 30px ${color}88, 0 0 60px ${color}44`,
        transform: `scale(${scale})`,
        opacity,
        letterSpacing: '-0.02em',
      }}
    >
      {value}{suffix}
    </div>
  );
};
