import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/services/SettingsContext';

export default function EmptyBookmarks() {
  const { colors } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔖</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        Aucun favori
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Appuyez longuement sur un verset dans l'onglet{' '}
        <Text style={{ fontWeight: '700' }}>Lire</Text> pour l'ajouter
        à vos favoris.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 14,
  },
  icon: { fontSize: 52 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});