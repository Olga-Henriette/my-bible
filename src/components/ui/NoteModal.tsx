import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSettings } from '@/services/SettingsContext';
import StorageService from '@/services/StorageService';
import { Verse } from '@/types/bible';

interface NoteModalProps {
  visible: boolean;
  verse: Verse | null;
  onClose: () => void;
}

export default function NoteModal({ visible, verse, onClose }: NoteModalProps) {
  const { colors } = useSettings() as any;
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (visible && verse) {
      StorageService.notes.get(verse.book, verse.chapter, verse.verse)
        .then(existing => {
          if (existing) {
            setNoteText(existing.note);
            setHasExisting(true);
          } else {
            setNoteText('');
            setHasExisting(false);
          }
        });
    }
  }, [visible, verse]);

  if (!verse) return null;

  const handleSave = async () => {
    if (!noteText.trim()) {
      Alert.alert('Note vide', 'Écrivez quelque chose avant de sauvegarder.');
      return;
    }
    setIsSaving(true);
    await StorageService.notes.save(
      verse.book,
      verse.chapter,
      verse.verse,
      verse.text,
      verse.book_name,
      noteText.trim()
    );
    setIsSaving(false);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la note',
      'Cette note sera définitivement supprimée.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await StorageService.notes.delete(verse.book, verse.chapter, verse.verse);
            setNoteText('');
            onClose();
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
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelBtn, { color: colors.textMuted }]}>Annuler</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            ✏️ Ma note
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.saveBtn, { color: colors.primary }]}>
              {isSaving ? 'Saving...' : 'Sauvegarder'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Verset de référence */}
          <View style={[styles.verseBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.verseRef, { color: colors.primary }]}>
              {verse.book_name} {verse.chapter}:{verse.verse}
            </Text>
            <Text style={[styles.verseText, { color: colors.verseText }]}>
              {verse.text}
            </Text>
          </View>

          {/* Zone de texte */}
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Écrivez votre réflexion, commentaire ou prière..."
            placeholderTextColor={colors.textMuted}
            multiline
            autoFocus
            style={[
              styles.noteInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />

          {/* Supprimer si note existante */}
          {hasExisting && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Text style={[styles.deleteBtnText, { color: colors.error ?? '#C0392B' }]}>
                🗑 Supprimer cette note
              </Text>
              
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 16, fontWeight: '700' },
  cancelBtn:   { fontSize: 15 },
  saveBtn:     { fontSize: 15, fontWeight: '700' },
  scroll:      { padding: 16, gap: 16 },
  verseBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  verseRef: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  verseText: {
    fontFamily: 'Georgia',
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  noteInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
    lineHeight: 26,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteBtnText: { fontSize: 15 },
});