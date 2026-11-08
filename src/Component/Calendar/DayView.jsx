/**
 * DayView Component
 * Detailed single day view with time slots
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import PostCard from './PostCard';
import {
  TIME_SLOTS,
  isSameDay,
  formatDate,
} from '../../constants/calendarViewConstants';

export default function DayView({
  currentDate,
  posts = [],
  onPostClick,
  onAddPost,
}) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  // Get posts for this day
  const dayPosts = useMemo(() => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate || post.date);
      return isSameDay(postDate, currentDate);
    });
  }, [posts, currentDate]);

  // Group posts by hour
  const getPostsForTimeSlot = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    return dayPosts.filter(post => {
      if (!post.scheduledTime) return false;
      const postHour = parseInt(post.scheduledTime.split(':')[0]);
      return postHour === hour;
    });
  };

  // All-day posts (no specific time)
  const allDayPosts = dayPosts.filter(post => !post.scheduledTime);

  return (
    <div className="bg-white rounded-xl border border-[#dccaf4]/50 overflow-hidden">
      {/* Date header */}
      <div className="p-4 border-b border-[#dccaf4]/50 bg-[#f6f6f6]/50">
        <h3 className="text-lg font-semibold text-[#1e1e1e]">
          {formatDate(currentDate, 'full')}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'} scheduled
        </p>
      </div>

      {/* All-day events */}
      {allDayPosts.length > 0 && (
        <div className="p-4 border-b border-[#dccaf4]/50 bg-[#ede0f8]/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-600">All Day</span>
            <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded">
              {allDayPosts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allDayPosts.map((post, idx) => (
              <PostCard
                key={post.id || idx}
                post={post}
                onClick={onPostClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="max-h-[500px] overflow-y-auto">
        {TIME_SLOTS.map((timeSlot) => {
          const slotPosts = getPostsForTimeSlot(timeSlot);
          const hasContent = slotPosts.length > 0;
          const isSelected = selectedTimeSlot === timeSlot;

          return (
            <motion.div
              key={timeSlot}
              onClick={() => setSelectedTimeSlot(isSelected ? null : timeSlot)}
              className={`
                flex border-b border-[#dccaf4]/30 last:border-b-0 cursor-pointer
                transition-colors duration-150
                ${isSelected ? 'bg-[#ede0f8]/50' : hasContent ? 'bg-white hover:bg-[#f6f6f6]/50' : 'bg-[#f6f6f6]/30 hover:bg-[#ede0f8]/20'}
              `}
            >
              {/* Time label */}
              <div className={`w-20 flex-shrink-0 p-3 border-r border-[#dccaf4]/30 text-right ${isSelected ? 'bg-[#40086d]/10' : ''}`}>
                <span className={`text-sm ${isSelected ? 'text-[#40086d] font-medium' : 'text-gray-500'}`}>{timeSlot}</span>
              </div>

              {/* Content area */}
              <div className="flex-1 p-2 min-h-[70px]">
                {/* Add task bar when selected */}
                <AnimatePresence>
                  {isSelected && onAddPost && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-2"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Create a date with the selected time
                          const dateWithTime = new Date(currentDate);
                          const [hours] = timeSlot.split(':');
                          dateWithTime.setHours(parseInt(hours), 0, 0, 0);
                          onAddPost(dateWithTime, timeSlot);
                          setSelectedTimeSlot(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#40086d] text-white font-medium hover:bg-[#350758] transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add task at {timeSlot}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {slotPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {slotPosts.map((post, idx) => (
                      <PostCard
                        key={post.id || idx}
                        post={post}
                        showTime
                        onClick={onPostClick}
                      />
                    ))}
                  </div>
                ) : !isSelected && (
                  <div className="h-full flex items-center">
                    <span className="text-xs text-gray-300">Click to add task</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="p-4 border-t border-[#dccaf4]/50 bg-[#f6f6f6]/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Total: {dayPosts.length} posts
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">
              <span className="font-medium text-[#10B981]">
                {dayPosts.filter(p => p.status === 'done').length}
              </span> done
            </span>
            <span className="text-gray-500">
              <span className="font-medium text-[#F59E0B]">
                {dayPosts.filter(p => p.status === 'in_progress').length}
              </span> in progress
            </span>
            <span className="text-gray-500">
              <span className="font-medium text-[#9CA3AF]">
                {dayPosts.filter(p => p.status === 'todo').length}
              </span> todo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
