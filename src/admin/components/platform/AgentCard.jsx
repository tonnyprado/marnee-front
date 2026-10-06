/**
 * AgentCard - Display agent information and execute
 *
 * Features:
 * - Agent name and description
 * - Available tools
 * - Enabled/disabled status
 * - Execute button
 *
 * Follows Single Responsibility: Only displays agent info
 */

import React from 'react';
import './AgentCard.css';

const AGENT_ICONS = {
  marketing_strategist: '🎯',
  market_researcher: '🔍',
  content_creator: '✨',
  data_analyst: '📊',
  content_scheduler: '📅',
  campaign_optimizer: '⚡',
};

const AgentCard = ({
  role,
  name,
  description,
  tools = [],
  enabled,
  model,
  onExecute,
  isLoading = false,
}) => {
  const icon = AGENT_ICONS[role] || '🤖';

  return (
    <div className={`agent-card ${!enabled ? 'agent-card--disabled' : ''}`}>
      <div className="agent-card__header">
        <div className="agent-card__icon">{icon}</div>
        <div className="agent-card__info">
          <h3 className="agent-card__name">{name}</h3>
          <span className="agent-card__model">{model}</span>
        </div>
        {!enabled && (
          <span className="agent-card__badge agent-card__badge--disabled">
            Requiere upgrade
          </span>
        )}
      </div>

      <p className="agent-card__description">{description}</p>

      {tools.length > 0 && (
        <div className="agent-card__tools">
          <span className="agent-card__tools-label">Herramientas:</span>
          <div className="agent-card__tools-list">
            {tools.slice(0, 4).map((tool) => (
              <span key={tool} className="agent-card__tool">
                {tool}
              </span>
            ))}
            {tools.length > 4 && (
              <span className="agent-card__tool agent-card__tool--more">
                +{tools.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      <button
        className="agent-card__execute-btn"
        onClick={() => onExecute(role)}
        disabled={!enabled || isLoading}
      >
        {isLoading ? (
          <>
            <span className="agent-card__spinner"></span>
            Ejecutando...
          </>
        ) : (
          <>
            <span>▶</span>
            Ejecutar Agente
          </>
        )}
      </button>
    </div>
  );
};

export default AgentCard;
