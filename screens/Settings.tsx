import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  requestNotificationPermissions, 
  scheduleMorningGreeting, 
  scheduleGoalReminders, 
  scheduleWeeklySummary,
  cancelAllNotifications,
  sendImmediateNotification
} from '../services/notificationService';

const NOTIFICATION_STORAGE_KEY = '@notifications_enabled';

export default function Settings({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadNotificationSettings();
    // Auto-schedule notifications if enabled
    checkAndScheduleNotifications();
  }, []);

  const checkAndScheduleNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored === 'true') {
        // Re-schedule notifications on app start if they were enabled
        await scheduleMorningGreeting(user?.name || 'User');
        await scheduleGoalReminders();
        await scheduleWeeklySummary();
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored !== null) {
        setNotificationsEnabled(stored === 'true');
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const handleRateApp = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.selfcare.app';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open Play Store. Please rate us manually in the Play Store.');
    });
  };

  const handleFeedback = () => {
    const email = 'feedback@selfcareapp.com';
    const subject = 'Feedback for Self-Care App';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open email client.');
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: () => {
            logout();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            );
          }
        },
      ]
    );
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Turning ON notifications
      const hasPermission = await requestNotificationPermissions();
      
      if (hasPermission) {
        // Schedule all notifications first
        await scheduleMorningGreeting(user?.name || 'User');
        await scheduleGoalReminders();
        await scheduleWeeklySummary();
        
        // Then update state and storage
        setNotificationsEnabled(true);
        await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
        
        // Send test notification
        await sendImmediateNotification(
          '✅ Notifications Enabled!',
          'You\'ll receive daily reminders like water, sleep, and study reminders to help you reach your goals.'
        );
        
        Alert.alert(
          'Success', 
          'Notifications enabled! You\'ll receive daily reminders.\n\nIMPORTANT: If notifications don\'t work, go to your phone Settings > Apps > Self-care > Battery and disable battery optimization.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive reminders.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } else {
      // Turning OFF notifications
      setNotificationsEnabled(false);
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false');
      await cancelAllNotifications();
      Alert.alert('Notifications Disabled', 'You won\'t receive any more reminders.');
    }
  };

  const settingsItems = [
    {
      title: 'Push Notifications',
      type: 'switch',
      value: notificationsEnabled,
      onPress: toggleNotifications,
    },
    {
      title: 'View Tutorial',
      type: 'arrow',
      onPress: () => {
        navigation.navigate('Onboarding');
      },
    },
    {
      title: 'App Info',
      type: 'arrow',
      onPress: () => Alert.alert('App Info', 'Self-Care is a modern Android app designed to help you maintain your well-being. Features include daily activities, journaling, and personalized self-care tips. Developed by Ibrahim Mwegero.'),
    },
  ];

  const renderItem = (item: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
      <Text style={styles.settingText}>{item.title}</Text>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#ccc', true: '#FFB6C1' }}
          thumbColor={item.value ? '#FFB6C1' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#000" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Settings</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Logged in as: {user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}

      {settingsItems.map((item, index) => (
        <View key={index}>
          {renderItem(item)}
        </View>
      ))}

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button} onPress={handleRateApp}>
          <Ionicons name="star" size={20} color="#000" />
          <Text style={styles.buttonText}>Rate Our App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFeedback}>
          <Ionicons name="mail" size={20} color="#000" />
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D8F0',
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  buttonSection: {
    marginTop: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  userInfo: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#333',
  },
});