import { useState, useCallback } from 'react';
import BibleService from '@/services/BibleService';
import StorageService from '@/services/StorageService';
import { Book, Chapter, Verse, LastPosition } from '@/types/bible';

export function useBible() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadChapter = useCallback(
    async (bookNumber: number, chapterNumber: number) => {
      setIsLoading(true);
      try {
        const book = BibleService.getBook(bookNumber);
        const chapter = BibleService.getChapter(bookNumber, chapterNumber);

        if (book && chapter) {
          setCurrentBook(book);
          setCurrentChapter(chapter);

          // Sauvegarde position + historique
          const position: LastPosition = {
            book_number: bookNumber,
            book_name: book.name,
            chapter: chapterNumber,
          };
          await StorageService.position.save(position);
          await StorageService.history.addEntry(position);
          await StorageService.stats.recordDay();
          await StorageService.stats.markChapterRead(bookNumber, chapterNumber);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const goToPrevious = useCallback(async () => {
    if (!currentBook || !currentChapter) return;
    const prev = BibleService.getPreviousChapter(
      currentBook.number,
      currentChapter.number
    );
    if (prev) {
      await loadChapter(prev.bookNumber, prev.chapterNumber);
    }
  }, [currentBook, currentChapter, loadChapter]);

  const goToNext = useCallback(async () => {
    if (!currentBook || !currentChapter) return;
    const next = BibleService.getNextChapter(
      currentBook.number,
      currentChapter.number
    );
    if (next) {
      await loadChapter(next.bookNumber, next.chapterNumber);
    }
  }, [currentBook, currentChapter, loadChapter]);

  const hasPrevious = useCallback((): boolean => {
    if (!currentBook || !currentChapter) return false;
    return (
      BibleService.getPreviousChapter(
        currentBook.number,
        currentChapter.number
      ) !== null
    );
  }, [currentBook, currentChapter]);

  const hasNext = useCallback((): boolean => {
    if (!currentBook || !currentChapter) return false;
    return (
      BibleService.getNextChapter(
        currentBook.number,
        currentChapter.number
      ) !== null
    );
  }, [currentBook, currentChapter]);

  return {
    currentBook,
    currentChapter,
    isLoading,
    loadChapter,
    goToPrevious,
    goToNext,
    hasPrevious,
    hasNext,
  };
}