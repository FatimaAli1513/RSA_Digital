import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Expense } from '../types';

interface ExpenseCardProps {
  expense: Expense;
  onPress: () => void;
}

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    'Food': 'fast-food-outline',
    'Transport': 'car-outline',
    'Shopping': 'cart-outline',
    'Bills': 'receipt-outline',
    'Entertainment': 'game-controller-outline',
    'Health': 'medical-outline',
    'Education': 'school-outline',
    'Other': 'ellipsis-horizontal-outline',
  };
  return icons[category] || 'ellipsis-horizontal-outline';
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Food': COLORS.cardOrange,
    'Transport': COLORS.cardBlue,
    'Shopping': COLORS.cardPink,
    'Bills': COLORS.cardPurple,
    'Entertainment': COLORS.cardGreen,
    'Health': COLORS.cardRed,
    'Education': COLORS.primary,
    'Other': COLORS.gray500,
  };
  return colors[category] || COLORS.gray500;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const categoryColor = getCategoryColor(expense.category);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Expense: ${expense.title}`}
      accessibilityRole="button"
    >
      <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
        <Ionicons name={getCategoryIcon(expense.category)} size={24} color={categoryColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.date}>{formatDate(expense.date)}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
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
    borderRadius: 12,
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
    color: COLORS.gray800,
    marginBottom: 2,
  },
  category: {
    fontSize: SIZES.caption,
    color: COLORS.gray500,
    marginBottom: 2,
  },
  date: {
    fontSize: SIZES.small,
    color: COLORS.gray400,
  },
  amount: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.error,
  },
});

export default ExpenseCard;
