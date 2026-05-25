import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Edit3, Clock, Monitor, Film, Tag } from "lucide-react";
import {
  SCRIPT_STATUS,
  SCRIPT_PLATFORMS,
  SCRIPT_FORMATS,
  SCRIPT_CONTENT_TYPES,
  SCRIPT_STATUS_COLORS,
  SCRIPT_STATUS_BG_COLORS,
  INITIAL_SCRIPT_STATE,
} from "../../../constants/scriptConstants";

// Shared styles matching Calendar form components
const inputStyles = "w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]";
const labelStyles = "text-sm font-medium text-gray-700 block mb-1.5";
const textareaStyles = "w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none";

export default function ScriptModal({ isOpen, script, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_SCRIPT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (script) {
      setForm({
        title: script.title || "",
        hook: script.hook || "",
        body: script.body || "",
        cta: script.cta || "",
        visualGuidance: script.visualGuidance || "",
        platform: script.platform || "",
        contentType: script.contentType || "",
        format: script.format || "",
        durationEstimate: script.durationEstimate || "",
        status: script.status || "draft",
        notes: script.notes || "",
      });
      setIsEditing(false); // Start in view mode for existing scripts
    } else {
      setForm(INITIAL_SCRIPT_STATE);
      setIsEditing(true); // Start in edit mode for new scripts
    }
  }, [script, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a title for the script.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(form);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const statusColor = SCRIPT_STATUS_COLORS[form.status] || SCRIPT_STATUS_COLORS.draft;
  const statusBg = SCRIPT_STATUS_BG_COLORS[form.status] || SCRIPT_STATUS_BG_COLORS.draft;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[rgba(30,30,30,0.1)] flex items-center justify-between bg-gradient-to-r from-[#f8f4fc] to-[#f3e8ff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ede0f8] rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#40086d]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {!script ? "New Script" : isEditing ? "Edit Script" : form.title || "Script"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {!script ? "Create a new video/post script" : isEditing ? "Update your script details" : "View your script"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[rgba(30,30,30,0.05)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {isEditing ? (
              /* Edit Mode - Form */
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className={labelStyles}>
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter script title..."
                    className={inputStyles}
                    required
                  />
                </div>

                {/* Hook */}
                <div>
                  <label className={labelStyles}>Hook</label>
                  <textarea
                    value={form.hook}
                    onChange={(e) => handleChange("hook", e.target.value)}
                    placeholder="The opening line that grabs attention..."
                    rows={3}
                    className={textareaStyles}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className={labelStyles}>Body</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => handleChange("body", e.target.value)}
                    placeholder="The main content of your script..."
                    rows={5}
                    className={textareaStyles}
                  />
                </div>

                {/* CTA */}
                <div>
                  <label className={labelStyles}>Call to Action (CTA)</label>
                  <textarea
                    value={form.cta}
                    onChange={(e) => handleChange("cta", e.target.value)}
                    placeholder="What you want viewers to do..."
                    rows={2}
                    className={textareaStyles}
                  />
                </div>

                {/* Visual Guidance */}
                <div>
                  <label className={labelStyles}>Visual Guidance</label>
                  <textarea
                    value={form.visualGuidance}
                    onChange={(e) => handleChange("visualGuidance", e.target.value)}
                    placeholder="Camera angles, b-roll, text overlays..."
                    rows={3}
                    className={textareaStyles}
                  />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Platform */}
                  <div>
                    <label className={labelStyles}>Platform</label>
                    <select
                      value={form.platform}
                      onChange={(e) => handleChange("platform", e.target.value)}
                      className={inputStyles}
                    >
                      <option value="">Select...</option>
                      {SCRIPT_PLATFORMS.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label className={labelStyles}>Format</label>
                    <select
                      value={form.format}
                      onChange={(e) => handleChange("format", e.target.value)}
                      className={inputStyles}
                    >
                      <option value="">Select...</option>
                      {SCRIPT_FORMATS.map((format) => (
                        <option key={format.value} value={format.value}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Content Type */}
                  <div>
                    <label className={labelStyles}>Content Type</label>
                    <select
                      value={form.contentType}
                      onChange={(e) => handleChange("contentType", e.target.value)}
                      className={inputStyles}
                    >
                      <option value="">Select...</option>
                      {SCRIPT_CONTENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {form.contentType && (
                      <p className="text-xs text-gray-500 mt-1">
                        {SCRIPT_CONTENT_TYPES.find((t) => t.value === form.contentType)?.desc}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelStyles}>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className={inputStyles}
                    >
                      {SCRIPT_STATUS.filter((s) => s.value !== "all").map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration Estimate */}
                <div>
                  <label className={labelStyles}>Duration Estimate</label>
                  <input
                    type="text"
                    value={form.durationEstimate}
                    onChange={(e) => handleChange("durationEstimate", e.target.value)}
                    placeholder="e.g., 30-60 seconds"
                    className={inputStyles}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className={labelStyles}>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                    className={textareaStyles}
                  />
                </div>
              </form>
            ) : (
              /* View Mode - Script Reader */
              <div className="flex-1 overflow-y-auto p-6">
                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: statusBg, color: statusColor }}
                  >
                    {form.status?.charAt(0).toUpperCase() + form.status?.slice(1)}
                  </span>
                  {form.platform && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <Monitor className="w-3 h-3" />
                      {form.platform}
                    </span>
                  )}
                  {form.format && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <Film className="w-3 h-3" />
                      {SCRIPT_FORMATS.find((f) => f.value === form.format)?.label || form.format}
                    </span>
                  )}
                  {form.contentType && (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: `${SCRIPT_CONTENT_TYPES.find((t) => t.value === form.contentType)?.color}20`,
                        color: SCRIPT_CONTENT_TYPES.find((t) => t.value === form.contentType)?.color,
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {form.contentType}
                    </span>
                  )}
                  {form.durationEstimate && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      <Clock className="w-3 h-3" />
                      {form.durationEstimate}
                    </span>
                  )}
                </div>

                {/* Script Content - Book/Script Style */}
                <div className="space-y-6">
                  {/* Hook */}
                  {form.hook && (
                    <div className="border-l-4 border-[#40086d] pl-4">
                      <h3 className="text-xs font-semibold text-[#40086d] uppercase tracking-wider mb-2">
                        Hook
                      </h3>
                      <p className="text-gray-800 text-lg leading-relaxed font-medium">
                        "{form.hook}"
                      </p>
                    </div>
                  )}

                  {/* Body */}
                  {form.body && (
                    <div className="border-l-4 border-gray-200 pl-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Body
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {form.body}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {form.cta && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                        Call to Action
                      </h3>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {form.cta}
                      </p>
                    </div>
                  )}

                  {/* Visual Guidance */}
                  {form.visualGuidance && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Film className="w-3.5 h-3.5" />
                        Visual Guidance
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed italic">
                        {form.visualGuidance}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {form.notes && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                        Notes
                      </h3>
                      <p className="text-amber-800 text-sm leading-relaxed">
                        {form.notes}
                      </p>
                    </div>
                  )}

                  {/* Empty State */}
                  {!form.hook && !form.body && !form.cta && (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No content yet</p>
                      <p className="text-sm">Click Edit to add your script</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[rgba(30,30,30,0.1)] flex justify-between gap-3 bg-[#f9fafb]">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => script ? setIsEditing(false) : handleClose()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-[rgba(30,30,30,0.05)] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#350758] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Script"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-[rgba(30,30,30,0.05)] rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#350758] transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Script
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
