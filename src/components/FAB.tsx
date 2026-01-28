import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const FAB: React.FC<FABProps> = ({ onPress, icon = 'add' }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Add new item"
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={28} color={COLORS.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default FAB;
