import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Separate functional component to use hooks
const ErrorFallback = ({ onRetry }) => {
  const { colors } = useTheme();
  
  // Fallback colors in case theme context is not available
  const fallbackColors = {
    background: '#FFF8DC',
    error: '#FF4444',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#FFA500',
    surface: '#FFFFFF',
  };

  const safeColors = colors || fallbackColors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: safeColors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.icon, { color: safeColors.error }]}>⚠️</Text>
        <Text style={[styles.title, { color: safeColors.text }]}>
          Something went wrong
        </Text>
        <Text style={[styles.message, { color: safeColors.textSecondary }]}>
          We encountered an unexpected error. Please try again.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: safeColors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: safeColors.surface }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    ...typography.button,
  },
});

export default ErrorBoundary; 