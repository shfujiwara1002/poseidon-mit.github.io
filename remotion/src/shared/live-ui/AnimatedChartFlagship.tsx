
import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion';
import { theme } from '../theme';

interface AnimatedChartFlagshipProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    label?: string;
    delay?: number;
}

export const AnimatedChartFlagship: React.FC<AnimatedChartFlagshipProps> = ({
    data,
    width = 800,
    height = 400,
    color = theme.accent.cyan,
    label = "LIVE METRIC",
    delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. DATA PROCESSING
    const maxVal = Math.max(...data) * 1.2;
    const minVal = Math.min(...data) * 0.8;
    const padding = 40;
    const activeWidth = width - padding * 2;
    const activeHeight = height - padding * 2;

    const points = data.map((d, i) => ({
        x: padding + (i / (data.length - 1)) * activeWidth,
        y: height - padding - ((d - minVal) / (maxVal - minVal)) * activeHeight
    }));

    // 2. PATH GENERATION (Catmull-Rom or Simple Bezier)
    // Using simple cubic bezier smoothing for "Flow" feel
    const createSmoothPath = (pts: typeof points) => {
        if (pts.length < 2) return "";
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const current = pts[i];
            const next = pts[i + 1];
            const cp1x = current.x + (next.x - current.x) * 0.5;
            const cp1y = current.y;
            const cp2x = current.x + (next.x - current.x) * 0.5;
            const cp2y = next.y;
            path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${next.x} ${next.y}`;
        }
        return path;
    };

    const linePath = createSmoothPath(points);

    // Area Path (for gradient fill)
    const areaPath = `${linePath} L ${width - padding} ${height} L ${padding} ${height} Z`;

    // 3. ANIMATION
    const reveal = interpolate(frame - delay, [0, 60], [0, 1], {
        easing: Easing.bezier(0.2, 0, 0, 1),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
    });

    // Dash Array trick for line drawing
    const pathLength = width * 2; // Approx

    // 4. CURSOR FOLLOWER
    // Cursor moves along the path
    const cursorIndex = interpolate(reveal, [0, 1], [0, data.length - 1]);
    const currentPointIndex = Math.floor(cursorIndex);
    const nextPointIndex = Math.min(data.length - 1, currentPointIndex + 1);
    const progressBetween = cursorIndex - currentPointIndex;

    const p1 = points[currentPointIndex] || points[0];
    const p2 = points[nextPointIndex] || points[data.length - 1];

    // Lerp fit
    const cursorX = p1.x + (p2.x - p1.x) * progressBetween;
    const cursorY = p1.y + (p2.y - p1.y) * progressBetween; // Linear approx is fine for cursor

    const glowId = `flagship-glow-${label}`;

    return (
        <div style={{ width, height, position: 'relative' }}>
            {/* LABEL HEADER */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: padding,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                fontFamily: theme.typography.fontUi,
                color: color,
                fontSize: 12,
                letterSpacing: 1,
                opacity: reveal
            }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
                {label}
            </div>

            <svg width={width} height={height} style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id={`${glowId}-fill`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                    <filter id={`${glowId}-blur`}>
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* BACKGROUND GRID (Tech feel) */}
                <g opacity={0.1}>
                    {points.map((p, i) => (
                        <line key={i} x1={p.x} y1={padding} x2={p.x} y2={height} stroke="white" strokeDasharray="4 4" />
                    ))}
                    <line x1={padding} y1={height} x2={width - padding} y2={height} stroke="white" />
                </g>

                {/* MASK GROUP for Wipe Effect */}
                <g>
                    {/* We use a clipPath or just draw the line with dashoffset */}

                    {/* AREA FILL */}
                    <path
                        d={areaPath}
                        fill={`url(#${glowId}-fill)`}
                        opacity={reveal} // Fade in fill
                    />

                    {/* MAIN LINE */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke={color}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - reveal)}
                        filter={`url(#${glowId}-blur)`}
                    />
                </g>

                {/* CURSOR & TOOLTIP */}
                <g transform={`translate(${cursorX}, ${cursorY})`} opacity={reveal > 0.1 ? 1 : 0}>
                    {/* Crosshair */}
                    <circle r={6} fill={theme.background.deepNavy} stroke={color} strokeWidth={2} />
                    <line x1={0} y1={-20} x2={0} y2={height} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />

                    {/* Tooltip Card */}
                    <g transform="translate(15, -40)">
                        <rect width={80} height={30} fill="rgba(0,0,0,0.8)" rx={4} stroke={color} strokeWidth={1} />
                        <text
                            x={40}
                            y={20}
                            fill="white"
                            fontSize={12}
                            fontFamily={theme.typography.fontMono}
                            textAnchor="middle"
                        >
                            {Math.round(minVal + (maxVal - minVal) * (1 - (cursorY - padding) / activeHeight))}
                        </text>
                    </g>
                </g>

            </svg>
        </div>
    );
};
