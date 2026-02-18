/**
 * @deprecated — Legacy unified App wrapper.
 * Replaced by MinimalApp + AppNavShell in src/main.tsx.
 * Kept in src/legacy/ for reference only. Do NOT import.
 */
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './components/AppShell';
import { BootSplash } from './components/BootSplash';
import { ToastContainer } from './components/Toast';
import { NotificationToast } from './components/NotificationToast';
import { useRouter } from './router';
import { prefetchRoute, routes, type RoutePath } from './router/lazyRoutes';
import { NotFound } from './pages/NotFound';
import { UIProvider } from './contexts/UIContext';
import { EngineProvider } from './contexts/EngineContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchProvider } from './contexts/SearchContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AutonomyProvider } from './contexts/AutonomyContext';
import { IntentProvider } from './contexts/IntentContext';
import { InvestorProfileProvider } from './contexts/InvestorProfileContext';
import { ExpertModeProvider } from './contexts/ExpertModeContext';
import { AriaAnnouncerProvider } from './components/AriaLiveAnnouncer';
import { AgentExecutionProvider } from './contexts/AgentExecutionContext';
import { DesignSystemProvider } from './design-system';
import { useCommandPalette } from './hooks/useCommandPalette';
import './styles/themes.css';
import './styles/colorblind-palettes.css';

const AIChatbot = lazy(() => import('./components/AIChatbot').then((m) => ({ default: m.AIChatbot })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })));
const SystemStatus = lazy(() => import('./components/SystemStatus').then((m) => ({ default: m.SystemStatus })));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt').then((m) => ({ default: m.PWAInstallPrompt })));
const UpdateNotification = lazy(() => import('./components/UpdateNotification').then((m) => ({ default: m.UpdateNotification })));
const OfflineBanner = lazy(() => import('./components/OfflineBanner').then((m) => ({ default: m.OfflineBanner })));

function RouteLoadingFallback() {
  return (
    <div className="route-loading-fallback" role="status" aria-live="polite" aria-label="Loading page">
      <div className="route-transition-progress" aria-hidden="true" />
      <BootSplash />
    </div>
  );
}

function AppContent() {
  const { path } = useRouter();

  // Get lazy-loaded component or fallback to NotFound
  const LazyComponent = routes[path as keyof typeof routes];
  const isKnownRoute = Boolean(LazyComponent);

  useEffect(() => {
    if (!isKnownRoute) return;

    const nextByPrefix: Array<[string, RoutePath[]]> = [
      ['/dashboard', ['/dashboard/alerts', '/dashboard/insights']],
      ['/protect', ['/protect/alert-detail', '/protect/dispute']],
      ['/grow', ['/grow/scenarios', '/grow/recommendations']],
      ['/execute', ['/execute/approval', '/execute/history']],
      ['/govern', ['/govern/audit', '/govern/policy']],
      ['/settings', ['/settings/ai', '/settings/rights']],
    ];

    const candidates =
      nextByPrefix.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[1] ?? [];
    if (candidates.length === 0) return;

    const run = () => {
      candidates.forEach((candidate) => {
        void prefetchRoute(candidate);
      });
    };

    const requestIdle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (requestIdle) {
      const id = requestIdle(run);
      return () => {
        const cancelIdle = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        cancelIdle?.(id);
      };
    }

    const timeoutId = window.setTimeout(run, 250);
    return () => window.clearTimeout(timeoutId);
  }, [isKnownRoute, path]);

  return (
    <AppShell
      className={isKnownRoute ? 'app-shell--entry' : undefined}
      ambientEffects={!isKnownRoute}
      showTopNav={!isKnownRoute}
      showEngineTabs={false}
      showBottomNav={false}
    >
      <Suspense fallback={<RouteLoadingFallback />}>
        {LazyComponent ? <LazyComponent /> : <NotFound />}
      </Suspense>
    </AppShell>
  );
}

function GlobalComponents() {
  const { isOpen, close } = useCommandPalette();
  const [deferredUiReady, setDeferredUiReady] = useState(false);
  const [hasOpenedPalette, setHasOpenedPalette] = useState(false);

  useEffect(() => {
    const onIdle = () => setDeferredUiReady(true);
    const requestIdle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const cancelIdle = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    if (requestIdle) {
      const id = requestIdle(onIdle);
      return () => {
        if (cancelIdle) {
          cancelIdle(id);
        }
      };
    }
    const timeoutId = window.setTimeout(onIdle, 250);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasOpenedPalette(true);
    }
  }, [isOpen]);

  return (
    <>
      <AppContent />
      <ToastContainer />
      <NotificationToast />
      {deferredUiReady && (
        <Suspense fallback={null}>
          <OfflineBanner />
          <AIChatbot />
          <SystemStatus />
          <PWAInstallPrompt />
          <UpdateNotification />
        </Suspense>
      )}
      {(isOpen || hasOpenedPalette) && (
        <Suspense fallback={null}>
          <CommandPalette isOpen={isOpen} onClose={close} />
        </Suspense>
      )}
    </>
  );
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DesignSystemProvider>
        <ThemeProvider>
          <NotificationProvider>
            <SearchProvider>
              <UIProvider>
                <EngineProvider>
                  <AutonomyProvider>
                    <AgentExecutionProvider>
                    <IntentProvider>
                      <InvestorProfileProvider>
                        <ExpertModeProvider>
                          <AriaAnnouncerProvider>
                            <GlobalComponents />
                          </AriaAnnouncerProvider>
                        </ExpertModeProvider>
                      </InvestorProfileProvider>
                    </IntentProvider>
                    </AgentExecutionProvider>
                  </AutonomyProvider>
                </EngineProvider>
              </UIProvider>
            </SearchProvider>
          </NotificationProvider>
        </ThemeProvider>
      </DesignSystemProvider>
    </ErrorBoundary>
  );
};
