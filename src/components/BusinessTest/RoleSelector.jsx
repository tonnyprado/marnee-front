/**
 * Role Selector Component
 * Primera pantalla del Business Test para seleccionar el tipo de negocio
 */
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_ROLES } from '../../config/businessTestQuestions';
import './RoleSelector.css';
import RoleIcon from './RoleIcon';
import StaticIcon from './icons/StaticIcon';

// Import Lottie animation files (only for Community Manager and Marketing Agency)
import communityManagerIcon from '../../assets/iconly-icon-export-1794115263.json';
import marketingAgencyIcon from '../../assets/iconly-icon-export-1794115324.json';

// Icon configuration following DIP (Dependency Inversion Principle)
const ICON_CONFIG = {
  'INFLUENCER': { type: 'static', iconType: 'starMedal' },
  'COMMUNITY_MANAGER': { type: 'lottie', animationData: communityManagerIcon },
  'MARKETING_AGENCY': { type: 'lottie', animationData: marketingAgencyIcon },
  'SMALL_BUSINESS': { type: 'static', iconType: 'shoppingBag' },
};

const RoleSelector = ({ onSelectRole, onContinue, selectedRole }) => {
  const { t } = useLanguage();
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleMouseEnter = (roleValue) => {
    setHoveredRole(roleValue);
  };

  const handleMouseLeave = () => {
    setHoveredRole(null);
  };

  // Helper to get role translation key
  const getRoleKey = (roleValue) => {
    const keyMap = {
      'MARKETING_AGENCY': 'marketingAgency',
      'COMMUNITY_MANAGER': 'communityManager',
      'INFLUENCER': 'influencer',
      'SMALL_BUSINESS': 'smallBusiness',
    };
    return keyMap[roleValue] || 'smallBusiness';
  };

  return (
    <div className="role-selector-container">
      <div className="role-selector-header">
        <h1>{t('roleSelector.title')}</h1>
        <p className="role-selector-subtitle">
          {t('roleSelector.subtitle')}
        </p>
      </div>

      <div className="role-options-row">
        {BUSINESS_ROLES.map((role) => {
          const roleKey = getRoleKey(role.value);
          const iconConfig = ICON_CONFIG[role.value];
          const isHoveredOrSelected = hoveredRole === role.value || selectedRole === role.value;

          return (
            <div
              key={role.value}
              className={`role-option ${selectedRole === role.value ? 'role-option-selected' : ''} ${hoveredRole === role.value ? 'role-option-hovered' : ''}`}
              onClick={() => onSelectRole(role.value)}
              onMouseEnter={() => handleMouseEnter(role.value)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="role-icon-wrapper">
                {iconConfig.type === 'static' ? (
                  <StaticIcon
                    iconType={iconConfig.iconType}
                    play={isHoveredOrSelected}
                  />
                ) : (
                  <RoleIcon
                    animationData={iconConfig.animationData}
                    play={isHoveredOrSelected}
                  />
                )}
              </div>
              <h3 className="role-title">{t(`roleSelector.roles.${roleKey}.label`)}</h3>
              <p className="role-description">{t(`roleSelector.roles.${roleKey}.description`)}</p>
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className="role-selector-footer">
          <button className="role-continue-button" onClick={onContinue}>
            {t('roleSelector.continue')}
            <span className="button-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
