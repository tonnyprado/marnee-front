/**
 * Platform Agents Page
 *
 * Features:
 * - List all available agents
 * - Execute agents with custom input
 * - View execution results
 * - Multi-agent workflow toggle
 * - Execution history
 *
 * Follows Single Responsibility: Agent execution UI
 */

import React, { useState, useEffect } from 'react';
import platformService from '../../services/platformService';
import { AgentCard } from '../components/platform';
import './PlatformAgentsPage.css';

const PlatformAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentInput, setAgentInput] = useState('');
  const [enableCollaboration, setEnableCollaboration] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await platformService.listAgents();
      setAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.detail || 'Error al cargar agentes');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = (agentRole) => {
    const agent = agents.find((a) => a.role === agentRole);
    setSelectedAgent(agent);
    setExecutionResult(null);
  };

  const executeAgent = async () => {
    if (!selectedAgent || !agentInput.trim()) {
      alert('Por favor ingresa una tarea para el agente');
      return;
    }

    try {
      setExecuting(true);
      setExecutionResult(null);

      const result = await platformService.executeAgent({
        agent_role: selectedAgent.role,
        input: agentInput,
        enable_collaboration: enableCollaboration,
        context: {},
      });

      setExecutionResult(result);
      setAgentInput('');
    } catch (err) {
      console.error('Error executing agent:', err);
      setExecutionResult({
        status: 'failed',
        error_message: err.response?.data?.detail || 'Error al ejecutar el agente',
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="platform-agents">
        <div className="platform-agents__loading">
          <div className="spinner"></div>
          <p>Cargando agentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="platform-agents">
        <div className="platform-agents__error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchAgents}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-agents">
      {/* Header */}
      <div className="platform-agents__header">
        <div>
          <h1 className="platform-agents__title">AI Agents</h1>
          <p className="platform-agents__subtitle">
            6 agentes especializados para marketing y análisis
          </p>
        </div>
        <button onClick={fetchAgents} className="platform-agents__refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      {/* Agents Grid */}
      <div className="platform-agents__grid">
        {agents.map((agent) => (
          <AgentCard
            key={agent.role}
            role={agent.role}
            name={agent.name}
            description={agent.description}
            tools={agent.tools}
            enabled={agent.enabled}
            model={agent.model}
            onExecute={handleExecute}
            isLoading={executing && selectedAgent?.role === agent.role}
          />
        ))}
      </div>

      {/* Execution Modal */}
      {selectedAgent && (
        <div className="agent-modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="agent-modal" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal__header">
              <h2>{selectedAgent.name}</h2>
              <button
                className="agent-modal__close"
                onClick={() => setSelectedAgent(null)}
              >
                ✕
              </button>
            </div>

            <div className="agent-modal__body">
              {!executionResult ? (
                <>
                  <div className="agent-modal__form">
                    <label className="agent-modal__label">
                      ¿Qué tarea quieres que realice el agente?
                    </label>
                    <textarea
                      className="agent-modal__textarea"
                      placeholder={`Ejemplo: "Crea una estrategia de marketing para una marca de moda sostenible dirigida a Gen Z"`}
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      rows={4}
                      disabled={executing}
                    />

                    <div className="agent-modal__option">
                      <label className="agent-modal__checkbox">
                        <input
                          type="checkbox"
                          checked={enableCollaboration}
                          onChange={(e) => setEnableCollaboration(e.target.checked)}
                          disabled={executing}
                        />
                        <span>Habilitar colaboración multi-agente</span>
                      </label>
                      <p className="agent-modal__option-help">
                        Cuando está habilitado, múltiples agentes trabajarán juntos para completar la tarea
                      </p>
                    </div>

                    <div className="agent-modal__actions">
                      <button
                        className="agent-modal__btn agent-modal__btn--secondary"
                        onClick={() => setSelectedAgent(null)}
                        disabled={executing}
                      >
                        Cancelar
                      </button>
                      <button
                        className="agent-modal__btn agent-modal__btn--primary"
                        onClick={executeAgent}
                        disabled={executing || !agentInput.trim()}
                      >
                        {executing ? (
                          <>
                            <span className="spinner-small"></span>
                            Ejecutando...
                          </>
                        ) : (
                          '▶ Ejecutar Agente'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="agent-modal__result">
                    <div className={`result-status result-status--${executionResult.status}`}>
                      <h3>
                        {executionResult.status === 'success' ? '✅' : '❌'}
                        {executionResult.status === 'success'
                          ? ' Ejecución Exitosa'
                          : ' Ejecución Fallida'}
                      </h3>
                    </div>

                    {executionResult.status === 'success' ? (
                      <>
                        <div className="result-section">
                          <h4>Resultado:</h4>
                          <div className="result-output">
                            {executionResult.output}
                          </div>
                        </div>

                        {executionResult.reasoning_steps &&
                          executionResult.reasoning_steps.length > 0 && (
                            <div className="result-section">
                              <h4>Pasos de Razonamiento:</h4>
                              <ol className="reasoning-steps">
                                {executionResult.reasoning_steps.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                        <div className="result-metrics">
                          <div className="result-metric">
                            <span className="result-metric__label">Tokens:</span>
                            <span className="result-metric__value">
                              {executionResult.tokens_used?.toLocaleString()}
                            </span>
                          </div>
                          <div className="result-metric">
                            <span className="result-metric__label">Costo:</span>
                            <span className="result-metric__value">
                              ${executionResult.cost_usd?.toFixed(4)}
                            </span>
                          </div>
                          <div className="result-metric">
                            <span className="result-metric__label">Duración:</span>
                            <span className="result-metric__value">
                              {executionResult.duration_seconds?.toFixed(2)}s
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="result-error">
                        <p>{executionResult.error_message}</p>
                      </div>
                    )}

                    <div className="agent-modal__actions">
                      <button
                        className="agent-modal__btn agent-modal__btn--secondary"
                        onClick={() => {
                          setExecutionResult(null);
                          setSelectedAgent(null);
                        }}
                      >
                        Cerrar
                      </button>
                      <button
                        className="agent-modal__btn agent-modal__btn--primary"
                        onClick={() => setExecutionResult(null)}
                      >
                        Nueva Ejecución
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAgentsPage;
