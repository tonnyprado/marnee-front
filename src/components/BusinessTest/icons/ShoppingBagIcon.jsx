/**
 * ShoppingBagIcon Component
 * Static SVG icon for Small Business role
 * Follows SRP: Single responsibility - render shopping bag icon
 */
import React from 'react';

const ShoppingBagIcon = ({ className = '', animate = false }) => {
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
        color: '#8b5cf6',
        transition: 'all 0.3s ease',
        transform: animate ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
      }}
    >
      {/* Shopping bag body */}
      <path
        d="M6 2 L3 6 L3 20 C3 21.1 3.9 22 5 22 L19 22 C20.1 22 21 21.1 21 20 L21 6 L18 2 Z"
        fill="#c4b5fd"
        stroke="#8b5cf6"
        strokeWidth="1.5"
      />
      {/* Bag top opening */}
      <path
        d="M3 6 L21 6"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      {/* Handle */}
      <path
        d="M16 10 C16 7.79 14.21 6 12 6 C9.79 6 8 7.79 8 10"
        stroke="#7c3aed"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export default ShoppingBagIcon;
