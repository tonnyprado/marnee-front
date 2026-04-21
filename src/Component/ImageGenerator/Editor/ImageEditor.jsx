import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useImageEditor } from '../../../hooks/useImageEditor';
import { useEditorHistory } from '../../../hooks/useEditorHistory';
import EditorToolbar from './EditorToolbar';
import EditorControls from './EditorControls';
import LayerPanel from './LayerPanel';
import HistoryControls from './HistoryControls';

/**
 * Main image editor component with Fabric.js canvas.
 * Provides advanced editing tools including drawing, shapes, text, and manipulation.
 */
export default function ImageEditor({ svgContent, dimensions, onSave, onCancel }) {
  const containerRef = useRef(null);
  const {
    canvas,
    initializeCanvas,
    loadSVG,
    activeTool,
    setTool,
    activeObject,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    brushSize,
    setBrushSize,
    addShape,
    addText,
    exportToSVG,
    exportToPNG,
    deleteSelected,
    bringToFront,
    sendToBack,
  } = useImageEditor();

  const { undo, redo, canUndo, canRedo } = useEditorHistory(canvas);

  useEffect(() => {
    if (containerRef.current && !canvas) {
      const canvasEl = document.createElement('canvas');
      canvasEl.id = 'fabric-canvas';
      containerRef.current.appendChild(canvasEl);

      initializeCanvas(canvasEl, dimensions.width, dimensions.height);
      loadSVG(svgContent);
    }
  }, [canvas, dimensions, svgContent, initializeCanvas, loadSVG]);

  const handleSave = async () => {
    const newSvg = exportToSVG();
    const pngDataUrl = await exportToPNG();
    onSave({ svg: newSvg, pngDataUrl });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, undo, redo]);

  return (
    <div className="flex h-full gap-4">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <div
          ref={containerRef}
          className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        />

        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4">
          <EditorToolbar
            activeTool={activeTool}
            onToolChange={setTool}
            onAddShape={addShape}
            onAddText={addText}
          />
        </div>

        {/* History Controls */}
        <div className="absolute top-4 right-4">
          <HistoryControls onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-64 space-y-4 overflow-y-auto">
        <EditorControls
          activeObject={activeObject}
          fillColor={fillColor}
          onFillColorChange={setFillColor}
          strokeColor={strokeColor}
          onStrokeColorChange={setStrokeColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          activeTool={activeTool}
        />

        <LayerPanel
          canvas={canvas}
          activeObject={activeObject}
          onBringToFront={bringToFront}
          onSendToBack={sendToBack}
          onDelete={deleteSelected}
        />

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full px-4 py-2.5 bg-[#1e1e1e] text-white rounded-lg hover:bg-[#dccaf4] hover:text-[#1a0530] transition font-medium text-sm"
          >
            Save Changes
          </motion.button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
