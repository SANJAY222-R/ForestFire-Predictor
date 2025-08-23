import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  TextInput,
  Switch,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { useAuth } from '../utils/auth';
import { showSuccessToast, showErrorToast } from '../services/toastService';

const AccountSettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, isLoaded } = useAuth();
  const { signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    username: user?.username || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dataSharing: false,
    analytics: true,
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile in Clerk
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
      });
      
      showSuccessToast('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorToast('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password changes are handled through your email. Check your email for password reset instructions.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await user?.delete();
              await signOut();
            } catch (error) {
              console.error('Error deleting account:', error);
              showErrorToast('Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange = null }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary + '40' }}
          thumbColor={switchValue ? colors.primary : colors.textLight}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );

  const InputField = ({ label, value, onChangeText, placeholder, secureTextEntry = false }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            color: colors.text
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={[styles.title, { color: colors.text }]}>Account Settings</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <SectionHeader 
            title="👤 Profile Information" 
            subtitle="Manage your personal information"
          />
          
          {isEditing ? (
            <View style={styles.editForm}>
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
                placeholder="Enter your first name"
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
                placeholder="Enter your last name"
              />
              <InputField
                label="Username"
                value={formData.username}
                onChangeText={(text) => setFormData({...formData, username: text})}
                placeholder="Enter your username"
              />
              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.saveButton, 
                    { 
                      backgroundColor: colors.primary,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Ionicons name="checkmark-outline" size={20} color={colors.surface} />
                  )}
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Name:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Username:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.username || 'Not set'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={20} color={colors.surface} />
                <Text style={[styles.editButtonText, { color: colors.surface }]}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Preferences */}
        <View style={styles.section}>
          <SectionHeader 
            title="⚙️ Account Preferences" 
            subtitle="Customize your account settings"
          />
          <SettingItem
            icon="notifications-outline"
            title="Email Notifications"
            subtitle="Receive updates via email"
            showSwitch={true}
            switchValue={preferences.emailNotifications}
            onSwitchChange={(value) => setPreferences({...preferences, emailNotifications: value})}
          />
          <SettingItem
            icon="phone-portrait-outline"
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            showSwitch={true}
            switchValue={preferences.pushNotifications}
            onSwitchChange={(value) => setPreferences({...preferences, pushNotifications: value})}
          />
          <SettingItem
            icon="share-outline"
            title="Data Sharing"
            subtitle="Help improve the app with anonymous data"
            showSwitch={true}
            switchValue={preferences.dataSharing}
            onSwitchChange={(value) => setPreferences({...preferences, dataSharing: value})}
          />
          <SettingItem
            icon="analytics-outline"
            title="Analytics"
            subtitle="Allow app usage analytics"
            showSwitch={true}
            switchValue={preferences.analytics}
            onSwitchChange={(value) => setPreferences({...preferences, analytics: value})}
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <SectionHeader 
            title="🔒 Security" 
            subtitle="Manage your account security"
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={handleChangePassword}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            onPress={() => Alert.alert('2FA', 'Two-factor authentication coming soon!')}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <SectionHeader 
            title="⚠️ Account Actions" 
            subtitle="Important account operations"
          />
          <SettingItem
            icon="log-out-outline"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={signOut}
          />
          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
          />
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
  settingItem: {
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
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  settingSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  profileInfo: {
    backgroundColor: 'transparent',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    ...typography.body2,
    fontWeight: '500',
  },
  infoValue: {
    ...typography.body2,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  editButtonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 8,
  },
  editForm: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...typography.body2,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body2,
    marginTop: 16,
  },
});

export default AccountSettingsScreen; 