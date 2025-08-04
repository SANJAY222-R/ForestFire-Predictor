import React, { useState, useContext, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../theme/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { useUserSync } from '../hooks/useUserSync';

export function AuthGate({ children }) {
  const { isLoaded, isSignedIn, user } = useAuth();
  const { syncUser } = useUserSync();
  const [showSignup, setShowSignup] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { colors } = useContext(ThemeContext);

  // Auto-sync user when they sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      console.log("🔄 AuthGate: Auto-syncing user...");
      console.log("👤 AuthGate: User info:", {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log("🔧 AuthGate: This will update existing users with latest data");
      setSyncing(true);
      syncUser()
        .then(() => {
          console.log("✅ AuthGate: User synced successfully");
          console.log("🎯 Existing users will now have their data updated!");
        })
        .catch((error) => {
          console.error("❌ AuthGate: Sync failed:", error);
        })
        .finally(() => {
          console.log("🏁 AuthGate: Sync process finished");
          setSyncing(false);
        });
    }
  }, [isLoaded, isSignedIn, user, syncUser]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return showSignup ? (
      <SignupScreen switchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginScreen switchToSignup={() => setShowSignup(true)} />
    );
  }

  // Show loading while syncing
  if (syncing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Syncing user data...</Text>
      </View>
    );
  }

  return children;
}