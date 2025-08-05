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
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
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
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 50,
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
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
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
    visibilityTime: 3500,
    autoHide: true,
    topOffset: 50,
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
    topOffset: 50,
    visibilityTime: 3000,
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
  TOAST_TYPES,
  TOAST_POSITIONS,
}; 