import React from 'react';
import { GlassCard } from './GlassCard';
import { theme } from '../shared/theme';

export interface EngineMetrics {
  accuracy: number;
  coverage: number;
  speed: number;
  volume: number;
}

export interface EngineStatusCardProps {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'processing';
  metrics: EngineMetrics;
  lastUpdated: Date;
  color: string;
  icon: React.ReactNode;
  description: string;
  onClick?: () => void;
}

export function EngineStatusCard({
  name,
  status,
  metrics,
  lastUpdated,
  color,
  icon,
  description,
  onClick
}: EngineStatusCardProps) {
  const statusColors = {
    active: theme.colors.success,
    processing: theme.colors.warning,
    inactive: theme.colors.neutral
  };

  const statusLabels = {
    active: 'Active',
    processing: 'Processing',
    inactive: 'Inactive'
  };

  return (
    <GlassCard>
      <div
        onClick={onClick}
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{
              backgroundColor: `${color}15`,
              color: color,
              boxShadow: `0 0 20px ${color}40`
            }}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
          style={{
            backgroundColor: `${statusColors[status]}20`,
            color: statusColors[status]
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: statusColors[status] }}
          />
          {statusLabels[status]}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <MetricItem
          label="Accuracy"
          value={`${metrics.accuracy}%`}
          color={color}
          trend={metrics.accuracy >= 90 ? 'up' : 'stable'}
        />
        <MetricItem
          label="Coverage"
          value={`${metrics.coverage}%`}
          color={color}
          trend="stable"
        />
        <MetricItem
          label="Speed"
          value={`${metrics.speed}ms`}
          color={color}
          trend={metrics.speed < 100 ? 'up' : 'down'}
        />
        <MetricItem
          label="Volume"
          value={formatVolume(metrics.volume)}
          color={color}
          trend="up"
        />
      </div>

      {/* Last Updated */}
      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Last updated: {formatTimestamp(lastUpdated)}
        </p>
      </div>
      </div>
    </GlassCard>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

function MetricItem({ label, value, trend }: MetricItemProps) {
  const trendIcons = {
    up: '↗',
    down: '↘',
    stable: '→'
  };

  const trendColors = {
    up: theme.colors.success,
    down: theme.colors.error,
    stable: theme.colors.neutral
  };

  return (
    <div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold text-white">{value}</span>
        <span
          className="text-xs"
          style={{ color: trendColors[trend] }}
        >
          {trendIcons[trend]}
        </span>
      </div>
    </div>
  );
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(0)}K`;
  }
  return volume.toString();
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString();
}
