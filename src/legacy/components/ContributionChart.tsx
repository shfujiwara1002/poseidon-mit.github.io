import React from 'react';
import {
  Bar, BarChart, CartesianGrid, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { cn } from '../lib/utils';

export interface ContributionDataPoint {
  month: string;
  amount: number;
}

export interface ContributionChartProps {
  data: ContributionDataPoint[];
  targetMonthly?: number;
  /** Bar fill color (default: var(--accent-violet)) */
  accentColor?: string;
  className?: string;
}

function formatCurrency(value: number) {
  return `$${(value / 1000).toFixed(1)}K`;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 shadow-lg"
      style={{
        borderColor: 'var(--glass-border)',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-backdrop)',
      }}
    >
      <p className="text-xs font-medium" style={{ color: 'var(--muted-2)' }}>{label}</p>
      <p className="text-sm font-bold font-mono" style={{ color: 'var(--text)' }}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export const ContributionChart: React.FC<ContributionChartProps> = ({
  data,
  targetMonthly,
  accentColor = 'var(--accent-violet)',
  className,
}) => {
  const gradientId = `contrib-bar-grad-${accentColor.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className={cn('', className)}>
      {targetMonthly && (
        <div className="mb-4 flex items-center justify-end gap-1.5 text-xs" style={{ color: 'var(--muted-2)' }}>
          <div className="h-0.5 w-4" style={{
            backgroundImage: `repeating-linear-gradient(90deg, ${accentColor} 0, ${accentColor} 3px, transparent 3px, transparent 6px)`,
          }} />
          <span>Target: ${targetMonthly.toLocaleString()}/mo</span>
        </div>
      )}
      <div className="h-56 w-full md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity={0.9} />
                <stop offset="100%" stopColor={accentColor} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#253852" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            {targetMonthly && (
              <ReferenceLine y={targetMonthly} stroke={accentColor} strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.6} />
            )}
            <Bar dataKey="amount" fill={`url(#${gradientId})`} radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContributionChart;
