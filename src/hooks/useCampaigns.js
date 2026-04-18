/**
 * useCampaigns Hook
 * Manages campaigns state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import campaignsApi from '../services/campaignsApi';

export const useCampaigns = (calendarId, founderId, sessionId) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Fetch campaigns for a calendar
  const fetchCampaigns = useCallback(async () => {
    if (!calendarId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await campaignsApi.getCampaignsByCalendar(calendarId);
      setCampaigns(response.campaigns || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  }, [calendarId]);

  // Fetch campaigns on mount and when calendarId changes
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Generate campaigns with AI
  const generateCampaigns = async (count = 3) => {
    if (!calendarId || !founderId) {
      throw new Error('Calendar ID and Founder ID are required');
    }

    try {
      setGenerating(true);
      setError(null);
      const response = await campaignsApi.generateCampaigns({
        founderId,
        sessionId,
        calendarId,
        count,
      });

      const newCampaigns = response.campaigns || [];
      setCampaigns((prev) => [...newCampaigns, ...prev]);

      return newCampaigns;
    } catch (err) {
      setError(err.message || 'Failed to generate campaigns');
      console.error('Error generating campaigns:', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Create campaign manually
  const createCampaign = async (name) => {
    if (!calendarId) {
      throw new Error('Calendar ID is required');
    }

    try {
      setError(null);
      const response = await campaignsApi.createCampaign({
        calendarId,
        name,
        status: 'idea',
      });

      const newCampaign = response.campaign;
      setCampaigns((prev) => [newCampaign, ...prev]);

      return newCampaign;
    } catch (err) {
      setError(err.message || 'Failed to create campaign');
      console.error('Error creating campaign:', err);
      throw err;
    }
  };

  // Update campaign
  const updateCampaign = async (campaignId, data) => {
    try {
      setError(null);
      await campaignsApi.updateCampaign(campaignId, data);

      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, ...data } : c))
      );
    } catch (err) {
      setError(err.message || 'Failed to update campaign');
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  // Delete campaign
  const deleteCampaign = async (campaignId) => {
    try {
      setError(null);
      await campaignsApi.deleteCampaign(campaignId);

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      setError(err.message || 'Failed to delete campaign');
      console.error('Error deleting campaign:', err);
      throw err;
    }
  };

  // Update task status
  const updateTask = async (taskId, data) => {
    try {
      setError(null);
      await campaignsApi.updateCampaignTask(taskId, data);

      // Refresh campaigns to get updated task data
      await fetchCampaigns();
    } catch (err) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Regenerate AI suggestions
  const regenerateSuggestions = async (campaignId) => {
    try {
      setError(null);
      const response = await campaignsApi.regenerateCampaignSuggestions(campaignId);

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? { ...c, aiSuggestions: response.aiSuggestions }
            : c
        )
      );

      return response.aiSuggestions;
    } catch (err) {
      setError(err.message || 'Failed to regenerate suggestions');
      console.error('Error regenerating suggestions:', err);
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    generating,
    fetchCampaigns,
    generateCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateTask,
    regenerateSuggestions,
  };
};

export default useCampaigns;
