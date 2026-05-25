import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import {
  SCRIPT_STATUS,
  SCRIPT_PLATFORMS,
  SCRIPT_FORMATS,
  SCRIPT_CONTENT_TYPES,
  INITIAL_SCRIPT_STATE,
} from "../../../constants/scriptConstants";

// Shared styles matching Calendar form components
const inputStyles = "w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]";
const labelStyles = "text-sm font-medium text-gray-700 block mb-1.5";
const textareaStyles = "w-full bg-white border border-[rgba(30,30,30,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d] resize-none";

export default function ScriptModal({ isOpen, script, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_SCRIPT_STATE);
  const [isSaving, setIsSaving] = useState(false);

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
    } else {
      setForm(INITIAL_SCRIPT_STATE);
    }
  }, [script, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a title for the script.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(form);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
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
                    {script ? "Edit Script" : "New Script"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {script ? "Update your script details" : "Create a new video/post script"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[rgba(30,30,30,0.05)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
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

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[rgba(30,30,30,0.1)] flex justify-end gap-3 bg-[#f9fafb]">
              <button
                type="button"
                onClick={onClose}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
