/**
 * BarChart Component
 * Gráfica de barras para comparaciones entre plataformas
 * Usada para: Instagram vs Facebook, campaign performance, content comparison
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function BarChart({
  data = [],
  labelKey = 'label',
  valueKey = 'value',
  title,
  height = 300,
  colors = ['#40086d', '#6b21a8', '#9333ea', '#a855f7'],
  horizontal = false,
  showValues = true,
  animate = true
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-5">
        <div className="text-center text-[rgba(30,30,30,0.38)] py-8">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  // Calculate max for scaling
  const maxValue = Math.max(...data.map(d => d[valueKey]));

  // Format value for display
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Format label
  const formatLabel = (label) => {
    if (typeof label === 'string' && label.length > 12) {
      return label.substring(0, 12) + '...';
    }
    return label;
  };

  // Get color for bar
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title}
          </div>
          <BarChart3 className="w-4 h-4 text-[#40086d] opacity-40" />
        </div>
      )}

      {/* Chart Container */}
      <div className="px-5 pb-[18px]">
        <div className={`flex ${horizontal ? 'flex-col' : 'flex-row items-end'} gap-3`} style={{ height: `${height}px` }}>
          {data.map((item, index) => {
            const percentage = (item[valueKey] / maxValue) * 100;
            const barColor = getColor(index);

            return (
              <div
                key={index}
                className={`
                  flex-1 relative group
                  ${horizontal ? 'flex items-center' : 'flex flex-col justify-end'}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Bar */}
                <motion.div
                  className={`
                    relative rounded-t-[6px] overflow-hidden
                    transition-all duration-300 cursor-pointer
                    ${horizontal ? 'rounded-l-[6px] rounded-t-none' : ''}
                    ${hoveredIndex === index ? 'shadow-lg' : ''}
                  `}
                  style={{
                    backgroundColor: barColor,
                    [horizontal ? 'width' : 'height']: `${percentage}%`,
                    [horizontal ? 'height' : 'width']: '100%',
                    minHeight: horizontal ? '40px' : '0',
                    minWidth: horizontal ? '0' : '100%'
                  }}
                  initial={animate ? { [horizontal ? 'width' : 'height']: 0 } : {}}
                  animate={{
                    [horizontal ? 'width' : 'height']: `${percentage}%`,
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'easeOut'
                  }}
                  whileHover={{ scale: horizontal ? 1.02 : 1.05 }}
                >
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  />

                  {/* Value label inside bar */}
                  {showValues && percentage > 20 && (
                    <motion.div
                      className={`
                        absolute text-white font-semibold text-[11px]
                        ${horizontal ? 'right-2 top-1/2 -translate-y-1/2' : 'top-2 left-1/2 -translate-x-1/2'}
                      `}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {formatValue(item[valueKey])}
                    </motion.div>
                  )}

                  {/* Animated shine effect on hover */}
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeInOut'
                      }}
                    />
                  )}
                </motion.div>

                {/* Value label outside bar (for small bars) */}
                {showValues && percentage <= 20 && (
                  <motion.div
                    className={`
                      text-[11px] font-semibold mt-1
                      ${horizontal ? 'ml-2' : 'text-center'}
                    `}
                    style={{ color: barColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {formatValue(item[valueKey])}
                  </motion.div>
                )}

                {/* Label */}
                <div
                  className={`
                    text-[10px] font-medium text-[rgba(30,30,30,0.6)] mt-2
                    ${horizontal ? 'absolute left-0 -bottom-6' : 'text-center'}
                  `}
                  title={item[labelKey]}
                >
                  {formatLabel(item[labelKey])}
                </div>

                {/* Tooltip on hover */}
                {hoveredIndex === index && (
                  <motion.div
                    className={`
                      absolute bg-[#40086d] text-white text-[11px] px-3 py-1.5 rounded-md shadow-lg z-10 whitespace-nowrap
                      ${horizontal ? 'right-full mr-2 top-1/2 -translate-y-1/2' : 'bottom-full mb-2 left-1/2 -translate-x-1/2'}
                    `}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-semibold">{item[labelKey]}</div>
                    <div className="opacity-80">{formatValue(item[valueKey])}</div>
                    {item.metadata && (
                      <div className="text-[9px] opacity-60 mt-0.5">
                        {item.metadata}
                      </div>
                    )}
                    {/* Arrow */}
                    <div className={`
                      absolute
                      ${horizontal ? 'left-full top-1/2 -translate-y-1/2 -ml-[1px]' : 'top-full left-1/2 -translate-x-1/2 -mt-[1px]'}
                    `}>
                      <div className={`
                        border-4 border-transparent
                        ${horizontal ? 'border-l-[#40086d]' : 'border-t-[#40086d]'}
                      `} />
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend (if items have categories) */}
        {data.some(item => item.category) && (
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-[#dccaf4]">
            {[...new Set(data.map(item => item.category))].map((category, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-[rgba(30,30,30,0.6)]">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getColor(i) }}
                />
                <span>{category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
