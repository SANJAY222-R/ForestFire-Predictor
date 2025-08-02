import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { ThemeContext } from "../theme/ThemeContext";
import { typography } from "../theme/typography";

export default function LoginScreen({ switchToSignup }) {
  const { colors } = useContext(ThemeContext);
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
    setPending(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
    } catch (err) {
      Alert.alert("Login failed", err.errors?.[0]?.message || err.message);
    }
    setPending(false);
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>
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
          title={pending ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={pending}
          color={colors.primary}
        />
      </View>
      {switchToSignup && (
        <Button
          title="Don't have an account? Sign Up"
          onPress={switchToSignup}
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
