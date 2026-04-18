/**
 * useBrandProfile Hook
 * Manages brand profile state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import brandProfileApi from '../services/brandProfileApi';

export const useBrandProfile = (founderId, sessionId) => {
  const [brandProfile, setBrandProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState(null);

  // Fetch brand profile for a founder
  const fetchBrandProfile = useCallback(async () => {
    if (!founderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing brand profile by founder
      const response = await brandProfileApi.getBrandProfileByFounder(founderId);
      setBrandProfile(response.brandProfile || response);
    } catch (err) {
      // If no profile exists yet, that's okay - just set empty state
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setBrandProfile(null);
      } else {
        setError(err.message || 'Failed to fetch brand profile');
        console.error('Error fetching brand profile:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [founderId]);

  // Fetch brand profile on mount and when founderId changes
  useEffect(() => {
    fetchBrandProfile();
  }, [fetchBrandProfile]);

  // Generate brand profile with AI
  const generateBrandProfile = async () => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setGenerating(true);
      setError(null);

      const response = await brandProfileApi.generateBrandProfile({
        founderId,
        sessionId,
      });

      const newProfile = response.brandProfile || response;
      setBrandProfile(newProfile);

      return newProfile;
    } catch (err) {
      setError(err.message || 'Failed to generate brand profile');
      console.error('Error generating brand profile:', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Update brand profile
  const updateBrandProfile = async (data) => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setError(null);
      await brandProfileApi.updateBrandProfile(founderId, data);

      setBrandProfile((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      setError(err.message || 'Failed to update brand profile');
      console.error('Error updating brand profile:', err);
      throw err;
    }
  };

  // Regenerate specific section with AI
  const regenerateSection = async (section) => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setRegeneratingSection(section);
      setError(null);

      const response = await brandProfileApi.regenerateBrandProfileSection({
        founderId,
        section,
      });

      // Update only the regenerated section
      setBrandProfile((prev) => ({
        ...prev,
        [section]: response[section] || response,
      }));

      return response;
    } catch (err) {
      setError(err.message || `Failed to regenerate ${section}`);
      console.error(`Error regenerating ${section}:`, err);
      throw err;
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Upload brand guidelines
  const uploadGuidelines = async (file) => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setError(null);
      const response = await brandProfileApi.uploadBrandGuidelines(founderId, file);

      // Update brand profile with new guidelines reference
      setBrandProfile((prev) => ({
        ...prev,
        uploadedGuidelines: response.guidelines || response,
      }));

      return response;
    } catch (err) {
      setError(err.message || 'Failed to upload guidelines');
      console.error('Error uploading guidelines:', err);
      throw err;
    }
  };

  // Get brand guidelines
  const fetchGuidelines = async () => {
    if (!founderId) {
      return null;
    }

    try {
      const response = await brandProfileApi.getBrandGuidelines(founderId);
      return response.guidelines || response;
    } catch (err) {
      console.error('Error fetching guidelines:', err);
      return null;
    }
  };

  // Delete brand guidelines
  const deleteGuidelines = async (guidelineId) => {
    try {
      setError(null);
      await brandProfileApi.deleteBrandGuidelines(guidelineId);

      // Update brand profile to remove guidelines reference
      setBrandProfile((prev) => ({
        ...prev,
        uploadedGuidelines: null,
      }));
    } catch (err) {
      setError(err.message || 'Failed to delete guidelines');
      console.error('Error deleting guidelines:', err);
      throw err;
    }
  };

  return {
    brandProfile,
    loading,
    error,
    generating,
    regeneratingSection,
    fetchBrandProfile,
    generateBrandProfile,
    updateBrandProfile,
    regenerateSection,
    uploadGuidelines,
    fetchGuidelines,
    deleteGuidelines,
  };
};

export default useBrandProfile;
