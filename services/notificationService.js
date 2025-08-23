import * as Notifications from 'expo-notifications';
import * as Audio from 'expo-av';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.alertTimeout = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.isInitialized = false;
  }

  // Initialize notification service
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔔 Initializing notification service...');

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('⚠️ Notification permissions not granted');
        return false;
      }

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Set up notification listeners
      this.setupNotificationListeners();

      // Load alert sound
      await this.loadAlertSound();

      this.isInitialized = true;
      console.log('✅ Notification service initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      return false;
    }
  }

  // Load alert sound
  async loadAlertSound() {
    try {
      console.log('🔊 Loading alert sound...');
      
      // For now, we'll use a system sound since we don't have a local file
      // In a real app, you'd bundle an alert sound file like:
      // const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/alert.mp3'));
      
      // Create a simple alert sound using expo-av with a system sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        { shouldPlay: false, isLooping: false }
      );
      
      this.sound = sound;
      console.log('✅ Alert sound loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading alert sound:', error);
      // Fallback to system sound
      this.sound = null;
    }
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listen for notifications received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for user interaction with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received
  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    
    // If it's a fire alert, play sound for 10 seconds
    if (data?.type === 'fire_alert' && data?.risk_level === 'high') {
      this.playAlertSound(10000); // 10 seconds
    }
  }

  // Handle notification response
  handleNotificationResponse(response) {
    const { title, body, data } = response.notification.request.content;
    
    // Handle different notification types
    if (data?.type === 'fire_alert') {
      // Navigate to alerts screen or show more details
      console.log('🚨 Fire alert notification tapped');
    }
  }

  // Play alert sound for specified duration
  async playAlertSound(duration = 10000) {
    if (this.isPlaying) {
      console.log('🔊 Alert sound already playing');
      return;
    }

    try {
      this.isPlaying = true;
      console.log(`🔊 Playing alert sound for ${duration}ms`);

      if (this.sound) {
        // Reset and play the sound
        await this.sound.setStatusAsync({ positionMillis: 0 });
        await this.sound.playAsync();
      } else {
        // Fallback: use system notification sound
        console.log('🔊 Using system notification sound');
      }

      // Stop sound after duration
      this.alertTimeout = setTimeout(() => {
        this.stopAlertSound();
      }, duration);

    } catch (error) {
      console.error('❌ Error playing alert sound:', error);
      this.isPlaying = false;
    }
  }

  // Stop alert sound
  async stopAlertSound() {
    try {
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
        this.alertTimeout = null;
      }

      if (this.sound && this.isPlaying) {
        await this.sound.stopAsync();
      }

      this.isPlaying = false;
      console.log('🔇 Alert sound stopped');

    } catch (error) {
      console.error('❌ Error stopping alert sound:', error);
      this.isPlaying = false;
    }
  }

  // Send fire alert notification
  async sendFireAlert(prediction) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { risk_level, confidence_score, recommendations } = prediction;
      
      // Determine notification content based on risk level
      const riskEmoji = {
        'low': '🟢',
        'moderate': '🟡',
        'high': '🟠',
        'critical': '🔴'
      }[risk_level] || '⚪';

      const title = `${riskEmoji} Fire Risk Alert`;
      const body = `Risk Level: ${risk_level.toUpperCase()}\nConfidence: ${Math.round(confidence_score * 100)}%\n${recommendations?.join(', ') || 'Monitor conditions closely'}`;

      // Create notification
      const notificationContent = {
        title,
        body,
        data: {
          type: 'fire_alert',
          risk_level: risk_level,
          confidence_score: confidence_score,
          recommendations: recommendations,
          timestamp: new Date().toISOString()
        },
        sound: 'default', // Use system sound
        priority: risk_level === 'critical' ? 'high' : 'default',
        autoDismiss: false,
        sticky: risk_level === 'critical', // Critical alerts stay until dismissed
      };

      // Schedule notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Send immediately
      });

      console.log(`🚨 Fire alert notification sent: ${notificationId}`);

      // Play alert sound for high/critical risk
      if (['high', 'critical'].includes(risk_level)) {
        this.playAlertSound(10000); // 10 seconds
      }

      return notificationId;

    } catch (error) {
      console.error('❌ Error sending fire alert notification:', error);
      throw error;
    }
  }

  // Send general notification
  async sendNotification(title, body, data = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });

      console.log(`📱 Notification sent: ${notificationId}`);
      return notificationId;

    } catch (error) {
      console.error('❌ Error sending notification:', error);
      throw error;
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🗑️ All notifications cancelled');
    } catch (error) {
      console.error('❌ Error cancelling notifications:', error);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`🗑️ Notification cancelled: ${notificationId}`);
    } catch (error) {
      console.error('❌ Error cancelling notification:', error);
    }
  }

  // Get notification permissions status
  async getPermissionsStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('❌ Error getting notification permissions:', error);
      return 'unknown';
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return 'denied';
    }
  }

  // Clean up resources
  cleanup() {
    try {
      if (this.notificationListener) {
        Notifications.removeNotificationSubscription(this.notificationListener);
      }
      if (this.responseListener) {
        Notifications.removeNotificationSubscription(this.responseListener);
      }
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      if (this.sound) {
        this.sound.unloadAsync();
      }
      console.log('🧹 Notification service cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up notification service:', error);
    }
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isPlaying: this.isPlaying,
      permissionsStatus: this.getPermissionsStatus(),
      hasSound: !!this.sound
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 