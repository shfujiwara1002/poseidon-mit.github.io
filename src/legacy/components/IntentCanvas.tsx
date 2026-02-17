import { motion, AnimatePresence } from 'framer-motion';
import { useIntents, AgentIntent } from '../contexts/IntentContext';
import { useAutonomy } from '../contexts/AutonomyContext';

interface IntentCanvasProps {
  intent: AgentIntent;
  onApprove: () => void;
  onReject: () => void;
  onModify: () => void;
}

const engineColors: Record<string, string> = {
  protect: '#22C55E',
  grow: '#8B5CF6',
  execute: '#EAB308',
  govern: '#3B82F6',
};

function IntentCanvasContent({ intent, onApprove, onReject, onModify }: IntentCanvasProps) {
  const color = engineColors[intent.engine] || '#00F0FF';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 'var(--z-modal, 210)', backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(10, 14, 26, 0.95)',
          border: `1px solid ${color}40`,
          backdropFilter: 'blur(20px)',
        }}
        role="dialog"
        aria-label="AI Agent Intent Preview"
      >
        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
            >
              {intent.engine === 'protect' ? '\u{1F6E1}' : intent.engine === 'grow' ? '\u{1F4C8}' : intent.engine === 'execute' ? '\u26A1' : '\u{1F50D}'}
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#f8fafc' }}>
                Poseidon AI — {intent.engine.charAt(0).toUpperCase() + intent.engine.slice(1)} Engine
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Confidence: {Math.round(intent.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Action */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Planned Action
            </div>
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f8fafc' }}>
              {intent.description}
            </div>
          </div>

          {/* Reasoning */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Why
            </div>
            <div className="space-y-2">
              {intent.reasoning.map((reason, i) => (
                <div key={i} className="flex gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  <span style={{ color }}>{'>'}</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Estimated Impact
            </div>
            {intent.impact.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span style={{ color: 'rgba(255,255,255,0.72)' }}>{item.metric}</span>
                <span style={{ color: item.direction === 'up' ? '#22C55E' : item.direction === 'down' ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>
                  {item.direction === 'up' ? '+' : item.direction === 'down' ? '-' : ''}{item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={onReject}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium touch-target"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}
          >
            Reject
          </button>
          <button
            onClick={onModify}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium touch-target"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#EAB308' }}
          >
            Modify
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium touch-target"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22C55E' }}
          >
            Approve
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function IntentCanvasManager() {
  const { pendingIntent, approveIntent, rejectIntent } = useIntents();
  const { autonomyLevel } = useAutonomy();

  // Auto-approve if autonomy >= 2 and confidence >= 0.9
  if (pendingIntent && autonomyLevel >= 2 && pendingIntent.confidence >= 0.9) {
    approveIntent(pendingIntent.id);
    return null;
  }

  return (
    <AnimatePresence>
      {pendingIntent && (
        <IntentCanvasContent
          intent={pendingIntent}
          onApprove={() => approveIntent(pendingIntent.id)}
          onReject={() => rejectIntent(pendingIntent.id)}
          onModify={() => {/* open modify modal */}}
        />
      )}
    </AnimatePresence>
  );
}
