import * as SecureStore from 'expo-secure-store';
import { getNetworkErrorMessage } from '../utils/networkUtils';

// API Configuration - Use the correct IP address for mobile development
const API_BASE_URL = __DEV__ 
  ? 'http://10.78.111.191:5000/api'  // Development - use your computer's IP address
  : 'https://your-production-api.com/api'; // Production

// Fallback data for when API is not available
const FALLBACK_DATA = {
  sensorData: [
    {
      temperature: 25.5,
      humidity: 45.2,
      smoke_level: 15.0,
      timestamp: new Date().toISOString(),
      device_id: 1,
      id: 1,
    }
  ],
  alerts: [
    {
      id: 1,
      title: 'System Status',
      message: 'API connection established successfully',
      created_at: new Date().toISOString(),
      is_read: true,
      severity: 'info',
      alert_type: 'info',
      category: 'system',
    }
  ],
  stats: {
    total_predictions: 0,
    high_risk_predictions: 0,
    active_devices: 1,
    total_alerts: 1,
    unread_alerts: 0,
  },

};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 15000; // 15 seconds for mobile networks
    this.retryAttempts = 3;
    this.isOnline = true;
  }

  // Get authentication token from Clerk
  async getAuthToken() {
    try {
      const token = await SecureStore.getItemAsync('clerk-db.session');
      if (token) {
        const parsedToken = JSON.parse(token);
        return parsedToken?.jwt || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Generic request method with better error handling and retry logic
  async request(endpoint, options = {}) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const token = await this.getAuthToken();
        
        const config = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
          },
          ...options,
        };

        const url = `${this.baseURL}${endpoint}`;
        console.log(`🌐 API Request (attempt ${attempt}): ${config.method} ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`❌ API Error ${response.status}:`, errorData);
          throw new Error(`API Error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log(`✅ API Response: ${endpoint}`, data);
        return data;

      } catch (error) {
        lastError = error;
        console.error(`❌ API Request failed for ${endpoint} (attempt ${attempt}):`, error);
        
        // Don't retry on certain errors
        if (error.name === 'AbortError' || error.message.includes('Network request failed')) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // Provide more specific error messages
    if (lastError.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.');
    } else if (lastError.message.includes('Network request failed')) {
      const networkError = getNetworkErrorMessage(lastError);
      throw new Error(networkError);
    } else {
      throw lastError;
    }
  }

  // GET request with parameter filtering
  async get(endpoint, params = {}) {
    // Filter out undefined and null parameters
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Authentication endpoints
  async verifyAuth(token) {
    return this.post('/auth/verify', { token });
  }

  async syncUser(token, userData = {}) {
    console.log('🌐 API Service: Calling sync endpoint...');
    console.log('📤 Request payload:', { 
      token: token.substring(0, 50) + '...',
      userData: userData
    });
    
    try {
      const result = await this.post('/auth/sync', { token, userData });
      console.log('✅ API Service: Sync successful');
      console.log('📊 API Service: Response:', result);
      return result;
    } catch (error) {
      console.error('❌ API Service: Sync failed');
      console.error('❌ API Service: Error details:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    return this.get('/auth/user');
  }

  async listUsers() {
    return this.get('/auth/list-users');
  }

  // User endpoints
  async getUserProfile() {
    const response = await this.get('/users/profile');
    return response.user || response;
  }

  async updateUserProfile(data) {
    return this.put('/users/profile', data);
  }

  async getUserStats() {
    const response = await this.get('/users/stats');
    return response.stats || response;
  }



  // Sensor endpoints
  async getSensorDevices() {
    return this.get('/sensors/devices');
  }

  async getSensorDevice(deviceId) {
    return this.get(`/sensors/devices/${deviceId}`);
  }

  async createSensorReading(data) {
    return this.post('/sensors/readings', data);
  }

  async getSensorReadings(params = {}) {
    const response = await this.get('/sensors/readings', params);
    return response.readings || response;
  }

  async getLatestReadings(deviceId = null) {
    const params = { limit: 10 };
    if (deviceId) params.device_id = deviceId;
    const response = await this.get('/sensors/readings', params);
    return response.readings || response;
  }

  // Prediction endpoints
  async createPrediction(data) {
    return this.post('/predictions', data);
  }

  async getUserPredictions(params = {}) {
    return this.get('/predictions', params);
  }

  async getPrediction(predictionId) {
    return this.get(`/predictions/${predictionId}`);
  }

  async getPredictionStats() {
    return this.get('/predictions/stats');
  }

  async createBulkPredictions(readings) {
    return this.post('/predictions/bulk', { readings });
  }

  // ML endpoints
  async getMLInfo() {
    return this.get('/predictions/ml/info');
  }

  async trainMLModel() {
    return this.post('/predictions/ml/train');
  }

  // Alert endpoints
  async getUserAlerts(params = {}) {
    const response = await this.get('/alerts/', params);
    return response.alerts || response;
  }

  async getAlert(alertId) {
    return this.get(`/alerts/${alertId}`);
  }

  async acknowledgeAlert(alertId) {
    return this.put(`/alerts/${alertId}/acknowledge`);
  }

  async resolveAlert(alertId) {
    return this.put(`/alerts/${alertId}/resolve`);
  }

  async getAlertStats() {
    return this.get('/alerts/stats');
  }

  // Real-time data helpers
  async getLiveSensorData() {
    const response = await this.get('/sensors/readings', { 
      limit: 3, 
      sort: 'timestamp',
      order: 'desc' 
    });
    return response.readings || response;
  }

  async getRecentAlerts() {
    const response = await this.get('/alerts/', { 
      limit: 5, 
      sort: 'created_at',
      order: 'desc' 
    });
    return response.alerts || response;
  }

  async getDashboardData() {
    try {
      const [sensorDataResponse, alertsResponse, statsResponse] = await Promise.all([
        this.getLiveSensorData(),
        this.getRecentAlerts(),
        this.getUserStats(),
      ]);

      return {
        sensorData: sensorDataResponse.readings || sensorDataResponse || [],
        alerts: alertsResponse.alerts || alertsResponse || [],
        stats: statsResponse.stats || statsResponse || {},
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Only use fallback for network-related errors
      if (error.message.includes('Network request failed') || 
          error.message.includes('Request timeout') ||
          error.name === 'AbortError') {
        console.log('Using fallback data due to network issues');
        return FALLBACK_DATA;
      }
      
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 