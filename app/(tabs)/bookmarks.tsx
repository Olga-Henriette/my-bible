import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';

import { useSettings } from '@/services/SettingsContext';
import { useBookmarks } from '@/hooks/useBookmarks';

import BookmarkItem from '@/components/ui/BookmarkItem';
import EmptyBookmarks from '@/components/ui/EmptyBookmarks';

import { Bookmark } from '@/types/bible';
import ScreenHeader from '@/components/ui/ScreenHeader';

type FilterMode = 'all' | 'recent' | string; // nom de catégorie

export default function BookmarksScreen() {
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { bookmarks, isLoading, removeBookmark, bookmarksByCategory, total } =
    useBookmarks();

  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');

  // Catégories disponibles 
  const categories = useMemo(() => {
    const cats = Object.keys(bookmarksByCategory());
    return cats;
  }, [bookmarks]);

  // Favoris filtrés 
  const filtered = useMemo(() => {
    if (activeFilter === 'all') return bookmarks;
    if (activeFilter === 'recent') return bookmarks.slice(0, 10);
    return bookmarksByCategory()[activeFilter] ?? [];
  }, [activeFilter, bookmarks]);

  // Actions 
  const handlePress = useCallback(
    (bookmark: Bookmark) => {
      router.push({
        pathname: '/(tabs)/read',
        params: {
          bookNumber: bookmark.book_number,
          chapter: bookmark.chapter,
          verseNumber: bookmark.verse,
        },
      });
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        'Supprimer le favori',
        'Voulez-vous retirer ce verset de vos favoris ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => removeBookmark(id),
          },
        ]
      );
    },
    [removeBookmark]
  );

  // Filtres disponibles 
  const filters: { label: string; value: FilterMode }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Récents', value: 'recent' },
    ...categories.map(c => ({ label: c, value: c })),
  ];

  // Rendu 
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* Header */}
      <ScreenHeader
        title="Favoris"
        paddingTop={insets.top}
        rightElement={
          <View style={[styles.totalBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalText}>{total}</Text>
          </View>
        }
      />

      {/* Filtres */}
      {total > 0 && (
        <View style={[styles.filterWrapper, { backgroundColor: colors.background }]}>
          <FlatList
            horizontal
            data={filters}
            keyExtractor={item => item.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.value)}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor:
                      activeFilter === item.value
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        activeFilter === item.value ? '#fff' : colors.textMuted,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Liste des favoris */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookmarkItem
            bookmark={item}
            onPress={handlePress}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={isLoading ? null : <EmptyBookmarks />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  totalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  totalText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  filterWrapper: {
    paddingVertical: 10,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flexGrow: 1,
    paddingTop: 8,
  },
});