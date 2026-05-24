/**
 * CalendarPage - Redesigned with 3-column layout
 * Left: MiniCalendar sidebar
 * Center: MainCalendar with views
 * Right: DayDetailPanel
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import { VIEW_MODES, isSameDay } from "../../constants/calendarViewConstants";
import {
  MiniCalendar,
  MainCalendar,
  DayDetailPanel,
  PostFormModal,
  NextTasks,
} from "../../Component/Calendar";
import PageTransition from "../../Component/PageTransition";

export default function CalendarPage() {
  const {
    founderId,
    sessionId,
    calendarId,
    calendar: cachedCalendar,
    currentStep,
    setCalendarId,
    setCalendar: setCachedCalendar,
    setFounderId,
    setSessionId,
    hasSession
  } = useMarnee();

  // Calendar state
  const [calendar, setCalendar] = useState(cachedCalendar);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCheckedHistory, setHasCheckedHistory] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const autoGenerateAttemptedRef = useRef(false);

  // View state
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Form state
  const [editingPost, setEditingPost] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update both local state and cached calendar
  const updateCalendar = useCallback((newCalendar) => {
    setCalendar(newCalendar);
    setCachedCalendar(newCalendar);
  }, [setCachedCalendar]);

  // Load session data from API
  const loadSessionData = useCallback(async () => {
    if (isLoadingSession) return;
    setIsLoadingSession(true);

    try {
      const founder = await api.getMeFounder();
      if (founder && founder.id) {
        setFounderId(founder.id);
        if (founder.sessionId) {
          setSessionId(founder.sessionId);
        }
        return true;
      } else {
        setError('Unable to load your session. Please try refreshing the page.');
        return false;
      }
    } catch (error) {
      if (error.status === 404) {
        setError('Session not found. Please complete the business test first.');
      } else {
        setError('Failed to load session. Please try refreshing the page.');
      }
      return false;
    } finally {
      setIsLoadingSession(false);
    }
  }, [isLoadingSession, setFounderId, setSessionId]);

  // Generate calendar
  const handleGenerateCalendar = async (weeks = 4) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await api.generateCalendar({
        founderId,
        sessionId,
        weeks,
      });

      setCalendarId(response.calendarId);
      updateCalendar(response.calendar);
    } catch (err) {
      setError(err.message || 'Failed to generate calendar');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load existing calendar
  useEffect(() => {
    if (!founderId && !sessionId && !isLoadingSession) {
      loadSessionData().then((success) => {
        if (!success) {
          setIsLoading(false);
          setHasCheckedHistory(true);
        }
      });
      return;
    }

    if (!founderId && !sessionId) {
      setIsLoading(false);
      setHasCheckedHistory(true);
      return;
    }

    const getCalendarIdFromResponse = (data) =>
      data?.calendarId || data?.id || data?.calendar?.id || null;

    const getCalendarFromResponse = (data) => {
      const candidate = data?.calendar || data;
      return candidate?.posts ? candidate : null;
    };

    const loadCalendar = async () => {
      if (cachedCalendar && cachedCalendar.posts && cachedCalendar.posts.length > 0) {
        setCalendar(cachedCalendar);
        setIsLoading(false);
        setHasCheckedHistory(true);

        if (calendarId) {
          try {
            const data = await api.getCalendar(calendarId);
            const freshCalendar = data.calendar || data;
            updateCalendar(freshCalendar);
          } catch (bgErr) {
            console.warn('[CalendarPage] Background refresh failed:', bgErr.message);
          }
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (calendarId) {
          const data = await api.getCalendar(calendarId);
          updateCalendar(data.calendar || data);
          return;
        }

        let latestCalendar = null;

        try {
          latestCalendar = await api.getMyLatestCalendar({ founderId, sessionId });
        } catch (latestError) {
          if (founderId) {
            latestCalendar = await api.getLatestCalendarByFounder(founderId, sessionId);
          }
        }

        const latestCalendarId = getCalendarIdFromResponse(latestCalendar);

        if (latestCalendarId) {
          setCalendarId(latestCalendarId);
          const hydratedCalendar = getCalendarFromResponse(latestCalendar);
          if (hydratedCalendar) {
            updateCalendar(hydratedCalendar);
          }
        } else {
          updateCalendar(null);
        }
      } catch (err) {
        updateCalendar(null);
      } finally {
        setIsLoading(false);
        setHasCheckedHistory(true);
      }
    };

    if (!hasCheckedHistory) {
      loadCalendar();
    }
  }, [calendarId, founderId, sessionId, setCalendarId, updateCalendar, hasSession, loadSessionData, isLoadingSession, hasCheckedHistory, cachedCalendar]);

  // Auto-generate calendar if in calendar phase
  useEffect(() => {
    const hasSessionData = Boolean(founderId || sessionId);

    if (
      !hasSessionData ||
      !hasCheckedHistory ||
      isLoading ||
      isGenerating ||
      calendarId ||
      calendar
    ) {
      return;
    }

    if (currentStep < 5 || autoGenerateAttemptedRef.current) {
      return;
    }

    autoGenerateAttemptedRef.current = true;
    handleGenerateCalendar(4);
  }, [calendar, calendarId, currentStep, founderId, hasCheckedHistory, isGenerating, isLoading, sessionId]);

  // Get posts for a specific date
  const getPostsForDate = useCallback((date) => {
    if (!calendar?.posts) return [];
    return calendar.posts.filter(post => {
      const postDate = new Date(post.scheduledDate || post.date);
      return isSameDay(postDate, date);
    });
  }, [calendar]);

  // Find post index in original array
  const findPostIndex = useCallback((post) => {
    if (!calendar?.posts || !post) return -1;
    return calendar.posts.findIndex(p => p.id === post.id);
  }, [calendar]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle post click
  const handlePostClick = (post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  // Handle add new post
  const handleAddPost = (date) => {
    setEditingPost(null);
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  // Handle save post
  const handleSavePost = async (formData) => {
    setIsSaving(true);

    try {
      if (editingPost) {
        // Update existing post
        const postIndex = findPostIndex(editingPost);
        if (postIndex >= 0) {
          await api.updatePost(calendarId, postIndex, formData);

          const updatedCalendar = {
            ...calendar,
            posts: calendar.posts.map((p, idx) =>
              idx === postIndex ? { ...p, ...formData } : p
            ),
          };
          updateCalendar(updatedCalendar);
        }
      } else {
        // Create new post (TODO: implement API for creating posts)
        console.log('Creating new post:', formData);
      }

      setIsFormOpen(false);
      setEditingPost(null);
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  // Close detail panel
  const handleCloseDetail = () => {
    setSelectedDate(null);
  };

  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  // Handle month change from mini calendar
  const handleMonthChange = (year, month) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  // Session error state
  if (!founderId && !sessionId && !isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#dccaf4] max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Session Error</h2>
          <p className="text-gray-500 mb-6">
            {error || 'Unable to load your session. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#40086d] text-white font-medium hover:bg-[#1a0530] transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Loading states
  if (isLoadingSession || isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#40086d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">
            {isLoadingSession ? 'Loading your session...' : 'Loading calendar...'}
          </p>
        </div>
      </div>
    );
  }

  // No calendar - show generate button
  if (!calendar) {
    return (
      <PageTransition className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <div className="max-w-lg text-center p-8">
          <div className="w-24 h-24 bg-[#ede0f8] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-[#40086d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#1e1e1e] mb-4">
            Generate Your Content Calendar
          </h1>
          <p className="text-gray-500 mb-8">
            Based on your brand profile and content strategy, Marnee will create a personalized
            content calendar with hooks, angles, and CTAs for each post.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => handleGenerateCalendar(4)}
            disabled={isGenerating}
            className="px-10 py-4 rounded-xl bg-[#40086d] text-white font-semibold text-lg hover:bg-[#1a0530] transition disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate 4-Week Calendar'
            )}
          </button>

          <div className="flex justify-center gap-3 mt-6">
            {[2, 8].map((weeks) => (
              <button
                key={weeks}
                onClick={() => handleGenerateCalendar(weeks)}
                disabled={isGenerating}
                className="px-5 py-2 rounded-lg border border-[#dccaf4] text-sm text-gray-600 hover:bg-[#ede0f8] transition"
              >
                {weeks} weeks
              </button>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  // Main calendar layout
  return (
    <PageTransition className="h-screen bg-[#f6f6f6] flex overflow-hidden">
      {/* Left Sidebar - Mini Calendar */}
      <aside className="w-72 bg-white border-r border-[#dccaf4]/50 p-5 flex flex-col overflow-y-auto shrink-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1e1e1e]">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {calendar.totalPosts || calendar.posts?.length || 0} posts scheduled
          </p>
        </div>

        {/* Mini Calendar */}
        <MiniCalendar
          posts={calendar.posts || []}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onMonthChange={handleMonthChange}
        />

        {/* Next Tasks - uses already loaded posts, no additional API calls */}
        <div className="border-t border-[#dccaf4]/50 mt-4">
          <NextTasks
            posts={calendar.posts || []}
            onTaskClick={handlePostClick}
            maxItems={5}
          />
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-[#dccaf4]/50">
          <button
            onClick={() => handleGenerateCalendar(4)}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl border border-[#dccaf4] text-sm font-medium text-gray-600 hover:bg-[#ede0f8] hover:text-[#40086d] transition disabled:opacity-50"
          >
            {isGenerating ? 'Regenerating...' : 'Regenerate Calendar'}
          </button>
        </div>
      </aside>

      {/* Main Calendar Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <MainCalendar
          posts={calendar.posts || []}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onPostClick={handlePostClick}
          initialDate={new Date(currentYear, currentMonth, 1)}
        />
      </main>

      {/* Right Panel - Day Detail */}
      <AnimatePresence>
        {selectedDate && (
          <DayDetailPanel
            date={selectedDate}
            posts={getPostsForDate(selectedDate)}
            onClose={handleCloseDetail}
            onPostClick={handlePostClick}
            onAddPost={handleAddPost}
          />
        )}
      </AnimatePresence>

      {/* Post Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <PostFormModal
            post={editingPost}
            date={selectedDate}
            onSave={handleSavePost}
            onClose={handleCloseForm}
            isLoading={isSaving}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
