/**
 * LineChart Component
 * Gráfica de línea para tendencias de crecimiento y pronósticos
 * Usada para: audience growth, engagement trends, timeline forecasts
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function LineChart({
  data = [],
  xKey = 'date',
  yKey = 'value',
  title,
  height = 300,
  color = '#40086d',
  showGrid = true,
  showDots = true,
  animate = true,
  forecast = false
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

  // Calculate min/max for scaling
  const values = data.map(d => d[yKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Create SVG path
  const createPath = () => {
    const width = 100; // percentage
    const stepX = width / (data.length - 1);

    return data.map((point, i) => {
      const x = i * stepX;
      const y = 100 - ((point[yKey] - minValue) / range) * 90; // 90% to leave margin
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Create area path (filled under line)
  const createAreaPath = () => {
    const path = createPath();
    const width = 100;
    return `${path} L ${width} 100 L 0 100 Z`;
  };

  // Format value for display
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title}
          </div>
          <TrendingUp className="w-4 h-4 text-[#40086d] opacity-40" />
        </div>
      )}

      {/* Chart Container */}
      <div className="px-5 pb-[18px]">
        <div className="relative" style={{ height: `${height}px` }}>
          {/* SVG Chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Grid lines */}
            {showGrid && (
              <g className="opacity-20">
                {[0, 25, 50, 75, 100].map(y => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#40086d"
                    strokeWidth="0.2"
                  />
                ))}
              </g>
            )}

            {/* Area fill */}
            <motion.path
              d={createAreaPath()}
              fill={`url(#gradient-${title || 'chart'})`}
              initial={animate ? { opacity: 0 } : {}}
              animate={{ opacity: 0.15 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Line */}
            <motion.path
              d={createPath()}
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={animate ? { pathLength: 0 } : {}}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            {/* Forecast dashed line */}
            {forecast && data.some(d => d.isForecast) && (
              <motion.path
                d={createPath()}
                fill="none"
                stroke={color}
                strokeWidth="0.6"
                strokeDasharray="2 2"
                opacity="0.5"
                initial={animate ? { pathLength: 0 } : {}}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              />
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id={`gradient-${title || 'chart'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Data points */}
          {showDots && data.map((point, i) => {
            const stepX = 100 / (data.length - 1);
            const x = i * stepX;
            const y = 100 - ((point[yKey] - minValue) / range) * 90;

            return (
              <motion.div
                key={i}
                className={`
                  absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2
                  transition-all duration-200 cursor-pointer
                  ${point.isForecast ? 'border-2 border-current bg-white' : 'bg-current'}
                  ${hoveredIndex === i ? 'scale-150 shadow-lg' : 'scale-100'}
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  color: color
                }}
                initial={animate ? { scale: 0 } : {}}
                animate={{ scale: hoveredIndex === i ? 1.5 : 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {hoveredIndex === i && (
                  <motion.div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#40086d] text-white text-[11px] rounded-md whitespace-nowrap shadow-lg z-10"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-semibold">{formatValue(point[yKey])}</div>
                    <div className="opacity-70 text-[9px]">
                      {formatDate(point[xKey])}
                      {point.isForecast && ' (pronóstico)'}
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                      <div className="border-4 border-transparent border-t-[#40086d]" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-1">
          {data.filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1).map((point, i) => (
            <div
              key={i}
              className="text-[9px] text-[rgba(30,30,30,0.38)] font-medium"
            >
              {formatDate(point[xKey])}
            </div>
          ))}
        </div>

        {/* Legend */}
        {forecast && data.some(d => d.isForecast) && (
          <div className="flex items-center gap-4 mt-3 text-[10px] text-[rgba(30,30,30,0.38)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px]" style={{ backgroundColor: color }} />
              <span>Real</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[2px] border-t-2 border-dashed" style={{ borderColor: color, opacity: 0.5 }} />
              <span>Pronóstico</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
