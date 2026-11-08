import { useEffect, useState } from 'react';
import { AlertTriangle, Users, Activity, AlertCircle } from 'lucide-react';
import SecurityStatCard from '../components/SecurityStatCard';
import { getSecurityDashboardStats, getLoginStats } from '../../services/adminSecurityApi';
import { Link } from 'react-router-dom';

export default function SecurityDashboard() {
  const [stats, setStats] = useState(null);
  const [loginStats, setLoginStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, loginData] = await Promise.all([
        getSecurityDashboardStats(),
        getLoginStats(days),
      ]);
      setStats(statsData);
      setLoginStats(loginData);
    } catch (err) {
      console.error('Error loading security dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600">Loading security dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-mn-purple to-purple-600 bg-clip-text text-transparent">
            Security Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Monitor security metrics and alerts</p>
        </div>
        <button
          onClick={loadData}
          className="px-6 py-3 bg-gradient-to-r from-mn-purple to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-medium"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/security/alerts">
            <SecurityStatCard
              title="Failed Logins (24h)"
              value={stats.failedLoginAttempts24h || 0}
              icon={AlertTriangle}
              color="red"
            />
          </Link>
          <Link to="/admin/security/alerts">
            <SecurityStatCard
              title="Unverified Users"
              value={stats.unverifiedUsers || 0}
              icon={Users}
              color="yellow"
            />
          </Link>
          <Link to="/admin/security/sessions">
            <SecurityStatCard
              title="Active Sessions"
              value={stats.activeSessions || 0}
              icon={Activity}
              color="green"
            />
          </Link>
          <Link to="/admin/security/alerts">
            <SecurityStatCard
              title="Critical Alerts"
              value={stats.criticalAlerts || 0}
              icon={AlertCircle}
              color="red"
            />
          </Link>
        </div>
      )}

      {/* Login Stats Chart */}
      {loginStats && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-mn-lilac/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-mn-black">
              Login Attempts (Last {days} Days)
            </h2>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="px-4 py-2 border border-mn-lilac rounded-xl focus:ring-2 focus:ring-mn-purple focus:border-transparent transition-all"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>

          {/* Simple table view */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Successful
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Failed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loginStats.dailyStats?.map((stat) => (
                  <tr key={stat.date}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(stat.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {stat.successfulLogins || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {stat.failedLogins || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {(stat.successfulLogins || 0) + (stat.failedLogins || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Failed IPs */}
      {loginStats?.topFailedIPs && loginStats.topFailedIPs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-mn-lilac/20">
          <h2 className="text-xl font-display font-semibold text-mn-black mb-4">
            Top IPs with Failed Attempts
          </h2>
          <div className="space-y-2">
            {loginStats.topFailedIPs.map((ip, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100"
              >
                <span className="text-sm font-medium text-mn-black font-mono">{ip.ipAddress}</span>
                <span className="text-sm text-red-600 font-semibold">
                  {ip.count} failed attempts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/security/audit-logs"
          className="group p-6 bg-gradient-to-br from-white to-mn-ice rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center border border-mn-lilac/20"
        >
          <h3 className="font-display font-semibold text-mn-purple group-hover:text-purple-600 transition-colors">Audit Logs</h3>
          <p className="text-sm text-gray-600 mt-2">View detailed audit trail</p>
        </Link>
        <Link
          to="/admin/security/sessions"
          className="group p-6 bg-gradient-to-br from-white to-mn-ice rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center border border-mn-lilac/20"
        >
          <h3 className="font-display font-semibold text-mn-purple group-hover:text-purple-600 transition-colors">Active Sessions</h3>
          <p className="text-sm text-gray-600 mt-2">Manage user sessions</p>
        </Link>
        <Link
          to="/admin/security/alerts"
          className="group p-6 bg-gradient-to-br from-white to-mn-ice rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center border border-mn-lilac/20"
        >
          <h3 className="font-display font-semibold text-mn-purple group-hover:text-purple-600 transition-colors">Security Alerts</h3>
          <p className="text-sm text-gray-600 mt-2">Review security threats</p>
        </Link>
      </div>
    </div>
  );
}
