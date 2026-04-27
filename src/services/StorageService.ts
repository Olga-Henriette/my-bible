import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { DEFAULT_LAST_POSITION, DEFAULT_SETTINGS } from '@/constants/Defaults';
import { Bookmark, LastPosition, UserSettings } from '@/types/bible';
import { DEFAULT_CATEGORIES } from '@/constants/DefaultCategories';
import { BookmarkCategory } from '@/types/bible';

// Helper générique 

async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[StorageService] Erreur setItem(${key}):`, e);
  }
}

// Favoris 

const BookmarkService = {
  async getAll(): Promise<Bookmark[]> {
    return getItem<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
  },

  async add(bookmark: Omit<Bookmark, 'id' | 'added_at'>): Promise<void> {
    const all = await BookmarkService.getAll();
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.book_number}-${bookmark.chapter}-${bookmark.verse}`,
      added_at: new Date().toISOString(),
    };
    const filtered = all.filter(b => b.id !== newBookmark.id);
    await setItem(STORAGE_KEYS.BOOKMARKS, [newBookmark, ...filtered]);
  },

  async remove(id: string): Promise<void> {
    const all = await BookmarkService.getAll();
    await setItem(
      STORAGE_KEYS.BOOKMARKS,
      all.filter(b => b.id !== id)
    );
  },

  async isBookmarked(
    bookNumber: number,
    chapter: number,
    verse: number
  ): Promise<boolean> {
    const id = `${bookNumber}-${chapter}-${verse}`;
    const all = await BookmarkService.getAll();
    return all.some(b => b.id === id);
  },

  async clear(): Promise<void> {
    await setItem(STORAGE_KEYS.BOOKMARKS, []);
  },

  // Export JSON 
  async exportJSON(): Promise<string> {
    const all = await BookmarkService.getAll();
    return JSON.stringify(all, null, 2);
  },
};

// Dernière position 

const PositionService = {
  async get(): Promise<LastPosition> {
    return getItem<LastPosition>(
      STORAGE_KEYS.LAST_POSITION,
      DEFAULT_LAST_POSITION
    );
  },

  async save(position: LastPosition): Promise<void> {
    await setItem(STORAGE_KEYS.LAST_POSITION, position);
  },
};

// Paramètres utilisateur 

const SettingsService = {
  async get(): Promise<UserSettings> {
    return getItem<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async save(settings: Partial<UserSettings>): Promise<void> {
    const current = await SettingsService.get();
    await setItem(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
  },

  async reset(): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
};

// Historique de lecture 

const HistoryService = {
  async get(): Promise<LastPosition[]> {
    return getItem<LastPosition[]>(STORAGE_KEYS.READING_HISTORY, []);
  },

  async addEntry(position: LastPosition): Promise<void> {
    const history = await HistoryService.get();
    const filtered = history.filter(
      h =>
        !(h.book_number === position.book_number && h.chapter === position.chapter)
    );
    // 50 dernières entrées max
    const updated = [position, ...filtered].slice(0, 50);
    await setItem(STORAGE_KEYS.READING_HISTORY, updated);
  },

  async clear(): Promise<void> {
    await setItem(STORAGE_KEYS.READING_HISTORY, []);
  },
};

const ReadingStatsService = {
  // Enregistre la date d'aujourd'hui comme jour de lecture
  async recordDay(): Promise<void> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const days = await getItem<string[]>(STORAGE_KEYS.READING_DAYS, []);
    if (!days.includes(today)) {
      await setItem(STORAGE_KEYS.READING_DAYS, [today, ...days]);
    }
  },

  async getTotalDays(): Promise<number> {
    const days = await getItem<string[]>(STORAGE_KEYS.READING_DAYS, []);
    return days.length;
  },

  // Marque un chapitre comme lu (clé unique livre-chapitre)
  async markChapterRead(bookNumber: number, chapter: number): Promise<void> {
    const key = `${bookNumber}-${chapter}`;
    const read = await getItem<string[]>(STORAGE_KEYS.CHAPTERS_READ, []);
    if (!read.includes(key)) {
      await setItem(STORAGE_KEYS.CHAPTERS_READ, [...read, key]);
    }
  },

  async getChaptersRead(): Promise<number> {
    const read = await getItem<string[]>(STORAGE_KEYS.CHAPTERS_READ, []);
    return read.length;
  },

  // Progression globale sur 1189 chapitres (total Bible)
  async getProgressPercent(): Promise<number> {
    const count = await ReadingStatsService.getChaptersRead();
    return Math.round((count / 1189) * 100);
  },
};

const CategoryService = {
  async getAll(): Promise<BookmarkCategory[]> {
    const custom = await getItem<BookmarkCategory[]>(
      STORAGE_KEYS.BOOKMARK_CATEGORIES,
      []
    );
    return [...DEFAULT_CATEGORIES, ...custom];
  },

  async addCustom(label: string, icon: string): Promise<BookmarkCategory> {
    const custom = await getItem<BookmarkCategory[]>(
      STORAGE_KEYS.BOOKMARK_CATEGORIES,
      []
    );
    const newCat: BookmarkCategory = {
      id: `custom_${Date.now()}`,
      label,
      icon,
      isCustom: true,
    };
    await setItem(STORAGE_KEYS.BOOKMARK_CATEGORIES, [...custom, newCat]);
    return newCat;
  },

  async removeCustom(id: string): Promise<void> {
    const custom = await getItem<BookmarkCategory[]>(
      STORAGE_KEYS.BOOKMARK_CATEGORIES,
      []
    );
    await setItem(
      STORAGE_KEYS.BOOKMARK_CATEGORIES,
      custom.filter(c => c.id !== id)
    );
  },
};

// Export central 

const StorageService = {
  bookmarks: BookmarkService,
  position: PositionService,
  settings: SettingsService,
  history: HistoryService,
  stats: ReadingStatsService,
  categories: CategoryService,
};


export default StorageService;