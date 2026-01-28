import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface StatCardProps {
  value: number | string;
  label: string;
  backgroundColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  label, 
  backgroundColor = COLORS.cardBackground 
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    ...SHADOWS.light,
  },
  value: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  label: {
    fontSize: SIZES.caption,
    color: COLORS.gray300,
  },
});

export default StatCard;
