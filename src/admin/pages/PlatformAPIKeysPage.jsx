/**
 * Platform API Keys Page
 * Manage API keys for programmatic access
 */

import React, { useState, useEffect, useCallback } from 'react';
import platformService from '../../services/platformService';
import './PlatformAPIKeysPage.css';

const PlatformAPIKeysPage = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState(['read']);
  const [createdKey, setCreatedKey] = useState(null);

  const fetchAPIKeys = useCallback(async () => {
    try {
      setLoading(true);
      const data = await platformService.listAPIKeys();
      setApiKeys(data);
    } catch (err) {
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAPIKeys();
  }, [fetchAPIKeys]);

  const createAPIKey = async () => {
    try {
      const result = await platformService.createAPIKey({
        name: newKeyName,
        scopes: newKeyScopes,
      });
      setCreatedKey(result);
      setNewKeyName('');
      setNewKeyScopes(['read']);
      fetchAPIKeys();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al crear API key');
    }
  };

  const revokeAPIKey = async (keyId) => {
    if (!window.confirm('¿Estás seguro de revocar esta API key?')) return;

    try {
      await platformService.revokeAPIKey(keyId);
      fetchAPIKeys();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al revocar API key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles!');
  };

  return (
    <div className="platform-api-keys">
      <div className="platform-api-keys__header">
        <div>
          <h1>API Keys</h1>
          <p>Gestiona claves para acceso programático</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear API Key
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="api-keys-list">
          {apiKeys.length === 0 ? (
            <div className="empty-state">
              <p>No tienes API keys creadas</p>
              <button onClick={() => setShowCreateModal(true)}>
                Crear primera API key
              </button>
            </div>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className="api-key-card">
                <div className="api-key-info">
                  <h3>{key.name}</h3>
                  <code>{key.key_prefix}••••••••••••••••</code>
                  <div className="api-key-meta">
                    <span className="scope-badge">{key.scopes.join(', ')}</span>
                    <span>Creada: {new Date(key.created_at).toLocaleDateString()}</span>
                    {key.last_used_at && (
                      <span>Último uso: {new Date(key.last_used_at).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => revokeAPIKey(key.id)}
                >
                  Revocar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Crear API Key</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Mi API Key"
              />
            </div>
            <div className="form-group">
              <label>Scopes</label>
              <div className="scope-checkboxes">
                {['read', 'write', 'admin'].map((scope) => (
                  <label key={scope}>
                    <input
                      type="checkbox"
                      checked={newKeyScopes.includes(scope)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKeyScopes([...newKeyScopes, scope]);
                        } else {
                          setNewKeyScopes(newKeyScopes.filter((s) => s !== scope));
                        }
                      }}
                    />
                    {scope}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancelar</button>
              <button
                className="btn-primary"
                onClick={createAPIKey}
                disabled={!newKeyName.trim() || newKeyScopes.length === 0}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Created Key Modal */}
      {createdKey && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>✅ API Key Creada</h2>
            <div className="warning-box">
              <p>⚠️ Guarda esta clave ahora. No podrás verla de nuevo.</p>
            </div>
            <div className="created-key-display">
              <code>{createdKey.key}</code>
              <button onClick={() => copyToClipboard(createdKey.key)}>
                📋 Copiar
              </button>
            </div>
            <button
              className="btn-primary"
              onClick={() => setCreatedKey(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAPIKeysPage;
