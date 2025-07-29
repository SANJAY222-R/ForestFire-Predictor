import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import DrawerNavigator from '../navigation/DrawerNavigator';


const App = () => {
  return (
    <ThemeProvider>    
        <DrawerNavigator />   
    </ThemeProvider>
  );
};

export default App;