/**
 * ConnectionCard Component
 * Tarjeta para mostrar estado de conexión de cada red social
 */
import { motion } from 'framer-motion';
import { DashboardButton } from './index';

export default function ConnectionCard({
  platform,
  icon: Icon,
  isConnected = false,
  accountInfo,
  onConnect,
  onDisconnect,
  comingSoon = false,
  color = '#40086d'
}) {
  return (
    <motion.div
      className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-5 hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-[13.5px] font-['DM_Sans'] font-semibold text-[#1e1e1e]">
              {platform}
            </h3>
            {isConnected && accountInfo ? (
              <p className="text-[11px] text-[rgba(30,30,30,0.55)]">
                {accountInfo}
              </p>
            ) : (
              <p className="text-[11px] text-[rgba(30,30,30,0.55)]">
                {comingSoon ? 'Coming soon' : 'Not connected'}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] font-semibold text-green-700">Connected</span>
            </div>
          ) : comingSoon ? (
            <div className="px-2.5 py-1 bg-purple-50 rounded-full">
              <span className="text-[10px] font-semibold text-purple-700">Coming Soon</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 bg-gray-100 rounded-full">
              <span className="text-[10px] font-semibold text-gray-600">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!comingSoon && (
          <>
            {!isConnected ? (
              <DashboardButton
                variant="primary"
                onClick={onConnect}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                }
              >
                Connect {platform}
              </DashboardButton>
            ) : (
              <DashboardButton
                variant="secondary"
                onClick={onDisconnect}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                }
              >
                Disconnect
              </DashboardButton>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
