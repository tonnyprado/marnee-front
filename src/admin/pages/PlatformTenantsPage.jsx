/**
 * Platform Tenants Page
 * View and manage tenant information
 */

import React, { useState, useEffect } from 'react';
import platformService from '../../services/platformService';
import { MetricCard } from '../components/platform';
import './PlatformTenantsPage.css';

const PlatformTenantsPage = () => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenant();
  }, []);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const data = await platformService.getCurrentTenant();
      setTenant(data);
    } catch (err) {
      console.error('Error fetching tenant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!tenant) {
    return <div className="error">No se pudo cargar la información del tenant</div>;
  }

  return (
    <div className="platform-tenants">
      <h1>Información del Tenant</h1>

      <div className="tenant-card">
        <div className="tenant-header">
          <div>
            <h2>{tenant.name}</h2>
            <p className="tenant-slug">/{tenant.slug}</p>
          </div>
          <div className={`tier-badge tier-badge--${tenant.tier}`}>
            {tenant.tier.toUpperCase()}
          </div>
        </div>

        {tenant.description && (
          <p className="tenant-description">{tenant.description}</p>
        )}

        <div className="tenant-metrics">
          <MetricCard
            label="Plan"
            value={tenant.tier}
            icon="📦"
            color="blue"
          />
          <MetricCard
            label="Tokens Mensuales"
            value={tenant.monthly_token_limit.toLocaleString()}
            icon="🎯"
            color="green"
          />
          <MetricCard
            label="Usuarios Máximos"
            value={tenant.max_users}
            icon="👥"
            color="purple"
          />
          <MetricCard
            label="Estado"
            value={tenant.is_active ? 'Activo' : 'Inactivo'}
            icon={tenant.is_active ? '✅' : '⚠️'}
            color={tenant.is_active ? 'green' : 'red'}
          />
        </div>

        <div className="tenant-features">
          <h3>Funcionalidades Habilitadas</h3>
          <div className="features-grid">
            <div className={`feature-item ${tenant.rag_enabled ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{tenant.rag_enabled ? '✅' : '❌'}</span>
              <span>RAG / Knowledge Base</span>
            </div>
            <div className={`feature-item ${tenant.agents_enabled ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{tenant.agents_enabled ? '✅' : '❌'}</span>
              <span>AI Agents</span>
            </div>
            <div className={`feature-item ${tenant.custom_models_enabled ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{tenant.custom_models_enabled ? '✅' : '❌'}</span>
              <span>Modelos Personalizados</span>
            </div>
            <div className={`feature-item ${tenant.advanced_analytics ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{tenant.advanced_analytics ? '✅' : '❌'}</span>
              <span>Analytics Avanzados</span>
            </div>
            <div className={`feature-item ${tenant.api_access_enabled ? 'enabled' : 'disabled'}`}>
              <span className="feature-icon">{tenant.api_access_enabled ? '✅' : '❌'}</span>
              <span>Acceso API</span>
            </div>
          </div>
        </div>

        <div className="tenant-info">
          <div className="info-row">
            <span className="info-label">Creado:</span>
            <span>{new Date(tenant.created_at).toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Última actualización:</span>
            <span>{new Date(tenant.updated_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformTenantsPage;
