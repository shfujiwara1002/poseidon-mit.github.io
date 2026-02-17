import { motion, AnimatePresence } from 'framer-motion';
import { useAgentExecution } from '../contexts/AgentExecutionContext';

const engineColors: Record<string, string> = {
  protect: '#22C55E',
  grow: '#8B5CF6',
  execute: '#EAB308',
  govern: '#3B82F6',
};

export function AgentControl() {
  const { currentTask, pauseTask, resumeTask, cancelTask } = useAgentExecution();

  return (
    <AnimatePresence>
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 w-80 rounded-xl overflow-hidden"
          style={{
            zIndex: 'var(--z-agent-control, 450)',
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            border: `1px solid ${engineColors[currentTask.engine]}40`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset`,
          }}
          role="status"
          aria-label="Agent task in progress"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentTask.state === 'running' ? engineColors[currentTask.engine] : '#EAB308' }}
                  animate={currentTask.state === 'running' ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs font-semibold" style={{ color: '#f8fafc' }}>
                  {currentTask.state === 'running' ? 'Agent Running' : 'Paused'}
                </span>
              </div>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {currentTask.engine}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {currentTask.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Progress</span>
                <span style={{ color: engineColors[currentTask.engine] }}>{currentTask.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: engineColors[currentTask.engine] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentTask.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {currentTask.state === 'running' ? (
                <button
                  onClick={() => pauseTask(currentTask.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium touch-target"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => resumeTask(currentTask.id)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium touch-target"
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22C55E' }}
                >
                  Resume
                </button>
              )}
              <button
                onClick={() => cancelTask(currentTask.id)}
                className="flex-1 py-2 rounded-lg text-xs font-medium touch-target"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
