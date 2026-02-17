import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { realtimeClient, ConnectionState } from '../services/websocket';

export function SystemStatus() {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const unsub = realtimeClient.onStateChange((newState) => {
      setState(newState);
    });

    const interval = setInterval(() => {
      setLatency(realtimeClient.currentLatency);
    }, 2000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const isConnected = state === 'connected';
  const statusTone = isConnected
    ? 'live'
    : state === 'reconnecting'
      ? 'warning'
      : 'critical';
  const statusText = isConnected ? `${latency}ms` : state === 'reconnecting' ? 'Reconnecting...' : 'Offline';

  return (
    <div
      className="system-status"
      role="status"
      aria-label={`System ${isConnected ? 'connected' : 'disconnected'}`}
    >
      <motion.div
        className={`system-status-dot system-status-dot--${statusTone}`}
        animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="system-status-text">
        {statusText}
      </span>
    </div>
  );
}
