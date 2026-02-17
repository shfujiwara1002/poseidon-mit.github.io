import { VIDEO_BPM, VIDEO_FPS } from '../config';

export const V5_VIDEO_FPS = VIDEO_FPS;
export const V5_VIDEO_BPM = VIDEO_BPM;
export const V5_VIDEO_DURATION_SECONDS = 30;
export const V5_VIDEO_DURATION_FRAMES = V5_VIDEO_FPS * V5_VIDEO_DURATION_SECONDS;

export const V5_SHOTS = {
  shot1: { start: 0, duration: V5_VIDEO_FPS * 5 },
  shot2: { start: 150, duration: V5_VIDEO_FPS * 5 },
  shot3: { start: 300, duration: V5_VIDEO_FPS * 5 },
  shot4: { start: 450, duration: V5_VIDEO_FPS * 5 },
  shot5: { start: 600, duration: V5_VIDEO_FPS * 5 },
  shot6: { start: 750, duration: V5_VIDEO_FPS * 5 },
} as const;

export type V5ShotKey = keyof typeof V5_SHOTS;

// --- Flagship (non-uniform timing, 30s = 900 frames) ---

export const V5_FLAGSHIP_SHOTS = {
  shot1: { start: 0, duration: V5_VIDEO_FPS * 4 },       // Hook (4s)
  shot2: { start: 120, duration: V5_VIDEO_FPS * 4 },      // Turn (4s)
  shot3: { start: 240, duration: V5_VIDEO_FPS * 6 },      // Proof-Protect HERO (6s)
  shot4: { start: 420, duration: V5_VIDEO_FPS * 5 },      // Proof-Govern (5s)
  shot5: { start: 570, duration: V5_VIDEO_FPS * 5 },      // Architecture (5s)
  shot6: { start: 720, duration: V5_VIDEO_FPS * 6 },      // CTA (6s)
} as const;

export type V5FlagshipShotKey = keyof typeof V5_FLAGSHIP_SHOTS;

/** VO phrase → frame mapping. Populated after ElevenLabs VO generation. */
export const V5_VO_MARKERS = {
  shot1: { voStart: 0, voEnd: 110 },
  shot2: { voStart: 0, voEnd: 105 },
  shot3: { voStart: 0, voEnd: 160 },
  shot4: { voStart: 0, voEnd: 120 },
  shot5: { voStart: 0, voEnd: 130 },
  shot6: { voStart: 0, voEnd: 90 },
} as const;
