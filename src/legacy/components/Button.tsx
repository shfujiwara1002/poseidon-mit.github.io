import React, { memo } from 'react';
import { Link } from '../router';

type ButtonVariant = 'primary' | 'ghost' | 'soft';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  to?: string;
  href?: string;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<ButtonVariant, string> = {
  ghost:
    'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30 hover:text-white hover:bg-white/[0.06]',
  primary:
    'bg-gradient-to-br from-[#1ae3c7] to-[#00c6ff] text-[#04141a] font-semibold shadow-[0_12px_32px_rgba(0,198,255,0.2)] hover:shadow-[0_16px_40px_rgba(0,198,255,0.35)]',
  soft: 'bg-accent-teal/10 border-accent-teal/30 text-white hover:bg-accent-teal/20 hover:shadow-[0_0_16px_rgba(21,225,194,0.12)]',
};

const sizeClasses = {
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3.5 text-lg',
};

export const Button = memo<ButtonProps>(({
  variant = 'ghost',
  size = 'md',
  to,
  href,
  loading,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center gap-2 rounded-full border border-transparent transition-all duration-fast ease-standard cursor-pointer no-underline min-h-[44px] relative';

  const hoverClasses = loading || disabled ? '' : 'hover:-translate-y-px active:translate-y-0 active:scale-[0.97] active:duration-[50ms]';

  const focusClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/60';

  const disabledClasses =
    disabled || loading
      ? 'text-white/40 cursor-not-allowed border-white/10 bg-white/[0.02] pointer-events-none'
      : '';

  const loadingClasses = loading ? 'text-transparent' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses,
    focusClasses,
    disabledClasses,
    loadingClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
      {loading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Loading"
        >
          <span className="w-4 h-4 border-2 border-white/30 border-t-white/90 rounded-full animate-spin" />
        </span>
      )}
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';
