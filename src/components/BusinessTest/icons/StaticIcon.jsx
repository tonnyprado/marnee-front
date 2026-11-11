/**
 * StaticIcon Component
 * Wrapper for static SVG icons that follows the same interface as RoleIcon
 *
 * SOLID Principles:
 * - SRP: Single responsibility - render static icons with animation support
 * - OCP: Open for extension (new icon types), closed for modification
 * - LSP: Can substitute RoleIcon without breaking existing code
 * - ISP: Simple interface with only needed props
 * - DIP: Depends on abstraction (iconType) not concrete implementations
 */
import React from 'react';
import StarMedalIcon from './StarMedalIcon';
import ShoppingBagIcon from './ShoppingBagIcon';

// Icon registry - follows OCP (open for extension)
const ICON_COMPONENTS = {
  starMedal: StarMedalIcon,
  shoppingBag: ShoppingBagIcon,
};

const StaticIcon = ({ iconType, play = false }) => {
  const IconComponent = ICON_COMPONENTS[iconType];

  if (!IconComponent) {
    console.error(`[StaticIcon] Unknown icon type: ${iconType}`);
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent animate={play} />
    </div>
  );
};

export default StaticIcon;
