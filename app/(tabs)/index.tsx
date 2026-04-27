import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { useSettings } from '@/services/SettingsContext';
import { useLastPosition } from '@/hooks/useLastPosition';
import { useBookmarks } from '@/hooks/useBookmarks';
import BibleService from '@/services/BibleService';
import StorageService from '@/services/StorageService';

import VerseCard from '@/components/ui/VerseCard';
import StatCard from '@/components/ui/StatCard';
import { Verse } from '@/types/bible';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function HomeScreen() {
  const { colors, settings } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lastPosition } = useLastPosition();
  const { total: totalBookmarks } = useBookmarks();

  const [verseOfDay, setVerseOfDay] = useState<Verse | null>(null);
  const [readingDays, setReadingDays] = useState(0);
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    const vOD = BibleService.getVerseOfTheDay();
    setVerseOfDay(vOD);
    
    StorageService.stats.getTotalDays().then(setReadingDays);
    StorageService.stats.getProgressPercent().then(setProgressPct);
  }, []);

  const goToRead = (bookNumber?: number, chapter?: number, verseNumber?: number) => {
    router.push({
      pathname: '/(tabs)/read',
      params: {
        bookNumber: (bookNumber ?? lastPosition.book_number).toString(),
        chapter: (chapter ?? lastPosition.chapter).toString(),
        verseNumber: verseNumber ? verseNumber.toString() : "",
        key: Date.now().toString(), 
      },
    });
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={settings.theme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScreenHeader
        title="📖 Ma Bible"
        subtitle={today}
        paddingTop={insets.top}
        rightElement={
          <TouchableOpacity onPress={() => router.push('/settings')}>
             <Text style={{ fontSize: 24 }}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Verset du jour</Text>
        {verseOfDay && (
          <VerseCard
            verse={verseOfDay}
            onPress={() => goToRead(verseOfDay.book, verseOfDay.chapter, verseOfDay.verse)}
          />
        )}

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Continuer la lecture</Text>
        <TouchableOpacity
          onPress={() => goToRead()}
          activeOpacity={0.85}
          style={[styles.resumeCard, { backgroundColor: colors.primary }]}
        >
          <View>
            <Text style={styles.resumeLabel}>Reprendre où j'en étais</Text>
            <Text style={styles.resumeChapter}>
              {lastPosition.book_name} — Chapitre {lastPosition.chapter}
            </Text>
          </View>
          <Text style={styles.resumeArrow}>→</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Accès rapide</Text>
        <View style={styles.testamentRow}>
          <TouchableOpacity
            onPress={() => goToRead(1, 1)}
            style={[styles.testamentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.testamentIcon}>📜</Text>
            <Text style={[styles.testamentTitle, { color: colors.text }]}>Ancien</Text>
            <Text style={[styles.testamentSub, { color: colors.textMuted }]}>Testament</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goToRead(40, 1)}
            style={[styles.testamentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.testamentIcon}>✝️</Text>
            <Text style={[styles.testamentTitle, { color: colors.text }]}>Nouveau</Text>
            <Text style={[styles.testamentSub, { color: colors.textMuted }]}>Testament</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Mes statistiques</Text>
        <View style={styles.statsRow}>
          <StatCard icon="🔖" value={totalBookmarks} label="Favoris" />
          <StatCard icon="📅" value={readingDays}    label="Jours lus" />
          <StatCard icon="📊" value={`${progressPct}%`} label="Progression" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingTop: 20, gap: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginHorizontal: 16, marginTop: 8, marginBottom: 4 },
  resumeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, borderRadius: 12, padding: 18 },
  resumeLabel: { color: '#fff', fontSize: 12, fontWeight: '600', opacity: 0.85, marginBottom: 4 },
  resumeChapter: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resumeArrow: { color: '#fff', fontSize: 24 },
  testamentRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12 },
  testamentCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 16, alignItems: 'center' },
  testamentIcon: { fontSize: 28, marginBottom: 4 },
  testamentTitle: { fontSize: 15, fontWeight: '700' },
  testamentSub: { fontSize: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10 },
});