import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { DEFAULT_LAST_POSITION, DEFAULT_SETTINGS } from '@/constants/Defaults';
import { Bookmark, LastPosition, UserSettings } from '@/types/bible';

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
    // Évite les doublons
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

// Export central 

const StorageService = {
  bookmarks: BookmarkService,
  position: PositionService,
  settings: SettingsService,
  history: HistoryService,
};

export default StorageService;