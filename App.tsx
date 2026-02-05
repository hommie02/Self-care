import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Home from './screens/Home';
import Activities from './screens/Activities';
import Journal from './screens/Journal';
import Settings from './screens/Settings';
import CurvedTabBar from './components/CurvedTabBar';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#FFB6C1" />
      <Tab.Navigator
        tabBar={(props) => <CurvedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Activities" component={Activities} />
        <Tab.Screen name="Journal" component={Journal} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
