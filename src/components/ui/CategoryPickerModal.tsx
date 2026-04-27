import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSettings } from '@/services/SettingsContext';
import StorageService from '@/services/StorageService';
import { BookmarkCategory } from '@/types/bible';

const EMOJI_OPTIONS = ['⭐','💎','🔥','🌈','🎯','💡','🏆','🌺','🍃','🦋'];

interface CategoryPickerModalProps {
  visible: boolean;
  selectedId: string;
  onSelect: (category: BookmarkCategory) => void;
  onClose: () => void;
}

export default function CategoryPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: CategoryPickerModalProps) {
  const { colors } = useSettings();
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [showCreate, setShowCreate]  = useState(false);
  const [newLabel, setNewLabel]      = useState('');
  const [newIcon, setNewIcon]        = useState('⭐');

  useEffect(() => {
    if (visible) {
      StorageService.categories.getAll().then(setCategories);
    }
  }, [visible]);

  const handleCreate = async () => {
    if (!newLabel.trim()) {
      Alert.alert('Erreur', 'Le nom de la catégorie est requis.');
      return;
    }
    const created = await StorageService.categories.addCustom(
      newLabel.trim(),
      newIcon
    );
    const all = await StorageService.categories.getAll();
    setCategories(all);
    setNewLabel('');
    setShowCreate(false);
    onSelect(created);
    onClose();
  };

  const handleDelete = async (cat: BookmarkCategory) => {
    Alert.alert(
      'Supprimer la catégorie',
      `Supprimer « ${cat.label} » ? Les favoris de cette catégorie ne seront pas supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await StorageService.categories.removeCustom(cat.id);
            setCategories(prev => prev.filter(c => c.id !== cat.id));
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Catégorie
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: colors.primary }]}>Fermer</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des catégories */}
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => { onSelect(item); onClose(); }}
              style={[
                styles.item,
                { borderBottomColor: colors.separator },
                item.id === selectedId && { backgroundColor: colors.verseBookmark },
              ]}
            >
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <Text style={[styles.itemLabel, { color: colors.text }]}>
                {item.label}
              </Text>
              {item.id === selectedId && (
                <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
              )}
              {item.isCustom && (
                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.deleteIcon, { color: colors.textMuted }]}>🗑</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              onPress={() => setShowCreate(!showCreate)}
              style={[styles.createBtn, { borderColor: colors.primary }]}
            >
              <Text style={[styles.createBtnText, { color: colors.primary }]}>
                + Créer une catégorie
              </Text>
            </TouchableOpacity>
          }
        />

        {/* Formulaire création */}
        {showCreate && (
          <View style={[styles.createForm, {
            backgroundColor: colors.card,
            borderTopColor: colors.separator,
          }]}>
            <Text style={[styles.createTitle, { color: colors.text }]}>
              Nouvelle catégorie
            </Text>

            {/* Choix de l'icône */}
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map(e => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setNewIcon(e)}
                  style={[
                    styles.emojiBtn,
                    { borderColor: newIcon === e ? colors.primary : 'transparent' },
                  ]}
                >
                  <Text style={styles.emoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Nom */}
            <TextInput
              value={newLabel}
              onChangeText={setNewLabel}
              placeholder="Nom de la catégorie..."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }]}
            />

            {/* Boutons */}
            <View style={styles.createActions}>
              <TouchableOpacity
                onPress={() => setShowCreate(false)}
                style={[styles.cancelCreate, { borderColor: colors.border }]}
              >
                <Text style={[styles.cancelCreateText, { color: colors.textMuted }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.confirmCreate, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.confirmCreateText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title:    { fontSize: 18, fontWeight: '700' },
  closeBtn: { fontSize: 16, fontWeight: '600' },
  list:     { paddingBottom: 24 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  itemIcon:   { fontSize: 22 },
  itemLabel:  { flex: 1, fontSize: 16 },
  check:      { fontSize: 18, fontWeight: '700' },
  deleteIcon: { fontSize: 18 },
  createBtn: {
    margin: 16,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  createBtnText: { fontSize: 15, fontWeight: '600' },
  createForm: {
    padding: 16,
    borderTopWidth: 1,
    gap: 14,
  },
  createTitle: { fontSize: 16, fontWeight: '700' },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 22 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  createActions: { flexDirection: 'row', gap: 10 },
  cancelCreate: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  cancelCreateText: { fontSize: 15 },
  confirmCreate: {
    flex: 1,
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  confirmCreateText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});