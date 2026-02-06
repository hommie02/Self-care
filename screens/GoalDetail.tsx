import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useGoals } from '../context/GoalContext';

export default function GoalDetail({ route, navigation }: any) {
  const { goalId } = route.params;
  const { goals, todayProgress, incrementProgress, updateProgress, getProgressPercentage } = useGoals();
  
  const goal = goals.find(g => g.id === goalId);
  const [inputValue, setInputValue] = useState('');

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text>Goal not found</Text>
      </View>
    );
  }

  const currentProgress = todayProgress[goalId] || 0;
  const percentage = getProgressPercentage(goalId);

  const handleIncrement = (amount: number) => {
    incrementProgress(goalId, amount);
  };

  const handleSetValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      updateProgress(goalId, value);
      setInputValue('');
    }
  };

  const getQuickIncrements = () => {
    switch (goalId) {
      case 'water':
        return [1, 2, 3];
      case 'exercise':
        return [10, 15, 30];
      case 'study':
        return [15, 30, 60];
      case 'savings':
        return [5, 10, 20];
      case 'weight':
        return [5, 10, 20];
      default:
        return [1, 5, 10];
    }
  };

  const quickIncrements = getQuickIncrements();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{goal.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{goal.icon}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressCircle, { borderColor: percentage >= 75 ? '#E91E63' : '#FFB6C1' }]}>
            <Text style={styles.percentage}>{percentage}%</Text>
          </View>
          <Text style={styles.progressText}>
            {currentProgress} / {goal.target} {goal.unit}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.buttonRow}>
            {quickIncrements.map((amount, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickButton}
                onPress={() => handleIncrement(amount)}
              >
                <Text style={styles.quickButtonText}>+{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.manualInput}>
          <Text style={styles.sectionTitle}>Set Value</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${goal.unit}`}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <TouchableOpacity style={styles.setButton} onPress={handleSetValue}>
              <Text style={styles.setButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.statsText}>
            {goal.target - currentProgress > 0 
              ? `${goal.target - currentProgress} ${goal.unit} to go!` 
              : 'Goal completed! 🎉'}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 50,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  percentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    fontSize: 18,
    color: '#666',
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#FFB6C1',
    paddingVertical: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  manualInput: {
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  setButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  setButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  stats: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 5,
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
