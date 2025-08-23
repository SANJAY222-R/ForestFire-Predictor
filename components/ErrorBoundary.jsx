import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Increment error count
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log detailed error information
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorCount: this.state.errorCount + 1
    });
  }

  handleRetry = () => {
    console.log('🔄 Retrying after error...');
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReset = () => {
    console.log('🔄 Resetting app state...');
    // Force a complete app reload
    if (global.location) {
      global.location.reload();
    } else {
      // For React Native, try to restart the app
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        errorCount: 0
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        errorCount={this.state.errorCount}
        onRetry={this.handleRetry}
        onReset={this.handleReset}
      />;
    }

    return this.props.children;
  }
}

// Separate functional component to use hooks
const ErrorFallback = ({ error, errorInfo, errorCount, onRetry, onReset }) => {
  const { colors } = useTheme();
  
  // Fallback colors in case theme context is not available
  const fallbackColors = {
    background: '#FFF8DC',
    error: '#FF4444',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#FFA500',
    surface: '#FFFFFF',
    warning: '#FFA500',
  };

  const safeColors = colors || fallbackColors;

  const getErrorMessage = () => {
    if (!error) return 'An unexpected error occurred';
    
    // Provide user-friendly error messages
    if (error.message.includes('safeArea')) {
      return 'UI rendering error - please restart the app';
    } else if (error.message.includes('network')) {
      return 'Network connection error - please check your internet';
    } else if (error.message.includes('authentication')) {
      return 'Authentication error - please sign in again';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: safeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.icon, { color: safeColors.error }]}>⚠️</Text>
          <Text style={[styles.title, { color: safeColors.text }]}>
            Something went wrong
          </Text>
          <Text style={[styles.message, { color: safeColors.textSecondary }]}>
            {getErrorMessage()}
          </Text>
          
          {errorCount > 1 && (
            <View style={[styles.warningContainer, { backgroundColor: safeColors.warning + '20' }]}>
              <Text style={[styles.warningText, { color: safeColors.textSecondary }]}>
                This is error #{errorCount}. If problems persist, try resetting the app.
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: safeColors.primary }]}
              onPress={onRetry}
            >
              <Text style={[styles.retryText, { color: safeColors.surface }]}>
                Try Again
              </Text>
            </TouchableOpacity>
            
            {errorCount > 2 && (
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: safeColors.error }]}
                onPress={onReset}
              >
                <Text style={[styles.resetText, { color: safeColors.surface }]}>
                  Reset App
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {__DEV__ && error && (
            <View style={styles.debugContainer}>
              <Text style={[styles.debugTitle, { color: safeColors.text }]}>
                Debug Information:
              </Text>
              <Text style={[styles.debugText, { color: safeColors.textSecondary }]}>
                {error.message}
              </Text>
              {errorInfo && errorInfo.componentStack && (
                <Text style={[styles.debugText, { color: safeColors.textSecondary }]}>
                  {errorInfo.componentStack}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    ...typography.h2,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...typography.body1,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  warningText: {
    ...typography.caption,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  retryText: {
    ...typography.button,
  },
  resetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  resetText: {
    ...typography.button,
  },
  debugContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginTop: 16,
  },
  debugTitle: {
    ...typography.caption,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    ...typography.caption,
    fontFamily: 'monospace',
    fontSize: 10,
  },
});

export default ErrorBoundary; 