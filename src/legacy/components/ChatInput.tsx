/**
 * Chat Input Component
 * Text input with send button and quick suggestion chips
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
  suggestions?: string[];
}

/**
 * ChatInput Component
 */
export function ChatInput({ onSend, isTyping, suggestions }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSend(suggestion);
  };

  return (
    <div className="mission-chat-input">
      {/* Quick Suggestion Chips */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mission-chat-input-suggestions"
        >
          {suggestions.map((suggestion, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick(suggestion)}
              className="mission-chat-input-chip"
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="mission-chat-input-row">
        {/* Voice Input Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mission-chat-input-voice"
          aria-label="Voice input"
        >
          🎤
        </motion.button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isTyping}
          className="mission-chat-input-field"
        />

        {/* Send Button */}
        <motion.button
          whileHover={!isTyping && input.trim() ? { scale: 1.05 } : {}}
          whileTap={!isTyping && input.trim() ? { scale: 0.95 } : {}}
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="mission-chat-input-send"
          data-active={!isTyping && input.trim() ? 'true' : 'false'}
          aria-label={isTyping ? 'Waiting for response' : 'Send message'}
        >
          {isTyping ? '⏳' : '→'}
        </motion.button>
      </div>

      {/* Helper Text */}
      <div className="mission-chat-input-helper">
        Press <kbd className="mission-chat-input-kbd">Enter</kbd> to send
      </div>
    </div>
  );
}
