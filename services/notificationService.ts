import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when app is in foreground
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.log('Notification handler setup failed:', error);
}

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
        channelId: 'default',
      },
    });
    console.log('Morning greeting scheduled successfully');
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

    // Water reminder - 8 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Stay Hydrated!',
        body: 'Remember to drink water. Your body needs it!',
        data: { type: 'goal-reminder', goal: 'water' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    // Water reminder - 7 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Evening Hydration',
        body: 'Don\'t forget your water intake!',
        data: { type: 'goal-reminder', goal: 'water' },
      },
      trigger: {
        hour: 19,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    // Study reminder - 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Study Time!',
        body: 'Time to focus on your studies. You got this!',
        data: { type: 'goal-reminder', goal: 'study' },
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    // To-Do List reminder - 9 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📝 Check Your To-Do List',
        body: 'Review your tasks for today and stay organized!',
        data: { type: 'goal-reminder', goal: 'todo' },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    // Bedtime reminder - 10 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '😴 Time for Bed',
        body: 'Good sleep is essential for your health. Consider winding down now.',
        data: { type: 'goal-reminder', goal: 'sleep' },
      },
      trigger: {
        hour: 22,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    // Wake up reminder - 6 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Good Morning!',
        body: 'Time to wake up and start your day fresh!',
        data: { type: 'goal-reminder', goal: 'wakeup' },
      },
      trigger: {
        hour: 6,
        minute: 0,
        repeats: true,
        channelId: 'default',
      },
    });

    console.log('Goal reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling goal reminders:', error);
  }
};

export const scheduleWeeklySummary = async () => {
  try {
    // Weekly summary disabled for now due to trigger compatibility issues
    console.log('Weekly summary notifications are currently disabled');
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

export const getAllScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};
