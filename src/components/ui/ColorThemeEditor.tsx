import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useSettings } from '@/services/SettingsContext';
import { CustomColor } from '@/types/bible';
import { Colors } from '@/constants/Colors';

interface ColorThemeEditorProps {
  visible: boolean;
  onClose: () => void;
}

const COLOR_FIELDS: { key: keyof CustomColor; label: string; icon: string }[] = [
  { key: 'background',      label: 'Fond principal',      icon: '🎨' },
  { key: 'surface',         label: 'Fond secondaire',     icon: '🖼' },
  { key: 'card',            label: 'Cartes',              icon: '🃏' },
  { key: 'text',            label: 'Texte principal',     icon: '📝' },
  { key: 'textSecondary',   label: 'Texte secondaire',    icon: '✍️' },
  { key: 'textMuted',       label: 'Texte discret',       icon: '💬' },
  { key: 'primary',         label: 'Couleur primaire',    icon: '⭐' },
  { key: 'tabBarBackground',label: 'Barre navigation',    icon: '📱' },
  { key: 'tabBarActive',    label: 'Icône active',        icon: '✨' },
  { key: 'separator',       label: 'Séparateur',          icon: '🧱' },
  { key: 'border',          label: 'Bordure',             icon: '🪡' },
];

// Présets rapides
const PRESETS: { name: string; icon: string; colors: CustomColor }[] = [
  {
    name: 'Forêt',
    icon: '🌲',
    colors: {
      background: '#F0F7F0', surface: '#E0EFE0', card: '#FAFFF8',
      text: '#1A3A1A', textSecondary: '#2E6B2E', textMuted: '#5A8A5A',
      primary: '#2E6B2E', tabBarBackground: '#1A3A1A', tabBarActive: '#90EE90',
      separator: '#D0E0D0', border: '#C0D0C0', 
    },
  },
  {
    name: 'Océan',
    icon: '🌊',
    colors: {
      background: '#EFF6FF', surface: '#DBEAFE', card: '#F8FBFF',
      text: '#1E3A5F', textSecondary: '#1D4ED8', textMuted: '#60A5FA',
      primary: '#1D4ED8', tabBarBackground: '#1E3A5F', tabBarActive: '#93C5FD',
      separator: '#BFDBFE', border: '#ADC9EF', 
    },
  },
  {
    name: 'Coucher',
    icon: '🌅',
    colors: {
      background: '#FFF7ED', surface: '#FFEDD5', card: '#FFFBF7',
      text: '#431407', textSecondary: '#C2410C', textMuted: '#EA580C',
      primary: '#C2410C', tabBarBackground: '#431407', tabBarActive: '#FED7AA',
      separator: '#FED7AA', border: '#FDBA74',
    },
  },
  {
    name: 'Lavande',
    icon: '💜',
    colors: {
      background: '#FAF5FF', surface: '#EDE9FE', card: '#FDFBFF',
      text: '#2E1065', textSecondary: '#7C3AED', textMuted: '#A78BFA',
      primary: '#7C3AED', tabBarBackground: '#2E1065', tabBarActive: '#DDD6FE',
      separator: '#DDD6FE', border: '#C4B5FD', 
    },
  },
];

function isValidHex(color: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

export default function ColorThemeEditor({ visible, onClose }: ColorThemeEditorProps) {
  const { colors, settings, updateSettings } = useSettings();

  // Initialise avec les couleurs custom existantes ou le thème light
  const baseColors = settings.customColors ?? (Colors.light as unknown as CustomColor);
  const [editColors, setEditColors] = useState<CustomColor>(baseColors);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomColor, boolean>>>({});

  const setColor = (key: keyof CustomColor, value: string) => {
    setEditColors(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: !isValidHex(value) }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setEditColors(preset.colors);
    setErrors({});
  };

  const handleSave = async () => {
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      Alert.alert('Erreur', 'Certaines couleurs sont invalides. Utilisez le format #RRGGBB.');
      return;
    }
    await updateSettings({ theme: 'custom', customColors: editColors });
    onClose();
  };

  const handleReset = async () => {
    await updateSettings({ theme: 'light', customColors: undefined });
    onClose();
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
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelBtn, { color: colors.textMuted }]}>Annuler</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>🎨 Thème personnalisé</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveBtn, { color: colors.primary }]}>Appliquer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Présets */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Présets rapides
          </Text>
          <View style={styles.presetsRow}>
            {PRESETS.map(preset => (
              <TouchableOpacity
                key={preset.name}
                onPress={() => applyPreset(preset)}
                style={[styles.presetBtn, { backgroundColor: preset.colors.primary + '22', borderColor: preset.colors.primary }]}
              >
                <Text style={styles.presetIcon}>{preset.icon}</Text>
                <Text style={[styles.presetName, { color: preset.colors.primary }]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Aperçu */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Aperçu
          </Text>
          <View style={[styles.preview, { backgroundColor: editColors.background, borderColor: editColors.primary }]}>
            <View style={[styles.previewHeader, { backgroundColor: editColors.tabBarBackground }]}>
              <Text style={[styles.previewTitle, { color: editColors.tabBarActive }]}>
                📖 Ma Bible
              </Text>
            </View>
            <View style={[styles.previewCard, { backgroundColor: editColors.card }]}>
              <Text style={[styles.previewRef, { color: editColors.primary }]}>Jean 3:16</Text>
              <Text style={[styles.previewVerse, { color: editColors.text }]}>
                Car Dieu a tant aimé le monde...
              </Text>
            </View>
          </View>

          {/* Éditeur couleurs */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Couleurs (#RRGGBB)
          </Text>
          {COLOR_FIELDS.map(field => (
            <View
              key={field.key}
              style={[styles.colorRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.colorIcon}>{field.icon}</Text>
              <View style={styles.colorInfo}>
                <Text style={[styles.colorLabel, { color: colors.text }]}>
                  {field.label}
                </Text>
                <TextInput
                  value={editColors[field.key]}
                  onChangeText={val => setColor(field.key, val)}
                  placeholder="#RRGGBB"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="characters"
                  maxLength={7}
                  style={[
                    styles.colorInput,
                    {
                      color: colors.text,
                      borderColor: errors[field.key] ? '#C0392B' : colors.border,
                      backgroundColor: colors.surface,
                    },
                  ]}
                />
              </View>
              {/* Pastille de couleur */}
              <View style={[
                styles.colorSwatch,
                {
                  backgroundColor: isValidHex(editColors[field.key] ?? '')
                    ? editColors[field.key]
                    : '#ccc',
                },
              ]} />
            </View>
          ))}

          {/* Réinitialiser */}
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={[styles.resetText, { color: colors.textMuted }]}>
              Revenir au thème Clair
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  title:     { fontSize: 16, fontWeight: '700' },
  cancelBtn: { fontSize: 15 },
  saveBtn:   { fontSize: 15, fontWeight: '700' },
  scroll:    { padding: 16, gap: 14, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  presetsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 6,
  },
  presetIcon: { fontSize: 16 },
  presetName: { fontSize: 13, fontWeight: '700' },
  preview: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  previewHeader: { padding: 12 },
  previewTitle:  { fontSize: 16, fontWeight: '800' },
  previewCard:   { padding: 14, gap: 6 },
  previewRef:    { fontSize: 12, fontWeight: '700' },
  previewVerse:  { fontFamily: 'Georgia', fontSize: 14, fontStyle: 'italic' },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  colorIcon:  { fontSize: 20 },
  colorInfo:  { flex: 1, gap: 6 },
  colorLabel: { fontSize: 13, fontWeight: '600' },
  colorInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resetText: { fontSize: 14 },
});