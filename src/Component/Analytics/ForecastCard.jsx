/**
 * ForecastCard Component
 * Card para mostrar pronósticos y predicciones de IA
 * Muestra valor actual, valor predicho, timeline y confianza
 */
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { LineChart } from './Charts';

export default function ForecastCard({
  title,
  currentValue,
  predictedValue,
  timeline = [],
  confidence,
  growthRate,
  daysAhead = 30,
  insights = [],
  format = 'number',
  prefix = '',
  suffix = '',
  className = ''
}) {
  // Format value
  const formatValue = (value) => {
    if (format === 'decimal') return value.toFixed(1);
    if (format === 'currency') return value.toFixed(2);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Calculate difference
  const difference = predictedValue - currentValue;
  const percentChange = ((difference / currentValue) * 100);
  const isPositive = difference > 0;

  // Confidence color
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Prepare timeline data for chart
  const chartData = timeline.length > 0 ? timeline.map((point, i) => ({
    date: point.date,
    value: point.followers || point.value,
    isForecast: i >= timeline.findIndex(p => p.isForecast)
  })) : [];

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
      <div className="px-5 pt-[18px] pb-3 flex items-center justify-between border-b border-[#dccaf4]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#40086d]" />
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title}
          </div>
        </div>
        <div className={`text-[10px] font-semibold ${getConfidenceColor()}`}>
          {confidence}% confianza
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Current vs Predicted */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Current */}
          <div className="text-center">
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide mb-1">
              Actual
            </div>
            <motion.div
              className="font-['Noto_Serif'] text-[20px] font-bold text-[#40086d]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {prefix}{formatValue(currentValue)}{suffix}
            </motion.div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <motion.div
              className="text-[#40086d]"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Predicted */}
          <div className="text-center col-span-2">
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              Predicción ({daysAhead} días)
            </div>
            <motion.div
              className="font-['Noto_Serif'] text-[28px] font-bold text-[#40086d]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {prefix}{formatValue(predictedValue)}{suffix}
            </motion.div>

            {/* Growth indicator */}
            <motion.div
              className={`
                text-[12px] font-medium mt-1 flex items-center justify-center gap-1
                ${isPositive ? 'text-green-600' : 'text-red-600'}
              `}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={isPositive ? "M5 12l7-7 7 7" : "M5 12l7 7 7-7"} />
              </svg>
              <span>{isPositive ? '+' : ''}{percentChange.toFixed(1)}%</span>
              <span className="text-[rgba(30,30,30,0.38)] ml-1">
                ({isPositive ? '+' : ''}{formatValue(difference)})
              </span>
            </motion.div>
          </div>
        </div>

        {/* Timeline Chart */}
        {chartData.length > 0 && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <LineChart
              data={chartData}
              xKey="date"
              yKey="value"
              height={180}
              color="#40086d"
              showGrid={true}
              showDots={true}
              animate={true}
              forecast={true}
            />
          </motion.div>
        )}

        {/* Growth Rate */}
        {growthRate !== undefined && (
          <motion.div
            className="flex items-center justify-between p-3 bg-[#ede0f8] rounded-lg mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-[10px] text-[rgba(30,30,30,0.6)] uppercase tracking-wide">
              Tasa de crecimiento
            </div>
            <div className="font-['Noto_Serif'] text-[16px] font-bold text-[#40086d]">
              {growthRate > 0 ? '+' : ''}{growthRate.toFixed(2)}%
            </div>
          </motion.div>
        )}

        {/* Insights */}
        {insights && insights.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide mb-2">
              Insights
            </div>
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-2 text-[11px] text-[rgba(30,30,30,0.7)]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + i * 0.1 }}
              >
                <div className="w-1 h-1 rounded-full bg-[#40086d] mt-1.5 flex-shrink-0" />
                <span>{insight}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer - Confidence bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide">
            Nivel de confianza
          </div>
          <div className="flex-1 h-1.5 bg-[#dccaf4] rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                confidence >= 80 ? 'bg-green-600' :
                confidence >= 60 ? 'bg-yellow-600' :
                'bg-orange-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className={`text-[10px] font-semibold ${getConfidenceColor()}`}>
            {confidence}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
