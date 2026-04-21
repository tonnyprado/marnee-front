import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Pencil } from 'lucide-react';

// Preview mode components
import ZoomablePreview from './Preview/ZoomablePreview';
import ZoomControls from './Preview/ZoomControls';

// Editor mode components
import ImageEditor from './Editor/ImageEditor';

// Attachments
import AttachmentUploader from './Attachments/AttachmentUploader';
import AttachmentList from './Attachments/AttachmentList';

// Existing components
import TemplateSelector from './TemplateSelector';

// Hooks
import { useZoomPan } from '../../hooks/useZoomPan';
import { useAttachments } from '../../hooks/useAttachments';
import useImageGenerator from '../../hooks/useImageGenerator';

// Download utilities
import { toPng, toJpeg } from 'html-to-image';
import { saveAs } from 'file-saver';

/**
 * Modal to preview and edit generated images.
 * Supports zoom/pan, advanced editing, attachments, and downloading.
 */
export default function ImagePreviewModal({ image, onClose, post, founderId }) {
  const svgRef = useRef(null);

  // Mode state: 'preview' | 'edit'
  const [mode, setMode] = useState('preview');
  const [currentImage, setCurrentImage] = useState(image);
  const [selectedTemplate, setSelectedTemplate] = useState(image?.templateUsed);
  const [isDownloading, setIsDownloading] = useState(false);

  // Hooks
  const { regenerateWithTemplate, isGenerating } = useImageGenerator();
  const { scale, transformRef, zoomIn, zoomOut, resetTransform, centerView, setScale } =
    useZoomPan();
  const {
    attachments,
    addFiles,
    removeFile,
    errors: attachmentErrors,
    maxFiles,
  } = useAttachments();

  // Adjust SVG size after it's inserted to ensure it fits within the container
  useEffect(() => {
    if (svgRef.current && mode === 'preview') {
      const svg = svgRef.current.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = 'auto';
        svg.style.maxWidth = '100%';
        svg.style.maxHeight = '100%';
        svg.style.display = 'block';
      }
    }
  }, [currentImage, mode]);

  // Template change handler (now with attachments)
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
          attachments: attachments.map((a) => a), // Include attachments
        },
        templateId
      );
      setCurrentImage(newImage);
    } catch (err) {
      console.error('Failed to regenerate with template:', err);
    }
  };

  // Editor save handler
  const handleEditorSave = useCallback(
    ({ svg, pngDataUrl }) => {
      setCurrentImage((prev) => ({
        ...prev,
        svg,
        pngBase64: pngDataUrl?.split(',')[1] || null,
      }));
      setMode('preview');
    },
    []
  );

  const handleDownloadPng = async () => {
    setIsDownloading(true);
    try {
      if (currentImage.pngBase64) {
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

  const modes = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'edit', label: 'Edit', icon: Pencil },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Generated Image</h2>

              {/* Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {modes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      mode === id
                        ? 'bg-white text-violet-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex gap-6 overflow-hidden min-h-0">
            {mode === 'preview' ? (
              <>
                {/* Preview Mode */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ZoomablePreview
                    svgContent={currentImage.svg}
                    dimensions={currentImage.dimensions}
                    transformRef={transformRef}
                    onScaleChange={setScale}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Preview Sidebar */}
                <div className="w-72 space-y-6 overflow-y-auto flex-shrink-0">
                  <ZoomControls
                    scale={scale}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    onReset={resetTransform}
                    onCenter={centerView}
                  />

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

                  <AttachmentUploader
                    onFilesAdded={addFiles}
                    maxFiles={maxFiles}
                    currentCount={attachments.length}
                    errors={attachmentErrors}
                  />

                  <AttachmentList attachments={attachments} onRemove={removeFile} />

                  {/* Regenerate Button */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {attachments.length > 0 ? 'Regenerate with Context' : 'Regenerate Image'}
                    </label>
                    <button
                      onClick={() => handleTemplateChange(selectedTemplate)}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate
                        </>
                      )}
                    </button>
                    {attachments.length > 0 && (
                      <p className="text-xs text-violet-600 mt-1 text-center">
                        Will include {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      Uses current template + Marnee's AI
                    </p>
                  </div>

                  {/* Download Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Download</label>
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
                      <p className="text-xs font-medium text-violet-700 mb-1">Generated using:</p>
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
                      Dimensions: {currentImage.dimensions.width} x{' '}
                      {currentImage.dimensions.height}px
                    </p>
                    <p>Template: {currentImage.templateUsed}</p>
                  </div>
                </div>
              </>
            ) : (
              /* Edit Mode */
              <div className="flex-1 min-h-0 w-full">
                <ImageEditor
                  svgContent={currentImage.svg}
                  dimensions={currentImage.dimensions}
                  onSave={handleEditorSave}
                  onCancel={() => setMode('preview')}
                />
              </div>
            )}
          </div>

          {/* Hidden SVG ref for downloads in preview mode */}
          {mode === 'preview' && (
            <div ref={svgRef} className="hidden" dangerouslySetInnerHTML={{ __html: currentImage.svg }} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
