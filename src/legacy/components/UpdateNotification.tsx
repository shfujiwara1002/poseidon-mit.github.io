import React from 'react';
import { usePWA } from '../hooks/usePWA';

/**
 * Displays a non-intrusive banner when a new version is available.
 * Uses the PWA hook's hasUpdate/applyUpdate to trigger service worker reload.
 */
export const UpdateNotification: React.FC = () => {
  const { hasUpdate, applyUpdate } = usePWA();

  if (!hasUpdate) return null;

  return (
    <div className="update-notification" role="status" aria-live="polite">
      <span>A new version is available.</span>
      <button
        type="button"
        className="entry-btn entry-btn--primary entry-btn--sm"
        onClick={applyUpdate}
      >
        Reload
      </button>
    </div>
  );
};
