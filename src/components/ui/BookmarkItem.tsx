import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import { Bookmark } from '@/types/bible';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onPress: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BookmarkItem({
  bookmark,
  onPress,
  onDelete,
}: BookmarkItemProps) {
  const { colors } = useSettings();

  return (
    <TouchableOpacity
      onPress={() => onPress(bookmark)}
      activeOpacity={0.75}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Bande colorée gauche */}
      <View style={[styles.accent, { backgroundColor: colors.primary }]} />

      {/* Contenu principal */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.refBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.refText, { color: colors.primary }]}>
              {bookmark.book_name} {bookmark.chapter}:{bookmark.verse}
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            {formatDate(bookmark.added_at)}
          </Text>
        </View>

        <Text
          style={[styles.verseText, { color: colors.verseText }]}
          numberOfLines={3}
        >
          {bookmark.text}
        </Text>

        <View style={styles.bottomRow}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              🏷 {bookmark.category}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onDelete(bookmark.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.deleteBtn, { color: colors.textMuted }]}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  accent: { width: 4 },
  content: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  refText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  verseText: {
    fontFamily: 'Georgia',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    fontSize: 18,
  },
});