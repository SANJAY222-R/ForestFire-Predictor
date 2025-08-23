// Firebase Configuration for Forest Fire Predictor

// Firebase Configuration
export const FIREBASE_CONFIG = {
  // Firebase project settings
  PROJECT_ID: 'fire-pred-prev',
  AUTH_DOMAIN: 'fire-pred-prev.firebaseapp.com',
  
  // Authentication settings
  AUTH: {
    SIGN_IN_URL: '/sign-in',
    SIGN_UP_URL: '/sign-up',
    AFTER_SIGN_IN_URL: '/',
    AFTER_SIGN_UP_URL: '/',
    
    // User Profile Fields
    USER_PROFILE_FIELDS: [
      'uid',
      'email',
      'displayName',
      'photoURL',
      'metadata'
    ],
    
    // Error Messages
    ERROR_MESSAGES: {
      NETWORK_ERROR: 'Network error. Please check your connection.',
      AUTH_ERROR: 'Authentication error. Please try again.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
      USER_NOT_FOUND: 'User not found.',
      WRONG_PASSWORD: 'Incorrect password.',
      INVALID_EMAIL: 'Invalid email address.',
      USER_DISABLED: 'Account has been disabled.',
      TOO_MANY_REQUESTS: 'Too many attempts. Please try again later.'
    },
    
    // Validation Rules
    VALIDATION: {
      USERNAME_MIN_LENGTH: 3,
      PASSWORD_MIN_LENGTH: 8,
      EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  }
};

// API Configuration
export const API_CONFIG = {
  // Development API URL
  BASE_URL: __DEV__ 
    ? 'http://10.122.117.191:5000/api'
    : 'https://your-production-api.com/api',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      VERIFY: '/auth/verify',
      SYNC: '/auth/sync',
      USER: '/auth/user',
      LOGOUT: '/auth/logout'
    },
    USERS: {
      PROFILE: '/users/profile',
      STATS: '/users/stats',
      UPDATE: '/users/profile'
    },
    SENSORS: {
      DEVICES: '/sensors/devices',
      READINGS: '/sensors/readings',
      THINGSPEAK: {
        FETCH: '/sensors/thingspeak/fetch',
        SYNC: '/sensors/thingspeak/sync',
        STATUS: '/sensors/thingspeak/status'
      }
    },
    PREDICTIONS: {
      CREATE: '/predictions/',
      LIST: '/predictions/',
      LATEST: '/predictions/'
    },
    ALERTS: {
      LIST: '/alerts/',
      ACKNOWLEDGE: '/alerts/{id}/acknowledge',
      RESOLVE: '/alerts/{id}/resolve',
      STATS: '/alerts/stats'
    }
  },
  
  // Request Configuration
  REQUEST: {
    TIMEOUT: 15000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// User Sync Configuration
export const USER_SYNC_CONFIG = {
  // Sync settings
  AUTO_SYNC: true,
  SYNC_ON_LOGIN: true,
  SYNC_ON_APP_START: true,
  
  // User data mapping
  DATA_MAPPING: {
    firebase_user_id: 'uid',
    email: 'email',
    username: 'displayName',
    full_name: 'displayName',
    created_at: 'metadata.creationTime',
    updated_at: 'metadata.lastSignInTime'
  },
  
  // Fallback values
  FALLBACKS: {
    email: (userId) => `${userId}@example.com`,
    full_name: (username) => username || 'Unknown User',
    username: (userId) => `user_${userId.slice(-8)}`
  }
};

// Error Handling Configuration
export const ERROR_HANDLING = {
  // Network errors
  NETWORK_ERRORS: {
    TIMEOUT: 'Request timeout. Please check your connection.',
    NO_CONNECTION: 'No internet connection. Please check your network.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Session expired. Please sign in again.',
    FORBIDDEN: 'Access denied. Please check your permissions.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION_ERROR: 'Invalid data provided.'
  },
  
  // Authentication errors
  AUTH_ERRORS: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'User not found.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address.',
    ACCOUNT_EXISTS: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password is too weak.',
    INVALID_EMAIL: 'Invalid email address.',
    USER_DISABLED: 'Account has been disabled.',
    TOO_MANY_REQUESTS: 'Too many attempts. Please try again later.'
  },
  
  // User feedback
  USER_MESSAGES: {
    SUCCESS: {
      LOGIN: 'Welcome back!',
      SIGNUP: 'Account created successfully!',
      SYNC: 'Profile synchronized successfully',
      UPDATE: 'Profile updated successfully'
    },
    WARNING: {
      SYNC_FAILED: 'Profile sync failed. You can sync later.',
      NETWORK_SLOW: 'Network is slow. Please wait...',
      PARTIAL_DATA: 'Some data may be outdated.'
    },
    ERROR: {
      LOGIN_FAILED: 'Login failed. Please try again.',
      SIGNUP_FAILED: 'Signup failed. Please try again.',
      SYNC_FAILED: 'Failed to sync profile.',
      NETWORK_ERROR: 'Network error. Please check your connection.'
    }
  }
};

export default {
  FIREBASE_CONFIG,
  API_CONFIG,
  USER_SYNC_CONFIG,
  ERROR_HANDLING
};
