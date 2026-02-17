import React, { useEffect, memo } from 'react';
import { useUI } from '../contexts/UIContext';
import type { Notification } from '../contexts/UIContext';
import './Toast.css';

const variantIcon: Record<Notification['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

interface ToastItemProps {
  notification: Notification;
  onDismiss: () => void;
}

const ToastItem = memo<ToastItemProps>(({ notification, onDismiss }) => {
  useEffect(() => {
    const duration = notification.duration || 5000;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [notification.duration, onDismiss]);

  const icon = variantIcon[notification.type];

  return (
    <div
      className={`toast toast--${notification.type}`}
      role="alert"
      aria-live="polite"
    >
      {icon && (
        <span className="toast-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="toast-message">{notification.message}</span>
      <button
        onClick={onDismiss}
        className="toast-close"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
});

ToastItem.displayName = 'ToastItem';

export const ToastContainer = memo(() => {
  const { notifications, removeNotification } = useUI();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {notifications.map(notification => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';

// Legacy Toast component for backward compatibility (inline usage in pages)
type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface LegacyToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
}

const legacyVariantIcon: Record<ToastVariant, string> = {
  default: '',
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
};

export const Toast: React.FC<LegacyToastProps> = ({
  title,
  description,
  variant = 'default',
  action
}) => {
  const classes = ['toast', variant !== 'default' ? `toast--${variant}` : '']
    .filter(Boolean)
    .join(' ');
  const icon = legacyVariantIcon[variant];

  return (
    <div className={classes}>
      {icon && (
        <span className="toast-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="toast-copy">
        <div className="toast-title">{title}</div>
        {description && <div className="toast-description">{description}</div>}
      </div>
      {action && <div className="toast-action-slot">{action}</div>}
    </div>
  );
};
