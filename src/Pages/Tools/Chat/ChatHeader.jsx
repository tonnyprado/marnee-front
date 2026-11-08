/**
 * ChatHeader Component
 *
 * Header bar with:
 * - Title and branding
 * - Search functionality
 * - Quick actions toggle (mobile)
 * - Sidebar toggle (mobile)
 */

import React from 'react';
import { MessageCircle, Search, X, Menu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatHeader({
  onSidebarToggle,
  onActionsBarToggle,
  isActionsBarCollapsed,
  searchTerm,
  onSearchChange,
  onSearchClear,
  searchResults = [],
  currentResultIndex = 0,
  onNextResult,
  onPrevResult,
}) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-white to-purple-50/30 border-b border-gray-200 shadow-sm px-4 py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Brand and title */}
        <div className="flex-1 flex items-center gap-3">
          {/* Hamburger menu for mobile */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSidebarToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </motion.button>

          {/* Brand icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#40086d] to-[#2d0550] flex items-center justify-center shadow-lg"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </motion.div>

          {/* Title */}
          <div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-bold text-gray-900"
            >
              Chat with Marnee
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-gray-600"
            >
              Your AI content strategist
            </motion.p>
          </div>
        </div>

        {/* Right: Search and actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions button - Mobile */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onActionsBarToggle}
            className="lg:hidden p-2 hover:bg-purple-50 rounded-lg transition"
            title={isActionsBarCollapsed ? "Show quick actions" : "Hide quick actions"}
          >
            <Sparkles className="w-6 h-6 text-[#40086d]" />
          </motion.button>

          {/* Search box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in chat..."
              className="w-full sm:w-48 pl-8 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
            {searchTerm && (
              <button
                onClick={onSearchClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search navigation */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 mr-1">
                {currentResultIndex + 1}/{searchResults.length}
              </span>
              <button
                onClick={onPrevResult}
                className="p-1 hover:bg-gray-100 rounded transition"
                title="Previous result"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={onNextResult}
                className="p-1 hover:bg-gray-100 rounded transition"
                title="Next result"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
