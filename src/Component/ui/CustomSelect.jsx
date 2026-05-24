/**
 * CustomSelect Component
 * Styled dropdown replacing native browser select
 * Features: color dots, checkmarks, animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  label,
  showColorDot = false,
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          w-full px-4 py-3
          bg-white border rounded-xl
          text-sm text-left
          transition-all duration-200
          ${disabled
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : isOpen
              ? 'border-[#40086d] ring-2 ring-[#40086d]/20'
              : 'border-[#dccaf4] hover:border-[#40086d]'
          }
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showColorDot && selectedOption?.color && (
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className={`truncate ${!selectedOption ? 'text-gray-400' : 'text-[#1e1e1e]'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-0 right-0 mt-2
              bg-white border border-[#dccaf4] rounded-xl
              shadow-lg overflow-hidden z-50
              max-h-64 overflow-y-auto
            "
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      flex items-center gap-3 w-full px-4 py-3
                      text-sm text-left transition-colors
                      ${isSelected ? 'bg-[#ede0f8]' : 'hover:bg-[#f6f6f6]'}
                      ${index !== options.length - 1 ? 'border-b border-[#dccaf4]/30' : ''}
                    `}
                  >
                    {showColorDot && option.color && (
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <span className={`block truncate ${isSelected ? 'font-medium text-[#40086d]' : 'text-[#1e1e1e]'}`}>
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="block text-xs text-gray-400 truncate mt-0.5">
                          {option.description}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <svg className="w-4 h-4 text-[#40086d] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Multi-select variant
export function CustomMultiSelect({
  value = [],
  onChange,
  options = [],
  placeholder = 'Select...',
  label,
  showColorDot = false,
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          w-full px-4 py-3
          bg-white border rounded-xl
          text-sm text-left
          transition-all duration-200
          ${disabled
            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            : isOpen
              ? 'border-[#40086d] ring-2 ring-[#40086d]/20'
              : 'border-[#dccaf4] hover:border-[#40086d]'
          }
        `}
      >
        <span className={`flex-1 truncate ${value.length === 0 ? 'text-gray-400' : 'text-[#1e1e1e]'}`}>
          {selectedLabels || placeholder}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          {value.length}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-0 right-0 mt-2
              bg-white border border-[#dccaf4] rounded-xl
              shadow-lg overflow-hidden z-50
              max-h-64 overflow-y-auto
            "
          >
            {options.map((option, index) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3
                    text-sm text-left transition-colors
                    ${isSelected ? 'bg-[#ede0f8]' : 'hover:bg-[#f6f6f6]'}
                    ${index !== options.length - 1 ? 'border-b border-[#dccaf4]/30' : ''}
                  `}
                >
                  {/* Checkbox */}
                  <span className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-[#40086d] border-[#40086d]' : 'border-[#dccaf4]'}
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>

                  {showColorDot && option.color && (
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                  )}

                  <span className={`flex-1 truncate ${isSelected ? 'font-medium text-[#40086d]' : 'text-[#1e1e1e]'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
