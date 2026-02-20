import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Goal {
  id: string;
  title: string;
  icon: string;
  target: number;
  unit: string;
  category: 'popular' | 'new';
}

interface DailyProgress {
  [goalId: string]: number;
}

interface WeeklyData {
  [date: string]: DailyProgress;
}

interface GoalContextType {
  goals: Goal[];
  todayProgress: DailyProgress;
  weeklyData: WeeklyData;
  updateProgress: (goalId: string, value: number) => void;
  incrementProgress: (goalId: string, amount: number) => void;
  getWeeklyAverage: (goalId: string) => number;
  getProgressPercentage: (goalId: string) => number;
  addGoal: (goal: Goal) => void;
  undoLastAction: () => boolean;
  getStreak: (goalId: string) => number;
  getBadges: () => string[];
  lastAction: { goalId: string; previousValue: number } | null;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

const defaultGoals: Goal[] = [
  { id: 'water', title: 'Drink Water', icon: '💧', target: 3, unit: 'liters', category: 'popular' },
  { id: 'study', title: 'Study', icon: '📚', target: 60, unit: 'minutes', category: 'popular' },
  { id: 'savings', title: 'Savings', icon: '💰', target: 5000, unit: 'TSH', category: 'new' },
  { id: 'running', title: 'Running', icon: '🏃', target: 30, unit: 'minutes', category: 'new' },
  { id: 'exercise', title: 'Exercise', icon: '💪', target: 30, unit: 'minutes', category: 'new' },
];

const STORAGE_KEY = '@goal_data';

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({});
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});
  const [lastAction, setLastAction] = useState<{ goalId: string; previousValue: number } | null>(null);

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [todayProgress, weeklyData]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setWeeklyData(data.weeklyData || {});
        const today = getTodayDate();
        setTodayProgress(data.weeklyData?.[today] || {});
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      const today = getTodayDate();
      const updatedWeeklyData = { ...weeklyData, [today]: todayProgress };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ weeklyData: updatedWeeklyData }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateProgress = (goalId: string, value: number) => {
    const previousValue = todayProgress[goalId] || 0;
    setLastAction({ goalId, previousValue });
    
    setTodayProgress(prev => ({ ...prev, [goalId]: value }));
    const today = getTodayDate();
    setWeeklyData(prev => ({ ...prev, [today]: { ...prev[today], [goalId]: value } }));
  };

  const incrementProgress = (goalId: string, amount: number) => {
    const previousValue = todayProgress[goalId] || 0;
    setLastAction({ goalId, previousValue });
    
    setTodayProgress(prev => {
      const current = prev[goalId] || 0;
      return { ...prev, [goalId]: current + amount };
    });
  };

  const undoLastAction = () => {
    if (!lastAction) return false;
    
    const { goalId, previousValue } = lastAction;
    setTodayProgress(prev => ({ ...prev, [goalId]: previousValue }));
    const today = getTodayDate();
    setWeeklyData(prev => ({ ...prev, [today]: { ...prev[today], [goalId]: previousValue } }));
    setLastAction(null);
    return true;
  };

  const getStreak = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const progress = weeklyData[dateStr]?.[goalId] || 0;
      const percentage = (progress / goal.target) * 100;
      
      if (percentage >= 100) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const getBadges = () => {
    const badges: string[] = [];
    
    // Check for various achievements
    goals.forEach(goal => {
      const streak = getStreak(goal.id);
      const percentage = getProgressPercentage(goal.id);
      
      if (streak >= 7) badges.push(`${goal.icon} 7-Day Streak`);
      if (streak >= 30) badges.push(`${goal.icon} 30-Day Champion`);
      if (percentage >= 100) badges.push(`${goal.icon} Daily Goal Master`);
    });
    
    // Check if all goals completed today
    const allGoalsComplete = goals.every(g => getProgressPercentage(g.id) >= 100);
    if (allGoalsComplete && goals.length > 0) {
      badges.push('🏆 Perfect Day');
    }
    
    // Check weekly consistency
    const last7Days = Object.keys(weeklyData).slice(-7);
    if (last7Days.length >= 7) {
      const allDaysHaveProgress = last7Days.every(date => {
        const dayData = weeklyData[date];
        return Object.keys(dayData).length > 0;
      });
      if (allDaysHaveProgress) {
        badges.push('📅 Weekly Warrior');
      }
    }
    
    return badges;
  };

  const getWeeklyAverage = (goalId: string) => {
    const last7Days = Object.keys(weeklyData).slice(-7);
    if (last7Days.length === 0) return 0;
    
    const total = last7Days.reduce((sum, date) => {
      return sum + (weeklyData[date]?.[goalId] || 0);
    }, 0);
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    return Math.min(Math.round((total / (last7Days.length * goal.target)) * 100), 100);
  };

  const getProgressPercentage = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    const current = todayProgress[goalId] || 0;
    return Math.min(Math.round((current / goal.target) * 100), 100);
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  return (
    <GoalContext.Provider value={{
      goals,
      todayProgress,
      weeklyData,
      updateProgress,
      incrementProgress,
      getWeeklyAverage,
      getProgressPercentage,
      addGoal,
      undoLastAction,
      getStreak,
      getBadges,
      lastAction,
    }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used within GoalProvider');
  }
  return context;
};
