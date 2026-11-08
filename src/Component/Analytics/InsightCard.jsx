/**
 * InsightCard Component
 * Card para mostrar insights, recomendaciones y estrategias de contenido
 * Generados por IA para mejorar performance
 */
import { motion } from 'framer-motion';
import { Lightbulb, Target, Clock, TrendingUp, Calendar, Hash } from 'lucide-react';

export default function InsightCard({
  type = 'recommendation', // 'recommendation', 'insight', 'strategy'
  title,
  content,
  recommendations = [],
  bestTimes = [],
  contentTypes = [],
  themes = [],
  expectedImprovement,
  frequency,
  className = ''
}) {
  // Type configurations
  const typeConfig = {
    recommendation: {
      icon: Lightbulb,
      color: '#40086d',
      gradient: 'from-[#40086d]/10',
      title: 'Recomendaciones'
    },
    insight: {
      icon: TrendingUp,
      color: '#6b21a8',
      gradient: 'from-[#6b21a8]/10',
      title: 'Insights'
    },
    strategy: {
      icon: Target,
      color: '#9333ea',
      gradient: 'from-[#9333ea]/10',
      title: 'Estrategia de Contenido'
    }
  };

  const config = typeConfig[type] || typeConfig.recommendation;
  const Icon = config.icon;

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
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: config.color }} />
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title || config.title}
          </div>
          {expectedImprovement && (
            <motion.div
              className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-semibold"
              style={{
                backgroundColor: `${config.color}20`,
                color: config.color
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              +{expectedImprovement}% mejora esperada
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Main content/description */}
        {content && (
          <motion.div
            className="text-[12px] text-[rgba(30,30,30,0.7)] leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {content}
          </motion.div>
        )}

        {/* Recommendations list */}
        {recommendations && recommendations.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              <span>Recomendaciones</span>
            </div>
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-2 text-[11px] text-[rgba(30,30,30,0.7)] bg-[#ede0f8] p-2.5 rounded-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: '#dccaf4' }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: config.color }} />
                <span>{rec}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Best posting times */}
        {bestTimes && bestTimes.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Mejores horarios</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bestTimes.map((time, i) => (
                <motion.div
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {time}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended content types */}
        {contentTypes && contentTypes.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>Tipos de contenido recomendados</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type, i) => (
                <motion.div
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold border-2"
                  style={{
                    borderColor: config.color,
                    color: config.color
                  }}
                  initial={{ scale: 0, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  {type}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content themes */}
        {themes && themes.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide flex items-center gap-1">
              <Hash className="w-3 h-3" />
              <span>Temas sugeridos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme, i) => (
                <motion.div
                  key={i}
                  className="px-2.5 py-1 rounded-md text-[10px] bg-white border border-[#dccaf4]"
                  style={{ color: config.color }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.05 }}
                  whileHover={{ borderColor: config.color }}
                >
                  #{theme}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Frequency recommendation */}
        {frequency && (
          <motion.div
            className="flex items-center justify-between p-3 bg-gradient-to-r rounded-lg"
            style={{ background: `linear-gradient(to right, ${config.color}10, transparent)` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: config.color }} />
              <div>
                <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide">
                  Frecuencia recomendada
                </div>
                <div className="text-[12px] font-semibold" style={{ color: config.color }}>
                  {frequency}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer - Improvement indicator */}
      {expectedImprovement && (
        <motion.div
          className="px-5 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <div className="text-[9px] text-[rgba(30,30,30,0.38)] mb-1">
                Mejora esperada siguiendo estas recomendaciones
              </div>
              <div className="h-2 bg-[#dccaf4] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(expectedImprovement, 100)}%` }}
                  transition={{ duration: 1, delay: 1.3, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-[14px] font-bold text-green-600">
              +{expectedImprovement}%
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
