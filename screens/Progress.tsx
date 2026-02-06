import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ProgressCardProps {
  percentage: number;
  title: string;
  subtitle?: string;
}

const ProgressCard = ({ percentage, title, subtitle }: ProgressCardProps) => {
  const getColor = () => {
    if (percentage >= 75) return '#E91E63';
    if (percentage >= 50) return '#FF6B9D';
    return '#FFB6C1';
  };

  return (
    <TouchableOpacity style={styles.progressCard}>
      <View style={styles.progressContent}>
        <View style={[styles.progressCircle, { borderColor: getColor() }]}>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>{title}</Text>
          {subtitle && <Text style={styles.progressSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function Progress() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How do you feel today?</Text>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextIcon}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Weekly <Text style={styles.titleBold}>Progress</Text>
        </Text>

        <ProgressCard percentage={75} title="Drink Water" />
        <ProgressCard percentage={50} title="Exercise" subtitle="Last week: 60%" />
        <ProgressCard percentage={82} title="Study" subtitle="Last week: 80%" />
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
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: '#333',
  },
  headerTitle: {
    fontSize: 16,
    color: '#999',
  },
  nextButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextIcon: {
    fontSize: 30,
    color: '#333',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#666',
    marginBottom: 30,
  },
  titleBold: {
    fontWeight: 'bold',
    color: '#000',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  arrow: {
    fontSize: 24,
    color: '#DDD',
  },
});
