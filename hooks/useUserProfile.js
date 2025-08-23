import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useUserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile data from backend
      const profile = await apiService.getUserProfile();
      const stats = await apiService.getUserStats();
      
      // Combine profile and stats data
      const combinedData = {
        ...profile,
        stats: stats,
      };
      
      setProfileData(combinedData);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await apiService.updateUserProfile(updateData);
      setProfileData(prev => ({ ...prev, ...updatedProfile }));
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const refetch = useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profileData,
    loading,
    error,
    refetch,
    updateProfile,
  };
}; 