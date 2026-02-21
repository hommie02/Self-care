import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
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
    const email = 'ibrahimmwegero@gmail.com';
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Section */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* General Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={toggleNotifications}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E0E0E0', true: '#B8D8F0' }}
              thumbColor={notificationsEnabled ? '#4A90E2' : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => navigation.navigate('Onboarding')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={22} color="#666" />
              <Text style={styles.settingText}>View Tutorial</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => Alert.alert('App Info', 'Self-Care is a modern Android app designed to help you maintain your well-being. Features include daily activities, journaling, and personalized self-care tips. Developed by IBRAHIM MWEGERO.')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#666" />
              <Text style={styles.settingText}>App Info</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={handleRateApp}>
            <View style={styles.settingLeft}>
              <Ionicons name="star-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Rate Our App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem} onPress={handleFeedback}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={22} color="#666" />
              <Text style={styles.settingText}>Send Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
              <Text style={[styles.settingText, styles.signOutText]}>Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B8D8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#999',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff6b6b',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 50,
  },
});