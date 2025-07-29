import React, { useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../theme/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

export function AuthGate({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const { colors } = useContext(ThemeContext);

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

  return children;
}