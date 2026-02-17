import { memo } from 'react';
import './Skeleton.css';

type SkeletonVariant = 'text' | 'circular' | 'rectangular';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  className?: string;
};

export const Skeleton = memo<SkeletonProps>(({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  className
}) => {
  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    `skeleton--${animation}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{ width, height }}
      aria-busy="true"
      aria-live="polite"
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton layouts
export const DashboardSkeleton = memo(() => (
  <div className="dashboard-skeleton">
    <Skeleton height="60px" className="mb-4" />
    <div className="stats-grid-skeleton">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="stat-card-skeleton">
          <Skeleton variant="circular" width="48px" height="48px" />
          <Skeleton height="24px" width="60%" />
          <Skeleton height="36px" width="80%" />
        </div>
      ))}
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

export const TableSkeleton = memo(({ rows = 5 }: { rows?: number }) => (
  <div className="table-skeleton">
    <Skeleton height="40px" className="mb-2" />
    {[...Array(rows)].map((_, i) => (
      <Skeleton key={i} height="32px" className="mb-1" />
    ))}
  </div>
));

TableSkeleton.displayName = 'TableSkeleton';

export const CardSkeleton = memo(() => (
  <div className="card-skeleton" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <Skeleton variant="circular" width="40px" height="40px" />
      <div style={{ flex: 1 }}>
        <Skeleton height="20px" width="60%" />
        <Skeleton height="16px" width="40%" />
      </div>
    </div>
    <Skeleton height="80px" />
  </div>
));

CardSkeleton.displayName = 'CardSkeleton';
