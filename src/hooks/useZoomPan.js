import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing zoom and pan state for the image preview.
 * Works with react-zoom-pan-pinch library.
 *
 * @param {number} initialScale - Initial zoom scale (default: 1)
 * @returns {Object} Zoom/pan control functions and state
 */
export function useZoomPan(initialScale = 1) {
  const [scale, setScale] = useState(initialScale);
  const transformRef = useRef(null);

  const zoomIn = useCallback(() => {
    transformRef.current?.zoomIn(0.5, 200);
  }, []);

  const zoomOut = useCallback(() => {
    transformRef.current?.zoomOut(0.5, 200);
  }, []);

  const resetTransform = useCallback(() => {
    transformRef.current?.resetTransform(200);
  }, []);

  const centerView = useCallback(() => {
    transformRef.current?.centerView(1, 200);
  }, []);

  return {
    scale,
    setScale,
    transformRef,
    zoomIn,
    zoomOut,
    resetTransform,
    centerView,
  };
}
