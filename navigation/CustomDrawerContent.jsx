import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { useAuth } from '../utils/auth';

const menuItems = [
  {
    name: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    label: 'Dashboard',
    route: 'Home'
  },
  {
    name: 'AIChatbot',
    icon: 'chatbubble-outline',
    activeIcon: 'chatbubble',
    label: 'AI Assistant',
    route: 'AIChatbot'
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    activeIcon: 'person',
    label: 'Profile',
    route: 'Profile'
  },
  {
    name: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
    label: 'Settings',
    route: 'Settings'
  }
];

export default function CustomDrawerContent(props) {
  const { isSignedIn, signOut, user } = useAuth();
  const { colors } = useTheme();
  const { state, navigation } = props;

  // Fallback colors in case theme context is not available
  const fallbackColors = {
    background: '#FFF8DC',
    primary: '#FFA500',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    textLight: '#999999',
    error: '#FF4444',
    border: '#E0E0E0',
  };

  const safeColors = colors || fallbackColors;

  const handleNavigation = (routeName) => {
    navigation.navigate(routeName);
    navigation.closeDrawer();
  };

  const handleAuthAction = () => {
    if (isSignedIn) {
      signOut();
    }
    navigation.closeDrawer();
  };

    return (
    <SafeAreaView style={[styles.container, { backgroundColor: safeColors.background }]}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={[styles.header, { borderBottomColor: safeColors.border }]}>
          <View style={[styles.logoContainer, { backgroundColor: safeColors.primary }]}>
            <Ionicons name="leaf" size={32} color={safeColors.surface} />
          </View>
          <Text style={[styles.appTitle, { color: safeColors.text }]}>
            Forest Fire Predictor
          </Text>
          <Text style={[styles.appSubtitle, { color: safeColors.textSecondary }]}>
            AI-Powered Fire Risk Assessment
          </Text>

          {/* --- MODIFIED USER INFO BLOCK --- */}
          {/* This block now correctly displays Firebase user data and only renders if a user is signed in. */}
          {isSignedIn && user && (
            <View style={[styles.userInfo, { backgroundColor: safeColors.surface }]}>
              <View style={[styles.avatar, { backgroundColor: safeColors.primary }]}>
                <Ionicons name="person" size={20} color={safeColors.surface} />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: safeColors.text }]}>
                  {/* Use Firebase's displayName property */}
                  {user.displayName || 'Unnamed User'}
                </Text>
                <Text style={[styles.userEmail, { color: safeColors.textSecondary }]}>
                  {/* Use Firebase's email property, no more placeholders */}
                  {user.email}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = state.routes[state.index].name === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.menuItem,
                  isActive && { backgroundColor: safeColors.primary + '20' }
                ]}
                onPress={() => handleNavigation(item.name)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  isActive && { backgroundColor: safeColors.primary }
                ]}>
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={22}
                    color={isActive ? safeColors.surface : safeColors.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.menuText,
                  { color: isActive ? safeColors.primary : safeColors.text },
                  isActive && styles.activeMenuText
                ]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: safeColors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Section - Sign Out and Version */}
      <View style={styles.bottomSection}>
        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: safeColors.border }]} />

        {/* Auth Section */}
        <View style={styles.authContainer}>
          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: isSignedIn ? safeColors.error : safeColors.primary }
            ]}
            onPress={handleAuthAction}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSignedIn ? 'log-out-outline' : 'log-in-outline'}
              size={20}
              color={safeColors.surface}
            />
            <Text style={[styles.authButtonText, { color: safeColors.surface }]}>
              {isSignedIn ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: safeColors.textLight }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.footerText, { color: safeColors.textLight }]}>
            © 2024 Forest Fire Predictor
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    ...typography.caption,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...typography.body2,
    fontWeight: '600',
  },
  userEmail: {
    ...typography.caption,
    marginTop: 2,
  },
  menuContainer: {
    paddingTop: 12,
    paddingHorizontal: 12,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 2,
    position: 'relative',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    ...typography.body2,
    flex: 1,
  },
  activeMenuText: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 12,
    width: 3,
    height: 18,
    borderRadius: 1.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  authContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authButtonText: {
    ...typography.button,
    marginLeft: 8,
  },
  bottomSection: {
    paddingBottom: 20,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: 2,
  },
});
