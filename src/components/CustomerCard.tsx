import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Customer } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));
};

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onPress }) => {
  const isCredit = customer.balance >= 0;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Customer: ${customer.name}`}
      accessibilityRole="button"
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {customer.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{customer.name}</Text>
        <Text style={styles.phone}>{customer.phone}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, { color: isCredit ? COLORS.success : COLORS.error }]}>
          {formatCurrency(customer.balance)}
        </Text>
        <Text style={[styles.balanceLabel, { color: isCredit ? COLORS.success : COLORS.error }]}>
          {isCredit ? 'To Receive' : 'To Pay'}
        </Text>
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
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  phone: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
  },
  balanceLabel: {
    fontSize: SIZES.small,
    marginTop: 2,
  },
});

export default CustomerCard;
