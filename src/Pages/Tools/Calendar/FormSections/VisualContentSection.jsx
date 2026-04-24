/**
 * VisualContentSection - Campaign Form Section
 *
 * Handles visual content generation:
 * - Generate/Edit/Regenerate branded images
 */

import React from 'react';
import ImageGeneratorButton from '../../../../Component/ImageGenerator/ImageGeneratorButton';

export default function VisualContentSection({ form, founderId, handleEditImage, isGenerating }) {
  return (
    <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Visual Content
      </h3>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {form.hasGeneratedImage
            ? 'Edit or regenerate your branded image.'
            : 'Generate a branded image for this post using your brand colors and style.'}
        </p>

        {form.hasGeneratedImage ? (
          // Show Edit Image and Regenerate buttons when image exists
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEditImage}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit Image
            </button>

            <ImageGeneratorButton
              post={form}
              founderId={founderId}
              postId={form.id}
              buttonText="Regenerate"
              buttonClassName="flex-1"
            />
          </div>
        ) : (
          // Show Generate Image button when no image exists
          <ImageGeneratorButton
            post={form}
            founderId={founderId}
            postId={form.id}
          />
        )}

        <p className="text-xs text-gray-500">
          The image will be generated using data from your Brand Profile, Current Trends, and Strategy.
        </p>
      </div>
    </div>
  );
}
