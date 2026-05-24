/**
 * CalendarHeader Component
 * Header with month/year title, view mode toggles, and navigation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { VIEW_MODES, MONTHS } from '../../constants/calendarViewConstants';

export default function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onNavigate,
  onToday,
}) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Get week range for week view header
  const getWeekRange = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startMonth = MONTHS[startOfWeek.getMonth()].slice(0, 3);
    const endMonth = MONTHS[endOfWeek.getMonth()].slice(0, 3);

    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${year}`;
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
  };

  // Get title based on view mode
  const getTitle = () => {
    switch (viewMode) {
      case VIEW_MODES.WEEK:
        return getWeekRange();
      case VIEW_MODES.DAY:
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      default:
        return `${MONTHS[month]}, ${year}`;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-[#1e1e1e]">
        {getTitle()}
      </h2>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* View Mode Toggles */}
        <div className="flex items-center bg-[#f6f6f6] rounded-lg p-1">
          {Object.values(VIEW_MODES).map((mode) => (
            <motion.button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                ${viewMode === mode
                  ? 'bg-white text-[#40086d] shadow-sm'
                  : 'text-gray-500 hover:text-[#1e1e1e]'
                }
              `}
            >
              {mode}
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onNavigate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border border-[#dccaf4] hover:bg-[#ede0f8] transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={onToday}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg border border-[#dccaf4] text-sm font-medium text-[#1e1e1e] hover:bg-[#ede0f8] transition"
          >
            Today
          </motion.button>

          <motion.button
            onClick={() => onNavigate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg border border-[#dccaf4] hover:bg-[#ede0f8] transition"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
