import React, { useState, useEffect, useCallback } from "react";
import API from "../../../config";
import apiClient from "../../../core/services/ApiClient";
import { useAuth } from "../../../context/AuthContext";

export default function OptimalTimeSuggestions({ platform, onSelectTime, currentTime }) {
  const { founderId } = useAuth();
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptimalTimes = useCallback(async () => {
    if (!platform) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        `/calendar/optimal-times/${founderId}?platform=${encodeURIComponent(platform)}`,
        { baseUrl: API.MARNEE }
      );

      if (response.success) {
        setSuggestions(response);
      }
    } catch (err) {
      console.error("Error fetching optimal times:", err);
      setError("Failed to load optimal times");
    } finally {
      setIsLoading(false);
    }
  }, [platform, founderId]);

  useEffect(() => {
    if (platform && founderId && isExpanded) {
      fetchOptimalTimes();
    }
  }, [platform, founderId, isExpanded, fetchOptimalTimes]);

  const formatTime = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  const getSourceColor = (source) => {
    switch (source) {
      case "analytics":
        return "text-green-700 bg-green-100";
      case "hybrid":
        return "text-blue-700 bg-blue-100";
      case "general":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "analytics":
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "hybrid":
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!platform) {
    return (
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">Select a platform to see optimal posting times</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-violet-900">
            {isExpanded ? "Hide" : "Show"} Optimal Times for {platform}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-violet-600 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-white border border-[rgba(30,30,30,0.1)] rounded-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 text-center py-4">{error}</div>
          ) : suggestions && suggestions.recommended ? (
            <>
              {/* Source Badge */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getSourceColor(suggestions.source)}`}>
                  {getSourceIcon(suggestions.source)}
                  {suggestions.source === "analytics" ? "Your Analytics" : suggestions.source === "hybrid" ? "Hybrid Data" : "Industry Best Practices"}
                </span>
                {suggestions.audienceInsights && (
                  <span className="text-xs text-gray-500">
                    {suggestions.audienceInsights.dataPoints > 0
                      ? `${suggestions.audienceInsights.dataPoints} posts analyzed`
                      : "No data yet"}
                  </span>
                )}
              </div>

              {/* Insights Message */}
              {suggestions.audienceInsights && (
                <p className="text-xs text-gray-600 mb-3 italic">
                  {suggestions.audienceInsights.message}
                </p>
              )}

              {/* Time Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Recommended Times:</p>
                {suggestions.recommended.slice(0, 5).map((timeSlot, idx) => {
                  const timeValue = `${String(timeSlot.hour).padStart(2, "0")}:00`;
                  const isSelected = currentTime === timeValue;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectTime(timeValue)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                        isSelected
                          ? "bg-violet-100 border-violet-400"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">{timeSlot.day}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{formatTime(timeSlot.hour)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-violet-600"
                              style={{ width: `${timeSlot.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{Math.round(timeSlot.score)}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Note */}
              <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                <strong>Tip:</strong> {suggestions.source === "general"
                  ? "Connect your social media accounts to get personalized times based on your audience."
                  : "Times are ranked by historical engagement. Click to select."}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">No suggestions available</p>
          )}
        </div>
      )}
    </div>
  );
}
