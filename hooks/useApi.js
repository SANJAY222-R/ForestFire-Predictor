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

// Hook for user predictions
export const useUserPredictions = (params = {}) => {
  return useApi(
    () => apiService.getUserPredictions(params),
    [JSON.stringify(params)]
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

// Hook for prediction stats
export const usePredictionStats = () => {
  return useApi(
    () => apiService.getPredictionStats(),
    []
  );
};

// Hook for ML model info
export const useMLInfo = () => {
  return useApi(
    () => apiService.getMLInfo(),
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

// Hook for creating predictions
export const useCreatePrediction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPrediction = useCallback(async (predictionData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.createPrediction(predictionData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPrediction, loading, error };
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

// Hook for bulk predictions
export const useBulkPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBulkPredictions = useCallback(async (readings) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.createBulkPredictions(readings);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBulkPredictions, loading, error };
};

// Hook for training ML model
export const useTrainMLModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trainModel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.trainMLModel();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { trainModel, loading, error };
}; 