import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Customer, Expense } from '../types';

const STORAGE_KEYS = {
  NOTES: '@rsa_digital_notes',
  CUSTOMERS: '@rsa_digital_customers',
  EXPENSES: '@rsa_digital_expenses',
};

// ============== NOTES ==============
export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, jsonValue);
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    if (jsonValue) {
      const notes = JSON.parse(jsonValue);
      return notes.map((note: Note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const notes = await getNotes();
  const newNote: Note = {
    ...note,
    id: `note-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  notes.unshift(newNote);
  await saveNotes(notes);
  return newNote;
};

export const deleteNote = async (id: string): Promise<void> => {
  const notes = await getNotes();
  const filteredNotes = notes.filter((note) => note.id !== id);
  await saveNotes(filteredNotes);
};

// ============== CUSTOMERS ==============
export const saveCustomers = async (customers: Customer[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(customers);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, jsonValue);
  } catch (error) {
    console.error('Error saving customers:', error);
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (jsonValue) {
      const customers = JSON.parse(jsonValue);
      return customers.map((customer: Customer) => ({
        ...customer,
        createdAt: new Date(customer.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting customers:', error);
    return [];
  }
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'transactions' | 'createdAt'>): Promise<Customer> => {
  const customers = await getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: `customer-${Date.now()}`,
    transactions: [],
    createdAt: new Date(),
  };
  customers.unshift(newCustomer);
  await saveCustomers(customers);
  return newCustomer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const customers = await getCustomers();
  const filteredCustomers = customers.filter((customer) => customer.id !== id);
  await saveCustomers(filteredCustomers);
};

// ============== EXPENSES ==============
export const saveExpenses = async (expenses: Expense[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(expenses);
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, jsonValue);
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (jsonValue) {
      const expenses = JSON.parse(jsonValue);
      return expenses.map((expense: Expense) => ({
        ...expense,
        date: new Date(expense.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const addExpense = async (expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> => {
  const expenses = await getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: `expense-${Date.now()}`,
    date: new Date(),
  };
  expenses.unshift(newExpense);
  await saveExpenses(expenses);
  return newExpense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const expenses = await getExpenses();
  const filteredExpenses = expenses.filter((expense) => expense.id !== id);
  await saveExpenses(filteredExpenses);
};

// ============== CLEAR ALL ==============
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.NOTES,
      STORAGE_KEYS.CUSTOMERS,
      STORAGE_KEYS.EXPENSES,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
