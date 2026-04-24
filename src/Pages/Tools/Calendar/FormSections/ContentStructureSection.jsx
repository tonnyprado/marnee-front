/**
 * ContentStructureSection - Campaign Form Section
 *
 * Handles content structure fields:
 * - Hook (attention-grabbing opening)
 * - Body (main content explanation)
 * - Angle (content approach)
 * - CTA (call to action)
 */

import React from 'react';

export default function ContentStructureSection({ form, handleChange }) {
  return (
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
  );
}
