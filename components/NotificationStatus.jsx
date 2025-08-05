import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import notificationService from '../services/notificationService';
import { showSuccessToast, showErrorToast } from '../services/toastService';

const NotificationStatus = () => {
  const { colors } = useTheme();
  const [status, setStatus] = useState({
    isInitialized: false,
    permissionsStatus: 'unknown',
    isPlaying: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const permissionsStatus = await notificationService.getPermissionsStatus();
      const serviceStatus = notificationService.getStatus();
      
      setStatus({
        isInitialized: serviceStatus.isInitialized,
        permissionsStatus: permissionsStatus,
        isPlaying: serviceStatus.isPlaying
      });
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const handleTestNotification = async () => {
    try {
      setIsLoading(true);
      
      // Check permissions first
      if (status.permissionsStatus !== 'granted') {
        const newStatus = await notificationService.requestPermissions();
        if (newStatus !== 'granted') {
          showErrorToast('Notification permissions required for alerts');
          return;
        }
        await checkNotificationStatus();
      }
      
      // Send test fire alert
      await notificationService.sendFireAlert({
        risk_level: 'high',
        confidence_score: 0.85,
        recommendations: ['This is a test alert', 'Sound should play for 10 seconds']
      });
      
      showSuccessToast('Test notification sent! Check for alert sound.');
      
    } catch (error) {
      console.error('Error sending test notification:', error);
      showErrorToast('Failed to send test notification');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (status.isPlaying) return 'volume-high';
    if (status.permissionsStatus === 'granted' && status.isInitialized) return 'checkmark-circle';
    if (status.permissionsStatus === 'denied') return 'close-circle';
    return 'help-circle';
  };

  const getStatusColor = () => {
    if (status.isPlaying) return colors.warning;
    if (status.permissionsStatus === 'granted' && status.isInitialized) return colors.success;
    if (status.permissionsStatus === 'denied') return colors.error;
    return colors.textSecondary;
  };

  const getStatusText = () => {
    if (status.isPlaying) return 'Playing Alert Sound';
    if (status.permissionsStatus === 'granted' && status.isInitialized) return 'Notifications Active';
    if (status.permissionsStatus === 'denied') return 'Permissions Denied';
    return 'Checking Status...';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.statusInfo}>
          <Ionicons 
            name={getStatusIcon()} 
            size={24} 
            color={getStatusColor()} 
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              🔔 Notification Status
            </Text>
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: colors.primary }]}
          onPress={handleTestNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="play" size={16} color={colors.white} />
          )}
          <Text style={[styles.testButtonText, { color: colors.white }]}>
            Test
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Permissions: {status.permissionsStatus}
        </Text>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Service: {status.isInitialized ? 'Active' : 'Inactive'}
        </Text>
        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
          • Sound: {status.isPlaying ? 'Playing' : 'Ready'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusText: {
    ...typography.body2,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    justifyContent: 'center',
  },
  testButtonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    marginTop: 8,
  },
  detailText: {
    ...typography.body2,
    fontSize: 12,
    marginBottom: 2,
  },
});

export default NotificationStatus; 