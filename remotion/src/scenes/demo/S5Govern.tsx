/**
 * S5Govern — 21–27s (frames 630–810, local frame 0–180)
 * Real /govern WebUI screenshot as background.
 * Camera zooms into audit trail table, HighlightRing on decision IDs.
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

const BLUE = theme.accent.blue;

export const S5Govern: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out
  const opacity = interpolate(frame, [0, 14, 166, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera: pan and zoom into the audit trail table
  const scale = interpolate(
    frame,
    [0, 70, 140, 180],
    [1.05, 1.22, 1.32, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const tx = interpolate(frame, [0, 70, 180], [0, 30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, 70, 140, 180], [0, -30, -65, 0], {
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
          src={staticFile('assets/screenshots/demo/govern.png')}
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

      {/* HighlightRing on decision ID area */}
      <div style={{ opacity: ringOpacity, position: 'absolute', inset: 0 }}>
        <HighlightRing cx={0.28} cy={0.52} radius={52} color={BLUE} delay={30} />
      </div>

      {/* Center-bottom callout */}
      <Sequence from={80} durationInFrames={90}>
        <DataCallout text="Every decision. Explained. Audited." position="center-bottom" color={BLUE} />
      </Sequence>

      <div style={{ opacity: cardReveal }}>
        <EngineChip engine="GOVERN" delay={10} />
      </div>
    </AbsoluteFill>
  );
};
