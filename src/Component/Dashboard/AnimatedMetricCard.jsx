/**
 * AnimatedMetricCard Component
 * Métrica con contador animado y efectos hover interactivos
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Hook para animar números
function useCountUp(end, duration = 1000, start = 0) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (end === null || end === undefined || isNaN(end)) return;

    let startTime;
    const startValue = start;
    const diff = end - startValue;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (easeOutQuart)
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(startValue + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

export default function AnimatedMetricCard({
  label,
  value,
  previousValue,
  suffix = '',
  prefix = '',
  trend,
  icon: Icon,
  locked = false,
  onClick,
  format = 'number'
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Parse numeric value for animation
  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.-]/g, ''))
    : value;

  const animatedValue = useCountUp(locked ? 0 : numericValue, 1500);

  // Calculate trend
  const trendPercentage = trend
    ? trend.value
    : previousValue
    ? ((numericValue - previousValue) / previousValue) * 100
    : 0;
  const isPositive = trend ? trend.isPositive : trendPercentage > 0;

  // Format display value
  const displayValue = locked
    ? value
    : format === 'decimal'
    ? animatedValue.toFixed(1)
    : animatedValue.toLocaleString();

  return (
    <motion.div
      className={`
        relative bg-[#f6f6f6] border border-[#dccaf4]
        rounded-[10px] px-[18px] py-4 overflow-hidden
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${isHovered ? 'shadow-lg border-[#40086d]' : 'shadow-sm'}
      `}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#ede0f8] to-transparent opacity-0"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Label & Icon */}
        <div className="flex items-center justify-between mb-1">
          <div className="
            text-[10px] font-semibold text-[rgba(30,30,30,0.38)]
            uppercase tracking-[0.5px]
          ">
            {label}
          </div>
          {Icon && (
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Icon className="w-4 h-4 text-[#40086d] opacity-40" />
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          className={`
            font-['Noto_Serif'] text-[26px] font-bold
            text-[#40086d] mb-0.5 leading-none
            ${locked ? 'blur-[6px] select-none' : ''}
          `}
          animate={{
            scale: isHovered && !locked ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {prefix}{displayValue}{suffix}
        </motion.div>

        {/* Trend or Lock */}
        {locked ? (
          <div className="
            text-[11px] text-[rgba(30,30,30,0.38)]
            flex items-center gap-1
          ">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Connect to unlock</span>
          </div>
        ) : (trend !== undefined || previousValue !== undefined) ? (
          <motion.div
            className={`
              text-[11px] font-medium flex items-center gap-1
              ${isPositive ? 'text-green-600' : 'text-red-600'}
            `}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ y: isPositive ? [0, -2, 0] : [0, 2, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d={isPositive ? "M5 12l7-7 7 7" : "M5 12l7 7 7-7"} />
            </motion.svg>
            <span>{Math.abs(trendPercentage).toFixed(1)}%</span>
          </motion.div>
        ) : null}
      </div>

      {/* Animated border on hover */}
      <motion.div
        className="absolute inset-0 border-2 border-[#40086d] rounded-[10px] pointer-events-none"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: isHovered ? [0, 1, 0] : 0,
          scale: isHovered ? [1.1, 1, 1] : 1.1
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
}
