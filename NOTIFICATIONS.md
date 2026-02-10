# Notification Features

## Overview
The Self-Care app now includes smart notifications to help you stay on track with your daily goals.

## Features

### 1. Morning Greeting
- **Time**: 8:00 AM daily
- **Message**: Personalized greeting with your name
- **Purpose**: Start your day motivated

### 2. Goal Reminders

#### Water Reminders (3 times daily)
- 10:00 AM - "Stay Hydrated!"
- 2:00 PM - "Hydration Check!"
- 6:00 PM - "Evening Hydration"

#### Study Reminder
- 3:00 PM - "Study Time!"

#### Running Reminder
- 6:00 AM - "Morning Run!"

#### Exercise Reminder
- 5:00 PM - "Exercise Time!"

## How to Enable

1. Open the app and go to **Settings**
2. Toggle **Push Notifications** ON
3. Grant permission when Android asks
4. You'll receive a test notification confirming it's working

## How to Disable

1. Go to **Settings**
2. Toggle **Push Notifications** OFF
3. All scheduled notifications will be canceled

## Android Permissions

The app requests the following permissions:
- `POST_NOTIFICATIONS` - To send notifications (Android 13+)
- `RECEIVE_BOOT_COMPLETED` - To restore notifications after device restart
- `VIBRATE` - To vibrate on notification

## Testing

After enabling notifications, you'll immediately receive a test notification. The scheduled notifications will appear at their designated times.

## Building for Production

When building the app with EAS Build, notifications will work automatically. Make sure to:

```bash
eas build --platform android
```

The notification configuration is already set in `app.json`.
