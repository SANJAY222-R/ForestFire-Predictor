import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const Toast = ({ text1, text2, type, onPress, onHide }) => {
  const { colors } = useTheme();

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          backgroundColor: colors.success + '20',
          borderColor: colors.success,
          iconColor: colors.success,
          textColor: colors.text,
        };
      case 'error':
        return {
          icon: 'close-circle',
          backgroundColor: colors.error + '20',
          borderColor: colors.error,
          iconColor: colors.error,
          textColor: colors.text,
        };
      case 'warning':
        return {
          icon: 'warning',
          backgroundColor: colors.warning + '20',
          borderColor: colors.warning,
          iconColor: colors.warning,
          textColor: colors.text,
        };
      case 'info':
      default:
        return {
          icon: 'information-circle',
          backgroundColor: colors.primary + '20',
          borderColor: colors.primary,
          iconColor: colors.primary,
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
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: config.backgroundColor }]}>
          <Ionicons name={config.icon} size={24} color={config.iconColor} />
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
        <TouchableOpacity onPress={onHide} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={config.textColor} />
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    ...typography.body2,
    opacity: 0.9,
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