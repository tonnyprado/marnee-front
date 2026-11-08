import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, Loader2, AlertCircle, Palette } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';

/**
 * BrandGuidelinesModal - Modal for uploading and processing brand guidelines
 *
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function to close the modal
 * - onSuccess: Function called with processed content when successful
 */
export default function BrandGuidelinesModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else if (err.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF, PNG, or JPG.');
      } else {
        setError(err.message);
      }
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await api.processBrandGuidelines(file);
      setIsSuccess(true);

      // Wait for success animation
      setTimeout(() => {
        onSuccess?.(result.content);
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to process brand guidelines. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    setFile(null);
    setError(null);
    setIsSuccess(false);
    onClose();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Success State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-gray-900 mb-2"
                    >
                      Brand Guidelines Processed!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600"
                    >
                      Marnee now understands your brand identity
                    </motion.p>

                    {/* Animated particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            opacity: 0,
                            scale: 0,
                            x: '50%',
                            y: '50%'
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0.5],
                            x: `${50 + (Math.random() - 0.5) * 100}%`,
                            y: `${50 + (Math.random() - 0.5) * 100}%`
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.1 + i * 0.05,
                            ease: 'easeOut'
                          }}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            background: ['#40086d', '#7c3aed', '#22c55e', '#3b82f6'][i % 4]
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">Brand Guidelines</h2>
                            <p className="text-sm text-gray-500">Upload your brand identity document</p>
                          </div>
                        </div>
                        <button
                          onClick={handleClose}
                          disabled={isProcessing}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {!file ? (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            isDragActive
                              ? 'border-violet-500 bg-violet-50'
                              : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-violet-600" />
                          </div>
                          {isDragActive ? (
                            <p className="text-violet-600 font-medium">Drop your file here...</p>
                          ) : (
                            <>
                              <p className="text-gray-700 font-medium mb-1">
                                <span className="text-violet-600">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-sm text-gray-500">PDF, PNG, or JPG (max 10MB)</p>
                            </>
                          )}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-violet-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 truncate max-w-[200px]">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={removeFile}
                              disabled={isProcessing}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <X className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Error Message */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Info */}
                      <div className="mt-4 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                        <p className="text-sm text-violet-800">
                          <strong>Marnee will extract:</strong> brand colors, typography, logo guidelines,
                          tone of voice, and visual identity to personalize your content recommendations.
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                      <div className="flex gap-3">
                        <button
                          onClick={handleClose}
                          disabled={isProcessing}
                          className="flex-1 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProcess}
                          disabled={!file || isProcessing}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Palette className="w-5 h-5" />
                              Process Guidelines
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
