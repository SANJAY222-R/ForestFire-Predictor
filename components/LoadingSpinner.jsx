import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = 'large', 
  containerStyle = {},
  textStyle = {}
}) => {
  const { colors } = useTheme();
  
  // Fallback colors in case theme context is not available
  const fallbackColors = {
    primary: '#FFA500',
    textSecondary: '#666666',
  };

  const safeColors = colors || fallbackColors;
  const spinnerColor = safeColors.primary;

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator 
        size={size} 
        color={spinnerColor} 
      />
      {text && (
        <Text style={[
          styles.text, 
          { color: safeColors.textSecondary },
          textStyle
        ]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    ...typography.body2,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoadingSpinner; 