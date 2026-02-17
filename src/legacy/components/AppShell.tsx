import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { TopNav } from './TopNav';
import { EngineTabs } from './EngineTabs';
import { BottomNav } from './BottomNav';

// Generate particles once at module level (not recreated on every render)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  key: i,
  style: {
    '--x': `${5 + Math.random() * 90}%`,
    '--y': `${60 + Math.random() * 35}%`,
    '--px': `${(Math.random() - 0.5) * 120}px`,
    '--py': `${-80 - Math.random() * 160}px`,
    '--ps': `${0.3 + Math.random() * 0.7}`,
    '--size': `${2 + Math.random() * 3}px`,
    '--dur': `${10 + Math.random() * 14}s`,
    '--del': `${Math.random() * 10}s`,
  } as React.CSSProperties,
}));

type ShellVariant = 'desktop' | 'mobile';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  ambientEffects?: boolean;
  showTopNav?: boolean;
  showEngineTabs?: boolean;
  showBottomNav?: boolean;
  /** Layout variant — 'mobile' uses compact top bar (56px) and bottom nav */
  variant?: ShellVariant;
}

export const AppShell = memo<AppShellProps>(({
  children,
  className = '',
  ambientEffects = true,
  showTopNav = true,
  showEngineTabs = false,
  showBottomNav = false,
  variant = 'desktop',
}) => {
  const isMobile = variant === 'mobile';
  const shellClassName = cn('app-shell', isMobile && 'app-shell--mobile', className);

  // Mobile variant: compact top bar + bottom nav, no engine tabs
  const resolvedShowBottomNav = isMobile || showBottomNav;
  const resolvedShowEngineTabs = !isMobile && showEngineTabs;

  return (
    <div className={shellClassName} data-variant={variant}>
      {ambientEffects && <div className="vignette-grain" aria-hidden="true" />}
      {ambientEffects && !isMobile && (
        <div className="floating-particles" aria-hidden="true">
          {PARTICLES.map((p) => (
            <div key={p.key} className="particle" style={p.style} />
          ))}
        </div>
      )}
      {showTopNav && <TopNav />}
      {showTopNav && resolvedShowEngineTabs && <EngineTabs />}
      <main id="main-content">{children}</main>
      {resolvedShowBottomNav && <BottomNav />}
    </div>
  );
});

AppShell.displayName = 'AppShell';
