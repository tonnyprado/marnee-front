// src/components/InstagramConnectionButton.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Link2 } from 'lucide-react';
import { getInstagramStatus } from '../services/instagramApi';
import SocialIntegrationsModal from './SocialIntegrationsModal';

/**
 * Social Integrations Button (formerly Instagram Connection Button)
 *
 * Displays in the navbar as a prominent button to access all social media integrations
 * Shows connection status and opens the unified integrations modal
 * Supports: Instagram, Facebook, YouTube, Google Analytics, Google Ads, Google My Business, TikTok
 */
const InstagramConnectionButton = ({ collapsed = false }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStatus();

    // Check for OAuth callback success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('meta_connected') === 'true' ||
        urlParams.get('google_connected') === 'true' ||
        urlParams.get('tiktok_connected') === 'true') {
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

  const handleOpenIntegrations = () => {
    setShowModal(true);
  };

  if (loading) {
    return (
      <button
        disabled
        className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'gap-2 px-4 py-2'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg opacity-50 cursor-not-allowed shadow-md`}
        title="Cargando..."
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        {!collapsed && <span className="font-medium text-sm">Cargando...</span>}
      </button>
    );
  }

  // Show integrations button with connection indicator
  const hasConnections = status?.connected;

  return (
    <>
      <button
        onClick={handleOpenIntegrations}
        className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'gap-2 px-4 py-2'} bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl ${!collapsed && 'transform hover:scale-105'}`}
        title={collapsed ? 'Integraciones' : ''}
      >
        {hasConnections ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            {!collapsed && <span className="font-medium text-sm">Integraciones</span>}
          </>
        ) : (
          <>
            <Link2 className="w-5 h-5" />
            {!collapsed && <span className="font-medium text-sm">Conectar Redes</span>}
          </>
        )}
      </button>

      <SocialIntegrationsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default InstagramConnectionButton;
