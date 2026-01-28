import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header, QuickActionCard, StatCard } from '../components';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample data for recent activities
const recentActivities = [
  { id: '1', type: 'note', title: 'Task List 92', time: '2 hours ago', icon: 'document-text-outline' as const, color: COLORS.cardPurple },
  { id: '2', type: 'expense', title: 'Grocery Shopping', time: '5 hours ago', icon: 'cart-outline' as const, color: COLORS.cardOrange },
  { id: '3', type: 'customer', title: 'Ahmed Khan', time: '1 day ago', icon: 'person-outline' as const, color: COLORS.cardPink },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNewNote = () => {
    navigation.navigate('AddNote');
  };

  const handleAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  const handleDailyExpenses = () => {
    navigation.navigate('AddExpense');
  };

  const handleViewProfile = () => {
    // Navigate to profile tab
  };

  const handleViewAll = () => {
    // Navigate to activities
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
              title="View Profile"
              description="Access your profile and app preferences"
              icon="person-outline"
              backgroundColor={COLORS.cardGreen}
              onPress={handleViewProfile}
            />
          </View>
        </View>

        {/* Overview Section */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <StatCard value={100} label="Notes" backgroundColor="#FCE7F3" />
          <View style={styles.statGap} />
          <StatCard value={100} label="Customers" backgroundColor="#E0E7FF" />
          <View style={styles.statGap} />
          <StatCard value={100} label="Expenses" backgroundColor="#D1FAE5" />
        </View>

        {/* Recent Activities Section */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <TouchableOpacity onPress={handleViewAll} accessibilityRole="button">
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        
        {recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
              <Ionicons name={activity.icon} size={22} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </View>
        ))}
        
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
    color: COLORS.gray800,
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
    color: COLORS.primary,
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
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
    color: COLORS.gray800,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: SIZES.caption,
    color: COLORS.gray400,
  },
  bottomPadding: {
    height: 100,
  },
});

export default HomeScreen;
