import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getNotes, getCustomers, getExpenses } from '../utils/storage';
import { Note, Customer, Expense } from '../types';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
  AllActivities: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'all' | 'notes' | 'customers' | 'expenses';

interface ActivityItem {
  id: string;
  type: 'note' | 'customer' | 'expense';
  title: string;
  subtitle: string;
  date: Date;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  amount?: number;
}

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

const formatCurrency = (amount: number): string => {
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
};

const AllActivitiesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [notes, setNotes] = useState<Note[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);

  const loadData = useCallback(async () => {
    const [notesData, customersData, expensesData] = await Promise.all([
      getNotes(),
      getCustomers(),
      getExpenses(),
    ]);

    setNotes(notesData);
    setCustomers(customersData);
    setExpenses(expensesData);

    // Create combined activities list
    const activities: ActivityItem[] = [];

    notesData.forEach((note: Note) => {
      activities.push({
        id: note.id,
        type: 'note',
        title: note.title,
        subtitle: note.description || 'No description',
        date: new Date(note.updatedAt),
        icon: 'document-text-outline',
        color: COLORS.cardPurple,
      });
    });

    customersData.forEach((customer: Customer) => {
      activities.push({
        id: customer.id,
        type: 'customer',
        title: customer.name,
        subtitle: customer.phone || 'No phone',
        date: new Date(customer.createdAt),
        icon: 'person-outline',
        color: COLORS.cardPink,
        amount: customer.balance,
      });
    });

    expensesData.forEach((expense: Expense) => {
      activities.push({
        id: expense.id,
        type: 'expense',
        title: expense.title,
        subtitle: expense.category || 'General',
        date: new Date(expense.date),
        icon: 'wallet-outline',
        color: COLORS.cardOrange,
        amount: expense.amount,
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    setAllActivities(activities);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleActivityPress = (activity: ActivityItem) => {
    if (activity.type === 'note') {
      navigation.navigate('Notes');
    } else if (activity.type === 'customer') {
      navigation.navigate('Khata');
    } else if (activity.type === 'expense') {
      navigation.navigate('Expenses');
    }
  };

  const getFilteredData = (): ActivityItem[] => {
    switch (activeTab) {
      case 'notes':
        return allActivities.filter((item) => item.type === 'note');
      case 'customers':
        return allActivities.filter((item) => item.type === 'customer');
      case 'expenses':
        return allActivities.filter((item) => item.type === 'expense');
      default:
        return allActivities;
    }
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: allActivities.length },
    { key: 'notes', label: 'Notes', count: notes.length },
    { key: 'customers', label: 'Customers', count: customers.length },
    { key: 'expenses', label: 'Expenses', count: expenses.length },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBalance = customers.reduce((sum, cust) => sum + cust.balance, 0);

  const renderActivityItem = ({ item }: { item: ActivityItem }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => handleActivityPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.type}: ${item.title}`}
    >
      <View style={[styles.activityIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.activitySubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        <Text style={styles.activityDate}>{formatDate(item.date)}</Text>
      </View>
      {item.amount !== undefined && (
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              {
                color:
                  item.type === 'expense'
                    ? COLORS.cardRed
                    : item.amount >= 0
                    ? COLORS.cardGreen
                    : COLORS.cardRed,
              },
            ]}
          >
            {item.type === 'expense' ? '-' : item.amount >= 0 ? '+' : ''}
            {formatCurrency(item.amount)}
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="file-tray-outline" size={64} color={COLORS.gray500} />
      <Text style={styles.emptyTitle}>No Data Found</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'all'
          ? 'Start by adding notes, customers or expenses'
          : `No ${activeTab} added yet`}
      </Text>
    </View>
  );

  const filteredData = getFilteredData();

  return (
    <View style={styles.container}>
      <Header title="All Activities" showBack onBackPress={handleBack} />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: COLORS.cardPurple + '30' }]}>
          <Ionicons name="document-text-outline" size={20} color={COLORS.cardPurple} />
          <Text style={styles.summaryValue}>{notes.length}</Text>
          <Text style={styles.summaryLabel}>Notes</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: COLORS.cardPink + '30' }]}>
          <Ionicons name="people-outline" size={20} color={COLORS.cardPink} />
          <Text style={styles.summaryValue}>{customers.length}</Text>
          <Text style={styles.summaryLabel}>Customers</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: COLORS.cardOrange + '30' }]}>
          <Ionicons name="wallet-outline" size={20} color={COLORS.cardOrange} />
          <Text style={styles.summaryValue}>{formatCurrency(totalExpenses)}</Text>
          <Text style={styles.summaryLabel}>Expenses</Text>
        </View>
      </View>

      {/* Balance Summary */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Total Customer Balance:</Text>
          <Text
            style={[
              styles.balanceValue,
              { color: totalBalance >= 0 ? COLORS.cardGreen : COLORS.cardRed },
            ]}
          >
            {totalBalance >= 0 ? '+' : ''}
            {formatCurrency(totalBalance)}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text
              style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeTab === tab.key && styles.activeTabBadge,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === tab.key && styles.activeTabBadgeText,
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      <FlatList
        data={filteredData}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  summaryValue: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray300,
    marginTop: 2,
  },
  balanceContainer: {
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: SIZES.padding,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
  },
  balanceValue: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  tabsScrollView: {
    maxHeight: 50,
    marginBottom: 8,
  },
  tabsContainer: {
    paddingHorizontal: SIZES.padding,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.cardBlue,
  },
  tabText: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: COLORS.gray600,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBadgeText: {
    fontSize: SIZES.small,
    color: COLORS.gray300,
    fontWeight: '600',
  },
  activeTabBadgeText: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
    flexGrow: 1,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    marginBottom: 10,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: SIZES.body,
    color: COLORS.gray400,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: SIZES.caption,
    color: COLORS.gray500,
  },
  amountContainer: {
    marginRight: 8,
  },
  amountText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.gray400,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: SIZES.body,
    color: COLORS.gray500,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AllActivitiesScreen;
