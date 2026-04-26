import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import { Verse } from '@/types/bible';

interface VerseActionModalProps {
  visible: boolean;
  verse: Verse | null;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
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

  if (!verse) return null;

  const handleShare = async () => {
    await Share.share({
      message: `"${verse.text}"\n— ${verse.book_name} ${verse.chapter}:${verse.verse}\n\n📖 Ma Bible (Louis Segond 1910)`,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>

          {/* Référence */}
          <Text style={[styles.reference, { color: colors.textSecondary }]}>
            {verse.book_name} {verse.chapter}:{verse.verse}
          </Text>

          {/* Texte du verset */}
          <Text style={[styles.text, { color: colors.text }]} numberOfLines={4}>
            {verse.text}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.separator }]} />

          {/* Action : Favori */}
          <TouchableOpacity
            onPress={() => { onToggleBookmark(); onClose(); }}
            style={styles.action}
          >
            <Text style={styles.actionIcon}>
              {isBookmarked ? '🔖' : '🤍'}
            </Text>
            <Text style={[styles.actionText, { color: colors.text }]}>
              {isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </Text>
          </TouchableOpacity>

          {/* Action : Partager */}
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
  reference: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
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
  actionText: { fontSize: 16 },
  cancelBtn: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: { fontSize: 16, fontWeight: '600' },
});