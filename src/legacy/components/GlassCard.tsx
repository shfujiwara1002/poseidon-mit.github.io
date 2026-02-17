import React, { useRef, useCallback, memo } from 'react';

type GlassVariant = 'teal' | 'violet' | 'amber' | 'blue';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  tone?: 'default' | 'dark';
  shine?: boolean;
  className?: string;
}

const variantClasses: Record<GlassVariant, string> = {
  teal: 'border-l-[3px] border-l-accent-teal hover:shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_28px_rgba(0,240,255,0.12),0_0_24px_rgba(20,184,166,0.1)]',
  violet: 'border-l-[3px] border-l-accent-violet hover:shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_28px_rgba(0,240,255,0.12),0_0_24px_rgba(139,92,246,0.1)]',
  amber: 'border-l-[3px] border-l-accent-amber hover:shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_28px_rgba(0,240,255,0.12),0_0_24px_rgba(245,158,11,0.1)]',
  blue: 'border-l-[3px] border-l-accent-blue hover:shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_28px_rgba(0,240,255,0.12),0_0_24px_rgba(59,130,246,0.1)]',
};

export const GlassCard = memo<GlassCardProps>(({
  children,
  variant,
  tone = 'default',
  shine = false,
  className,
}) => {
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!shineRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    shineRef.current.style.setProperty('--shine-x', `${x}%`);
    shineRef.current.style.setProperty('--shine-y', `${y}%`);
    shineRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (shineRef.current) shineRef.current.style.opacity = '0';
  }, []);

  const baseClasses =
    'relative overflow-hidden bg-glass border border-white/[0.08] rounded-lg p-4 shadow-[0_24px_70px_rgba(0,0,0,0.62),0_0_28px_rgba(0,240,255,0.12)] backdrop-blur-glass-mobile transition-all duration-base ease-standard hover:-translate-y-px';

  const toneClasses = tone === 'dark' ? 'bg-glass-strong' : '';

  const classes = [
    baseClasses,
    variant ? variantClasses[variant] : '',
    toneClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      onMouseMove={shine ? handleMouseMove : undefined}
      onMouseLeave={shine ? handleMouseLeave : undefined}
    >
      {/* Glass shimmer effect (hidden on mobile) - kept as CSS for performance */}
      <div className="absolute inset-[-45%_-25%_35%_-25%] bg-gradient-to-br from-white/30 to-transparent opacity-0 pointer-events-none" />

      {/* Glass inset effects */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.26),inset_0_-1px_0_0_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_-16px_30px_rgba(0,0,0,0.35)]" />

      {shine && <div ref={shineRef} className="card-shine" />}

      <div className="relative z-[1]">{children}</div>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';
