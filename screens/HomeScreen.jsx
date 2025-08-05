import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RiskBadge from '../components/RiskBadge';

import { useDashboardData, useAcknowledgeAlert } from '../hooks/useApi';
import { useUserSync } from '../hooks/useUserSync';
import { SENSOR_TYPES, ALERT_TYPES } from '../utils/constants';
import apiService from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, isLoaded, isSignedIn } = useAuth();
  const { data, loading, error, refetch } = useDashboardData();
  const { acknowledgeAlert } = useAcknowledgeAlert();
  const { syncUser } = useUserSync();

  // ThingSpeak real-time data state
  const [thingSpeakData, setThingSpeakData] = useState(null);
  const [thingSpeakLoading, setThingSpeakLoading] = useState(false);
  const [thingSpeakError, setThingSpeakError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Auto-sync user when they first access the app
  useEffect(() => {
    if (user && isLoaded && isSignedIn) {
      console.log('Auto-syncing user on app access...');
      syncUser().catch(err => {
        console.error('Auto-sync failed on app access:', err);
      });
    }
  }, [user, isLoaded, isSignedIn, syncUser]);

  // Fetch ThingSpeak data
  const fetchThingSpeakData = async () => {
    try {
      setThingSpeakLoading(true);
      setThingSpeakError(null);
      
      const response = await apiService.fetchThingSpeakData();
      
      if (response.success) {
        setThingSpeakData(response);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        setThingSpeakError('Failed to fetch real-time data');
      }
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      setThingSpeakError('Failed to connect to IoT sensors');
    } finally {
      setThingSpeakLoading(false);
    }
  };

  // Auto-refresh ThingSpeak data every 30 seconds
  useEffect(() => {
    fetchThingSpeakData();
    
    const interval = setInterval(() => {
      fetchThingSpeakData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    refetch();
    fetchThingSpeakData();
  }, [refetch]);

  const handleAlertPress = async (alert) => {
    try {
      if (!alert.is_read) {
        await acknowledgeAlert(alert.id);
        // Refresh data after acknowledging
        refetch();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to acknowledge alert. Please try again.');
    }
  };

  // Transform ThingSpeak data for display
  const transformThingSpeakData = () => {
    if (!thingSpeakData?.reading) return [];

    const reading = thingSpeakData.reading;
    
    return [
      {
        icon: 'thermometer-outline',
        title: 'Temperature',
        value: reading.temperature || 'N/A',
        unit: '°C',
        recommendation: (reading.temperature || 0) > 30 
          ? '🔥 High temperature detected – monitor closely'
          : (reading.temperature || 0) > 25 
          ? '⚠️ Elevated temperature – stay alert'
          : '✅ Temperature within normal range',
        riskLevel: (reading.temperature || 0) > 30 ? 'high' : (reading.temperature || 0) > 25 ? 'moderate' : 'low',
      },
      {
        icon: 'water-outline',
        title: 'Humidity',
        value: reading.humidity || 'N/A',
        unit: '%',
        recommendation: (reading.humidity || 0) < 30 
          ? '⚠️ Low humidity increases fire risk'
          : (reading.humidity || 0) < 50 
          ? '🟡 Moderate humidity – monitor conditions'
          : '✅ Humidity levels are safe',
        riskLevel: (reading.humidity || 0) < 30 ? 'high' : (reading.humidity || 0) < 50 ? 'moderate' : 'low',
      },
      {
        icon: 'cloud-outline',
        title: 'Smoke Level',
        value: reading.smoke_level || 'N/A',
        unit: 'ppm',
        recommendation: (reading.smoke_level || 0) > 200 
          ? '🚨 High smoke levels detected!'
          : (reading.smoke_level || 0) > 100 
          ? '⚠️ Elevated smoke levels'
          : '✅ Safe smoke levels',
        riskLevel: (reading.smoke_level || 0) > 200 ? 'high' : (reading.smoke_level || 0) > 100 ? 'moderate' : 'low',
      }
    ];
  };

  // Transform alert data for AlertCard component
  const transformAlertData = (alerts) => {
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) return [];

    // Limit to 5 most recent alerts
    const limitedAlerts = alerts.slice(0, 5);

    return limitedAlerts.map(alert => ({
      id: alert.id,
      title: alert.title || alert.alert_type,
      time: new Date(alert.created_at).toLocaleString(),
      message: alert.message || alert.description || 'No description available',
      type: alert.category || alert.alert_type || ALERT_TYPES.INFO,
      is_read: alert.is_read,
      severity: alert.severity,
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner text="Loading dashboard data..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage 
          error={error} 
          onRetry={refetch}
          title="Failed to load dashboard"
        />
      </SafeAreaView>
    );
  }

  // Debug logging
  console.log('Dashboard data received:', data);
  console.log('ThingSpeak data received:', thingSpeakData);
  
  // Ensure we have valid data before processing
  let sensorData = [];
  let alertsData = [];
  
  try {
    sensorData = transformThingSpeakData();
    alertsData = transformAlertData(Array.isArray(data?.alerts) ? data.alerts : []);
  } catch (error) {
    console.error('Error transforming data:', error);
    // Use empty arrays as fallback
    sensorData = [];
    alertsData = [];
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading || thingSpeakLoading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome back, {user?.firstName || 'User'}! 👋
          </Text>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {isSignedIn ? 'You are signed in' : 'Please sign in to continue'}
          </Text>
          
          {/* Real-Time Data Status */}
          <View style={styles.realTimeStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: thingSpeakError ? colors.error : colors.success }]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {thingSpeakError ? 'IoT Sensors Offline' : 'IoT Sensors Online'}
            </Text>
            {lastUpdate && (
              <Text style={[styles.updateText, { color: colors.textSecondary }]}>
                Last update: {lastUpdate}
              </Text>
            )}
          </View>
        </View>

        {/* Real-Time IoT Sensor Readings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🌡️ Real-Time IoT Sensor Data
          </Text>
          {thingSpeakLoading ? (
            <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
              <LoadingSpinner text="Fetching real-time data..." />
            </View>
          ) : thingSpeakError ? (
            <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {thingSpeakError}
              </Text>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={fetchThingSpeakData}
              >
                <Text style={[styles.retryButtonText, { color: colors.surface }]}>
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : sensorData.length > 0 ? (
            <View style={styles.sensorGrid}>
              {sensorData.map((sensor, index) => (
                <View key={index} style={styles.sensorCard}>
                  <SensorCard
                    icon={sensor.icon}
                    title={sensor.title}
                    value={sensor.value}
                    unit={sensor.unit}
                    recommendation={sensor.recommendation}
                    riskLevel={sensor.riskLevel}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No real-time sensor data available
              </Text>
            </View>
          )}
        </View>

        {/* Fire Risk Prediction */}
        {thingSpeakData?.prediction && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🔥 Fire Risk Assessment
            </Text>
            <View style={[styles.predictionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.predictionHeader}>
                <RiskBadge riskLevel={thingSpeakData.prediction.risk_level} />
                <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                  Confidence: {Math.round((thingSpeakData.prediction.confidence_score || 0) * 100)}%
                </Text>
              </View>
              <Text style={[styles.predictionText, { color: colors.text }]}>
                {thingSpeakData.prediction.recommendations?.join(', ') || 'No specific recommendations available'}
              </Text>
            </View>
          </View>
        )}

        {/* Live Alerts Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Recent Alerts (Last 5)</Text>
          {alertsData.length > 0 ? (
            alertsData.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert}
                onPress={() => handleAlertPress(alert)}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No alerts at this time
              </Text>
            </View>
          )}
        </View>

        {/* User Statistics */}
        {data?.stats && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Statistics</Text>
            
            {/* Quick Stats */}
            <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {data.stats.total_predictions || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Predictions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.highRisk }]}>
                  {data.stats.high_risk_predictions || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  High Risk Alerts
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  {data.stats.active_devices || 0}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Active Sensors
                </Text>
              </View>
            </View>
          </View>
        )}
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
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    ...typography.h2,
    marginBottom: 4,
  },
  statusText: {
    ...typography.body2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 12,
  },
  emptyState: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyText: {
    ...typography.body2,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'block',
    marginVertical: 8,
  },
  sensorCard: {
    width: '100%',
    marginBottom: 12,
  },
  realTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  realTimeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  realTimeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  updateText: {
    ...typography.caption,
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  errorText: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceText: {
    ...typography.caption,
  },
  predictionText: {
    ...typography.body2,
  },
});

export default HomeScreen;