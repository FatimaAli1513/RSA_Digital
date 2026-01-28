import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Note: ${note.title}`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Ionicons name="document-text-outline" size={24} color={COLORS.cardBlue} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{note.description}</Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={14} color={COLORS.gray400} />
          <Text style={styles.time}>{formatTimeAgo(note.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginVertical: 6,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: SIZES.caption,
    color: COLORS.gray400,
  },
});

export default NoteCard;
