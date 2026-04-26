import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import { Verse } from '@/types/bible';

interface SearchResultItemProps {
  verse: Verse;
  query: string;
  onPress: (verse: Verse) => void;
}

// Découpe le texte pour mettre en surbrillance le terme recherché
function HighlightedText({
  text,
  query,
  color,
  highlightColor,
}: {
  text: string;
  query: string;
  color: string;
  highlightColor: string;
}) {
  if (!query.trim()) {
    return <Text style={[styles.verseText, { color }]}>{text}</Text>;
  }

  const normalized = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const parts: { text: string; highlight: boolean }[] = [];
  let remaining = text;
  let lowerRemaining = remaining.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  while (remaining.length > 0) {
    const index = lowerRemaining.indexOf(normalized);
    if (index === -1) {
      parts.push({ text: remaining, highlight: false });
      break;
    }
    if (index > 0) {
      parts.push({ text: remaining.slice(0, index), highlight: false });
    }
    parts.push({ text: remaining.slice(index, index + query.length), highlight: true });
    remaining = remaining.slice(index + query.length);
    lowerRemaining = remaining.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  return (
    <Text style={[styles.verseText, { color }]}>
      {parts.map((part, i) =>
        part.highlight ? (
          <Text key={i} style={[styles.highlight, { backgroundColor: highlightColor }]}>
            {part.text}
          </Text>
        ) : (
          <Text key={i}>{part.text}</Text>
        )
      )}
    </Text>
  );
}

export default function SearchResultItem({
  verse,
  query,
  onPress,
}: SearchResultItemProps) {
  const { colors } = useSettings();

  return (
    <TouchableOpacity
      onPress={() => onPress(verse)}
      activeOpacity={0.75}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Référence */}
      <View style={[styles.refBadge, { backgroundColor: colors.surface }]}>
        <Text style={[styles.refText, { color: colors.primary }]}>
          {verse.book_name} {verse.chapter}:{verse.verse}
        </Text>
      </View>

      {/* Texte avec surbrillance */}
      <HighlightedText
        text={verse.text}
        query={query}
        color={colors.verseText}
        highlightColor={colors.verseHighlight}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  refBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  refText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  verseText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    lineHeight: 24,
  },
  highlight: {
    borderRadius: 3,
  },
});