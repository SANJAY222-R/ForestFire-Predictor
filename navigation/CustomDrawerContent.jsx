import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView 
} from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const menuItems = [
  {
    name: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    label: 'Dashboard',
    route: 'Home'
  },
  {
    name: 'PredictionInput',
    icon: 'flame-outline',
    activeIcon: 'flame',
    label: 'Fire Risk Prediction',
    route: 'PredictionInput'
  },
  {
    name: 'Results',
    icon: 'analytics-outline',
    activeIcon: 'analytics',
    label: 'Prediction History',
    route: 'Results'
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

  const handleNavigation = (routeName) => {
    navigation.navigate(routeName);
    navigation.closeDrawer();
  };

  const handleAuthAction = () => {
    if (isSignedIn) {
      signOut();
    } else {
      navigation.navigate('Login');
      navigation.closeDrawer();
    }
  };

    return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="leaf" size={32} color={colors.surface} />
          </View>
          <Text style={[styles.appTitle, { color: colors.text }]}>
            Forest Fire Predictor
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
            AI-Powered Fire Risk Assessment
          </Text>

          {isSignedIn && user && (
            <View style={[styles.userInfo, { backgroundColor: colors.surface }]}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="person" size={20} color={colors.surface} />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user.firstName || user.emailAddresses?.[0]?.emailAddress || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {user.emailAddresses?.[0]?.emailAddress || 'user@example.com'}
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
                  isActive && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => handleNavigation(item.name)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer,
                  isActive && { backgroundColor: colors.primary }
                ]}>
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={22}
                    color={isActive ? colors.surface : colors.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.menuText,
                  { color: isActive ? colors.primary : colors.text },
                  isActive && styles.activeMenuText
                ]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bottom Section - Sign Out and Version */}
      <View style={styles.bottomSection}>
        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Auth Section */}
        <View style={styles.authContainer}>
          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: isSignedIn ? colors.error : colors.primary }
            ]}
            onPress={handleAuthAction}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSignedIn ? 'log-out-outline' : 'log-in-outline'}
              size={20}
              color={colors.surface}
            />
            <Text style={[styles.authButtonText, { color: colors.surface }]}>
              {isSignedIn ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textLight }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.textLight }]}>
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