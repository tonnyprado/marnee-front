/**
 * StarMedalIcon Component
 * Static SVG icon for Influencer role
 * Follows SRP: Single responsibility - render star medal icon
 */
import React from 'react';

const StarMedalIcon = ({ className = '', animate = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        color: '#e8a723',
        transition: 'all 0.3s ease',
        transform: animate ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
      }}
    >
      {/* Star shape */}
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      {/* Ribbon */}
      <path
        d="M12 18 L12 22 M8 20 L12 22 L16 20"
        stroke="#e8a723"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export default StarMedalIcon;
