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
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LoginScreen = ({ switchToSignup }) => {
  const { colors } = useTheme();
  const { signIn, setActive, isLoaded } = useAuth();
  const { syncUser } = useUserSync();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      console.log("🔐 Starting login process...");
      const result = await signIn.create({ identifier: email, password });
      console.log("✅ Login successful");
      
      console.log("🔐 Setting active session...");
      await setActive({ session: result.createdSessionId });
      console.log("✅ Session activated");
      
      // Sync user with backend after successful login
      console.log("🔄 Syncing user with backend...");
      try {
        await syncUser();
        console.log("✅ User synced successfully");
      } catch (syncError) {
        console.error("❌ Sync failed but continuing:", syncError);
        // Don't block the login if sync fails
      }
      
    } catch (err) {
      console.error("❌ Login/sync error:", err);
      Alert.alert("Login failed", err.errors?.[0]?.message || err.message);
    }
    setPending(false);
  };

  const styles = getStyles(colors);

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
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
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
                <TouchableOpacity onPress={switchToSignup}>
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

const getStyles = (colors) =>
  StyleSheet.create({
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
      backgroundColor: colors.card,
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
  });
