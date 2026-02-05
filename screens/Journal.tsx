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
      Alert.alert('Saved', 'Your journal entry has been saved.');
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save journal entry.');
    }
  };

  const handleSave = () => {
    saveJournal(text);
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearJournal}>
          <Text style={styles.clearText}>Clear Journal</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  clearText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});