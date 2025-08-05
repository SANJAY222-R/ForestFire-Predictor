import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const RiskBadge = ({ riskLevel, size = 'medium' }) => {
  const { colors } = useTheme();

  // Fallback colors in case theme context is not available
  const fallbackColors = {
    highRisk: '#FF4444',
    moderateRisk: '#FFA500',
    lowRisk: '#4CAF50',
    textSecondary: '#666666',
  };

  const safeColors = colors || fallbackColors;

  const getRiskConfig = () => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return {
          color: safeColors.highRisk,
          icon: 'flame',
          text: '🔥 High Risk',
          bgColor: safeColors.highRisk + '20',
        };
      case 'moderate':
        return {
          color: safeColors.moderateRisk,
          icon: 'warning',
          text: '🟡 Moderate Risk',
          bgColor: safeColors.moderateRisk + '20',
        };
      case 'low':
        return {
          color: safeColors.lowRisk,
          icon: 'checkmark-circle',
          text: '✅ Low Risk',
          bgColor: safeColors.lowRisk + '20',
        };
      default:
        return {
          color: safeColors.textSecondary,
          icon: 'help-circle',
          text: '❓ Unknown',
          bgColor: safeColors.textSecondary + '20',
        };
    }
  };

  const config = getRiskConfig();
  const sizeStyles = size === 'large' ? styles.large : styles.medium;
  const textStyles = size === 'large' ? styles.largeText : styles.mediumText;

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }, sizeStyles]}>
      <Ionicons 
        name={config.icon} 
        size={size === 'large' ? 20 : 16} 
        color={config.color} 
        style={styles.icon}
      />
      <Text style={[styles.text, { color: config.color }, textStyles]}>
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mediumText: {
    ...typography.caption,
    fontSize: 12,
  },
  largeText: {
    ...typography.body2,
    fontSize: 14,
  },
});

export default RiskBadge;