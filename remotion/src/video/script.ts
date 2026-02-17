
import { VIDEO_FPS } from './config';

export interface ScriptLine {
    id: string;
    text: string;
    startBeat: number; // Approximate beat to start VO
    durationBeats: number; // Duration in beats
}

// BPM = 120 => 1 Beat = 0.5s = 15 Frames
// Total 30s = 60 Beats

export const VIDEO_SCRIPT: ScriptLine[] = [
    {
        id: 'shot1_hook',
        text: "Black-box models... break trust.",
        startBeat: 1, // 0.5s
        durationBeats: 6, // 3s
    },
    {
        id: 'shot2_turn',
        text: "You need an architecture you can see.",
        startBeat: 10, // 5s
        durationBeats: 8, // 4s
    },
    {
        id: 'shot3_proof',
        text: "Threats caught in milliseconds. Every decision... fully auditable.",
        startBeat: 20, // 10s
        durationBeats: 16, // 8s
    },
    {
        id: 'shot4_integration',
        text: "Four engines. One backbone.",
        startBeat: 38, // 19s
        durationBeats: 8, // 4s
    },
    {
        id: 'shot5_cta',
        text: "Poseidon. The trusted AI economy.",
        startBeat: 50, // 25s
        durationBeats: 8, // 4s
    },
];

export const getScriptTiming = (id: string) => {
    const line = VIDEO_SCRIPT.find((l) => l.id === id);
    if (!line) return { startFrame: 0, durationFrame: 0 };

    // 120 BPM = 2 beats per second = 30 frames per second / 2 = 15 frames per beat
    const FRAMES_PER_BEAT = (VIDEO_FPS * 60) / 120;

    return {
        startFrame: line.startBeat * FRAMES_PER_BEAT,
        durationFrame: line.durationBeats * FRAMES_PER_BEAT,
        endFrame: (line.startBeat + line.durationBeats) * FRAMES_PER_BEAT
    };
};
