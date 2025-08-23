import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

const defaultColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#007AFF',
  border: '#E0E0E0',
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  info: '#5856D6',
  highRisk: '#FF3B30',
  moderateRisk: '#FF9500',
  lowRisk: '#34C759',
  textLight: '#999999',
  cardBackground: '#FFFFFF',
};

/**
 * A wrapper component that provides safe area insets and consistent theming for screens
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {ViewStyle} [props.style] - Additional styles to apply to the container
 * @param {string[]} [props.edges] - Safe area edges to respect
 * @param {boolean} [props.fullScreen] - Whether the screen should take up the full height
 * @returns {React.ReactElement}
 */
export default function ScreenWrapper({ 
  children, 
  style,
  edges = ['top', 'right', 'left'],
  fullScreen = false,
}) {
  const fallbackTheme = { colors: defaultColors };
  const theme = useTheme() || fallbackTheme;
  const { colors } = theme;

  return (
    <SafeAreaView 
      edges={edges} 
      style={[
        styles.safeArea, 
        { backgroundColor: colors.background },
        fullScreen && styles.fullScreen
      ]}
    >
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  fullScreen: {
    height: '100%',
  }
});
