import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { SettingsProvider, useSettings } from '@/services/SettingsContext';
import NotificationService from '@/services/NotificationService';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, settings } = useSettings();
  const router = useRouter();

  useEffect(() => {
    async function initApp() {
      if (!isLoading) {
        try {
          await NotificationService.init();
        } catch (e) {
          console.error("Erreur Notification Init:", e);
        } finally {
          await SplashScreen.hideAsync();
        }
      }
    }
    initApp();
  }, [isLoading]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.bookNumber && data?.chapter) {
        router.push({
          pathname: '/(tabs)/read',
          params: {
            bookNumber: data.bookNumber.toString(),
            chapter: data.chapter.toString(),
            verseNumber: data.verse?.toString(),
            timestamp: Date.now().toString(), 
          },
        });
      }
    });
    return () => subscription.remove();
  }, [router]);

  return (
    <>
      <StatusBar style={settings?.theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="reading-plan" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <RootLayoutNav />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}