import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Pencil, Type, Square, Circle, Minus, ArrowRight } from 'lucide-react';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'brush', icon: Pencil, label: 'Brush' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
];

/**
 * Floating toolbar for the image editor with drawing tools and shapes.
 */
export default function EditorToolbar({ activeTool, onToolChange, onAddShape, onAddText }) {
  const handleToolClick = (toolId) => {
    onToolChange(toolId);

    // For shapes and text, also add them immediately
    if (['rect', 'circle', 'line', 'arrow'].includes(toolId)) {
      onAddShape(toolId);
      // Switch back to select after adding
      setTimeout(() => onToolChange('select'), 100);
    } else if (toolId === 'text') {
      onAddText();
      setTimeout(() => onToolChange('select'), 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-1 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {tools.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleToolClick(id)}
          title={label}
          className={`p-2 rounded-lg transition ${
            activeTool === id
              ? 'bg-violet-100 text-violet-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Icon className="w-5 h-5" />
        </motion.button>
      ))}
    </motion.div>
  );
}
