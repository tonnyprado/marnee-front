/**
 * ProgressBar Component
 * Barra de progreso animada con efectos
 */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = '#40086d',
  height = 8,
  animated = true
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className="w-full">
      {/* Label */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-[11px] text-[rgba(30,30,30,0.55)]">
              {label}
            </span>
          )}
          {showPercentage && (
            <motion.span
              className="text-[11px] font-semibold text-[#40086d]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {displayValue.toFixed(0)}%
            </motion.span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        className="relative w-full bg-[#ede0f8] rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color, opacity: 0.1 }}
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
