import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.light.primary,
      tabBarStyle: { backgroundColor: Colors.light.background },
      headerStyle: { backgroundColor: Colors.light.background },
      headerTitleStyle: { fontFamily: 'Georgia', fontWeight: 'bold' }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Accueil', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="read" 
        options={{ title: 'Lire', tabBarIcon: ({color}) => <Ionicons name="book" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="search" 
        options={{ title: 'Rechercher', tabBarIcon: ({color}) => <Ionicons name="search" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="bookmarks" 
        options={{ title: 'Favoris', tabBarIcon: ({color}) => <Ionicons name="bookmark" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}