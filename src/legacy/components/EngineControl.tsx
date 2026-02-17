import React from 'react';
import { useMutation } from '../hooks/useQuery';
import { mockService } from '../api/mockService';
import { useUI } from '../contexts/UIContext';
import { useEngines } from '../contexts/EngineContext';
import { Button } from './Button';
import type { EngineMetrics } from '../contexts/EngineContext';

interface EngineControlProps {
  engineId: string;
}

/**
 * Example component demonstrating useMutation hook usage
 * This component allows updating engine metrics via API
 */
export const EngineControl: React.FC<EngineControlProps> = ({ engineId }) => {
  const { addNotification } = useUI();
  const { updateMetrics } = useEngines();

  const { mutate: updateEngine, isLoading } = useMutation(
    ({ engineId, metrics }: { engineId: string; metrics: Partial<EngineMetrics> }) =>
      mockService.updateEngineMetrics(engineId, metrics),
    {
      onSuccess: (data) => {
        // Update local context with new data
        updateMetrics(engineId, data.metrics);

        // Show success notification
        addNotification({
          type: 'success',
          message: `Metrics updated for ${data.name}`,
          duration: 3000
        });
      },
      onError: (error) => {
        // Show error notification
        addNotification({
          type: 'error',
          message: `Error: ${error.message}`,
          duration: 5000
        });
      }
    }
  );

  const handleOptimize = async () => {
    // Simulate optimization by increasing metrics slightly
    const optimizedMetrics: Partial<EngineMetrics> = {
      accuracy: Math.min(99, Math.random() * 3 + 95),
      speed: Math.min(99, Math.random() * 3 + 95)
    };

    await updateEngine({ engineId, metrics: optimizedMetrics });
  };

  return (
    <div
      style={{
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fff',
          marginBottom: '0.5rem'
        }}
      >
        Engine Controls
      </h3>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '1rem'
        }}
      >
        Optimize engine performance with AI-driven adjustments
      </p>
      <Button
        onClick={handleOptimize}
        variant="primary"
        disabled={isLoading}
        style={{ width: '100%' }}
      >
        {isLoading ? 'Optimizing...' : 'Optimize Engine'}
      </Button>
    </div>
  );
};
