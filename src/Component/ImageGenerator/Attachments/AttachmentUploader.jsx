import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, FileText, AlertCircle } from 'lucide-react';

/**
 * File uploader component with drag & drop support.
 * Accepts images and documents for image regeneration.
 */
export default function AttachmentUploader({ onFilesAdded, maxFiles, currentCount, errors }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: maxFiles - currentCount,
    disabled: currentCount >= maxFiles,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">
        Attachments ({currentCount}/{maxFiles})
      </label>

      <motion.div
        {...getRootProps()}
        whileHover={{ scale: currentCount < maxFiles ? 1.01 : 1 }}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-violet-500 bg-violet-50'
            : currentCount >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-violet-400'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Image className="w-5 h-5" />
            <FileText className="w-5 h-5" />
          </div>

          {isDragActive ? (
            <p className="text-sm text-violet-600 font-medium">Drop files here...</p>
          ) : currentCount >= maxFiles ? (
            <p className="text-sm text-gray-400">Maximum files reached</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                <span className="text-violet-600 font-medium">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, SVG, PDF, DOC, TXT (max 10MB)</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
              >
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
