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

export default function HomeScreen() {
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lastPosition } = useLastPosition();
  const { total: totalBookmarks } = useBookmarks();

  const [verseOfDay, setVerseOfDay] = useState<Verse | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setVerseOfDay(BibleService.getVerseOfTheDay());
    StorageService.history.get().then(h => setHistoryCount(h.length));
  }, []);

  const goToRead = (bookNumber?: number, chapter?: number) => {
    router.push({
      pathname: '/(tabs)/read',
      params: {
        bookNumber: bookNumber ?? lastPosition.book_number,
        chapter: chapter ?? lastPosition.chapter,
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
      <StatusBar barStyle="light-content" backgroundColor={colors.tabBarBackground} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.tabBarBackground, paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>📖 Ma Bible</Text>
        <Text style={styles.headerDate}>{today}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Verset du jour */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Verset du jour
        </Text>
        {verseOfDay && (
          <VerseCard
            verse={verseOfDay}
            onPress={() =>
              goToRead(verseOfDay.book, verseOfDay.chapter)
            }
          />
        )}

        {/* Reprendre la lecture */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Continuer la lecture
        </Text>
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

        {/* Accès rapide Testaments */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Accès rapide
        </Text>
        <View style={styles.testamentRow}>
          <TouchableOpacity
            onPress={() => goToRead(1, 1)}
            activeOpacity={0.85}
            style={[styles.testamentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.testamentIcon}>📜</Text>
            <Text style={[styles.testamentTitle, { color: colors.text }]}>Ancien</Text>
            <Text style={[styles.testamentSub, { color: colors.textMuted }]}>Testament</Text>
            <Text style={[styles.testamentCount, { color: colors.textSecondary }]}>39 livres</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goToRead(40, 1)}
            activeOpacity={0.85}
            style={[styles.testamentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.testamentIcon}>✝️</Text>
            <Text style={[styles.testamentTitle, { color: colors.text }]}>Nouveau</Text>
            <Text style={[styles.testamentSub, { color: colors.textMuted }]}>Testament</Text>
            <Text style={[styles.testamentCount, { color: colors.textSecondary }]}>27 livres</Text>
          </TouchableOpacity>
        </View>

        {/* ── Statistiques ── */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Mes statistiques
        </Text>
        <View style={styles.statsRow}>
          <StatCard icon="🔖" value={totalBookmarks} label="Favoris" />
          <StatCard icon="📚" value={historyCount} label="Chapitres lus" />
          <StatCard icon="📖" value={66} label="Livres" />
        </View>

        {/* Mention version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Louis Segond 1910 · Domaine public
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F0D080',
    fontFamily: 'Georgia',
  },
  headerDate: {
    fontSize: 13,
    color: '#C4956A',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  scroll: {
    paddingTop: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 18,
  },
  resumeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.85,
    marginBottom: 4,
  },
  resumeChapter: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  resumeArrow: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  testamentRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  testamentCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  testamentIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  testamentTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  testamentSub: {
    fontSize: 12,
  },
  testamentCount: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 16,
    fontStyle: 'italic',
  },
});