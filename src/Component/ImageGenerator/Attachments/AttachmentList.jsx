import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, FileText, File } from 'lucide-react';

function getFileIcon(type) {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  return File;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Displays a list of uploaded attachments with thumbnails and remove functionality.
 */
export default function AttachmentList({ attachments, onRemove }) {
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {attachments.map((attachment) => {
          const Icon = getFileIcon(attachment.type);

          return (
            <motion.div
              key={attachment.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
            >
              {/* Preview or Icon */}
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{attachment.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(attachment.size)}</p>
              </div>

              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(attachment.id)}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
