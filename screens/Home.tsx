import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';

interface GoalCardProps {
  goalId: string;
  icon: string;
  title: string;
  category: 'popular' | 'new';
  onPress: () => void;
}

const GoalCard = ({ goalId, icon, title, category, onPress }: GoalCardProps) => (
  <TouchableOpacity style={styles.goalCard} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={styles.goalTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function Home({ navigation }: any) {
  const { goals } = useGoals();
  const { user } = useAuth();

  const popularGoals = goals.filter(g => g.category === 'popular');
  const newGoals = goals.filter(g => g.category === 'new');

  const handleGoalPress = (goalId: string) => {
    navigation.navigate('GoalDetail', { goalId });
  };

  const userName = user?.name || 'Liz';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>📱</Text>
        </View>
        <Text style={styles.greeting}>Hello, <Text style={styles.name}>{userName}</Text></Text>
        <Text style={styles.subtitle}>Start improving your life.</Text>
        <Text style={styles.chooseText}>choose your goals!</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goalsRow}>
          {popularGoals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              icon={goal.icon}
              title={goal.title}
              category={goal.category}
              onPress={() => handleGoalPress(goal.id)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goalsRow}>
          {newGoals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              icon={goal.icon}
              title={goal.title}
              category={goal.category}
              onPress={() => handleGoalPress(goal.id)}
            />
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
    fontSize: 60,
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
    marginBottom: 15,
  },
  chooseText: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#999',
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  },
});