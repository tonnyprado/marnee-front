/**
 * ConnectionsHub Component
 * Vista general de todas las integraciones disponibles
 */
import { useState, useEffect } from 'react';
import { PageHeader } from '../../../Component/Dashboard';
import ConnectionCard from '../../../Component/Dashboard/ConnectionCard';
import { useInstagramData } from '../../../hooks/useInstagramData';
import { connectInstagram, disconnectInstagram } from '../../../services/instagramApi';
import { connectGoogle } from '../../../services/googleApi';

// Social Media Icons
const InstagramIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);

const YouTubeIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GoogleAnalyticsIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.84 2.998v17.999a3.003 3.003 0 01-3.003 3.003h-.996a3.003 3.003 0 01-3.003-3.003V2.998A3.003 3.003 0 0118.841 0h.996a3.003 3.003 0 013.003 2.998zM13.5 6.998v13.999a3.003 3.003 0 01-3.003 3.003H9.501a3.003 3.003 0 01-3.003-3.003V6.998A3.003 3.003 0 019.501 3.995h.996a3.003 3.003 0 013.003 3.003zM4.161 15.497v5.5a3.003 3.003 0 01-3.003 3.003H.162A3.003 3.003 0 01-2.842 20.997v-5.5a3.003 3.003 0 013.003-3.003h.996a3.003 3.003 0 013.003 3.003z"/>
  </svg>
);

const GoogleAdsIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.28 17.1L18.96 4.59a2.15 2.15 0 013.76 0 2.15 2.15 0 010 2.12l-6.68 12.5a2.15 2.15 0 01-3.76 0 2.15 2.15 0 010-2.11zm-6.3-.28l3.44-6.46a2.15 2.15 0 013.76 0c.49.93.49 2.04 0 2.97l-3.44 6.46a2.15 2.15 0 01-3.76 0 2.15 2.15 0 010-2.97zM.46 18.85l.7-1.32a2.15 2.15 0 013.76 0c.49.93.49 2.04 0 2.97l-.7 1.32a2.15 2.15 0 01-3.76 0 2.15 2.15 0 010-2.97z"/>
  </svg>
);

const GoogleMyBusinessIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const TikTokIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function ConnectionsHub() {
  const { isConnected: instagramConnected, connectionInfo: instagramInfo } = useInstagramData();
  const [connections, setConnections] = useState({
    instagram: false,
    youtube: false,
    googleAnalytics: false,
    googleAds: false,
    googleMyBusiness: false,
    tiktok: false
  });

  useEffect(() => {
    setConnections(prev => ({
      ...prev,
      instagram: instagramConnected
    }));
  }, [instagramConnected]);

  const handleConnect = async (platform) => {
    try {
      switch(platform) {
        case 'Instagram':
          await connectInstagram();
          break;
        case 'YouTube':
          await connectGoogle(['youtube']);
          break;
        case 'Google Analytics':
          await connectGoogle(['analytics']);
          break;
        case 'Google Ads':
          await connectGoogle(['ads']);
          break;
        case 'Google My Business':
          await connectGoogle(['mybusiness']);
          break;
        default:
          console.log('Platform not supported yet');
      }
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
      alert(`Failed to connect ${platform}. Please try again.`);
    }
  };

  const handleDisconnect = async (platform) => {
    if (window.confirm(`Are you sure you want to disconnect ${platform}?`)) {
      switch(platform) {
        case 'Instagram':
          try {
            await disconnectInstagram();
            setConnections(prev => ({ ...prev, instagram: false }));
          } catch (error) {
            console.error('Error disconnecting Instagram:', error);
          }
          break;
        default:
          console.log('Disconnect not implemented for', platform);
      }
    }
  };

  const platforms = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      color: '#E4405F',
      isConnected: connections.instagram,
      accountInfo: instagramInfo?.username ? `@${instagramInfo.username}` : null,
      comingSoon: false
    },
    {
      name: 'YouTube',
      icon: YouTubeIcon,
      color: '#FF0000',
      isConnected: connections.youtube,
      accountInfo: null,
      comingSoon: false
    },
    {
      name: 'Google Analytics',
      icon: GoogleAnalyticsIcon,
      color: '#F9AB00',
      isConnected: connections.googleAnalytics,
      accountInfo: null,
      comingSoon: false
    },
    {
      name: 'Google Ads',
      icon: GoogleAdsIcon,
      color: '#4285F4',
      isConnected: connections.googleAds,
      accountInfo: null,
      comingSoon: false
    },
    {
      name: 'Google My Business',
      icon: GoogleMyBusinessIcon,
      color: '#34A853',
      isConnected: connections.googleMyBusiness,
      accountInfo: null,
      comingSoon: false
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      color: '#000000',
      isConnected: connections.tiktok,
      accountInfo: null,
      comingSoon: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Connections"
        subtitle="Connect and manage your social media integrations"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-4">
          <div className="text-[11px] text-[rgba(30,30,30,0.55)] mb-1">Total Platforms</div>
          <div className="text-[26px] font-['Noto_Serif'] font-bold text-[#40086d]">
            {platforms.filter(p => !p.comingSoon).length}
          </div>
        </div>
        <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-4">
          <div className="text-[11px] text-[rgba(30,30,30,0.55)] mb-1">Connected</div>
          <div className="text-[26px] font-['Noto_Serif'] font-bold text-green-600">
            {Object.values(connections).filter(Boolean).length}
          </div>
        </div>
        <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-4">
          <div className="text-[11px] text-[rgba(30,30,30,0.55)] mb-1">Available</div>
          <div className="text-[26px] font-['Noto_Serif'] font-bold text-[#40086d]">
            {platforms.filter(p => !p.comingSoon && !p.isConnected).length}
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <ConnectionCard
            key={platform.name}
            platform={platform.name}
            icon={platform.icon}
            color={platform.color}
            isConnected={platform.isConnected}
            accountInfo={platform.accountInfo}
            comingSoon={platform.comingSoon}
            onConnect={() => handleConnect(platform.name)}
            onDisconnect={() => handleDisconnect(platform.name)}
          />
        ))}
      </div>
    </div>
  );
}
