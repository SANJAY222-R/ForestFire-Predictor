import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import RiskBadge from '../components/RiskBadge';

const ResultsScreen = () => {
  const { colors } = useContext(ThemeContext);

  // Mock prediction history data
  const predictionHistory = [
    {
      id: 1,
      date: '2024-01-15 14:30',
      temperature: 32,
      humidity: 25,
      smokeLevel: 280,
      riskLevel: 'high',
      prediction: 'High Fire Risk',
    },
    {
      id: 2,
      date: '2024-01-15 12:15',
      temperature: 28,
      humidity: 45,
      smokeLevel: 150,
      riskLevel: 'moderate',
      prediction: 'Moderate Risk',
    },
    {
      id: 3,
      date: '2024-01-15 10:00',
      temperature: 24,
      humidity: 60,
      smokeLevel: 80,
      riskLevel: 'low',
      prediction: 'Low Risk',
    },
    {
      id: 4,
      date: '2024-01-14 16:45',
      temperature: 30,
      humidity: 35,
      smokeLevel: 200,
      riskLevel: 'moderate',
      prediction: 'Moderate Risk',
    },
    {
      id: 5,
      date: '2024-01-14 14:20',
      temperature: 26,
      humidity: 55,
      smokeLevel: 90,
      riskLevel: 'low',
      prediction: 'Low Risk',
    },
    {
      id: 6,
      date: '2024-01-14 11:30',
      temperature: 22,
      humidity: 70,
      smokeLevel: 60,
      riskLevel: 'low',
      prediction: 'Low Risk',
    },
  ];

  const renderPredictionCard = ({ item }) => (
    <View style={[styles.predictionCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
        <RiskBadge riskLevel={item.riskLevel} />
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
          <Text style={[styles.valueText, { color: colors.text }]}>{item.smokeLevel}ppm</Text>
        </View>
      </View>
    </View>
  );

  const getStatsData = () => {
    const total = predictionHistory.length;
    const high = predictionHistory.filter(p => p.riskLevel === 'high').length;
    const moderate = predictionHistory.filter(p => p.riskLevel === 'moderate').length;
    const low = predictionHistory.filter(p => p.riskLevel === 'low').length;
    
    return { total, high, moderate, low };
  };

  const stats = getStatsData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Prediction History</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Review your past fire risk assessments</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{stats.total}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Predictions</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.highRisk + '20', shadowColor: colors.shadow }]}>
              <Text style={[styles.statNumber, { color: colors.highRisk }]}>{stats.high}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>High Risk</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.moderateRisk + '20', shadowColor: colors.shadow }]}>
              <Text style={[styles.statNumber, { color: colors.moderateRisk }]}>{stats.moderate}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Moderate Risk</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.lowRisk + '20', shadowColor: colors.shadow }]}>
              <Text style={[styles.statNumber, { color: colors.lowRisk }]}>{stats.low}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Low Risk</Text>
            </View>
          </View>
        </View>

        {/* Predictions List */}
        <View style={styles.listContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Recent Predictions</Text>
          <FlatList
            data={predictionHistory}
            renderItem={renderPredictionCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 16,
  },
  predictionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    ...typography.body2,
    marginLeft: 6,
  },
  inputValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  valueLabel: {
    ...typography.caption,
    marginLeft: 4,
    marginRight: 4,
  },
  valueText: {
    ...typography.caption,
    fontWeight: '600',
  },
});

export default ResultsScreen;