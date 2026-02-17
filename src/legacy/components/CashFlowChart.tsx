import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CashFlowPrediction } from '../services/mockGrow';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

export interface CashFlowChartProps {
  data: CashFlowPrediction[];
  height?: number;
}

export function CashFlowChart({ data, height = 400 }: CashFlowChartProps) {
  const reducedMotion = useReducedMotionSafe();
  // Format data for Recharts
  const chartData = data.map(d => ({
    date: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    balance: d.balance,
    lower: d.lower,
    upper: d.upper,
    income: d.income,
    expenses: d.expenses
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--state-active)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--state-active)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(191, 211, 237, 0.6)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="rgba(191, 211, 237, 0.6)" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="date"
            stroke="rgba(191, 211, 237, 0.7)"
            style={{ fontSize: 12 }}
            tick={{ fill: 'rgba(191, 211, 237, 0.7)' }}
          />

          <YAxis
            stroke="rgba(191, 211, 237, 0.7)"
            style={{ fontSize: 12 }}
            tick={{ fill: 'rgba(191, 211, 237, 0.7)' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 14, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(20px)'
            }}
            labelStyle={{ color: 'rgba(191, 211, 237, 0.85)' }}
            itemStyle={{ color: '#fff' }}
            formatter={((value: number, name: string) => {
              if (value == null) return ['-', name];
              if (name === 'balance') return [`$${value.toLocaleString()}`, 'Projected Balance'];
              if (name === 'upper') return [`$${value.toLocaleString()}`, 'Upper Bound'];
              if (name === 'lower') return [`$${value.toLocaleString()}`, 'Lower Bound'];
              return [value, name];
            }) as never}
          />

          {/* Confidence band (upper - lower) */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#colorConfidence)"
            fillOpacity={1}
            isAnimationActive={!reducedMotion}
            animationDuration={500}
          />

          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="url(#colorConfidence)"
            fillOpacity={1}
            isAnimationActive={!reducedMotion}
            animationDuration={500}
            animationBegin={70}
          />

          {/* Main balance line */}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--state-active)"
            strokeWidth={3}
            fill="url(#colorBalance)"
            fillOpacity={1}
            isAnimationActive={!reducedMotion}
            animationDuration={520}
            animationBegin={120}
          />

          {/* Zero line */}
          <ReferenceLine y={0} stroke="var(--state-critical)" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="cashflow-legend">
        <div className="cashflow-legend-item">
          <div className="cashflow-legend-dot cashflow-legend-dot--active" />
          <span>Projected Balance</span>
        </div>
        <div className="cashflow-legend-item">
          <div className="cashflow-legend-band" />
          <span>Confidence Interval (90%)</span>
        </div>
      </div>
    </div>
  );
}
