import React from 'react';
import { useQuery } from '../hooks/useQuery';
import { mockService } from '../api/mockService';
import { StatCard } from './StatCard';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './Button';
import { logger } from '../utils/logger';

/**
 * Example component demonstrating useQuery hook usage
 * This component fetches dashboard statistics from the mock service
 */
export const DashboardStats: React.FC = () => {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery(
    'dashboard-stats',
    () => mockService.getDashboardStats(),
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
      retry: 2, // Retry failed requests twice
      onSuccess: (data) => {
        logger.log('Dashboard stats loaded:', data);
      },
      onError: (err) => {
        console.error('Failed to load dashboard stats:', err);
      }
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <LoadingSpinner size="large" />
        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'rgba(255, 68, 68, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 68, 68, 0.3)'
        }}
      >
        <p style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>
          An error occurred: {error.message}
        </p>
        <Button onClick={() => refetch()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  // Success state with data
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>
          Real-time Statistics
        </h2>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          disabled={isRefetching}
          style={{ fontSize: '0.875rem' }}
        >
          {isRefetching ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}
        >
          <StatCard
            label="Total Alerts"
            value={stats.totalAlerts.toLocaleString()}
            meta="Last 24 hours"
            accent="cyan"
          />
          <StatCard
            label="Critical Alerts"
            value={stats.criticalAlerts.toLocaleString()}
            meta="Requires attention"
            accent="red"
          />
          <StatCard
            label="Avg Response"
            value={`${stats.avgResponseTime}ms`}
            meta="System latency"
            accent="teal"
          />
          <StatCard
            label="Uptime"
            value={`${stats.uptime}%`}
            meta="Last 30 days"
            accent="violet"
          />
          <StatCard
            label="Active Workflows"
            value={stats.activeWorkflows.toLocaleString()}
            meta="Currently running"
            accent="amber"
          />
          <StatCard
            label="Processed Today"
            value={stats.processedToday.toLocaleString()}
            meta="Transactions"
            accent="blue"
          />
        </div>
      )}

      <p
        style={{
          marginTop: '1rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center'
        }}
      >
        Auto-refresh: every 30s {isRefetching && '(updating...)'}
      </p>
    </div>
  );
};
