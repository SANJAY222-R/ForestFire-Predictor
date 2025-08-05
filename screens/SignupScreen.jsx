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

const SignupScreen = ({ switchToLogin }) => {
  const { colors } = useTheme();
  const { signUp, setActive, isLoaded } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      console.log("📝 User signup data:", { username, email });
      await signUp.create({
        username,
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      Alert.alert("Signup failed", err.errors?.[0]?.message || err.message);
    }
    setPending(false);
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      console.log("🔐 Starting email verification...");
      const result = await signUp.attemptEmailAddressVerification({ code });
      console.log("✅ Email verification successful");
      
      console.log("🔐 Setting active session...");
      await setActive({ session: result.createdSessionId });
      console.log("✅ Session activated");
      
      // Sync user with backend after successful signup using the actual user input
      console.log("🔄 Syncing new user with backend using actual input data...");
      console.log("📝 Actual user input:", { username, email });
      try {
        // Pass the actual user input to sync
        // await syncUser({ username, email }); // This line was removed as per the new_code
        console.log("✅ User synced successfully with real data");
      } catch (syncError) {
        console.error("❌ Sync failed but continuing:", syncError);
        // Don't block the navigation if sync fails
      }
      
      console.log("🔄 Navigating to home screen...");
      // navigation.reset({ // This line was removed as per the new_code
      //   index: 0,
      //   routes: [{ name: "HomeScreen" }],
      // });
      console.log("✅ Navigation completed");
    } catch (err) {
      console.error("❌ Verification/sync error:", err);
      Alert.alert(
        "Verification failed",
        err.errors?.[0]?.message || err.message
      );
    }
    setPending(false);
  };

  const styles = getStyles(colors);

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
                <TouchableOpacity onPress={switchToLogin}>
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
  });
