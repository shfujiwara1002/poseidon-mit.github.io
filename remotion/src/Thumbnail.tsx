
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CinematicBackground } from './video/backgrounds/CinematicBackground';
import { PoseidonLogo } from './shared/brand/PoseidonLogo';
import { theme } from './shared/theme';

export const Thumbnail: React.FC = () => {
    return (
        <AbsoluteFill>
            <CinematicBackground useTier3={true} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 40
            }}>
                <PoseidonLogo size={200} animated={false} />
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{
                        fontFamily: theme.typography.fontHeader,
                        fontSize: 100,
                        color: 'white',
                        margin: 0,
                        textShadow: theme.textShadowNeon
                    }}>POSEIDON</h1>
                    <h2 style={{
                        fontFamily: theme.typography.fontUi,
                        fontSize: 40,
                        color: theme.accent.cyan,
                        marginTop: 20,
                        fontWeight: 300,
                        letterSpacing: 4
                    }}>TRUSTED SENTIENCE</h2>
                </div>
            </div>
        </AbsoluteFill>
    );
};
