import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header, QuickActionCard, StatCard } from '../components';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getNotes, getCustomers, getExpenses, clearAllData } from '../utils/storage';
import { Note, Customer, Expense } from '../types';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
  AllActivities: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentActivity {
  id: string;
  type: 'note' | 'expense' | 'customer';
  title: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notesCount, setNotesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const loadData = useCallback(async () => {
    const [notes, customers, expenses] = await Promise.all([
      getNotes(),
      getCustomers(),
      getExpenses(),
    ]);

    setNotesCount(notes.length);
    setCustomersCount(customers.length);
    setExpensesCount(expenses.length);

    // Create recent activities from actual data
    const activities: RecentActivity[] = [];

    notes.slice(0, 3).forEach((note: Note) => {
      activities.push({
        id: note.id,
        type: 'note',
        title: note.title,
        time: formatTimeAgo(new Date(note.updatedAt)),
        icon: 'document-text-outline',
        color: COLORS.cardPurple,
      });
    });

    customers.slice(0, 3).forEach((customer: Customer) => {
      activities.push({
        id: customer.id,
        type: 'customer',
        title: customer.name,
        time: formatTimeAgo(new Date(customer.createdAt)),
        icon: 'person-outline',
        color: COLORS.cardPink,
      });
    });

    expenses.slice(0, 3).forEach((expense: Expense) => {
      activities.push({
        id: expense.id,
        type: 'expense',
        title: expense.title,
        time: formatTimeAgo(new Date(expense.date)),
        icon: 'wallet-outline',
        color: COLORS.cardOrange,
      });
    });

    // Sort by most recent and take top 5
    setRecentActivities(activities.slice(0, 5));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleNewNote = () => {
    navigation.navigate('Notes');
  };

  const handleAddCustomer = () => {
    navigation.navigate('Khata');
  };

  const handleDailyExpenses = () => {
    navigation.navigate('Expenses');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadData();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleViewAll = () => {
    navigation.navigate('AllActivities');
  };

  const handleActivityPress = (activity: RecentActivity) => {
    if (activity.type === 'note') {
      navigation.navigate('Notes');
    } else if (activity.type === 'customer') {
      navigation.navigate('Khata');
    } else if (activity.type === 'expense') {
      navigation.navigate('Expenses');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Home" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions Section */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <View style={styles.quickActionsRow}>
            <QuickActionCard
              title="New Note"
              description="Create and manage your notes efficiently"
              icon="document-text-outline"
              backgroundColor={COLORS.cardPurple}
              onPress={handleNewNote}
            />
            <View style={styles.gap} />
            <QuickActionCard
              title="Add Customer"
              description="Manage customer and transactions"
              icon="book-outline"
              backgroundColor={COLORS.cardPink}
              onPress={handleAddCustomer}
            />
          </View>
          <View style={styles.quickActionsRow}>
            <QuickActionCard
              title="Daily Expenses"
              description="Monitor and analyze your daily spending"
              icon="wallet-outline"
              backgroundColor={COLORS.cardBlue}
              onPress={handleDailyExpenses}
            />
            <View style={styles.gap} />
            <QuickActionCard
              title="Clear Data"
              description="Reset app and clear all stored data"
              icon="trash-outline"
              backgroundColor={COLORS.cardRed}
              onPress={handleClearData}
            />
          </View>
        </View>

        {/* Overview Section */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <StatCard value={notesCount} label="Notes" backgroundColor="rgba(147, 51, 234, 0.2)" />
          <View style={styles.statGap} />
          <StatCard value={customersCount} label="Customers" backgroundColor="rgba(59, 130, 246, 0.2)" />
          <View style={styles.statGap} />
          <StatCard value={expensesCount} label="Expenses" backgroundColor="rgba(16, 185, 129, 0.2)" />
        </View>

        {/* Recent Activities Section */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {recentActivities.length > 0 && (
            <TouchableOpacity onPress={handleViewAll} accessibilityRole="button">
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentActivities.length === 0 ? (
          <View style={styles.emptyActivities}>
            <Ionicons name="time-outline" size={48} color={COLORS.gray500} />
            <Text style={styles.emptyText}>No recent activities</Text>
            <Text style={styles.emptySubtext}>Start by adding notes, customers or expenses</Text>
          </View>
        ) : (
          recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() => handleActivityPress(activity)}
              accessibilityRole="button"
            >
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Ionicons name={activity.icon} size={22} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          ))
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  quickActionsGrid: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gap: {
    width: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
  },
  statGap: {
    width: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: SIZES.body,
    color: COLORS.cardBlue,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
  activityTime: {
    fontSize: SIZES.caption,
    color: COLORS.gray300,
  },
  emptyActivities: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: SIZES.padding,
  },
  emptyText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.gray400,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray500,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default HomeScreen;
