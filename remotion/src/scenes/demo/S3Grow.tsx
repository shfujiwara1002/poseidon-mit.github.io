/**
 * S3Grow — 10–16s (frames 300–480, local frame 0–180)
 * Real /grow WebUI screenshot as background.
 * Camera pans to goal cards section, HighlightRing on progress bar.
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../../shared/theme';
import { DataCallout } from '../../components/demo/DataCallout';
import { EngineChip } from '../../components/demo/EngineChip';
import { HighlightRing } from '../../components/demo/HighlightRing';

const VIOLET = theme.accent.violet;

export const S3Grow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out
  const opacity = interpolate(frame, [0, 14, 166, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera: pan right and zoom into the goals cards section
  const scale = interpolate(
    frame,
    [0, 70, 140, 180],
    [1.05, 1.22, 1.30, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const tx = interpolate(frame, [0, 70, 180], [0, 60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, 70, 140, 180], [0, -40, -80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // HighlightRing opacity
  const ringOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardReveal = spring({ frame: frame - 8, fps, config: { damping: 22, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      {/* Screenshot background with camera */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile('assets/screenshots/demo/grow.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(2,4,16,0.50) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: 'linear-gradient(to top, rgba(2,4,16,0.75), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* HighlightRing on goal progress bar area */}
      <div style={{ opacity: ringOpacity, position: 'absolute', inset: 0 }}>
        <HighlightRing cx={0.40} cy={0.62} radius={52} color={VIOLET} delay={30} />
      </div>

      {/* Data callout */}
      <Sequence from={30} durationInFrames={110}>
        <DataCallout text="+$1,240 projected — Next 90 days" color={VIOLET} />
      </Sequence>

      <div style={{ opacity: cardReveal }}>
        <EngineChip engine="GROW" delay={10} />
      </div>
    </AbsoluteFill>
  );
};
