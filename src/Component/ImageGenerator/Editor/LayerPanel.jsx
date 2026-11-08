import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

/**
 * Panel for managing layers (canvas objects).
 * Allows bringing to front, sending to back, and deleting objects.
 */
export default function LayerPanel({ canvas, activeObject, onBringToFront, onSendToBack, onDelete }) {
  const objects = canvas?.getObjects() || [];

  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700">Layers</h3>

      {objects.length === 0 ? (
        <p className="text-xs text-gray-400">No objects yet</p>
      ) : (
        <div className="space-y-1">
          {objects.map((obj, index) => (
            <div
              key={index}
              className={`p-2 rounded text-xs ${
                activeObject === obj ? 'bg-violet-100 text-violet-700' : 'bg-white text-gray-600'
              }`}
            >
              <span className="font-medium">
                {obj.type === 'i-text' ? 'Text' : obj.type || 'Object'} {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeObject && (
        <div className="pt-2 border-t border-gray-200 flex gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBringToFront}
            title="Bring to Front"
            className="flex-1 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
          >
            <ArrowUp className="w-4 h-4 mx-auto text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSendToBack}
            title="Send to Back"
            className="flex-1 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
          >
            <ArrowDown className="w-4 h-4 mx-auto text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            title="Delete"
            className="flex-1 p-2 bg-white border border-red-200 rounded hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4 mx-auto text-red-500" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
