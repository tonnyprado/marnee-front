import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function PromptSuggestions({ onSelectPrompt }) {
  const suggestions = [
    {
      text: "Generate 5 fresh content ideas for this week",
      category: "Ideas",
    },
    {
      text: "Create a 7-day content calendar",
      category: "Planning",
    },
    {
      text: "Write a script for my next video",
      category: "Script",
    },
    {
      text: "Analyze my current content strategy",
      category: "Analysis",
    },
    {
      text: "Help me define my content pillars",
      category: "Strategy",
    },
    {
      text: "Summarize our conversation so far",
      category: "Summary",
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-[#40086d] mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          What can I help you with?
        </h3>
        <p className="text-sm text-gray-600">
          Try one of these suggestions or ask me anything
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPrompt(suggestion.text)}
            className="text-left p-4 bg-white border-2 border-gray-200 hover:border-[#40086d] rounded-xl transition-all group"
          >
            <div className="text-xs font-semibold text-[#40086d] mb-1">
              {suggestion.category}
            </div>
            <div className="text-sm text-gray-900 group-hover:text-[#40086d] transition">
              {suggestion.text}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
