import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function OfflineBanner(): React.ReactNode {
  const { isOffline } = usePWA();

  return (
    <AnimatePresence mode="wait">
      {isOffline && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="mission-offline-banner"
          role="status"
          aria-live="polite"
        >
          <div className="mission-offline-banner-icon" aria-hidden="true">
            <AlertTriangle size={16} />
          </div>

          <div className="mission-offline-banner-copy">
            <div className="mission-offline-banner-title">You're offline. Some features may be unavailable.</div>
            <div className="mission-offline-banner-subtitle">Data may be stale until connection is restored.</div>
          </div>

          <button
            type="button"
            aria-label="Dismiss offline banner"
            className="mission-offline-banner-close"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
