import Toast from 'react-native-toast-message';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Toast positions
export const TOAST_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  CENTER: 'center',
};

/**
 * Show a success toast message
 * @param {string} message - The message to display
 * @param {string} title - Optional title
 * @param {Object} options - Additional options
 */
export const showSuccessToast = (message, title = 'Success', options = {}) => {
  Toast.show({
    type: TOAST_TYPES.SUCCESS,
    text1: title,
    text2: message,
    position: TOAST_POSITIONS.TOP,
    visibilityTime: 3500,
    autoHide: true,
    topOffset: 60,
    ...options,
  });
};

/**
 * Show an error toast message
 * @param {string} message - The message to display
 * @param {string} title - Optional title
 * @param {Object} options - Additional options
 */
export const showErrorToast = (message, title = 'Error', options = {}) => {
  Toast.show({
    type: TOAST_TYPES.ERROR,
    text1: title,
    text2: message,
    position: TOAST_POSITIONS.TOP,
    visibilityTime: 4500,
    autoHide: true,
    topOffset: 60,
    ...options,
  });
};

/**
 * Show an info toast message
 * @param {string} message - The message to display
 * @param {string} title - Optional title
 * @param {Object} options - Additional options
 */
export const showInfoToast = (message, title = 'Info', options = {}) => {
  Toast.show({
    type: TOAST_TYPES.INFO,
    text1: title,
    text2: message,
    position: TOAST_POSITIONS.TOP,
    visibilityTime: 3500,
    autoHide: true,
    topOffset: 60,
    ...options,
  });
};

/**
 * Show a warning toast message
 * @param {string} message - The message to display
 * @param {string} title - Optional title
 * @param {Object} options - Additional options
 */
export const showWarningToast = (message, title = 'Warning', options = {}) => {
  Toast.show({
    type: TOAST_TYPES.WARNING,
    text1: title,
    text2: message,
    position: TOAST_POSITIONS.TOP,
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
    ...options,
  });
};

/**
 * Show a custom toast message
 * @param {Object} config - Toast configuration
 */
export const showCustomToast = (config) => {
  Toast.show({
    position: TOAST_POSITIONS.TOP,
    topOffset: 60,
    visibilityTime: 3500,
    autoHide: true,
    ...config,
  });
};

/**
 * Hide all toasts
 */
export const hideToast = () => {
  Toast.hide();
};

/**
 * Show toast for API errors
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - Fallback message if error.message is not available
 */
export const showApiErrorToast = (error, fallbackMessage = 'An error occurred') => {
  const message = error?.message || error?.response?.data?.message || fallbackMessage;
  showErrorToast(message, 'Network Error');
};

/**
 * Show toast for validation errors
 * @param {Array|string} errors - Validation errors
 */
export const showValidationErrorToast = (errors) => {
  const message = Array.isArray(errors) ? errors.join('\n') : errors;
  showErrorToast(message, 'Validation Error');
};

/**
 * Show toast for network connectivity issues
 */
export const showNetworkErrorToast = () => {
  showErrorToast(
    'Please check your internet connection and try again',
    'Connection Error'
  );
};

/**
 * Show toast for successful operations
 * @param {string} operation - The operation that was successful
 */
export const showOperationSuccessToast = (operation) => {
  showSuccessToast(`${operation} completed successfully`);
};

/**
 * Show toast for loading states
 * @param {string} message - Loading message
 */
export const showLoadingToast = (message = 'Loading...') => {
  showInfoToast(message, 'Please wait');
};

/**
 * Show fire alert toast with enhanced styling
 * @param {string} riskLevel - The risk level (high, critical, etc.)
 * @param {string} confidence - The confidence percentage
 * @param {Object} options - Additional options
 */
export const showFireAlertToast = (riskLevel, confidence, options = {}) => {
  const title = `Fire Risk Alert: ${riskLevel.toUpperCase()}`;
  const message = `Confidence: ${confidence}% - Take immediate action if necessary.`;
  
  // Use error type for high/critical risk, warning for moderate, success for low
  const toastType = ['high', 'critical'].includes(riskLevel) ? 'error' : 
                   riskLevel === 'moderate' ? 'warning' : 'success';
  
  const toastFunction = {
    success: showSuccessToast,
    warning: showWarningToast,
    error: showErrorToast,
  }[toastType];
  
  toastFunction(message, title, {
    visibilityTime: 6000,
    ...options,
  });
};

/**
 * Show sensor data update toast
 * @param {string} sensorType - The type of sensor updated
 * @param {Object} options - Additional options
 */
export const showSensorUpdateToast = (sensorType, options = {}) => {
  showInfoToast(
    `${sensorType} data updated successfully`,
    'Sensor Update',
    {
      visibilityTime: 3000,
      ...options,
    }
  );
};

/**
 * Show prediction result toast
 * @param {string} riskLevel - The predicted risk level
 * @param {number} confidence - The confidence score
 * @param {Object} options - Additional options
 */
export const showPredictionToast = (riskLevel, confidence, options = {}) => {
  const riskColors = {
    low: 'success',
    moderate: 'warning',
    high: 'error',
    critical: 'error',
  };
  
  const toastType = riskColors[riskLevel] || 'info';
  const title = `Prediction: ${riskLevel.toUpperCase()} Risk`;
  const message = `Confidence: ${Math.round(confidence * 100)}%`;
  
  const toastFunction = {
    success: showSuccessToast,
    warning: showWarningToast,
    error: showErrorToast,
    info: showInfoToast,
  }[toastType];
  
  toastFunction(message, title, {
    visibilityTime: 4000,
    ...options,
  });
};

/**
 * Show low risk alert toast
 * @param {string} message - The alert message
 * @param {Object} options - Additional options
 */
export const showLowRiskToast = (message, options = {}) => {
  showSuccessToast(message, 'Low Risk Alert', {
    visibilityTime: 4000,
    ...options,
  });
};

/**
 * Show moderate risk alert toast
 * @param {string} message - The alert message
 * @param {Object} options - Additional options
 */
export const showModerateRiskToast = (message, options = {}) => {
  showWarningToast(message, 'Moderate Risk Alert', {
    visibilityTime: 5000,
    ...options,
  });
};

/**
 * Show high risk alert toast
 * @param {string} message - The alert message
 * @param {Object} options - Additional options
 */
export const showHighRiskToast = (message, options = {}) => {
  showErrorToast(message, 'High Risk Alert', {
    visibilityTime: 6000,
    ...options,
  });
};

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showCustomToast,
  hideToast,
  showApiErrorToast,
  showValidationErrorToast,
  showNetworkErrorToast,
  showOperationSuccessToast,
  showLoadingToast,
  showFireAlertToast,
  showSensorUpdateToast,
  showPredictionToast,
  showLowRiskToast,
  showModerateRiskToast,
  showHighRiskToast,
  TOAST_TYPES,
  TOAST_POSITIONS,
}; 