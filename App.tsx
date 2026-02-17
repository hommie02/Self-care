import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import Welcome from './screens/Welcome';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Settings from './screens/Settings';
import Progress from './screens/Progress';
import GoalDetail from './screens/GoalDetail';
import CurvedTabBar from './components/CurvedTabBar';

const ONBOARDING_KEY = '@onboarding_complete';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Progress" component={Progress} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function MainApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="GoalDetail" component={GoalDetail} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, [isAuthenticated]);

  const checkOnboarding = async () => {
    try {
      if (isAuthenticated) {
        const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!onboardingComplete) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      }
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#B8D8F0' }}>
        <ActivityIndicator size="large" color="#FFB6C1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {(props) => <Onboarding {...props} navigation={{ ...props.navigation, replace: handleOnboardingComplete }} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainApp" component={MainApp} />
        )
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="dark" backgroundColor="#B8D8F0" />
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </GoalProvider>
    </AuthProvider>
  );
}
