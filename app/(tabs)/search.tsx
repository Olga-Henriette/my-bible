import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useSettings } from '@/services/SettingsContext';
import { useSearch } from '@/hooks/useSearch';

import SearchBar from '@/components/ui/SearchBar';
import SearchResultItem from '@/components/ui/SearchResultItem';

import { Verse, Testament } from '@/types/bible';
import ScreenHeader from '@/components/ui/ScreenHeader';

const FILTERS: { label: string; value: Testament }[] = [
  { label: 'Tout', value: 'all' },
  { label: 'Ancien T.', value: 'ancien' },
  { label: 'Nouveau T.', value: 'nouveau' },
];

export default function SearchScreen() {
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    query,
    results,
    testament,
    isSearching,
    resultCount,
    search,
    changeTestament,
    clearSearch,
  } = useSearch();

  const handleResultPress = useCallback(
      (verse: Verse) => {
        router.push({
          pathname: '/(tabs)/read',
          params: {
            bookNumber: verse.book,
            chapter: verse.chapter,
            verseNumber: verse.verse, 
          },
        });
      },
      [router]
    );

  // Contenu de la liste 

  const ListHeader = (
    <View style={styles.listHeader}>
      {query.length >= 2 && (
        <Text style={[styles.resultCount, { color: colors.textMuted }]}>
          {isSearching
            ? 'Recherche en cours...'
            : `${resultCount} résultat${resultCount > 1 ? 's' : ''} pour « ${query} »`}
        </Text>
      )}
    </View>
  );

  const ListEmpty = () => {
    if (query.length < 2) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Rechercher dans la Bible
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Saisissez un mot ou une expression pour explorer les{' '}
            <Text style={{ fontWeight: '700' }}>31 000 versets</Text> de la Bible.
          </Text>
        </View>
      );
    }
    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Aucun résultat
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
          Aucun verset ne contient « {query} ».{'\n'}
          Essayez un autre terme.
        </Text>
      </View>
    );
  };

  // Rendu 

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Header ── */}
      <ScreenHeader
        title="Recherche"
        paddingTop={insets.top}
      />

      {/* Barre de recherche */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.background }]}>
        <SearchBar
          value={query}
          onChangeText={text => search(text)}
          onClear={clearSearch}
        />

        {/* Filtres Testament */}
        <View style={styles.filterRow}>
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => changeTestament(filter.value)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor:
                    testament === filter.value
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      testament === filter.value ? '#fff' : colors.textMuted,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Résultats */}
      <FlatList
        data={results}
        keyExtractor={item => `${item.book}-${item.chapter}-${item.verse}`}
        renderItem={({ item }) => (
          <SearchResultItem
            verse={item}
            query={query}
            onPress={handleResultPress}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrapper: {
    paddingVertical: 12,
    gap: 10,
    zIndex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    flexGrow: 1,
    paddingTop: 4,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultCount: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});