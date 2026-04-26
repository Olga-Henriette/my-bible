import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index"     options={{ title: 'Accueil' }} />
      <Tabs.Screen name="read"      options={{ title: 'Lire' }} />
      <Tabs.Screen name="search"    options={{ title: 'Rechercher' }} />
      <Tabs.Screen name="bookmarks" options={{ title: 'Favoris' }} />
    </Tabs>
  );
}