/**
 * ExecutionDetailsSection - Campaign Form Section
 *
 * Handles execution details:
 * - Format
 * - Assets needed
 */

import React from 'react';
import { FORMAT_OPTIONS } from '../../../../constants/campaignFormConstants';

export default function ExecutionDetailsSection({ form, handleChange }) {
  return (
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
  );
}
