import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter } from '../router';
import type { SearchResult } from '../components/SearchBar';

interface SearchContextValue {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  search: (query: string) => SearchResult[];
  navigateToResult: (result: SearchResult) => void;
  recentSearches: SearchResult[];
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('poseidon.recent-searches');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SearchResult[];
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
      return [];
    }
  });
  const { navigate } = useRouter();

  // Mock search data - in real app, this would query an API
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'Potential Fraud: $2,450',
      description: 'Online Gadgets Store - Today 14:30',
      category: 'threat',
      path: '/protect'
    },
    {
      id: '2',
      title: 'Auto-Save Rule: Payday',
      description: 'Auto-save $100 on the 1st and 15th of each month',
      category: 'action',
      path: '/execute'
    },
    {
      id: '3',
      title: 'AI Decision Log: Fraud Detection',
      description: 'PROTECT Engine - Confidence 95%',
      category: 'log',
      path: '/govern'
    },
    {
      id: '4',
      title: 'Savings Goal: Emergency Fund',
      description: 'Target: $10,000 / Current: $6,500 (65%)',
      category: 'goal',
      path: '/grow'
    },
    {
      id: '5',
      title: 'Netflix Subscription',
      description: 'Unused subscription service - $15.99/mo',
      category: 'threat',
      path: '/protect'
    },
    {
      id: '6',
      title: 'Bill Payment: Electric',
      description: 'Action pending - $120',
      category: 'action',
      path: '/execute'
    },
    {
      id: '7',
      title: 'Cash Flow Forecast',
      description: '30-day projected balance: $8,240 (90% confidence)',
      category: 'goal',
      path: '/grow'
    },
    {
      id: '8',
      title: 'Privacy Settings Update',
      description: 'Transaction data sharing preferences updated',
      category: 'log',
      path: '/govern'
    }
  ];

  const search = useCallback((query: string): SearchResult[] => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    return mockData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, []);

  const persistRecentSearches = useCallback((next: SearchResult[]) => {
    setRecentSearches(next);
    try {
      window.localStorage.setItem('poseidon.recent-searches', JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const addRecent = useCallback((result: SearchResult) => {
    setRecentSearches((prev) => {
      const deduped = [result, ...prev.filter((item) => item.path !== result.path)].slice(0, 5);
      try {
        window.localStorage.setItem('poseidon.recent-searches', JSON.stringify(deduped));
      } catch {
        // Ignore storage failures.
      }
      return deduped;
    });
  }, []);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      navigate(result.path);
      addRecent(result);
      setIsSearchOpen(false);
    },
    [addRecent, navigate]
  );

  const clearRecentSearches = useCallback(() => {
    persistRecentSearches([]);
  }, [persistRecentSearches]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        search,
        navigateToResult,
        recentSearches,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
