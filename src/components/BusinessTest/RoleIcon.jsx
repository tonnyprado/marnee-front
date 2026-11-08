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
    if (!containerRef.current) {
      console.error('[RoleIcon] Container ref not available');
      return;
    }

    if (!animationData) {
      console.error('[RoleIcon] Animation data not provided');
      return;
    }

    try {
      // Initialize Lottie animation
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData,
      });

      console.log('[RoleIcon] Animation loaded successfully');
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
      // Reset to start and play
      animationRef.current.goToAndStop(0, true);
      animationRef.current.play();
    } else {
      // Stop and reset to first frame
      animationRef.current.goToAndStop(0, true);
    }
  }, [play]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default RoleIcon;
