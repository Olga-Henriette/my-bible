import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { NotificationSettings } from '@/types/bible';
import BibleService from './BibleService';

// Comportement quand une notif arrive en foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  hour: 6,
  minute: 0,
};

const NotificationService = {

  // Permissions 
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async hasPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  // Paramètres 
  async getSettings(): Promise<NotificationSettings> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION);
      if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
      return JSON.parse(raw) as NotificationSettings;
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  },

  async saveSettings(settings: NotificationSettings): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATION,
      JSON.stringify(settings)
    );
  },

  // Planification 
  async schedule(settings: NotificationSettings): Promise<void> {
    // Annule toutes les notifs existantes avant de replanifier
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!settings.enabled) return;

    const hasPermission = await NotificationService.requestPermissions();
    if (!hasPermission) return;

    const verse = BibleService.getVerseOfTheDay();
    const preview = verse.text.length > 80
      ? verse.text.slice(0, 77) + '...'
      : verse.text;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Verset du jour',
        body: `${verse.book_name} ${verse.chapter}:${verse.verse} — ${preview}`,
        data: {
          bookNumber: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: settings.hour,
        minute: settings.minute,
      },
    });
  },

  async cancel(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  // Initialisation au démarrage 
  async init(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      const settings = await NotificationService.getSettings();
      if (settings.enabled) {
        // On demande la permission silencieusement
        const granted = await NotificationService.hasPermission();
        if (granted) {
          await NotificationService.schedule(settings);
        }
      }
    } catch (e) {
      console.warn("Notification init failed: ", e);
    }
  },
};

export default NotificationService;