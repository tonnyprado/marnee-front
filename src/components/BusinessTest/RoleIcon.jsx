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
        autoplay: false,
        animationData: animationData,
      });

      console.log('[RoleIcon] Animation loaded, totalFrames:', animationRef.current.totalFrames);
      console.log('[RoleIcon] Animation name:', animationData.nm);

      // Use data_ready event which fires when animation is ready to be manipulated
      animationRef.current.addEventListener('data_ready', () => {
        const totalFrames = animationRef.current.totalFrames;
        console.log('[RoleIcon] data_ready, going to frame:', totalFrames - 1);
        animationRef.current.goToAndStop(totalFrames - 1, true);
      });

      // Also try immediately in case the event already fired
      setTimeout(() => {
        if (animationRef.current) {
          const totalFrames = animationRef.current.totalFrames;
          console.log('[RoleIcon] setTimeout fallback, going to frame:', totalFrames - 1);
          animationRef.current.goToAndStop(totalFrames - 1, true);
        }
      }, 100);
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
