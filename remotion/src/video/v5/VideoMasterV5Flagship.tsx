import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CinematicBackground } from '../backgrounds/CinematicBackground';
import { VideoAudioV5, type VideoAudioV5Props } from './audioV5';
import { FlashTransition } from '../../shared/animation/ShotTransition';
import { V5_FLAGSHIP_SHOTS } from './config';
import { Shot01SignalFlagship } from './shots/flagship/Shot01SignalFlagship';
import { Shot02FrictionFlagship } from './shots/flagship/Shot02FrictionFlagship';
import { Shot03ClarityFlagship } from './shots/flagship/Shot03ClarityFlagship';
import { Shot04MomentumFlagship } from './shots/flagship/Shot04MomentumFlagship';
import { Shot05AssuranceFlagship } from './shots/flagship/Shot05AssuranceFlagship';
import { Shot06CTAFlagship } from './shots/flagship/Shot06CTAFlagship';
import type { VideoLayoutMode } from '../layout/VideoLayout';

export interface VideoMasterV5FlagshipProps extends VideoAudioV5Props {
  layout?: VideoLayoutMode;
  useTier3?: boolean;
}

export const VideoMasterV5Flagship: React.FC<VideoMasterV5FlagshipProps> = ({
  layout = 'landscape',
  useTier3 = true,
  ...audioProps
}) => {
  const s = V5_FLAGSHIP_SHOTS;

  return (
    <AbsoluteFill>
      <CinematicBackground useTier3={useTier3} />
      <VideoAudioV5 {...audioProps} />

      {/* Flash transitions at shot boundaries */}
      <FlashTransition at={s.shot2.start} duration={8} intensity={0.25} />
      <FlashTransition at={s.shot3.start} duration={10} intensity={0.2} />
      <FlashTransition at={s.shot4.start} duration={8} intensity={0.3} />
      <FlashTransition at={s.shot5.start} duration={8} intensity={0.2} />
      <FlashTransition at={s.shot6.start} duration={12} intensity={0.3} />

      {/* Shot 1: Hook (0-120, 4s) */}
      <Sequence from={s.shot1.start} durationInFrames={s.shot1.duration}>
        <Shot01SignalFlagship layout={layout} />
      </Sequence>

      {/* Shot 2: Turn (120-240, 4s) */}
      <Sequence from={s.shot2.start} durationInFrames={s.shot2.duration}>
        <Shot02FrictionFlagship layout={layout} />
      </Sequence>

      {/* Shot 3: Proof-Protect HERO (240-420, 6s) */}
      <Sequence from={s.shot3.start} durationInFrames={s.shot3.duration}>
        <Shot03ClarityFlagship layout={layout} />
      </Sequence>

      {/* Shot 4: Proof-Govern (420-570, 5s) — uses Assurance file */}
      <Sequence from={s.shot4.start} durationInFrames={s.shot4.duration}>
        <Shot05AssuranceFlagship layout={layout} />
      </Sequence>

      {/* Shot 5: Architecture (570-720, 5s) — uses Momentum file */}
      <Sequence from={s.shot5.start} durationInFrames={s.shot5.duration}>
        <Shot04MomentumFlagship layout={layout} />
      </Sequence>

      {/* Shot 6: CTA (720-900, 6s) */}
      <Sequence from={s.shot6.start} durationInFrames={s.shot6.duration}>
        <Shot06CTAFlagship layout={layout} />
      </Sequence>
    </AbsoluteFill>
  );
};
