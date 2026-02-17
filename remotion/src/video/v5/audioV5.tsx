import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { type SFXType } from '../../shared/cinematic';
import { DEFAULT_AUDIO } from '../config';
import { V5_FLAGSHIP_SHOTS } from './config';

interface SFXEvent {
  type: SFXType;
  at: number;
  volume?: number;
}

const SFX_LIBRARY: Record<SFXType, { file: string; volume: number; playbackRate?: number }> = {
  'zoom-in': { file: DEFAULT_AUDIO.sfxWhooshSrc, volume: 0.5, playbackRate: 1.2 },
  'zoom-out': { file: DEFAULT_AUDIO.sfxWhooshSrc, volume: 0.4, playbackRate: 0.8 },
  'whoosh': { file: DEFAULT_AUDIO.sfxWhooshSrc, volume: 0.6 },
  'pop': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.4, playbackRate: 1.3 },
  'click': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.3, playbackRate: 1.5 },
  'slide': { file: DEFAULT_AUDIO.sfxWhooshSrc, volume: 0.3, playbackRate: 1.1 },
  'reveal': { file: DEFAULT_AUDIO.sfxWhooshSrc, volume: 0.35, playbackRate: 0.9 },
  'success': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.5 },
  'alert': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.6, playbackRate: 0.7 },
  'hit': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.7 },
  'sparkle': { file: DEFAULT_AUDIO.sfxHitSrc, volume: 0.25, playbackRate: 1.8 },
};

const WHOOSH_TYPES: SFXType[] = ['zoom-in', 'zoom-out', 'whoosh', 'slide', 'reveal'];

const resolveSfx = (type: SFXType, whooshSrc: string, hitSrc: string) => {
  const base = SFX_LIBRARY[type];
  const file = WHOOSH_TYPES.includes(type) ? whooshSrc : hitSrc;
  return { ...base, file };
};

const buildFlagshipSfxEvents = (): SFXEvent[] => {
  const s = V5_FLAGSHIP_SHOTS;
  return [
    { type: 'alert', at: s.shot1.start + 55 },
    { type: 'hit', at: s.shot1.start + 80 },
    { type: 'hit', at: s.shot2.start + 30 },
    { type: 'whoosh', at: s.shot2.start + 50 },
    { type: 'alert', at: s.shot3.start + 50 },
    { type: 'click', at: s.shot3.start + 90 },
    { type: 'hit', at: s.shot3.start + 120 },
    { type: 'click', at: s.shot4.start + 45 },
    { type: 'whoosh', at: s.shot5.start + 10 },
    { type: 'whoosh', at: s.shot5.start + 40 },
    { type: 'whoosh', at: s.shot5.start + 70 },
    { type: 'sparkle', at: s.shot5.start + 90 },
    { type: 'sparkle', at: s.shot6.start + 45 },
  ];
};

export interface VideoAudioV5Props {
  musicSrc?: string;
  voSrc?: string;
  sfxWhooshSrc?: string;
  sfxHitSrc?: string;
  enableAudio?: boolean;
  musicVolumeMax?: number;
  voVolume?: number;
  sfxVolume?: number;
}

export const VideoAudioV5: React.FC<VideoAudioV5Props> = ({
  musicSrc = DEFAULT_AUDIO.musicSrc,
  voSrc,
  sfxWhooshSrc = DEFAULT_AUDIO.sfxWhooshSrc,
  sfxHitSrc = DEFAULT_AUDIO.sfxHitSrc,
  enableAudio = true,
  musicVolumeMax = 0.25,
  voVolume = 1.0,
  sfxVolume = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const musicVolume = interpolate(
    frame,
    [0, 30, durationInFrames - 60, durationInFrames],
    [0, musicVolumeMax, musicVolumeMax, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const events = buildFlagshipSfxEvents();

  if (!enableAudio) return null;

  return (
    <>
      {musicSrc && <Audio src={staticFile(musicSrc)} volume={musicVolume} />}
      {voSrc && <Audio src={staticFile(voSrc)} volume={voVolume} />}
      {events.map((event, index) => {
        const config = resolveSfx(event.type, sfxWhooshSrc, sfxHitSrc);
        const volume = (event.volume ?? config.volume) * sfxVolume;
        return (
          <Sequence key={`sfx-${event.type}-${event.at}-${index}`} from={event.at} durationInFrames={30}>
            <Audio
              src={staticFile(config.file)}
              volume={volume}
              playbackRate={config.playbackRate ?? 1}
            />
          </Sequence>
        );
      })}
    </>
  );
};
