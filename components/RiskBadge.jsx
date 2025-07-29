import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const RiskBadge = ({ riskLevel, size = 'medium' }) => {
  const { colors } = useContext(ThemeContext);

  const getRiskConfig = () => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return {
          color: colors.highRisk,
          icon: 'flame',
          text: '🔥 High Risk',
          bgColor: colors.highRisk + '20',
        };
      case 'moderate':
        return {
          color: colors.moderateRisk,
          icon: 'warning',
          text: '🟡 Moderate Risk',
          bgColor: colors.moderateRisk + '20',
        };
      case 'low':
        return {
          color: colors.lowRisk,
          icon: 'checkmark-circle',
          text: '✅ Low Risk',
          bgColor: colors.lowRisk + '20',
        };
      default:
        return {
          color: colors.textSecondary,
          icon: 'help-circle',
          text: '❓ Unknown',
          bgColor: colors.textSecondary + '20',
        };
    }
  };

  const config = getRiskConfig();
  const sizeStyles = size === 'large' ? styles.large : styles.medium;

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }, sizeStyles]}>
      <Ionicons 
        name={config.icon} 
        size={size === 'large' ? 20 : 16} 
        color={config.color} 
        style={styles.icon}
      />
      <Text style={[styles.text, { color: config.color }, sizeStyles.text]}>
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
    text: {
      ...typography.caption,
      fontSize: 12,
    },
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    text: {
      ...typography.body2,
      fontSize: 14,
    },
  },
});

export default RiskBadge;