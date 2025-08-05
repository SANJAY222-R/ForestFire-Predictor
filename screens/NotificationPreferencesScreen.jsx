import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import notificationService from '../services/notificationService';
import { showSuccessToast, showErrorToast, showInfoToast, showFireAlertToast } from '../services/toastService';

const NotificationPreferencesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    // General notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Alert types
    highRiskAlerts: true,
    moderateRiskAlerts: true,
    lowRiskAlerts: false,
    maintenanceAlerts: true,
    systemUpdates: true,
    weatherAlerts: true,
    
    // Frequency settings
    immediateAlerts: true,
    dailyDigest: false,
    weeklySummary: true,
    
    // Time preferences
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    
    // Sound and vibration
    soundEnabled: true,
    vibrationEnabled: true,
    silentMode: false,
  });

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Test notification service
      const status = await notificationService.getPermissionsStatus();
      
      if (status === 'granted') {
        // Test fire alert notification
        await notificationService.sendFireAlert({
          risk_level: 'high',
          confidence_score: 0.85,
          recommendations: ['Monitor conditions closely', 'Stay alert for changes']
        });
        
        showSuccessToast('Notification test sent successfully!');
      } else {
        // Request permissions
        const newStatus = await notificationService.requestPermissions();
        if (newStatus === 'granted') {
          showSuccessToast('Notification permissions granted!');
        } else {
          showErrorToast('Notification permissions required for alerts');
        }
      }
      
      // Simulate API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessToast('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showErrorToast('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTestNotification = async () => {
    try {
      setIsLoading(true);
      
      const status = await notificationService.getPermissionsStatus();
      if (status !== 'granted') {
        const newStatus = await notificationService.requestPermissions();
        if (newStatus !== 'granted') {
          showErrorToast('Notification permissions required for test');
          return;
        }
      }
      
      // Send test fire alert
      await notificationService.sendFireAlert({
        risk_level: 'high',
        confidence_score: 0.85,
        recommendations: ['This is a test alert', 'Sound should play for 10 seconds']
      });
      
      showFireAlertToast('high', 85);
      
    } catch (error) {
      console.error('Error sending test notification:', error);
      showErrorToast('Failed to send test notification');
    } finally {
      setIsLoading(false);
    }
  };

  const NotificationItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showSwitch = true,
    onPress = null 
  }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={[styles.notificationIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.notificationSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {showSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={value ? colors.primary : colors.textLight}
        />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Notification Preferences</Text>
        </View>
        {/* General Notifications */}
        <View style={styles.section}>
          <SectionHeader 
            title="📱 General Notifications" 
            subtitle="Choose how you want to receive notifications"
          />
          <NotificationItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={notifications.pushNotifications}
            onToggle={() => handleToggleSetting('pushNotifications')}
          />
          <NotificationItem
            icon="mail-outline"
            title="Email Notifications"
            subtitle="Receive notifications via email"
            value={notifications.emailNotifications}
            onToggle={() => handleToggleSetting('emailNotifications')}
          />
          <NotificationItem
            icon="chatbubble-outline"
            title="SMS Notifications"
            subtitle="Receive notifications via SMS"
            value={notifications.smsNotifications}
            onToggle={() => handleToggleSetting('smsNotifications')}
          />
        </View>

        {/* Test Notification */}
        <View style={styles.section}>
          <SectionHeader 
            title="🧪 Test Notifications" 
            subtitle="Test the notification system with a sample alert"
          />
          <NotificationItem
            icon="play-outline"
            title="Test Fire Alert"
            subtitle="Send a test notification with sound (10 seconds)"
            value={false}
            onToggle={handleTestNotification}
            showSwitch={false}
            onPress={handleTestNotification}
          />
        </View>

        {/* Alert Types */}
        <View style={styles.section}>
          <SectionHeader 
            title="🚨 Alert Types" 
            subtitle="Choose which types of alerts you want to receive"
          />
          <NotificationItem
            icon="flame-outline"
            title="High Risk Alerts"
            subtitle="Critical fire risk warnings"
            value={notifications.highRiskAlerts}
            onToggle={() => handleToggleSetting('highRiskAlerts')}
          />
          <NotificationItem
            icon="warning-outline"
            title="Moderate Risk Alerts"
            subtitle="Medium fire risk warnings"
            value={notifications.moderateRiskAlerts}
            onToggle={() => handleToggleSetting('moderateRiskAlerts')}
          />
          <NotificationItem
            icon="information-circle-outline"
            title="Low Risk Alerts"
            subtitle="Minor fire risk updates"
            value={notifications.lowRiskAlerts}
            onToggle={() => handleToggleSetting('lowRiskAlerts')}
          />
          <NotificationItem
            icon="construct-outline"
            title="Maintenance Alerts"
            subtitle="Sensor and system maintenance updates"
            value={notifications.maintenanceAlerts}
            onToggle={() => handleToggleSetting('maintenanceAlerts')}
          />
          <NotificationItem
            icon="refresh-outline"
            title="System Updates"
            subtitle="App and system update notifications"
            value={notifications.systemUpdates}
            onToggle={() => handleToggleSetting('systemUpdates')}
          />
          <NotificationItem
            icon="cloudy-outline"
            title="Weather Alerts"
            subtitle="Weather-related fire risk updates"
            value={notifications.weatherAlerts}
            onToggle={() => handleToggleSetting('weatherAlerts')}
          />
        </View>

        {/* Frequency Settings */}
        <View style={styles.section}>
          <SectionHeader 
            title="⏰ Frequency Settings" 
            subtitle="Choose how often you want to receive notifications"
          />
          <NotificationItem
            icon="flash-outline"
            title="Immediate Alerts"
            subtitle="Receive alerts as soon as they occur"
            value={notifications.immediateAlerts}
            onToggle={() => handleToggleSetting('immediateAlerts')}
          />
          <NotificationItem
            icon="calendar-outline"
            title="Daily Digest"
            subtitle="Receive a summary once per day"
            value={notifications.dailyDigest}
            onToggle={() => handleToggleSetting('dailyDigest')}
          />
          <NotificationItem
            icon="calendar-outline"
            title="Weekly Summary"
            subtitle="Receive a summary once per week"
            value={notifications.weeklySummary}
            onToggle={() => handleToggleSetting('weeklySummary')}
          />
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <SectionHeader 
            title="🌙 Quiet Hours" 
            subtitle="Set times when you don't want to be disturbed"
          />
          <NotificationItem
            icon="moon-outline"
            title="Enable Quiet Hours"
            subtitle="Silence notifications during specified hours"
            value={notifications.quietHours}
            onToggle={() => handleToggleSetting('quietHours')}
          />
          {notifications.quietHours && (
            <View style={styles.quietHoursInfo}>
              <Text style={[styles.quietHoursText, { color: colors.textSecondary }]}>
                Quiet hours: {notifications.quietHoursStart} - {notifications.quietHoursEnd}
              </Text>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('Edit Quiet Hours', 'Quiet hours editing coming soon!')}
              >
                <Text style={[styles.editButtonText, { color: colors.surface }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Sound and Vibration */}
        <View style={styles.section}>
          <SectionHeader 
            title="🔊 Sound & Vibration" 
            subtitle="Customize notification sounds and vibrations"
          />
          <NotificationItem
            icon="volume-high-outline"
            title="Sound Enabled"
            subtitle="Play sounds for notifications"
            value={notifications.soundEnabled}
            onToggle={() => handleToggleSetting('soundEnabled')}
          />
          <NotificationItem
            icon="phone-portrait-outline"
            title="Vibration Enabled"
            subtitle="Vibrate for notifications"
            value={notifications.vibrationEnabled}
            onToggle={() => handleToggleSetting('vibrationEnabled')}
          />
          <NotificationItem
            icon="volume-mute-outline"
            title="Silent Mode"
            subtitle="Disable all notification sounds"
            value={notifications.silentMode}
            onToggle={() => handleToggleSetting('silentMode')}
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              { 
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={handleSavePreferences}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Ionicons name="checkmark-outline" size={20} color={colors.surface} />
            )}
            <Text style={[styles.saveButtonText, { color: colors.surface }]}>
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'transparent', // Ensure it doesn't interfere with SafeAreaView
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    ...typography.h2,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.caption,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  notificationSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  quietHoursInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  quietHoursText: {
    ...typography.body2,
  },
  editButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  saveSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  saveButtonText: {
    ...typography.body1,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NotificationPreferencesScreen; 