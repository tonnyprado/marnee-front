/**
 * PieChart Component
 * Gráfica circular para distribuciones y proporciones
 * Usada para: sentiment distribution, content type breakdown, platform distribution
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PieChart as PieIcon } from 'lucide-react';

export default function PieChart({
  data = [],
  labelKey = 'label',
  valueKey = 'value',
  title,
  size = 200,
  colors = ['#40086d', '#6b21a8', '#9333ea', '#a855f7', '#c084fc'],
  showPercentages = true,
  showLegend = true,
  animate = true,
  donut = false
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

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  const dataWithPercentages = data.map((item, index) => ({
    ...item,
    percentage: (item[valueKey] / total) * 100,
    color: colors[index % colors.length]
  }));

  // Format value
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Create pie slices
  const createSlices = () => {
    let currentAngle = -90; // Start at top
    const radius = 50;
    const innerRadius = donut ? 30 : 0;

    return dataWithPercentages.map((item, index) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Convert to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate coordinates
      const x1 = 50 + radius * Math.cos(startRad);
      const y1 = 50 + radius * Math.sin(startRad);
      const x2 = 50 + radius * Math.cos(endRad);
      const y2 = 50 + radius * Math.sin(endRad);

      // Inner arc coordinates (for donut)
      const ix1 = 50 + innerRadius * Math.cos(startRad);
      const iy1 = 50 + innerRadius * Math.sin(startRad);
      const ix2 = 50 + innerRadius * Math.cos(endRad);
      const iy2 = 50 + innerRadius * Math.sin(endRad);

      // Large arc flag
      const largeArc = angle > 180 ? 1 : 0;

      // Create path
      let path;
      if (donut) {
        path = [
          `M ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
          `L ${ix2} ${iy2}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
          'Z'
        ].join(' ');
      } else {
        path = [
          `M 50 50`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
      }

      currentAngle = endAngle;

      return {
        ...item,
        path,
        startAngle,
        endAngle,
        index
      };
    });
  };

  const slices = createSlices();

  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title}
          </div>
          <PieIcon className="w-4 h-4 text-[#40086d] opacity-40" />
        </div>
      )}

      {/* Chart Container */}
      <div className="px-5 pb-[18px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Pie Chart */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-0">
              {slices.map((slice, index) => (
                <motion.g key={index}>
                  {/* Slice */}
                  <motion.path
                    d={slice.path}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-300"
                    initial={animate ? { opacity: 0, scale: 0 } : {}}
                    animate={{
                      opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.4,
                      scale: hoveredIndex === index ? 1.05 : 1
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: 'easeOut'
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transformOrigin: '50% 50%',
                      filter: hoveredIndex === index ? 'brightness(1.1)' : 'none'
                    }}
                  />

                  {/* Percentage label on slice */}
                  {showPercentages && slice.percentage > 5 && (
                    <motion.text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[6px] font-bold fill-white pointer-events-none"
                      transform={`rotate(${(slice.startAngle + slice.endAngle) / 2 + 90} 50 50) translate(0 ${donut ? -10 : -15})`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {slice.percentage.toFixed(0)}%
                    </motion.text>
                  )}
                </motion.g>
              ))}

              {/* Center circle for donut */}
              {donut && (
                <motion.circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="#f6f6f6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              )}
            </svg>

            {/* Center label for donut */}
            {donut && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="font-['Noto_Serif'] text-[20px] font-bold text-[#40086d]">
                  {formatValue(total)}
                </div>
                <div className="text-[9px] text-[rgba(30,30,30,0.38)] uppercase tracking-wide">
                  Total
                </div>
              </motion.div>
            )}

            {/* Tooltip */}
            {hoveredIndex !== null && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 px-3 py-2 bg-[#40086d] text-white text-[11px] rounded-md shadow-lg z-10 whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-semibold">{slices[hoveredIndex][labelKey]}</div>
                <div className="opacity-80 mt-0.5">
                  {formatValue(slices[hoveredIndex][valueKey])} ({slices[hoveredIndex].percentage.toFixed(1)}%)
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                  <div className="border-4 border-transparent border-t-[#40086d]" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="flex flex-col gap-2">
              {dataWithPercentages.map((item, index) => (
                <motion.div
                  key={index}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer
                    transition-all duration-200
                    ${hoveredIndex === index ? 'bg-[#ede0f8]' : 'bg-transparent'}
                  `}
                  initial={animate ? { opacity: 0, x: -20 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Color indicator */}
                  <motion.div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                    animate={{
                      scale: hoveredIndex === index ? 1.2 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Label and value */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-[rgba(30,30,30,0.8)] truncate">
                      {item[labelKey]}
                    </div>
                    <div className="text-[10px] text-[rgba(30,30,30,0.5)]">
                      {formatValue(item[valueKey])} • {item.percentage.toFixed(1)}%
                    </div>
                  </div>

                  {/* Percentage bar */}
                  <motion.div
                    className="h-1 rounded-full"
                    style={{ backgroundColor: item.color, opacity: 0.3 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(item.percentage / 2, 10)}px` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
