import React from 'react';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

interface ResponsiveGridProps {
  cols?: { mobile?: number; tablet?: number; desktop?: number };
  gap?: string;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveGrid({
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '16px',
  children,
  className = ''
}: ResponsiveGridProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const columns = isMobile ? (cols.mobile || 1) : isTablet ? (cols.tablet || 2) : (cols.desktop || 3);

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}
