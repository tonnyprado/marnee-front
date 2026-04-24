/**
 * useCampaignImageHandler Hook
 *
 * Manages image-related state and operations for campaign forms
 * Extracted from CampaignForm.jsx
 */

import { useState } from 'react';
import useImageGenerator from '../../../../hooks/useImageGenerator';

export function useCampaignImageHandler() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [loadedImage, setLoadedImage] = useState(null);
  const { fetchGeneratedImage, isGenerating } = useImageGenerator();

  const handleEditImage = async (postId) => {
    if (!postId) {
      console.error('Cannot edit image: post ID is missing');
      return;
    }

    try {
      // Fetch the saved image from the database
      const imageData = await fetchGeneratedImage(postId);

      if (imageData) {
        setLoadedImage(imageData);
        setIsImageModalOpen(true);
      } else {
        console.warn('No saved image found for this post');
      }
    } catch (error) {
      console.error('Failed to load saved image:', error);
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setLoadedImage(null);
  };

  return {
    isImageModalOpen,
    setIsImageModalOpen,
    loadedImage,
    setLoadedImage,
    handleEditImage,
    closeImageModal,
    isGenerating,
  };
}
