import React, { useContext } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const LoadingSpinner = ({ 
  size = 'large', 
  color = null, 
  text = 'Loading...', 
  containerStyle = {},
  textStyle = {} 
}) => {
  const { colors } = useContext(ThemeContext);
  
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