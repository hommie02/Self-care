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
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

const defaultGoals: Goal[] = [
  { id: 'water', title: 'Drink Water', icon: '💧', target: 3, unit: 'liters', category: 'popular' },
  { id: 'study', title: 'Study', icon: '📚', target: 60, unit: 'minutes', category: 'popular' },
  { id: 'savings', title: 'Savings', icon: '💰', target: 100, unit: 'TSH', category: 'new' },
  { id: 'running', title: 'Running', icon: '🏃', target: 30, unit: 'minutes', category: 'new' },
  { id: 'exercise', title: 'Exercise', icon: '💪', target: 30, unit: 'minutes', category: 'new' },
];

const STORAGE_KEY = '@goal_data';

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [todayProgress, setTodayProgress] = useState<DailyProgress>({});
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({});

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
    setTodayProgress(prev => ({ ...prev, [goalId]: value }));
    const today = getTodayDate();
    setWeeklyData(prev => ({ ...prev, [today]: { ...prev[today], [goalId]: value } }));
  };

  const incrementProgress = (goalId: string, amount: number) => {
    setTodayProgress(prev => {
      const current = prev[goalId] || 0;
      return { ...prev, [goalId]: current + amount };
    });
  };

  const getWeeklyAverage = (goalId: string) => {
    const last7Days = Object.keys(weeklyData).slice(-7);
    if (last7Days.length === 0) return 0;
    
    const total = last7Days.reduce((sum, date) => {
      return sum + (weeklyData[date]?.[goalId] || 0);
    }, 0);
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    return Math.round((total / (last7Days.length * goal.target)) * 100);
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
