/**
 * Re-export of useAriaAnnouncer hook for clean import path.
 *
 * Usage:
 * import { useAriaAnnouncer } from '../hooks/useAriaAnnouncer';
 *
 * const { announce } = useAriaAnnouncer();
 * announce('Portfolio updated', 'polite');
 */

export { useAriaAnnouncer } from '../components/AriaLiveAnnouncer';
