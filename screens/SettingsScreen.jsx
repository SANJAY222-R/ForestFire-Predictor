import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const SettingsScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [maintenanceNotifications, setMaintenanceNotifications] = useState(true);
  const [riskNotifications, setRiskNotifications] = useState(true);
  const [updateInterval, setUpdateInterval] = useState('5 minutes');

  const SettingItem = ({ icon, title, subtitle, children, iconColor = colors.primary }) => (
    <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
      <View style={styles.settingHeader}>
        <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {children}
    </View>
  );

  const IntervalOption = ({ label, value, selected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.intervalOption,
        {
          backgroundColor: selected ? colors.primary + '10' : colors.background,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.intervalText, { color: selected ? colors.primary : colors.textSecondary }]}>
        {label}
      </Text>
      {selected && <Ionicons name="checkmark" size={16} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Customize your app preferences
          </Text>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Appearance</Text>

          <SettingItem
            icon="color-palette-outline"
            title="Theme"
            subtitle="Switch between light and dark mode"
          >
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>Dark Mode</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.surface : colors.textLight}
              />
            </View>
          </SettingItem>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Notifications</Text>

          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
          >
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>Enable Alerts</Text>
              <Switch
                value={alertsEnabled}
                onValueChange={setAlertsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={alertsEnabled ? colors.surface : colors.textLight}
              />
            </View>
          </SettingItem>

          <SettingItem
            icon="construct-outline"
            title="Maintenance Notices"
            subtitle="Get notified about sensor maintenance"
            iconColor={colors.info}
          >
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>Maintenance Alerts</Text>
              <Switch
                value={maintenanceNotifications}
                onValueChange={setMaintenanceNotifications}
                trackColor={{ false: colors.border, true: colors.info }}
                thumbColor={maintenanceNotifications ? colors.surface : colors.textLight}
              />
            </View>
          </SettingItem>

          <SettingItem
            icon="flame-outline"
            title="Risk Alerts"
            subtitle="Critical fire risk notifications"
            iconColor={colors.highRisk}
          >
            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>High Risk Alerts</Text>
              <Switch
                value={riskNotifications}
                onValueChange={setRiskNotifications}
                trackColor={{ false: colors.border, true: colors.highRisk }}
                thumbColor={riskNotifications ? colors.surface : colors.textLight}
              />
            </View>
          </SettingItem>
        </View>

        {/* Sensor Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📡 Sensor Configuration</Text>

          <SettingItem
            icon="time-outline"
            title="Update Interval"
            subtitle="How often to refresh sensor data"
          >
            <View style={styles.intervalContainer}>
              {['1 minute', '5 minutes', '15 minutes', '30 minutes'].map((interval) => (
                <IntervalOption
                  key={interval}
                  label={interval}
                  value={interval}
                  selected={updateInterval === interval}
                  onPress={() => setUpdateInterval(interval)}
                />
              ))}
            </View>
          </SettingItem>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ About</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Forest Fire Predictor</Text>
            <Text style={[styles.infoVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
              Advanced AI-powered forest fire risk assessment and monitoring system.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  title: { ...typography.h2, marginBottom: 4 },
  subtitle: { ...typography.body2 },
  section: { marginBottom: 30 },
  sectionTitle: { ...typography.h3, marginHorizontal: 20, marginBottom: 12 },
  settingItem: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: { flex: 1 },
  settingTitle: { ...typography.body1, fontWeight: '600' },
  settingSubtitle: { ...typography.caption, marginTop: 2 },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: { ...typography.body2 },
  intervalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  intervalText: { ...typography.caption, marginRight: 4 },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: { ...typography.h3, marginBottom: 4 },
  infoVersion: { ...typography.body2, marginBottom: 12 },
  infoDescription: { ...typography.body2, textAlign: 'center', lineHeight: 20 },
});

export default SettingsScreen;
