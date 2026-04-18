import React, { useState } from "react";
import { useCampaigns } from "../../../hooks/useCampaigns";

export default function CampaignsSection({ calendarId, founderId, sessionId }) {
  const [filter, setFilter] = useState("active");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [notes, setNotes] = useState({});

  const {
    campaigns,
    loading,
    error,
    generating,
    generateCampaigns,
    updateCampaign,
    updateTask,
  } = useCampaigns(calendarId, founderId, sessionId);

  const statusStyles = {
    "in_progress": "bg-[#ede0f8] text-[#40086d]",
    "idea": "bg-[#ede0f8] text-[#40086d]",
    "scheduled": "bg-cyan-50 text-cyan-600",
    "published": "bg-green-50 text-green-600",
  };

  const statusLabels = {
    "in_progress": "In Progress",
    "idea": "Idea",
    "scheduled": "Scheduled",
    "published": "Published",
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (filter === "ai") return c.aiGenerated;
    if (filter === "manual") return !c.aiGenerated;
    if (filter === "completed") return c.status === "published";
    return c.status !== "published"; // active
  });

  const handleGenerateCampaigns = async () => {
    try {
      await generateCampaigns(3);
    } catch (err) {
      console.error("Failed to generate campaigns:", err);
    }
  };

  const handleTaskToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleNotesBlur = async (campaignId) => {
    const noteText = notes[campaignId];
    if (noteText !== undefined) {
      try {
        await updateCampaign(campaignId, { notes: noteText });
      } catch (err) {
        console.error("Failed to update notes:", err);
      }
    }
  };

  const handleNotesChange = (campaignId, value) => {
    setNotes((prev) => ({ ...prev, [campaignId]: value }));
  };

  const selectedCampaignData = campaigns.find((c) => c.id === selectedCampaign);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Campaign Management</h1>
          <p className="text-sm text-gray-500">
            Track and manage your social media campaigns with AI-powered insights
          </p>
        </div>
        <button
          onClick={handleGenerateCampaigns}
          disabled={generating || !calendarId || !founderId}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {[
          { id: "active", label: "Active" },
          { id: "completed", label: "Completed" },
          { id: "ai", label: "AI-Supported Only" },
          { id: "manual", label: "Manual Only" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f.id
                ? "bg-[#ede0f8] text-[#40086d] border border-violet-200"
                : "bg-white border border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading campaigns...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCampaigns.length === 0 && (
        <div className="text-center py-12 bg-white border border-[rgba(30,30,30,0.1)] rounded">
          <p className="text-gray-500 mb-4">No campaigns found</p>
          {calendarId && founderId && (
            <button
              onClick={handleGenerateCampaigns}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-[#40086d] text-white text-sm font-medium hover:bg-[#300651] transition"
            >
              {generating ? "Generating..." : "Generate Campaigns with AI"}
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredCampaigns.length > 0 && (
        <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded overflow-hidden shadow-sm">
          <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs uppercase text-gray-500 tracking-wide bg-[#f6f6f6] border-b border-[rgba(30,30,30,0.1)]">
            <div className="col-span-2">Campaign Name</div>
            <div>Platform</div>
            <div>Inspiration</div>
            <div>Status</div>
            <div>Scripts</div>
            <div>Clips</div>
            <div>Action</div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredCampaigns.map((c) => (
              <div key={c.id}>
                <div
                  className={`grid grid-cols-8 gap-4 px-6 py-4 items-center cursor-pointer transition ${
                    selectedCampaign === c.id ? "bg-[#ede0f8]" : "hover:bg-[#f6f6f6]"
                  }`}
                  onClick={() => setSelectedCampaign(c.id)}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    {c.aiGenerated && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white">
                        AI
                      </span>
                    )}
                    <p className="font-medium text-gray-900">{c.name}</p>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                      {c.platform || "N/A"}
                    </span>
                  </div>
                  <div>
                    {c.inspirationUrl ? (
                      <a
                        href={c.inspirationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#40086d] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        statusStyles[c.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabels[c.status] || c.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{c.scriptsCount || 0}</div>
                  <div>
                    <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-600 text-xs">
                      Coming Soon
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCampaign(selectedCampaign === c.id ? null : c.id);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#1e1e1e] text-white text-xs font-medium hover:bg-[#dccaf4] hover:text-[#1a0530] transition"
                    >
                      {selectedCampaign === c.id ? "Close" : "Open Campaign"}
                    </button>
                  </div>
                </div>

                {selectedCampaign === c.id && selectedCampaignData && (
                  <div className="px-6 pb-6 pt-2 bg-[#ede0f8]/30">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Task Progress */}
                      <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                          Task Progress
                        </h2>
                        <div className="space-y-3 text-sm">
                          {selectedCampaignData.tasks && selectedCampaignData.tasks.length > 0 ? (
                            selectedCampaignData.tasks.map((task) => (
                              <label key={task.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={task.status === "completed"}
                                  onChange={() => handleTaskToggle(task.id, task.status)}
                                  className="accent-[#40086d] rounded"
                                />
                                <span
                                  className={
                                    task.status === "completed"
                                      ? "line-through text-gray-400"
                                      : "text-gray-700"
                                  }
                                >
                                  {task.title}
                                </span>
                              </label>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm">No tasks yet</p>
                          )}
                        </div>
                      </div>

                      {/* AI Suggestions */}
                      <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">
                          AI Suggestions
                        </h2>
                        <div className="space-y-3 text-sm">
                          {selectedCampaignData.aiSuggestions?.suggestedHook && (
                            <div className="bg-[#ede0f8] rounded p-3">
                              <p className="text-xs text-[#40086d] mb-1 font-medium">
                                SUGGESTED HOOK
                              </p>
                              <p className="text-gray-700">
                                {selectedCampaignData.aiSuggestions.suggestedHook}
                              </p>
                            </div>
                          )}
                          {selectedCampaignData.aiSuggestions?.trendingFormat && (
                            <div className="bg-cyan-50 rounded p-3">
                              <p className="text-xs text-cyan-500 mb-1 font-medium">
                                TRENDING FORMAT
                              </p>
                              <p className="text-gray-700">
                                {selectedCampaignData.aiSuggestions.trendingFormat}
                              </p>
                            </div>
                          )}
                          {selectedCampaignData.aiSuggestions?.optimalTiming && (
                            <div className="bg-blue-50 rounded p-3">
                              <p className="text-xs text-blue-500 mb-1 font-medium">
                                OPTIMAL TIMING
                              </p>
                              <p className="text-gray-700">
                                {selectedCampaignData.aiSuggestions.optimalTiming}
                              </p>
                            </div>
                          )}
                          {selectedCampaignData.aiSuggestions?.additionalTips &&
                            selectedCampaignData.aiSuggestions.additionalTips.length > 0 && (
                              <div className="bg-green-50 rounded p-3">
                                <p className="text-xs text-green-600 mb-1 font-medium">
                                  ADDITIONAL TIPS
                                </p>
                                <ul className="text-gray-700 list-disc list-inside space-y-1">
                                  {selectedCampaignData.aiSuggestions.additionalTips.map(
                                    (tip, idx) => (
                                      <li key={idx}>{tip}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          {!selectedCampaignData.aiSuggestions?.suggestedHook &&
                            !selectedCampaignData.aiSuggestions?.trendingFormat && (
                              <p className="text-gray-400 text-sm">No AI suggestions yet</p>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Upload area */}
                    <div className="mt-4">
                      <div className="border-2 border-dashed border-[rgba(30,30,30,0.1)] rounded bg-white py-8 text-center">
                        <div className="mx-auto mb-2 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold">
                          UP
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Drag and drop your clips here
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">(Coming Soon)</p>
                      </div>
                    </div>

                    {/* Campaign Notes */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Campaign Notes
                      </h3>
                      <textarea
                        className="w-full min-h-[90px] rounded border border-[rgba(30,30,30,0.1)] bg-white p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-200"
                        value={
                          notes[c.id] !== undefined
                            ? notes[c.id]
                            : selectedCampaignData.notes || ""
                        }
                        onChange={(e) => handleNotesChange(c.id, e.target.value)}
                        onBlur={() => handleNotesBlur(c.id)}
                        placeholder="Add notes about this campaign..."
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
