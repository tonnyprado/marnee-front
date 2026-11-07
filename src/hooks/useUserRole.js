/**
 * useUserRole Hook
 * Gestiona el rol del usuario y sus capacidades
 */
import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/roleService';

export const useUserRole = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRole = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await roleService.getMyRole();
      setUser(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user role:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRole();
  }, [loadRole]);

  const updateRole = async (role) => {
    try {
      setIsLoading(true);
      const data = await roleService.updateMyRole(role);
      setUser(prev => ({ ...prev, role: data.role, roleOnboardingCompleted: true }));
      setError(null);
      return data;
    } catch (err) {
      console.error('Failed to update role:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const hasFeature = (featureKey) => {
    if (!user || !user.capabilities) return false;
    return user.capabilities.features[featureKey]?.enabled || false;
  };

  const getLimit = (limitKey) => {
    if (!user || !user.capabilities) return null;
    return user.capabilities.limits[limitKey] || null;
  };

  return {
    user,
    isLoading,
    error,
    updateRole,
    hasFeature,
    getLimit,
    reload: loadRole
  };
};
