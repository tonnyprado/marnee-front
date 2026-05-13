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
        className={`
          flex items-center rounded-lg opacity-50 cursor-not-allowed
          bg-[rgba(220,202,244,0.15)] text-[rgba(246,246,246,0.5)]
          ${collapsed ? 'justify-center w-10 h-10 max-lg:w-10 max-lg:h-10' : 'gap-2 px-3.5 py-2 w-full'}
        `}
        title="Cargando..."
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        {!collapsed && <span className="font-['DM_Sans'] font-normal text-[13px] max-lg:hidden">Cargando...</span>}
      </button>
    );
  }

  // Show integrations button with connection indicator
  const hasConnections = status?.connected;

  return (
    <>
      <button
        onClick={handleOpenIntegrations}
        className={`
          flex items-center rounded-lg transition-all duration-150
          font-['DM_Sans']
          ${collapsed
            ? 'justify-center w-10 h-10 max-lg:w-10 max-lg:h-10'
            : 'gap-2 px-3.5 py-2 w-full'
          }
          ${hasConnections
            ? 'bg-[rgba(34,197,94,0.15)] text-[rgba(34,197,94,0.9)] hover:bg-[rgba(34,197,94,0.25)]'
            : 'bg-[rgba(220,202,244,0.15)] text-[rgba(220,202,244,0.9)] hover:bg-[rgba(220,202,244,0.25)]'
          }
        `}
        title={collapsed ? 'Integraciones' : ''}
      >
        {hasConnections ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {!collapsed && <span className="font-normal text-[13px] max-lg:hidden">Integraciones</span>}
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            {!collapsed && <span className="font-normal text-[13px] max-lg:hidden">Conectar Redes</span>}
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
