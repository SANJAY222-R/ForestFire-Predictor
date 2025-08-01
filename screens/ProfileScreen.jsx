import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const ProfileScreen = () => {
  const { colors } = useContext(ThemeContext);
  const { user, signOut, isLoaded, isSignedIn } = useAuth();
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    avatar: null,
    joinDate: 'Loading...',
    totalPredictions: 0,
    highRiskAlerts: 0,
    lastActive: 'Just now',
  });

  useEffect(() => {
    console.log('ProfileScreen useEffect triggered');
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    console.log('user:', user);
    console.log('user type:', typeof user);
    
    // Test direct access to user properties
    if (user) {
      console.log('Testing direct user property access:');
      console.log('user.firstName:', user.firstName);
      console.log('user.lastName:', user.lastName);
      console.log('user.emailAddresses:', user.emailAddresses);
      console.log('user.primaryEmailAddress:', user.primaryEmailAddress);
      console.log('user.username:', user.username);
      console.log('user.fullName:', user.fullName);
      console.log('user.id:', user.id);
      
      // Try to access all possible user properties
      console.log('All user properties:', Object.keys(user));
      console.log('User object stringified:', JSON.stringify(user, null, 2));
    }
    
    // Add a small delay to wait for user data to load
    const timer = setTimeout(() => {
      if (user && isLoaded && isSignedIn) {
        console.log('Clerk User Data:', {
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddresses: user.emailAddresses,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          primaryEmailAddress: user.primaryEmailAddress
        });

        // Extract user data from Clerk with better fallbacks
        let fullName = '';
        let primaryEmail = '';

        // Try to get the full name from various possible sources
        if (user.fullName) {
          fullName = user.fullName;
        } else if (user.firstName && user.lastName) {
          fullName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          fullName = user.firstName;
        } else if (user.lastName) {
          fullName = user.lastName;
        } else if (user.username) {
          fullName = user.username;
        } else if (user.givenName && user.familyName) {
          fullName = `${user.givenName} ${user.familyName}`;
        } else if (user.givenName) {
          fullName = user.givenName;
        } else if (user.familyName) {
          fullName = user.familyName;
        }

        // Get email from various possible sources
        if (user.emailAddresses && user.emailAddresses.length > 0) {
          // Try to find a verified email first
          const verifiedEmail = user.emailAddresses.find(email => 
            email.verification?.status === 'verified'
          );
          if (verifiedEmail) {
            primaryEmail = verifiedEmail.emailAddress;
          } else {
            // Use the first available email
            primaryEmail = user.emailAddresses[0].emailAddress;
          }
        } else if (user.primaryEmailAddress) {
          primaryEmail = user.primaryEmailAddress.emailAddress;
        } else if (user.emailAddress) {
          primaryEmail = user.emailAddress;
        }

        // Only update user data if we have valid information
        if (fullName && primaryEmail) {
          const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
          const joinDate = createdAt.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          });

          const updatedUserData = {
            name: fullName,
            email: primaryEmail,
            avatar: user.imageUrl || null,
            joinDate: joinDate,
            totalPredictions: 0, // This would come from your backend
            highRiskAlerts: 0, // This would come from your backend
            lastActive: 'Just now',
          };

          console.log('Processed User Data:', updatedUserData);
          setUserData(updatedUserData);
        } else {
          console.log('User data incomplete - missing name or email');
          setUserData({
            name: 'User data incomplete',
            email: 'Email not available',
            avatar: null,
            joinDate: 'Not available',
            totalPredictions: 0,
            highRiskAlerts: 0,
            lastActive: 'Not available',
          });
        }
      } else if (!isLoaded) {
        console.log('Clerk is still loading...');
        setUserData({
          name: 'Loading...',
          email: 'Loading...',
          avatar: null,
          joinDate: 'Loading...',
          totalPredictions: 0,
          highRiskAlerts: 0,
          lastActive: 'Loading...',
        });
      } else if (!isSignedIn) {
        console.log('User is not signed in');
        setUserData({
          name: 'Not signed in',
          email: 'Not available',
          avatar: null,
          joinDate: 'Not available',
          totalPredictions: 0,
          highRiskAlerts: 0,
          lastActive: 'Not available',
        });
      } else {
        console.log('User is signed in but user object is null/undefined');
        setUserData({
          name: 'User data not available',
          email: 'Not available',
          avatar: null,
          joinDate: 'Not available',
          totalPredictions: 0,
          highRiskAlerts: 0,
          lastActive: 'Not available',
        });
      }
    }, 1000); // Wait 1 second for user data to load

    return () => clearTimeout(timer);
  }, [user, isLoaded, isSignedIn]);

  const handleLogout = () => {
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
          onPress: () => signOut(),
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View 
                style={[
                  styles.defaultAvatar, 
                  { 
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary
                  }
                ]}
              >
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            )}
            <TouchableOpacity 
              style={[
                styles.editAvatarButton, 
                { backgroundColor: colors.primary }
              ]}
            >
              <Ionicons name="camera" size={16} color={colors.surface} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userData.email}</Text>
          <Text style={[styles.joinDate, { color: colors.textLight }]}>Member since {userData.joinDate}</Text>
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
          
          <View 
            style={[
              styles.activityCard, 
              { 
                backgroundColor: colors.surface,
                shadowColor: colors.shadow
              }
            ]}
          >
            <View style={styles.activityHeader}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.activityText, { color: colors.textSecondary }]}>
                Last active: {userData.lastActive}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⚙️ Account Settings</Text>
          
          <ProfileButton
            icon="create-outline"
            title="Edit Profile"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          />
          
          <ProfileButton
            icon="notifications-outline"
            title="Notification Settings"
            onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
          />
          
          <ProfileButton
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
          
          <ProfileButton
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'Help & Support coming soon!')}
          />
          
          <ProfileButton
            icon="information-circle-outline"
            title="About App"
            onPress={() => Alert.alert('About', 'Forest Fire Predictor v1.0.0\nAI-Powered Fire Risk Assessment')}
          />
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={[
              styles.logoutButton, 
              { 
                backgroundColor: colors.surface,
                borderColor: colors.highRisk + '30'
              }
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.highRisk} />
            <Text style={[styles.logoutText, { color: colors.highRisk }]}>🚪 Sign Out</Text>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    ...typography.h2,
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
  activityCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    ...typography.body2,
    marginLeft: 8,
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