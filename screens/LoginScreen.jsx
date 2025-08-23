import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useUserSync } from '../hooks/useUserSync';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../services/toastService';

// Fallback colors in case theme is not loaded
const FALLBACK_COLORS = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  primary: '#FF6B35',
  surface: '#FFFFFF',
  cardBackground: '#F8F9FA',
  border: '#E1E5E9',
};

const LoginScreen = ({ switchToSignup }) => {
  const theme = useTheme();
  const colors = theme?.colors || FALLBACK_COLORS;
  const { signIn, setActive, isLoaded, loading } = useFirebaseAuth();
  const { syncUser } = useUserSync();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Debug logging
  console.log('🔍 LoginScreen Debug:', {
    isLoaded,
    signIn: !!signIn,
    setActive: !!setActive,
    email,
    colors: !!colors,
    theme: !!theme,
    loading
  });

  const handleLogin = async () => {
    console.log('🚀 Starting login process...');
    
    if (!email.trim() || !password.trim()) {
      showErrorToast('Please enter both email and password', 'Validation Error');
      return;
    }

    setPending(true);

    // Handle login with Firebase
    if (!isLoaded) {
      console.error('❌ Firebase not loaded yet');
      showErrorToast('Authentication service not ready', 'System Error');
      setPending(false);
      return;
    }

    try {
      console.log('📝 Creating signin attempt...');
      showInfoToast('Signing in...', 'Please wait');
      
      // Create sign-in attempt
      const result = await signIn.create({ 
        identifier: email.trim(), 
        password 
      });
      
      console.log('✅ Signin result:', result);
      
      if (!result.createdSessionId) {
        throw new Error('Failed to create session');
      }
      
      // Set the active session
      console.log('🔑 Setting active session...');
      await setActive({ session: result.createdSessionId });
      
      // Sync user with backend after successful login
      try {
        console.log('🔄 Syncing user with backend...');
        await syncUser();
        showSuccessToast('Welcome back!', 'Login Successful');
      } catch (syncError) {
        console.error('❌ Sync failed but continuing:', syncError);
        showWarningToast('Login successful but profile sync failed. You can sync later.');
        // Don't block the login if sync fails
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        errors: err.errors,
        stack: err.stack
      });
      
      // Handle specific Firebase errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code) {
        console.log('🔍 Firebase error code:', err.code);
        
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'Email address not found. Please check your email or sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showErrorToast(errorMessage, 'Login Failed');
    } finally {
      setPending(false);
    }
  };

  // Create styles with proper colors
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 24,
    },
    headerSection: {
      alignItems: "center",
      marginBottom: 48,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      ...typography.h1,
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      ...typography.body1,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    formSection: {
      marginBottom: 32,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: typography.body1.fontSize,
      color: colors.text,
    },
    passwordToggle: {
      padding: 8,
    },
    loginButton: {
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 8,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      ...typography.body1,
      color: colors.surface,
      fontWeight: "600",
      marginLeft: 8,
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    signupText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    signupLink: {
      ...typography.body2,
      fontWeight: "600",
    },
    footerSection: {
      alignItems: "center",
      marginTop: 32,
    },
    footerText: {
      ...typography.caption,
      color: colors.textLight,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
  });

  // Show loading if Clerk is not loaded (only in normal mode)
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner text="Loading authentication..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error if signIn is not available (only in normal mode)
  if (!signIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <ErrorMessage 
            error="Authentication service not available. Please restart the app."
            onRetry={() => window.location.reload()}
            title="Authentication Error"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="flame" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your Forest Fire Predictor account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={colors.textSecondary}
                editable={!pending}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={colors.textSecondary}
                editable={!pending}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                disabled={pending}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: pending ? 0.7 : 1
                }
              ]}
              onPress={handleLogin}
              disabled={pending}
            >
              {pending ? (
                <View style={styles.buttonContent}>
                  <Ionicons name="hourglass-outline" size={20} color={colors.surface} />
                  <Text style={styles.buttonText}>Signing in...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="log-in-outline" size={20} color={colors.surface} />
                  <Text style={styles.buttonText}>Sign In</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            {switchToSignup && (
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={switchToSignup} disabled={pending}>
                  <Text style={[styles.signupLink, { color: colors.primary }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              🔥 Stay safe and protect our forests!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
