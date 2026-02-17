
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CinematicBackground } from './video/backgrounds/CinematicBackground';
import { Shot01Broken } from './video/shots/Shot01Broken';
import { Shot02TurnWebUI } from './video/shots/Shot02TurnWebUI';
import { Shot03LiveThreat } from './video/shots/Shot03LiveThreat';
import { Shot04Integration } from './video/shots/Shot04Integration';
import { Shot05CTA } from './video/shots/Shot05CTA';
import { SHOTS } from './video/config';

export const VideoMaster30sRebuild: React.FC = () => {
    return (
        <AbsoluteFill>
            <CinematicBackground useTier3={true} />

            {/* SHOT 1: THE PROBLEM (Black Box) */}
            <Sequence from={SHOTS.shot1.start} durationInFrames={SHOTS.shot1.duration}>
                <Shot01Broken />
            </Sequence>

            {/* SHOT 2: THE TURN (Architecture) */}
            <Sequence from={SHOTS.shot2.start} durationInFrames={SHOTS.shot2.duration}>
                <Shot02TurnWebUI />
            </Sequence>

            {/* SHOT 3: THE PROOF (Live Threat) */}
            <Sequence from={SHOTS.shot3.start} durationInFrames={SHOTS.shot3.duration}>
                <Shot03LiveThreat />
            </Sequence>

            {/* SHOT 4: INTEGRATION (Engine Stack) */}
            <Sequence from={SHOTS.shot4.start} durationInFrames={SHOTS.shot4.duration}>
                <Shot04Integration />
            </Sequence>

            {/* SHOT 5: CTA (Trust) */}
            <Sequence from={SHOTS.shot5.start} durationInFrames={SHOTS.shot5.duration}>
                <Shot05CTA />
            </Sequence>

        </AbsoluteFill>
    );
};
