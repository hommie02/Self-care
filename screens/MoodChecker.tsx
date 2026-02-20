import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOOD_STORAGE_KEY = '@daily_mood';

export default function MoodChecker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodMessage, setMoodMessage] = useState('');
  const [todayMood, setTodayMood] = useState<string | null>(null);

  useEffect(() => {
    loadTodayMood();
  }, []);

  const loadTodayMood = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
      if (stored) {
        const moodData = JSON.parse(stored);
        if (moodData.date === today) {
          setTodayMood(moodData.mood);
        }
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  const saveMood = async (mood: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify({ date: today, mood }));
      setTodayMood(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const getMoodResponse = (mood: string) => {
    const responses: { [key: string]: { message: string; suggestion: string } } = {
      '😊': {
        message: "That's wonderful! Your positive energy is contagious!",
        suggestion: "Keep this momentum going! Maybe share your happiness with someone today."
      },
      '😄': {
        message: "Amazing! You're radiating joy today!",
        suggestion: "This is a great day to tackle your goals. You've got the energy!"
      },
      '😐': {
        message: "It's okay to have neutral days. Every day doesn't have to be perfect.",
        suggestion: "Try doing something small that usually makes you smile. Maybe a short walk or your favorite music?"
      },
      '😔': {
        message: "I'm sorry you're feeling down. Remember, this feeling is temporary.",
        suggestion: "Be gentle with yourself today. Maybe try some light exercise or talk to someone you trust. You're not alone."
      },
      '😢': {
        message: "It's okay to not be okay. Your feelings are valid.",
        suggestion: "Take it easy today. Do something comforting - watch something you love, rest, or reach out to a friend. Tomorrow is a new day."
      },
      '😴': {
        message: "Feeling tired? Rest is just as important as being productive.",
        suggestion: "Listen to your body. Maybe take a short nap, go to bed early tonight, or just take things slower today."
      },
      '😤': {
        message: "Feeling frustrated is normal. Take a deep breath.",
        suggestion: "Channel that energy into something productive. Exercise can help release tension. Or take a break and come back refreshed."
      },
    };
    return responses[mood] || responses['😐'];
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const response = getMoodResponse(mood);
    setMoodMessage(`${response.message}\n\n💡 ${response.suggestion}`);
    saveMood(mood);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Share your mood and get personalized support</Text>
      </View>

      <View style={styles.content}>
        {todayMood && !selectedMood && (
          <View style={styles.currentMoodCard}>
            <Text style={styles.currentMoodEmoji}>{todayMood}</Text>
            <Text style={styles.currentMoodText}>Your mood today</Text>
            <Text style={styles.changeMoodText}>Tap a mood below to update</Text>
          </View>
        )}

        <View style={styles.moodGrid}>
          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😊')}
          >
            <Text style={styles.moodEmoji}>😊</Text>
            <Text style={styles.moodLabel}>Happy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😄')}
          >
            <Text style={styles.moodEmoji}>😄</Text>
            <Text style={styles.moodLabel}>Excited</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😐')}
          >
            <Text style={styles.moodEmoji}>😐</Text>
            <Text style={styles.moodLabel}>Neutral</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😔')}
          >
            <Text style={styles.moodEmoji}>😔</Text>
            <Text style={styles.moodLabel}>Sad</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😢')}
          >
            <Text style={styles.moodEmoji}>😢</Text>
            <Text style={styles.moodLabel}>Crying</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😴')}
          >
            <Text style={styles.moodEmoji}>😴</Text>
            <Text style={styles.moodLabel}>Tired</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😤')}
          >
            <Text style={styles.moodEmoji}>😤</Text>
            <Text style={styles.moodLabel}>Frustrated</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moodButton}
            onPress={() => handleMoodSelect('😌')}
          >
            <Text style={styles.moodEmoji}>😌</Text>
            <Text style={styles.moodLabel}>Calm</Text>
          </TouchableOpacity>
        </View>

        {selectedMood && moodMessage && (
          <View style={styles.responseCard}>
            <Text style={styles.responseMoodEmoji}>{selectedMood}</Text>
            <Text style={styles.responseText}>{moodMessage}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#B8D8F0',
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  currentMoodCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentMoodEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  currentMoodText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  changeMoodText: {
    fontSize: 14,
    color: '#999',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodButton: {
    width: '23%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  responseCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  responseMoodEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
});
