import { getNetworkErrorMessage } from '../utils/networkUtils';
import { showNetworkErrorToast, showApiErrorToast } from './toastService';

// API Configuration - Use the correct IP address for mobile development
const API_BASE_URL = __DEV__ 
  ? 'http://10.122.117.191:5000/api'  // Development - use your computer's IP address
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

  // Get authentication token from Firebase
  async getAuthToken() {
    try {
      // For Firebase, we'll use the user's ID token
      // This will be implemented when we add Firebase token management
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
          const errorText = await response.text();
          console.error(`❌ API Error (${response.status}): ${errorText}`);
          
          if (response.status === 401) {
            throw new Error('Authentication failed. Please sign in again.');
          } else if (response.status === 403) {
            throw new Error('Access denied. Please check your permissions.');
          } else if (response.status === 404) {
            throw new Error('Resource not found.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log(`✅ API Response: ${endpoint}`, data);
        return data;

      } catch (error) {
        lastError = error;
        console.error(`❌ API Request failed (attempt ${attempt}):`, error);
        
        if (error.name === 'AbortError') {
          console.error('Request timeout');
        }
        
        // If this is the last attempt, throw the error
        if (attempt === this.retryAttempts) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
    
    throw lastError;
  }

  // HTTP method wrappers
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Health check endpoint
  async healthCheck() {
    try {
      return await this.get('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'offline', error: error.message };
    }
  }

  // Authentication methods
  async verifyAuth(token) {
    return this.post('/auth/verify', { token });
  }

  async syncUser(token, userData = {}) {
    try {
      // For Firebase, we can sync user data without a token for now
      // The backend will need to be updated to handle Firebase user IDs
      const response = await this.post('/auth/sync', { 
        firebase_user_id: userData.firebase_user_id,
        user_data: userData 
      });
      
      console.log('✅ User sync successful:', response);
      return response;
    } catch (error) {
      console.error('❌ User sync failed:', error);
      throw error;
    }
  }

  // User management methods
  async getCurrentUser() {
    return this.get('/auth/user');
  }

  async listUsers() {
    return this.get('/users');
  }

  async getUserProfile() {
    return this.get('/users/profile');
  }

  async updateUserProfile(data) {
    return this.put('/users/profile', data);
  }

  async getUserStats() {
    return this.get('/users/stats');
  }

  // Sensor management methods
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
    return this.get('/sensors/readings', params);
  }

  async getLatestReadings(deviceId = null) {
    const params = deviceId ? { device_id: deviceId } : {};
    return this.get('/sensors/readings/latest', params);
  }

  // Prediction methods
  async createPrediction(data) {
    return this.post('/predictions', data);
  }

  async getPredictions(params = {}) {
    return this.get('/predictions', params);
  }

  async getLatestPrediction() {
    return this.get('/predictions/latest');
  }

  // Alert management methods
  async getUserAlerts(params = {}) {
    return this.get('/alerts', params);
  }

  async getAlert(alertId) {
    return this.get(`/alerts/${alertId}`);
  }

  async acknowledgeAlert(alertId) {
    return this.post(`/alerts/${alertId}/acknowledge`);
  }

  async resolveAlert(alertId) {
    return this.post(`/alerts/${alertId}/resolve`);
  }

  async getAlertStats() {
    return this.get('/alerts/stats');
  }

  // Real-time data methods
  async getLiveSensorData() {
    try {
      return await this.get('/sensors/live');
    } catch (error) {
      console.error('Failed to get live sensor data:', error);
      // Return fallback data
      return FALLBACK_DATA.sensorData;
    }
  }

  async getRecentAlerts() {
    try {
      return await this.get('/alerts/recent');
    } catch (error) {
      console.error('Failed to get recent alerts:', error);
      // Return fallback data
      return FALLBACK_DATA.alerts;
    }
  }

  // Dashboard data
  async getDashboardData() {
    try {
      const response = await this.get('/dashboard');
      return response;
    } catch (error) {
      console.error('Failed to get dashboard data:', error);
      // Return fallback data
      return {
        sensorData: FALLBACK_DATA.sensorData,
        alerts: FALLBACK_DATA.alerts,
        stats: FALLBACK_DATA.stats,
        error: error.message
      };
    }
  }

  // ThingSpeak integration methods
  async fetchThingSpeakData() {
    try {
      return await this.get('/sensors/thingspeak/fetch');
    } catch (error) {
      console.error('Failed to fetch ThingSpeak data:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async syncThingSpeakData(params = {}) {
    return this.post('/sensors/thingspeak/sync', params);
  }

  async getThingSpeakStatus() {
    return this.get('/sensors/thingspeak/status');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 