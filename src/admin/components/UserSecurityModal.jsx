import { useState, useEffect } from 'react';
import { X, Shield, Activity, CheckCircle, XCircle } from 'lucide-react';
import { getUserSecurityDetails, forceVerifyEmail, revokeAllUserSessions } from '../../services/adminSecurityApi';
import { formatDistanceToNow } from 'date-fns';
import SessionCard from './SessionCard';

export default function UserSecurityModal({ userId, open, onClose, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && userId) {
      loadSecurityDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  const loadSecurityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await getUserSecurityDetails(userId);
      setData(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceVerify = async () => {
    if (!window.confirm('Are you sure you want to force verify this email?')) return;

    try {
      await forceVerifyEmail(userId);
      alert('Email verified successfully');
      loadSecurityDetails();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!window.confirm('Are you sure you want to revoke ALL sessions for this user?')) return;

    try {
      const result = await revokeAllUserSessions(userId);
      alert(result.message);
      loadSecurityDetails();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Security Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Email Verification */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Email Verification
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {data.emailVerified ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-700 font-medium">Not Verified</span>
                        </>
                      )}
                    </div>
                    {!data.emailVerified && (
                      <button
                        onClick={handleForceVerify}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Force Verify
                      </button>
                    )}
                  </div>
                  {data.emailVerifiedAt && (
                    <p className="text-sm text-gray-600 mt-2">
                      Verified {formatDistanceToNow(new Date(data.emailVerifiedAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>

              {/* Login History */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Login History
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Login:</span>
                    <span className="font-medium">
                      {data.lastLogin
                        ? formatDistanceToNow(new Date(data.lastLogin), { addSuffix: true })
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Failed Attempts (24h):</span>
                    <span className="font-medium">{data.failedLoginAttempts24h || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Logins:</span>
                    <span className="font-medium">{data.totalLogins || 0}</span>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Active Sessions ({data.activeSessions || 0})
                  </h3>
                  {data.sessions && data.sessions.length > 0 && (
                    <button
                      onClick={handleRevokeAllSessions}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Revoke All
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {data.sessions && data.sessions.length > 0 ? (
                    data.sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        showUser={false}
                        onRevoke={() => {}}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 text-center py-4">No active sessions</p>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              {data.recentAuditLogs && data.recentAuditLogs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {data.recentAuditLogs.map((log, index) => (
                      <div key={index} className="text-sm flex justify-between items-center">
                        <div>
                          <span className="font-medium">{log.action}</span>
                          <span className="text-gray-600 ml-2">{log.ipAddress}</span>
                        </div>
                        <span className={log.success ? 'text-green-600' : 'text-red-600'}>
                          {log.success ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
