import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, SearchBar, CustomerCard, FAB, AddCustomerModal } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { Customer } from '../types';
import { getCustomers, addCustomer } from '../utils/storage';

type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const KhataScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    const storedCustomers = await getCustomers();
    setCustomers(storedCustomers);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [loadCustomers])
  );

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
    setIsModalVisible(true);
  };

  const handleSaveCustomer = async (name: string, phone: string, balance: number) => {
    const newCustomer = await addCustomer({ name, phone, balance });
    setCustomers((prev) => [newCustomer, ...prev]);
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
      <View style={[styles.summaryCard, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
        <Text style={[styles.summaryLabel, { color: COLORS.success }]}>To Receive</Text>
        <Text style={[styles.summaryValue, { color: COLORS.success }]}>
          Rs {totalToReceive.toLocaleString()}
        </Text>
      </View>
      <View style={styles.summaryGap} />
      <View style={[styles.summaryCard, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
        <Text style={[styles.summaryLabel, { color: COLORS.error }]}>To Pay</Text>
        <Text style={[styles.summaryValue, { color: COLORS.error }]}>
          Rs {totalToPay.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header
          title="Khata"
          subtitle={currentDate}
          showBack={true}
          onBackPress={handleBackPress}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.cardBlue} />
        </View>
      </View>
    );
  }

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

      <AddCustomerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveCustomer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexGrow: 1,
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
    color: COLORS.white,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray300,
  },
});

export default KhataScreen;
