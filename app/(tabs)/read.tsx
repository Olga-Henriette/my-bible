import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';

import { useSettings } from '@/services/SettingsContext';
import { useBible } from '@/hooks/useBible';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useLastPosition } from '@/hooks/useLastPosition';
import { ReadingFontSizes } from '@/constants/Typography';

import VerseItem from '@/components/ui/VerseItem';
import BookSelector from '@/components/ui/BookSelector';
import ChapterSelector from '@/components/ui/ChapterSelector';
import VerseActionModal from '@/components/ui/VerseActionModal';
import DisplayOptionsModal from '@/components/ui/DisplayOptionsModal';

import { Verse } from '@/types/bible';

export default function ReadScreen() {
  const { colors, settings, updateSettings } = useSettings();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    bookNumber?: string;
    chapter?: string;
    verseNumber?: string;
    timestamp?: string;
    key?: string;
  }>();
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
  const [showDisplayOptions, setShowDisplayOptions] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [targetVerse, setTargetVerse] = useState<number | null>(null);
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const pinchBaseSize = useRef<number | null>(null);
  const isInternalChange = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gs) => gs.numberActiveTouches === 2,
      onMoveShouldSetPanResponder: (_, gs) => gs.numberActiveTouches === 2,
      
      onPanResponderTerminationRequest: () => true,

      onPanResponderGrant: () => { 
        pinchBaseSize.current = null; 
      },
      onPanResponderMove: (e, gs) => {
        if (gs.numberActiveTouches !== 2) return;
        
        const touches = e.nativeEvent.touches;
        if (!touches || touches.length < 2) return;

        const dx = touches[0].pageX - touches[1].pageX;
        const dy = touches[0].pageY - touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (pinchBaseSize.current === null) {
          pinchBaseSize.current = distance;
          return;
        }

        const delta = distance - pinchBaseSize.current;
        if (Math.abs(delta) > 60) {
          pinchBaseSize.current = distance;
          const currentIndex = ReadingFontSizes.indexOf(settings.font_size);
          
          if (delta > 0 && currentIndex < ReadingFontSizes.length - 1) {
            updateSettings({ font_size: ReadingFontSizes[currentIndex + 1] });
          } else if (delta < 0 && currentIndex > 0) {
            updateSettings({ font_size: ReadingFontSizes[currentIndex - 1] });
          }
        }
      },
    })
  ).current;

  const triggerScroll = useCallback((verseNum: number) => {
    if (!currentChapter) return;
    
    const index = currentChapter.verses.findIndex(v => v.verse === verseNum);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: false,
        viewPosition: 0,
      });
    }
  }, [currentChapter]);

  useEffect(() => {
    const b = params.bookNumber ? parseInt(params.bookNumber) : null;
    const c = params.chapter ? parseInt(params.chapter) : null;
    const v = params.verseNumber ? parseInt(params.verseNumber) : null;

    setIsReadyToDisplay(false);

    if (b !== null && c !== null) {
      isInternalChange.current = false;
      setTargetVerse(v); 
      loadChapter(b, c);
    } else {
      isInternalChange.current = true;
      setTargetVerse(null); 
      loadChapter(lastPosition.book_number, lastPosition.chapter);
    }
  }, [params.bookNumber, params.chapter, params.verseNumber, params.key, params.timestamp]);

  useEffect(() => {
    if (isLoading || !currentChapter?.verses || currentChapter.verses.length === 0) {
      setIsReadyToDisplay(false);
      return;
    }

    const timer = setTimeout(() => {
      if (targetVerse !== null) {
        const index = currentChapter.verses.findIndex(v => v.verse === targetVerse);
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index,
            animated: false,
            viewPosition: 0,
          });
        }
      } else if (isInternalChange.current && flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
      
      setIsReadyToDisplay(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoading, currentChapter?.number, currentBook?.number, targetVerse]);

  const handleVersePress = useCallback((verse: Verse) => {
    setSelectedVerse(verse);
  }, []);

  const handleToggleBookmark = useCallback(async (category?: string) => {
    if (selectedVerse) await toggleBookmark(selectedVerse, category);
  }, [selectedVerse, toggleBookmark]);

  const handlePrevious = useCallback(async () => {
    isInternalChange.current = true;
    setTargetVerse(null);
    await goToPrevious();
  }, [goToPrevious]);

  const handleNext = useCallback(async () => {
    isInternalChange.current = true;
    setTargetVerse(null);
    await goToNext();
  }, [goToNext]);

  if (isLoading && !currentChapter) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentBook || !currentChapter) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.primary} />
        </View>
      )}

      <View style={[
        styles.navbar,
        { backgroundColor: colors.tabBarBackground, paddingTop: insets.top + 8 },
      ]}>
        <TouchableOpacity onPress={() => setShowBookSelector(true)} style={styles.navBtn}>
          <Text style={styles.navBookName} numberOfLines={1}>
            {currentBook.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowChapterSelector(true)}
          style={[styles.chapterPill, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.chapterPillText}>Ch. {currentChapter.number}</Text>
        </TouchableOpacity>
      </View>

      <View style={[
        styles.navTop,
        { backgroundColor: colors.surface, borderBottomColor: colors.separator },
      ]}>
        <TouchableOpacity
          onPress={handlePrevious}
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
          onPress={handleNext}
          disabled={!hasNext()}
          style={[styles.navArrow, !hasNext() && styles.disabled]}
        >
          <Text style={[styles.navArrowText, { color: hasNext() ? colors.primary : colors.textMuted }]}>
            Suivant →
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer} {...panResponder.panHandlers}>
        <FlatList
            ref={flatListRef}
            data={currentChapter?.verses ?? []}
            keyExtractor={item => `${item.book}-${item.chapter}-${item.verse}`}
            getItemLayout={(data, index) => (
              { length: 100, offset: 100 * index, index }
            )}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={false}
            contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({ 
                offset: info.averageItemLength * info.index, 
                animated: false 
              });
            }}
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
        </View>

      <TouchableOpacity
        onPress={() => setShowDisplayOptions(true)}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>⚙</Text>
      </TouchableOpacity>

      <BookSelector
        visible={showBookSelector}
        currentBookNumber={currentBook.number}
        onSelect={num => { setTargetVerse(null); loadChapter(num, 1); }}
        onClose={() => setShowBookSelector(false)}
      />
      <ChapterSelector
        visible={showChapterSelector}
        bookNumber={currentBook.number}
        currentChapter={currentChapter.number}
        onSelect={ch => { setTargetVerse(null); loadChapter(currentBook.number, ch); }}
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
      <DisplayOptionsModal
        visible={showDisplayOptions}
        onClose={() => setShowDisplayOptions(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1 },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer:  { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  navBtn:       { flex: 1 },
  navBookName: {
    color: '#F0D080',
    fontSize: 18,
    fontWeight: '700',
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
  navTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navArrow:     { paddingVertical: 4 },
  navArrowText: { fontSize: 14, fontWeight: '600' },
  navCenter:    { fontSize: 13 },
  disabled:     { opacity: 0.4 },
  chapterHeader: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingVertical: 16,
    textTransform: 'uppercase',
  },
  list: { paddingTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabIcon: { fontSize: 22, color: '#fff' },
});