import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../theme/ThemeContext';

export default function CustomDrawerContent(props) {
  const { isSignedIn, signOut } = useAuth();
  const { colors } = useContext(ThemeContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {isSignedIn ? (
        <DrawerItem
          label="Logout"
          onPress={signOut}
          labelStyle={{ color: colors.primary }}
        />
      ) : (
        <DrawerItem
          label="Login"
          onPress={() => {
            props.navigation.closeDrawer();
          }}
          labelStyle={{ color: colors.primary }}
        />
      )}
    </DrawerContentScrollView>
  );
}