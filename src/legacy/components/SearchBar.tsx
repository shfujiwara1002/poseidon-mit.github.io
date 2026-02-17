import { useState, useRef, useEffect } from 'react';
import { theme } from '../shared/theme';
import { copy } from '../content/microcopy-catalog';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'threat' | 'action' | 'log' | 'goal' | 'transaction';
  path: string;
}

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  placeholder?: string;
  results?: SearchResult[];
  recentSearches?: SearchResult[];
  onClearRecentSearches?: () => void;
}

export function SearchBar({
  onSearch,
  onSelect,
  placeholder = 'Search...',
  results = [],
  recentSearches = [],
  onClearRecentSearches,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryLabels = {
    threat: 'Threat',
    action: 'Action',
    log: 'Log',
    goal: 'Goal',
    transaction: 'Transaction'
  };

  const categoryColors = {
    threat: theme.colors.error,
    action: theme.colors.warning,
    log: theme.colors.info,
    goal: theme.colors.success,
    transaction: theme.colors.neutral
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global search shortcut: /
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }

      // Arrow navigation
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect?.(results[selectedIndex]);
            setIsOpen(false);
            setQuery('');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect]);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(0);
    onSearch?.(value);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pl-10 pr-20 rounded-lg text-white placeholder-gray-500 transition-all focus:outline-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isOpen ? theme.colors.info : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: isOpen ? `0 0 0 2px ${theme.colors.info}30` : 'none'
          }}
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>

        {/* Keyboard Hint */}
        {!isOpen && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-xs"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: theme.colors.neutral
            }}
          >
            /
          </div>
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length === 0 && recentSearches.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div className="px-4 py-2 text-xs text-gray-400 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            {copy('search_recent_title')}
            {onClearRecentSearches && (
              <button
                className="float-right text-xs text-gray-400 hover:text-white"
                onClick={onClearRecentSearches}
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {recentSearches.map((result) => (
              <button
                key={`recent-${result.id}-${result.path}`}
                onClick={() => {
                  onSelect?.(result);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left transition-all hover:bg-white/5"
              >
                <div className="text-sm font-medium text-white truncate">{result.title}</div>
                <div className="text-xs text-gray-400 truncate">{result.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}
        >
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => {
                  onSelect?.(result);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="w-full px-4 py-3 text-left transition-all"
                style={{
                  backgroundColor: index === selectedIndex ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  borderBottom: index < results.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[result.category]}20`,
                      color: categoryColors[result.category]
                    }}
                  >
                    {categoryLabels[result.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white mb-0.5 truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {result.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 text-xs text-gray-500 border-t"
            style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <span>↑↓ Navigate</span>
            <span className="mx-2">•</span>
            <span>Enter Select</span>
            <span className="mx-2">•</span>
            <span>Esc Close</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length > 0 && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-6 rounded-lg text-center"
          style={{
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="text-4xl mb-2">🔍</div>
          <div className="text-sm text-gray-400">
            {copy('search_no_results', { query })}
          </div>
        </div>
      )}
    </div>
  );
}
