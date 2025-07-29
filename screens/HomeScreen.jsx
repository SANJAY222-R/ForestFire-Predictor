import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';

const HomeScreen = () => {
  const { colors } = useContext(ThemeContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Mock sensor data
  const sensorData = [
    {
      icon: 'thermometer-outline',
      title: 'Temperature',
      value: '28',
      unit: '°C',
      recommendation: '🔥 High temperature detected – monitor closely',
      riskLevel: 'moderate',
    },
    {
      icon: 'water-outline',
      title: 'Humidity',
      value: '45',
      unit: '%',
      recommendation: '⚠️ Low humidity increases fire risk',
      riskLevel: 'moderate',
    },
    {
      icon: 'cloud-outline',
      title: 'Smoke Level',
      value: '120',
      unit: 'ppm',
      recommendation: '✅ Safe levels, no action needed',
      riskLevel: 'low',
    },
  ];

  // Mock alerts data
  const alertsData = [
    {
      id: 1,
      title: 'Sensor Maintenance',
      time: 'about 2 hours ago',
      message: 'DHT22 sensor calibrated successfully.',
      type: 'maintenance',
    },
    {
      id: 2,
      title: 'High Temperature Alert',
      time: '4 hours ago',
      message: 'Temperature exceeded 30°C threshold in sector B.',
      type: 'warning',
    },
    {
      id: 3,
      title: 'System Update',
      time: '1 day ago',
      message: 'Fire prediction algorithm updated to v2.1.',
      type: 'info',
    },
    {
      id: 4,
      title: 'Risk Assessment',
      time: '2 days ago',
      message: 'Moderate fire risk detected in northern region.',
      type: 'risk',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back!</Text>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>All systems operational</Text>
        </View>

        {/* Live Sensor Readings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🌡️ Live Sensor Readings</Text>
          {sensorData.map((sensor, index) => (
            <SensorCard
              key={index}
              icon={sensor.icon}
              title={sensor.title}
              value={sensor.value}
              unit={sensor.unit}
              recommendation={sensor.recommendation}
              riskLevel={sensor.riskLevel}
            />
          ))}
        </View>

        {/* Live Alerts Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Recent Alerts</Text>
          {alertsData.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
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
});

export default HomeScreen;