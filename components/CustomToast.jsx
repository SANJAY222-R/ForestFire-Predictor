import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const Toast = ({ text1, text2, type, onPress, onHide }) => {
  const { colors } = useTheme();

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark',
          iconColor: '#FFFFFF',
          iconBackground: colors.lowRisk,
          textColor: colors.text,
        };
      case 'error':
        return {
          icon: 'close',
          iconColor: '#FFFFFF',
          iconBackground: colors.highRisk,
          textColor: colors.text,
        };
      case 'warning':
        return {
          icon: 'warning',
          iconColor: '#FFFFFF',
          iconBackground: colors.moderateRisk,
          textColor: colors.text,
        };
      case 'info':
      default:
        return {
          icon: 'information',
          iconColor: '#FFFFFF',
          iconBackground: colors.primary,
          textColor: colors.text,
        };
    }
  };

  const config = getToastConfig(type);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: config.iconBackground }]}>
          <Ionicons name={config.icon} size={20} color={config.iconColor} />
        </View>
        
        <View style={styles.textContainer}>
          {text1 && (
            <Text style={[styles.title, { color: config.textColor }]}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={[styles.message, { color: config.textColor }]}>
              {text2}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={onHide} 
          style={styles.closeButton}
          activeOpacity={0.6}
        >
          <Ionicons name="close" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    ...typography.body1,
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 16,
  },
  message: {
    ...typography.body2,
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default Toast; 