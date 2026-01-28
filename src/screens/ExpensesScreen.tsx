import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header, SearchBar, ExpenseCard, FAB } from '../components';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Expense } from '../types';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

// Generate sample expenses
const generateSampleExpenses = (): Expense[] => {
  const titles = [
    'Grocery Shopping', 'Petrol', 'Restaurant', 'Electricity Bill',
    'Movie Tickets', 'Medicine', 'Books', 'Clothes Shopping',
    'Mobile Recharge', 'Internet Bill', 'Gas Bill', 'Lunch',
    'Uber Ride', 'Coffee', 'Gym Membership', 'Haircut',
  ];
  
  const expenses: Expense[] = [];
  for (let i = 0; i < 100; i++) {
    const randomDays = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - randomDays);
    
    expenses.push({
      id: `expense-${i}`,
      title: titles[i % titles.length],
      amount: Math.floor(Math.random() * 10000) + 100,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      date,
      description: 'Sample expense description',
    });
  }
  
  return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const ExpensesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expenses] = useState<Expense[]>(generateSampleExpenses());

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    const query = searchQuery.toLowerCase();
    return expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
    );
  }, [expenses, searchQuery]);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const handleExpensePress = (expense: Expense) => {
    console.log('Expense pressed:', expense.title);
  };

  const handleAddExpense = () => {
    console.log('Add expense pressed');
  };

  const handleViewInsights = () => {
    console.log('View insights pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderExpense = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} onPress={() => handleExpensePress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No expenses found</Text>
      <Text style={styles.emptySubtext}>Tap + to add your first expense</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses</Text>
        <Text style={styles.totalValue}>Rs {totalExpense.toLocaleString()}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.insightsButton} 
        onPress={handleViewInsights}
        accessibilityLabel="View expense insights"
        accessibilityRole="button"
      >
        <Ionicons name="bar-chart-outline" size={20} color={COLORS.white} />
        <Text style={styles.insightsText}>View Insights</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Expenses" 
        subtitle={currentDate} 
        count={filteredExpenses.length}
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search expense"
        onFilterPress={handleFilter}
      />

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />

      <FAB onPress={handleAddExpense} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  totalCard: {
    backgroundColor: COLORS.cardPurple,
    padding: SIZES.padding + 4,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  totalLabel: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: SIZES.radius,
    gap: 8,
    ...SHADOWS.light,
  },
  insightsText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.white,
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
    color: COLORS.gray500,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray400,
  },
});

export default ExpensesScreen;
