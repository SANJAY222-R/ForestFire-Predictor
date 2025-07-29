import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../theme/ThemeContext";
import { typography } from "../theme/typography";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import PredictionInputScreen from "../screens/PredictionInputScreen";
import ResultsScreen from "../screens/ResultsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AIChatbotScreen from "../screens/AIChatbotScreen";
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { colors } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        // These options are for the default drawer content, not our custom one.
        // The logic is now handled inside CustomDrawerContent.
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="PredictionInput"
        component={PredictionInputScreen}
        options={{
          title: "Fire Risk Prediction",
        }}
      />
      <Drawer.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: "Prediction History",
        }}
      />
      <Drawer.Screen
        name="AIChatbot"
        component={AIChatbotScreen}
        options={{
          title: "AI Assistant",
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Signup" component={SignupScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appTitle: {
    ...typography.h3,
    textAlign: "center",
  },
  appSubtitle: {
    ...typography.caption,
    textAlign: "center",
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 8,
  },
  menuText: {
    ...typography.body1,
    marginLeft: 20, // Increased margin for better spacing
  },
  selectedMenuText: {
    fontWeight: "bold",
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
  },
  footerText: {
    ...typography.caption,
    textAlign: "center",
  },
});
