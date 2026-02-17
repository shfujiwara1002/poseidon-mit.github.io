import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { APPLE_EASING } from './MotionUtils';

type Variant = 'fadeUp' | 'blurReveal' | 'scaleIn' | 'splitReveal';

interface KineticTextProps {
    /** Text to animate */
    text: string;
    /** Animation variant */
    variant?: Variant;
    /** Frame at which animation starts */
    startFrame?: number;
    /** Stagger delay between characters in frames */
    staggerFrames?: number;
    /** Font size in px */
    fontSize?: number;
    /** Font weight */
    fontWeight?: number;
    /** Text color */
    color?: string;
    /** Text shadow (neon glow) */
    textShadow?: string;
    /** Letter spacing */
    letterSpacing?: number;
    /** Font family */
    fontFamily?: string;
    /** Animate by word instead of character */
    byWord?: boolean;
    /** Additional style */
    style?: React.CSSProperties;
}

/**
 * Apple-style kinetic text — animates individual characters or words
 * with spring physics and staggered timing.
 */
export const KineticText: React.FC<KineticTextProps> = ({
    text,
    variant = 'fadeUp',
    startFrame = 0,
    staggerFrames = 2,
    fontSize = 96,
    fontWeight = 700,
    color = '#f8fafc',
    textShadow,
    letterSpacing = -0.02 * 96,
    fontFamily = "'Inter', 'Noto Sans JP', system-ui, sans-serif",
    byWord = false,
    style,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const units = byWord ? text.split(/(\s+)/) : text.split('');

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'baseline',
                fontFamily,
                fontSize,
                fontWeight,
                color,
                textShadow,
                letterSpacing,
                lineHeight: 1.1,
                ...style,
            }}
        >
            {units.map((unit, i) => {
                // Whitespace pass-through
                if (/^\s+$/.test(unit)) {
                    return (
                        <span key={`ws-${i}`} style={{ width: fontSize * 0.3 }} />
                    );
                }

                const delay = startFrame + i * staggerFrames;
                const localFrame = frame - delay;

                const s = spring({
                    frame: localFrame,
                    fps,
                    config: { damping: 14, mass: 0.5, stiffness: 120 },
                });

                const unitStyle = getVariantStyle(variant, s, localFrame, fps);

                return (
                    <span
                        key={`${unit}-${i}`}
                        style={{
                            display: 'inline-block',
                            whiteSpace: 'pre',
                            willChange: 'transform, opacity, filter',
                            ...unitStyle,
                        }}
                    >
                        {unit}
                    </span>
                );
            })}
        </div>
    );
};

function getVariantStyle(
    variant: Variant,
    progress: number,
    localFrame: number,
    _fps: number,
): React.CSSProperties {
    switch (variant) {
        case 'fadeUp':
            return {
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
            };

        case 'blurReveal':
            return {
                opacity: progress,
                filter: `blur(${interpolate(progress, [0, 1], [12, 0])}px)`,
                transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
            };

        case 'scaleIn':
            return {
                opacity: progress,
                transform: `scale(${interpolate(progress, [0, 1], [0.3, 1])})`,
            };

        case 'splitReveal': {
            const clipProgress = Math.min(1, Math.max(0, progress));
            return {
                opacity: localFrame < 0 ? 0 : 1,
                clipPath: `inset(0 ${(1 - clipProgress) * 50}% 0 0)`,
                transform: `translateX(${interpolate(clipProgress, [0, 1], [-20, 0])}px)`,
            };
        }

        default:
            return { opacity: progress };
    }
}

/**
 * Convenience: a full-line text reveal that fades up as a single unit.
 * Used for subtitles and taglines.
 */
export const LineReveal: React.FC<{
    text: string;
    startFrame?: number;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    textShadow?: string;
    fontFamily?: string;
    style?: React.CSSProperties;
}> = ({
    text,
    startFrame = 0,
    fontSize = 36,
    fontWeight = 400,
    color = 'rgba(255,255,255,0.72)',
    textShadow,
    fontFamily = "'Inter', 'Noto Sans JP', system-ui, sans-serif",
    style,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const s = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 18, mass: 0.6, stiffness: 100 },
    });

    return (
        <div
            style={{
                fontFamily,
                fontSize,
                fontWeight,
                color,
                textShadow,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                willChange: 'transform, opacity',
                ...style,
            }}
        >
            {text}
        </div>
    );
};

export { APPLE_EASING };
