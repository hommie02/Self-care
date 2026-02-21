import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '../context/GoalContext';

interface ProgressCardProps {
  goalId: string;
  percentage: number;
  title: string;
}

interface DayProgressProps {
  day: string;
  date: number;
  isToday: boolean;
  completionRate: number;
}

const DayProgress = ({ day, date, isToday, completionRate }: DayProgressProps) => {
  const getColor = () => {
    if (completionRate >= 75) return '#4CAF50';
    if (completionRate >= 50) return '#FFC107';
    if (completionRate > 0) return '#FF9800';
    return '#E0E0E0';
  };

  return (
    <View style={styles.dayContainer}>
      <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
      <View style={[styles.dayCircle, { backgroundColor: getColor() }, isToday && styles.todayCircle]}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      {completionRate > 0 && (
        <Text style={styles.completionText}>{Math.round(completionRate)}%</Text>
      )}
    </View>
  );
};

const ProgressCard = ({ goalId, percentage, title }: ProgressCardProps) => {
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
          <Text style={styles.progressSubtitle}>Today's Progress</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function Progress() {
  const { goals, getProgressPercentage, weeklyData, todayProgress } = useGoals();

  const trackedGoals = goals.filter(g => 
    ['water', 'study'].includes(g.id)
  );

  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate completion rate for this day
      const dayData = weeklyData[dateStr] || {};
      let totalCompletion = 0;
      let goalCount = 0;
      
      trackedGoals.forEach(goal => {
        const progress = dayData[goal.id] || 0;
        const percentage = Math.min((progress / goal.target) * 100, 100);
        totalCompletion += percentage;
        goalCount++;
      });
      
      const avgCompletion = goalCount > 0 ? totalCompletion / goalCount : 0;
      
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1),
        date: date.getDate(),
        isToday: i === 0,
        completionRate: avgCompletion,
        dateStr,
      });
    }
    
    return days;
  };

  const weekDays = getLast7Days();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weekly Progress</Text>
      </View>

      <View style={styles.content}>
        {/* Weekly Overview Card */}
        <View style={styles.weeklyOverviewCard}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>This Week</Text>
          </View>
          
          {/* Bar Graph */}
          <View style={styles.barGraphContainer}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${Math.min(day.completionRate, 100)}%`,
                        backgroundColor: day.completionRate >= 75 ? '#4CAF50' : 
                                       day.completionRate >= 50 ? '#FFC107' : 
                                       day.completionRate > 0 ? '#FF9800' : '#E0E0E0'
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.barDay, day.isToday && styles.barDayToday]}>
                  {day.day}
                </Text>
                <Text style={styles.barDate}>{day.date}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.weeklySubtext}>
            Keep tracking your daily progress!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Goal Breakdown</Text>

        {trackedGoals.map(goal => (
          <ProgressCard
            key={goal.id}
            goalId={goal.id}
            percentage={getProgressPercentage(goal.id)}
            title={goal.title}
          />
        ))}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  weeklyOverviewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  barGraphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  barWrapper: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderRadius: 8,
    minHeight: 4,
  },
  barDay: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  barDayToday: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  barDate: {
    fontSize: 10,
    color: '#CCC',
    marginTop: 2,
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  todayText: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: '#E91E63',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  completionText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  weeklySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
});
