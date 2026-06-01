import { useState, useCallback, useRef, useEffect } from 'react';

export function debounce<T extends (...args: any[]) => any>(func: T, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export function useInfiniteScroll<T>(allData: T[], initialBatchSize: number = 20, loadMoreSize: number = 15) {
  const [displayedData, setDisplayedData] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(initialBatchSize);
  const allDataRef = useRef<T[]>(allData);

  // Synchroniser la référence quand les données sources changent (ex: nouvelle recherche)
  useEffect(() => {
    allDataRef.current = allData;
    setDisplayedData(allData.slice(0, initialBatchSize));
    setCurrentIndex(initialBatchSize);
  }, [allData, initialBatchSize]);

  const loadMore = useCallback(() => {
    if (currentIndex >= allDataRef.current.length) return;

    const nextIndex = currentIndex + loadMoreSize;
    const nextBatch = allDataRef.current.slice(0, nextIndex);
    
    setDisplayedData(nextBatch);
    setCurrentIndex(nextIndex);
  }, [currentIndex, loadMoreSize]);

  const hasMore = currentIndex < allData.length;

  return {
    displayedData,
    loadMore,
    hasMore,
  };
}