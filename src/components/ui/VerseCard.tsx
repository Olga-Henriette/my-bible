import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import { Verse } from '@/types/bible';

interface VerseCardProps {
  verse: Verse;
  onPress?: () => void;
}

export default function VerseCard({ verse, onPress }: VerseCardProps) {
  const { colors } = useSettings();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.accent, { backgroundColor: colors.primary }]} />
      <View style={styles.content}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          ✦ Verset du jour
        </Text>
        <Text style={[styles.text, { color: colors.verseText, fontSize: 16 }]}>
          {verse.text}
        </Text>
        <Text style={[styles.reference, { color: colors.textSecondary }]}>
          — {verse.book_name} {verse.chapter}:{verse.verse}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  text: {
    fontFamily: 'Georgia',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  reference: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});