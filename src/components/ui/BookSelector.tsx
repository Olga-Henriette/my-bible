import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SectionList,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import { useSettings } from '@/services/SettingsContext';
import { BOOK_METADATA, BookMeta } from '@/constants/BibleStructure';

interface BookSelectorProps {
  visible: boolean;
  currentBookNumber: number;
  onSelect: (bookNumber: number) => void;
  onClose: () => void;
}

// Grouper les livres par catégorie pour SectionList
function buildSections() {
  const map = new Map<string, BookMeta[]>();
  for (const book of BOOK_METADATA) {
    if (!map.has(book.category)) map.set(book.category, []);
    map.get(book.category)!.push(book);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

const SECTIONS = buildSections();

export default function BookSelector({
  visible,
  currentBookNumber,
  onSelect,
  onClose,
}: BookSelectorProps) {
  const { colors } = useSettings();
  const [testament, setTestament] = useState<'ancien' | 'nouveau'>('ancien');

  const filtered = SECTIONS.filter(s =>
    s.data[0].testament === testament
  );

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
            Choisir un livre
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: colors.primary }]}>Fermer</Text>
          </TouchableOpacity>
        </View>

        {/* Filtre Testament */}
        <View style={[styles.filterRow, { backgroundColor: colors.surface }]}>
          {(['ancien', 'nouveau'] as const).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setTestament(t)}
              style={[
                styles.filterBtn,
                testament === t && { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: testament === t ? '#fff' : colors.textMuted },
              ]}>
                {t === 'ancien' ? 'Ancien Testament' : 'Nouveau Testament'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Liste des livres */}
        <SectionList
          sections={filtered}
          keyExtractor={item => item.number.toString()}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { onSelect(item.number); onClose(); }}
              style={[
                styles.bookItem,
                { borderBottomColor: colors.separator },
                item.number === currentBookNumber && {
                  backgroundColor: colors.verseBookmark,
                },
              ]}
            >
              <Text style={[styles.bookAbbr, { color: colors.textSecondary }]}>
                {item.abbreviation}
              </Text>
              <Text style={[styles.bookName, { color: colors.text }]}>
                {item.name}
              </Text>
              {item.number === currentBookNumber && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
          )}
          stickySectionHeadersEnabled
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
  filterRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  bookAbbr: { fontSize: 13, fontWeight: '600', width: 36 },
  bookName: { flex: 1, fontSize: 16 },
});