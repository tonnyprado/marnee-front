import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import CalendarView from "./Calendar/CalendarView";
import CalendarListView from "./Calendar/CalendarListView";
import CampaignForm from "./Calendar/CampaignForm";
import BrainstormingSection from "./Calendar/BrainstormingSection";
import LanguageSwitcher from "../../Component/LanguageSwitcher";

export default function CalendarPage() {
  const {
    founderId,
    sessionId,
    calendarId,
    calendar: cachedCalendar,
    currentStep,
    setCalendarId,
    setCalendar: setCachedCalendar,
    hasSession
  } = useMarnee();
  const canAccessCalendar = Boolean(calendarId || founderId || hasSession);

  const [mainTab, setMainTab] = useState("calendar"); // calendar | brainstorming
  const [view, setView] = useState("calendar");
  const [statusFilter, setStatusFilter] = useState("all");
  const [calendar, setCalendar] = useState(cachedCalendar); // Initialize from cached calendar
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCheckedHistory, setHasCheckedHistory] = useState(false);
  const [error, setError] = useState(null);
  const autoGenerateAttemptedRef = useRef(false);

  // Form state
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Helper to update both local state and cached calendar in context
  const updateCalendar = useCallback((newCalendar) => {
    setCalendar(newCalendar);
    setCachedCalendar(newCalendar);
  }, [setCachedCalendar]);

  const handleGenerateCalendar = async (weeks = 4) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('[CalendarPage] Generating calendar with:', { founderId, sessionId, weeks });
      const response = await api.generateCalendar({
        founderId,
        sessionId,
        weeks,
      });

      console.log('[CalendarPage] Calendar generated successfully:', {
        calendarId: response.calendarId,
        postsCount: response.calendar?.posts?.length || 0,
        startDate: response.calendar?.startDate,
        endDate: response.calendar?.endDate,
      });

      setCalendarId(response.calendarId);
      updateCalendar(response.calendar);
    } catch (err) {
      console.error('[CalendarPage] Failed to generate calendar:', err);
      setError(err.message || 'Failed to generate calendar');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load existing calendar when backend already created one
  useEffect(() => {
    console.log('[CalendarPage] useEffect triggered - checking calendar access:', {
      canAccessCalendar,
      calendarId,
      founderId,
      sessionId,
      hasSession,
    });

    if (!canAccessCalendar) {
      console.log('[CalendarPage] No access to calendar - user needs to complete business test');
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
      console.log('[CalendarPage] Loading calendar with context:', {
        calendarId,
        founderId,
        sessionId,
        hasCalendarId: !!calendarId,
        hasFounderId: !!founderId,
        hasSessionId: !!sessionId,
        hasCachedCalendar: !!cachedCalendar,
      });

      // If we have a cached calendar and it matches the current calendarId, use it immediately
      if (cachedCalendar && cachedCalendar.posts && cachedCalendar.posts.length > 0) {
        console.log('[CalendarPage] Using cached calendar from localStorage:', {
          postsCount: cachedCalendar.posts.length,
          startDate: cachedCalendar.startDate,
          endDate: cachedCalendar.endDate,
        });
        setCalendar(cachedCalendar);
        setIsLoading(false);
        setHasCheckedHistory(true);

        // Still fetch from backend in background to ensure we have latest data
        if (calendarId) {
          console.log('[CalendarPage] Fetching latest calendar from backend in background...');
          try {
            const data = await api.getCalendar(calendarId);
            const freshCalendar = data.calendar || data;
            console.log('[CalendarPage] Background refresh complete:', {
              postsCount: freshCalendar?.posts?.length || 0,
            });
            updateCalendar(freshCalendar);
          } catch (bgErr) {
            console.warn('[CalendarPage] Background refresh failed, using cached version:', bgErr.message);
          }
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (calendarId) {
          console.log('[CalendarPage] Fetching calendar by ID:', calendarId);
          const data = await api.getCalendar(calendarId);
          console.log('[CalendarPage] Calendar loaded by ID:', {
            hasCalendar: !!data,
            postsCount: data?.posts?.length || data?.calendar?.posts?.length || 0,
          });
          updateCalendar(data.calendar || data);
          return;
        }

        console.log('[CalendarPage] No calendarId in context, fetching latest calendar...');
        let latestCalendar = null;

        try {
          console.log('[CalendarPage] Trying api.getMyLatestCalendar...');
          latestCalendar = await api.getMyLatestCalendar({
            founderId,
            sessionId,
          });
          console.log('[CalendarPage] getMyLatestCalendar response:', latestCalendar);
        } catch (latestError) {
          console.warn('[CalendarPage] getMyLatestCalendar failed:', latestError.message);
          if (founderId) {
            console.log('[CalendarPage] Trying api.getLatestCalendarByFounder...');
            latestCalendar = await api.getLatestCalendarByFounder(founderId, sessionId);
            console.log('[CalendarPage] getLatestCalendarByFounder response:', latestCalendar);
          }
        }

        const latestCalendarId = getCalendarIdFromResponse(latestCalendar);
        console.log('[CalendarPage] Latest calendar ID extracted:', latestCalendarId);

        if (latestCalendarId) {
          setCalendarId(latestCalendarId);
          const hydratedCalendar = getCalendarFromResponse(latestCalendar);
          console.log('[CalendarPage] Calendar extracted from response:', {
            hasCalendar: !!hydratedCalendar,
            postsCount: hydratedCalendar?.posts?.length || 0,
          });
          if (hydratedCalendar) {
            updateCalendar(hydratedCalendar);
          }
        } else {
          console.log('[CalendarPage] No calendar found, showing generate button');
          updateCalendar(null);
        }
      } catch (err) {
        console.error('[CalendarPage] Error loading calendar:', err);
        updateCalendar(null);
      } finally {
        setIsLoading(false);
        setHasCheckedHistory(true);
      }
    };

    loadCalendar();
  }, [calendarId, canAccessCalendar, founderId, sessionId, setCalendarId, updateCalendar, cachedCalendar, hasSession]);

  // If the conversation is already in the calendar phase but no calendar exists yet,
  // generate it directly in the calendar workspace instead of leaving the user in chat text.
  useEffect(() => {
    if (
      !canAccessCalendar ||
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
    const autoGenerateCalendar = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await api.generateCalendar({
          founderId,
          sessionId,
          weeks: 4,
        });

        setCalendarId(response.calendarId);
        updateCalendar(response.calendar);
      } catch (err) {
        setError(err.message || "Failed to generate calendar");
      } finally {
        setIsGenerating(false);
      }
    };

    autoGenerateCalendar();
  }, [calendar, calendarId, canAccessCalendar, currentStep, founderId, hasCheckedHistory, isGenerating, isLoading, sessionId, setCalendarId, updateCalendar]);

  // Handle post click
  const handlePostClick = (post, index) => {
    setSelectedPost(post);
    setSelectedPostIndex(index);
    setIsFormOpen(true);
  };

  // Handle post update
  const handleSavePost = async (updatedData) => {
    if (selectedPostIndex === null) return;

    try {
      await api.updatePost(calendarId, selectedPostIndex, updatedData);

      const updatedCalendar = {
        ...calendar,
        posts: calendar.posts.map((p, idx) =>
          idx === selectedPostIndex ? { ...p, ...updatedData } : p
        ),
      };
      updateCalendar(updatedCalendar);

      setIsFormOpen(false);
      setSelectedPost(null);
      setSelectedPostIndex(null);
    } catch (err) {
      setError(err.message || 'Failed to update post');
    }
  };

  // Filter posts by status
  const filteredPosts = calendar?.posts
    ? statusFilter === "all"
      ? calendar.posts
      : calendar.posts.filter((p) => p.status === statusFilter)
    : [];

  // Show message if no business test completed
  if (!canAccessCalendar) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] text-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded shadow-sm border border-[rgba(30,30,30,0.1)] max-w-md">
          <div className="w-16 h-16 bg-[#ede0f8] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#40086d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Complete Your Business Test First</h2>
          <p className="text-gray-500 mb-6">
            To access the content calendar, you need to complete the business test. This helps Marnee understand your business and create personalized content strategies.
          </p>
          <a
            href="/business-test/questions"
            className="px-6 py-3 rounded bg-[#1e1e1e] text-white font-medium hover:bg-[#dccaf4] hover:text-[#1a0530] transition inline-block shadow-sm"
          >
            Start Business Test
          </a>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // No calendar yet - show generate button
  if (!calendar) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] text-gray-900 p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-[#ede0f8] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#40086d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Generate Your Content Calendar</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Based on your brand profile and content strategy, Marnee will create a personalized
            content calendar with hooks, angles, and CTAs for each post.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => handleGenerateCalendar(4)}
              disabled={isGenerating}
              className="px-8 py-4 rounded bg-[#1e1e1e] text-white font-medium text-lg hover:bg-[#dccaf4] hover:text-[#1a0530] transition disabled:opacity-50 shadow-sm"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                'Generate 4-Week Calendar'
              )}
            </button>

            <div className="flex gap-2 text-sm text-gray-500">
              <button
                onClick={() => handleGenerateCalendar(2)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg border border-[rgba(30,30,30,0.1)] hover:bg-gray-100 transition"
              >
                2 weeks
              </button>
              <button
                onClick={() => handleGenerateCalendar(8)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg border border-[rgba(30,30,30,0.1)] hover:bg-gray-100 transition"
              >
                8 weeks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-[rgba(30,30,30,0.1)] shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Content Calendar</h1>
              {calendar && (
                <p className="text-sm text-gray-500">
                  {calendar.totalPosts} posts from {calendar.startDate} to {calendar.endDate}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher className="border-[rgba(30,30,30,0.1)] bg-white shadow-sm" />

              {/* Regenerate button - only show on calendar tab */}
              {mainTab === "calendar" && calendar && (
                <button
                  onClick={() => handleGenerateCalendar(4)}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded border border-[rgba(30,30,30,0.1)] text-sm hover:bg-[#f6f6f6] transition disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
              )}

              {/* View toggle - only show on calendar tab */}
              {mainTab === "calendar" && calendar && (
                <div className="flex bg-[#f6f6f6] rounded-full overflow-hidden p-1">
                  <button
                    onClick={() => setView("calendar")}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      view === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    Calendar
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    List
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Tabs */}
          <div className="flex items-center gap-2 border-b border-[rgba(30,30,30,0.1)] -mb-[1px]">
            <button
              onClick={() => setMainTab("calendar")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                mainTab === "calendar"
                  ? "border-[#40086d] text-[#40086d]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setMainTab("brainstorming")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                mainTab === "brainstorming"
                  ? "border-[#40086d] text-[#40086d]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Brainstorming
            </button>
          </div>
        </div>
      </div>

      {/* Main content container with padding */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Main content */}
        {mainTab === "calendar" ? (
          <div className="relative flex gap-4">
            <div className={`flex-1 ${isFormOpen ? "mr-96" : ""}`}>
              {view === "calendar" ? (
                <CalendarView
                  posts={filteredPosts}
                  calendar={calendar}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onPostClick={handlePostClick}
                />
              ) : (
                <CalendarListView
                  posts={filteredPosts}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onPostClick={handlePostClick}
                />
              )}
            </div>

            {/* Side panel */}
            {isFormOpen && selectedPost && (
              <CampaignForm
                post={selectedPost}
                postIndex={selectedPostIndex}
                onClose={() => {
                  setIsFormOpen(false);
                  setSelectedPost(null);
                  setSelectedPostIndex(null);
                }}
                onSave={handleSavePost}
              />
            )}
          </div>
        ) : (
          <BrainstormingSection calendarId={calendarId} />
        )}
      </div>
    </div>
  );
}
