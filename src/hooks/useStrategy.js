/**
 * useStrategy Hook
 * Manages strategy state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import strategyApi from '../services/strategyApi';

export const useStrategy = (founderId, sessionId) => {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState(null);

  // Fetch strategy for a founder
  const fetchStrategy = useCallback(async () => {
    if (!founderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get existing strategy by founder
      const response = await strategyApi.getStrategyByFounder(founderId);
      setStrategy(response.strategy || response);
    } catch (err) {
      // If no strategy exists yet, that's okay - just set empty state
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setStrategy(null);
      } else {
        setError(err.message || 'Failed to fetch strategy');
        console.error('Error fetching strategy:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [founderId]);

  // Fetch strategy on mount and when founderId changes
  useEffect(() => {
    fetchStrategy();
  }, [fetchStrategy]);

  // Generate strategy with AI
  const generateStrategy = async () => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setGenerating(true);
      setError(null);

      const response = await strategyApi.generateStrategy({
        founderId,
        sessionId,
      });

      const newStrategy = response.strategy || response;
      setStrategy(newStrategy);

      return newStrategy;
    } catch (err) {
      setError(err.message || 'Failed to generate strategy');
      console.error('Error generating strategy:', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Update strategy
  const updateStrategy = async (data) => {
    if (!founderId) {
      throw new Error('Founder ID is required');
    }

    try {
      setError(null);
      await strategyApi.updateStrategy(founderId, data);

      setStrategy((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      setError(err.message || 'Failed to update strategy');
      console.error('Error updating strategy:', err);
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

      const response = await strategyApi.regenerateStrategySection({
        founderId,
        section,
      });

      // Map section names to strategy keys
      const sectionKeyMap = {
        'pillars': 'contentPillars',
        'video_ideas': 'videoIdeas',
        'calendar': 'publishingCalendar',
        'goals': 'smartGoals'
      };

      const key = sectionKeyMap[section] || section;

      // Update only the regenerated section
      setStrategy((prev) => ({
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
    strategy,
    loading,
    error,
    generating,
    regeneratingSection,
    fetchStrategy,
    generateStrategy,
    updateStrategy,
    regenerateSection,
  };
};

export default useStrategy;
