/**
 * FormHeader - Campaign Form Component
 *
 * Header with title, date, and close button
 */

import React from 'react';
import { formatDate } from '../../../utils/dateUtils';

export default function FormHeader({ post, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(30,30,30,0.1)] bg-[#f6f6f6]">
      <div>
        <p className="text-sm text-gray-500">{formatDate(post?.date)}</p>
        <h2 className="text-lg font-semibold">Edit Post</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
