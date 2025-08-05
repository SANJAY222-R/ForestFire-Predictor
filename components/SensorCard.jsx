import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const SensorCard = ({ icon, title, value, unit, recommendation, riskLevel }) => {
  const { colors } = useTheme();

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return colors.highRisk;
      case 'moderate': return colors.moderateRisk;
      case 'low': return colors.lowRisk;
      default: return colors.info;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
      </View>
      
      {recommendation && (
        <View style={[styles.recommendationContainer, { borderLeftColor: getRiskColor() }]}>
          <Text style={[styles.recommendation, { color: getRiskColor() }]}>
            {recommendation}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    ...typography.cardTitle,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  unit: {
    ...typography.body2,
    marginLeft: 4,
  },
  recommendationContainer: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
  },
  recommendation: {
    ...typography.body2,
    fontWeight: '500',
  },
});

export default SensorCard;