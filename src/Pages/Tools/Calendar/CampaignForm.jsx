import React, { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
];

const FORMAT_OPTIONS = [
  "talking head",
  "voiceover",
  "carousel",
  "reel",
  "story",
  "static post",
  "live",
];

export default function CampaignForm({
  post,
  postIndex,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    hook: "",
    angle: "",
    cta: "",
    format: "",
    pillar: "",
    status: "draft",
    assets: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        hook: post.hook || "",
        angle: post.angle || "",
        cta: post.cta || "",
        format: post.format || "",
        pillar: post.pillar || "",
        status: post.status || "draft",
        assets: post.assets || [],
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
    <div className="fixed top-0 right-0 h-full w-96 bg-[#1a1a2e] text-white shadow-xl flex flex-col z-50 border-l border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <p className="text-sm text-gray-400">{formatDate(post?.date)}</p>
          <h2 className="text-lg font-semibold">Edit Post</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Pillar (readonly) */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Content Pillar</label>
          <div className="px-3 py-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-violet-300">
            {form.pillar || "Not set"}
          </div>
        </div>

        {/* Hook */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Hook</label>
          <textarea
            value={form.hook}
            onChange={(e) => handleChange("hook", e.target.value)}
            placeholder="The attention-grabbing opening..."
            rows={3}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          />
        </div>

        {/* Angle */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Angle</label>
          <input
            type="text"
            value={form.angle}
            onChange={(e) => handleChange("angle", e.target.value)}
            placeholder="e.g., Myth-busting, Personal story..."
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* CTA */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Call to Action</label>
          <input
            type="text"
            value={form.cta}
            onChange={(e) => handleChange("cta", e.target.value)}
            placeholder="e.g., Save this and DM me 'BRAND'"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Format */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Format</label>
          <select
            value={form.format}
            onChange={(e) => handleChange("format", e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
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
        <div>
          <label className="text-xs text-gray-400 block mb-1">Assets Needed</label>
          <div className="flex flex-wrap gap-2">
            {(form.assets || []).map((asset, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
              >
                {asset}
              </span>
            ))}
            {(!form.assets || form.assets.length === 0) && (
              <span className="text-gray-500 text-sm">No assets specified</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Status</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange("status", option.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition ${
                  form.status === option.value
                    ? option.value === "draft"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      : option.value === "scheduled"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-black/30 border border-white/10 text-gray-400 hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Week info */}
        {post?.weekNumber && (
          <div className="text-xs text-gray-500 pt-2">
            Week {post.weekNumber} | {post.dayOfWeek}
          </div>
        )}
      </form>

      {/* Footer */}
      <div className="p-5 border-t border-white/10 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg border border-white/20 text-gray-400 text-sm hover:bg-white/5 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
