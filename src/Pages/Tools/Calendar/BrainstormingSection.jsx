import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const STATUS_COLORS = {
  idea: "bg-gray-100 text-gray-700 border-gray-300",
  approved: "bg-green-100 text-green-700 border-green-300",
  converted_to_task: "bg-blue-100 text-blue-700 border-blue-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
};

const PLATFORMS = ["TikTok", "Instagram", "LinkedIn", "YouTube", "Twitter/X", "Facebook", "Pinterest"];

export default function BrainstormingSection({ calendarId }) {
  const { founderId } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("idea");

  const [form, setForm] = useState({
    title: "",
    description: "",
    platform: "",
    tags: [],
    notes: "",
  });

  const loadIdeas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getBrainstormingIdeas(founderId, calendarId);
      setIdeas(data.ideas || []);
    } catch (err) {
      console.error("Failed to load brainstorming ideas:", err);
    } finally {
      setIsLoading(false);
    }
  }, [founderId, calendarId]);

  useEffect(() => {
    if (founderId) {
      loadIdeas();
    }
  }, [founderId, loadIdeas]);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      platform: "",
      tags: [],
      notes: "",
    });
    setEditingIdea(null);
    setIsFormOpen(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (idea) => {
    setForm({
      title: idea.title || "",
      description: idea.description || "",
      platform: idea.platform || "",
      tags: idea.tags || [],
      notes: idea.notes || "",
    });
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        founderId,
        calendarId,
      };

      if (editingIdea) {
        await api.updateBrainstormingIdea(editingIdea.id, data);
      } else {
        await api.createBrainstormingIdea(data);
      }

      await loadIdeas();
      resetForm();
    } catch (err) {
      console.error("Failed to save idea:", err);
      alert("Failed to save idea. Please try again.");
    }
  };

  const handleDelete = async (ideaId) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      await api.deleteBrainstormingIdea(ideaId);
      await loadIdeas();
    } catch (err) {
      console.error("Failed to delete idea:", err);
      alert("Failed to delete idea. Please try again.");
    }
  };

  const handleUpdateStatus = async (ideaId, newStatus) => {
    try {
      await api.updateBrainstormingIdea(ideaId, { status: newStatus });
      await loadIdeas();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleConvertToTask = async (idea) => {
    // This would open a modal or redirect to create a calendar post
    // For now, just show an alert
    alert("Convert to Task feature - Coming soon!\n\nThis will create a calendar post from this idea.");
    // TODO: Implement conversion logic
    // const postData = {
    //   title: idea.title,
    //   platform: idea.platform,
    //   // ... map other fields
    // };
    // await api.convertIdeaToTask(idea.id, { calendarId, postData });
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!form.tags.includes(newTag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = "";
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const filteredIdeas =
    statusFilter === "all"
      ? ideas
      : ideas.filter((idea) => idea.status === statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Brainstorming Ideas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Capture content ideas before converting them to calendar tasks
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2 rounded-lg bg-[#1e1e1e] text-white font-medium text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition shadow-sm"
        >
          + New Idea
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Filter by:</span>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All" },
            { value: "idea", label: "Ideas" },
            { value: "approved", label: "Approved" },
            { value: "converted_to_task", label: "Converted" },
            { value: "rejected", label: "Rejected" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                statusFilter === filter.value
                  ? "bg-[#ede0f8] text-[#40086d] border-violet-300 font-medium"
                  : "bg-white border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded border border-[rgba(30,30,30,0.1)]">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No ideas yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start brainstorming content ideas to organize your creative process
          </p>
          <button
            onClick={handleOpenNew}
            className="px-6 py-2.5 rounded-lg bg-[#1e1e1e] text-white font-medium hover:bg-[#dccaf4] hover:text-[#1a0530] transition shadow-sm"
          >
            Create Your First Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 hover:shadow-md transition"
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${
                    STATUS_COLORS[idea.status] || STATUS_COLORS.idea
                  }`}
                >
                  {idea.status === "converted_to_task"
                    ? "Converted"
                    : idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(idea)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2">
                {idea.title || "Untitled Idea"}
              </h3>

              {/* Description */}
              {idea.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {idea.description}
                </p>
              )}

              {/* Platform */}
              {idea.platform && (
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{idea.platform}</span>
                </div>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {idea.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-[rgba(30,30,30,0.1)] space-y-2">
                {idea.status === "idea" && (
                  <button
                    onClick={() => handleUpdateStatus(idea.id, "approved")}
                    className="w-full px-3 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition"
                  >
                    Approve
                  </button>
                )}
                {idea.status === "approved" && (
                  <button
                    onClick={() => handleConvertToTask(idea)}
                    className="w-full px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition"
                  >
                    Convert to Task
                  </button>
                )}
                {idea.status === "idea" && (
                  <button
                    onClick={() => handleUpdateStatus(idea.id, "rejected")}
                    className="w-full px-3 py-2 rounded-lg border border-[rgba(30,30,30,0.1)] text-gray-600 text-sm hover:bg-[#f6f6f6] transition"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(30,30,30,0.1)]">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingIdea ? "Edit Idea" : "New Brainstorming Idea"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Quick title for this idea..."
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Describe the content idea..."
                  rows={4}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
                />
              </div>

              {/* Platform */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Platform
                </label>
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, platform: e.target.value }))
                  }
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                >
                  <option value="">Select platform...</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter..."
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[rgba(30,30,30,0.1)] flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg bg-[#1e1e1e] text-white font-semibold text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition shadow-sm"
              >
                {editingIdea ? "Save Changes" : "Create Idea"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
