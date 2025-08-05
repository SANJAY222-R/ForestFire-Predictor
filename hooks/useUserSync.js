import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import apiService from '../services/api';

export const useUserSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, user } = useAuth();

  const syncUser = useCallback(async (userInput = null) => {
    try {
      setSyncing(true);
      setError(null);

      // Get the current token from Clerk
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      // Use actual user input if provided (from signup), otherwise extract from Clerk
      let userData = {};
      if (userInput && userInput.username && userInput.email) {
        // Use the actual data the user entered during signup
        userData = {
          clerk_user_id: user?.id || 'unknown',
          email: userInput.email,
          username: userInput.username,
          full_name: userInput.username, // Use username as display name
          created_at: new Date().toISOString(),
        };
      } else if (user) {
        // Fallback: Extract user data from Clerk user object
        
        // Get email from various possible sources
        let email = '';
        if (user.emailAddresses && user.emailAddresses.length > 0) {
          const verifiedEmail = user.emailAddresses.find(email => 
            email.verification?.status === 'verified'
          );
          if (verifiedEmail) {
            email = verifiedEmail.emailAddress;
          } else {
            email = user.emailAddresses[0].emailAddress;
          }
        } else if (user.primaryEmailAddress) {
          email = user.primaryEmailAddress.emailAddress;
        } else if (user.emailAddress) {
          email = user.emailAddress;
        }

        // Get username - this is what users actually provide
        const username = user.username || '';

        // Get name from various possible sources (for display purposes)
        let fullName = '';
        if (user.fullName) {
          fullName = user.fullName;
        } else if (user.firstName && user.lastName) {
          fullName = `${user.firstName} ${user.lastName}`;
        } else if (user.firstName) {
          fullName = user.firstName;
        } else if (user.lastName) {
          fullName = user.lastName;
        } else if (user.username) {
          fullName = user.username; // Use username as display name if no name provided
        } else if (user.givenName && user.familyName) {
          fullName = `${user.givenName} ${user.familyName}`;
        } else if (user.givenName) {
          fullName = user.givenName;
        } else if (user.familyName) {
          fullName = user.familyName;
        }

        userData = {
          clerk_user_id: user.id,
          email: email,
          username: username,
          full_name: fullName || username, // Use username as fallback for display name
          created_at: user.createdAt || new Date().toISOString(),
        };
      }

      // Sync user with backend (send both token and user data)
      const result = await apiService.syncUser(token, userData);
      
      return result;
      
    } catch (err) {
      console.error('Error syncing user:', err);
      setError(err.message);
      throw err;
    } finally {
      setSyncing(false);
    }
  }, [getToken, user]);

  return {
    syncUser,
    syncing,
    error,
  };
}; 