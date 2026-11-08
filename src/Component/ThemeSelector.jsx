import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Volume2, VolumeX, X } from 'lucide-react';
import { useChatTheme, CHAT_THEMES } from '../context/ChatThemeContext';

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, soundEnabled, toggleSound } = useChatTheme();

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-[#40086d] to-[#2d0550] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Customize theme"
      >
        <Palette className="w-6 h-6" />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#40086d]" />
                  <h3 className="font-bold text-gray-900">Customize Chat</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Sound Toggle */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Sound Effects</h4>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSound}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      soundEnabled
                        ? 'bg-purple-50 border-[#40086d]'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-[#40086d]" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        soundEnabled ? 'text-[#40086d]' : 'text-gray-600'
                      }`}>
                        {soundEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        soundEnabled ? 'bg-[#40086d]' : 'bg-gray-300'
                      } relative`}
                    >
                      <motion.div
                        animate={{ x: soundEnabled ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      />
                    </div>
                  </motion.button>
                </div>

                {/* Theme Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Theme</h4>
                  <div className="space-y-2">
                    {Object.values(CHAT_THEMES).map((t) => {
                      const isActive = t.id === currentTheme;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => changeTheme(t.id)}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                            isActive
                              ? 'border-[#40086d] bg-purple-50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold ${
                              isActive ? 'text-[#40086d]' : 'text-gray-900'
                            }`}>
                              {t.name}
                            </span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-[#40086d] rounded-full"
                              />
                            )}
                          </div>

                          {/* Theme Preview */}
                          <div className="flex gap-2">
                            {/* User bubble preview */}
                            <div className={`flex-1 h-8 rounded-lg ${t.userBubble} ${t.userBubbleShadow}`} />
                            {/* AI bubble preview */}
                            <div className={`flex-1 h-8 rounded-lg ${t.aiBubble} ${t.aiBubbleShadow}`} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                  Your preferences are saved automatically
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
