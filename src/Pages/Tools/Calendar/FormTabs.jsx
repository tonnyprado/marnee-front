/**
 * FormTabs - Campaign Form Component
 *
 * Tab navigation (Details / Comments)
 */

import React from 'react';

export default function FormTabs({ activeTab, setActiveTab }) {
  return (
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
  );
}
