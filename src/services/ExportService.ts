import * as FileSystem from 'expo-file-system'; 
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import StorageService from './StorageService';
import { Bookmark } from '@/types/bible';

const ExportService = {

  // Export 
  async exportBookmarks(): Promise<void> {
    const bookmarks = await StorageService.bookmarks.getAll();
    if (bookmarks.length === 0) {
      throw new Error('Aucun favori à exporter.');
    }

    const json     = JSON.stringify(bookmarks, null, 2);
    const filename = `ma-bible-favoris-${new Date().toISOString().split('T')[0]}.json`;
    const fs = FileSystem as any;
    const baseDir = fs.documentDirectory ?? fs.cacheDirectory ?? '';
    const fileUri = `${baseDir}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: 'utf8', 
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) throw new Error('Le partage n\'est pas disponible sur cet appareil.');

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exporter mes favoris',
    });
  },

  // Import 
  async importBookmarks(): Promise<{ added: number; skipped: number }> {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      throw new Error('Import annulé.');
    }

    const asset = result.assets[0];

    const content = await FileSystem.readAsStringAsync(asset.uri, {
       encoding: 'utf8', 
    });

    let imported: Bookmark[];
    try {
      imported = JSON.parse(content) as Bookmark[];
    } catch {
      throw new Error('Fichier invalide.');
    }

    const isValid = Array.isArray(imported) && imported.every(
      b => b.id && b.book_name && b.chapter && b.verse && b.text
    );
    
    if (!isValid) throw new Error('Format de fichier non reconnu.');

    const existing = await StorageService.bookmarks.getAll();
    const existingIds = new Set(existing.map(b => b.id));

    let added   = 0;
    let skipped = 0;

    for (const bookmark of imported) {
      if (existingIds.has(bookmark.id)) {
        skipped++;
      } else {
        await StorageService.bookmarks.add({
          book_number: bookmark.book_number,
          book_name:   bookmark.book_name,
          chapter:     bookmark.chapter,
          verse:       bookmark.verse,
          text:        bookmark.text,
          category:    bookmark.category ?? 'general',
        });
        added++;
      }
    }

    return { added, skipped };
  },
};

export default ExportService;