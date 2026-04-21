import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Link2, Lock, Globe } from 'lucide-react';

/**
 * ShareModal - Modal to generate and share conversation link
 */
export default function ShareModal({ isOpen, onClose, conversationId, onGenerateLink }) {
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [access, setAccess] = useState('view'); // 'view' or 'private'

  useEffect(() => {
    if (isOpen && conversationId) {
      generateShareLink();
    }
  }, [isOpen, conversationId]);

  const generateShareLink = async () => {
    setIsGenerating(true);

    try {
      // Call API to generate share token
      const response = await onGenerateLink(conversationId, access);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/shared/${response.token}`;
      setShareLink(link);
    } catch (error) {
      console.error('Failed to generate share link:', error);
      // Fallback: generate local link
      const baseUrl = window.location.origin;
      const token = btoa(`${conversationId}-${Date.now()}`);
      setShareLink(`${baseUrl}/shared/${token}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accessOptions = [
    {
      id: 'view',
      name: 'Anyone with link',
      description: 'Anyone can view (read-only)',
      icon: Globe,
    },
    {
      id: 'private',
      name: 'Team only',
      description: 'Only team members can access',
      icon: Lock,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#40086d]" />
                <h3 className="font-bold text-gray-900">Share Conversation</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Access Control */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Who can access
                </label>
                <div className="space-y-2">
                  {accessOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setAccess(option.id);
                          generateShareLink();
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          access === option.id
                            ? 'border-[#40086d] bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            access === option.id ? 'text-[#40086d]' : 'text-gray-500'
                          }`}
                        />
                        <div className="flex-1 text-left">
                          <div
                            className={`text-sm font-semibold ${
                              access === option.id ? 'text-[#40086d]' : 'text-gray-900'
                            }`}
                          >
                            {option.name}
                          </div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Share Link */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Share link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {isGenerating ? (
                      <span className="text-sm text-gray-400">Generating link...</span>
                    ) : (
                      <span className="text-sm text-gray-600 truncate">{shareLink}</span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    disabled={isGenerating || !shareLink}
                    className="p-2 bg-[#40086d] text-white rounded-lg hover:bg-[#2d0550] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-green-600 mt-2"
                  >
                    ✓ Link copied to clipboard!
                  </motion.p>
                )}
              </div>

              {/* Info */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-900">
                  <strong>Note:</strong> This link will expire in 7 days. Anyone with the link
                  can view the conversation.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
