import { useEffect, useState } from 'react';
import {
  TrendingUp, Users, Calendar, MessageSquare, Eye, Activity
} from 'lucide-react';
import {
  getAnalyticsOverview,
  getUserAnalytics,
  getContentAnalytics,
} from '../../services/adminApi';

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [contentAnalytics, setContentAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewData, userAnalyticsData, contentAnalyticsData] = await Promise.all([
        getAnalyticsOverview(days),
        getUserAnalytics(days),
        getContentAnalytics(days),
      ]);

      setOverview(overviewData.data);
      setUserAnalytics(userAnalyticsData.data);
      setContentAnalytics(contentAnalyticsData.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
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
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error al cargar analytics</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with Period Selector */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Métricas y análisis de uso de la plataforma
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${days === d
                  ? 'bg-mn-purple text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {d} días
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards overview={overview} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Activity Chart */}
        <UserActivityChart data={userAnalytics} />

        {/* Content Generation Chart */}
        <ContentGenerationChart data={contentAnalytics} />
      </div>

      {/* Top Events */}
      <TopEventsTable data={userAnalytics} />
    </div>
  );
}

// Overview Cards Component
function OverviewCards({ overview }) {
  const cards = [
    {
      label: 'Total Usuarios',
      value: overview?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Usuarios Activos',
      value: overview?.active_users || 0,
      icon: Activity,
      color: 'bg-green-500',
      change: overview?.new_users ? `+${overview.new_users} nuevos` : null,
    },
    {
      label: 'Calendarios',
      value: overview?.total_calendars || 0,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      label: 'Conversaciones',
      value: overview?.total_conversations || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    {
      label: 'Page Views',
      value: overview?.page_views || 0,
      icon: Eye,
      color: 'bg-indigo-500',
    },
    {
      label: 'Nuevos Usuarios',
      value: overview?.new_users || 0,
      icon: TrendingUp,
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            {card.change && (
              <p className="text-sm text-green-600 mt-2">{card.change}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// User Activity Chart Component
function UserActivityChart({ data }) {
  const dailyActive = data?.daily_active_users || [];

  // Calculate max value for scaling
  const maxUsers = Math.max(...dailyActive.map(d => d.users), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-mn-purple" size={20} />
        Usuarios Activos por Día
      </h3>

      {dailyActive.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No hay datos disponibles
        </div>
      ) : (
        <div className="space-y-3">
          {dailyActive.slice(0, 10).map((day, index) => {
            const percentage = (day.users / maxUsers) * 100;
            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {new Date(day.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {day.users} {day.users === 1 ? 'usuario' : 'usuarios'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-mn-purple h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Content Generation Chart Component
function ContentGenerationChart({ data }) {
  const calendarsByDay = data?.calendars_by_day || [];
  const totalPosts = data?.total_posts_generated || 0;
  const conversations = data?.conversations_started || 0;

  // Calculate max value for scaling
  const maxCalendars = Math.max(...calendarsByDay.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="text-mn-purple" size={20} />
        Contenido Generado
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Posts Generados</p>
          <p className="text-2xl font-bold text-mn-purple">{totalPosts}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Conversaciones</p>
          <p className="text-2xl font-bold text-orange-600">{conversations}</p>
        </div>
      </div>

      {/* Calendars by Day Chart */}
      {calendarsByDay.length === 0 ? (
        <div className="py-6 text-center text-gray-500 text-sm">
          No hay calendarios generados en este período
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Calendarios por día
          </p>
          {calendarsByDay.slice(0, 7).map((day, index) => {
            const percentage = (day.count / maxCalendars) * 100;
            return (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {new Date(day.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span className="font-semibold text-gray-900">{day.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Top Events Table Component
function TopEventsTable({ data }) {
  const topEvents = data?.top_events || [];

  if (topEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="text-mn-purple" size={20} />
          Eventos Más Frecuentes
        </h3>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tipo de Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Porcentaje
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {topEvents.map((event, index) => {
            const total = topEvents.reduce((sum, e) => sum + e.count, 0);
            const percentage = ((event.count / total) * 100).toFixed(1);

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-mn-purple" />
                    <span className="text-sm font-medium text-gray-900">
                      {event.event_type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {event.count.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-mn-purple h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                      {percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
