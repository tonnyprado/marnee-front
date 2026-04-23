import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllActiveSessions, revokeSession, revokeAllUserSessions } from '../../services/adminSecurityApi';
import SessionCard from '../components/SessionCard';

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllActiveSessions(null, page, 50);
      setSessions(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalSessions(data.totalElements || 0);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to revoke this session?')) return;

    try {
      await revokeSession(sessionId);
      alert('Session revoked successfully');
      loadSessions();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRevokeAllForUser = async (userId, userEmail) => {
    if (!window.confirm(`Revoke ALL sessions for ${userEmail}?`)) return;

    try {
      await revokeAllUserSessions(userId);
      alert('All sessions revoked successfully');
      loadSessions();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Group sessions by user
  const groupedSessions = sessions.reduce((acc, session) => {
    const email = session.userEmail;
    if (!acc[email]) {
      acc[email] = {
        userId: session.userId,
        userEmail: email,
        userName: session.userName,
        sessions: [],
      };
    }
    acc[email].sessions.push(session);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
          <p className="text-sm text-gray-600 mt-1">{totalSessions} active sessions total</p>
        </div>
        <button
          onClick={loadSessions}
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

      {loading && (
        <div className="text-center text-gray-600 py-12">Loading sessions...</div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
          No active sessions found
        </div>
      )}

      {/* Grouped by User */}
      <div className="space-y-6">
        {Object.values(groupedSessions).map((group) => (
          <div key={group.userEmail} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{group.userName}</h3>
                <p className="text-sm text-gray-600">{group.userEmail}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {group.sessions.length} active session{group.sessions.length > 1 ? 's' : ''}
                </p>
              </div>
              {group.sessions.length > 1 && (
                <button
                  onClick={() => handleRevokeAllForUser(group.userId, group.userEmail)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Revoke All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {group.sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  showUser={false}
                  onRevoke={handleRevokeSession}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
