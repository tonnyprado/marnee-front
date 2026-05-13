/**
 * PulsingDot Component
 * Indicador animado para mostrar actividad
 */
import { motion } from 'framer-motion';

export default function PulsingDot({
  size = 8,
  color = '#22c55e',
  label
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer pulse */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 2, 2],
            opacity: [0.6, 0, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />

        {/* Inner dot */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {label && (
        <span className="text-[11px] text-[rgba(30,30,30,0.55)]">
          {label}
        </span>
      )}
    </div>
  );
}
