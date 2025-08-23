import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook for API calls with loading and error states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
};

// Hook for sensor data
export const useSensorData = (deviceId = null) => {
  return useApi(
    () => apiService.getLatestReadings(deviceId),
    [deviceId]
  );
};

// Hook for user alerts
export const useUserAlerts = (params = {}) => {
  return useApi(
    () => apiService.getUserAlerts(params),
    [JSON.stringify(params)]
  );
};

// Hook for user profile
export const useUserProfile = () => {
  return useApi(
    () => apiService.getUserProfile(),
    []
  );
};

// Hook for dashboard data
export const useDashboardData = () => {
  return useApi(
    () => apiService.getDashboardData(),
    []
  );
};

// Hook for sensor devices
export const useSensorDevices = () => {
  return useApi(
    () => apiService.getSensorDevices(),
    []
  );
};

// Hook for acknowledging alerts
export const useAcknowledgeAlert = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const acknowledgeAlert = useCallback(async (alertId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.acknowledgeAlert(alertId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { acknowledgeAlert, loading, error };
};

// Hook for updating user profile
export const useUpdateUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.updateUserProfile(profileData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateProfile, loading, error };
};

// Hook for health check
export const useHealthCheck = () => {
  return useApi(
    () => apiService.healthCheck(),
    []
  );
}; 