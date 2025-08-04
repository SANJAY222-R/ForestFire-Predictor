import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../theme/ThemeContext';
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
      return (
        <ThemeContext.Consumer>
          {({ colors }) => (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
              <View style={styles.content}>
                <Text style={[styles.icon, { color: colors.error }]}>⚠️</Text>
                <Text style={[styles.title, { color: colors.text }]}>
                  Something went wrong
                </Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  We encountered an unexpected error. Please try again.
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                  onPress={this.handleRetry}
                >
                  <Text style={[styles.retryText, { color: colors.onPrimary }]}>
                    Try Again
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          )}
        </ThemeContext.Consumer>
      );
    }

    return this.props.children;
  }
}

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
    ...typography.body,
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