/**
 * LazyImage Component
 *
 * Optimized image component that uses native lazy loading + IntersectionObserver
 * for better performance. Images only load when they enter the viewport.
 *
 * Features:
 * - Native lazy loading (loading="lazy")
 * - IntersectionObserver fallback for older browsers
 * - Blur placeholder while loading
 * - Error handling with fallback
 * - Responsive srcset support
 */

import React, { useState, useRef, useEffect, memo } from 'react';

const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  style = {},
  width,
  height,
  placeholder = null,
  fallbackSrc = null,
  srcSet = null,
  sizes = null,
  onLoad = null,
  onError = null,
  threshold = 0.1, // How much of the image should be visible before loading
  rootMargin = '50px', // Start loading 50px before it enters viewport
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Use IntersectionObserver for better control
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // If native lazy loading is supported and no custom behavior needed
    if ('loading' in HTMLImageElement.prototype && !placeholder) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, placeholder]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Show fallback on error
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  // Placeholder styles
  const placeholderStyles = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 0 : 1,
    pointerEvents: 'none',
  };

  // Container styles
  const containerStyles = {
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  // Image styles with fade-in effect
  const imageStyles = {
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div
      ref={imgRef}
      style={containerStyles}
      className={className}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div style={placeholderStyles}>
          {placeholder || (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          )}
        </div>
      )}

      {/* Actual Image - only render src when in view */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          srcSet={srcSet}
          sizes={sizes}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyles}
          {...props}
        />
      )}

      {/* Shimmer animation keyframes (injected once) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
});

export default LazyImage;

/**
 * Preload critical images
 * Call this for above-the-fold images that need to load immediately
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Hook for lazy loading multiple images
 */
export function useLazyImages(srcs) {
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    srcs.forEach((src) => {
      if (!loadedImages[src]) {
        preloadImage(src)
          .then(() => {
            setLoadedImages((prev) => ({ ...prev, [src]: true }));
          })
          .catch(() => {
            setLoadedImages((prev) => ({ ...prev, [src]: false }));
          });
      }
    });
  }, [srcs, loadedImages]);

  return loadedImages;
}
