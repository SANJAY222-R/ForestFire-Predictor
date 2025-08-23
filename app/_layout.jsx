import React from 'react';
import { Stack } from "expo-router";
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../theme/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import Toast from 'react-native-toast-message';
import CustomToast from '../components/CustomToast';

const RootLayoutNav = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: 'fade',
        animationDuration: 200,
      }}
    />
  );
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <RootLayoutNav />
              <Toast 
                config={{
                  success: (props) => <CustomToast {...props} type="success" />,
                  error: (props) => <CustomToast {...props} type="error" />,
                  info: (props) => <CustomToast {...props} type="info" />,
                  warning: (props) => <CustomToast {...props} type="warning" />,
                }}
                position="top"
                visibilityTime={3000}
                autoHide={true}
                topOffset={40}
              />
            </View>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
