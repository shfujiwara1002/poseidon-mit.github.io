import { memo } from 'react';
import './LoadingSpinner.css';
import { copy } from '../content/microcopy-catalog';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner = memo(({ size = 'medium' }: LoadingSpinnerProps) => {
  return (
    <div
      className={`loading-spinner loading-spinner--${size}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={copy('app_loading')}
    >
      <div className="spinner-ring" />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
