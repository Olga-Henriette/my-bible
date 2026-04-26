import { View, Text, StyleSheet } from 'react-native';

const ICONS: Record<string, { normal: string; focused: string }> = {
  home:        { normal: '⌂', focused: '⌂' },
  'book-open': { normal: '📖', focused: '📖' },
  search:      { normal: '🔍', focused: '🔍' },
  bookmark:    { normal: '🔖', focused: '🔖' },
};

interface TabBarIconProps {
  name: keyof typeof ICONS;
  color: string;
  focused: boolean;
}

export default function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const icon = ICONS[name];

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, focused && styles.focused]}>
        {icon?.focused ?? '●'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  icon: {
    fontSize: 22,
    opacity: 0.7,
  },
  focused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});