/**
 * ReassurancePrompt Component
 * Toast-style reassurance card positioned at bottom-left
 * Part of Gap 6: Emotional/Wellness UX
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../shared/theme';
import { ReassuranceEvent } from '../services/reassuranceEngine';
import { AlertTriangle, Info, Bell } from 'lucide-react';

interface ReassurancePromptProps {
  event: ReassuranceEvent | null;
  onDismiss: () => void;
  onAction?: () => void;
}

/**
 * Get color based on severity level
 */
function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    gentle: theme.colors.accent.teal,
    moderate: theme.colors.accent.amber,
    urgent: '#FF6B6B' // Softer red, not alarming
  };
  return colorMap[severity] || theme.colors.accent.teal;
}

/**
 * Get icon based on severity
 */
function getSeverityIcon(severity: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    gentle: <Info size={24} />,
    moderate: <AlertTriangle size={24} />,
    urgent: <Bell size={24} />
  };
  return iconMap[severity] || <Info size={24} />;
}

/**
 * ReassurancePrompt Component
 */
export const ReassurancePrompt: React.FC<ReassurancePromptProps> = ({
  event,
  onDismiss,
  onAction
}) => {
  const [autoDismissTimer, setAutoDismissTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (event) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 10000);

      setAutoDismissTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [event, onDismiss]);

  const handleDismiss = () => {
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
    onDismiss();
  };

  const borderColor = event ? getSeverityColor(event.severity) : theme.colors.accent.teal;
  const icon = event ? getSeverityIcon(event.severity) : <Info size={24} />;

  return (
    <AnimatePresence mode="wait">
      {event && (
        <motion.div
          key={`reassurance-${event.trigger}`}
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: theme.spacing.space6,
            left: theme.spacing.space6,
            maxWidth: '380px',
            zIndex: theme.zIndex.toast,
            willChange: 'transform, opacity'
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.glass.bg,
              border: `1px solid ${theme.colors.glass.border}`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: theme.radius.md,
              padding: theme.spacing.space4,
              backdropFilter: theme.effects.glass.backdrop,
              boxShadow: theme.effects.glass.shadow,
              display: 'flex',
              gap: theme.spacing.space4,
              alignItems: 'flex-start'
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: '24px',
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              {icon}
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                minWidth: 0
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: theme.spacing.space2,
                  fontSize: theme.typography.scale.body,
                  color: theme.colors.text.primary,
                  fontWeight: theme.typography.weight.medium,
                  lineHeight: theme.typography.lineHeight.tight
                }}
              >
                {event.message}
              </p>

              {/* Action Button (if present) */}
              {event.action && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAction}
                  style={{
                    marginTop: theme.spacing.space3,
                    padding: `${theme.spacing.space2} ${theme.spacing.space3}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: borderColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: theme.radius.sm,
                    fontSize: theme.typography.scale.small,
                    fontWeight: theme.typography.weight.semibold,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    width: '100%'
                  }}
                >
                  {event.action.label}
                </motion.button>
              )}
            </div>

            {/* Dismiss Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.text.muted,
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 200ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = theme.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = theme.colors.text.muted;
              }}
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
