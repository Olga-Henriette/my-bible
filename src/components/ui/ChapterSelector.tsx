import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import BibleService from '@/services/BibleService';

interface ChapterSelectorProps {
  visible: boolean;
  bookNumber: number;
  currentChapter: number;
  onSelect: (chapter: number) => void;
  onClose: () => void;
}

export default function ChapterSelector({
  visible,
  bookNumber,
  currentChapter,
  onSelect,
  onClose,
}: ChapterSelectorProps) {
  const { colors } = useSettings();
  const book = BibleService.getBook(bookNumber);
  const chapterCount = book?.chapters.length ?? 0;
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {book?.name} — Chapitres
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: colors.primary }]}>Fermer</Text>
          </TouchableOpacity>
        </View>

        {/* Grille de chapitres */}
        <FlatList
          data={chapters}
          keyExtractor={item => item.toString()}
          numColumns={5}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { onSelect(item); onClose(); }}
              style={[
                styles.chapterBtn,
                { borderColor: colors.border },
                item === currentChapter && { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.chapterText,
                { color: item === currentChapter ? '#fff' : colors.text },
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  closeBtn: { fontSize: 16, fontWeight: '600' },
  grid: { padding: 16, gap: 10 },
  chapterBtn: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterText: { fontSize: 16, fontWeight: '600' },
});