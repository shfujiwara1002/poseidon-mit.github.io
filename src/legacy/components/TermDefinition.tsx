import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTermDefinition } from '../content/microcopy-standards';
import { theme } from '../shared/theme';

interface TermDefinitionProps {
  term: string;
  children: ReactNode;
}

/**
 * TermDefinition Component
 *
 * Renders inline financial term with accessible tooltip/definition.
 * On desktop: hover to reveal. On mobile: tap to toggle.
 * Auto-dismisses on mobile after 5 seconds.
 *
 * Usage:
 * <TermDefinition term="APY">Annual Percentage Yield</TermDefinition>
 *
 * Props:
 * - term: The financial term to look up
 * - children: The text/element to display (may be different from term)
 */
export function TermDefinition({
  term,
  children,
}: TermDefinitionProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipIdRef = useRef(`tooltip-${Math.random().toString(36).slice(2)}`);

  const definition = getTermDefinition(term);

  // Don't render if term not found
  if (!definition) {
    return <span>{children}</span>;
  }

  const definitionText = definition.en;

  // Detect touch device
  useEffect(() => {
    const detectTouch = () => {
      setIsTouch(
        () =>
          window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
          'ontouchstart' in window
      );
    };
    detectTouch();
    window.addEventListener('resize', detectTouch);
    return () => window.removeEventListener('resize', detectTouch);
  }, []);

  // Handle hover on desktop
  const handleMouseEnter = () => {
    if (!isTouch) {
      setShowTooltip(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      setShowTooltip(false);
    }
  };

  // Handle tap on mobile
  const handleTap = () => {
    if (isTouch) {
      setShowTooltip(!showTooltip);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Auto-dismiss after 5 seconds on mobile
      if (!showTooltip) {
        timeoutRef.current = setTimeout(() => {
          setShowTooltip(false);
        }, 5000);
      }
    }
  };

  // Calculate position to avoid top-of-viewport overlap
  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return 'above';

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const spaceAbove = triggerRect.top;

    // If less than 150px above, show below instead
    return spaceAbove < 150 ? 'below' : 'above';
  };

  const tooltipPosition = calculatePosition();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      className="relative inline-block"
      role="region"
      aria-label={`${term} definition`}
    >
      {/* Visual indicator: dotted underline */}
      <span
        className="border-b-2 border-dotted cursor-help"
        style={{
          borderColor: `${theme.colors.accent.violet}`,
        }}
        aria-describedby={showTooltip ? tooltipIdRef.current : undefined}
      >
        {children}
      </span>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            ref={tooltipRef}
            id={tooltipIdRef.current}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-1/2 -translate-x-1/2 z-50 w-max max-w-xs px-4 py-3 rounded-lg pointer-events-none ${
              tooltipPosition === 'above' ? '-top-2 -translate-y-full' : 'top-full mt-2'
            }`}
            style={{
              background: theme.colors.glass.bg,
              border: `1px solid ${theme.colors.glass.border}`,
              backdropFilter: theme.effects.glass.backdrop,
              boxShadow: theme.effects.glass.shadow,
            }}
          >
            <div
              style={{
                color: theme.colors.text.primary,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                fontFamily: theme.typography.fontUi,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: theme.colors.accent.violet,
                }}
              >
                {term}
              </div>
              <div>{definitionText}</div>
            </div>

            {/* Tooltip arrow indicator */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent"
              style={{
                [tooltipPosition === 'above' ? 'bottom' : 'top']: '-4px',
                borderTopColor:
                  tooltipPosition === 'above'
                    ? theme.colors.glass.border
                    : 'transparent',
                borderBottomColor:
                  tooltipPosition === 'below'
                    ? theme.colors.glass.border
                    : 'transparent',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
