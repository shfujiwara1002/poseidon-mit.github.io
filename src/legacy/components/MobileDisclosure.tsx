import React, { useState } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

interface MobileDisclosureProps {
  /** Summary shown when collapsed on mobile */
  summary: React.ReactNode;
  /** Full content revealed on expand (mobile) or always visible (desktop) */
  children: React.ReactNode;
  /** Start collapsed on mobile? Defaults to true. */
  defaultCollapsed?: boolean;
}

/**
 * Summary-first disclosure pattern.
 * - Mobile: shows summary + expand toggle; children are collapsed by default.
 * - Desktop: renders children directly, no toggle.
 */
export const MobileDisclosure: React.FC<MobileDisclosureProps> = ({
  summary,
  children,
  defaultCollapsed = true,
}) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-disclosure">
      <button
        type="button"
        className="mobile-disclosure__trigger"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="mobile-disclosure__summary">{summary}</span>
        <span className={`mobile-disclosure__chevron${collapsed ? '' : ' mobile-disclosure__chevron--open'}`} aria-hidden>
          &#x25BE;
        </span>
      </button>
      {!collapsed && (
        <div className="mobile-disclosure__content">
          {children}
        </div>
      )}
    </div>
  );
};
