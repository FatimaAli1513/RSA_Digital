import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, SearchBar, NoteCard, FAB, AddNoteModal } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { Note } from '../types';
import { getNotes, addNote } from '../utils/storage';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NotesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    const storedNotes = await getNotes();
    setNotes(storedNotes);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const handleNotePress = (note: Note) => {
    console.log('Note pressed:', note.title);
  };

  const handleAddNote = () => {
    setIsModalVisible(true);
  };

  const handleSaveNote = async (title: string, description: string) => {
    const newNote = await addNote({ title, description });
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderNote = ({ item }: { item: Note }) => (
    <NoteCard note={item} onPress={() => handleNotePress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No notes found</Text>
      <Text style={styles.emptySubtext}>Tap + to create your first note</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Notes"
          subtitle={currentDate}
          showBack={true}
          onBackPress={handleBackPress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.cardBlue} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Notes"
        subtitle={currentDate}
        count={filteredNotes.length}
        showBack={true}
        onBackPress={handleBackPress}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search"
        onFilterPress={handleFilter}
      />

      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />

      <FAB onPress={handleAddNote} />

      <AddNoteModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
  },
});

export default NotesScreen;
