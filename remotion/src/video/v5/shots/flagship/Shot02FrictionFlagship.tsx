import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { BloomEffect } from '../../../../shared/effects/BloomEffect';
import { LightSweep } from '../../../../shared/effects/LightSweep';
import { AnimatedText } from '../../../../shared/animation/AnimatedText';
import { LogoIcon } from '../../../../LogoIcon';
import { theme } from '../../../../shared/theme';
import { copy } from '../../../../shared/copy';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS } from '../../config';

interface Shot02FrictionFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * Shot 2: Turn (4s, 120 frames)
 * Black screen -> Logo trident assembles with BloomEffect -> LightSweep -> Tagline.
 */
export const Shot02FrictionFlagship: React.FC<Shot02FrictionFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  // Logo reveal (frames 20-50)
  const logoReveal = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Tagline (frames 70-120)
  const taglineOpacity = interpolate(frame, [70, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot2.duration}
      enterType="fade"
      exitType="zoom-through"
      enterDuration={10}
      exitDuration={10}
    >
      <AbsoluteFill style={{ background: '#000' }}>
        {/* LightSweep across the screen (frames 40-90) */}
        {frame >= 40 && (
          <LightSweep
            duration={50}
            delay={40}
            color={theme.accent.cyan}
            intensity={0.3}
            layers={2}
          />
        )}

        <AbsoluteFill
          style={{
            ...containerStyle,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {/* Logo with bloom */}
          <div
            style={{
              opacity: logoReveal,
              transform: `scale(${interpolate(logoReveal, [0, 1], [0.6, 1])})`,
            }}
          >
            <BloomEffect color={theme.accent.cyan} intensity={0.8} pulseFrequency={25} rays={8} raySpread={360} rotateRays>
              <div style={{ width: 240, height: 240 }}>
                <LogoIcon variant="trident-only" background="transparent" showShield showParticles />
              </div>
            </BloomEffect>
          </div>

          {/* Tagline */}
          <div style={{ opacity: taglineOpacity }}>
            <AnimatedText
              mode="word"
              delay={72}
              stagger={4}
              variant="glow-reveal"
              glowColor={theme.accent.cyan}
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                fontFamily: theme.typography.fontHeader,
                textAlign: 'center',
              }}
            >
              {copy.videoV5Flagship.shot2.tagline}
            </AnimatedText>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </ShotTransition>
  );
};
