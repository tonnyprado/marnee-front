import { useEffect, useState } from 'react';
import { Users, CreditCard, Package, UserCheck } from 'lucide-react';
import { getDashboardStats, getAnalyticsOverview } from '../../services/adminApi';
import OpenAICreditsCard from '../components/OpenAICreditsCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, analyticsData] = await Promise.all([
        getDashboardStats(),
        getAnalyticsOverview(30),
      ]);

      setStats(statsData);
      setAnalytics(analyticsData.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mn-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar dashboard</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Usuarios',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Usuarios Activos',
      value: analytics?.active_users || 0,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      label: 'Suscripciones Activas',
      value: stats?.activeSubscriptions || 0,
      icon: CreditCard,
      color: 'bg-purple-500',
    },
    {
      label: 'Planes Disponibles',
      value: stats?.totalPlans || 0,
      icon: Package,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vista general de la plataforma Marnee</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* System Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Estadísticas del Sistema</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Administradores</span>
              <span className="font-semibold">{stats?.adminUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Usuarios de Prueba</span>
              <span className="font-semibold">{stats?.testUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Nuevos Usuarios (30 días)</span>
              <span className="font-semibold text-green-600">{analytics?.new_users || 0}</span>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Estadísticas de Contenido</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Calendarios Generados</span>
              <span className="font-semibold">{analytics?.total_calendars || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Conversaciones</span>
              <span className="font-semibold">{analytics?.total_conversations || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Vistas de Página (30 días)</span>
              <span className="font-semibold text-blue-600">{analytics?.page_views || 0}</span>
            </div>
          </div>
        </div>

        {/* OpenAI Credits */}
        <div className="lg:col-span-2 xl:col-span-1">
          <OpenAICreditsCard />
        </div>
      </div>
    </div>
  );
}
