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

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { colors } = useContext(ThemeContext);
  // Get the name of the currently focused route from the navigation state
  const activeRouteName = props.state.routes[props.state.index].name;

  const menuItems = [
    { name: "Home", icon: "home-outline", screen: "Home" },
    { name: "Prediction", icon: "search-outline", screen: "PredictionInput" },
    { name: "Results", icon: "bar-chart-outline", screen: "Results" },
    { name: "AI Assistant", icon: "chatbubble-outline", screen: "AIChatbot" },
    { name: "Profile", icon: "person-outline", screen: "Profile" },
    { name: "Settings", icon: "settings-outline", screen: "Settings" },
  ];

  return (
    <View
      style={[styles.drawerContainer, { backgroundColor: colors.background }]}
    >
      <View style={[styles.drawerHeader, { backgroundColor: colors.primary }]}>
        <View
          style={[styles.logoContainer, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="flame" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.appTitle, { color: colors.surface }]}>
          Forest Fire Predictor
        </Text>
        <Text
          style={[styles.appSubtitle, { color: colors.surface, opacity: 0.8 }]}
        >
          Stay Safe, Stay Informed
        </Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          // Check if the current menu item is the active route
          const isSelected = activeRouteName === item.screen;

          return (
            <TouchableOpacity
              key={index}
              // Apply conditional style for the background of the selected item
              style={[
                styles.menuItem,
                isSelected && {
                  backgroundColor: colors.primary + "20", // Add slight primary background
                  borderRadius: 8,
                },
              ]}
              onPress={() => {
                props.navigation.navigate(item.screen);
                props.navigation.closeDrawer();
              }}
            >
              <Ionicons
                name={item.icon}
                size={24}
                // Apply conditional color for the icon
                color={isSelected ? colors.primary : colors.textSecondary}
              />
              <Text
                // Apply conditional style for the text
                style={[
                  styles.menuText,
                  { color: isSelected ? colors.primary : colors.text },
                  isSelected && styles.selectedMenuText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.drawerFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textLight }]}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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

export default DrawerNavigator;
