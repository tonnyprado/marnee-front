/**
 * MonthView Component
 * Full month grid with posts displayed in cells
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import {
  DAYS_OF_WEEK,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
} from '../../constants/calendarViewConstants';

export default function MonthView({
  currentDate,
  posts = [],
  selectedDate,
  onDateSelect,
  onPostClick,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calculate calendar grid
  const calendarWeeks = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const weeks = [];
    let currentWeek = [];

    // Previous month's trailing days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      currentWeek.push({
        date: new Date(prevYear, prevMonth, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      currentWeek.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Next month's leading days
    if (currentWeek.length > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      let nextDay = 1;

      while (currentWeek.length < 7) {
        currentWeek.push({
          date: new Date(nextYear, nextMonth, nextDay++),
          isCurrentMonth: false,
        });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [year, month]);

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate || post.date);
      return isSameDay(postDate, date);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#dccaf4]/50 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#dccaf4]/50">
        {DAYS_OF_WEEK.map((day, index) => (
          <div
            key={day}
            className={`
              py-3 text-center text-sm font-semibold
              ${index === 0 || index === 6 ? 'text-red-400' : 'text-gray-500'}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="divide-y divide-[#dccaf4]/30">
        {calendarWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 divide-x divide-[#dccaf4]/30">
            {week.map(({ date, isCurrentMonth }, dayIndex) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);
              const dayPosts = getPostsForDate(date);
              const hasMorePosts = dayPosts.length > 3;

              return (
                <motion.div
                  key={dayIndex}
                  onClick={() => onDateSelect(date)}
                  whileHover={{ backgroundColor: 'rgba(237, 224, 248, 0.3)' }}
                  className={`
                    min-h-[120px] p-2 cursor-pointer transition-colors
                    ${isSelected ? 'bg-[#ede0f8]/50' : ''}
                    ${!isCurrentMonth ? 'bg-gray-50/50' : ''}
                  `}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`
                        w-7 h-7 flex items-center justify-center rounded-full text-sm
                        ${isTodayDate
                          ? 'bg-[#40086d] text-white font-semibold'
                          : isSelected
                            ? 'bg-[#dccaf4] text-[#40086d] font-semibold'
                            : isCurrentMonth
                              ? 'text-[#1e1e1e]'
                              : 'text-gray-300'
                        }
                      `}
                    >
                      {date.getDate()}
                    </span>

                    {/* Add button */}
                    {isCurrentMonth && (
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateSelect(date);
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-[#40086d] hover:bg-[#ede0f8] opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                    )}
                  </div>

                  {/* Posts */}
                  <div className="space-y-0.5">
                    {dayPosts.slice(0, 3).map((post, idx) => (
                      <PostCard
                        key={post.id || idx}
                        post={post}
                        compact
                        onClick={onPostClick}
                      />
                    ))}

                    {hasMorePosts && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateSelect(date);
                        }}
                        className="w-full text-[10px] text-[#40086d] font-medium py-0.5 hover:underline"
                      >
                        +{dayPosts.length - 3} more
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
