import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import PredictionInputScreen from '../screens/PredictionInputScreen';
import ResultsScreen from '../screens/ResultsScreen';
import AIChatbotScreen from '../screens/AIChatbotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import NotificationPreferencesScreen from "../screens/NotificationPreferencesScreen";
import LocationSettingsScreen from "../screens/LocationSettingsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: colors.background,
          width: 320,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        sceneContainerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="PredictionInput"
        component={PredictionInputScreen}
        options={{
          title: "Fire Risk Prediction",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: "Prediction History",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="AIChatbot"
        component={AIChatbotScreen}
        options={{
          title: "AI Assistant",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: true,
        }}
      />
      <Drawer.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AccountSettings"
        component={AccountSettingsScreen}
        options={{
          title: "Account Settings",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
        options={{
          title: "Notification Preferences",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="LocationSettings"
        component={LocationSettingsScreen}
        options={{
          title: "Location Settings",
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          title: "Help & Support",
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
}
