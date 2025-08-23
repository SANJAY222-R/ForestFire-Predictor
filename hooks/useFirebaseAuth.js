import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { firebaseConfig } from '../config/firebase';

export const useFirebaseAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase once
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [firebaseAuth, setFirebaseAuth] = useState(null);

  useEffect(() => {
    // Initialize Firebase only once
    if (!firebaseApp) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      setFirebaseApp(app);
      setFirebaseAuth(auth);
    }
  }, [firebaseApp]);

  useEffect(() => {
    if (firebaseAuth) {
      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setIsSignedIn(!!user);
        setIsLoaded(true);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return unsubscribe;
    }
  }, [firebaseAuth]);

  const signIn = {
    create: async ({ identifier, password }) => {
      try {
        if (!firebaseAuth) {
          throw new Error('Firebase not initialized');
        }
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, identifier, password);
        return {
          createdSessionId: userCredential.user.uid,
          status: 'complete'
        };
      } catch (error) {
        console.error('Firebase sign in error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
  };

  const signUp = {
    create: async ({ username, emailAddress, password }) => {
      try {
        if (!firebaseAuth) {
          throw new Error('Firebase not initialized');
        }
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, emailAddress, password);
        
        // Update user profile with username
        await updateProfile(userCredential.user, {
          displayName: username
        });

        return {
          status: 'complete',
          createdUserId: userCredential.user.uid
        };
      } catch (error) {
        console.error('Firebase sign up error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    prepareEmailAddressVerification: async ({ strategy }) => {
      try {
        if (!firebaseAuth) {
          throw new Error('Firebase not initialized');
        }
        if (firebaseAuth.currentUser) {
          await sendEmailVerification(firebaseAuth.currentUser);
          return { status: 'complete' };
        }
        throw new Error('No user logged in');
      } catch (error) {
        console.error('Firebase email verification error:', error);
        throw error;
      }
    }
  };

  const setActive = async ({ session }) => {
    // Firebase automatically manages active sessions
    return { status: 'complete' };
  };

  const signOut = async () => {
    try {
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
      throw error;
    }
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    signIn,
    signUp,
    setActive,
    signOut,
    loading
  };
};
