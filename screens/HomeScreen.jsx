import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import { useDashboardData, useAcknowledgeAlert } from '../hooks/useApi';
import { useUserSync } from '../hooks/useUserSync';
import { SENSOR_TYPES, ALERT_TYPES } from '../utils/constants';

const HomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, isLoaded, isSignedIn } = useAuth();
  const { data, loading, error, refetch } = useDashboardData();
  const { acknowledgeAlert } = useAcknowledgeAlert();
  const { syncUser } = useUserSync();

  // Auto-sync user when they first access the app
  useEffect(() => {
    if (user && isLoaded && isSignedIn) {
      console.log('Auto-syncing user on app access...');
      syncUser().catch(err => {
        console.error('Auto-sync failed on app access:', err);
      });
    }
  }, [user, isLoaded, isSignedIn, syncUser]);

  const onRefresh = React.useCallback(() => {
    refetch();
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

  // Transform sensor data for SensorCard component
  const transformSensorData = (readings) => {
    if (!readings || !Array.isArray(readings) || readings.length === 0) return [];

    // Get the latest reading that contains all three sensor types
    const latestReading = readings[0];
    
    if (!latestReading) return [];

    // Create three separate sensor cards for temperature, humidity, and smoke
    const sensors = [
      {
        icon: 'thermometer-outline',
        title: 'Temperature',
        value: latestReading.temperature || latestReading.temp || 'N/A',
        unit: '°C',
        recommendation: (latestReading.temperature || latestReading.temp || 0) > 30 
          ? '🔥 High temperature detected – monitor closely'
          : (latestReading.temperature || latestReading.temp || 0) > 25 
          ? '⚠️ Elevated temperature – stay alert'
          : '✅ Temperature within normal range',
        riskLevel: (latestReading.temperature || latestReading.temp || 0) > 30 ? 'high' : (latestReading.temperature || latestReading.temp || 0) > 25 ? 'moderate' : 'low',
      },
      {
        icon: 'water-outline',
        title: 'Humidity',
        value: latestReading.humidity || latestReading.hum || 'N/A',
        unit: '%',
        recommendation: (latestReading.humidity || latestReading.hum || 0) < 30 
          ? '⚠️ Low humidity increases fire risk'
          : (latestReading.humidity || latestReading.hum || 0) < 50 
          ? '🟡 Moderate humidity – monitor conditions'
          : '✅ Humidity levels are safe',
        riskLevel: (latestReading.humidity || latestReading.hum || 0) < 30 ? 'high' : (latestReading.humidity || latestReading.hum || 0) < 50 ? 'moderate' : 'low',
      },
      {
        icon: 'cloud-outline',
        title: 'Smoke Level',
        value: latestReading.smoke_level || latestReading.smoke || 'N/A',
        unit: 'ppm',
        recommendation: (latestReading.smoke_level || latestReading.smoke || 0) > 200 
          ? '🚨 High smoke levels detected!'
          : (latestReading.smoke_level || latestReading.smoke || 0) > 100 
          ? '⚠️ Elevated smoke levels'
          : '✅ Safe smoke levels',
        riskLevel: (latestReading.smoke_level || latestReading.smoke || 0) > 200 ? 'high' : (latestReading.smoke_level || latestReading.smoke || 0) > 100 ? 'moderate' : 'low',
      }
    ];

    return sensors;
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
  console.log('Sensor data:', data?.sensorData);
  console.log('Alerts data:', data?.alerts);
  
  // Ensure we have valid data before processing
  let sensorData = [];
  let alertsData = [];
  
  try {
    sensorData = transformSensorData(Array.isArray(data?.sensorData) ? data.sensorData : []);
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
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back!</Text>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            {data?.stats ? 'All systems operational' : 'Loading system status...'}
          </Text>
        </View>



        {/* Live Sensor Readings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🌡️ Current Sensor Values</Text>
          {sensorData.length > 0 ? (
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
                No sensor data available
              </Text>
            </View>
          )}
        </View>

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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Your Statistics</Text>
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
});

export default HomeScreen;