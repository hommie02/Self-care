import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Linking, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleRateApp = () => {
    Alert.alert('Rate App', 'This would open the app store for rating.');
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
        { text: 'Sign Out', onPress: () => Alert.alert('Signed Out', 'You have been signed out.') },
      ]
    );
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert('Notifications', notificationsEnabled ? 'Disabled' : 'Enabled');
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Choose Theme',
      'Select a theme',
      [
        { text: 'Pink Theme', onPress: () => Alert.alert('Theme', 'Switched to Pink Theme') },
        { text: 'Black Theme', onPress: () => Alert.alert('Theme', 'Switched to Black Theme') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const settingsItems = [
    {
      title: 'Push Notifications',
      type: 'switch',
      value: notificationsEnabled,
      onPress: toggleNotifications,
    },
    {
      title: 'Themes',
      type: 'arrow',
      onPress: handleThemeChange,
    },
    {
      title: 'App Info',
      type: 'arrow',
      onPress: () => Alert.alert('App Info', 'Liz\'s Self-Care is a soft, modern Android app designed to help you maintain your well-being. Features include daily activities, journaling, and personalized self-care tips with a calming pink theme.'),
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

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
          <Ionicons name="log-out" size={20} color="#000" />
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
    color: '#000',
    fontSize: 16,
    marginLeft: 10,
  },
});