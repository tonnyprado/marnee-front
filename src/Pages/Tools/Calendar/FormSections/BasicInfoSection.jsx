/**
 * BasicInfoSection - Campaign Form Section
 *
 * Handles basic information fields:
 * - Title
 * - Task Type
 * - Platform
 * - Asset Type
 * - Content Type
 * - Effort Level
 */

import React from 'react';
import {
  TASK_TYPES,
  PLATFORMS,
  ASSET_TYPES,
  CONTENT_TYPES,
  EFFORT_LEVELS,
} from '../../../../constants/campaignFormConstants';

export default function BasicInfoSection({ form, handleChange }) {
  return (
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
  );
}
