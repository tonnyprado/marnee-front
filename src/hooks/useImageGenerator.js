import { useState, useCallback } from 'react';
import imageApi from '../services/imageApi';
import calendarPostApi from '../services/calendarPostApi';

/**
 * Hook for generating images for posts.
 *
 * @returns {Object} Image generation state and functions
 */
export function useImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Generate an image for a post.
   *
   * @param {Object} params - Generation parameters
   * @param {string} params.founderId - Founder ID
   * @param {Object} params.postData - Post data
   * @param {string} [params.templateType] - Specific template (optional)
   * @param {boolean} [params.optimizeCopy] - Optimize copy with AI
   * @param {string} [params.outputFormat='both'] - Output format
   * @param {Array<Object>} [params.attachments] - File attachments for regeneration
   * @returns {Promise<Object>} Generated image response
   */
  const generateImage = useCallback(async (params) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use different API method if attachments are provided
      const response = params.attachments && params.attachments.length > 0
        ? await imageApi.generateImageWithAttachments(params, params.attachments)
        : await imageApi.generateImage(params);

      setGeneratedImage(response);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Regenerate with a different template.
   *
   * @param {Object} params - Original generation parameters
   * @param {string} templateType - New template to use
   * @returns {Promise<Object>} Generated image response
   */
  const regenerateWithTemplate = useCallback(
    async (params, templateType) => {
      return generateImage({ ...params, templateType });
    },
    [generateImage]
  );

  /**
   * Clear error state.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear generated image.
   */
  const clearImage = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  /**
   * Save generated image to the database for a calendar post.
   *
   * @param {string} postId - Calendar post ID
   * @param {Object} imageData - Generated image data
   * @returns {Promise<Object>} Response from server
   */
  const saveGeneratedImage = useCallback(async (postId, imageData) => {
    try {
      const response = await calendarPostApi.saveGeneratedImage(postId, imageData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to save generated image';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Fetch saved generated image for a calendar post.
   *
   * @param {string} postId - Calendar post ID
   * @returns {Promise<Object|null>} Image data or null if no image exists
   */
  const fetchGeneratedImage = useCallback(async (postId) => {
    try {
      const imageData = await calendarPostApi.getGeneratedImage(postId);
      if (imageData) {
        setGeneratedImage(imageData);
      }
      return imageData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch generated image';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    generateImage,
    regenerateWithTemplate,
    saveGeneratedImage,
    fetchGeneratedImage,
    isGenerating,
    generatedImage,
    error,
    clearError,
    clearImage,
  };
}

export default useImageGenerator;
