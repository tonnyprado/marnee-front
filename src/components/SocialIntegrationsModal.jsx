import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Camera, Video, BarChart3, TrendingUp, Building2, AlertCircle, Music } from 'lucide-react';
import { getInstagramStatus, connectInstagram, disconnectInstagram } from '../services/instagramApi';
import { getGoogleStatus, connectGoogle, disconnectGoogle, disconnectGoogleService, addGoogleService } from '../services/googleApi';
import { getTikTokStatus, connectTikTok, disconnectTikTok } from '../services/tiktokApi';
import { trackSocialConnect, trackSocialDisconnect } from '../services/facebookPixel';

/**
 * SocialIntegrationsModal - Modal for managing social media integrations
 *
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Function to close modal
 */
export default function SocialIntegrationsModal({ isOpen, onClose }) {
  const [metaStatus, setMetaStatus] = useState(null);
  const [googleStatus, setGoogleStatus] = useState(null);
  const [tiktokStatus, setTikTokStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatuses();
    }
  }, [isOpen]);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const [metaData, googleData, tiktokData] = await Promise.allSettled([
        getInstagramStatus(),
        getGoogleStatus(),
        getTikTokStatus()
      ]);

      setMetaStatus(metaData.status === 'fulfilled' ? metaData.value : null);
      setGoogleStatus(googleData.status === 'fulfilled' ? googleData.value : null);
      setTikTokStatus(tiktokData.status === 'fulfilled' ? tiktokData.value : null);
    } catch (error) {
      console.error('Error fetching integration statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMetaConnect = async () => {
    setActionLoading('meta');
    try {
      trackSocialConnect('instagram');
      await connectInstagram();
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      alert('Error al conectar Instagram. Por favor intenta de nuevo.');
      setActionLoading(null);
    }
  };

  const handleMetaDisconnect = async () => {
    if (!window.confirm('¿Desconectar Instagram? Esto eliminará el acceso a tus datos de Instagram.')) {
      return;
    }
    setActionLoading('meta');
    try {
      await disconnectInstagram();
      trackSocialDisconnect('instagram');
      await fetchStatuses();
    } catch (error) {
      console.error('Error disconnecting Meta:', error);
      alert('Error al desconectar Instagram. Por favor intenta de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGoogleConnect = async (services) => {
    setActionLoading('google');
    try {
      services.forEach(service => trackSocialConnect(service));
      await connectGoogle(services);
    } catch (error) {
      console.error('Error connecting Google services:', error);
      alert('Error al conectar servicios de Google. Por favor intenta de nuevo.');
      setActionLoading(null);
    }
  };

  const handleGoogleServiceAdd = async (service) => {
    setActionLoading(`google-${service}`);
    try {
      trackSocialConnect(service);
      await addGoogleService(service);
    } catch (error) {
      console.error(`Error adding Google service ${service}:`, error);
      alert(`Error al conectar ${service}. Por favor intenta de nuevo.`);
      setActionLoading(null);
    }
  };

  // Reserved for future use: disconnect all Google services at once
  // eslint-disable-next-line no-unused-vars
  const handleGoogleDisconnect = async () => {
    if (!window.confirm('¿Desconectar todos los servicios de Google? Esto eliminará el acceso a YouTube, Analytics, Ads y My Business.')) {
      return;
    }
    setActionLoading('google');
    try {
      await disconnectGoogle();
      await fetchStatuses();
    } catch (error) {
      console.error('Error disconnecting Google:', error);
      alert('Error al desconectar Google. Por favor intenta de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGoogleServiceDisconnect = async (service) => {
    if (!window.confirm(`¿Desconectar ${service}?`)) {
      return;
    }
    setActionLoading(`google-${service}`);
    try {
      await disconnectGoogleService(service);
      trackSocialDisconnect(service);
      await fetchStatuses();
    } catch (error) {
      console.error(`Error disconnecting ${service}:`, error);
      alert(`Error al desconectar ${service}. Por favor intenta de nuevo.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTikTokConnect = () => {
    setActionLoading('tiktok');
    trackSocialConnect('tiktok');
    connectTikTok();
  };

  const handleTikTokDisconnect = async () => {
    if (!window.confirm('¿Desconectar TikTok? Esto eliminará el acceso a tus datos de TikTok.')) {
      return;
    }
    setActionLoading('tiktok');
    try {
      await disconnectTikTok();
      trackSocialDisconnect('tiktok');
      await fetchStatuses();
    } catch (error) {
      console.error('Error disconnecting TikTok:', error);
      alert('Error al desconectar TikTok. Por favor intenta de nuevo.');
    } finally {
      setActionLoading(null);
    }
  };

  // Define all available integrations
  const integrations = [
    {
      id: 'instagram',
      category: 'meta',
      name: 'Instagram Business',
      description: 'Conecta tu cuenta de Instagram Business para acceder a métricas, insights y análisis de audiencia',
      icon: Camera,
      color: 'from-purple-600 to-pink-600',
      connected: metaStatus?.connected || false,
      details: metaStatus?.connected ? {
        username: metaStatus.instagramUsername,
        followers: metaStatus.instagramFollowersCount?.toLocaleString() || '0',
        connectedAt: metaStatus.connectedAt
      } : null,
      requirements: [
        'Cuenta Business o Creator de Instagram',
        'Facebook Page conectada',
        'Rol de administrador en Facebook Page'
      ],
      onConnect: handleMetaConnect,
      onDisconnect: handleMetaDisconnect
    },
    {
      id: 'facebook',
      category: 'meta',
      name: 'Facebook Page',
      description: 'Gestiona tu Facebook Page y accede a insights de engagement y alcance',
      icon: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'from-blue-600 to-blue-700',
      connected: metaStatus?.connected || false,
      details: metaStatus?.connected ? {
        pageName: metaStatus.facebookPageName,
        connectedAt: metaStatus.connectedAt
      } : null,
      requirements: [
        'Página de Facebook',
        'Rol de administrador en la página'
      ],
      onConnect: handleMetaConnect,
      onDisconnect: handleMetaDisconnect
    },
    {
      id: 'youtube',
      category: 'google',
      name: 'YouTube',
      description: 'Analiza el rendimiento de tu canal de YouTube con métricas detalladas y demografía de audiencia',
      icon: Video,
      color: 'from-red-600 to-red-700',
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes('youtube'),
      details: googleStatus?.youtubeChannel ? {
        channelName: googleStatus.youtubeChannel.channelName,
        subscribers: googleStatus.youtubeChannel.subscriberCount?.toLocaleString() || '0',
        connectedAt: googleStatus.connectedAt
      } : null,
      requirements: [
        'Canal de YouTube',
        'Permisos de lectura de analytics'
      ],
      onConnect: () => {
        if (googleStatus?.connected) {
          handleGoogleServiceAdd('youtube');
        } else {
          handleGoogleConnect(['youtube']);
        }
      },
      onDisconnect: () => handleGoogleServiceDisconnect('youtube')
    },
    {
      id: 'google-analytics',
      category: 'google',
      name: 'Google Analytics',
      description: 'Conecta Google Analytics 4 para obtener insights de tráfico web y comportamiento de usuarios',
      icon: BarChart3,
      color: 'from-orange-600 to-orange-700',
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes('analytics'),
      details: googleStatus?.googleAnalytics ? {
        propertyName: googleStatus.googleAnalytics.propertyName,
        connectedAt: googleStatus.connectedAt
      } : null,
      requirements: [
        'Propiedad de Google Analytics 4',
        'Permisos de lectura'
      ],
      onConnect: () => {
        if (googleStatus?.connected) {
          handleGoogleServiceAdd('analytics');
        } else {
          handleGoogleConnect(['analytics']);
        }
      },
      onDisconnect: () => handleGoogleServiceDisconnect('analytics')
    },
    {
      id: 'google-ads',
      category: 'google',
      name: 'Google Ads',
      description: 'Monitorea el rendimiento de tus campañas publicitarias de Google Ads',
      icon: TrendingUp,
      color: 'from-green-600 to-green-700',
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes('ads'),
      details: googleStatus?.googleAds ? {
        accountName: googleStatus.googleAds.accountName,
        connectedAt: googleStatus.connectedAt
      } : null,
      requirements: [
        'Cuenta de Google Ads',
        'Permisos de lectura'
      ],
      onConnect: () => {
        if (googleStatus?.connected) {
          handleGoogleServiceAdd('ads');
        } else {
          handleGoogleConnect(['ads']);
        }
      },
      onDisconnect: () => handleGoogleServiceDisconnect('ads')
    },
    {
      id: 'google-mybusiness',
      category: 'google',
      name: 'Google My Business',
      description: 'Gestiona tu perfil de negocio en Google y monitorea reseñas e interacciones',
      icon: Building2,
      color: 'from-blue-600 to-cyan-600',
      connected: googleStatus?.connected && googleStatus?.connectedServices?.includes('mybusiness'),
      details: null,
      requirements: [
        'Perfil de Google My Business',
        'Permisos de gestión'
      ],
      onConnect: () => {
        if (googleStatus?.connected) {
          handleGoogleServiceAdd('mybusiness');
        } else {
          handleGoogleConnect(['mybusiness']);
        }
      },
      onDisconnect: () => handleGoogleServiceDisconnect('mybusiness')
    },
    {
      id: 'tiktok',
      category: 'tiktok',
      name: 'TikTok',
      description: 'Conecta tu cuenta de TikTok Business o Creator para acceder a analytics de videos y audiencia',
      icon: Music,
      color: 'from-black to-gray-800',
      connected: tiktokStatus?.connected || false,
      details: tiktokStatus?.connected ? {
        username: tiktokStatus.username,
        followers: tiktokStatus.followersCount?.toLocaleString() || '0',
        connectedAt: tiktokStatus.connectedAt
      } : null,
      requirements: [
        'Cuenta Business o Creator de TikTok',
        'Acceso a TikTok Analytics',
        'Permisos de lectura de datos'
      ],
      onConnect: handleTikTokConnect,
      onDisconnect: handleTikTokDisconnect
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#40086d] to-[#2d0550] text-white px-6 py-5 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold">Integraciones de Redes Sociales</h2>
              <p className="text-purple-200 text-sm mt-1">Conecta tus cuentas para acceder a datos y análisis de Marnee</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#40086d]" />
                <span className="ml-3 text-gray-600">Cargando integraciones...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Acerca de tus datos</p>
                  <p className="text-blue-700">
                    Marnee solo accede a datos de lectura para proporcionarte análisis e insights.
                    Nunca publicamos ni modificamos contenido sin tu autorización explícita.
                    Puedes desconectar cualquier servicio en cualquier momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Integration Card Component
function IntegrationCard({ integration, actionLoading }) {
  const [showDetails, setShowDetails] = useState(false);
  const Icon = integration.icon;
  const isLoading = actionLoading === integration.category || actionLoading === `${integration.category}-${integration.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Icon and Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white flex-shrink-0`}>
              <Icon className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                {integration.connected && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

              {/* Connection Details */}
              {integration.connected && integration.details && (
                <div className="text-sm text-gray-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  {integration.details.username && (
                    <p><span className="font-semibold">Usuario:</span> {integration.details.username}</p>
                  )}
                  {integration.details.channelName && (
                    <p><span className="font-semibold">Canal:</span> {integration.details.channelName}</p>
                  )}
                  {integration.details.pageName && (
                    <p><span className="font-semibold">Página:</span> {integration.details.pageName}</p>
                  )}
                  {integration.details.propertyName && (
                    <p><span className="font-semibold">Propiedad:</span> {integration.details.propertyName}</p>
                  )}
                  {integration.details.accountName && (
                    <p><span className="font-semibold">Cuenta:</span> {integration.details.accountName}</p>
                  )}
                  {integration.details.followers && (
                    <p><span className="font-semibold">Seguidores:</span> {integration.details.followers}</p>
                  )}
                  {integration.details.subscribers && (
                    <p><span className="font-semibold">Suscriptores:</span> {integration.details.subscribers}</p>
                  )}
                </div>
              )}

              {/* Requirements (show when not connected) */}
              {!integration.connected && showDetails && (
                <div className="text-sm bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                  <p className="font-semibold text-gray-900 mb-2">Requisitos:</p>
                  <ul className="space-y-1">
                    {integration.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-[#40086d] mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Toggle Details */}
              {!integration.connected && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-[#40086d] hover:text-[#2d0550] font-medium"
                >
                  {showDetails ? 'Ocultar requisitos' : 'Ver requisitos'}
                </button>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {integration.connected ? (
              <button
                onClick={integration.onDisconnect}
                disabled={isLoading}
                className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Desconectar
              </button>
            ) : (
              <button
                onClick={integration.onConnect}
                disabled={isLoading}
                className={`px-4 py-2 bg-gradient-to-r ${integration.color} text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Conectar
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
