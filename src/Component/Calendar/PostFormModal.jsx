/**
 * PostFormModal Component
 * Redesigned post form with mobile-style design and custom dropdowns
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../ui/CustomSelect';
import {
  STATUS_OPTIONS,
  PLATFORMS,
  CONTENT_TYPES,
  FORMAT_OPTIONS,
  INITIAL_FORM_STATE,
} from '../../constants/campaignFormConstants';
import {
  CONTENT_TYPE_COLORS,
  STATUS_COLORS,
} from '../../constants/calendarViewConstants';
import ScriptSection from './ScriptSection';

// Convert constants to select options format
const platformOptions = PLATFORMS.map(p => ({ value: p, label: p }));

const contentTypeOptions = CONTENT_TYPES.map(ct => ({
  value: ct.value,
  label: ct.label,
  description: ct.desc,
  color: CONTENT_TYPE_COLORS[ct.value],
}));

const formatOptions = FORMAT_OPTIONS.map(f => ({
  value: f,
  label: f.charAt(0).toUpperCase() + f.slice(1),
}));

const statusOptions = STATUS_OPTIONS.map(s => ({
  value: s.value,
  label: s.label,
  color: STATUS_COLORS[s.value],
}));

const effortOptions = [
  { value: 'Low', label: 'Low', description: 'Quick to create', color: '#10B981' },
  { value: 'Medium', label: 'Medium', description: 'Moderate effort', color: '#F59E0B' },
  { value: 'High', label: 'High', description: 'Significant time needed', color: '#EF4444' },
];

export default function PostFormModal({
  post,
  date,
  onSave,
  onClose,
  isLoading = false,
}) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [activeSection, setActiveSection] = useState('basic');

  // Initialize form with post data
  useEffect(() => {
    if (post) {
      setForm({
        ...INITIAL_FORM_STATE,
        ...post,
      });
    } else if (date) {
      setForm({
        ...INITIAL_FORM_STATE,
        scheduledDate: date.toISOString().split('T')[0],
      });
    }
  }, [post, date]);

  // Handle form change
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle save
  const handleSave = () => {
    onSave?.(form);
  };

  // Section components
  const sections = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'content', label: 'Content', icon: 'edit' },
    { id: 'script', label: 'Script', icon: 'file' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar' },
    { id: 'status', label: 'Status', icon: 'check' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#dccaf4]/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1e1e1e]">
                {post ? 'Edit Post' : 'New Post'}
              </h2>
              {date && (
                <p className="text-sm text-gray-500 mt-1">
                  {date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-[#ede0f8] transition"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Section tabs */}
          <div className="px-6 py-3 border-b border-[#dccaf4]/30 flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeSection === section.id
                    ? 'bg-[#40086d] text-white'
                    : 'bg-[#f6f6f6] text-gray-600 hover:bg-[#ede0f8]'
                  }
                `}
              >
                {section.label}
              </motion.button>
            ))}
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeSection === 'basic' && (
                  <BasicInfoSection form={form} onChange={handleChange} />
                )}
                {activeSection === 'content' && (
                  <ContentSection form={form} onChange={handleChange} />
                )}
                {activeSection === 'script' && (
                  <ScriptSection form={form} onChange={handleChange} postId={post?.id} />
                )}
                {activeSection === 'schedule' && (
                  <ScheduleSection form={form} onChange={handleChange} />
                )}
                {activeSection === 'status' && (
                  <StatusSection form={form} onChange={handleChange} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#dccaf4]/50 flex items-center justify-between bg-[#f6f6f6]/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#1e1e1e] transition"
            >
              Cancel
            </button>

            <motion.button
              onClick={handleSave}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-2.5 bg-[#40086d] text-white rounded-xl font-semibold text-sm hover:bg-[#1a0530] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Post'
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Basic Info Section
function BasicInfoSection({ form, onChange }) {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={form.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Enter post title..."
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition"
        />
      </div>

      {/* Platform */}
      <CustomSelect
        label="Platform"
        value={form.platform}
        onChange={(value) => onChange('platform', value)}
        options={platformOptions}
        placeholder="Select platform..."
      />

      {/* Content Type */}
      <CustomSelect
        label="Content Type"
        value={form.contentType}
        onChange={(value) => onChange('contentType', value)}
        options={contentTypeOptions}
        placeholder="Select content type..."
        showColorDot
      />

      {/* Effort Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Effort Level
        </label>
        <div className="flex gap-3">
          {effortOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange('effortLevel', option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all
                ${form.effortLevel === option.value
                  ? 'border-current'
                  : 'border-[#dccaf4] hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: form.effortLevel === option.value ? option.color + '20' : 'white',
                color: form.effortLevel === option.value ? option.color : '#6B7280',
                borderColor: form.effortLevel === option.value ? option.color : undefined,
              }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Format */}
      <CustomSelect
        label="Format"
        value={form.format}
        onChange={(value) => onChange('format', value)}
        options={formatOptions}
        placeholder="Select format..."
      />
    </div>
  );
}

// Content Section
function ContentSection({ form, onChange }) {
  return (
    <div className="space-y-5">
      {/* Hook */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Hook
        </label>
        <textarea
          value={form.hook || ''}
          onChange={(e) => onChange('hook', e.target.value)}
          placeholder="Attention-grabbing opening..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition resize-none"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Body
        </label>
        <textarea
          value={form.body || ''}
          onChange={(e) => onChange('body', e.target.value)}
          placeholder="Main content..."
          rows={4}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition resize-none"
        />
      </div>

      {/* Angle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Angle
        </label>
        <input
          type="text"
          value={form.angle || ''}
          onChange={(e) => onChange('angle', e.target.value)}
          placeholder="Content approach..."
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition"
        />
      </div>

      {/* CTA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Call to Action
        </label>
        <input
          type="text"
          value={form.cta || ''}
          onChange={(e) => onChange('cta', e.target.value)}
          placeholder="What action should viewers take?"
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition"
        />
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Caption
        </label>
        <textarea
          value={form.caption || ''}
          onChange={(e) => onChange('caption', e.target.value)}
          placeholder="Post caption..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition resize-none"
        />
      </div>
    </div>
  );
}

// Schedule Section
function ScheduleSection({ form, onChange }) {
  return (
    <div className="space-y-5">
      {/* Scheduled Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={form.scheduledDate || ''}
          onChange={(e) => onChange('scheduledDate', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition"
        />
      </div>

      {/* Scheduled Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Time
        </label>
        <input
          type="time"
          value={form.scheduledTime || ''}
          onChange={(e) => onChange('scheduledTime', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition"
        />
      </div>

      {/* Quick time presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="flex flex-wrap gap-2">
          {['09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => (
            <motion.button
              key={time}
              type="button"
              onClick={() => onChange('scheduledTime', time)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${form.scheduledTime === time
                  ? 'bg-[#40086d] text-white'
                  : 'bg-[#f6f6f6] text-gray-600 hover:bg-[#ede0f8]'
                }
              `}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reminder */}
      <div className="p-4 bg-[#ede0f8]/50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#40086d] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-[#1e1e1e]">Best posting times</h4>
            <p className="text-sm text-gray-500 mt-1">
              Based on your audience, the best times to post are 9 AM, 12 PM, and 6 PM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status Section
function StatusSection({ form, onChange }) {
  return (
    <div className="space-y-5">
      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange('status', option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-2
                ${form.status === option.value
                  ? 'border-current'
                  : 'border-[#dccaf4] hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: form.status === option.value ? option.color + '20' : 'white',
                color: form.status === option.value ? option.color : '#6B7280',
                borderColor: form.status === option.value ? option.color : undefined,
              }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Notes
        </label>
        <textarea
          value={form.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Add any notes..."
          rows={4}
          className="w-full px-4 py-3 bg-white border border-[#dccaf4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d] transition resize-none"
        />
      </div>

      {/* Feedback type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback
        </label>
        <div className="flex gap-3">
          {[
            { value: 'Repeat', label: 'Repeat', color: '#10B981', icon: '🔄' },
            { value: 'Iterate', label: 'Iterate', color: '#F59E0B', icon: '✏️' },
            { value: 'Drop', label: 'Drop', color: '#EF4444', icon: '❌' },
          ].map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange('feedbackType', option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all
                ${form.feedbackType === option.value
                  ? 'border-current'
                  : 'border-[#dccaf4] hover:border-gray-300'
                }
              `}
              style={{
                backgroundColor: form.feedbackType === option.value ? option.color + '20' : 'white',
                color: form.feedbackType === option.value ? option.color : '#6B7280',
                borderColor: form.feedbackType === option.value ? option.color : undefined,
              }}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
