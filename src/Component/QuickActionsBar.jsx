import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Calendar,
  FileText,
  BarChart3,
  FileDown,
  Share2,
  Sparkles,
  MessagesSquare,
  ChevronLeft,
  ChevronRight,
  Palette,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useChatTheme, CHAT_THEMES } from '../context/ChatThemeContext';

/**
 * QuickActionsBar - Sidebar with quick action buttons for chat
 */
export default function QuickActionsBar({
  onAction,
  isCollapsed,
  onToggleCollapse,
}) {
  const [hoveredAction, setHoveredAction] = useState(null);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const { currentTheme, changeTheme, soundEnabled, toggleSound } = useChatTheme();

  const actions = [
    {
      id: 'ideas',
      icon: Lightbulb,
      label: 'Generate Ideas',
      description: 'Get 5 fresh content ideas',
      color: 'text-yellow-500',
      bgColor: 'hover:bg-yellow-50',
    },
    {
      id: 'calendar',
      icon: Calendar,
      label: 'Create Calendar',
      description: 'Generate content calendar',
      color: 'text-blue-500',
      bgColor: 'hover:bg-blue-50',
    },
    {
      id: 'script',
      icon: FileText,
      label: 'Generate Script',
      description: 'Create video/post script',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50',
    },
    {
      id: 'analyze',
      icon: BarChart3,
      label: 'Analyze Strategy',
      description: 'Review current strategy',
      color: 'text-purple-500',
      bgColor: 'hover:bg-purple-50',
    },
    {
      id: 'resume',
      icon: MessagesSquare,
      label: 'Summarize Chat',
      description: 'Get conversation summary',
      color: 'text-cyan-500',
      bgColor: 'hover:bg-cyan-50',
    },
    {
      id: 'export',
      icon: FileDown,
      label: 'Export',
      description: 'Download conversation',
      color: 'text-orange-500',
      bgColor: 'hover:bg-orange-50',
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      description: 'Share conversation link',
      color: 'text-pink-500',
      bgColor: 'hover:bg-pink-50',
    },
  ];

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  };

  if (isCollapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center gap-3 p-2 bg-white border-l border-gray-200 shadow-sm">
        {/* Expand Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand actions"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>

        {/* Collapsed Icons */}
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(action.id)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              className={`relative p-2.5 rounded-lg transition-all ${action.bgColor}`}
              title={action.label}
            >
              <Icon className={`w-5 h-5 ${action.color}`} />

              {/* Tooltip */}
              {hoveredAction === action.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg"
                >
                  {action.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col w-56 bg-white border-l border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#40086d]" />
          <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Collapse"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </motion.button>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${action.bgColor}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${action.color}`} />
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500">
                  {action.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Theme Customization Footer */}
      <div className="border-t border-gray-100">
        {/* Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsThemeExpanded(!isThemeExpanded)}
          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#40086d]" />
            <span className="text-sm font-semibold text-gray-900">Customize</span>
          </div>
          {isThemeExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          )}
        </motion.button>

        {/* Expandable Theme Panel */}
        <AnimatePresence>
          {isThemeExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-3 border-t border-gray-100">
                {/* Sound Toggle */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Sound Effects</h4>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSound}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                      soundEnabled
                        ? 'bg-purple-50 border-[#40086d]'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-[#40086d]" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        soundEnabled ? 'text-[#40086d]' : 'text-gray-600'
                      }`}>
                        {soundEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full transition-colors ${
                        soundEnabled ? 'bg-[#40086d]' : 'bg-gray-300'
                      } relative`}
                    >
                      <motion.div
                        animate={{ x: soundEnabled ? 18 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </motion.button>
                </div>

                {/* Theme Selection */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Color Theme</h4>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {Object.values(CHAT_THEMES).map((t) => {
                      const isActive = t.id === currentTheme;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => changeTheme(t.id)}
                          className={`w-full p-2 rounded-lg border transition-all text-left ${
                            isActive
                              ? 'border-[#40086d] bg-purple-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold ${
                              isActive ? 'text-[#40086d]' : 'text-gray-900'
                            }`}>
                              {t.name}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-1.5 h-1.5 bg-[#40086d] rounded-full"
                              />
                            )}
                          </div>

                          {/* Theme Preview */}
                          <div className="flex gap-1.5">
                            <div className={`flex-1 h-6 rounded ${t.userBubble} ${t.userBubbleShadow}`} />
                            <div className={`flex-1 h-6 rounded ${t.aiBubble} ${t.aiBubbleShadow}`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
