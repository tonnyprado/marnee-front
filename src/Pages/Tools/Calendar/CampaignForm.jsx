import React, { useState, useEffect } from "react";
import CommentsSection from "./CommentsSection";
import ImageGeneratorButton from "../../../Component/ImageGenerator/ImageGeneratorButton";
import ImagePreviewModal from "../../../Component/ImageGenerator/ImagePreviewModal";
import useImageGenerator from "../../../hooks/useImageGenerator";
import { useAuth } from "../../../context/AuthContext";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", color: "gray" },
  { value: "in_progress", label: "In Progress", color: "blue" },
  { value: "done", label: "Done", color: "green" },
  { value: "skipped", label: "Skipped", color: "gray" },
];

const TASK_TYPES = [
  { value: "content", label: "Content Task" },
  { value: "marketing", label: "Marketing Task" },
];

const PLATFORMS = [
  "TikTok",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Twitter/X",
  "Facebook",
  "Pinterest",
];

const ASSET_TYPES = ["Video", "Text", "Carousel", "Image", "Other"];

const CONTENT_TYPES = [
  { value: "Viral", label: "Viral (Top Funnel)", desc: "Awareness content" },
  { value: "Educational", label: "Educational (Mid Funnel)", desc: "Value & education" },
  { value: "Authority", label: "Authority (Bottom Funnel)", desc: "Credibility & conversion" },
];

const EFFORT_LEVELS = ["Low", "Medium", "High"];

const GOALS = ["Awareness", "Leads", "Sales"];

const FEEDBACK_TYPES = [
  { value: "Repeat", label: "Repeat", desc: "This worked well" },
  { value: "Iterate", label: "Iterate", desc: "Needs adjustments" },
  { value: "Drop", label: "Drop", desc: "Not worth continuing" },
];

const FORMAT_OPTIONS = [
  "talking head",
  "voiceover",
  "carousel",
  "reel",
  "story",
  "static post",
  "live",
  "tutorial",
  "behind-the-scenes",
];

export default function CampaignForm({
  post,
  postIndex,
  onClose,
  onSave,
}) {
  const { founderId } = useAuth();
  const [form, setForm] = useState({
    // ID
    id: null,
    // Basic Information
    title: "",
    taskType: "content",
    platform: "",
    assetType: "",
    contentType: "",
    effortLevel: "",
    // Scheduling (read-only)
    // Strategic Context
    goal: "",
    reason: "",
    basedOn: "",
    pillar: "",
    // Content Structure
    hook: "",
    body: "",
    angle: "",
    cta: "",
    // Execution Details
    format: "",
    assets: [],
    // Status & Tracking
    status: "todo",
    // Feedback
    feedbackType: "",
    notes: "",
    // Generated Image
    generatedImageSvg: null,
    hasGeneratedImage: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // details | comments

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [loadedImage, setLoadedImage] = useState(null);
  const { fetchGeneratedImage, isGenerating } = useImageGenerator();

  useEffect(() => {
    if (post) {
      setForm({
        // ID
        id: post.id || null,
        // Basic Information
        title: post.title || "",
        taskType: post.taskType || "content",
        platform: post.platform || "",
        assetType: post.assetType || "",
        contentType: post.contentType || "",
        effortLevel: post.effortLevel || "",
        // Strategic Context
        goal: post.goal || "",
        reason: post.reason || "",
        basedOn: post.basedOn || "",
        pillar: post.pillar || "",
        // Content Structure
        hook: post.hook || "",
        body: post.body || "",
        angle: post.angle || "",
        cta: post.cta || "",
        // Execution Details
        format: post.format || "",
        assets: post.assets || [],
        // Status & Tracking
        status: post.status || "todo",
        // Feedback
        feedbackType: post.feedbackType || "",
        notes: post.notes || "",
        // Generated Image
        generatedImageSvg: post.generatedImageSvg || null,
        hasGeneratedImage: Boolean(post.generatedImageSvg),
      });
    }
  }, [post]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditImage = async () => {
    if (!form.id) {
      console.error('Cannot edit image: post ID is missing');
      return;
    }

    try {
      // Fetch the saved image from the database
      const imageData = await fetchGeneratedImage(form.id);

      if (imageData) {
        setLoadedImage(imageData);
        setIsImageModalOpen(true);
      } else {
        console.warn('No saved image found for this post');
        // Optionally show a message to the user
      }
    } catch (error) {
      console.error('Failed to load saved image:', error);
      // Optionally show error to user
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[480px] bg-white text-gray-900 shadow-2xl flex flex-col z-50 border-l border-[rgba(30,30,30,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(30,30,30,0.1)] bg-[#f6f6f6]">
        <div>
          <p className="text-sm text-gray-500">{formatDate(post?.date)}</p>
          <h2 className="text-lg font-semibold">Edit Post</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(30,30,30,0.1)] px-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "details"
              ? "border-violet-500 text-[#40086d]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === "comments"
              ? "border-violet-500 text-[#40086d]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Comments
        </button>
      </div>

      {/* Form */}
      {activeTab === "details" ? (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* === BASIC INFORMATION === */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Basic Information
            </h3>

            {/* Title */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Clear summary of the content..."
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
              />
            </div>

            {/* Task Type & Platform */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Task Type</label>
                <select
                  value={form.taskType}
                  onChange={(e) => handleChange("taskType", e.target.value)}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                >
                  {TASK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => handleChange("platform", e.target.value)}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                >
                  <option value="">Select...</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Asset Type & Content Type */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Asset Type</label>
                <select
                  value={form.assetType}
                  onChange={(e) => handleChange("assetType", e.target.value)}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                >
                  <option value="">Select...</option>
                  {ASSET_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Content Type</label>
                <select
                  value={form.contentType}
                  onChange={(e) => handleChange("contentType", e.target.value)}
                  className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
                >
                  <option value="">Select...</option>
                  {CONTENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {form.contentType && (
                  <p className="text-xs text-gray-500 mt-1">
                    {CONTENT_TYPES.find((t) => t.value === form.contentType)?.desc}
                  </p>
                )}
              </div>
            </div>

            {/* Effort Level */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Effort Level</label>
              <div className="flex gap-2">
                {EFFORT_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange("effortLevel", level)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm border transition ${
                      form.effortLevel === level
                        ? "bg-[#ede0f8] text-[#40086d] border-violet-300 font-medium"
                        : "bg-white border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* === STRATEGIC CONTEXT === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Strategic Context
            </h3>

            {/* Goal */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Goal (Funnel Objective)</label>
              <div className="flex gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleChange("goal", goal)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm border transition ${
                      form.goal === goal
                        ? "bg-indigo-100 text-indigo-700 border-indigo-300 font-medium"
                        : "bg-white border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Pillar (read-only) */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Content Pillar</label>
              <div className="px-3 py-2 bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded-lg text-gray-700 text-sm">
                {form.pillar || "Not set"}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Reason <span className="text-gray-400 font-normal">(Why this content exists)</span>
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="Why are we creating this content?"
                rows={2}
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
              />
            </div>

            {/* Based On */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Based On <span className="text-gray-400 font-normal">(Trends, audience, strategy)</span>
              </label>
              <input
                type="text"
                value={form.basedOn}
                onChange={(e) => handleChange("basedOn", e.target.value)}
                placeholder="e.g., Trending topic in niche, audience behavior..."
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
              />
            </div>
          </div>

          {/* === CONTENT STRUCTURE === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Content Structure (Video-first/Script)
            </h3>

            {/* Hook */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Hook <span className="text-gray-400 font-normal">(Attention-grabbing opening)</span>
              </label>
              <textarea
                value={form.hook}
                onChange={(e) => handleChange("hook", e.target.value)}
                placeholder="The attention-grabbing opening..."
                rows={2}
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
              />
            </div>

            {/* Body */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Body <span className="text-gray-400 font-normal">(Main content explanation)</span>
              </label>
              <textarea
                value={form.body}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder="Main content explanation..."
                rows={3}
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
              />
            </div>

            {/* Angle */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Angle <span className="text-gray-400 font-normal">(Content approach)</span>
              </label>
              <input
                type="text"
                value={form.angle}
                onChange={(e) => handleChange("angle", e.target.value)}
                placeholder="e.g., Myth-busting, Personal story..."
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
              />
            </div>

            {/* CTA */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Call to Action</label>
              <input
                type="text"
                value={form.cta}
                onChange={(e) => handleChange("cta", e.target.value)}
                placeholder="e.g., Save this and DM me 'BRAND'"
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
              />
            </div>
          </div>

          {/* === EXECUTION DETAILS === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Execution Details
            </h3>

            {/* Format */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Format</label>
              <select
                value={form.format}
                onChange={(e) => handleChange("format", e.target.value)}
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]"
              >
                <option value="">Select format...</option>
                {FORMAT_OPTIONS.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Assets */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Assets Needed</label>
              <div className="flex flex-wrap gap-2">
                {(form.assets || []).map((asset, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {asset}
                  </span>
                ))}
                {(!form.assets || form.assets.length === 0) && (
                  <span className="text-gray-400 text-sm">No assets specified</span>
                )}
              </div>
            </div>
          </div>

          {/* === VISUAL CONTENT === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Visual Content
            </h3>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {form.hasGeneratedImage
                  ? 'Edit or regenerate your branded image.'
                  : 'Generate a branded image for this post using your brand colors and style.'}
              </p>

              {form.hasGeneratedImage ? (
                // Show Edit Image and Regenerate buttons when image exists
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEditImage}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit Image
                  </button>

                  <ImageGeneratorButton
                    post={form}
                    founderId={founderId}
                    postId={form.id}
                    buttonText="Regenerate"
                    buttonClassName="flex-1"
                  />
                </div>
              ) : (
                // Show Generate Image button when no image exists
                <ImageGeneratorButton
                  post={form}
                  founderId={founderId}
                  postId={form.id}
                />
              )}

              <p className="text-xs text-gray-500">
                The image will be generated using data from your Brand Profile, Current Trends, and Strategy.
              </p>
            </div>
          </div>

          {/* === STATUS & TRACKING === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Status & Tracking
            </h3>

            {/* Status */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("status", option.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      form.status === option.value
                        ? option.color === "gray"
                          ? "bg-gray-100 text-gray-700 border-gray-300 font-medium"
                          : option.color === "blue"
                          ? "bg-blue-100 text-blue-700 border-blue-300 font-medium"
                          : "bg-green-100 text-green-700 border-green-300 font-medium"
                        : "bg-white border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* === FEEDBACK === */}
          <div className="border-t border-[rgba(30,30,30,0.1)] pt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Feedback (Performance)
            </h3>

            {/* Feedback Type */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Action</label>
              <div className="flex gap-2">
                {FEEDBACK_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChange("feedbackType", type.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm border transition ${
                      form.feedbackType === type.value
                        ? type.value === "Repeat"
                          ? "bg-green-100 text-green-700 border-green-300 font-medium"
                          : type.value === "Iterate"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300 font-medium"
                          : "bg-red-100 text-red-700 border-red-300 font-medium"
                        : "bg-white border-[rgba(30,30,30,0.1)] text-gray-600 hover:bg-[#f6f6f6]"
                    }`}
                    title={type.desc}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes or feedback..."
                rows={2}
                className="w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none"
              />
            </div>
          </div>

          {/* Week info */}
          {post?.weekNumber && (
            <div className="text-xs text-gray-500 pt-2 border-t border-[rgba(30,30,30,0.1)]">
              Week {post.weekNumber} • {post.dayOfWeek}
            </div>
          )}
        </form>
      ) : (
        <CommentsSection postId={post?.id} />
      )}

      {/* Footer */}
      {activeTab === "details" && (
        <div className="p-6 border-t border-[rgba(30,30,30,0.1)] flex gap-3 bg-[#f6f6f6]">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-lg bg-[#1e1e1e] text-white font-semibold text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition disabled:opacity-50 shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && loadedImage && (
        <ImagePreviewModal
          image={loadedImage}
          onClose={() => {
            setIsImageModalOpen(false);
            setLoadedImage(null);
          }}
          post={form}
          founderId={founderId}
          postId={form.id}
        />
      )}
    </div>
  );
}
