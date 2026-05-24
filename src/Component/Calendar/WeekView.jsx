/**
 * WeekView Component
 * Week grid with time slots showing posts
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import {
  DAYS_OF_WEEK,
  TIME_SLOTS,
  isSameDay,
  isToday,
} from '../../constants/calendarViewConstants';

export default function WeekView({
  currentDate,
  posts = [],
  selectedDate,
  onDateSelect,
  onPostClick,
}) {
  // Get week days
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [currentDate]);

  // Get posts for a specific date
  const getPostsForDate = (date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate || post.date);
      return isSameDay(postDate, date);
    });
  };

  // Get posts for a specific time slot
  const getPostsForTimeSlot = (date, timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    return getPostsForDate(date).filter(post => {
      if (!post.scheduledTime) return false;
      const postHour = parseInt(post.scheduledTime.split(':')[0]);
      return postHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#dccaf4]/50 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-[#dccaf4]/50">
        {/* Empty cell for time column */}
        <div className="p-3 text-center text-xs text-gray-400 border-r border-[#dccaf4]/30">
          GMT-6
        </div>

        {weekDays.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <motion.button
              key={index}
              onClick={() => onDateSelect(date)}
              whileHover={{ backgroundColor: 'rgba(237, 224, 248, 0.3)' }}
              className={`
                p-3 text-center border-r border-[#dccaf4]/30 last:border-r-0
                ${isSelected ? 'bg-[#ede0f8]/50' : ''}
              `}
            >
              <div className="text-xs text-gray-500 mb-1">
                {date.getDate()} {DAYS_OF_WEEK[date.getDay()].toUpperCase()}
              </div>
              {isTodayDate && (
                <span className="inline-block w-6 h-6 bg-[#40086d] text-white text-xs font-semibold rounded-full leading-6">
                  {date.getDate()}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Time slots grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {TIME_SLOTS.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-8 border-b border-[#dccaf4]/30 last:border-b-0">
            {/* Time label */}
            <div className="p-2 text-xs text-gray-400 border-r border-[#dccaf4]/30 text-right pr-3">
              {timeSlot}
            </div>

            {/* Day cells */}
            {weekDays.map((date, dayIndex) => {
              const slotPosts = getPostsForTimeSlot(date, timeSlot);
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <motion.div
                  key={dayIndex}
                  onClick={() => onDateSelect(date)}
                  whileHover={{ backgroundColor: 'rgba(237, 224, 248, 0.2)' }}
                  className={`
                    min-h-[60px] p-1 border-r border-[#dccaf4]/30 last:border-r-0 cursor-pointer
                    ${isSelected ? 'bg-[#ede0f8]/30' : ''}
                  `}
                >
                  {slotPosts.map((post, idx) => (
                    <PostCard
                      key={post.id || idx}
                      post={post}
                      showTime
                      onClick={onPostClick}
                    />
                  ))}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* All-day events row (for posts without specific time) */}
      <div className="border-t border-[#dccaf4] bg-[#f6f6f6]/50">
        <div className="grid grid-cols-8">
          <div className="p-2 text-xs text-gray-400 border-r border-[#dccaf4]/30 text-right pr-3">
            All day
          </div>

          {weekDays.map((date, dayIndex) => {
            const allDayPosts = getPostsForDate(date).filter(post => !post.scheduledTime);

            return (
              <div
                key={dayIndex}
                className="p-1 border-r border-[#dccaf4]/30 last:border-r-0 min-h-[50px]"
              >
                {allDayPosts.slice(0, 2).map((post, idx) => (
                  <PostCard
                    key={post.id || idx}
                    post={post}
                    compact
                    onClick={onPostClick}
                  />
                ))}
                {allDayPosts.length > 2 && (
                  <span className="text-[10px] text-[#40086d]">
                    +{allDayPosts.length - 2} more
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
