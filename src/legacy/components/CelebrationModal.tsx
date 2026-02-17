/**
 * CelebrationModal Component
 * Fullscreen celebration overlay with confetti animation
 * Part of Gap 6: Emotional/Wellness UX
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../shared/theme';
import { CelebrationEvent } from '../services/celebrationEngine';
import { Star, Flame, Trophy, PiggyBank, TrendingUp, Sparkles } from 'lucide-react';
import { launchConfetti } from '../animations/confetti';

interface CelebrationModalProps {
  event: CelebrationEvent | null;
  onClose: () => void;
}

/**
 * Get emoji icon based on event type
 */
function getEventIcon(type: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    goal_reached: <Star size={64} />,
    streak_maintained: <Flame size={64} />,
    milestone: <Trophy size={64} />,
    savings_target: <PiggyBank size={64} />,
    portfolio_high: <TrendingUp size={64} />
  };
  return iconMap[type] || <Sparkles size={64} />;
}

/**
 * CelebrationModal Component
 */
export const CelebrationModal: React.FC<CelebrationModalProps> = ({ event, onClose }) => {
  const [autoCloseTimer, setAutoCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (event) {
      // Launch confetti
      launchConfetti({ count: event.confettiCount });

      // Set auto-close timer
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      setAutoCloseTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [event, onClose]);

  const handleClose = () => {
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {event && (
        <motion.div
          key={`celebration-${event.type}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 'var(--z-celebration, 700)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
              duration: 0.4
            }}
            style={{
              backgroundColor: theme.colors.glass.bg,
              border: `1px solid ${theme.colors.glass.border}`,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.space12,
              maxWidth: '500px',
              textAlign: 'center',
              backdropFilter: theme.effects.glass.backdrop,
              boxShadow: theme.effects.glass.shadow,
              cursor: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                damping: 10,
                stiffness: 150,
                delay: 0.1
              }}
              style={{
                marginBottom: theme.spacing.space6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.accent.cyan
              }}
            >
              {getEventIcon(event.type)}
            </motion.div>

            {/* Title with gradient */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                margin: 0,
                marginBottom: theme.spacing.space4,
                fontSize: theme.typography.scale.h2,
                fontWeight: theme.typography.weight.bold,
                backgroundImage: theme.effects.gradient.text.cyan,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none'
              }}
            >
              {event.title}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              style={{
                margin: 0,
                marginBottom: theme.spacing.space8,
                fontSize: theme.typography.scale.body,
                color: theme.colors.text.muted,
                lineHeight: theme.typography.lineHeight.body
              }}
            >
              {event.message}
            </motion.p>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: `${theme.spacing.space3} ${theme.spacing.space6}`,
                backgroundColor: theme.colors.accent.cyan,
                color: theme.colors.text.onAccent,
                border: 'none',
                borderRadius: theme.radius.md,
                fontSize: theme.typography.scale.body,
                fontWeight: theme.typography.weight.semibold,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
