import { useState, useCallback } from 'react';
import apiService from '../services/api';
import { useAuth } from '../utils/auth';

export const useUserSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const syncUser = useCallback(async (userInput = null) => {
    try {
      setSyncing(true);
      setError(null);

      // Use actual user input if provided (from signup), otherwise extract from Firebase
      let userData = {};
      if (userInput && userInput.username && userInput.email) {
        // Use the actual data the user entered during signup
        userData = {
          firebase_user_id: user?.uid || 'unknown',
          email: userInput.email,
          username: userInput.username,
          full_name: userInput.username, // Use username as display name
          created_at: new Date().toISOString(),
        };
      } else if (user) {
        // Extract user data from Firebase user object
        const email = user.email || '';
        const username = user.displayName || '';
        const fullName = user.displayName || username;

        userData = {
          firebase_user_id: user.uid,
          email: email,
          username: username,
          full_name: fullName || username, // Use username as fallback for display name
          created_at: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toISOString() : new Date().toISOString(),
        };
      }

      console.log('🔄 Syncing user data:', userData);

      // For Firebase, we don't need a token for user sync, just the user data
      const result = await apiService.syncUser(null, userData);
      
      console.log('✅ User sync result:', result);
      
      return result;
      
    } catch (err) {
      console.error('❌ Error syncing user:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [user]);

  return {
    syncUser,
    syncing,
    error,
  };
}; 