import React from 'react';
import { motion } from 'framer-motion';
import { Undo, Redo } from 'lucide-react';

/**
 * Undo/Redo controls for the editor.
 * Displays buttons with enabled/disabled states based on history availability.
 */
export default function HistoryControls({ onUndo, onRedo, canUndo, canRedo }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-1 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <motion.button
        whileHover={{ scale: canUndo ? 1.1 : 1 }}
        whileTap={{ scale: canUndo ? 0.9 : 1 }}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Cmd/Ctrl+Z)"
        className={`p-2 rounded-lg transition ${
          canUndo
            ? 'hover:bg-gray-100 text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <Undo className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: canRedo ? 1.1 : 1 }}
        whileTap={{ scale: canRedo ? 0.9 : 1 }}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Cmd/Ctrl+Shift+Z)"
        className={`p-2 rounded-lg transition ${
          canRedo
            ? 'hover:bg-gray-100 text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        <Redo className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
