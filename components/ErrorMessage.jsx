import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  title = 'Error',
  containerStyle = {},
  showIcon = true
}) => {
  const { colors } = useTheme();

  // Fallback colors in case theme context is not available
  const fallbackColors = {
    error: '#FF4444',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#FFA500',
    surface: '#FFFFFF',
  };

  const safeColors = colors || fallbackColors;

  if (!error) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      {showIcon && (
        <View style={[styles.iconContainer, { backgroundColor: safeColors.error + '20' }]}>
          <Ionicons name="alert-circle-outline" size={24} color={safeColors.error} />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: safeColors.text }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: safeColors.textSecondary }]}>
          {error}
        </Text>
      </View>

      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: safeColors.primary }]}
          onPress={onRetry}
        >
          <Ionicons name="refresh" size={16} color={safeColors.surface} />
          <Text style={[styles.retryText, { color: safeColors.surface }]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    marginBottom: 4,
  },
  message: {
    ...typography.body2,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  retryText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ErrorMessage; 