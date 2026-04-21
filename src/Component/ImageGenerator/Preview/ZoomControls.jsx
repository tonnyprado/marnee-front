import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

/**
 * Zoom control buttons for the image preview.
 * Provides zoom in, zoom out, fit to view, and reset functionality.
 */
export default function ZoomControls({ scale, onZoomIn, onZoomOut, onReset, onCenter }) {
  const controls = [
    { icon: ZoomIn, onClick: onZoomIn, label: 'Zoom In' },
    { icon: ZoomOut, onClick: onZoomOut, label: 'Zoom Out' },
    { icon: Maximize2, onClick: onCenter, label: 'Fit to View' },
    { icon: RotateCcw, onClick: onReset, label: 'Reset' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block mb-2">
        Zoom ({Math.round(scale * 100)}%)
      </label>
      <div className="grid grid-cols-2 gap-2">
        {controls.map(({ icon: Icon, onClick, label }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            title={label}
            className="flex items-center justify-center gap-1.5 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">{label.split(' ')[0]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
