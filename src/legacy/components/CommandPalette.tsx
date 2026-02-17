/**
 * Command Palette Component
 * Global command palette overlay triggered by Cmd+K / Ctrl+K
 * Supports fuzzy search, navigation, and actions across the app
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Lock, TrendingUp, Settings, CreditCard, Target, PiggyBank } from 'lucide-react';
import { useRouter } from '../router';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { copy } from '../content/microcopy-catalog';

export interface Command {
  id: string;
  label: string;
  category: 'Navigate' | 'Actions' | 'Query' | 'Help';
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

function fuzzyScore(search: string, text: string): number {
  if (!search) return 1;

  const lowerSearch = search.toLowerCase();
  const lowerText = text.toLowerCase();

  if (lowerText.includes(lowerSearch)) {
    return 0.8 + (lowerText.indexOf(lowerSearch) === 0 ? 0.2 : 0);
  }

  let searchIdx = 0;
  let textIdx = 0;
  let matches = 0;

  while (searchIdx < lowerSearch.length && textIdx < lowerText.length) {
    if (lowerSearch[searchIdx] === lowerText[textIdx]) {
      matches++;
      searchIdx++;
    }
    textIdx++;
  }

  if (searchIdx === lowerSearch.length) {
    return 0.5 * (matches / lowerSearch.length);
  }

  return 0;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();
  const titleId = 'command-palette-title';
  const descriptionId = 'command-palette-description';
  const listboxId = 'command-palette-listbox';

  useFocusTrap(dialogRef, isOpen);

  const navigateTo = (to: string) => {
    navigate(to);
    onClose();
  };

  const allCommands: Command[] = useMemo(
    () => [
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        category: 'Navigate',
        icon: <BarChart3 size={16} />,
        action: () => navigateTo('/dashboard'),
        keywords: ['home', 'dashboard', 'overview'],
      },
      {
        id: 'nav-protect',
        label: 'Protect',
        category: 'Navigate',
        icon: <Lock size={16} />,
        action: () => navigateTo('/protect'),
        keywords: ['protect', 'security', 'fraud', 'threat'],
      },
      {
        id: 'nav-grow',
        label: 'Grow',
        category: 'Navigate',
        icon: <TrendingUp size={16} />,
        action: () => navigateTo('/grow'),
        keywords: ['grow', 'savings', 'goals', 'wealth'],
      },
      {
        id: 'nav-execute',
        label: 'Execute',
        category: 'Navigate',
        icon: '⚡',
        action: () => navigateTo('/execute'),
        keywords: ['execute', 'actions', 'transactions'],
      },
      {
        id: 'nav-govern',
        label: 'Govern',
        category: 'Navigate',
        icon: '⚖️',
        action: () => navigateTo('/govern'),
        keywords: ['govern', 'compliance', 'rules', 'audit'],
      },
      {
        id: 'nav-settings',
        label: 'Settings',
        category: 'Navigate',
        icon: <Settings size={16} />,
        action: () => navigateTo('/settings'),
        keywords: ['settings', 'preferences', 'configuration'],
      },
      {
        id: 'action-new-transaction',
        label: 'New Transaction',
        category: 'Actions',
        icon: <CreditCard size={16} />,
        action: () => {
          window.dispatchEvent(new CustomEvent('openNewTransaction', { detail: {} }));
          onClose();
        },
        keywords: ['new', 'transaction', 'add', 'create'],
      },
      {
        id: 'action-set-goal',
        label: 'Set Goal',
        category: 'Actions',
        icon: <Target size={16} />,
        action: () => {
          window.dispatchEvent(new CustomEvent('openSetGoal', { detail: {} }));
          onClose();
        },
        keywords: ['goal', 'target', 'objective', 'savings'],
      },
      {
        id: 'action-rebalance',
        label: 'Rebalance Portfolio',
        category: 'Actions',
        icon: '⚖️',
        action: () => {
          window.dispatchEvent(new CustomEvent('openRebalance', { detail: {} }));
          onClose();
        },
        keywords: ['rebalance', 'portfolio', 'assets', 'allocation'],
      },
      {
        id: 'action-export',
        label: 'Export Data',
        category: 'Actions',
        icon: '💾',
        action: () => {
          window.dispatchEvent(new CustomEvent('openExport', { detail: {} }));
          onClose();
        },
        keywords: ['export', 'download', 'csv', 'report'],
      },
      {
        id: 'query-balance',
        label: 'Check Balance',
        category: 'Query',
        icon: <PiggyBank size={16} />,
        action: () => {
          window.dispatchEvent(new CustomEvent('chat', { detail: { message: 'What is my balance?' } }));
          onClose();
        },
        keywords: ['balance', 'account', 'check', 'amount'],
      },
      {
        id: 'query-spending',
        label: 'Spending Summary',
        category: 'Query',
        icon: <BarChart3 size={16} />,
        action: () => {
          window.dispatchEvent(new CustomEvent('chat', { detail: { message: 'Show me my spending this month' } }));
          onClose();
        },
        keywords: ['spending', 'expenses', 'summary', 'budget'],
      },
      {
        id: 'query-performance',
        label: 'Portfolio Performance',
        category: 'Query',
        icon: <TrendingUp size={16} />,
        action: () => {
          window.dispatchEvent(new CustomEvent('chat', { detail: { message: 'How is my portfolio performing?' } }));
          onClose();
        },
        keywords: ['performance', 'portfolio', 'returns', 'growth'],
      },
      {
        id: 'help-shortcuts',
        label: 'View Keyboard Shortcuts',
        category: 'Help',
        icon: '⌨️',
        action: () => {
          setShowShortcutHelp(true);
        },
        keywords: ['shortcut', 'keyboard', 'help', 'keys'],
      },
    ],
    [navigate, onClose, setShowShortcutHelp],
  );

  const filteredCommands = useMemo(() => {
    if (!search) return allCommands;

    const scored = allCommands.map((cmd) => {
      const labelScore = fuzzyScore(search, cmd.label);
      const keywordScores = cmd.keywords.map((kw) => fuzzyScore(search, kw));
      const maxKeywordScore = Math.max(...keywordScores, 0);

      return { cmd, score: Math.max(labelScore, maxKeywordScore) };
    });

    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd);
  }, [search, allCommands]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flattenedCommands = useMemo(() => {
    const result: Command[] = [];
    const categories = ['Navigate', 'Actions', 'Query', 'Help'] as const;
    categories.forEach((cat) => {
      if (groupedCommands[cat]) {
        result.push(...groupedCommands[cat]);
      }
    });
    return result;
  }, [groupedCommands]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % Math.max(1, flattenedCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev === 0 ? Math.max(0, flattenedCommands.length - 1) : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flattenedCommands[selectedIdx]) {
          flattenedCommands[selectedIdx].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIdx, flattenedCommands, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setShowShortcutHelp(false);
      setSearch('');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="mission-command-palette-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.99, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -6 }}
            transition={{ duration: 0.16 }}
            className="mission-command-palette"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
          >
            <h2 id={titleId} className="sr-only">{copy('command_palette_title')}</h2>
            <p id={descriptionId} className="sr-only">
              Search and execute navigation and actions.
            </p>
            <div className="mission-command-palette-search">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search commands, actions, queries... (Cmd+K)"
                className="mission-command-palette-input"
                aria-controls={listboxId}
                aria-activedescendant={flattenedCommands[selectedIdx]?.id}
              />
            </div>

            {showShortcutHelp ? (
              <div className="mission-command-palette-list" role="region" aria-label="Keyboard shortcuts">
                <div className="mission-command-palette-category">Keyboard Shortcuts</div>
                <div className="mission-command-palette-item"><span className="mission-command-palette-icon"><kbd>⌘/Ctrl + K</kbd></span><div className="mission-command-palette-label">Open command palette</div></div>
                <div className="mission-command-palette-item"><span className="mission-command-palette-icon"><kbd>/</kbd></span><div className="mission-command-palette-label">Focus search</div></div>
                <div className="mission-command-palette-item"><span className="mission-command-palette-icon"><kbd>Esc</kbd></span><div className="mission-command-palette-label">Close overlay</div></div>
                <div className="mission-command-palette-item"><span className="mission-command-palette-icon"><kbd>↑↓</kbd></span><div className="mission-command-palette-label">Navigate list</div></div>
                <div className="mission-command-palette-item"><span className="mission-command-palette-icon"><kbd>↵</kbd></span><div className="mission-command-palette-label">Execute selected command</div></div>
              </div>
            ) : (
              <div className="mission-command-palette-list" role="listbox" id={listboxId}>
              {flattenedCommands.length === 0 ? (
                <div className="mission-command-palette-empty">{copy('command_palette_empty')}</div>
              ) : (
                Object.entries(groupedCommands).map(([category, commands]) => (
                  <div key={category}>
                    <div className="mission-command-palette-category">{category}</div>

                    {commands.map((cmd) => {
                      const globalIdx = flattenedCommands.indexOf(cmd);
                      const isSelected = globalIdx === selectedIdx;

                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={() => cmd.action()}
                          whileHover={{ backgroundColor: 'var(--state-hover-bg)' }}
                          className="mission-command-palette-item"
                          data-selected={isSelected ? 'true' : 'false'}
                          id={cmd.id}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <span className="mission-command-palette-icon">{cmd.icon}</span>
                          <div className="mission-command-palette-label">{cmd.label}</div>
                          {isSelected && <div className="mission-command-palette-enter">↵</div>}
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
              </div>
            )}

            <div className="mission-command-palette-footer">
              <div className="mission-command-palette-shortcuts">
                <span><kbd>↑↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Execute</span>
                <span><kbd>Esc</kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
