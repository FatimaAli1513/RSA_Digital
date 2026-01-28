import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import KhataScreen from './src/screens/KhataScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import AllActivitiesScreen from './src/screens/AllActivitiesScreen';

// Types
export type RootStackParamList = {
  Home: undefined;
  Notes: undefined;
  Khata: undefined;
  Expenses: undefined;
  AllActivities: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main App Component
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Notes" component={NotesScreen} />
          <Stack.Screen name="Khata" component={KhataScreen} />
          <Stack.Screen name="Expenses" component={ExpensesScreen} />
          <Stack.Screen name="AllActivities" component={AllActivitiesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
