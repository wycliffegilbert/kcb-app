import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/theme';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import SavingsScreen from '../screens/SavingsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TransferScreen from '../screens/TransferScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Transfer" component={TransferScreen} />
    </HomeStack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Transactions: focused ? 'swap-horizontal' : 'swap-horizontal-outline',
            Savings: focused ? 'wallet' : 'wallet-outline',
            Accounts: focused ? 'card' : 'card-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Savings" component={SavingsScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,107,63,0.08)',
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    shadowColor: '#006B3F',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  tabLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
});
