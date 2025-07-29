import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Animated,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import RiskBadge from '../components/RiskBadge';

const PredictionInputScreen = () => {
  const { colors } = useContext(ThemeContext);
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [smokeLevel, setSmokeLevel] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultAnimation] = useState(new Animated.Value(0));

  const handlePredict = () => {
    if (!temperature || !humidity || !smokeLevel) {
      Alert.alert('Missing Information', 'Please fill in all sensor readings.');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const temp = parseFloat(temperature);
      const hum = parseFloat(humidity);
      const smoke = parseFloat(smokeLevel);
      
      let riskLevel = 'low';
      let riskText = '✅ Safe / Low Risk';
      let riskDescription = 'Current conditions indicate minimal fire risk. Continue monitoring.';
      
      if (temp > 30 || hum < 30 || smoke > 200) {
        riskLevel = 'high';
        riskText = '🔥 High Fire Risk';
        riskDescription = 'Dangerous conditions detected! Consider evacuation and alert authorities.';
      } else if (temp > 25 || hum < 50 || smoke > 100) {
        riskLevel = 'moderate';
        riskText = '🟡 Moderate Risk';
        riskDescription = 'Elevated risk conditions. Increase monitoring and prepare safety measures.';
      }
      
      setPrediction({
        riskLevel,
        riskText,
        riskDescription,
        timestamp: new Date().toLocaleString(),
        inputs: { temperature: temp, humidity: hum, smokeLevel: smoke }
      });
      
      setLoading(false);
      
      // Animate result card
      Animated.spring(resultAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }, 2000);
  };

  const resetForm = () => {
    setTemperature('');
    setHumidity('');
    setSmokeLevel('');
    setPrediction(null);
    resultAnimation.setValue(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Fire Risk Prediction</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter current sensor readings to assess fire risk</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Temperature Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="thermometer-outline" size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Temperature (°C)</Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={temperature}
              onChangeText={setTemperature}
              placeholder="Enter temperature"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>

          {/* Humidity Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="water-outline" size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Humidity (%)</Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={humidity}
              onChangeText={setHumidity}
              placeholder="Enter humidity percentage"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>

          {/* Smoke Level Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Ionicons name="cloud-outline" size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>Smoke Level (ppm)</Text>
            </View>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              value={smokeLevel}
              onChangeText={setSmokeLevel}
              placeholder="Enter smoke level"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />
          </View>

          {/* Predict Button */}
          <TouchableOpacity
            style={[
              styles.predictButton, 
              { 
                backgroundColor: loading ? colors.textSecondary : colors.primary,
                shadowColor: colors.shadow
              }
            ]}
            onPress={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="hourglass-outline" size={20} color={colors.surface} />
                <Text style={[styles.buttonText, { color: colors.surface }]}>Analyzing...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="search-outline" size={20} color={colors.surface} />
                <Text style={[styles.buttonText, { color: colors.surface }]}>🔎 Predict Now</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Result Card */}
          {prediction && (
            <Animated.View
              style={[
                styles.resultCard,
                { 
                  backgroundColor: colors.surface,
                  shadowColor: colors.shadow
                },
                {
                  opacity: resultAnimation,
                  transform: [
                    {
                      translateY: resultAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={[styles.resultTitle, { color: colors.text }]}>Prediction Result</Text>
                <Text style={[styles.resultTimestamp, { color: colors.textLight }]}>{prediction.timestamp}</Text>
              </View>
              
              <View style={styles.riskContainer}>
                <RiskBadge riskLevel={prediction.riskLevel} size="large" />
              </View>
              
              <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>{prediction.riskDescription}</Text>
              
              <View style={[styles.inputSummary, { backgroundColor: colors.background }]}>
                <Text style={[styles.summaryTitle, { color: colors.text }]}>Input Values:</Text>
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  🌡️ {prediction.inputs.temperature}°C • 💧 {prediction.inputs.humidity}% • 💨 {prediction.inputs.smokeLevel}ppm
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.resetButton, 
                  { 
                    borderColor: colors.primary 
                  }
                ]} 
                onPress={resetForm}
              >
                <Ionicons name="refresh-outline" size={16} color={colors.primary} />
                <Text style={[styles.resetButtonText, { color: colors.primary }]}>New Prediction</Text>
              </TouchableOpacity>
            </Animated.View>
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
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    ...typography.body1,
    fontWeight: '600',
    marginLeft: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  predictButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.button,
    marginLeft: 8,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    marginBottom: 16,
  },
  resultTitle: {
    ...typography.h3,
  },
  resultTimestamp: {
    ...typography.caption,
    marginTop: 4,
  },
  riskContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  riskDescription: {
    ...typography.body1,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  inputSummary: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    ...typography.caption,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default PredictionInputScreen;