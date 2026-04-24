/**
 * StrategicContextSection - Campaign Form Section
 *
 * Handles strategic context fields:
 * - Goal (Funnel Objective)
 * - Content Pillar (read-only)
 * - Reason (why this content exists)
 * - Based On (trends, audience, strategy)
 */

import React from 'react';
import { GOALS } from '../../../../constants/campaignFormConstants';

export default function StrategicContextSection({ form, handleChange }) {
  return (
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
  );
}
