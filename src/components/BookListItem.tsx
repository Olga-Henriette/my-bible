import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Book } from '../types/bible';
import { Colors } from '../constants/Colors';
import { normalize } from '../utils/responsive';

interface Props {
  book: Book;
  onPress: (bookId: string) => void;
}

export const BookListItem = ({ book, onPress }: Props) => (
  <TouchableOpacity 
    style={styles.container} 
    onPress={() => onPress(book.id)}
    activeOpacity={0.7}
  >
    <View style={styles.info}>
      <Text style={styles.name}>{book.name}</Text>
      <Text style={styles.details}>{book.chapters.length} chapitres</Text>
    </View>
    <Text style={styles.abbreviation}>{book.abbreviation}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: normalize(16),
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: normalize(18),
    fontFamily: 'System', 
    color: Colors.light.text,
    fontWeight: '600',
  },
  details: {
    fontSize: normalize(12),
    color: Colors.light.secondary,
    marginTop: 4,
  },
  abbreviation: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: Colors.light.primary,
    opacity: 0.5,
  },
  info: { flex: 1 }
});