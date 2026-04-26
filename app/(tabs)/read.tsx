import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';

import { useSettings } from '@/services/SettingsContext';
import { useBible } from '@/hooks/useBible';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useLastPosition } from '@/hooks/useLastPosition';

import VerseItem from '@/components/ui/VerseItem';
import BookSelector from '@/components/ui/BookSelector';
import ChapterSelector from '@/components/ui/ChapterSelector';
import VerseActionModal from '@/components/ui/VerseActionModal';

import { Verse } from '@/types/bible';

export default function ReadScreen() {
  const { colors, settings } = useSettings();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ bookNumber?: string; chapter?: string }>();
  const { lastPosition } = useLastPosition();

  const {
    currentBook,
    currentChapter,
    isLoading,
    loadChapter,
    goToPrevious,
    goToNext,
    hasPrevious,
    hasNext,
  } = useBible();

  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // Charge le chapitre initial
  useEffect(() => {
    const bookNum = params.bookNumber
      ? parseInt(params.bookNumber)
      : lastPosition.book_number;
    const chapterNum = params.chapter
      ? parseInt(params.chapter)
      : lastPosition.chapter;
    loadChapter(bookNum, chapterNum);
  }, []);

  // Remonte en haut à chaque changement de chapitre
  useEffect(() => {
    if (currentChapter) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [currentChapter]);

  const handleVersePress = useCallback((verse: Verse) => {
    setSelectedVerse(verse);
  }, []);

  const handleToggleBookmark = useCallback(async () => {
    if (selectedVerse) await toggleBookmark(selectedVerse);
  }, [selectedVerse, toggleBookmark]);

  // Rendu 

  if (isLoading || !currentBook || !currentChapter) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* Barre de navigation */}
      <View style={[
        styles.navbar,
        { backgroundColor: colors.tabBarBackground, paddingTop: insets.top + 8 },
      ]}>
        {/* Bouton Livre */}
        <TouchableOpacity
          onPress={() => setShowBookSelector(true)}
          style={styles.navBtn}
        >
          <Text style={styles.navBookName} numberOfLines={1}>
            {currentBook.name}
          </Text>
        </TouchableOpacity>

        {/* Bouton Chapitre */}
        <TouchableOpacity
          onPress={() => setShowChapterSelector(true)}
          style={[styles.chapterPill, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.chapterPillText}>
            Ch. {currentChapter.number}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des versets */}
      <FlatList
        ref={flatListRef}
        data={currentChapter.verses}
        keyExtractor={item => `${item.book}-${item.chapter}-${item.verse}`}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 90 },
        ]}
        renderItem={({ item }) => (
          <VerseItem
            verse={item}
            isBookmarked={isBookmarked(item.book, item.chapter, item.verse)}
            onLongPress={handleVersePress}
            fontSize={settings.font_size}
          />
        )}
        ListHeaderComponent={
          <Text style={[styles.chapterHeader, { color: colors.textSecondary }]}>
            {currentBook.name} — Chapitre {currentChapter.number}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Navigation Précédent / Suivant */}
      <View style={[
        styles.navFooter,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.separator,
          paddingBottom: insets.bottom + 8,
        },
      ]}>
        <TouchableOpacity
          onPress={goToPrevious}
          disabled={!hasPrevious()}
          style={[styles.navArrow, !hasPrevious() && styles.disabled]}
        >
          <Text style={[styles.navArrowText, { color: hasPrevious() ? colors.primary : colors.textMuted }]}>
            ← Précédent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowChapterSelector(true)}>
          <Text style={[styles.navCenter, { color: colors.textMuted }]}>
            {currentChapter.number} / {currentBook.chapters.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNext}
          disabled={!hasNext()}
          style={[styles.navArrow, !hasNext() && styles.disabled]}
        >
          <Text style={[styles.navArrowText, { color: hasNext() ? colors.primary : colors.textMuted }]}>
            Suivant →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <BookSelector
        visible={showBookSelector}
        currentBookNumber={currentBook.number}
        onSelect={num => loadChapter(num, 1)}
        onClose={() => setShowBookSelector(false)}
      />

      <ChapterSelector
        visible={showChapterSelector}
        bookNumber={currentBook.number}
        currentChapter={currentChapter.number}
        onSelect={ch => loadChapter(currentBook.number, ch)}
        onClose={() => setShowChapterSelector(false)}
      />

      <VerseActionModal
        visible={selectedVerse !== null}
        verse={selectedVerse}
        isBookmarked={
          selectedVerse
            ? isBookmarked(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)
            : false
        }
        onToggleBookmark={handleToggleBookmark}
        onClose={() => setSelectedVerse(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  navBtn: { flex: 1 },
  navBookName: {
    color: '#F0D080',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  chapterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chapterPillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chapterHeader: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingVertical: 16,
    textTransform: 'uppercase',
  },
  list: {
    paddingTop: 4,
  },
  navFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navArrow: { paddingVertical: 8 },
  navArrowText: { fontSize: 15, fontWeight: '600' },
  navCenter: { fontSize: 13 },
  disabled: { opacity: 0.4 },
});