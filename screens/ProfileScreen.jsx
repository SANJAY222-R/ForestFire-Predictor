import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import ErrorMessage from '../components/ErrorMessage';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserSync } from '../hooks/useUserSync';
// Make sure this useAuth hook is adapted for Firebase!
import { useAuth } from '../utils/auth'; 
import { showSuccessToast, showErrorToast, showInfoToast } from '../services/toastService';

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  // This hook should now provide the Firebase user object and signOut method
  const { user, isLoaded, signOut } = useAuth(); 
  
  // These custom hooks need to be updated to use user.uid to fetch data
  const { profileData, loading, error, refetch } = useUserProfile(user?.uid); 
  const { syncUser, syncing, error: syncError } = useUserSync();

  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    joinDate: 'Loading...',
    totalPredictions: 0,
    highRiskAlerts: 0,
    deviceCount: 0,
    totalAlerts: 0,
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // This useEffect is now updated to read from the Firebase user object
  useEffect(() => {
    // Check if the auth state is loaded and a user is signed in
    if (isLoaded && user) {
      console.log('📊 Extracting user data from Firebase:', user);

      // --- KEY CHANGE: Extract data from Firebase user object ---
      const displayName = user.displayName || 'Unnamed User';
      const primaryEmail = user.email || 'No email provided';
      const createdAt = user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date();
      const joinDate = createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      // Combine Firebase data with your backend data from useUserProfile
      const combinedUserData = {
        name: displayName,
        email: primaryEmail,
        joinDate: joinDate,
        // These stats come from your custom backend/hook
        totalPredictions: profileData?.stats?.total_predictions || 0,
        highRiskAlerts: profileData?.stats?.high_risk_predictions || 0,
        deviceCount: profileData?.stats?.active_devices || 0,
        totalAlerts: profileData?.stats?.total_alerts || 0,
      };

      console.log('📱 Final combined user data:', combinedUserData);
      setUserData(combinedUserData);
    } else if (isLoaded && !user) {
      // Handle the case where the user is not signed in
      setUserData({
        name: 'Not signed in',
        email: 'Not available',
        joinDate: 'Not available',
        totalPredictions: 0,
        highRiskAlerts: 0,
        deviceCount: 0,
        totalAlerts: 0,
      });
    }
  }, [isLoaded, user, profileData]); // Rerun when auth state or profile data changes

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              showInfoToast('Signing out...', 'Please wait');
              // --- KEY CHANGE: This now calls Firebase's signOut ---
              await signOut(); 
              showSuccessToast('Signed out successfully');
            } catch (e) {
              console.error('❌ Sign out failed:', e);
              showErrorToast('Failed to sign out. Please try again.', 'Sign Out Error');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const ProfileButton = ({ icon, title, onPress, color = colors.primary }) => (
    <TouchableOpacity
      style={[styles.profileButton, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
      onPress={onPress}
    >
      <View style={[styles.buttonIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.buttonText, { color: colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color = colors.primary }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  // Loading state while Firebase Auth is initializing
  if (!isLoaded || loading || isLoggingOut) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {isLoggingOut ? 'Signing out...' : 'Loading user data...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state from your custom useUserProfile hook
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage
          error={error}
          onRetry={refetch}
          title="Failed to load profile"
        />
      </SafeAreaView>
    );
  }

  // Unauthenticated state
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.unauthenticatedContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.unauthenticatedTitle, { color: colors.text }]}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={loading || syncing}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Text style={[styles.userName, { color: colors.text }]}>
            Welcome, {userData.name}!
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {userData.email}
          </Text>
          <Text style={[styles.joinDate, { color: colors.textLight }]}>
            Member since {userData.joinDate}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Your Statistics</Text>
          <View style={styles.statsContainer}>
            <StatCard
              icon="bar-chart-outline"
              value={userData.totalPredictions}
              label="Predictions Made"
              color={colors.primary}
            />
            <StatCard
              icon="flame-outline"
              value={userData.highRiskAlerts}
              label="High Risk Alerts"
              color={colors.highRisk}
            />
          </View>
          <View style={styles.statsContainer}>
            <StatCard
              icon="phone-portrait-outline"
              value={userData.deviceCount}
              label="Active Sensors"
              color={colors.success}
            />
            <StatCard
              icon="notifications-outline"
              value={userData.totalAlerts}
              label="Total Alerts"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⚙️ Settings</Text>
          <ProfileButton
            icon="settings-outline"
            title="Account Settings"
            onPress={() => navigation.navigate('Settings')} // Updated to navigate to your existing Settings screen
          />
          <ProfileButton
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => { /* Navigate to Help screen */ }}
          />
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: colors.error, backgroundColor: colors.error + '10' }]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
            )}
            <Text style={[styles.logoutText, { color: colors.error }]}>
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES (No changes needed here) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    ...typography.body1,
  },
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  unauthenticatedTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  userName: {
    ...typography.h2,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body2,
    marginBottom: 8,
  },
  joinDate: {
    ...typography.caption,
  },
  statsSection: {
    paddingHorizontal: 14, // Adjusted for card margins
    marginBottom: 30,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 16,
    paddingHorizontal: 6, // Align with card content
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    ...typography.h3,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    ...typography.body1,
    fontWeight: '600',
    flex: 1,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  logoutText: {
    ...typography.body1,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
