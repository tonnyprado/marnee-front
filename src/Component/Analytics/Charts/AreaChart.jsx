/**
 * AreaChart Component
 * Gráfica de área para visualizar engagement over time con múltiples series
 * Usada para: multi-platform comparison, stacked metrics, engagement trends
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Activity } from 'lucide-react';

export default function AreaChart({
  data = [],
  series = [], // [{ key: 'instagram', label: 'Instagram', color: '#40086d' }]
  xKey = 'date',
  title,
  height = 300,
  stacked = false,
  showGrid = true,
  showLegend = true,
  animate = true
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hiddenSeries, setHiddenSeries] = useState(new Set());

  if (!data || data.length === 0 || !series || series.length === 0) {
    return (
      <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] p-5">
        <div className="text-center text-[rgba(30,30,30,0.38)] py-8">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  // Filter visible series
  const visibleSeries = series.filter(s => !hiddenSeries.has(s.key));

  // Calculate max value for scaling
  const getMaxValue = () => {
    if (stacked) {
      return Math.max(...data.map(point =>
        visibleSeries.reduce((sum, s) => sum + (point[s.key] || 0), 0)
      ));
    } else {
      return Math.max(...data.map(point =>
        Math.max(...visibleSeries.map(s => point[s.key] || 0))
      ));
    }
  };

  const maxValue = getMaxValue() || 1;

  // Create SVG path for a series
  const createPath = (seriesKey, stackedOffset = []) => {
    const width = 100;
    const stepX = width / (data.length - 1);

    return data.map((point, i) => {
      const x = i * stepX;
      const offset = stacked && stackedOffset[i] ? stackedOffset[i] : 0;
      const value = (point[seriesKey] || 0) + offset;
      const y = 100 - (value / maxValue) * 90;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Create area path (filled)
  const createAreaPath = (seriesKey, stackedOffset = []) => {
    const width = 100;
    const stepX = width / (data.length - 1);

    const topPath = data.map((point, i) => {
      const x = i * stepX;
      const offset = stacked && stackedOffset[i] ? stackedOffset[i] : 0;
      const value = (point[seriesKey] || 0) + offset;
      const y = 100 - (value / maxValue) * 90;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const bottomPath = data.map((point, i) => {
      const x = (data.length - 1 - i) * stepX;
      const offset = stacked && stackedOffset[data.length - 1 - i] ? stackedOffset[data.length - 1 - i] : 0;
      const y = 100 - (offset / maxValue) * 90;
      return `L ${x} ${y}`;
    }).join(' ');

    return `${topPath} ${bottomPath} Z`;
  };

  // Calculate stacked offsets
  const stackedOffsets = stacked
    ? data.map((_, pointIndex) => {
        return visibleSeries.map((s, seriesIndex) => {
          return visibleSeries
            .slice(0, seriesIndex)
            .reduce((sum, prevSeries) => sum + (data[pointIndex][prevSeries.key] || 0), 0);
        });
      })
    : [];

  // Format value
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  // Toggle series visibility
  const toggleSeries = (key) => {
    setHiddenSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        // Prevent hiding all series
        if (newSet.size < series.length - 1) {
          newSet.add(key);
        }
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#f6f6f6] border border-[#dccaf4] rounded-[10px] overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-[rgba(30,30,30,0.38)] uppercase tracking-[0.7px] font-['DM_Sans']">
            {title}
          </div>
          <Activity className="w-4 h-4 text-[#40086d] opacity-40" />
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

            {/* Areas */}
            {visibleSeries.map((s, index) => {
              const offsets = stacked ? stackedOffsets.map(o => o[index]) : [];

              return (
                <motion.g key={s.key}>
                  {/* Area fill */}
                  <motion.path
                    d={createAreaPath(s.key, offsets)}
                    fill={s.color}
                    opacity={stacked ? 0.7 : 0.2}
                    initial={animate ? { opacity: 0 } : {}}
                    animate={{ opacity: stacked ? 0.7 : 0.2 }}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  />

                  {/* Line */}
                  {!stacked && (
                    <motion.path
                      d={createPath(s.key)}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={animate ? { pathLength: 0 } : {}}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: 'easeInOut' }}
                    />
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Hover line */}
          {hoveredIndex !== null && (
            <motion.div
              className="absolute top-0 bottom-0 w-[1px] bg-[#40086d] opacity-30 pointer-events-none"
              style={{
                left: `${(hoveredIndex / (data.length - 1)) * 100}%`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Interactive overlay */}
          <div className="absolute inset-0 flex">
            {data.map((point, i) => (
              <div
                key={i}
                className="flex-1 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <motion.div
              className="absolute bottom-full mb-2 bg-[#40086d] text-white text-[11px] px-3 py-2 rounded-md shadow-lg z-10 whitespace-nowrap pointer-events-none"
              style={{
                left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-semibold mb-1 text-[10px] opacity-70">
                {formatDate(data[hoveredIndex][xKey])}
              </div>
              {visibleSeries.map(s => (
                <div key={s.key} className="flex items-center gap-2 mt-0.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="opacity-90">{s.label}:</span>
                  <span className="font-semibold">
                    {formatValue(data[hoveredIndex][s.key] || 0)}
                  </span>
                </div>
              ))}
              {stacked && (
                <div className="mt-1 pt-1 border-t border-white/20 font-semibold">
                  Total: {formatValue(
                    visibleSeries.reduce((sum, s) => sum + (data[hoveredIndex][s.key] || 0), 0)
                  )}
                </div>
              )}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                <div className="border-4 border-transparent border-t-[#40086d]" />
              </div>
            </motion.div>
          )}
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
        {showLegend && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#dccaf4]">
            {series.map((s, i) => {
              const isHidden = hiddenSeries.has(s.key);

              return (
                <motion.button
                  key={s.key}
                  className={`
                    flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md
                    transition-all duration-200
                    ${isHidden ? 'opacity-40' : 'opacity-100'}
                    hover:bg-[#ede0f8]
                  `}
                  onClick={() => toggleSeries(s.key)}
                  initial={animate ? { opacity: 0, y: 10 } : {}}
                  animate={{ opacity: isHidden ? 0.4 : 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: s.color }}
                    animate={{
                      opacity: isHidden ? 0.3 : 1,
                      scale: isHidden ? 0.8 : 1
                    }}
                  />
                  <span className={`font-medium ${isHidden ? 'line-through' : ''}`}>
                    {s.label}
                  </span>
                </motion.button>
              );
            })}
            {stacked && (
              <div className="ml-auto text-[9px] text-[rgba(30,30,30,0.38)] italic">
                Apilado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
