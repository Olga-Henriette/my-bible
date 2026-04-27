import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSettings } from '@/services/SettingsContext';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { READING_PLANS_META, getPlanDays } from '@/constants/ReadingPlans';
import { ReadingPlan, ReadingPlanDay, ReadingPlanId } from '@/types/bible';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function ReadingPlanScreen() {
  const { colors } = useSettings();
  const insets     = useSafeAreaInsets();
  const router     = useRouter();
  const params     = useLocalSearchParams<{ planId?: string }>();

  const [activePlan, setActivePlan]   = useState<ReadingPlan | null>(null);
  const [planDays, setPlanDays]       = useState<ReadingPlanDay[]>([]);
  const [selecting, setSelecting]     = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.READING_PLAN);
      if (raw) {
        const plan = JSON.parse(raw) as ReadingPlan;
        setActivePlan(plan);
        setPlanDays(getPlanDays(plan.id));
      } else {
        setSelecting(true);
      }
    } catch {
      setSelecting(true);
    }
  };

  const startPlan = async (planMeta: typeof READING_PLANS_META[0]) => {
    const plan: ReadingPlan = {
      id: planMeta.id,
      title: planMeta.title,
      description: planMeta.description,
      totalDays: planMeta.totalDays,
      startDate: new Date().toISOString(),
      completedDays: [],
    };
    await AsyncStorage.setItem(STORAGE_KEYS.READING_PLAN, JSON.stringify(plan));
    setActivePlan(plan);
    setPlanDays(getPlanDays(plan.id));
    setSelecting(false);
  };

  const toggleDay = async (dayIndex: number) => {
    if (!activePlan) return;
    const completed = activePlan.completedDays.includes(dayIndex)
      ? activePlan.completedDays.filter(d => d !== dayIndex)
      : [...activePlan.completedDays, dayIndex];
    const updated = { ...activePlan, completedDays: completed };
    setActivePlan(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.READING_PLAN, JSON.stringify(updated));
  };

  const resetPlan = () => {
    Alert.alert(
      'Changer de plan',
      'Votre progression sera perdue. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(STORAGE_KEYS.READING_PLAN);
            setActivePlan(null);
            setPlanDays([]);
            setSelecting(true);
          },
        },
      ]
    );
  };

  // Sélection du plan 

  if (selecting) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ScreenHeader
          title="📅 Plans de lecture"
          paddingTop={insets.top}
          onBack={() => router.back()}
        />
        <FlatList
          data={READING_PLANS_META}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.planList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => startPlan(item)}
              style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.planIcon}>{item.icon}</Text>
              <View style={styles.planInfo}>
                <Text style={[styles.planTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.planDesc, { color: colors.textMuted }]}>
                  {item.description}
                </Text>
                <Text style={[styles.planDays, { color: colors.primary }]}>
                  {item.totalDays} jours
                </Text>
              </View>
              <Text style={[styles.planArrow, { color: colors.primary }]}>→</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Plan actif 

  if (!activePlan) return null;

  const progress = Math.round(
    (activePlan.completedDays.length / activePlan.totalDays) * 100
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={activePlan.title}
        paddingTop={insets.top}
        onBack={() => router.back()}
        rightElement={
          <TouchableOpacity onPress={resetPlan}>
            <Text style={[styles.changeBtn, { color: colors.primary }]}>
              Changer
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Progression */}
      <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {activePlan.completedDays.length} / {activePlan.totalDays} jours
          </Text>
          <Text style={[styles.progressPct, { color: colors.primary }]}>
            {progress}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
          <View style={[
            styles.progressFill,
            { backgroundColor: colors.primary, width: `${progress}%` },
          ]} />
        </View>
      </View>

      {/* Liste des jours */}
      <FlatList
        data={planDays}
        keyExtractor={item => item.day.toString()}
        contentContainerStyle={[styles.dayList, { paddingBottom: insets.bottom + 24 }]}
        renderItem={({ item }) => {
          const isDone = activePlan.completedDays.includes(item.day);
          return (
            <View style={[
              styles.dayItem,
              { backgroundColor: colors.card, borderColor: colors.border },
              isDone && { opacity: 0.6 },
            ]}>
              <TouchableOpacity
                onPress={() => toggleDay(item.day)}
                style={[
                  styles.dayCheck,
                  { borderColor: colors.primary },
                  isDone && { backgroundColor: colors.primary },
                ]}
              >
                {isDone && <Text style={styles.dayCheckIcon}>✓</Text>}
              </TouchableOpacity>

              <View style={styles.dayInfo}>
                <Text style={[styles.dayNumber, { color: colors.textMuted }]}>
                  Jour {item.day}
                </Text>
                <Text style={[styles.dayLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push({
                  pathname: '/(tabs)/read',
                  params: { bookNumber: item.bookNumber, chapter: item.chapter },
                })}
              >
                <Text style={[styles.dayReadBtn, { color: colors.primary }]}>
                  Lire →
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1 },
  planList: { padding: 16, gap: 14 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  planIcon:  { fontSize: 32 },
  planInfo:  { flex: 1, gap: 4 },
  planTitle: { fontSize: 16, fontWeight: '700' },
  planDesc:  { fontSize: 13, lineHeight: 18 },
  planDays:  { fontSize: 12, fontWeight: '600' },
  planArrow: { fontSize: 20 },
  changeBtn: { fontSize: 14, fontWeight: '600' },
  progressCard: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: { fontSize: 14, fontWeight: '600' },
  progressPct:  { fontSize: 18, fontWeight: '800' },
  progressBar:  { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  dayList:      { paddingHorizontal: 16, gap: 10 },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  dayCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCheckIcon: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dayInfo:     { flex: 1 },
  dayNumber:   { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  dayLabel:    { fontSize: 14, fontWeight: '600', marginTop: 2 },
  dayReadBtn:  { fontSize: 14, fontWeight: '700' },
});