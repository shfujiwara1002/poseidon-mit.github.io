import { useEffect, useState } from 'react';
import { theme } from '../shared/theme';

export interface RealtimeIndicatorProps {
  lastUpdate?: Date | null;
  isConnected?: boolean;
}

export function RealtimeIndicator({ lastUpdate, isConnected = true }: RealtimeIndicatorProps) {
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('just now');

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeString = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffSecs = Math.floor(diffMs / 1000);

      if (diffSecs < 5) {
        setTimeSinceUpdate('just now');
      } else if (diffSecs < 60) {
        setTimeSinceUpdate(`${diffSecs}s ago`);
      } else {
        const diffMins = Math.floor(diffSecs / 60);
        setTimeSinceUpdate(`${diffMins}m ago`);
      }
    };

    updateTimeString();
    const interval = setInterval(updateTimeString, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full transition-all"
          style={{
            backgroundColor: isConnected ? theme.colors.success : theme.colors.error,
            animation: isConnected ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }}
        />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      {lastUpdate && (
        <>
          <span>•</span>
          <span>Updated: {timeSinceUpdate}</span>
        </>
      )}
    </div>
  );
}
