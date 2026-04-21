import React from 'react';

/**
 * Controls panel for adjusting fill color, stroke color, and sizes.
 * Shows different controls based on the active tool.
 */
export default function EditorControls({
  activeObject,
  fillColor,
  onFillColorChange,
  strokeColor,
  onStrokeColorChange,
  strokeWidth,
  onStrokeWidthChange,
  brushSize,
  onBrushSizeChange,
  activeTool,
}) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700">Controls</h3>

      {/* Fill Color */}
      {activeTool !== 'brush' && activeTool !== 'line' && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fillColor}
              onChange={(e) => onFillColorChange(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={fillColor}
              onChange={(e) => onFillColorChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {/* Stroke Color */}
      {(activeTool === 'brush' ||
        activeTool === 'line' ||
        activeTool === 'rect' ||
        activeTool === 'circle' ||
        activeTool === 'arrow') && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">Stroke Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={strokeColor}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {/* Brush Size */}
      {activeTool === 'brush' && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Stroke Width */}
      {(activeTool === 'line' ||
        activeTool === 'rect' ||
        activeTool === 'circle' ||
        activeTool === 'arrow') && (
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Stroke Width: {strokeWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {/* Active Object Info */}
      {activeObject && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Selected: {activeObject.type || 'Object'}
          </p>
        </div>
      )}
    </div>
  );
}
