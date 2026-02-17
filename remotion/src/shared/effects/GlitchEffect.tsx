import React from 'react';
import { useCurrentFrame } from 'remotion';

interface GlitchEffectProps {
  children: React.ReactNode;
  active?: boolean;
  intensity?: number;
  sliceCount?: number;
}

/**
 * RGB channel-split glitch effect with horizontal slice displacement.
 * Uses deterministic frame-seeded randomization for reproducible renders.
 */
export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  active = false,
  intensity = 0.5,
  sliceCount = 8,
}) => {
  const frame = useCurrentFrame();

  if (!active || intensity <= 0) {
    return <>{children}</>;
  }

  // Deterministic pseudo-random based on frame
  const seed = (n: number) => Math.sin(frame * 127.1 + n * 311.7) * 43758.5453 % 1;

  const offsetR = Math.round(seed(1) * 10 * intensity);
  const offsetB = Math.round(seed(2) * -10 * intensity);

  // Slice clip-paths for horizontal tearing
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const y1 = (i / sliceCount) * 100;
    const y2 = ((i + 1) / sliceCount) * 100;
    const dx = Math.round((seed(i + 10) - 0.5) * 20 * intensity);
    return { y1, y2, dx };
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Base content (green channel) */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>

      {/* Red channel offset */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${offsetR}px)`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.4,
        }}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="glitch-red">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
        <div style={{ filter: 'url(#glitch-red)', width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>

      {/* Blue channel offset */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${offsetB}px)`,
          mixBlendMode: 'screen',
          opacity: intensity * 0.4,
        }}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="glitch-blue">
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>
        <div style={{ filter: 'url(#glitch-blue)', width: '100%', height: '100%' }}>
          {children}
        </div>
      </div>

      {/* Horizontal slice displacement overlay */}
      {slices.map((slice, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${slice.y1}%`,
            height: `${slice.y2 - slice.y1}%`,
            transform: `translateX(${slice.dx}px)`,
            overflow: 'hidden',
            opacity: Math.abs(slice.dx) > 3 ? 0.7 : 0,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              marginTop: `-${slice.y1}%`,
              height: '10000%',
            }}
          >
            {children}
          </div>
        </div>
      ))}
    </div>
  );
};
