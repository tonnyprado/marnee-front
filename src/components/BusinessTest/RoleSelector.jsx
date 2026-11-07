/**
 * Role Selector Component
 * Primera pantalla del Business Test para seleccionar el tipo de negocio
 */
import React from 'react';
import { BUSINESS_ROLES } from '../../config/businessTestQuestions';
import './RoleSelector.css';

const RoleSelector = ({ onSelectRole, selectedRole }) => {
  return (
    <div className="role-selector-container">
      <div className="role-selector-header">
        <h1>¿A qué te dedicas?</h1>
        <p className="role-selector-subtitle">
          Selecciona la opción que mejor describa tu negocio para personalizar tu experiencia
        </p>
      </div>

      <div className="role-cards-grid">
        {BUSINESS_ROLES.map((role) => (
          <div
            key={role.value}
            className={`role-card ${selectedRole === role.value ? 'role-card-selected' : ''}`}
            onClick={() => onSelectRole(role.value)}
          >
            <div className="role-card-icon">{role.icon}</div>
            <h3 className="role-card-title">{role.label}</h3>
            <p className="role-card-description">{role.description}</p>

            {selectedRole === role.value && (
              <div className="role-card-check">✓</div>
            )}
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="role-selector-footer">
          <button className="role-continue-button" onClick={() => {}}>
            Continuar
            <span className="button-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
