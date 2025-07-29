import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen({ switchToLogin }) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
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
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (err) {
      Alert.alert('Signup failed', err.errors?.[0]?.message || err.message);
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
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (err) {
      Alert.alert('Verification failed', err.errors?.[0]?.message || err.message);
    }
    setPending(false);
  };

  if (verifying) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.info}>Enter the code sent to your email address.</Text>
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
        />
        <Button title={pending ? "Verifying..." : "Verify"} onPress={handleVerify} disabled={pending} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={pending ? "Signing up..." : "Sign Up"} onPress={handleSignup} disabled={pending} />
      {switchToLogin && (
        <Button title="Already have an account? Log In" onPress={switchToLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  info: { fontSize: 16, marginBottom: 16, textAlign: 'center', color: '#555' },
});