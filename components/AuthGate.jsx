import React, { useState, useContext, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { useUserSync } from '../hooks/useUserSync';

export function AuthGate({ children }) {
  const { isLoaded, isSignedIn, user } = useAuth();
  const { syncUser } = useUserSync();
  const [showSignup, setShowSignup] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { colors } = useTheme();

  // Fallback colors in case theme context is not available
  const fallbackColors = {
    background: '#FFF8DC',
    primary: '#FFA500',
    text: '#000000',
  };

  const safeColors = colors || fallbackColors;

  // Auto-sync user when they sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setSyncing(true);
      syncUser()
        .then(() => {
          // User synced successfully
        })
        .catch((error) => {
          console.error('AuthGate: Sync failed:', error);
        })
        .finally(() => {
          setSyncing(false);
        });
    }
  }, [isLoaded, isSignedIn, user, syncUser]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: safeColors.background }}>
        <ActivityIndicator size="large" color={safeColors.primary} />
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: safeColors.background }}>
        <ActivityIndicator size="large" color={safeColors.primary} />
        <Text style={{ marginTop: 16, color: safeColors.text }}>Syncing user data...</Text>
      </View>
    );
  }

  return children;
}