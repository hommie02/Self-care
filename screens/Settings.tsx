import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('pink');

  const handleRateApp = () => {
    // Placeholder for rating - would link to app store
    Alert.alert('Rate App', 'This would open the app store for rating.');
  };

  const handleFeedback = () => {
    // Open email client for feedback
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
        { text: 'Sign Out', onPress: () => Alert.alert('Signed Out', 'You have been signed out.') },
      ]
    );
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert('Notifications', notificationsEnabled ? 'Disabled' : 'Enabled');
  };

  const changeTheme = (theme: string) => {
    setSelectedTheme(theme);
    Alert.alert('Theme Changed', `Switched to ${theme} theme`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#ccc', true: '#fff' }}
            thumbColor={notificationsEnabled ? '#FFB6C1' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Themes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Themes</Text>
        <View style={styles.themeButtons}>
          <TouchableOpacity
            style={[styles.themeButton, selectedTheme === 'pink' && styles.selectedTheme]}
            onPress={() => changeTheme('pink')}
          >
            <Text style={styles.themeText}>Pink Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, selectedTheme === 'black' && styles.selectedTheme]}
            onPress={() => changeTheme('black')}
          >
            <Text style={styles.themeText}>Black Theme</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <Text style={styles.infoText}>
          Liz's Self-Care is a soft, modern Android app designed to help you maintain your well-being.
          Features include daily activities, journaling, and personalized self-care tips with a calming pink theme.
        </Text>
      </View>

      {/* Rate App */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleRateApp}>
          <Ionicons name="star" size={20} color="#FFB6C1" />
          <Text style={styles.buttonText}>Rate Our App</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleFeedback}>
          <Ionicons name="mail" size={20} color="#FFB6C1" />
          <Text style={styles.buttonText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
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
    backgroundColor: '#FFB6C1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  themeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedTheme: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  themeText: {
    color: '#fff',
    fontSize: 16,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
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
    marginLeft: 10,
  },
});