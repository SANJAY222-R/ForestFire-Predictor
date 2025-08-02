import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../theme/ThemeContext";
import { typography } from "../theme/typography";

export default function SignupScreen({ switchToLogin }) {
  const { colors } = useContext(ThemeContext);
  const { signUp, setActive, isLoaded } = useSignUp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
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
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    } catch (err) {
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
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>Enter the code sent to your email.</Text>
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.buttonContainer}>
          <Button
            title={pending ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            disabled={pending}
            color={colors.primary}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Get started with a new account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={colors.textSecondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colors.textSecondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.textSecondary}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={pending ? "Signing up..." : "Sign Up"}
          onPress={handleSignup}
          disabled={pending}
          color={colors.primary}
        />
      </View>
      {switchToLogin && (
        <Button
          title="Already have an account? Log In"
          onPress={switchToLogin}
          color={colors.textSecondary}
        />
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: colors.background,
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
      marginBottom: 32,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      fontSize: typography.body1.fontSize,
      color: colors.text,
    },
    buttonContainer: {
      marginVertical: 8,
      borderRadius: 8,
      overflow: "hidden",
    },
  });
