import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, SearchBar, NoteCard, FAB } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { Note } from '../types';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Generate sample notes
const generateSampleNotes = (): Note[] => {
  const titles = [
    'Task List', 'Monthly Review', 'Ideas', 'To Do List', 
    'Daily Reminder', 'Reminders', 'Meeting Notes', 'Project Plan',
    'Shopping List', 'Goals'
  ];
  const descriptions = [
    'Notes from the conference call.',
    'Quick note about today\'s activities.',
    'This is a sample note description with important details.',
    'Project planning and ideas.',
    'Personal reminders and tasks.',
    'Quick notes for future reference.',
    'Important points from the meeting.',
    'Planning for the upcoming project.',
    'Items to buy from the market.',
    'Goals for this month.',
  ];
  
  const notes: Note[] = [];
  for (let i = 0; i < 100; i++) {
    const randomDays = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    
    notes.push({
      id: `note-${i}`,
      title: `${titles[i % titles.length]} ${Math.floor(Math.random() * 100)}`,
      description: descriptions[i % descriptions.length],
      createdAt: date,
      updatedAt: date,
    });
  }
  
  return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

const NotesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [notes] = useState<Note[]>(generateSampleNotes());

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

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
    console.log('Add note pressed');
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 120,
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
