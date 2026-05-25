/**
 * PostSelectorModal Component
 * Allows selecting a calendar post to link with a script
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Calendar,
  Search,
  Loader2,
  X,
  Check,
  FileText,
  Clock
} from 'lucide-react';
import {
  CONTENT_TYPE_COLORS,
  STATUS_COLORS,
} from '../../../constants/calendarViewConstants';

export default function PostSelectorModal({ isOpen, onClose, onSelect, currentPostId }) {
  const { founderId, sessionId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(currentPostId);

  useEffect(() => {
    if (isOpen && founderId) {
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, founderId]);

  useEffect(() => {
    setSelectedPostId(currentPostId);
  }, [currentPostId]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);

      // Get the latest calendar for this founder
      let calendarData = null;
      try {
        calendarData = await api.getMyLatestCalendar({ founderId, sessionId });
      } catch (e) {
        if (founderId) {
          calendarData = await api.getLatestCalendarByFounder(founderId, sessionId);
        }
      }

      const calendar = calendarData?.calendar || calendarData;
      const calendarPosts = calendar?.posts || [];

      // Sort posts by date (newest first)
      const sortedPosts = [...calendarPosts].sort((a, b) => {
        const dateA = new Date(a.scheduledDate || a.date);
        const dateB = new Date(b.scheduledDate || b.date);
        return dateA - dateB;
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.error('[PostSelectorModal] Error loading posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    const title = (post.title || post.hook || '').toLowerCase();
    const platform = (post.platform || '').toLowerCase();
    const contentType = (post.contentType || '').toLowerCase();
    return title.includes(searchLower) ||
           platform.includes(searchLower) ||
           contentType.includes(searchLower);
  });

  const handleSelect = () => {
    if (selectedPostId) {
      const selectedPost = posts.find(p => p.id === selectedPostId);
      onSelect(selectedPostId, selectedPost);
      onClose();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#f8f4fc] to-[#f3e8ff]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ede0f8] rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#40086d]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Link to Calendar</h2>
                <p className="text-sm text-gray-500">Select a post to link this script</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts by title, platform..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d]"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#40086d] animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No posts found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {posts.length === 0
                    ? "Generate a calendar first to create posts"
                    : "Try a different search term"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredPosts.map((post) => {
                  const isSelected = selectedPostId === post.id;
                  const hasLinkedScript = post.scriptId && post.scriptId !== currentPostId;
                  const contentTypeColor = CONTENT_TYPE_COLORS[post.contentType] || '#6B7280';
                  const statusColor = STATUS_COLORS[post.status] || '#6B7280';

                  return (
                    <button
                      key={post.id}
                      onClick={() => !hasLinkedScript && setSelectedPostId(post.id)}
                      disabled={hasLinkedScript}
                      className={`w-full p-4 text-left transition-all ${
                        hasLinkedScript
                          ? 'opacity-50 cursor-not-allowed bg-gray-50'
                          : isSelected
                            ? 'bg-[#ede0f8] border-l-4 border-[#40086d]'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Selection indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-[#40086d] bg-[#40086d]'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h4 className="font-medium text-gray-900 truncate">
                            {post.title || post.hook || 'Untitled Post'}
                          </h4>

                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDate(post.scheduledDate || post.date)}</span>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {post.platform && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                                {post.platform}
                              </span>
                            )}
                            {post.contentType && (
                              <span
                                className="px-2 py-0.5 text-xs rounded-md"
                                style={{
                                  backgroundColor: `${contentTypeColor}20`,
                                  color: contentTypeColor
                                }}
                              >
                                {post.contentType}
                              </span>
                            )}
                            {post.status && (
                              <span
                                className="px-2 py-0.5 text-xs rounded-md"
                                style={{
                                  backgroundColor: `${statusColor}20`,
                                  color: statusColor
                                }}
                              >
                                {post.status}
                              </span>
                            )}
                            {hasLinkedScript && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-md">
                                <FileText className="w-3 h-3" />
                                Has script
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedPostId}
              className="px-6 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#350758] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Link Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
