// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://10.78.111.191:5000/api', // Use your computer's IP address
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  
  // Authentication
  AUTH_VERIFY: '/auth/verify',
  AUTH_USER: '/auth/user',
  
  // Users
  USERS_PROFILE: '/users/profile',
  USERS_STATS: '/users/stats',
  
  // Sensors
  SENSORS_DEVICES: '/sensors/devices',
  SENSORS_READINGS: '/sensors/readings',
  
  // Predictions
  PREDICTIONS: '/predictions',
  PREDICTIONS_STATS: '/predictions/stats',
  PREDICTIONS_BULK: '/predictions/bulk',
  PREDICTIONS_ML_INFO: '/predictions/ml/info',
  PREDICTIONS_ML_TRAIN: '/predictions/ml/train',
  
  // Alerts
  ALERTS: '/alerts/',
  ALERTS_STATS: '/alerts/stats',
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Alert Types
export const ALERT_TYPES = {
  MAINTENANCE: 'maintenance',
  RISK: 'risk',
  WARNING: 'warning',
  INFO: 'info',
  SYSTEM: 'system',
};

// Alert Severity
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Sensor Types
export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  SMOKE: 'smoke',
  AIR_QUALITY: 'air_quality',
  WIND_SPEED: 'wind_speed',
  WIND_DIRECTION: 'wind_direction',
  ATMOSPHERIC_PRESSURE: 'atmospheric_pressure',
  UV_INDEX: 'uv_index',
  SOIL_MOISTURE: 'soil_moisture',
  RAINFALL: 'rainfall',
};

// Device Status
export const DEVICE_STATUS = {
  ACTIVE: 'active',
  OFFLINE: 'offline',
  MAINTENANCE: 'maintenance',
  ERROR: 'error',
};

// Prediction Models
export const PREDICTION_MODELS = {
  RULE_BASED: 'rule_based',
  ML_MODEL: 'ml_model',
  HYBRID: 'hybrid',
};

// Data Quality Levels
export const DATA_QUALITY = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
};

// Notification Preferences
export const NOTIFICATION_TYPES = {
  EMAIL_ALERTS: 'email_alerts',
  PUSH_NOTIFICATIONS: 'push_notifications',
  HIGH_RISK_ONLY: 'high_risk_only',
  MAINTENANCE_ALERTS: 'maintenance_alerts',
  SYSTEM_UPDATES: 'system_updates',
};

// UI Constants
export const UI_CONSTANTS = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MAX_RETRIES: 3,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Authentication error. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PREDICTION_CREATED: 'Prediction created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ALERT_ACKNOWLEDGED: 'Alert acknowledged successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_SYNCED: 'Data synchronized successfully!',
};

// Validation Rules
export const VALIDATION_RULES = {
  TEMPERATURE: {
    MIN: -50,
    MAX: 80,
  },
  HUMIDITY: {
    MIN: 0,
    MAX: 100,
  },
  SMOKE_LEVEL: {
    MIN: 0,
    MAX: 10000,
  },
  AIR_QUALITY: {
    MIN: 0,
    MAX: 500,
  },
  WIND_SPEED: {
    MIN: 0,
    MAX: 200,
  },
  WIND_DIRECTION: {
    MIN: 0,
    MAX: 360,
  },
  ATMOSPHERIC_PRESSURE: {
    MIN: 800,
    MAX: 1200,
  },
  UV_INDEX: {
    MIN: 0,
    MAX: 15,
  },
  SOIL_MOISTURE: {
    MIN: 0,
    MAX: 100,
  },
  RAINFALL: {
    MIN: 0,
    MAX: 100,
  },
  BATTERY_LEVEL: {
    MIN: 0,
    MAX: 100,
  },
  SIGNAL_STRENGTH: {
    MIN: 0,
    MAX: 100,
  },
};

// Default Values
export const DEFAULT_VALUES = {
  TEMPERATURE: 25,
  HUMIDITY: 50,
  SMOKE_LEVEL: 50,
  AIR_QUALITY: 50,
  WIND_SPEED: 5,
  WIND_DIRECTION: 0,
  ATMOSPHERIC_PRESSURE: 1013.25,
  UV_INDEX: 5,
  SOIL_MOISTURE: 50,
  RAINFALL: 0,
  BATTERY_LEVEL: 100,
  SIGNAL_STRENGTH: 100,
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  DANGER: '#FF3B30',
  INFO: '#5AC8FA',
  LIGHT: '#F2F2F7',
  DARK: '#1C1C1E',
};

// Risk Colors
export const RISK_COLORS = {
  [RISK_LEVELS.LOW]: '#34C759',
  [RISK_LEVELS.MODERATE]: '#FF9500',
  [RISK_LEVELS.HIGH]: '#FF3B30',
  [RISK_LEVELS.CRITICAL]: '#8E0000',
};

// Alert Colors
export const ALERT_COLORS = {
  [ALERT_TYPES.MAINTENANCE]: '#5AC8FA',
  [ALERT_TYPES.RISK]: '#FF3B30',
  [ALERT_TYPES.WARNING]: '#FF9500',
  [ALERT_TYPES.INFO]: '#007AFF',
  [ALERT_TYPES.SYSTEM]: '#5856D6',
};

// Time Formats
export const TIME_FORMATS = {
  SHORT: 'HH:mm',
  MEDIUM: 'MMM dd, HH:mm',
  LONG: 'MMM dd, yyyy HH:mm',
  RELATIVE: 'relative',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  CACHED_DATA: 'cached_data',
  OFFLINE_DATA: 'offline_data',
  SETTINGS: 'app_settings',
};

// Feature Flags
export const FEATURE_FLAGS = {
  REAL_TIME_UPDATES: true,
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: true,
  ADVANCED_ANALYTICS: true,
  ML_PREDICTIONS: true,
  WEBSOCKET_CONNECTION: true,
}; 