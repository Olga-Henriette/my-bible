import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '@/services/SettingsContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  paddingTop: number;
}

export default function ScreenHeader({
  title,
  subtitle,
  rightElement,
  onBack,
  paddingTop,
}: ScreenHeaderProps) {
  const { colors } = useSettings();

  return (
    <View style={[
      styles.header,
      { backgroundColor: colors.tabBarBackground, paddingTop: paddingTop + 12 },
    ]}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        {rightElement && (
          <View style={styles.right}>{rightElement}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: { padding: 4 },
  backArrow: {
    fontSize: 22,
    color: '#F0D080',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F0D080',
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 12,
    color: '#C4956A',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  right: {
    alignItems: 'flex-end',
  },
});