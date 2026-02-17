import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

export function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  const typeConfig = {
    success: { icon: '✓' },
    error: { icon: '✗' },
    warning: { icon: '⚠' },
    info: { icon: 'ℹ' },
  } as const;

  return (
    <div className="mission-notification-stack">
      <AnimatePresence>
        {notifications.map((notification) => {
          const config = typeConfig[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="mission-notification-item"
            >
              <div className="mission-notification-card" data-type={notification.type}>
                <div className="mission-notification-content">
                  <div className="mission-notification-icon">{config.icon}</div>

                  <div className="mission-notification-copy">
                    <h4>{notification.title}</h4>
                    {notification.message && <p>{notification.message}</p>}

                    {notification.action && (
                      <button
                        onClick={notification.action.onClick}
                        className="mission-notification-action"
                      >
                        {notification.action.label} →
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="mission-notification-close"
                    aria-label="Close notification"
                  >
                    ✕
                  </button>
                </div>

                {notification.duration && notification.duration > 0 && (
                  <motion.div
                    className="mission-notification-progress"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                  >
                    <div className="mission-notification-progress-fill" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
