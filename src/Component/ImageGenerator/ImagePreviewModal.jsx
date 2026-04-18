import React, { useState, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';
import TemplateSelector from './TemplateSelector';
import useImageGenerator from '../../hooks/useImageGenerator';

/**
 * Modal to preview and download generated images.
 * Supports downloading as PNG, SVG, or JPG.
 */
export default function ImagePreviewModal({ image, onClose, post, founderId }) {
  const svgRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(image?.templateUsed);
  const [isDownloading, setIsDownloading] = useState(false);
  const { regenerateWithTemplate, isGenerating } = useImageGenerator();
  const [currentImage, setCurrentImage] = useState(image);

  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);

    try {
      const newImage = await regenerateWithTemplate(
        {
          founderId,
          postData: {
            hook: post.hook || '',
            body: post.body || '',
            cta: post.cta || '',
            pillar: post.pillar || '',
            platform: post.platform || 'Instagram',
            contentType: post.contentType || 'Educational',
          },
          outputFormat: 'both',
        },
        templateId
      );
      setCurrentImage(newImage);
    } catch (err) {
      console.error('Failed to regenerate with template:', err);
    }
  };

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
      if (currentImage.pngBase64) {
        // Use pre-generated PNG from backend
        const byteCharacters = atob(currentImage.pngBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        const filename = `${post.pillar || 'post'}-${Date.now()}.png`;
        saveAs(blob, filename);
      } else if (svgRef.current) {
        // Generate PNG from SVG in frontend
        const dataUrl = await toPng(svgRef.current, {
          width: currentImage.dimensions.width,
          height: currentImage.dimensions.height,
          pixelRatio: 2,
        });
        const filename = `${post.pillar || 'post'}-${Date.now()}.png`;
        saveAs(dataUrl, filename);
      }
    } catch (err) {
      console.error('Failed to download PNG:', err);
      alert('Failed to download PNG. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([currentImage.svg], { type: 'image/svg+xml' });
    const filename = `${post.pillar || 'post'}-${Date.now()}.svg`;
    saveAs(blob, filename);
  };

  const handleDownloadJpg = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await toJpeg(svgRef.current, {
        width: currentImage.dimensions.width,
        height: currentImage.dimensions.height,
        pixelRatio: 2,
        quality: 0.95,
      });
      const filename = `${post.pillar || 'post'}-${Date.now()}.jpg`;
      saveAs(dataUrl, filename);
    } catch (err) {
      console.error('Failed to download JPG:', err);
      alert('Failed to download JPG. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Generated Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex gap-6 overflow-y-auto flex-1">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-4 relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600">Regenerating...</p>
                </div>
              </div>
            )}
            <div
              ref={svgRef}
              className="max-w-full max-h-full"
              style={{
                aspectRatio: `${currentImage.dimensions.width} / ${currentImage.dimensions.height}`,
              }}
              dangerouslySetInnerHTML={{ __html: currentImage.svg }}
            />
          </div>

          {/* Options Sidebar */}
          <div className="w-72 space-y-6 flex-shrink-0">
            {/* Template Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Template Style
              </label>
              <TemplateSelector
                selected={selectedTemplate}
                onChange={handleTemplateChange}
                platform={post.platform}
              />
            </div>

            {/* Download Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Download
              </label>
              <div className="space-y-2">
                <button
                  onClick={handleDownloadPng}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#dccaf4] hover:text-[#1a0530] transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download PNG
                </button>

                <button
                  onClick={handleDownloadSvg}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download SVG
                </button>

                <button
                  onClick={handleDownloadJpg}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download JPG
                </button>
              </div>
            </div>

            {/* Context Info */}
            {currentImage.contextUsed && currentImage.contextUsed.length > 0 && (
              <div className="p-3 bg-violet-50 rounded-lg">
                <p className="text-xs font-medium text-violet-700 mb-1">
                  Generated using:
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentImage.contextUsed.map((context) => (
                    <span
                      key={context}
                      className="inline-block px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded"
                    >
                      {context.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions Info */}
            <div className="text-xs text-gray-500">
              <p>
                Dimensions: {currentImage.dimensions.width} x {currentImage.dimensions.height}px
              </p>
              <p>Template: {currentImage.templateUsed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
