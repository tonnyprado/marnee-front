/**
 * SkeletonLoader Component
 * Skeleton con animación shimmer premium
 */
import { motion } from 'framer-motion';

export function SkeletonLine({ width = '100%', height = '12px', className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-[#ede0f8] ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] px-[18px] py-4">
      <SkeletonLine width="60%" height="10px" className="mb-3" />
      <SkeletonLine width="80%" height="26px" className="mb-2" />
      <SkeletonLine width="40%" height="10px" />
    </div>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-5">
      <SkeletonLine width="40%" height="10px" className="mb-4" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} width={`${100 - i * 10}%`} height="12px" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 200 }) {
  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-5">
      <SkeletonLine width="30%" height="10px" className="mb-4" />
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {[60, 80, 45, 90, 70, 55, 85, 40].map((h, i) => (
          <SkeletonLine
            key={i}
            width="12%"
            height={`${h}%`}
            className="rounded-t"
          />
        ))}
      </div>
    </div>
  );
}
