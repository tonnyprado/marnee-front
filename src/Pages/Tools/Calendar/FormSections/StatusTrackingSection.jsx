/**
 * StatusTrackingSection - Campaign Form Section
 *
 * Handles status tracking:
 * - Status (To Do, In Progress, Done, Skipped)
 */

import React from 'react';
import { STATUS_OPTIONS } from '../../../../constants/campaignFormConstants';

export default function StatusTrackingSection({ form, handleChange }) {
  return (
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
  );
}
