import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import apiService from '../services/api';

const NetworkStatus = () => {
  const { colors } = useContext(ThemeContext);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      await apiService.healthCheck();
      setIsConnected(true);
      Alert.alert('Success', 'Backend server is reachable!');
    } catch (error) {
      setIsConnected(false);
      Alert.alert('Connection Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.statusRow}>
        <Ionicons 
          name={isConnected ? "checkmark-circle" : "close-circle"} 
          size={20} 
          color={isConnected ? colors.success : colors.error} 
        />
        <Text style={[styles.statusText, { color: colors.text }]}>
          Backend Connection: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.testButton, { backgroundColor: colors.primary }]}
        onPress={testConnection}
        disabled={isLoading}
      >
        <Ionicons name="refresh" size={16} color={colors.surface} />
        <Text style={[styles.buttonText, { color: colors.surface }]}>
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    ...typography.body2,
    marginLeft: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default NetworkStatus; 