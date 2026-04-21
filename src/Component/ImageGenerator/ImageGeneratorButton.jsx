import React, { useState } from 'react';
import useImageGenerator from '../../hooks/useImageGenerator';
import ImagePreviewModal from './ImagePreviewModal';

/**
 * Button to generate an image for a post.
 * Opens a modal with the generated image preview and download options.
 */
export default function ImageGeneratorButton({ post, founderId, postId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    generateImage,
    saveGeneratedImage,
    isGenerating,
    generatedImage,
    error
  } = useImageGenerator();

  const handleGenerateClick = async () => {
    try {
      const newImage = await generateImage({
        founderId,
        postData: {
          hook: post.hook || '',
          body: post.body || '',
          cta: post.cta || '',
          pillar: post.pillar || '',
          platform: post.platform || 'Instagram',
          contentType: post.contentType || 'Educational',
          format: post.format || '',
          angle: post.angle || '',
        },
        outputFormat: 'both',
        optimizeCopy: false, // Can be made configurable
      });

      // Save the generated image to the database if we have a postId
      if (postId && newImage) {
        try {
          await saveGeneratedImage(postId, newImage);
          console.log('✅ Image saved to database for post:', postId);
        } catch (saveErr) {
          console.error('Failed to save image to database:', saveErr);
          // Don't block the modal from opening even if save fails
        }
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to generate image:', err);
      // Error is already set in the hook
    }
  };

  return (
    <>
      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Generate Image
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}

      {isModalOpen && generatedImage && (
        <ImagePreviewModal
          image={generatedImage}
          onClose={() => setIsModalOpen(false)}
          post={post}
          founderId={founderId}
          postId={postId}
        />
      )}
    </>
  );
}
