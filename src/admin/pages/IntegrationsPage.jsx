// src/admin/pages/IntegrationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plug, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import MetaMaintenanceCard from '../components/MetaMaintenanceCard';
import { getIntegrationsOverview } from '../../services/adminIntegrationsApi';

/**
 * Integrations Page - Admin Panel
 *
 * Central dashboard for monitoring and maintaining all platform integrations
 * (Meta, Google, etc.)
 */
const IntegrationsPage = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    // Refresh every 10 minutes
    const interval = setInterval(fetchOverview, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await getIntegrationsOverview();
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching integrations overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallHealth = () => {
    if (!overview) return 'unknown';

    const statuses = [
      overview.meta?.healthStatus,
      overview.google?.healthStatus
    ];

    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.some(s => s === 'healthy')) return 'healthy';
    return 'unknown';
  };

  const overallHealth = getOverallHealth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Plug className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Integraciones</h1>
        </div>
        <p className="text-gray-600">
          Monitoreo y mantenimiento de integraciones con plataformas externas
        </p>
      </div>

      {/* Overall Health Status */}
      {!loading && overview && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg border-2 ${
            overallHealth === 'critical' ? 'bg-red-50 border-red-300' :
            overallHealth === 'warning' ? 'bg-yellow-50 border-yellow-300' :
            overallHealth === 'healthy' ? 'bg-green-50 border-green-300' :
            'bg-gray-50 border-gray-300'
          }`}>
            <div className="flex items-center gap-3">
              {overallHealth === 'critical' && <AlertTriangle className="w-6 h-6 text-red-600" />}
              {overallHealth === 'warning' && <Clock className="w-6 h-6 text-yellow-600" />}
              {overallHealth === 'healthy' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
              <div>
                <h3 className={`font-semibold ${
                  overallHealth === 'critical' ? 'text-red-900' :
                  overallHealth === 'warning' ? 'text-yellow-900' :
                  overallHealth === 'healthy' ? 'text-green-900' :
                  'text-gray-900'
                }`}>
                  Estado General: {
                    overallHealth === 'critical' ? 'Requiere Atención Inmediata' :
                    overallHealth === 'warning' ? 'Requiere Atención' :
                    overallHealth === 'healthy' ? 'Saludable' :
                    'Desconocido'
                  }
                </h3>
                <p className={`text-sm ${
                  overallHealth === 'critical' ? 'text-red-700' :
                  overallHealth === 'warning' ? 'text-yellow-700' :
                  overallHealth === 'healthy' ? 'text-green-700' :
                  'text-gray-700'
                }`}>
                  {overallHealth === 'critical' ? 'Hay integraciones con problemas críticos que requieren acción inmediata' :
                   overallHealth === 'warning' ? 'Algunas integraciones requieren mantenimiento próximamente' :
                   overallHealth === 'healthy' ? 'Todas las integraciones están funcionando correctamente' :
                   'Cargando estado de integraciones...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Tasks Summary */}
      {!loading && overview && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tareas de Mantenimiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Critical Tasks */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Críticas</h3>
              </div>
              <div className="text-3xl font-bold text-red-700">
                {[...overview.meta.maintenanceTasks, ...overview.google.maintenanceTasks]
                  .filter(t => t.priority === 'critical').length}
              </div>
              <p className="text-sm text-red-600">Acción inmediata</p>
            </div>

            {/* High Priority */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Altas</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-700">
                {[...overview.meta.maintenanceTasks, ...overview.google.maintenanceTasks]
                  .filter(t => t.priority === 'high').length}
              </div>
              <p className="text-sm text-yellow-600">Próximos 7 días</p>
            </div>

            {/* Recurring */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Recurrentes</h3>
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {[...overview.meta.maintenanceTasks, ...overview.google.maintenanceTasks]
                  .filter(t => t.priority === 'low' || t.dueDate === 'recurring').length}
              </div>
              <p className="text-sm text-blue-600">Monitoreo continuo</p>
            </div>
          </div>
        </div>
      )}

      {/* Integration Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Plataformas Conectadas</h2>

        {/* Meta (Instagram/Facebook) */}
        <MetaMaintenanceCard />

        {/* Google (YouTube/Analytics/Ads) - Coming Soon */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.01 18.5h-2v-8h2v8zm-1-9.5c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zM9 18.5H7v-8h2v8zm-1-9.5c-.69 0-1.25-.56-1.25-1.25S7.31 6.5 8 6.5s1.25.56 1.25 1.25S8.69 9 8 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Google (YouTube/Analytics/Ads)</h3>
                <p className="text-sm text-gray-500">No configurado</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Próximamente</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Integración de Google OAuth en desarrollo.</strong> Pronto podrás conectar
              YouTube Analytics, Google Analytics, Google Ads y Google My Business.
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Guidelines */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          Guía de Mantenimiento de Integraciones
        </h3>
        <div className="space-y-3 text-sm text-purple-800">
          <div className="flex items-start gap-2">
            <span className="font-bold mt-0.5">1.</span>
            <p>
              <strong>Tokens de Meta:</strong> Se refrescan automáticamente cuando el usuario inicia sesión,
              pero expiran después de 60 días de inactividad.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold mt-0.5">2.</span>
            <p>
              <strong>Monitoreo Regular:</strong> Revisa esta página semanalmente para detectar
              tokens próximos a expirar.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold mt-0.5">3.</span>
            <p>
              <strong>Acción Requerida:</strong> Si un token expira, el usuario debe reconectar
              su cuenta desde la configuración de Marnee.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold mt-0.5">4.</span>
            <p>
              <strong>Tokens de Google:</strong> Usan refresh tokens permanentes, por lo que
              no requieren renovación manual (cuando esté implementado).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
