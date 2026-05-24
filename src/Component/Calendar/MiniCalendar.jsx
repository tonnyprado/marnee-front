/**
 * MiniCalendar Component
 * Compact month view with colored dots indicating posts
 * Features: navigation, date selection, upcoming events
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DAYS_OF_WEEK_SHORT,
  MONTHS,
  CONTENT_TYPE_COLORS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
} from '../../constants/calendarViewConstants';

export default function MiniCalendar({
  posts = [],
  selectedDate,
  onDateSelect,
  currentMonth,
  currentYear,
  onMonthChange,
}) {
  // Use internal state if not controlled
  const [internalMonth, setInternalMonth] = useState(new Date().getMonth());
  const [internalYear, setInternalYear] = useState(new Date().getFullYear());

  const month = currentMonth ?? internalMonth;
  const year = currentYear ?? internalYear;

  // Calculate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 rows * 7 days

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate || post.date);
      return isSameDay(postDate, date);
    });
  };

  // Get unique content types for dots (max 3)
  const getDotsForDate = (date) => {
    const datePosts = getPostsForDate(date);
    const types = [...new Set(datePosts.map(p => p.contentType))];
    return types.slice(0, 3).map(type => CONTENT_TYPE_COLORS[type] || CONTENT_TYPE_COLORS.default);
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;
    if (onMonthChange) {
      onMonthChange(newYear, newMonth);
    } else {
      setInternalMonth(newMonth);
      setInternalYear(newYear);
    }
  };

  const handleNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;
    if (onMonthChange) {
      onMonthChange(newYear, newMonth);
    } else {
      setInternalMonth(newMonth);
      setInternalYear(newYear);
    }
  };

  return (
    <div className="space-y-6">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1e1e1e]">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-[#ede0f8] transition text-gray-500 hover:text-[#40086d]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-[#ede0f8] transition text-gray-500 hover:text-[#40086d]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="select-none">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK_SHORT.map((day, index) => (
            <div
              key={index}
              className={`text-center text-xs font-medium py-1 ${
                index === 0 || index === 6 ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const dots = getDotsForDate(date);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            return (
              <motion.button
                key={index}
                onClick={() => onDateSelect(date)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative aspect-square flex flex-col items-center justify-center
                  rounded-lg text-sm transition-all
                  ${isSelected
                    ? 'bg-[#40086d] text-white font-semibold'
                    : isTodayDate
                      ? 'bg-[#ede0f8] text-[#40086d] font-semibold'
                      : isCurrentMonth
                        ? isWeekend
                          ? 'text-red-400 hover:bg-[#f6f6f6]'
                          : 'text-[#1e1e1e] hover:bg-[#f6f6f6]'
                        : 'text-gray-300'
                  }
                `}
              >
                <span>{date.getDate()}</span>

                {/* Dots indicator */}
                {dots.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dots.map((color, i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: isSelected ? 'white' : color }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
