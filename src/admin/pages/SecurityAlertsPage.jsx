import { useEffect, useState } from 'react';
import { AlertTriangle, User, Mail, Key } from 'lucide-react';
import { getSecurityAlerts } from '../../services/adminSecurityApi';
import { formatDistanceToNow } from 'date-fns';

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSecurityAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Error loading security alerts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-600">Loading security alerts...</div>
      </div>
    );
  }

  const totalAlerts =
    (alerts?.suspiciousIPs?.length || 0) +
    (alerts?.suspiciousUsers?.length || 0) +
    (alerts?.unusedResetTokens?.length || 0) +
    (alerts?.oldUnverifiedUsers?.length || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Alerts</h1>
          <p className="text-sm text-gray-600 mt-1">{totalAlerts} active alerts</p>
        </div>
        <button
          onClick={loadAlerts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {totalAlerts === 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center">
          <div className="text-4xl mb-2">✓</div>
          <div className="font-semibold">No security alerts</div>
          <div className="text-sm mt-1">Everything looks good!</div>
        </div>
      )}

      {/* Suspicious IPs */}
      {alerts?.suspiciousIPs && alerts.suspiciousIPs.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-gray-900">
              Suspicious IPs ({alerts.suspiciousIPs.length})
            </h2>
          </div>
          <div className="divide-y">
            {alerts.suspiciousIPs.map((ip, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{ip.ipAddress}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {ip.failedAttempts} failed attempts
                    </div>
                    {ip.affectedUsers && ip.affectedUsers.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Attempted users: {ip.affectedUsers.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    Last attempt:{' '}
                    {formatDistanceToNow(new Date(ip.lastAttempt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suspicious Users */}
      {alerts?.suspiciousUsers && alerts.suspiciousUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-600" />
            <h2 className="font-semibold text-gray-900">
              Suspicious Users ({alerts.suspiciousUsers.length})
            </h2>
          </div>
          <div className="divide-y">
            {alerts.suspiciousUsers.map((user, index) => (
              <div key={index} className="px-6 py-4">
                <div className="font-medium text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-600 mt-1">{user.reason}</div>
                <div className="text-xs text-gray-500 mt-1">{user.details}</div>
                {user.ips && user.ips.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">IPs: {user.ips.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unused Reset Tokens */}
      {alerts?.unusedResetTokens && alerts.unusedResetTokens.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-gray-900">
              Unused Reset Tokens ({alerts.unusedResetTokens.length})
            </h2>
          </div>
          <div className="divide-y">
            {alerts.unusedResetTokens.map((token, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{token.email}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Generated{' '}
                      {formatDistanceToNow(new Date(token.generatedAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Not used</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Old Unverified Users */}
      {alerts?.oldUnverifiedUsers && alerts.oldUnverifiedUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">
              Unverified Users ({alerts.oldUnverifiedUsers.length})
            </h2>
          </div>
          <div className="divide-y">
            {alerts.oldUnverifiedUsers.map((user, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Registered {user.daysSinceRegistration} days ago
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Email not verified</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
