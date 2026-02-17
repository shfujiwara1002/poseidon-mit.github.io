/**
 * Chat Message Component
 * Renders individual chat messages with support for multiple response types
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  responseType?: 'text' | 'chart' | 'table' | 'number';
  data?: any;
}

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

/**
 * Render markdown-like formatting: **bold**, lists, newlines
 */
function formatMessageContent(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = 0;

  // Split by newlines first
  const lines = text.split('\n');

  lines.forEach((line, _lineIdx) => {
    if (!line.trim()) {
      parts.push(<br key={`br-${key++}`} />);
      return;
    }

    // Handle bullet points
    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      const content = line.replace(/^[\s•\-]+/, '').trim();
      parts.push(
        <div key={`bullet-${key++}`} className="ml-4 flex gap-2 text-sm leading-relaxed">
          <span className="flex-shrink-0">•</span>
          <span>{formatBoldText(content)}</span>
        </div>
      );
      return;
    }

    // Handle regular text with bold formatting
    parts.push(
      <div key={`text-${key++}`} className="text-sm leading-relaxed">
        {formatBoldText(line)}
      </div>
    );
  });

  return parts;
}

/**
 * Format **bold** text within a string
 */
function formatBoldText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={`bold-${match.index}`}>{match[1]}</strong>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Render number response with large formatted number
 */
function renderNumberResponse(data: any): React.ReactNode {
  if (!data?.number) return null;

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: data.currency || 'USD',
    minimumFractionDigits: 2
  }).format(data.number);

  return (
    <div className="mission-chat-message-number">
      <div className="mission-chat-message-number-value">{formatted}</div>
      {data.change && (
        <div className="mission-chat-message-number-change">
          {data.change}
        </div>
      )}
    </div>
  );
}

function getRowTone(index: number): 'even' | 'odd' {
  return index % 2 === 0 ? 'even' : 'odd';
}

/**
 * Render table response with styled rows and columns
 */
function renderTableResponse(data: any): React.ReactNode {
  if (!data?.rows || data.rows.length === 0) return null;

  const rows = data.rows as Record<string, string | number>[];
  const columns = Object.keys(rows[0] || {});

  return (
    <div className="mission-chat-message-table-wrap">
      <table className="mission-chat-message-table">
        <thead>
          <tr className="mission-chat-message-table-head">
            {columns.map(col => (
              <th
                key={col}
                className="mission-chat-message-table-heading"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="mission-chat-message-table-row"
              data-tone={getRowTone(idx)}
            >
              {columns.map(col => (
                <td
                  key={`${idx}-${col}`}
                  className="mission-chat-message-table-cell"
                >
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Render chart response with simplified bar representation
 */
function renderChartResponse(data: any): React.ReactNode {
  if (!data?.points || data.points.length === 0) return null;

  const points = data.points as Array<{ label: string; value: number }>;
  const maxValue = Math.max(...points.map(p => p.value), 1);

  return (
    <div className="mission-chat-message-chart">
      {points.map((point, idx) => (
        <div key={idx} className="mission-chat-message-chart-row">
          <div className="mission-chat-message-chart-label">
            {point.label}
          </div>
          <div className="mission-chat-message-chart-track">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: point.value / maxValue }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mission-chat-message-chart-fill"
            >
              <span className="mission-chat-message-chart-value">
                ${point.value.toLocaleString()}
              </span>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Format timestamp in compact form (HH:MM)
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function avatarForRole(isUser: boolean): React.ReactNode {
  if (isUser) {
    return <span aria-hidden="true">👤</span>;
  }
  return <Bot size={18} />;
}

/**
 * ChatMessage Component
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mission-chat-message mission-chat-message--${isUser ? 'user' : 'assistant'}`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="mission-chat-message-avatar mission-chat-message-avatar--assistant">
          {avatarForRole(false)}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className="mission-chat-message-bubble"
        data-role={isUser ? 'user' : 'assistant'}
      >
        {/* Main content */}
        <div>
          {message.responseType && message.responseType !== 'text' ? (
            <>
              {/* Response label */}
              <div
                className="mission-chat-message-response-label"
                data-role={isUser ? 'user' : 'assistant'}
              >
                {message.content}
              </div>

              {/* Response data rendering */}
              {message.responseType === 'number' && renderNumberResponse(message.data)}
              {message.responseType === 'table' && renderTableResponse(message.data)}
              {message.responseType === 'chart' && renderChartResponse(message.data)}
            </>
          ) : (
            /* Text content with markdown formatting */
            <div className="mission-chat-message-text-block">
              {formatMessageContent(message.content)}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div
          className="mission-chat-message-time"
          data-role={isUser ? 'user' : 'assistant'}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="mission-chat-message-avatar mission-chat-message-avatar--user">
          {avatarForRole(true)}
        </div>
      )}
    </motion.div>
  );
}
