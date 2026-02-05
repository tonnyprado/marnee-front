import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import CalendarView from "./Calendar/CalendarView";
import CalendarListView from "./Calendar/CalendarListView";
import CampaignForm from "./Calendar/CampaignForm";

export default function CalendarPage() {
  const { founderId, sessionId, calendarId, setCalendarId, hasSession } = useMarnee();

  const [view, setView] = useState("calendar");
  const [statusFilter, setStatusFilter] = useState("all");
  const [calendar, setCalendar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load or generate calendar
  useEffect(() => {
    if (!hasSession) {
      setIsLoading(false);
      return;
    }

    const loadCalendar = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (calendarId) {
          const data = await api.getCalendar(calendarId);
          setCalendar(data.calendar || data);
        }
      } catch (err) {
        console.log('No existing calendar found');
        setCalendarId(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendar();
  }, [calendarId, hasSession, setCalendarId]);

  // Generate new calendar
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
      setCalendar(response.calendar);
    } catch (err) {
      setError(err.message || 'Failed to generate calendar');
    } finally {
      setIsGenerating(false);
    }
  };

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

      setCalendar((prev) => ({
        ...prev,
        posts: prev.posts.map((p, idx) =>
          idx === selectedPostIndex ? { ...p, ...updatedData } : p
        ),
      }));

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

  // Show message if no session
  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Complete Your Brand Test First</h2>
          <p className="text-gray-500 mb-6">
            To access the content calendar, you need to complete the brand personality test.
          </p>
          <a
            href="/brand-test/questions"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:from-purple-700 hover:to-pink-600 transition inline-block shadow-lg shadow-purple-500/25"
          >
            Start Brand Test
          </a>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // No calendar yet - show generate button
  if (!calendar) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Generate Your Content Calendar</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Based on your brand profile and content strategy, Marnee will create a personalized
            content calendar with hooks, angles, and CTAs for each post.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => handleGenerateCalendar(4)}
              disabled={isGenerating}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium text-lg hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50 shadow-lg shadow-purple-500/25"
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
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                2 weeks
              </button>
              <button
                onClick={() => handleGenerateCalendar(8)}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-sm text-gray-500">
            {calendar.totalPosts} posts from {calendar.startDate} to {calendar.endDate}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Regenerate button */}
          <button
            onClick={() => handleGenerateCalendar(4)}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-100 transition disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>

          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-full overflow-hidden p-1">
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
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main content */}
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
    </div>
  );
}
