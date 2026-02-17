import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './Button';
import { copy } from '../content/microcopy-catalog';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // In production, send to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // Example: window.Sentry?.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Default error UI
      return (
        <div className="mission-error-boundary">
          <div className="mission-error-boundary-card">
            <h1 className="mission-error-boundary-title">{copy('error_boundary_title')}</h1>
            <p className="mission-error-boundary-message">
              {this.state.error.message}
            </p>
            <div className="mission-error-boundary-actions">
              <Button onClick={this.reset} variant="primary">
                {copy('error_boundary_retry')}
              </Button>
              <Button onClick={() => (window.location.href = '/dashboard')} variant="ghost">
                {copy('error_boundary_home')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
