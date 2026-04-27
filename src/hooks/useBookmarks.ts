import { useState, useEffect, useCallback } from 'react';
import StorageService from '@/services/StorageService';
import { Bookmark, Verse } from '@/types/bible';
import { useIsFocused } from '@react-navigation/native';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  const loadBookmarks = useCallback(async () => {
    const data = await StorageService.bookmarks.getAll();
    setBookmarks(data);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadBookmarks();
    }
  }, [isFocused, loadBookmarks]);

  const addBookmark = useCallback(
    async (verse: Verse, category: string = 'général') => {
      const newBookmark = {
        book_number: verse.book,
        book_name: verse.book_name,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text,
        category,
      };
      
      await StorageService.bookmarks.add(newBookmark);
      
      const data = await StorageService.bookmarks.getAll();
      setBookmarks([...data]); 
    },
    []
  );

  const removeBookmark = useCallback(async (id: string) => {
    await StorageService.bookmarks.remove(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const toggleBookmark = useCallback(
    async (verse: Verse, category?: string) => {
      const id = `${verse.book}-${verse.chapter}-${verse.verse}`;
      const exists = bookmarks.some(b => b.id === id);
      if (exists) {
        await removeBookmark(id);
      } else {
        await addBookmark(verse, category ?? 'general');
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  const isBookmarked = useCallback(
    (bookNumber: number, chapter: number, verse: number): boolean => {
      const id = `${bookNumber}-${chapter}-${verse}`;
      return bookmarks.some(b => b.id === id);
    },
    [bookmarks]
  );

  const clearAll = useCallback(async () => {
    await StorageService.bookmarks.clear();
    setBookmarks([]);
  }, []);

  // Favoris groupés par catégorie
  const bookmarksByCategory = useCallback((): Record<string, Bookmark[]> => {
    return bookmarks.reduce<Record<string, Bookmark[]>>((acc, bookmark) => {
      const cat = bookmark.category || 'général';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(bookmark);
      return acc;
    }, {});
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAll,
    bookmarksByCategory,
    total: bookmarks.length,
  };
}