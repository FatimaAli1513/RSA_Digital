import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, SearchBar, CustomerCard, FAB } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { Customer } from '../types';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Generate sample customers
const generateSampleCustomers = (): Customer[] => {
  const names = [
    'Ahmed Khan', 'Muhammad Ali', 'Fatima Hassan', 'Zainab Malik',
    'Usman Rashid', 'Ayesha Siddiqui', 'Hassan Ahmed', 'Sara Khan',
    'Bilal Hussain', 'Amina Sheikh', 'Omar Farooq', 'Hira Nawaz',
    'Imran Qureshi', 'Sana Iqbal', 'Kamran Aslam', 'Maryam Bukhari',
  ];
  
  const customers: Customer[] = [];
  for (let i = 0; i < 100; i++) {
    const balance = Math.floor(Math.random() * 100000) - 50000;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    customers.push({
      id: `customer-${i}`,
      name: names[i % names.length],
      phone: `03${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
      balance,
      transactions: [],
      createdAt: date,
    });
  }
  
  return customers.sort((a, b) => a.name.localeCompare(b.name));
};

const KhataScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState<Customer[]>(generateSampleCustomers());

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query)
    );
  }, [customers, searchQuery]);

  const totalToReceive = useMemo(() => {
    return customers
      .filter((c) => c.balance > 0)
      .reduce((sum, c) => sum + c.balance, 0);
  }, [customers]);

  const totalToPay = useMemo(() => {
    return customers
      .filter((c) => c.balance < 0)
      .reduce((sum, c) => sum + Math.abs(c.balance), 0);
  }, [customers]);

  const handleCustomerPress = (customer: Customer) => {
    console.log('Customer pressed:', customer.name);
  };

  const handleAddCustomer = () => {
    console.log('Add customer pressed');
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <CustomerCard customer={item} onPress={() => handleCustomerPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No customers found</Text>
      <Text style={styles.emptySubtext}>Tap + to add your first customer</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.summaryContainer}>
      <View style={[styles.summaryCard, { backgroundColor: '#D1FAE5' }]}>
        <Text style={[styles.summaryLabel, { color: COLORS.success }]}>To Receive</Text>
        <Text style={[styles.summaryValue, { color: COLORS.success }]}>
          Rs {totalToReceive.toLocaleString()}
        </Text>
      </View>
      <View style={styles.summaryGap} />
      <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2' }]}>
        <Text style={[styles.summaryLabel, { color: COLORS.error }]}>To Pay</Text>
        <Text style={[styles.summaryValue, { color: COLORS.error }]}>
          Rs {totalToPay.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Khata" 
        subtitle={currentDate} 
        count={filteredCustomers.length}
        showBack={true}
        onBackPress={handleBackPress}
      />
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search customer"
        onFilterPress={handleFilter}
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />

      <FAB onPress={handleAddCustomer} />
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
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  summaryGap: {
    width: 12,
  },
  summaryLabel: {
    fontSize: SIZES.body,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
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

export default KhataScreen;
