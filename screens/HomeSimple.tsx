import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';

const quotes = [
  "Every day is a new beginning.",
  "Believe in yourself.",
  "Small progress is still progress.",
  "You are stronger than you think.",
  "Make today count.",
];

export default function Home({ navigation }: any) {
  const { goals, incrementProgress } = useGoals();
  const { user } = useAuth();

  const popularGoals = goals.filter(g => g.category === 'popular');
  const newGoals = goals.filter(g => g.category === 'new');

  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  const handleQuickAdd = (goalId: string, amount: number) => {
    try {
      incrementProgress(goalId, amount);
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>📱</Text>
        </View>
        <Text style={styles.greeting}>Hello, <Text style={styles.name}>{user?.name || 'User'}</Text></Text>
        <Text style={styles.subtitle}>Start improving your life.</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💭</Text>
        <Text style={styles.quoteText}>{dailyQuote}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Goals</Text>
        <View style={styles.goalsRow}>
          {popularGoals.slice(0, 2).map(goal => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{goal.icon}</Text>
              </View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <TouchableOpacity 
                style={styles.quickAddButton}
                onPress={() => handleQuickAdd(goal.id, goal.id === 'water' ? 0.5 : 15)}
              >
                <Text style={styles.quickAddText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Goals</Text>
        <View style={styles.goalsRow}>
          {newGoals.slice(0, 2).map(goal => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{goal.icon}</Text>
              </View>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <TouchableOpacity 
                style={styles.quickAddButton}
                onPress={() => handleQuickAdd(goal.id, 10)}
              >
                <Text style={styles.quickAddText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#B8D8F0',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  illustrationContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  illustration: {
    fontSize: 120,
  },
  greeting: {
    fontSize: 28,
    color: '#666',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quoteCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  quickAddButton: {
    backgroundColor: '#B8D8F0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  quickAddText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
