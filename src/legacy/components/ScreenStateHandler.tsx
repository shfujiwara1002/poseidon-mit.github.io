import React from 'react';
import type { UniversalScreenState } from '../contracts/screen-contract';
import { MissionEmptyState } from './MissionEmptyState';
import { Skeleton } from './Skeleton';
import { Link } from '../router';

interface ScreenStateHandlerProps {
  state: UniversalScreenState;
  screenId: string;
  children: React.ReactNode;
  onRetry?: () => void;
}

/**
 * ScreenStateHandler — renders appropriate UI for each of the 6 universal screen states.
 * Wraps page content and only renders children when state is 'success' or 'partial'.
 */
export function ScreenStateHandler({ state, screenId, children, onRetry }: ScreenStateHandlerProps) {
  switch (state) {
    case 'loading':
      return (
        <div className="screen-state screen-state--loading" data-screen={screenId} aria-busy="true">
          <div className="screen-state-skeleton">
            <Skeleton height="48px" width="60%" />
            <Skeleton height="24px" width="80%" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
              <Skeleton height="120px" />
              <Skeleton height="120px" />
              <Skeleton height="120px" />
            </div>
            <Skeleton height="200px" />
          </div>
        </div>
      );

    case 'empty':
      return (
        <div className="screen-state screen-state--empty" data-screen={screenId}>
          <MissionEmptyState
            title="No data available"
            description="This screen has no data to display yet. Connect your accounts or check back later."
            action={
              <Link to="/onboarding/connect" className="entry-btn entry-btn--primary">
                Connect accounts
              </Link>
            }
          />
        </div>
      );

    case 'partial':
      return (
        <div className="screen-state screen-state--partial" data-screen={screenId}>
          <div className="screen-state-partial-banner" role="status">
            Some data is still loading. Showing available information.
          </div>
          {children}
        </div>
      );

    case 'error-recoverable':
      return (
        <div className="screen-state screen-state--error" data-screen={screenId}>
          <MissionEmptyState
            title="Something went wrong"
            description="We couldn't load this screen. This is usually temporary."
            action={
              onRetry ? (
                <button type="button" className="entry-btn entry-btn--primary" onClick={onRetry}>
                  Try again
                </button>
              ) : undefined
            }
          />
        </div>
      );

    case 'error-permission':
      return (
        <div className="screen-state screen-state--permission" data-screen={screenId}>
          <MissionEmptyState
            title="Access restricted"
            description="You don't have permission to view this screen. Contact your administrator."
            action={
              <Link to="/settings" className="entry-btn entry-btn--ghost">
                Check permissions
              </Link>
            }
          />
        </div>
      );

    case 'success':
    default:
      return <>{children}</>;
  }
}
