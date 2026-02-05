import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Journal() {
  const [text, setText] = useState('');

  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = async () => {
    try {
      const savedText = await AsyncStorage.getItem('dailyJournal');
      if (savedText !== null) {
        setText(savedText);
      }
    } catch (error) {
      console.error('Error loading journal:', error);
    }
  };

  const saveJournal = async (newText: string) => {
    try {
      await AsyncStorage.setItem('dailyJournal', newText);
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    saveJournal(newText);
  };

  const clearJournal = () => {
    Alert.alert(
      'Clear Journal',
      'Are you sure you want to clear your journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => {
          setText('');
          saveJournal('');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Journal</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write about your day..."
        placeholderTextColor="#666"
        value={text}
        onChangeText={handleTextChange}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearJournal}>
        <Text style={styles.clearText}>Clear Journal</Text>
      </TouchableOpacity>
    </View>
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
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});