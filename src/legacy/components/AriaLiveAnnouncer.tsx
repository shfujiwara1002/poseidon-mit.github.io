import {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { logger } from '../utils/logger';

interface AriaAnnouncerContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AriaAnnouncerContext = createContext<AriaAnnouncerContextValue | undefined>(
  undefined
);

/**
 * AriaAnnouncerProvider
 *
 * Provides a centralized way to announce messages to screen reader users.
 * Creates two hidden ARIA live regions: one for polite announcements (default)
 * and one for assertive announcements (urgent updates).
 *
 * Messages are announced, then cleared after 1000ms to allow re-announcement
 * of the same text if needed.
 *
 * Usage:
 * <AriaAnnouncerProvider>
 *   <App />
 * </AriaAnnouncerProvider>
 *
 * In components:
 * const { announce } = useAriaAnnouncer();
 * announce('Portfolio updated successfully', 'polite');
 */
export function AriaAnnouncerProvider({ children }: { children: ReactNode }) {
  const politeRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const regionRef = priority === 'assertive' ? assertiveRegionRef : politeRegionRef;

      if (!regionRef.current) {
        logger.warn(
          `AriaLiveAnnouncer: ${priority} region not available for announcement`
        );
        return;
      }

      // Set the message
      regionRef.current.textContent = message;

      // Clear after delay to allow re-announcement of same text
      const timeoutId = setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = '';
        }
      }, 1000);

      // Return cleanup function (rarely needed, but good practice)
      return () => clearTimeout(timeoutId);
    },
    []
  );

  return (
    <AriaAnnouncerContext.Provider value={{ announce }}>
      {/* Hidden polite live region */}
      <div
        ref={politeRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="aria-live-polite"
      />

      {/* Hidden assertive live region */}
      <div
        ref={assertiveRegionRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="aria-live-assertive"
      />

      {children}
    </AriaAnnouncerContext.Provider>
  );
}

/**
 * Hook to access the ARIA announcer from anywhere in the component tree.
 *
 * Usage:
 * const { announce } = useAriaAnnouncer();
 * announce('Your message', 'polite');
 *
 * @throws Error if used outside AriaAnnouncerProvider
 */
export function useAriaAnnouncer() {
  const context = useContext(AriaAnnouncerContext);

  if (!context) {
    throw new Error(
      'useAriaAnnouncer must be used within AriaAnnouncerProvider'
    );
  }

  return context;
}
