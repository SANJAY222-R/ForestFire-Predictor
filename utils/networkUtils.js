import NetInfo from '@react-native-community/netinfo';

// Network status utility
export const checkNetworkStatus = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      details: state.details,
    };
  } catch (error) {
    console.error('Error checking network status:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      details: null,
    };
  }
};

// Test API connectivity
export const testAPIConnectivity = async (baseURL) => {
  try {
    const response = await fetch(`${baseURL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        status: response.status,
        data,
      };
    } else {
      return {
        success: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      status: null,
      error: error.message,
    };
  }
};

// Get local IP address for development
export const getLocalIPAddress = () => {
  // This is a simplified version - in a real app, you'd want to detect this dynamically
  return '10.250.163.191'; // Replace with your actual IP address
};

// Network error messages
export const getNetworkErrorMessage = (error) => {
  if (error.message.includes('Network request failed')) {
    return 'Unable to connect to the server. Please check:\n\n1. Your internet connection\n2. The backend server is running\n3. You\'re using the correct IP address';
  } else if (error.message.includes('timeout')) {
    return 'Request timed out. The server may be slow or your connection is unstable.';
  } else if (error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  } else {
    return error.message || 'An unexpected network error occurred.';
  }
};

// API endpoint builder
export const buildAPIUrl = (endpoint, baseURL = 'http://10.250.163.191:5000/api') => {
  return `${baseURL}${endpoint}`;
}; 