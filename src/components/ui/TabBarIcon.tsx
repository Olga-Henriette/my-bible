import { Ionicons } from '@expo/vector-icons';

const ICONS: Record<string, { normal: keyof typeof Ionicons.glyphMap; focused: keyof typeof Ionicons.glyphMap }> = {
  home:        { normal: 'home-outline',        focused: 'home' },
  'book-open': { normal: 'book-outline',         focused: 'book' },
  search:      { normal: 'search-outline',       focused: 'search' },
  bookmark:    { normal: 'bookmark-outline',     focused: 'bookmark' },
};

interface TabBarIconProps {
  name: keyof typeof ICONS;
  color: string;
  focused: boolean;
}

export default function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const icon = ICONS[name];
  const iconName = focused ? icon.focused : icon.normal;
  return <Ionicons name={iconName} size={24} color={color} />;
}