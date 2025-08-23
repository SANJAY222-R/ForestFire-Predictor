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

const SignupScreen = ({ switchToLogin }) => {
  const theme = useTheme();
  const colors = theme?.colors || FALLBACK_COLORS;
  const { signUp, setActive, isLoaded, loading } = useFirebaseAuth();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Debug logging
  console.log('🔍 SignupScreen Debug:', {
    isLoaded,
    signUp: !!signUp,
    setActive: !!setActive,
    username,
    email,
    colors: !!colors,
    theme: !!theme,
    loading
  });

  const validateForm = () => {
    if (!username.trim()) {
      showErrorToast('Please enter a username', 'Validation Error');
      return false;
    }
    if (!email.trim()) {
      showErrorToast('Please enter an email address', 'Validation Error');
      return false;
    }
    if (!password.trim()) {
      showErrorToast('Please enter a password', 'Validation Error');
      return false;
    }
    if (password.length < 8) {
      showErrorToast('Password must be at least 8 characters long', 'Validation Error');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    console.log('🚀 Starting signup process...');
    
    if (!validateForm()) {
      return;
    }

    setPending(true);

    if (!isLoaded) {
      console.error('❌ Clerk not loaded yet');
      showErrorToast('Authentication service not ready', 'System Error');
      setPending(false);
      return;
    }

    if (!signUp) {
      console.error('❌ signUp is undefined - Clerk not properly initialized');
      showErrorToast('Authentication service not available. Please restart the app.', 'System Error');
      setPending(false);
      return;
    }

    try {
      console.log('📝 Creating signup attempt...');
      showInfoToast('Creating your account...', 'Please wait');
      
      // Create sign-up attempt
      const signupResult = await signUp.create({
        username: username.trim(),
        emailAddress: email.trim(),
        password,
      });
      
      console.log('✅ Signup created successfully:', signupResult);
      
      // Prepare email verification
      console.log('📧 Preparing email verification...');
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setVerifying(true);
      showSuccessToast('Account created! Please check your email for verification code.', 'Signup Successful');
    } catch (err) {
      console.error('❌ Signup error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        errors: err.errors,
        stack: err.stack
      });
      
      // Handle specific Clerk errors
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        console.log('🔍 Clerk error code:', clerkError.code);
        
        switch (clerkError.code) {
          case 'form_identifier_exists':
            errorMessage = 'This email is already registered. Please sign in instead.';
            break;
          case 'form_param_format_invalid':
            if (clerkError.paramName === 'email_address') {
              errorMessage = 'Please enter a valid email address.';
            } else if (clerkError.paramName === 'username') {
              errorMessage = 'Username must be at least 3 characters and contain only letters, numbers, and underscores.';
            } else {
              errorMessage = 'Please check your input format.';
            }
            break;
          case 'form_password_pwned':
            errorMessage = 'This password is too common. Please choose a stronger password.';
            break;
          case 'form_password_length':
            errorMessage = 'Password must be at least 8 characters long.';
            break;
          default:
            errorMessage = clerkError.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showErrorToast(errorMessage, 'Signup Failed');
    } finally {
      setPending(false);
    }
  };

  const handleVerify = async () => {
    console.log('🔐 Starting verification process...');
    
    if (!isLoaded) {
      console.error('❌ Clerk not loaded yet');
      showErrorToast('Authentication service not ready', 'System Error');
      return;
    }

    if (!signUp) {
      console.error('❌ signUp is undefined during verification');
      showErrorToast('Authentication service not available. Please restart the app.', 'System Error');
      return;
    }

    if (!code.trim()) {
      showErrorToast('Please enter the verification code', 'Validation Error');
      return;
    }

    setPending(true);
    try {
      console.log('🔐 Attempting email verification...');
      showInfoToast('Verifying your email...', 'Please wait');
      
      // Attempt email verification
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      
      console.log('✅ Verification result:', result);
      
      if (!result.createdSessionId) {
        throw new Error('Failed to create session after verification');
      }
      
      // Set the active session
      console.log('🔑 Setting active session...');
      await setActive({ session: result.createdSessionId });
      
      showSuccessToast('Email verified successfully! Welcome to Forest Fire Predictor!', 'Verification Successful');
      
    } catch (err) {
      console.error('❌ Verification error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        errors: err.errors,
        stack: err.stack
      });
      
      // Handle specific Clerk errors
      let errorMessage = 'Verification failed. Please try again.';
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0];
        console.log('🔍 Clerk verification error code:', clerkError.code);
        
        switch (clerkError.code) {
          case 'form_code_incorrect':
            errorMessage = 'Incorrect verification code. Please check your email and try again.';
            break;
          case 'form_code_expired':
            errorMessage = 'Verification code has expired. Please request a new one.';
            break;
          default:
            errorMessage = clerkError.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showErrorToast(errorMessage, 'Verification Failed');
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
    signupButton: {
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
    verifyButton: {
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
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    loginText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    loginLink: {
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

  // Show error if signUp is not available (only in normal mode)
  if (!signUp) {
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

  if (verifying) {
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
                <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
              </View>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
            </View>

            {/* Verification Form */}
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Verification Code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textSecondary}
                  editable={!pending}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.verifyButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: pending ? 0.7 : 1
                  }
                ]}
                onPress={handleVerify}
                disabled={pending}
              >
                {pending ? (
                  <View style={styles.buttonContent}>
                    <Ionicons name="hourglass-outline" size={20} color={colors.surface} />
                    <Text style={styles.buttonText}>Verifying...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.surface} />
                    <Text style={styles.buttonText}>Verify Email</Text>
                  </View>
                )}
              </TouchableOpacity>
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
              <Ionicons name="person-add" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Forest Fire Predictor to protect our forests</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={colors.textSecondary}
                editable={!pending}
              />
            </View>

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

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: pending ? 0.7 : 1
                }
              ]}
              onPress={handleSignup}
              disabled={pending}
            >
              {pending ? (
                <View style={styles.buttonContent}>
                  <Ionicons name="hourglass-outline" size={20} color={colors.surface} />
                  <Text style={styles.buttonText}>Creating account...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="person-add-outline" size={20} color={colors.surface} />
                  <Text style={styles.buttonText}>Create Account</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            {switchToLogin && (
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={switchToLogin} disabled={pending}>
                  <Text style={[styles.loginLink, { color: colors.primary }]}>
                    Sign In
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

export default SignupScreen;
