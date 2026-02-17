import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShotTransition } from '../../../../shared/animation/ShotTransition';
import { LightSweep } from '../../../../shared/effects/LightSweep';
import { BloomEffect, LensFlare } from '../../../../shared/effects/BloomEffect';
import { CinematicText, AnimatedText } from '../../../../shared/animation/AnimatedText';
import { PulsingButton } from '../../../../shared/live-ui/AnimatedUI';
import { PulsingElement, SparkBurst } from '../../../../shared/cinematic';
import { LogoIcon } from '../../../../LogoIcon';
import { theme } from '../../../../shared/theme';
import { copy } from '../../../../shared/copy';
import { getVideoLayoutStyles, type VideoLayoutMode } from '../../../layout/VideoLayout';
import { V5_FLAGSHIP_SHOTS, V5_VIDEO_BPM } from '../../config';

interface Shot06CTAFlagshipProps {
  layout?: VideoLayoutMode;
}

/**
 * Shot 6: CTA (6s, 180 frames)
 * Logo + tagline + "Get Early Access" button.
 */
export const Shot06CTAFlagship: React.FC<Shot06CTAFlagshipProps> = ({
  layout = 'landscape',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safeArea, scaledSafeArea } = getVideoLayoutStyles(layout);
  const containerStyle = layout === 'portrait' ? scaledSafeArea : safeArea;

  const logoReveal = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });

  return (
    <ShotTransition
      durationInFrames={V5_FLAGSHIP_SHOTS.shot6.duration}
      enterType="zoom-through"
      exitType="fade"
      enterDuration={16}
      exitDuration={24}
    >
      <AbsoluteFill
        style={{
          ...containerStyle,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}
      >
        <LensFlare x={50} y={38} color={theme.accent.cyan} intensity={0.7} streakLength={600} delay={4} />
        <LensFlare x={48} y={42} color={theme.accent.violet} intensity={0.4} streakLength={380} delay={8} />
        <LightSweep duration={V5_FLAGSHIP_SHOTS.shot6.duration} color={theme.accent.cyan} intensity={0.3} layers={3} />

        <SparkBurst x={50} y={40} triggerAt={45} count={36} color={theme.accent.cyan} spread={240} />

        <PulsingElement bpm={V5_VIDEO_BPM} scaleRange={[1, 1.02]} glow glowColor={theme.accent.cyan}>
          <BloomEffect color={theme.accent.cyan} intensity={0.9} pulseFrequency={22} rays={12} raySpread={360} rotateRays>
            <div
              style={{
                width: 280,
                height: 280,
                opacity: logoReveal,
                transform: `scale(${interpolate(logoReveal, [0, 1], [0.7, 1])})`,
              }}
            >
              <LogoIcon variant="trident-only" background="transparent" showShield showParticles />
            </div>
          </BloomEffect>
        </PulsingElement>

        <CinematicText delay={16} size={54} glowColor={theme.accent.cyan}>
          {copy.videoV5Flagship.shot6.headline}
        </CinematicText>

        <AnimatedText
          mode="word"
          delay={30}
          stagger={4}
          style={{ fontSize: 26, color: 'rgba(255,255,255,0.8)', fontFamily: theme.typography.fontHeader }}
        >
          {copy.videoV5Flagship.shot6.tagline}
        </AnimatedText>

        <PulsingButton color={theme.accent.cyan} delay={50} style={{ padding: '20px 48px', fontSize: 22 }}>
          {copy.videoV5Flagship.shot6.cta}
        </PulsingButton>

        <AnimatedText delay={70} style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: theme.typography.fontUi }}>
          {copy.videoV5Flagship.shot6.footer}
        </AnimatedText>
      </AbsoluteFill>
    </ShotTransition>
  );
};
