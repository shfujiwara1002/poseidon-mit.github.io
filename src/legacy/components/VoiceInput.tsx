/**
 * Voice Input Component
 * Animated mic button with voice recording functionality
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

/**
 * VoiceInput Component
 * Displays animated mic button and handles voice input
 */
export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { isListening, transcript, startListening, stopListening, isSupported, error } =
    useVoiceInput();

  // Handle transcript completion
  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript.trim());
    }
  }, [isListening, transcript, onTranscript]);

  // Hide if not supported
  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <motion.div
      className={cn('mission-voice-input', className)}
      data-listening={isListening ? 'true' : 'false'}
    >
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={error || (isListening ? 'Stop listening' : 'Start voice input')}
        className="mission-voice-input-button"
      >
        {/* Pulse animation when listening */}
        {isListening && (
          <>
            {/* Outer pulse ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className="mission-voice-input-pulse mission-voice-input-pulse--outer"
            />

            {/* Inner pulse glow */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(var(--state-critical-rgb), 0.5)',
                  '0 0 0 8px rgba(var(--state-critical-rgb), 0.25)',
                  '0 0 0 12px rgba(var(--state-critical-rgb), 0)'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className="mission-voice-input-pulse mission-voice-input-pulse--inner"
            />
          </>
        )}

        {/* Microphone icon with animated state */}
        <motion.div
          animate={
            isListening
              ? {
                  scale: [1, 1.05, 1],
                  color: ['var(--state-critical)', 'var(--state-active)', 'var(--state-critical)']
                }
              : {
                  scale: 1,
                  color: 'rgba(191, 211, 237, 0.78)'
                }
          }
          transition={{
            duration: isListening ? 0.8 : 0.2,
            repeat: isListening ? Infinity : 0
          }}
          className="mission-voice-input-icon"
        >
          🎤
        </motion.div>
      </motion.button>

      {/* Error indicator */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mission-voice-input-status mission-voice-input-status--error"
        >
          {error}
        </motion.div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="mission-voice-input-status mission-voice-input-status--listening"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="mission-voice-input-live-dot"
          >
            ●
          </motion.span>
          Listening...
        </motion.div>
      )}
    </motion.div>
  );
}
