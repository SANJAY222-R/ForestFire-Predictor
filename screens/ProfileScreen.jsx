import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import ErrorMessage from '../components/ErrorMessage';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserSync } from '../hooks/useUserSync';
import { useAuth } from '../utils/auth';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../services/toastService';

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, isLoaded, isSignedIn } = useAuth();
  const { signOut } = useAuth();
  const { profileData, loading, error, refetch } = useUserProfile();
  const { syncUser, syncing, error: syncError } = useUserSync();

  // State for user display data
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    username: 'Loading...',
    avatar: null,
    joinDate: 'Loading...',
    totalPredictions: 0,
    highRiskAlerts: 0,
    lastActive: 'Just now',
  });

  // State for logout process
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-sync user when they first access profile
  useEffect(() => {
    if (user && isLoaded && isSignedIn && !profileData && !loading) {
      console.log('Auto-syncing user with backend...');
      showInfoToast('Syncing your profile data...', 'Syncing');
      syncUser().then(() => {
        showSuccessToast('Profile data synchronized successfully');
      }).catch(err => {
        console.error('Auto-sync failed:', err);
        showErrorToast('Failed to sync profile data. Please try again.');
      });
    }
  }, [user, isLoaded, isSignedIn, profileData, loading, syncUser]);

  // Extract and display user data from Clerk
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log('📊 Extracting user data from Clerk:', user);
      
      // Extract display name with fallbacks
      let displayName = '';
      if (user.username) {
        displayName = user.username;
      } else if (user.firstName && user.lastName) {
        displayName = `${user.firstName} ${user.lastName}`;
      } else if (user.firstName) {
        displayName = user.firstName;
      } else if (user.lastName) {
        displayName = user.lastName;
      } else if (user.fullName) {
        displayName = user.fullName;
      } else if (user.givenName && user.familyName) {
        displayName = `${user.givenName} ${user.familyName}`;
      } else if (user.givenName) {
        displayName = user.givenName;
      } else if (user.familyName) {
        displayName = user.familyName;
      }

      // Extract primary email
      let primaryEmail = '';
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        const verifiedEmail = user.emailAddresses.find(email => 
          email.verification?.status === 'verified'
        );
        if (verifiedEmail) {
          primaryEmail = verifiedEmail.emailAddress;
        } else {
          primaryEmail = user.emailAddresses[0].emailAddress;
        }
      } else if (user.primaryEmailAddress) {
        primaryEmail = user.primaryEmailAddress.emailAddress;
      } else if (user.emailAddress) {
        primaryEmail = user.emailAddress;
      }

      // Use email as fallback for display name if no name is available
      if (!displayName && primaryEmail) {
        displayName = primaryEmail.split('@')[0]; // Use part before @ as display name
      }

      // Get username
      const username = user.username || '';

      // Get join date
      const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
      const joinDate = createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });

      // Combine Clerk data with backend data if available
      const combinedUserData = {
        name: displayName || 'User',
        email: primaryEmail || 'Email not available',
        username: username,
        avatar: user.imageUrl || null,
        joinDate: joinDate,
        totalPredictions: profileData?.stats?.total_predictions || 0,
        highRiskAlerts: profileData?.stats?.high_risk_predictions || 0,
        lastActive: profileData?.last_active || 'Just now',
        // Additional backend data
        location: profileData?.location || 'Not specified',
        preferences: profileData?.preferences || {},
        deviceCount: profileData?.stats?.active_devices || 0,
        totalAlerts: profileData?.stats?.total_alerts || 0,
        unreadAlerts: profileData?.stats?.unread_alerts || 0,
      };

      console.log('📱 Final user data from Clerk:', combinedUserData);
      setUserData(combinedUserData);
    } else if (!isLoaded) {
      setUserData({
        name: 'Loading...',
        email: 'Loading...',
        username: 'Loading...',
        avatar: null,
        joinDate: 'Loading...',
        totalPredictions: 0,
        highRiskAlerts: 0,
        lastActive: 'Loading...',
      });
    } else if (!isSignedIn) {
      setUserData({
        name: 'Not signed in',
        email: 'Not available',
        username: 'Not available',
        avatar: null,
        joinDate: 'Not available',
        totalPredictions: 0,
        highRiskAlerts: 0,
        lastActive: 'Not available',
      });
    }
  }, [isLoaded, isSignedIn, user, profileData]);

  const handleLogout = async () => {
    // Check if signOut function is available
    if (!signOut || typeof signOut !== 'function') {
      showErrorToast('Sign out function is not available. Please restart the app.', 'Sign Out Error');
      return;
    }

    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              showInfoToast('Signing out...', 'Please wait');
              console.log('🔄 Signing out user...');
              await signOut();
              console.log('✅ User signed out successfully');
              showSuccessToast('Signed out successfully');
            } catch (error) {
              console.error('❌ Sign out failed:', error);
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
      style={[
        styles.profileButton, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
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
    <View 
      style={[
        styles.statCard, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  // Show loading state
  if (loading || !isLoaded || isLoggingOut) {
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

  // Show error state
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

  // Show unauthenticated state
  if (!isSignedIn || !user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.unauthenticatedContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.unauthenticatedTitle, { color: colors.text }]}>
            Please log in to view your profile
          </Text>
          <Text style={[styles.unauthenticatedSubtitle, { color: colors.textSecondary }]}>
            Sign in to access your personal information and settings
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
            {userData.name}!
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
            onPress={() => navigation.navigate('AccountSettings')}
          />
          <ProfileButton
            icon="notifications-outline"
            title="Notification Preferences"
            onPress={() => navigation.navigate('NotificationPreferences')}
          />
          <ProfileButton
            icon="location-outline"
            title="Location Settings"
            onPress={() => navigation.navigate('LocationSettings')}
          />
          <ProfileButton
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => navigation.navigate('HelpSupport')}
          />
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { 
                borderColor: colors.error,
                backgroundColor: colors.error + '10'
              }
            ]}
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
    fontSize: 16,
  },
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  unauthenticatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  unauthenticatedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
  userUsername: {
    ...typography.body2,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body2,
    marginBottom: 4,
  },
  joinDate: {
    ...typography.caption,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    fontSize: 20,
    fontWeight: 'bold',
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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