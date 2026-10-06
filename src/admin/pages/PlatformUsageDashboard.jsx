/**
 * Platform Usage Dashboard
 *
 * Displays:
 * - Token usage (current vs limit)
 * - Cost tracking (USD)
 * - Agent executions
 * - RAG searches
 * - API requests
 * - Tier information
 * - Limit warnings
 *
 * Follows Single Responsibility: Displays usage metrics only
 */

import React, { useState, useEffect, useCallback } from 'react';
import platformService from '../../services/platformService';
import { MetricCard, UsageProgressBar } from '../components/platform';
import './PlatformUsageDashboard.css';

const PlatformUsageDashboard = () => {
  const [usage, setUsage] = useState(null);
  const [limits, setLimits] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('current_month');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [usageData, limitsData, tenantData] = await Promise.all([
        platformService.getUsageSummary(period),
        platformService.checkLimits(),
        platformService.getCurrentTenant(),
      ]);

      setUsage(usageData);
      setLimits(limitsData);
      setTenant(tenantData);
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError(err.response?.data?.detail || 'Error al cargar datos de uso');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="platform-usage">
        <div className="platform-usage__loading">
          <div className="spinner"></div>
          <p>Cargando datos de uso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="platform-usage">
        <div className="platform-usage__error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchData}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-usage">
      {/* Header */}
      <div className="platform-usage__header">
        <div>
          <h1 className="platform-usage__title">Platform Usage</h1>
          <p className="platform-usage__subtitle">
            Monitorea tu consumo de recursos y límites
          </p>
        </div>

        <div className="platform-usage__actions">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="platform-usage__period-select"
          >
            <option value="current_month">Este mes</option>
            <option value="last_month">Mes pasado</option>
            <option value="current_year">Este año</option>
          </select>
          <button onClick={fetchData} className="platform-usage__refresh-btn">
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Tenant Info */}
      {tenant && (
        <div className="platform-usage__tenant-info">
          <div className="tenant-badge">
            <span className="tenant-badge__label">Tenant:</span>
            <strong>{tenant.name}</strong>
          </div>
          <div className={`tier-badge tier-badge--${tenant.tier}`}>
            <span className="tier-badge__label">Plan:</span>
            <strong>{tenant.tier.toUpperCase()}</strong>
          </div>
          {!tenant.is_active && (
            <div className="status-badge status-badge--inactive">
              ⚠️ Inactivo
            </div>
          )}
        </div>
      )}

      {/* Limit Warnings */}
      {limits && !limits.within_limits && (
        <div className="platform-usage__alert platform-usage__alert--danger">
          <h3>⚠️ Límites Excedidos</h3>
          <p>Has alcanzado o excedido tus límites. Actualiza tu plan para continuar.</p>
          {limits.limits_exceeded.map((limit) => (
            <div key={limit} className="platform-usage__alert-item">
              • {limit}
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="platform-usage__metrics">
        <MetricCard
          label="Tokens Consumidos"
          value={formatNumber(usage?.total_tokens || 0)}
          icon="🎯"
          subtitle={`de ${formatNumber(tenant?.monthly_token_limit || 0)}`}
          color="blue"
        />

        <MetricCard
          label="Costo Total"
          value={formatCurrency(usage?.total_cost_usd || 0)}
          icon="💰"
          subtitle={`de ${formatCurrency(tenant?.monthly_cost_limit_usd || 0)}`}
          color="green"
        />

        <MetricCard
          label="Agentes Ejecutados"
          value={formatNumber(usage?.agent_executions || 0)}
          icon="🤖"
          color="purple"
          trend={usage?.agent_executions > 0 ? '+' + usage.agent_executions : '0'}
          trendType="up"
        />

        <MetricCard
          label="Búsquedas RAG"
          value={formatNumber(usage?.rag_searches || 0)}
          icon="🔍"
          color="yellow"
        />
      </div>

      {/* Progress Bars */}
      <div className="platform-usage__progress">
        <h2 className="platform-usage__section-title">Uso de Recursos</h2>

        <UsageProgressBar
          label="Tokens Mensuales"
          current={usage?.total_tokens || 0}
          limit={tenant?.monthly_token_limit || 1000000}
          unit="tokens"
          formatValue={formatNumber}
        />

        <UsageProgressBar
          label="Costo Mensual"
          current={usage?.total_cost_usd || 0}
          limit={tenant?.monthly_cost_limit_usd || 100}
          unit="USD"
          formatValue={formatCurrency}
          warningThreshold={75}
          dangerThreshold={90}
        />

        <UsageProgressBar
          label="Usuarios Activos"
          current={tenant?.active_users || 0}
          limit={tenant?.max_users || 5}
          unit="usuarios"
          warningThreshold={80}
          dangerThreshold={100}
        />
      </div>

      {/* Breakdown */}
      <div className="platform-usage__breakdown">
        <h2 className="platform-usage__section-title">Desglose Detallado</h2>

        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-item__label">Tokens de Entrada</span>
            <span className="breakdown-item__value">
              {formatNumber(usage?.prompt_tokens || 0)}
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-item__label">Tokens de Salida</span>
            <span className="breakdown-item__value">
              {formatNumber(usage?.completion_tokens || 0)}
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-item__label">Requests API</span>
            <span className="breakdown-item__value">
              {formatNumber(usage?.api_requests || 0)}
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-item__label">Búsquedas RAG</span>
            <span className="breakdown-item__value">
              {formatNumber(usage?.rag_searches || 0)}
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-item__label">Agentes Ejecutados</span>
            <span className="breakdown-item__value">
              {formatNumber(usage?.agent_executions || 0)}
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-item__label">Período</span>
            <span className="breakdown-item__value">
              {usage?.period_start && new Date(usage.period_start).toLocaleDateString()}
              {' - '}
              {usage?.period_end && new Date(usage.period_end).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      {tenant?.tier === 'free' || tenant?.tier === 'starter' ? (
        <div className="platform-usage__upgrade-cta">
          <h3>🚀 Upgrade tu plan</h3>
          <p>Desbloquea más tokens, agentes y funcionalidades avanzadas</p>
          <button className="platform-usage__upgrade-btn">
            Ver Planes
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PlatformUsageDashboard;
