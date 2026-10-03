/**
 * ComparisonCard Component
 * Card para comparar performance entre Instagram y Facebook
 * Muestra métricas lado a lado con ganador y recomendaciones
 */
import { motion } from 'framer-motion';
import { Instagram, Facebook, TrendingUp, TrendingDown, Award } from 'lucide-react';

export default function ComparisonCard({
  instagramData = {},
  facebookData = {},
  betterPlatform = 'instagram',
  recommendation,
  metrics = ['engagement', 'reach', 'posts'],
  className = ''
}) {
  // Format value
  const formatValue = (value) => {
    if (!value && value !== 0) return 'N/A';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Platform colors
  const platformConfig = {
    instagram: {
      color: '#C13584',
      gradient: 'from-[#C13584] to-[#E1306C]',
      Icon: Instagram,
      name: 'Instagram'
    },
    facebook: {
      color: '#1877F2',
      gradient: 'from-[#1877F2] to-[#0D65D9]',
      Icon: Facebook,
      name: 'Facebook'
    }
  };

  const igConfig = platformConfig.instagram;
  const fbConfig = platformConfig.facebook;
  const winnerConfig = platformConfig[betterPlatform] || igConfig;

  // Metric labels
  const metricLabels = {
    engagement: 'Engagement',
    reach: 'Alcance',
    posts: 'Posts',
    impressions: 'Impresiones',
    followers: 'Seguidores',
    engagement_rate: 'Tasa de Engagement'
  };

  // Compare values
  const compareMetric = (metric) => {
    const igValue = instagramData[metric] || 0;
    const fbValue = facebookData[metric] || 0;

    if (igValue === fbValue) return 'tie';
    return igValue > fbValue ? 'instagram' : 'facebook';
  };

  return (
    <motion.div
      className={`
        bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] overflow-hidden
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="px-5 pt-[18px] pb-3 border-b border-[#dccaf4]">
        <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
          Comparación de Plataformas
        </div>
      </div>

      {/* Winner Badge */}
      <motion.div
        className={`mx-5 mt-4 p-3 rounded-lg bg-gradient-to-r ${winnerConfig.gradient} text-white`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <div>
              <div className="text-[9px] opacity-80 uppercase tracking-wide">
                Mejor Performance
              </div>
              <div className="text-[14px] font-bold">
                {winnerConfig.name}
              </div>
            </div>
          </div>
          <winnerConfig.Icon className="w-8 h-8 opacity-50" />
        </div>
      </motion.div>

      {/* Metrics Comparison */}
      <div className="p-5 space-y-3">
        {metrics.map((metric, index) => {
          const winner = compareMetric(metric);
          const igValue = instagramData[metric] || 0;
          const fbValue = facebookData[metric] || 0;
          const total = igValue + fbValue;
          const igPercentage = total > 0 ? (igValue / total) * 100 : 50;
          const fbPercentage = total > 0 ? (fbValue / total) * 100 : 50;

          return (
            <motion.div
              key={metric}
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {/* Metric label */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[rgba(30,30,30,0.6)] font-medium">
                  {metricLabels[metric] || metric}
                </span>
                {winner !== 'tie' && (
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {winner === 'instagram' ? (
                      <TrendingUp className="w-3 h-3" style={{ color: igConfig.color }} />
                    ) : (
                      <TrendingUp className="w-3 h-3" style={{ color: fbConfig.color }} />
                    )}
                  </motion.div>
                )}
              </div>

              {/* Comparison bar */}
              <div className="flex items-center gap-2">
                {/* Instagram */}
                <div className="flex-1 text-right">
                  <div className="text-[11px] font-semibold mb-1" style={{ color: igConfig.color }}>
                    {formatValue(igValue)}
                  </div>
                  <div className="h-2 bg-[#dccaf4] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r"
                      style={{ background: `linear-gradient(to right, ${igConfig.color}, ${igConfig.color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${igPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* VS */}
                <div className="text-[9px] text-[rgba(30,30,30,0.3)] font-bold px-2">
                  VS
                </div>

                {/* Facebook */}
                <div className="flex-1">
                  <div className="text-[11px] font-semibold mb-1" style={{ color: fbConfig.color }}>
                    {formatValue(fbValue)}
                  </div>
                  <div className="h-2 bg-[#dccaf4] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r"
                      style={{ background: `linear-gradient(to right, ${fbConfig.color}, ${fbConfig.color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${fbPercentage}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation */}
      {recommendation && (
        <motion.div
          className="mx-5 mb-4 p-3 bg-[#ede0f8] rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide mb-1.5">
            Recomendación
          </div>
          <div className="text-[11px] text-[rgba(30,30,30,0.7)] leading-relaxed">
            {recommendation}
          </div>
        </motion.div>
      )}

      {/* Platform icons footer */}
      <div className="flex items-center justify-center gap-4 pb-4">
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: `${igConfig.color}15`,
            color: igConfig.color
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold">Instagram</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: `${fbConfig.color}15`,
            color: fbConfig.color
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Facebook className="w-3.5 h-3.5" />
          <span className="text-[10px] font-semibold">Facebook</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
