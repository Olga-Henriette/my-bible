import { useState, useCallback, useRef } from 'react';
import BibleService from '@/services/BibleService';
import { Verse, Testament } from '@/types/bible';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);
  const [testament, setTestament] = useState<Testament>('all');
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (text: string, filter: Testament = testament) => {
      setQuery(text);

      // Annule le debounce précédent
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (text.trim().length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      debounceRef.current = setTimeout(() => {
        const found = BibleService.search(
          text,
          filter === 'all' ? undefined : filter
        );
        setResults(found);
        setIsSearching(false);
      }, 300); // 300ms debounce
    },
    [testament]
  );

  const changeTestament = useCallback(
    (filter: Testament) => {
      setTestament(filter);
      if (query.trim().length >= 2) {
        search(query, filter);
      }
    },
    [query, search]
  );

  const clearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery('');
    setResults([]);
    setIsSearching(false);
  }, []);

  return {
    query,
    results,
    testament,
    isSearching,
    resultCount: results.length,
    search,
    changeTestament,
    clearSearch,
  };
}