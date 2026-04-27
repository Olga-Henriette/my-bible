import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useState } from 'react';
import { useSettings } from '@/services/SettingsContext';
import { Verse, BookmarkCategory } from '@/types/bible';
import CategoryPickerModal from './CategoryPickerModal';

interface VerseActionModalProps {
  visible: boolean;
  verse: Verse | null;
  isBookmarked: boolean;
  onToggleBookmark: (category?: string) => void;
  onClose: () => void;
}

export default function VerseActionModal({
  visible,
  verse,
  isBookmarked,
  onToggleBookmark,
  onClose,
}: VerseActionModalProps) {
  const { colors } = useSettings();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  if (!verse) return null;

  const handleShare = async () => {
    await Share.share({
      message: `"${verse.text}"\n— ${verse.book_name} ${verse.chapter}:${verse.verse}\n\n📖 Ma Bible (Louis Segond 1910)`,
    });
    onClose();
  };

  const handleAddBookmark = () => {
    if (isBookmarked) {
      onToggleBookmark();
      onClose();
    } else {
      setShowCategoryPicker(true);
    }
  };

  const handleCategorySelected = (category: BookmarkCategory) => {
    onToggleBookmark(category.id);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={[styles.sheet, { backgroundColor: colors.card }]}>

            {/* Référence */}
            <Text style={[styles.reference, { color: colors.textSecondary }]}>
              {verse.book_name} {verse.chapter}:{verse.verse}
            </Text>

            {/* Texte */}
            <Text style={[styles.text, { color: colors.text }]} numberOfLines={4}>
              {verse.text}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.separator }]} />

            {/* Favori */}
            <TouchableOpacity onPress={handleAddBookmark} style={styles.action}>
              <Text style={styles.actionIcon}>{isBookmarked ? '🔖' : '🤍'}</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>
                {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </Text>
              {!isBookmarked && (
                <Text style={[styles.categoryHint, { color: colors.textMuted }]}>
                  Choisir catégorie →
                </Text>
              )}
            </TouchableOpacity>

            {/* Partager */}
            <TouchableOpacity onPress={handleShare} style={styles.action}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Partager ce verset
              </Text>
            </TouchableOpacity>

            {/* Annuler */}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelBtn, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Sélecteur de catégorie */}
      <CategoryPickerModal
        visible={showCategoryPicker}
        selectedId="general"
        onSelect={handleCategorySelected}
        onClose={() => setShowCategoryPicker(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  reference: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  text: {
    fontFamily: 'Georgia',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  divider: { height: 1 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  actionIcon: { fontSize: 22 },
  actionText: { fontSize: 16, flex: 1 },
  categoryHint: { fontSize: 12 },
  cancelBtn: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: { fontSize: 16, fontWeight: '600' },
});