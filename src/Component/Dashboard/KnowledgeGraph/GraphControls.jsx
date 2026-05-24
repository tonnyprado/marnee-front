/**
 * GraphControls Component
 * Controles de zoom y refresh para el grafo
 */

import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

export default function GraphControls({
  graphRef,
  onRefresh,
  showLabels,
  onToggleLabels
}) {
  const handleZoomIn = () => {
    if (graphRef?.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef?.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.5, 300);
    }
  };

  const handleReset = () => {
    if (graphRef?.current) {
      graphRef.current.zoomToFit(400, 50);
    }
  };

  const buttonClass = `
    p-2 rounded-lg bg-white border border-[#dccaf4] text-[#40086d]
    hover:bg-[#ede0f8] hover:border-[#40086d] transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:ring-opacity-30
  `;

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleZoomIn} className={buttonClass} title="Zoom In">
        <ZoomIn size={18} />
      </button>
      <button onClick={handleZoomOut} className={buttonClass} title="Zoom Out">
        <ZoomOut size={18} />
      </button>
      <button onClick={handleReset} className={buttonClass} title="Reset View">
        <Maximize2 size={18} />
      </button>
      {onRefresh && (
        <button onClick={onRefresh} className={buttonClass} title="Refresh Data">
          <RotateCcw size={18} />
        </button>
      )}
    </div>
  );
}
