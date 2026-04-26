import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { memo } from 'react';
import { useSettings } from '@/services/SettingsContext';
import { Verse } from '@/types/bible';

interface VerseItemProps {
  verse: Verse;
  isBookmarked: boolean;
  onLongPress: (verse: Verse) => void;
  fontSize: number;
}

function VerseItem({ verse, isBookmarked, onLongPress, fontSize }: VerseItemProps) {
  const { colors } = useSettings();

  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(verse)}
      activeOpacity={0.7}
      style={[
        styles.container,
        isBookmarked && { backgroundColor: colors.verseBookmark },
      ]}
    >
      <Text style={[styles.number, { color: colors.verseNumber, fontSize: fontSize - 4 }]}>
        {verse.verse}
      </Text>
      <Text style={[styles.text, { color: colors.verseText, fontSize, lineHeight: fontSize * 1.7 }]}>
        {verse.text}
        {isBookmarked && (
          <Text style={[styles.bookmarkTag, { color: colors.primary }]}>
            {' '}🔖
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
}

// memo évite le re-rendu des versets non modifiés
export default memo(VerseItem, (prev, next) => {
  return (
    prev.isBookmarked === next.isBookmarked &&
    prev.fontSize === next.fontSize &&
    prev.verse.verse === next.verse.verse
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  number: {
    fontWeight: '700',
    width: 32,
    marginTop: 3,
    opacity: 0.6,
  },
  text: {
    flex: 1,
    fontFamily: 'Georgia',
  },
  bookmarkTag: {
    fontSize: 12,
  },
});