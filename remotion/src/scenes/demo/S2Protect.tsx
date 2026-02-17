/**
 * S2Protect — 3–10s (frames 90–300, local frame 0–210)
 * Real /protect WebUI screenshot as background.
 * Camera zooms into the threat signals section, HighlightRing on signal row.
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

const GREEN = theme.accent.emerald;

export const S2Protect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out
  const opacity = interpolate(frame, [0, 14, 196, 210], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera: zoom into the threat signals area (right-center)
  const scale = interpolate(
    frame,
    [0, 60, 140, 180, 210],
    [1.05, 1.20, 1.35, 1.28, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const tx = interpolate(frame, [0, 60, 210], [0, 80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, 60, 140, 210], [0, -30, -70, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // HighlightRing opacity
  const ringOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Card reveal for engine chip
  const cardReveal = spring({ frame: frame - 8, fps, config: { damping: 22, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity }}>
      {/* Screenshot background with camera pan/zoom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile('assets/screenshots/demo/protect.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Dark vignette for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(2,4,16,0.50) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient for callout contrast */}
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

      {/* HighlightRing on threat signal row */}
      <div style={{ opacity: ringOpacity, position: 'absolute', inset: 0 }}>
        <HighlightRing cx={0.58} cy={0.50} radius={52} color={GREEN} delay={30} />
      </div>

      {/* Data callout */}
      <Sequence from={28} durationInFrames={140}>
        <DataCallout text="Reason: Duplicate charge — $847 · Citibank" color={GREEN} />
      </Sequence>

      <div style={{ opacity: cardReveal }}>
        <EngineChip engine="PROTECT" delay={10} />
      </div>
    </AbsoluteFill>
  );
};
