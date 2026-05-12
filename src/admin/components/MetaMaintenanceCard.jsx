// src/admin/components/MetaMaintenanceCard.jsx
import React, { useState, useEffect } from 'react';
import { Instagram, AlertTriangle, CheckCircle2, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getMetaIntegrationsStatus } from '../../services/adminIntegrationsApi';

/**
 * Meta Maintenance Card
 *
 * Displays Meta (Instagram/Facebook) integration health and maintenance alerts
 * Shows token expiration warnings and required actions
 */
const MetaMaintenanceCard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMetaIntegrationsStatus();
      setStatus(response.data);
    } catch (err) {
      console.error('Error fetching Meta status:', err);
      setError('Error al cargar estado de Meta');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return 'gray';
    const healthStatus = status.health?.status;
    if (healthStatus === 'healthy') return 'green';
    if (healthStatus === 'needs_attention') return 'yellow';
    if (healthStatus === 'critical') return 'red';
    return 'gray';
  };

  const getStatusIcon = () => {
    if (!status) return <Clock className="w-5 h-5" />;
    const healthStatus = status.health?.status;
    if (healthStatus === 'healthy') return <CheckCircle2 className="w-5 h-5" />;
    if (healthStatus === 'needs_attention') return <AlertTriangle className="w-5 h-5" />;
    if (healthStatus === 'critical') return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getStatusText = () => {
    if (!status) return 'Desconocido';
    const healthStatus = status.health?.status;
    if (healthStatus === 'healthy') return 'Saludable';
    if (healthStatus === 'needs_attention') return 'Requiere Atención';
    if (healthStatus === 'critical') return 'Crítico';
    return 'Desconocido';
  };

  if (loading && !status) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Meta (Instagram/Facebook)</h3>
            <p className="text-sm text-gray-500">Cargando...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Meta (Instagram/Facebook)</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    );
  }

  const statusColor = getStatusColor();
  const statusIcon = getStatusIcon();
  const statusText = getStatusText();

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      badge: 'bg-green-100 text-green-800'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      badge: 'bg-red-100 text-red-800'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800',
      icon: 'text-gray-600',
      badge: 'bg-gray-100 text-gray-800'
    }
  };

  const colors = colorClasses[statusColor];

  return (
    <div className={`bg-white rounded-lg shadow-md border ${colors.border}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Meta (Instagram/Facebook)</h3>
              <p className="text-sm text-gray-500">{status?.totalConnections || 0} conexiones activas</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.badge}`}>
            <span className={colors.icon}>{statusIcon}</span>
            <span className="text-sm font-medium">{statusText}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Health Message */}
        {status?.health?.message && (
          <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
            <p className={`text-sm ${colors.text}`}>{status.health.message}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{status?.activeConnections || 0}</div>
            <div className="text-sm text-gray-600">Conexiones Activas</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{status?.totalConnections || 0}</div>
            <div className="text-sm text-gray-600">Total Conexiones</div>
          </div>
        </div>

        {/* Expired Tokens Alert */}
        {status?.expired && status.expired.count > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">
                  {status.expired.count} Token(s) Expirado(s)
                </h4>
                <p className="text-sm text-red-800 mb-3">
                  Estos usuarios necesitan reconectar sus cuentas de Instagram
                </p>
                <div className="space-y-2">
                  {status.expired.connections.slice(0, 3).map((conn, index) => (
                    <div key={index} className="text-sm text-red-700 flex items-center justify-between">
                      <span className="font-medium">@{conn.instagramUsername}</span>
                      <span className="text-xs">Expiró hace {conn.daysOverdue} días</span>
                    </div>
                  ))}
                  {status.expired.count > 3 && (
                    <div className="text-sm text-red-600">
                      +{status.expired.count - 3} más...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expiring Soon Alert */}
        {status?.expiringSoon && status.expiringSoon.count > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  {status.expiringSoon.count} Token(s) Por Expirar
                </h4>
                <p className="text-sm text-yellow-800 mb-3">
                  Estos tokens expirarán en los próximos 7 días
                </p>
                <div className="space-y-2">
                  {status.expiringSoon.connections.slice(0, 3).map((conn, index) => (
                    <div key={index} className="text-sm text-yellow-700 flex items-center justify-between">
                      <span className="font-medium">@{conn.instagramUsername}</span>
                      <span className="text-xs">Expira en {conn.daysUntilExpiry} días</span>
                    </div>
                  ))}
                  {status.expiringSoon.count > 3 && (
                    <div className="text-sm text-yellow-600">
                      +{status.expiringSoon.count - 3} más...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Info */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recordatorio de Mantenimiento
          </h4>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800">
              <strong>Tokens de Meta expiran cada 60 días.</strong> Los tokens se refrescan automáticamente
              cuando el usuario vuelve a iniciar sesión. Monitorea regularmente el estado de las conexiones.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>Última actualización: {new Date().toLocaleString('es-MX')}</span>
          <button
            onClick={fetchStatus}
            className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaMaintenanceCard;
