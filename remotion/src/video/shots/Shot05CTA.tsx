
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';
import { PoseidonLogo } from '../../shared/brand/PoseidonLogo';

export const Shot05CTA: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo Animation
    const logoScale = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 60 }
    });

    const taglineOpacity = interpolate(frame, [30, 60], [0, 1]);

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot5.duration}
            enterType="fade"
            exitType="fade"
            enterDuration={20}
        >
            <CameraController keyframes={[{ frame: 0, scale: 1, x: 0, y: 0 }, { frame: 180, scale: 1.05, x: 0, y: 0 }]}>
                <AbsoluteFill style={{ background: theme.backgroundGradient }}>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        gap: 40
                    }}>

                        {/* LOGO */}
                        <div style={{ transform: `scale(${logoScale})` }}>
                            <PoseidonLogo size={120} animated={true} />
                        </div>

                        {/* TEXT */}
                        <div style={{ textAlign: 'center', opacity: taglineOpacity }}>
                            <h1 style={{
                                fontFamily: theme.typography.fontHeader,
                                fontSize: 80,
                                color: 'white',
                                marginBottom: 10,
                                textShadow: theme.textShadowNeon
                            }}>
                                POSEIDON
                            </h1>
                            <h2 style={{
                                fontFamily: theme.typography.fontUi,
                                fontSize: 32,
                                color: theme.accent.cyan,
                                fontWeight: 400,
                                letterSpacing: 2
                            }}>
                                The only AI you can trust.
                            </h2>
                        </div>

                    </div>

                </AbsoluteFill>
            </CameraController>
        </ShotTransition>
    );
};
