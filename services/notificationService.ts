import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFB6C1',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleMorningGreeting = async (userName: string) => {
  try {
    // Cancel existing morning greeting
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of existingNotifications) {
      if (notification.content.data?.type === 'morning-greeting') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // Schedule new morning greeting at 8 AM daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good Morning!',
        body: `Hello ${userName}! Ready to crush your goals today?`,
        data: { type: 'morning-greeting' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling morning greeting:', error);
  }
};

export const scheduleGoalReminders = async () => {
  try {
    // Cancel existing goal reminders
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of existingNotifications) {
      if (notification.content.data?.type === 'goal-reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // Water reminder - 10 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Stay Hydrated!',
        body: 'Remember to drink water. Your body needs it!',
        data: { type: 'goal-reminder', goal: 'water' },
      },
      trigger: {
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });

    // Water reminder - 2 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hydration Check!',
        body: 'Have you had enough water today?',
        data: { type: 'goal-reminder', goal: 'water' },
      },
      trigger: {
        hour: 14,
        minute: 0,
        repeats: true,
      },
    });

    // Water reminder - 6 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Evening Hydration',
        body: 'Don\'t forget your water intake!',
        data: { type: 'goal-reminder', goal: 'water' },
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });

    // Study reminder - 3 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Study Time!',
        body: 'Time to focus on your studies. You got this!',
        data: { type: 'goal-reminder', goal: 'study' },
      },
      trigger: {
        hour: 15,
        minute: 0,
        repeats: true,
      },
    });

    // Running reminder - 6 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏃 Morning Run!',
        body: 'Perfect time for a morning run. Let\'s go!',
        data: { type: 'goal-reminder', goal: 'running' },
      },
      trigger: {
        hour: 6,
        minute: 0,
        repeats: true,
      },
    });

    // Exercise reminder - 5 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 Exercise Time!',
        body: 'Time to get moving! Your body will thank you.',
        data: { type: 'goal-reminder', goal: 'exercise' },
      },
      trigger: {
        hour: 17,
        minute: 0,
        repeats: true,
      },
    });

  } catch (error) {
    console.error('Error scheduling goal reminders:', error);
  }
};

export const scheduleWeeklySummary = async () => {
  try {
    // Cancel existing weekly summary
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of existingNotifications) {
      if (notification.content.data?.type === 'weekly-summary') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // Weekly summary - Every Sunday at 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Summary',
        body: 'Check out your progress this week! See how you did and plan for next week.',
        data: { type: 'weekly-summary' },
      },
      trigger: {
        weekday: 1, // Sunday (1 = Sunday, 2 = Monday, etc.)
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });

  } catch (error) {
    console.error('Error scheduling weekly summary:', error);
  }
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

export const sendImmediateNotification = async (title: string, body: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending immediate notification:', error);
  }
};
