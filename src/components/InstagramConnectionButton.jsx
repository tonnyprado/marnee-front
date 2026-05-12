// src/components/InstagramConnectionButton.jsx
import React, { useState, useEffect } from 'react';
import { Instagram, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getInstagramStatus, connectInstagram, disconnectInstagram } from '../services/instagramApi';
import InstagramRequirementsModal from './InstagramRequirementsModal';

/**
 * Instagram Connection Button
 *
 * Displays in the header/menu as a prominent "partner integration" button
 * Shows connection status and allows users to connect/disconnect
 */
const InstagramConnectionButton = ({ collapsed = false }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetchStatus();

    // Check for OAuth callback success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('meta_connected') === 'true') {
      // Remove query params
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh status
      fetchStatus();
    }
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getInstagramStatus();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching Instagram status:', error);
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    // Show requirements modal first
    setShowModal(true);
  };

  const handleConfirmConnect = () => {
    setShowModal(false);
    // Initiate OAuth flow
    connectInstagram();
  };

  const handleDisconnect = async () => {
    if (!window.confirm('¿Estás seguro que deseas desconectar tu cuenta de Instagram?')) {
      return;
    }

    try {
      setDisconnecting(true);
      await disconnectInstagram();
      setStatus({ connected: false });
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
      alert('Error al desconectar Instagram. Por favor intenta de nuevo.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'gap-2 px-4 py-2'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg opacity-50 cursor-not-allowed shadow-md`}
        title="Cargando..."
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        {!collapsed && <span className="font-medium">Cargando...</span>}
      </button>
    );
  }

  if (status?.connected) {
    return (
      <div className="relative group">
        <button
          className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'gap-2 px-4 py-2'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg`}
          onClick={() => {}}
          title={collapsed ? `@${status.instagramUsername}` : ''}
        >
          <Instagram className="w-5 h-5" />
          {!collapsed && (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">
                @{status.instagramUsername}
              </span>
            </>
          )}
        </button>

        {/* Dropdown on hover */}
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              {status.instagramProfilePictureUrl ? (
                <img
                  src={status.instagramProfilePictureUrl}
                  alt={status.instagramUsername}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">@{status.instagramUsername}</p>
                {status.instagramName && (
                  <p className="text-sm text-gray-600">{status.instagramName}</p>
                )}
              </div>
            </div>

            {status.instagramFollowersCount !== null && (
              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {status.instagramFollowersCount.toLocaleString()}
                  </span>{' '}
                  seguidores
                </p>
              </div>
            )}

            {status.lastSyncedAt && (
              <p className="text-xs text-gray-500 mb-3">
                Último sync: {new Date(status.lastSyncedAt).toLocaleDateString('es-MX')}
              </p>
            )}

            {status.lastError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <p className="text-xs text-red-700">{status.lastError}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              {disconnecting ? 'Desconectando...' : 'Desconectar Instagram'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleConnect}
        className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'gap-2 px-4 py-2'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl ${!collapsed && 'transform hover:scale-105'}`}
        title={collapsed ? 'Conectar Instagram' : ''}
      >
        <Instagram className="w-5 h-5" />
        {!collapsed && <span className="font-medium">Conectar Instagram</span>}
      </button>

      <InstagramRequirementsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmConnect}
      />
    </>
  );
};

export default InstagramConnectionButton;
