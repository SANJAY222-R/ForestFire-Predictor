import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const ProfileScreen = () => {
  const { colors } = useContext(ThemeContext);
  
  // Mock user data
  const userData = {
    name: 'John Wick',
    email: 'Babayaga@assassian.com',
    avatar: null, // Using default avatar
    joinDate: 'January 2024',
    totalPredictions: 21,
    highRiskAlerts: 3,
    lastActive: '2 hours ago',
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
                    backgroundColor: colors.background,
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
            onPress={() => console.log('Edit Profile')}
          />
          
          <ProfileButton
            icon="notifications-outline"
            title="Notification Settings"
            onPress={() => console.log('Notifications')}
          />
          
          <ProfileButton
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            onPress={() => console.log('Privacy')}
          />
          
          <ProfileButton
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => console.log('Help')}
          />
          
          <ProfileButton
            icon="information-circle-outline"
            title="About App"
            onPress={() => console.log('About')}
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
          >
            <Ionicons name="log-out-outline" size={20} color={colors.highRisk} />
            <Text style={[styles.logoutText, { color: colors.highRisk }]}>🚪 Logout</Text>
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