/**
 * Role Selector Component
 * Primera pantalla del Business Test para seleccionar el tipo de negocio
 */
import React, { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import { BUSINESS_ROLES } from '../../config/businessTestQuestions';
import './RoleSelector.css';

// Import all Lottie animation files
import influencerIcon from '../../assets/iconly-icon-export-1794115180.json';
import communityManagerIcon from '../../assets/iconly-icon-export-1794115263.json';
import marketingAgencyIcon from '../../assets/iconly-icon-export-1794115324.json';
import smallBusinessIcon from '../../assets/iconly-icon-export-1794115391.json';

const ICON_MAP = {
  'iconly-icon-export-1794115180.json': influencerIcon,
  'iconly-icon-export-1794115263.json': communityManagerIcon,
  'iconly-icon-export-1794115324.json': marketingAgencyIcon,
  'iconly-icon-export-1794115391.json': smallBusinessIcon,
};

const RoleSelector = ({ onSelectRole, onContinue, selectedRole }) => {
  const [hoveredRole, setHoveredRole] = useState(null);
  const lottieRefs = useRef({});

  const handleMouseEnter = (roleValue) => {
    setHoveredRole(roleValue);
    // Play animation on hover
    if (lottieRefs.current[roleValue]) {
      lottieRefs.current[roleValue].play();
    }
  };

  const handleMouseLeave = () => {
    setHoveredRole(null);
  };

  return (
    <div className="role-selector-container">
      <div className="role-selector-header">
        <h1>¿A qué te dedicas?</h1>
        <p className="role-selector-subtitle">
          Selecciona la opción que mejor describa tu negocio para personalizar tu experiencia
        </p>
      </div>

      <div className="role-options-row">
        {BUSINESS_ROLES.map((role) => (
          <div
            key={role.value}
            className={`role-option ${selectedRole === role.value ? 'role-option-selected' : ''} ${hoveredRole === role.value ? 'role-option-hovered' : ''}`}
            onClick={() => onSelectRole(role.value)}
            onMouseEnter={() => handleMouseEnter(role.value)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="role-icon-wrapper">
              <Lottie
                lottieRef={(ref) => {
                  if (ref) lottieRefs.current[role.value] = ref;
                }}
                animationData={ICON_MAP[role.iconFile]}
                loop={false}
                autoplay={false}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <h3 className="role-title">{role.label}</h3>
            <p className="role-description">{role.description}</p>
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="role-selector-footer">
          <button className="role-continue-button" onClick={onContinue}>
            Continuar
            <span className="button-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
