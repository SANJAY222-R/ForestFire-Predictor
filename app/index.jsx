import React from 'react';
import { AuthGate } from '../components/AuthGate';
import DrawerNavigator from '../navigation/DrawerNavigator';

const App = () => {
  return (
    <AuthGate>
      <DrawerNavigator />   
    </AuthGate>
  );
};

export default App;