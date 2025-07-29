import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthGate } from '../components/AuthGate';
import DrawerNavigator from '../navigation/DrawerNavigator';

const tokenCache = {
  getToken: key => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

const App = () => {
  return (
    <ClerkProvider
      publishableKey="pk_test_Y2hhcm1lZC1tb29zZS01Ni5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
      <ThemeProvider>    
        <AuthGate>
          <DrawerNavigator />   
        </AuthGate>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;