# Fire Alert Notification System

## Overview

The Forest Fire Predictor app now includes a comprehensive notification system that provides real-time fire alerts with sound notifications. When the ML model predicts a high or critical fire risk, the app will:

1. **Send a push notification** with detailed risk information
2. **Play an alert sound** for 10 seconds to grab attention
3. **Show a toast notification** in the app
4. **Display visual indicators** of the alert status

## Features

### 🔔 Push Notifications
- **Automatic alerts** when high/critical fire risk is detected
- **Rich notifications** with risk level, confidence score, and recommendations
- **Permission management** with user-friendly prompts
- **Background notifications** even when app is closed

### 🔊 Sound Alerts
- **10-second alert sound** for high/critical risk predictions
- **System sound fallback** if custom sound fails to load
- **Volume control** respects device settings
- **Non-intrusive** - stops automatically after duration

### 🎯 Smart Detection
- **Real-time monitoring** of sensor data from ThingSpeak
- **ML prediction integration** with automatic alert triggering
- **Risk level filtering** (high/critical only)
- **Duplicate prevention** to avoid spam

## Implementation Details

### Core Components

#### 1. NotificationService (`services/notificationService.js`)
- **Singleton service** for managing all notification operations
- **Permission handling** with graceful fallbacks
- **Sound management** using expo-av
- **Event listeners** for notification interactions

#### 2. ThingSpeak Integration (`services/thingspeakService.js`)
- **Automatic alert triggering** when predictions are created
- **Real-time data processing** with notification integration
- **Error handling** for network issues

#### 3. UI Components
- **NotificationStatus** - Shows current notification system status
- **Test functionality** - Allows users to test the alert system
- **Settings integration** - Notification preferences screen

### Key Functions

#### Fire Alert Detection
```javascript
// In ThingSpeak service
if (['high', 'critical'].includes(predictionResponse.risk_level)) {
  await notificationService.sendFireAlert(predictionResponse);
}
```

#### Sound Alert Playback
```javascript
// 10-second alert sound
await notificationService.playAlertSound(10000);
```

#### Permission Management
```javascript
const status = await notificationService.getPermissionsStatus();
if (status !== 'granted') {
  await notificationService.requestPermissions();
}
```

## User Experience

### 1. First Launch
- App requests notification permissions
- User can grant/deny permissions
- Graceful handling of denied permissions

### 2. Alert Flow
1. **Sensor data** is received from ThingSpeak
2. **ML model** processes data and makes prediction
3. **If high/critical risk** detected:
   - Push notification sent immediately
   - Alert sound plays for 10 seconds
   - Toast notification shows in app
   - Visual indicators update

### 3. Testing
- **Test button** in notification settings
- **Test button** in home screen notification status
- **Immediate feedback** with sound and visual confirmation

## Configuration

### App.json Settings
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### Dependencies
```json
{
  "expo-notifications": "latest",
  "expo-av": "latest"
}
```

## Testing the System

### 1. Manual Test
1. Open the app
2. Go to Settings → Notification Preferences
3. Tap "Test Fire Alert"
4. Verify notification appears and sound plays

### 2. Automatic Test
1. Ensure notification permissions are granted
2. Wait for real-time sensor data
3. When high/critical risk is predicted, alerts should trigger automatically

### 3. Permission Test
1. Deny notification permissions
2. Try to send test notification
3. Verify permission request appears
4. Grant permissions and test again

## Troubleshooting

### Common Issues

#### 1. No Sound Playing
- Check device volume settings
- Verify notification permissions
- Check if device is in silent mode
- Try test notification to verify

#### 2. No Push Notifications
- Check notification permissions in device settings
- Verify app is not in battery optimization mode
- Check if notifications are enabled in app settings

#### 3. Alerts Not Triggering
- Check ThingSpeak data connection
- Verify ML model is running
- Check console logs for errors
- Ensure risk level is 'high' or 'critical'

### Debug Information
- Console logs show notification service status
- Notification status component shows real-time state
- Error messages provide specific failure reasons

## Future Enhancements

### Planned Features
1. **Custom alert sounds** - Bundle local sound files
2. **Alert categories** - Different sounds for different risk levels
3. **Quiet hours** - Respect user's sleep schedule
4. **Alert history** - Track all sent notifications
5. **Emergency contacts** - Share alerts with family/friends

### Technical Improvements
1. **Offline support** - Cache notifications when offline
2. **Battery optimization** - Efficient background processing
3. **Sound customization** - User-selectable alert sounds
4. **Vibration patterns** - Custom vibration for different alerts

## Security Considerations

1. **Permission handling** - Only request necessary permissions
2. **Data privacy** - No sensitive data in notifications
3. **Rate limiting** - Prevent notification spam
4. **User control** - Easy way to disable notifications

## Performance Notes

- **Lightweight** - Minimal battery impact
- **Efficient** - Only triggers on actual high-risk predictions
- **Responsive** - Immediate notification delivery
- **Reliable** - Graceful error handling and fallbacks 