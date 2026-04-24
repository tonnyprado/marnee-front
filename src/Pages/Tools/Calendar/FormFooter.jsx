/**
 * FormFooter - Campaign Form Component
 *
 * Footer with Save and Cancel buttons
 */

import React from 'react';

export default function FormFooter({ activeTab, onClose, onSubmit, isSaving }) {
  if (activeTab !== "details") return null;

  return (
    <div className="p-6 border-t border-[rgba(30,30,30,0.1)] flex gap-3 bg-[#f6f6f6]">
      <button
        onClick={onSubmit}
        disabled={isSaving}
        className="flex-1 py-2.5 rounded-lg bg-[#1e1e1e] text-white font-semibold text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition disabled:opacity-50 shadow-sm"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  );
}
