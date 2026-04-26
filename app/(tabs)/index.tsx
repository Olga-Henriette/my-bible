import { View, Text, StyleSheet } from 'react-native';
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📖 Accueil</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F0E8' },
  text: { fontSize: 24, color: '#5C3317' },
});