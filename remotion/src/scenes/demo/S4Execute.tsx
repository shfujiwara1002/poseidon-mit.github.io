/**
 * S4Execute — 16–21s (frames 480–630, local frame 0–150)
 * Real /execute WebUI screenshot as background.
 * Camera zooms into pending approval queue, HighlightRing on approve button.
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

const AMBER = theme.accent.amber;

export const S4Execute: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out
  const opacity = interpolate(frame, [0, 14, 136, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Camera: zoom into the pending actions table
  const scale = interpolate(
    frame,
    [0, 55, 110, 150],
    [1.05, 1.25, 1.38, 1.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const tx = interpolate(frame, [0, 55, 150], [0, 50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, 55, 110, 150], [0, -30, -60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // HighlightRing opacity
  const ringOpacity = interpolate(frame, [25, 45], [0, 1], {
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
          src={staticFile('assets/screenshots/demo/execute.png')}
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

      {/* HighlightRing on Approve button area */}
      <div style={{ opacity: ringOpacity, position: 'absolute', inset: 0 }}>
        <HighlightRing cx={0.38} cy={0.46} radius={52} color={AMBER} delay={25} />
      </div>

      {/* Data callout */}
      <Sequence from={28} durationInFrames={90}>
        <DataCallout text="Scheduled 3 days early — saves $12 late fee" color={AMBER} />
      </Sequence>

      <div style={{ opacity: cardReveal }}>
        <EngineChip engine="EXECUTE" delay={10} />
      </div>
    </AbsoluteFill>
  );
};
