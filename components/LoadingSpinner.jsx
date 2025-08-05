import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const LoadingSpinner = ({ text = 'Loading...', size = 'large' }) => {
  const { colors } = useTheme();
  
  const spinnerColor = color || colors.primary;

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator 
        size={size} 
        color={spinnerColor} 
      />
      {text && (
        <Text style={[
          styles.text, 
          { color: colors.textSecondary },
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