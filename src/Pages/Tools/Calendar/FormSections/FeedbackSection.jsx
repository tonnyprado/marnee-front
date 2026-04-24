/**
 * FeedbackSection - Campaign Form Section
 *
 * Handles feedback fields:
 * - Feedback Type (Repeat, Iterate, Drop)
 * - Notes
 */

import React from 'react';
import { FEEDBACK_TYPES } from '../../../../constants/campaignFormConstants';

export default function FeedbackSection({ form, handleChange }) {
  return (
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
  );
}
