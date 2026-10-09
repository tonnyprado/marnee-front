/**
 * ActiveSessions Component
 *
 * Displays all active sessions for the current user
 * Allows revoking individual sessions or all sessions
 */

import React, { useState, useEffect } from 'react';
import sessionService from '../core/services/SessionService';
import { useAuth } from '../context/AuthContext';
import logger from '../core/utils/logger';
import './ActiveSessions.css';

const log = logger.createContextLogger('ActiveSessions');

export default function ActiveSessions() {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await sessionService.getActiveSessions();
      setSessions(response.sessions || []);

      log.info('Sessions loaded', { count: response.sessions?.length });
    } catch (err) {
      log.error('Failed to load sessions', err);
      setError('No se pudieron cargar las sesiones activas');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (jti, isCurrent) => {
    if (isCurrent) {
      const confirmed = window.confirm(
        '¿Cerrar sesión en este dispositivo? Serás redirigido al login.'
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(
        '¿Revocar esta sesión? El dispositivo será desconectado.'
      );
      if (!confirmed) return;
    }

    try {
      setRevoking(jti);
      await sessionService.revokeSession(jti);

      log.info('Session revoked', { jti, isCurrent });

      if (isCurrent) {
        // If revoking current session, logout
        logout();
      } else {
        // Reload sessions to update the list
        await loadSessions();
      }
    } catch (err) {
      log.error('Failed to revoke session', { jti, error: err });
      alert('Error al revocar la sesión. Intenta nuevamente.');
    } finally {
      setRevoking(null);
    }
  };

  const handleLogoutAll = async () => {
    const confirmed = window.confirm(
      '¿Cerrar sesión en TODOS los dispositivos? Serás redirigido al login.'
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await sessionService.logoutAll();

      log.info('All sessions logged out');

      // Logout locally
      logout();
    } catch (err) {
      log.error('Failed to logout all sessions', err);
      alert('Error al cerrar todas las sesiones. Intenta nuevamente.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="active-sessions">
        <div className="loading">Cargando sesiones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="active-sessions">
        <div className="error">
          {error}
          <button onClick={loadSessions}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="active-sessions">
      <div className="sessions-header">
        <h3>Sesiones Activas</h3>
        {sessions.length > 1 && (
          <button
            className="logout-all-btn"
            onClick={handleLogoutAll}
            disabled={loading}
          >
            Cerrar Todas las Sesiones
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="no-sessions">
          No hay sesiones activas
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => {
            const { device, browser, os } = sessionService.parseUserAgent(
              session.user_agent
            );
            const deviceIcon = sessionService.getDeviceIcon(device);
            const isCurrent = session.is_current;

            return (
              <div
                key={session.jti}
                className={`session-card ${isCurrent ? 'current' : ''}`}
              >
                <div className="session-icon">{deviceIcon}</div>

                <div className="session-info">
                  <div className="session-device">
                    {device} - {browser}
                    {isCurrent && <span className="current-badge">Actual</span>}
                  </div>
                  <div className="session-details">
                    <span>{os}</span>
                    {session.ip_address && (
                      <span> • IP: {session.ip_address}</span>
                    )}
                  </div>
                  <div className="session-time">
                    Última actividad: {formatDate(session.issued_at)}
                  </div>
                  <div className="session-expires">
                    Expira: {formatDate(session.expires_at)}
                  </div>
                </div>

                <button
                  className="revoke-btn"
                  onClick={() => handleRevokeSession(session.jti, isCurrent)}
                  disabled={revoking === session.jti}
                >
                  {revoking === session.jti ? 'Revocando...' : 'Revocar'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="sessions-footer">
        <p className="sessions-info-text">
          Las sesiones expiran automáticamente después de 7 días de inactividad.
          Puedes revocar sesiones sospechosas en cualquier momento.
        </p>
      </div>
    </div>
  );
}
