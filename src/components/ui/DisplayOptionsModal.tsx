import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSettings } from '@/services/SettingsContext';
import { Colors, Theme } from '@/constants/Colors';
import { ReadingFontSizes } from '@/constants/Typography';

interface DisplayOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const THEMES: { label: string; value: Theme; icon: string }[] = [
  { label: 'Clair',  value: 'light', icon: '☀️' },
  { label: 'Sombre', value: 'dark',  icon: '🌙' },
  { label: 'Sépia',  value: 'sepia', icon: '📜' },
];

export default function DisplayOptionsModal({ visible, onClose }: DisplayOptionsModalProps) {
  const { colors, settings, updateSettings } = useSettings();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Taille de police
          </Text>
          <View style={styles.fontRow}>
            <TouchableOpacity
              onPress={() => {
                const idx = ReadingFontSizes.indexOf(settings.font_size);
                if (idx > 0) updateSettings({ font_size: ReadingFontSizes[idx - 1] });
              }}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A−</Text>
            </TouchableOpacity>

            <View style={styles.dotsRow}>
              {ReadingFontSizes.map(size => (
                <TouchableOpacity key={size} onPress={() => updateSettings({ font_size: size })}>
                  <View style={[
                    styles.dot,
                    {
                      backgroundColor: settings.font_size === size ? colors.primary : colors.separator,
                      width:  settings.font_size === size ? 10 : 6,
                      height: settings.font_size === size ? 10 : 6,
                    },
                  ]} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                const idx = ReadingFontSizes.indexOf(settings.font_size);
                if (idx < ReadingFontSizes.length - 1) {
                  updateSettings({ font_size: ReadingFontSizes[idx + 1] });
                }
              }}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A+</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.fontValue, { color: colors.textMuted }]}>
            {settings.font_size}px · Pincez l'écran pour ajuster
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.separator }]} />

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Thème
          </Text>
          <View style={styles.themeRow}>
            {THEMES.map(theme => (
              <TouchableOpacity
                key={theme.value}
                onPress={() => updateSettings({ theme: theme.value })}
                style={[
                  styles.themeBtn,
                  { borderColor: settings.theme === theme.value ? colors.primary : colors.border },
                  settings.theme === theme.value && { backgroundColor: colors.primary + '22' },
                ]}
              >
                <Text style={styles.themeIcon}>{theme.icon}</Text>
                <Text style={[styles.themeLabel, {
                  color: settings.theme === theme.value ? colors.primary : colors.textMuted,
                  fontWeight: settings.theme === theme.value ? '700' : '400',
                }]}>
                  {theme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  fontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fontBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  fontBtnText: { fontSize: 15, fontWeight: '700' },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:     { borderRadius: 10 },
  fontValue: { fontSize: 12, textAlign: 'center' },
  divider: { height: StyleSheet.hairlineWidth },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  themeIcon:  { fontSize: 22 },
  themeLabel: { fontSize: 13 },
});