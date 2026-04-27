import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettings } from '@/services/SettingsContext';
import { Colors, Theme } from '@/constants/Colors';
import { ReadingFontSizes } from '@/constants/Typography';
import BibleService from '@/services/BibleService';
import { useState, useEffect } from 'react';
import NotificationService from '@/services/NotificationService';
import { NotificationSettings } from '@/types/bible';

import ScreenHeader from '@/components/ui/ScreenHeader';

const THEMES: { label: string; value: Theme; icon: string; desc: string }[] = [
  { label: 'Clair',  value: 'light', icon: '☀️', desc: 'Fond crème, texte brun' },
  { label: 'Sombre', value: 'dark',  icon: '🌙', desc: 'Fond sombre, texte clair' },
  { label: 'Sépia',  value: 'sepia', icon: '📜', desc: 'Tons chauds dorés' },
];

export default function SettingsScreen() {
  const { colors, settings, updateSettings } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const meta = BibleService.getMetadata();
  
const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
  enabled: true,
  hour: 6,
  minute: 0,
});
const [notifPermission, setNotifPermission] = useState(false);

useEffect(() => {
  NotificationService.getSettings().then(setNotifSettings);
  NotificationService.hasPermission().then(setNotifPermission);
}, []);

const updateNotification = async (patch: Partial<NotificationSettings>) => {
  const updated = { ...notifSettings, ...patch };
  setNotifSettings(updated);
  await NotificationService.saveSettings(updated);
  await NotificationService.schedule(updated);
  if (!notifPermission) {
    const granted = await NotificationService.requestPermissions();
    setNotifPermission(granted);
  }
};

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* Header */}
      <ScreenHeader
        title="Paramètres"
        paddingTop={insets.top}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Section : Notifications */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Notifications
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

          {/* Activer / Désactiver */}
          <View style={styles.notifRow}>
            <View style={styles.notifInfo}>
              <Text style={[styles.notifLabel, { color: colors.text }]}>
                Verset du jour
              </Text>
              <Text style={[styles.notifDesc, { color: colors.textMuted }]}>
                {notifPermission
                  ? 'Notification quotidienne activée'
                  : 'Permission requise'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => updateNotification({ enabled: !notifSettings.enabled })}
              style={[
                styles.toggle,
                { backgroundColor: notifSettings.enabled ? colors.primary : colors.separator },
              ]}
            >
              <View style={[
                styles.toggleThumb,
                { transform: [{ translateX: notifSettings.enabled ? 20 : 2 }] },
              ]} />
            </TouchableOpacity>
          </View>

          {notifSettings.enabled && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.separator }]} />

              {/* Heure */}
              <View style={styles.notifRow}>
                <Text style={[styles.notifLabel, { color: colors.text }]}>
                  Heure d'envoi
                </Text>
                <View style={styles.timeRow}>

                  {/* Heure − / + */}
                  <TouchableOpacity
                    onPress={() => updateNotification({ hour: Math.max(0, notifSettings.hour - 1) })}
                    style={[styles.timeBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.timeBtnText, { color: colors.text }]}>−</Text>
                  </TouchableOpacity>

                  <Text style={[styles.timeDisplay, { color: colors.text }]}>
                    {String(notifSettings.hour).padStart(2, '0')}:
                    {String(notifSettings.minute).padStart(2, '0')}
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateNotification({ hour: Math.min(23, notifSettings.hour + 1) })}
                    style={[styles.timeBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.timeBtnText, { color: colors.text }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Minutes */}
              <View style={[styles.notifRow, { paddingTop: 0 }]}>
                <Text style={[styles.notifDesc, { color: colors.textMuted }]}>
                  Ajuster les minutes
                </Text>
                <View style={styles.timeRow}>
                  <TouchableOpacity
                    onPress={() => updateNotification({ minute: Math.max(0, notifSettings.minute - 5) })}
                    style={[styles.timeBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.timeBtnText, { color: colors.text }]}>−5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateNotification({ minute: Math.min(55, notifSettings.minute + 5) })}
                    style={[styles.timeBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.timeBtnText, { color: colors.text }]}>+5</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Section : Thème */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Apparence
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {THEMES.map((theme, index) => (
            <TouchableOpacity
              key={theme.value}
              onPress={() => updateSettings({ theme: theme.value })}
              style={[
                styles.themeRow,
                index < THEMES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.separator,
                },
              ]}
            >
              <Text style={styles.themeIcon}>{theme.icon}</Text>
              <View style={styles.themeInfo}>
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  {theme.label}
                </Text>
                <Text style={[styles.themeDesc, { color: colors.textMuted }]}>
                  {theme.desc}
                </Text>
              </View>
              <View style={[
                styles.radioOuter,
                { borderColor: colors.primary },
              ]}>
                {settings.theme === theme.value && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section : Taille de police */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Taille de police
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Aperçu */}
          <View style={[styles.previewBox, { backgroundColor: colors.surface }]}>
            <Text style={[
              styles.previewText,
              { color: colors.verseText, fontSize: settings.font_size, lineHeight: settings.font_size * 1.7 },
            ]}>
              « Car Dieu a tant aimé le monde... »
            </Text>
            <Text style={[styles.previewRef, { color: colors.textMuted }]}>
              Jean 3:16 — Aperçu
            </Text>
          </View>

          {/* Slider manuel */}
          <View style={styles.fontSizeRow}>
            <TouchableOpacity
              onPress={() => {
                const idx = ReadingFontSizes.indexOf(settings.font_size);
                if (idx > 0) updateSettings({ font_size: ReadingFontSizes[idx - 1] });
              }}
              style={[styles.fontBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.fontBtnText, { color: colors.text }]}>A−</Text>
            </TouchableOpacity>

            {/* Indicateur de taille */}
            <View style={styles.fontSizeDots}>
              {ReadingFontSizes.map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => updateSettings({ font_size: size })}
                >
                  <View style={[
                    styles.dot,
                    {
                      backgroundColor:
                        settings.font_size === size
                          ? colors.primary
                          : colors.separator,
                      width: settings.font_size === size ? 10 : 6,
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

          <Text style={[styles.fontSizeValue, { color: colors.textMuted }]}>
            Taille actuelle : {settings.font_size}px
          </Text>
        </View>

        {/* Section : À propos */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          À propos
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textMuted }]}>Version de la Bible</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>{meta.name}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textMuted }]}>Licence</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>Domaine public</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textMuted }]}>Application</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>Ma Bible v1.0.0</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.separator }]} />
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textMuted }]}>Stockage</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>100% hors-ligne</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#F0D080' },
  scroll: { paddingTop: 20, gap: 10 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  themeIcon: { fontSize: 24 },
  themeInfo: { flex: 1 },
  themeLabel: { fontSize: 16, fontWeight: '600' },
  themeDesc: { fontSize: 12, marginTop: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  // Police
  previewBox: {
    margin: 14,
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  previewText: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
  },
  previewRef: {
    fontSize: 11,
    textAlign: 'right',
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  fontBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  fontBtnText: { fontSize: 16, fontWeight: '700' },
  fontSizeDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: { borderRadius: 10 },
  fontSizeValue: {
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 14,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  aboutLabel: { fontSize: 14 },
  aboutValue: { fontSize: 14, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  notifInfo: { flex: 1 },
  notifLabel: { fontSize: 15, fontWeight: '600' },
  notifDesc:  { fontSize: 12, marginTop: 2 },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeBtnText: { fontSize: 14, fontWeight: '700' },
  timeDisplay: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 60,
    textAlign: 'center',
  },
});