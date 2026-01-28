export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface ExpenseCategory {
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  AddNote: { note?: Note } | undefined;
  AddCustomer: { customer?: Customer } | undefined;
  CustomerDetail: { customer: Customer };
  AddExpense: { expense?: Expense } | undefined;
  ExpenseInsights: undefined;
};

export type TabParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
  Profile: undefined;
};
