// Authentication Configuration for Forest Fire Predictor

// IMPORTANT: You need to get your actual Clerk keys from https://clerk.com
// 1. Go to https://clerk.com and create an account
// 2. Create a new application
// 3. Go to API Keys in your dashboard
// 4. Copy your Publishable Key and replace the placeholder below

// Clerk Configuration
export const CLERK_CONFIG = {
  // Clerk Publishable Key
  // Get your key from: https://dashboard.clerk.com/last-active?path=api-keys
  PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  
  // Clerk Settings
  SIGN_IN_URL: '/sign-in',
  SIGN_UP_URL: '/sign-up',
  AFTER_SIGN_IN_URL: '/',
  AFTER_SIGN_UP_URL: '/',
  
  // Token Configuration
  TOKEN_CACHE_KEY: 'clerk-db.session',
  SESSION_CACHE_KEY: 'clerk-session',
  
  // User Profile Fields
  USER_PROFILE_FIELDS: [
    'id',
    'emailAddresses',
    'primaryEmailAddress',
    'username',
    'firstName',
    'lastName',
    'fullName',
    'createdAt',
    'updatedAt'
  ],
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    AUTH_ERROR: 'Authentication error. Please try again.',
    TOKEN_ERROR: 'Session expired. Please sign in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
  },
  
  // Validation Rules
  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    PASSWORD_MIN_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

// Token Management
export const TOKEN_MANAGEMENT = {
  // Token storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'clerk-db.session',
    SESSION_TOKEN: 'clerk-session',
    USER_DATA: 'user-data',
    THEME_PREFERENCE: 'theme_preference'
  },
  
  // Token validation
  VALIDATION: {
    MIN_TOKEN_LENGTH: 100,
    TOKEN_PREFIX: 'Bearer '
  },
  
  // Token refresh settings
  REFRESH: {
    ENABLED: true,
    INTERVAL: 5 * 60 * 1000, // 5 minutes
    RETRY_ATTEMPTS: 3
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
    clerk_user_id: 'id',
    email: 'primaryEmailAddress.emailAddress',
    username: 'username',
    full_name: 'fullName',
    first_name: 'firstName',
    last_name: 'lastName',
    created_at: 'createdAt',
    updated_at: 'updatedAt'
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
    INVALID_TOKEN: 'Invalid authentication token.',
    EXPIRED_TOKEN: 'Authentication token has expired.',
    MISSING_TOKEN: 'No authentication token provided.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'User not found.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address.',
    ACCOUNT_EXISTS: 'An account with this email already exists.'
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

// Development Configuration
export const DEV_CONFIG = {
  // Development mode settings
  DEBUG_MODE: __DEV__,
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
  
  // Development authentication
  DEV_AUTH: {
    BYPASS_AUTH: true, // Enable bypass for development
  }
};

export default {
  CLERK_CONFIG,
  API_CONFIG,
  TOKEN_MANAGEMENT,
  USER_SYNC_CONFIG,
  ERROR_HANDLING,
  DEV_CONFIG
};
