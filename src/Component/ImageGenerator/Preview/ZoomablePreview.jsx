import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

/**
 * Zoomable and pannable preview container for generated images.
 * Supports scroll zoom, pinch-to-zoom, double-click zoom, and drag to pan.
 */
export default function ZoomablePreview({
  svgContent,
  dimensions,
  transformRef,
  onScaleChange,
  isGenerating,
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden" style={{ maxHeight: '100%' }}>
      {isGenerating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Regenerating...</p>
          </div>
        </div>
      )}

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        centerOnInit
        doubleClick={{ mode: 'zoomIn', step: 0.5 }}
        wheel={{ step: 0.1, smoothStep: 0.01 }}
        pinch={{ step: 0.1 }}
        onTransformed={(ref, state) => onScaleChange?.(state.scale)}
        limitToBounds={false}
        velocityAnimation={{ sensitivity: 1, animationTime: 100 }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%', maxHeight: '100%' }}
            contentStyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: `${dimensions.width}px`,
                maxHeight: `${dimensions.height}px`,
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </TransformComponent>
        )}
      </TransformWrapper>
    </div>
  );
}
