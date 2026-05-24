/**
 * IrisWipeTransition Component
 * Star Wars style iris wipe transition effect
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function IrisWipeTransition({
  isActive,
  onComplete,
  duration = 800,
  color = '#40086d'
}) {
  const [radius, setRadius] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setRadius(0);

      // Start animation after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRadius(150); // Expand to 150% to cover corners
        });
      });

      // Complete after duration
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete]);

  // Hide after animation completes
  useEffect(() => {
    if (!isActive && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setRadius(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, isVisible]);

  if (!isVisible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: isActive ? 'all' : 'none',
      }}
    >
      {/* The iris wipe mask - circle expanding from center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: color,
          clipPath: `circle(${radius}% at 50% 50%)`,
          transition: `clip-path ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
    </div>,
    document.body
  );
}

/**
 * Hook to use iris wipe transition with navigation
 */
export function useIrisWipeTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const startTransition = useCallback((navigateFn, path) => {
    setIsTransitioning(true);
    setPendingNavigation({ navigateFn, path });
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.navigateFn(pendingNavigation.path);
    }
    // Keep visible briefly while page loads
    setTimeout(() => {
      setIsTransitioning(false);
      setPendingNavigation(null);
    }, 100);
  }, [pendingNavigation]);

  return {
    isTransitioning,
    startTransition,
    handleTransitionComplete,
  };
}
