import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, CheckCircle } from 'lucide-react';

/**
 * Extracts color codes from brand guidelines content
 */
function extractColors(content) {
  if (!content) return [];

  // Match HEX colors
  const hexMatches = content.match(/#[0-9A-Fa-f]{6}\b/g) || [];

  // Match RGB colors
  const rgbMatches = content.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi) || [];

  // Combine and dedupe
  const allColors = [...new Set([...hexMatches, ...rgbMatches.map(rgb => {
    // Convert RGB to HEX
    const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return null;
  }).filter(Boolean)])];

  return allColors.slice(0, 6); // Limit to 6 colors
}

/**
 * Extracts fonts from brand guidelines content
 */
function extractFonts(content) {
  if (!content) return [];

  const fonts = [];

  // Common font name patterns
  const fontPatterns = [
    /(?:font|typeface|typography)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:font|typeface)/gi,
    /(Helvetica|Arial|Roboto|Open Sans|Montserrat|Lato|Poppins|Inter|Playfair|Georgia|Times)/gi
  ];

  fontPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const fontName = match.replace(/font|typeface|typography|:/gi, '').trim();
      if (fontName && fontName.length > 2 && !fonts.includes(fontName)) {
        fonts.push(fontName);
      }
    });
  });

  return fonts.slice(0, 3); // Limit to 3 fonts
}

/**
 * BrandGuidelinesPreview - Shows a preview of brand guidelines in the chat
 *
 * Props:
 * - content: The processed brand guidelines content string
 * - isCollapsible: Whether the preview can be collapsed (default: true)
 */
export default function BrandGuidelinesPreview({ content, isCollapsible = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [colors, setColors] = useState([]);
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    if (content) {
      setColors(extractColors(content));
      setFonts(extractFonts(content));
    }
  }, [content]);

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
        className={`w-full p-3 flex items-center justify-between ${isCollapsible ? 'cursor-pointer hover:bg-pink-100/50' : ''} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
              Brand Guidelines
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            </p>
            <p className="text-xs text-gray-500">
              {colors.length} colors{fonts.length > 0 ? `, ${fonts.length} fonts` : ''} detected
            </p>
          </div>
        </div>
        {isCollapsible && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        )}
      </button>

      {/* Color Preview - Always visible */}
      {colors.length > 0 && (
        <div className="px-3 pb-3">
          <div className="flex gap-1">
            {colors.map((color, index) => (
              <motion.div
                key={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-sm border border-white/50 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {color.toUpperCase()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-pink-200 pt-3">
              {/* Fonts */}
              {fonts.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Typography</p>
                  <div className="flex flex-wrap gap-1">
                    {fonts.map((font, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white rounded-md text-xs text-gray-700 border border-gray-200"
                      >
                        {font}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Content Preview */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Extracted Information</p>
                <div className="bg-white rounded-lg p-3 max-h-48 overflow-y-auto text-xs text-gray-600 border border-gray-200">
                  <pre className="whitespace-pre-wrap font-sans">{content.slice(0, 1000)}{content.length > 1000 ? '...' : ''}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
