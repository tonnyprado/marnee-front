/**
 * PostCard Component
 * Compact card for displaying posts in calendar cells
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CONTENT_TYPE_COLORS,
  STATUS_COLORS,
  EFFORT_LEVELS,
} from '../../constants/calendarViewConstants';

export default function PostCard({
  post,
  onClick,
  compact = false,
  showTime = false,
}) {
  const bgColor = CONTENT_TYPE_COLORS[post.contentType] || CONTENT_TYPE_COLORS.default;
  const statusColor = STATUS_COLORS[post.status] || STATUS_COLORS.todo;
  const effort = EFFORT_LEVELS[post.effortLevel];

  if (compact) {
    return (
      <motion.button
        onClick={() => onClick?.(post)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full text-left p-1.5 rounded mb-0.5 transition-shadow hover:shadow-md"
        style={{
          backgroundColor: bgColor,
          borderLeft: `3px solid ${statusColor}`,
        }}
      >
        <p className="text-[10px] font-medium text-gray-800 line-clamp-1">
          {post.title || post.hook || 'Untitled'}
        </p>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => onClick?.(post)}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left p-2 rounded-lg mb-1 transition-all"
      style={{
        backgroundColor: bgColor,
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      {showTime && post.scheduledTime && (
        <p className="text-[10px] text-gray-500 mb-0.5">{post.scheduledTime}</p>
      )}

      <p className="text-xs font-medium text-gray-800 line-clamp-2">
        {post.title || post.hook || 'Untitled'}
      </p>

      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
        {post.platform && (
          <span className="text-[9px] text-gray-500 bg-white/60 px-1.5 py-0.5 rounded">
            {post.platform}
          </span>
        )}
        {post.contentType && (
          <span className="text-[9px] text-gray-600 font-medium">
            {post.contentType}
          </span>
        )}
        {effort && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: effort.bgColor, color: effort.color }}
          >
            {post.effortLevel}
          </span>
        )}
      </div>
    </motion.button>
  );
}

// Mini version for tight spaces
export function PostCardMini({ post, onClick }) {
  const bgColor = CONTENT_TYPE_COLORS[post.contentType] || CONTENT_TYPE_COLORS.default;

  return (
    <motion.button
      onClick={() => onClick?.(post)}
      whileHover={{ scale: 1.05 }}
      className="w-full h-1.5 rounded-full"
      style={{ backgroundColor: bgColor }}
      title={post.title || post.hook || 'Untitled'}
    />
  );
}
