/**
 * DayDetailPanel Component
 * Right-side panel showing day's posts with mobile-style design
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CONTENT_TYPE_COLORS,
  STATUS_COLORS,
  EFFORT_LEVELS,
  formatDate,
} from '../../constants/calendarViewConstants';

export default function DayDetailPanel({
  date,
  posts = [],
  onClose,
  onPostClick,
  onAddPost,
}) {
  if (!date) return null;

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-[400px] bg-white border-l border-[#dccaf4] flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-5 border-b border-[#dccaf4]/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#1e1e1e]">
              {formatDate(date, 'weekday')}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(date, 'full')}
            </p>
          </div>

          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-[#ede0f8] transition"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 mt-4">
          <span className="px-3 py-1.5 bg-[#ede0f8] text-[#40086d] rounded-full text-sm font-medium">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
          {posts.filter(p => p.status === 'done').length > 0 && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {posts.filter(p => p.status === 'done').length} done
            </span>
          )}
        </div>
      </div>

      {/* Posts list */}
      <div className="flex-1 overflow-y-auto p-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-16 h-16 bg-[#ede0f8] rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#40086d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-[#1e1e1e] mb-2">No posts scheduled</h4>
            <p className="text-sm text-gray-500 mb-6">
              Create your first post for this day
            </p>
            <motion.button
              onClick={() => onAddPost?.(date)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-[#40086d] text-white rounded-xl font-medium text-sm hover:bg-[#1a0530] transition"
            >
              + Add Post
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, idx) => (
              <PostListItem
                key={post.id || idx}
                post={post}
                onClick={() => onPostClick?.(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add button footer */}
      {posts.length > 0 && (
        <div className="p-4 border-t border-[#dccaf4]/50">
          <motion.button
            onClick={() => onAddPost?.(date)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 bg-[#40086d] text-white rounded-xl font-semibold text-sm hover:bg-[#1a0530] transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Post
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
}

// Post list item component
function PostListItem({ post, onClick }) {
  const bgColor = CONTENT_TYPE_COLORS[post.contentType] || CONTENT_TYPE_COLORS.default;
  const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.todo;
  const effort = EFFORT_LEVELS[post.effortLevel];

  const getStatusLabel = (status) => {
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
      skipped: 'Skipped',
      draft: 'Draft',
      scheduled: 'Scheduled',
      published: 'Published',
    };
    return labels[status] || status;
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left p-4 rounded-xl border border-[#dccaf4] bg-white hover:shadow-lg transition-all"
    >
      {/* Time badge */}
      {post.scheduledTime && (
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-500">{post.scheduledTime}</span>
        </div>
      )}

      {/* Title */}
      <h4 className="font-semibold text-[#1e1e1e] mb-2 line-clamp-2">
        {post.title || post.hook || 'Untitled Post'}
      </h4>

      {/* Description preview */}
      {post.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {post.description}
        </p>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Content type badge */}
        {post.contentType && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: bgColor, color: '#1e1e1e' }}
          >
            {post.contentType}
          </span>
        )}

        {/* Platform badge */}
        {post.platform && (
          <span className="px-2.5 py-1 bg-[#f6f6f6] text-gray-600 rounded-full text-xs font-medium">
            {post.platform}
          </span>
        )}

        {/* Effort badge */}
        {effort && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: effort.bgColor, color: effort.color }}
          >
            {effort.label}
          </span>
        )}

        {/* Status badge */}
        <span
          className="px-2.5 py-1 rounded-full text-xs font-medium ml-auto"
          style={{
            backgroundColor: statusColor + '20',
            color: statusColor,
          }}
        >
          {getStatusLabel(post.status)}
        </span>
      </div>

      {/* Assets indicator */}
      {post.assetsNeeded && post.assetsNeeded.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#dccaf4]/50 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          {post.assetsNeeded.length} asset{post.assetsNeeded.length !== 1 ? 's' : ''} needed
        </div>
      )}
    </motion.button>
  );
}
