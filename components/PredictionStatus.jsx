import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import RiskBadge from './RiskBadge';

const PredictionStatus = ({ 
  prediction, 
  isProcessing = false, 
  lastUpdate = null,
  onRefresh = null 
}) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    if (isProcessing) return colors.warning;
    if (!prediction) return colors.textSecondary;
    
    switch (prediction.risk_level) {
      case 'critical': return colors.error;
      case 'high': return colors.highRisk;
      case 'moderate': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    if (isProcessing) return 'sync';
    if (!prediction) return 'help-circle-outline';
    
    switch (prediction.risk_level) {
      case 'critical': return 'warning';
      case 'high': return 'alert-circle';
      case 'moderate': return 'information-circle';
      case 'low': return 'checkmark-circle';
      default: return 'help-circle-outline';
    }
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing...';
    if (!prediction) return 'No prediction available';
    return `${prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)} Risk`;
  };

  const getConfidenceText = () => {
    if (!prediction?.confidence_score) return '';
    const confidence = Math.round(prediction.confidence_score * 100);
    return `${confidence}% confidence`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={[styles.title, { color: colors.text }]}>
            ML Prediction Status
          </Text>
        </View>
        
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <Ionicons 
              name={getStatusIcon()} 
              size={24} 
              color={getStatusColor()} 
            />
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusText, { color: colors.text }]}>
                {getStatusText()}
              </Text>
              {prediction && (
                <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                  {getConfidenceText()}
                </Text>
              )}
            </View>
          </View>
          
          {prediction && (
            <RiskBadge riskLevel={prediction.risk_level} />
          )}
        </View>

        {prediction && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Temperature:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {prediction.temperature}°C
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Humidity:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {prediction.humidity}%
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Smoke Level:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {prediction.smoke_level} ppm
              </Text>
            </View>
            
            {prediction.air_quality && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Air Quality:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {prediction.air_quality} AQI
                </Text>
              </View>
            )}
            
            {prediction.wind_speed && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Wind Speed:
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {prediction.wind_speed} km/h
                </Text>
              </View>
            )}
          </View>
        )}

        {lastUpdate && (
          <View style={styles.updateRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.updateText, { color: colors.textSecondary }]}>
              Last update: {lastUpdate}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.h3,
  },
  refreshButton: {
    padding: 4,
  },
  content: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    ...typography.body,
    fontWeight: '600',
  },
  confidenceText: {
    ...typography.caption,
    marginTop: 2,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.caption,
  },
  detailValue: {
    ...typography.body,
    fontWeight: '600',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  updateText: {
    ...typography.caption,
  },
});

export default PredictionStatus; 