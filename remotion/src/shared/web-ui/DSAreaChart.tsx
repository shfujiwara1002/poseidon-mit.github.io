
import React from 'react';
import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface DSAreaChartProps {
    data: any[];
    dataKey: string;
    xKey?: string;
    engine?: 'protect' | 'grow' | 'execute' | 'govern';
    height?: number;
    showGrid?: boolean;
    className?: string;
}

const engineColor: Record<string, string> = {
    protect: '#22c55e',
    grow: '#8b5cf6',
    execute: '#f59e0b',
    govern: '#3b82f6'
};

export function DSAreaChart({ data, dataKey, xKey = 'name', engine, height = 200, showGrid = true, className }: DSAreaChartProps) {
    const color = engine ? engineColor[engine] : '#06b6d4';

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsArea data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                        <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />}
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(7, 13, 26, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            fontSize: 12,
                            color: '#fff',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ color: color }}
                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        fill={`url(#area-${dataKey})`}
                        strokeWidth={2}
                        isAnimationActive={false} /* Remotion handles animation via frame or we just show static for now */
                    />
                </RechartsArea>
            </ResponsiveContainer>
        </div>
    );
}
