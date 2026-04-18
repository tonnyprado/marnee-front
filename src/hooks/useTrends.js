/**
 * useTrends Hook
 * Manages trends state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import trendsApi from '../services/trendsApi';

export const useTrends = (founderId, sessionId) => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState(null);

  // Fetch trends for a founder
  const fetchTrends = useCallback(async () => {
    if (!founderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing trends by founder
      const response = await trendsApi.getTrendsByFounder(founderId);
      setTrends(response.trends || response);
    } catch (err) {
      // If no trends exist yet, that's okay - just set empty state
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setTrends(null);
      } else {
        setError(err.message || 'Failed to fetch trends');
        console.error('Error fetching trends:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [founderId]);

  // Fetch trends on mount and when founderId changes
  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  // Generate trends with AI
  const generateTrends = async () => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setGenerating(true);
      setError(null);

      const response = await trendsApi.generateTrends({
        founderId,
        sessionId,
      });

      const newTrends = response.trends || response;
      setTrends(newTrends);

      return newTrends;
    } catch (err) {
      setError(err.message || 'Failed to generate trends');
      console.error('Error generating trends:', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Update trends
  const updateTrends = async (data) => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setError(null);
      await trendsApi.updateTrends(founderId, data);

      setTrends((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      setError(err.message || 'Failed to update trends');
      console.error('Error updating trends:', err);
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

      const response = await trendsApi.regenerateTrendsSection({
        founderId,
        section,
      });

      // Map section names to trends keys
      const sectionKeyMap = {
        'keywords': 'seoKeywords',
        'viral_topics': 'viralTopics',
        'main_trends': 'mainTrends',
        'market_insights': 'marketInsights'
      };

      const key = sectionKeyMap[section] || section;

      // Update only the regenerated section
      setTrends((prev) => ({
        ...prev,
        [key]: response[key] || response,
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

  return {
    trends,
    loading,
    error,
    generating,
    regeneratingSection,
    fetchTrends,
    generateTrends,
    updateTrends,
    regenerateSection,
  };
};

export default useTrends;
