import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useTheme } from '../theme/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { useUserSync } from '../hooks/useUserSync';

export function AuthGate({ children }) {
  const { isLoaded, isSignedIn, user, loading } = useFirebaseAuth();
  const { syncUser } = useUserSync();
  const [showSignup, setShowSignup] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { colors } = useTheme();

  // Debug logging
  useEffect(() => {
    console.log('🔍 AuthGate Debug:', {
      isLoaded,
      isSignedIn,
      user: !!user,
      authError,
      loading
    });
  }, [isLoaded, isSignedIn, user, authError, loading]);

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
        .catch((error) => {
          console.error('AuthGate: Sync failed:', error);
        })
        .finally(() => {
          setSyncing(false);
        });
    }
  }, [isLoaded, isSignedIn, user, syncUser]);

  // Show loading state while checking auth status
  if (!isLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: safeColors.background }}>
        <ActivityIndicator size="large" color={safeColors.primary} />
        <Text style={{ marginTop: 10, color: safeColors.text }}>Loading authentication...</Text>
        {authError && (
          <Text style={{ marginTop: 10, color: safeColors.error, textAlign: 'center', paddingHorizontal: 20 }}>
            {authError}
          </Text>
        )}
      </View>
    );
  }

  // Show auth screens if not signed in
  if (!isSignedIn) {
    return showSignup ? (
      <SignupScreen switchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginScreen switchToSignup={() => setShowSignup(true)} />
    );
  }

  // Show loading state while syncing user data
  if (syncing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: safeColors.background }}>
        <ActivityIndicator size="large" color={safeColors.primary} />
        <Text style={{ marginTop: 10, color: safeColors.text }}>Syncing your data...</Text>
      </View>
    );
  }

  // User is signed in and data is synced, show the app
  return children;
}