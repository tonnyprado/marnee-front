import React, { useRef, useEffect } from 'react';
import lottie from 'lottie-web';

/**
 * RoleIcon Component
 * Wraps Lottie animation with play/stop controls
 */
const RoleIcon = ({ animationData, play }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    try {
      // Initialize Lottie animation
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true, // Autoplay to ensure rendering
        animationData: animationData,
      });

      console.log('[RoleIcon] Animation loaded:', animationData.nm);

      // Once animation completes, go to last frame and stop
      animationRef.current.addEventListener('complete', () => {
        console.log('[RoleIcon] Animation complete, staying at last frame');
        const totalFrames = animationRef.current.totalFrames;
        animationRef.current.goToAndStop(totalFrames - 1, true);
      });
    } catch (error) {
      console.error('[RoleIcon] Error loading animation:', error);
    }

    return () => {
      // Cleanup on unmount
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationData]);

  useEffect(() => {
    if (!animationRef.current) return;

    if (play) {
      // Reset to start and play animation
      animationRef.current.goToAndStop(0, true);
      animationRef.current.play();
    } else {
      // Show the last frame (fully visible state)
      const totalFrames = animationRef.current.totalFrames;
      animationRef.current.goToAndStop(totalFrames - 1, true);
    }
  }, [play]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default RoleIcon;
