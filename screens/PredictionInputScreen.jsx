import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import apiService from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { VALIDATION_RULES, DEFAULT_VALUES, RISK_LEVELS } from '../utils/constants';

const PredictionInputScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [smokeLevel, setSmokeLevel] = useState('');
  const [airQuality, setAirQuality] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [windDirection, setWindDirection] = useState('');
  const [atmosphericPressure, setAtmosphericPressure] = useState('');
  const [uvIndex, setUvIndex] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [resultAnimation] = useState(new Animated.Value(0));

  const { createPrediction, loading, error } = useCreatePrediction();

  const validateInput = (value, field) => {
    const rules = VALIDATION_RULES[field.toUpperCase()];
    if (!rules) return true;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    
    return numValue >= rules.MIN && numValue <= rules.MAX;
  };

  const getFieldError = (value, field) => {
    if (!value) return null;
    if (!validateInput(value, field)) {
      const rules = VALIDATION_RULES[field.toUpperCase()];
      return `${field} must be between ${rules.MIN} and ${rules.MAX}`;
    }
    return null;
  };

  const handlePredict = async () => {
    // Validate required fields
    if (!temperature || !humidity || !smokeLevel) {
      Alert.alert('Missing Information', 'Please fill in temperature, humidity, and smoke level.');
      return;
    }

    // Validate all inputs
    const fields = [
      { value: temperature, name: 'temperature' },
      { value: humidity, name: 'humidity' },
      { value: smokeLevel, name: 'smoke_level' },
      { value: airQuality, name: 'air_quality' },
      { value: windSpeed, name: 'wind_speed' },
      { value: windDirection, name: 'wind_direction' },
      { value: atmosphericPressure, name: 'atmospheric_pressure' },
      { value: uvIndex, name: 'uv_index' },
      { value: soilMoisture, name: 'soil_moisture' },
      { value: rainfall, name: 'rainfall' },
    ];

    const errors = fields
      .filter(field => field.value)
      .map(field => getFieldError(field.value, field.name))
      .filter(error => error);

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    try {
      // Prepare prediction data
      const predictionData = {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        smoke_level: parseFloat(smokeLevel),
        ...(airQuality && { air_quality: parseFloat(airQuality) }),
        ...(windSpeed && { wind_speed: parseFloat(windSpeed) }),
        ...(windDirection && { wind_direction: parseFloat(windDirection) }),
        ...(atmosphericPressure && { atmospheric_pressure: parseFloat(atmosphericPressure) }),
        ...(uvIndex && { uv_index: parseFloat(uvIndex) }),
        ...(soilMoisture && { soil_moisture: parseFloat(soilMoisture) }),
        ...(rainfall && { rainfall: parseFloat(rainfall) }),
      };

      const result = await createPrediction(predictionData);
      
      setPrediction({
        riskLevel: result.risk_level,
        riskText: getRiskText(result.risk_level),
        riskDescription: getRiskDescription(result.risk_level),
        confidenceScore: result.confidence_score,
        riskFactors: result.risk_factors,
        recommendations: result.recommendations,
        timestamp: new Date().toLocaleString(),
        inputs: predictionData
      });
      
      // Animate result card
      Animated.spring(resultAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

    } catch (error) {
      Alert.alert('Prediction Error', error.message || 'Failed to create prediction. Please try again.');
    }
  };

  const getRiskText = (riskLevel) => {
    switch (riskLevel) {
      case RISK_LEVELS.CRITICAL:
        return '🚨 Critical Fire Risk';
      case RISK_LEVELS.HIGH:
        return '🔥 High Fire Risk';
      case RISK_LEVELS.MODERATE:
        return '🟡 Moderate Risk';
      case RISK_LEVELS.LOW:
      default:
        return '✅ Safe / Low Risk';
    }
  };

  const getRiskDescription = (riskLevel) => {
    switch (riskLevel) {
      case RISK_LEVELS.CRITICAL:
        return 'Critical conditions detected! Immediate evacuation recommended. Contact emergency services immediately.';
      case RISK_LEVELS.HIGH:
        return 'Dangerous conditions detected! Consider evacuation and alert authorities.';
      case RISK_LEVELS.MODERATE:
        return 'Elevated risk conditions. Increase monitoring and prepare safety measures.';
      case RISK_LEVELS.LOW:
      default:
        return 'Current conditions indicate minimal fire risk. Continue monitoring.';
    }
  };

  const resetForm = () => {
    setTemperature('');
    setHumidity('');
    setSmokeLevel('');
    setAirQuality('');
    setWindSpeed('');
    setWindDirection('');
    setAtmosphericPressure('');
    setUvIndex('');
    setSoilMoisture('');
    setRainfall('');
    setPrediction(null);
    resultAnimation.setValue(0);
  };

  const InputField = ({ 
    icon, 
    label, 
    value, 
    onChangeText, 
    unit, 
    placeholder, 
    keyboardType = 'numeric',
    required = false 
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          {label} {required && '*'}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: colors.surface, 
            color: colors.text,
            borderColor: getFieldError(value, label.toLowerCase()) ? colors.error : colors.border
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
      />
      {getFieldError(value, label.toLowerCase()) && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {getFieldError(value, label.toLowerCase())}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingSpinner text="Analyzing fire risk..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Fire Risk Prediction</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter current sensor readings to assess fire risk
          </Text>
        </View>

        {error && (
          <ErrorMessage 
            error={error} 
            title="Prediction Error"
            containerStyle={styles.errorContainer}
          />
        )}

        <View style={styles.formContainer}>
          {/* Required Fields */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Required Readings</Text>
          
          <InputField
            icon="thermometer-outline"
            label="Temperature"
            value={temperature}
            onChangeText={setTemperature}
            unit="°C"
            placeholder="25"
            required
          />
          
          <InputField
            icon="water-outline"
            label="Humidity"
            value={humidity}
            onChangeText={setHumidity}
            unit="%"
            placeholder="50"
            required
          />
          
          <InputField
            icon="cloud-outline"
            label="Smoke Level"
            value={smokeLevel}
            onChangeText={setSmokeLevel}
            unit="ppm"
            placeholder="50"
            required
          />

          {/* Optional Environmental Data */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Environmental Data (Optional)</Text>
          
          <InputField
            icon="airplane-outline"
            label="Air Quality"
            value={airQuality}
            onChangeText={setAirQuality}
            unit="AQI"
            placeholder="50"
          />
          
          <InputField
            icon="speedometer-outline"
            label="Wind Speed"
            value={windSpeed}
            onChangeText={setWindSpeed}
            unit="km/h"
            placeholder="5"
          />
          
          <InputField
            icon="compass-outline"
            label="Wind Direction"
            value={windDirection}
            onChangeText={setWindDirection}
            unit="°"
            placeholder="0"
          />
          
          <InputField
            icon="speedometer-outline"
            label="Atmospheric Pressure"
            value={atmosphericPressure}
            onChangeText={setAtmosphericPressure}
            unit="hPa"
            placeholder="1013.25"
          />
          
          <InputField
            icon="sunny-outline"
            label="UV Index"
            value={uvIndex}
            onChangeText={setUvIndex}
            unit=""
            placeholder="5"
          />
          
          <InputField
            icon="leaf-outline"
            label="Soil Moisture"
            value={soilMoisture}
            onChangeText={setSoilMoisture}
            unit="%"
            placeholder="50"
          />
          
          <InputField
            icon="rainy-outline"
            label="Rainfall"
            value={rainfall}
            onChangeText={setRainfall}
            unit="mm"
            placeholder="0"
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.predictButton, { backgroundColor: colors.primary }]}
              onPress={handlePredict}
              disabled={loading}
            >
              <Ionicons name="analytics-outline" size={20} color={colors.surface} />
              <Text style={[styles.buttonText, { color: colors.surface }]}>
                {loading ? 'Analyzing...' : 'Analyze Fire Risk'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.border }]}
              onPress={resetForm}
            >
              <Text style={[styles.resetButtonText, { color: colors.textSecondary }]}>
                Reset Form
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Prediction Result */}
        {prediction && (
          <Animated.View
            style={[
              styles.resultContainer,
              {
                backgroundColor: colors.surface,
                transform: [{
                  scale: resultAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
                opacity: resultAnimation,
              },
            ]}
          >
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>
                Prediction Result
              </Text>
              <RiskBadge riskLevel={prediction.riskLevel} />
            </View>

            <Text style={[styles.riskText, { color: colors.text }]}>
              {prediction.riskText}
            </Text>

            <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>
              {prediction.riskDescription}
            </Text>

            {prediction.confidenceScore && (
              <View style={styles.confidenceContainer}>
                <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                  Confidence Score:
                </Text>
                <Text style={[styles.confidenceValue, { color: colors.primary }]}>
                  {(prediction.confidenceScore * 100).toFixed(1)}%
                </Text>
              </View>
            )}

            {prediction.riskFactors && prediction.riskFactors.length > 0 && (
              <View style={styles.factorsContainer}>
                <Text style={[styles.factorsTitle, { color: colors.text }]}>
                  Risk Factors:
                </Text>
                {prediction.riskFactors.map((factor, index) => (
                  <Text key={index} style={[styles.factorItem, { color: colors.textSecondary }]}>
                    • {factor}
                  </Text>
                ))}
              </View>
            )}

            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                  Recommendations:
                </Text>
                {prediction.recommendations.map((recommendation, index) => (
                  <Text key={index} style={[styles.recommendationItem, { color: colors.textSecondary }]}>
                    • {recommendation}
                  </Text>
                ))}
              </View>
            )}

            <Text style={[styles.timestamp, { color: colors.textLight }]}>
              {prediction.timestamp}
            </Text>
          </Animated.View>
        )}
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
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    ...typography.h2,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body2,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    ...typography.h3,
    marginTop: 20,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    ...typography.cardTitle,
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    ...typography.caption,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    ...typography.button,
    marginLeft: 8,
  },
  resetButton: {
    borderWidth: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    ...typography.body2,
  },
  resultContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    ...typography.h3,
  },
  riskText: {
    ...typography.h2,
    marginBottom: 8,
  },
  riskDescription: {
    ...typography.body2,
    lineHeight: 20,
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confidenceLabel: {
    ...typography.body2,
    marginRight: 8,
  },
  confidenceValue: {
    ...typography.cardTitle,
  },
  factorsContainer: {
    marginBottom: 16,
  },
  factorsTitle: {
    ...typography.cardTitle,
    marginBottom: 8,
  },
  factorItem: {
    ...typography.body2,
    marginBottom: 4,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    ...typography.cardTitle,
    marginBottom: 8,
  },
  recommendationItem: {
    ...typography.body2,
    marginBottom: 4,
  },
  timestamp: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default PredictionInputScreen;