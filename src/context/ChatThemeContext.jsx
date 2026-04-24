/**
 * ChatThemeContext - Refactored to use StorageService
 *
 * BEFORE: Direct localStorage usage (lines 57, 62, 67, 71)
 * AFTER: Uses StorageService from core (React Native ready)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../core/services/StorageService';

const ChatThemeContext = createContext();

// Define themes using existing brand palette
export const CHAT_THEMES = {
  classic: {
    id: 'classic',
    name: 'Classic Purple',
    background: 'bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50',
    userBubble: 'bg-gradient-to-br from-[#40086d] to-[#2d0550] text-white',
    aiBubble: 'bg-white border border-gray-200 text-gray-900',
    userBubbleShadow: 'shadow-md shadow-purple-900/20',
    aiBubbleShadow: 'shadow-sm',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    background: 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900',
    userBubble: 'bg-gradient-to-br from-purple-600 to-purple-800 text-white',
    aiBubble: 'bg-slate-800 border border-slate-700 text-white',
    userBubbleShadow: 'shadow-md shadow-purple-500/30',
    aiBubbleShadow: 'shadow-sm shadow-black/20',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    background: 'bg-gradient-to-br from-blue-50 via-cyan-50/30 to-blue-50',
    userBubble: 'bg-gradient-to-br from-[#40086d] to-[#5c1a8f] text-white',
    aiBubble: 'bg-white border border-blue-200 text-gray-900',
    userBubbleShadow: 'shadow-md shadow-purple-900/20',
    aiBubbleShadow: 'shadow-sm',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    background: 'bg-gradient-to-br from-orange-50 via-pink-50/30 to-purple-50',
    userBubble: 'bg-gradient-to-br from-[#40086d] to-[#6b1fa3] text-white',
    aiBubble: 'bg-white border border-pink-200 text-gray-900',
    userBubbleShadow: 'shadow-md shadow-purple-900/20',
    aiBubbleShadow: 'shadow-sm',
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    background: 'bg-gradient-to-br from-emerald-50 via-green-50/30 to-emerald-50',
    userBubble: 'bg-gradient-to-br from-[#40086d] to-[#4a1080] text-white',
    aiBubble: 'bg-white border border-emerald-200 text-gray-900',
    userBubbleShadow: 'shadow-md shadow-purple-900/20',
    aiBubbleShadow: 'shadow-sm',
  },
};

export function ChatThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load from storage
    const saved = storage.getItem('chat_theme');
    return saved && CHAT_THEMES[saved] ? saved : 'classic';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = storage.getItem('chat_sound_enabled');
    return saved === null ? true : saved;
  });

  useEffect(() => {
    storage.setItem('chat_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    storage.setItem('chat_sound_enabled', soundEnabled);
  }, [soundEnabled]);

  const theme = CHAT_THEMES[currentTheme];

  const changeTheme = (themeId) => {
    if (CHAT_THEMES[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Sound functions using Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'send') {
      // Sent message: rising tone (positive feedback)
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'receive') {
      // Received message: gentle notification
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'voiceStart') {
      // Voice recording started: double beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } else if (type === 'voiceStop') {
      // Voice recording stopped: single lower beep
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.12);
    }
  };

  return (
    <ChatThemeContext.Provider
      value={{
        theme,
        currentTheme,
        changeTheme,
        soundEnabled,
        toggleSound,
        playSound,
      }}
    >
      {children}
    </ChatThemeContext.Provider>
  );
}

export function useChatTheme() {
  const context = useContext(ChatThemeContext);
  if (!context) {
    throw new Error('useChatTheme must be used within ChatThemeProvider');
  }
  return context;
}
