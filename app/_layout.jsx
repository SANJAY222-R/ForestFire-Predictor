import React from 'react';
import { Stack } from "expo-router";
import 'react-native-gesture-handler';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { ThemeProvider } from '../theme/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

const tokenCache = {
  getToken: key => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};



export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey="pk_test_Y2hhcm1lZC1tb29zZS01Ni5jbGVyay5hY2NvdW50cy5kZXYk"
        tokenCache={tokenCache}
      >
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}