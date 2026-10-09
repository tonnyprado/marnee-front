/**
 * SecuritySettings Page
 *
 * Manages user security settings including:
 * - Active sessions management
 * - Session revocation
 */

import React from 'react';
import ActiveSessions from '../components/ActiveSessions';
import './SecuritySettings.css';

export default function SecuritySettings() {
  return (
    <div className="security-settings-page">
      <div className="security-container">
        <header className="security-header">
          <h1>Configuración de Seguridad</h1>
          <p className="security-subtitle">
            Administra tus sesiones activas y la seguridad de tu cuenta
          </p>
        </header>

        <section className="security-section">
          <div className="section-header">
            <h2>Administración de Sesiones</h2>
            <p className="section-description">
              Revisa y administra todos los dispositivos donde has iniciado sesión.
              Puedes revocar sesiones sospechosas o cerrar sesión en todos los dispositivos.
            </p>
          </div>

          <ActiveSessions />
        </section>

        <section className="security-section">
          <div className="section-header">
            <h2>Consejos de Seguridad</h2>
          </div>
          <div className="security-tips">
            <div className="tip-card">
              <div className="tip-icon">🔒</div>
              <div className="tip-content">
                <h3>Revisa tus sesiones regularmente</h3>
                <p>
                  Verifica periódicamente las sesiones activas y revoca cualquier
                  dispositivo que no reconozcas.
                </p>
              </div>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🌐</div>
              <div className="tip-content">
                <h3>Usa redes seguras</h3>
                <p>
                  Evita iniciar sesión desde redes WiFi públicas sin protección.
                  Usa una VPN cuando sea necesario.
                </p>
              </div>
            </div>

            <div className="tip-card">
              <div className="tip-icon">🚪</div>
              <div className="tip-content">
                <h3>Cierra sesión al terminar</h3>
                <p>
                  Siempre cierra sesión cuando uses dispositivos compartidos
                  o públicos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
