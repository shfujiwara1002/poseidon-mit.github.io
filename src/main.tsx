import React, { Suspense, Component, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, useRouter } from './router';
import { routes, type RoutePath } from './router/lazyRoutes';
import { AppNavShell } from './components/layout/AppNavShell';
import './styles/tailwind.css';
import './styles/app.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#070d1a',
            color: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠</div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}>Something went wrong</p>
            <button
              onClick={() => window.location.replace('/')}
              style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', background: '#1ae3c7', color: '#070d1a', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#070d1a',
        color: '#94a3b8',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      Loading...
    </div>
  );
}

/** Routes that use the AppNavShell wrapper (authenticated app pages) */
const APP_SHELL_PREFIXES = ['/dashboard', '/protect', '/grow', '/execute', '/govern', '/settings', '/help'];

function isAppRoute(path: string): boolean {
  return APP_SHELL_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

function RouterOutlet() {
  const { path } = useRouter();
  const LazyComponent = routes[path as RoutePath];
  const PageComponent = LazyComponent || routes['/'];

  if (!PageComponent) return <RouteLoadingFallback />;

  if (isAppRoute(path)) {
    return (
      <AppNavShell path={path}>
        <PageComponent />
      </AppNavShell>
    );
  }

  return <PageComponent />;
}

function MinimalApp() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <RouterOutlet />
        </Suspense>
      </RouterProvider>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
