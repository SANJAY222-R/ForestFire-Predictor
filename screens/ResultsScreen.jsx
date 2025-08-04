import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useUserPredictions, usePredictionStats } from '../hooks/useApi';
import { RISK_LEVELS } from '../utils/constants';

const ResultsScreen = () => {
  const { colors } = useContext(ThemeContext);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const { data: predictions, loading, error, refetch } = useUserPredictions({
    risk_level: selectedRiskLevel !== 'all' ? selectedRiskLevel : undefined,
    time_range: selectedTimeRange !== 'all' ? selectedTimeRange : undefined,
  });

  const { data: stats } = usePredictionStats();

  const renderPredictionCard = ({ item }) => (
    <View style={[styles.predictionCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        <RiskBadge riskLevel={item.risk_level} />
      </View>
      
      <View style={styles.inputValues}>
        <View style={styles.valueItem}>
          <Ionicons name="thermometer-outline" size={16} color={colors.primary} />
          <Text style={[styles.valueLabel, { color: colors.textSecondary }]}>Temp:</Text>
          <Text style={[styles.valueText, { color: colors.text }]}>{item.temperature}°C</Text>
        </View>
        
        <View style={styles.valueItem}>
          <Ionicons name="water-outline" size={16} color={colors.primary} />
          <Text style={[styles.valueLabel, { color: colors.textSecondary }]}>Humidity:</Text>
          <Text style={[styles.valueText, { color: colors.text }]}>{item.humidity}%</Text>
        </View>
        
        <View style={styles.valueItem}>
          <Ionicons name="cloud-outline" size={16} color={colors.primary} />
          <Text style={[styles.valueLabel, { color: colors.textSecondary }]}>Smoke:</Text>
          <Text style={[styles.valueText, { color: colors.text }]}>{item.smoke_level}ppm</Text>
        </View>
      </View>

      {item.confidence_score && (
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
            Confidence: {(item.confidence_score * 100).toFixed(1)}%
          </Text>
        </View>
      )}

      {item.risk_factors && item.risk_factors.length > 0 && (
        <View style={styles.factorsContainer}>
          <Text style={[styles.factorsTitle, { color: colors.text }]}>Risk Factors:</Text>
          {item.risk_factors.slice(0, 2).map((factor, index) => (
            <Text key={index} style={[styles.factorItem, { color: colors.textSecondary }]}>
              • {factor}
            </Text>
          ))}
          {item.risk_factors.length > 2 && (
            <Text style={[styles.moreFactors, { color: colors.primary }]}>
              +{item.risk_factors.length - 2} more factors
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const FilterButton = ({ title, value, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterButtonText,
        { color: isSelected ? colors.surface : colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color = colors.primary }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner text="Loading prediction history..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorMessage 
          error={error} 
          onRetry={refetch}
          title="Failed to load predictions"
        />
      </SafeAreaView>
    );
  }

  const predictionHistory = predictions || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Prediction History</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your fire risk assessment history
          </Text>
        </View>

        {/* Statistics */}
        {stats && (
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Statistics</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon="analytics-outline"
                value={stats.total_predictions || 0}
                label="Total Predictions"
                color={colors.primary}
              />
              <StatCard
                icon="flame-outline"
                value={stats.high_risk_predictions || 0}
                label="High Risk"
                color={colors.highRisk}
              />
              <StatCard
                icon="checkmark-circle-outline"
                value={stats.low_risk_predictions || 0}
                label="Low Risk"
                color={colors.lowRisk}
              />
              <StatCard
                icon="trending-up-outline"
                value={stats.average_confidence ? `${(stats.average_confidence * 100).toFixed(1)}%` : 'N/A'}
                label="Avg Confidence"
                color={colors.info}
              />
            </View>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🔍 Filters</Text>
          
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Risk Level:</Text>
          <View style={styles.filterRow}>
            <FilterButton
              title="All"
              value="all"
              isSelected={selectedRiskLevel === 'all'}
              onPress={() => setSelectedRiskLevel('all')}
            />
            <FilterButton
              title="Low"
              value={RISK_LEVELS.LOW}
              isSelected={selectedRiskLevel === RISK_LEVELS.LOW}
              onPress={() => setSelectedRiskLevel(RISK_LEVELS.LOW)}
            />
            <FilterButton
              title="Moderate"
              value={RISK_LEVELS.MODERATE}
              isSelected={selectedRiskLevel === RISK_LEVELS.MODERATE}
              onPress={() => setSelectedRiskLevel(RISK_LEVELS.MODERATE)}
            />
            <FilterButton
              title="High"
              value={RISK_LEVELS.HIGH}
              isSelected={selectedRiskLevel === RISK_LEVELS.HIGH}
              onPress={() => setSelectedRiskLevel(RISK_LEVELS.HIGH)}
            />
          </View>

          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Time Range:</Text>
          <View style={styles.filterRow}>
            <FilterButton
              title="All Time"
              value="all"
              isSelected={selectedTimeRange === 'all'}
              onPress={() => setSelectedTimeRange('all')}
            />
            <FilterButton
              title="Last 7 Days"
              value="7d"
              isSelected={selectedTimeRange === '7d'}
              onPress={() => setSelectedTimeRange('7d')}
            />
            <FilterButton
              title="Last 30 Days"
              value="30d"
              isSelected={selectedTimeRange === '30d'}
              onPress={() => setSelectedTimeRange('30d')}
            />
          </View>
        </View>

        {/* Predictions List */}
        <View style={styles.predictionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📋 Predictions ({predictionHistory.length})
            </Text>
            <TouchableOpacity onPress={refetch} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {predictionHistory.length > 0 ? (
            <FlatList
              data={predictionHistory}
              renderItem={renderPredictionCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Ionicons name="document-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No predictions found
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {selectedRiskLevel !== 'all' || selectedTimeRange !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Create your first prediction to see it here'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    ...typography.h2,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body2,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterLabel: {
    ...typography.body2,
    marginBottom: 8,
    marginTop: 16,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  predictionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    padding: 8,
  },
  predictionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.caption,
    marginLeft: 4,
  },
  inputValues: {
    marginBottom: 12,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  valueLabel: {
    ...typography.body2,
    marginLeft: 8,
    marginRight: 8,
  },
  valueText: {
    ...typography.body2,
    fontWeight: '600',
  },
  confidenceContainer: {
    marginBottom: 12,
  },
  confidenceLabel: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  factorsContainer: {
    marginTop: 8,
  },
  factorsTitle: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: 4,
  },
  factorItem: {
    ...typography.caption,
    marginLeft: 8,
    marginBottom: 2,
  },
  moreFactors: {
    ...typography.caption,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTitle: {
    ...typography.h3,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body2,
    textAlign: 'center',
  },
});

export default ResultsScreen;