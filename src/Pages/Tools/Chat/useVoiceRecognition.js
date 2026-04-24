/**
 * useVoiceRecognition Hook
 *
 * Handles Web Speech API for voice-to-text transcription.
 * Extracted from ChatPage.jsx to separate voice recognition logic.
 */

import { useState, useRef, useCallback } from 'react';

export function useVoiceRecognition({ onTranscriptChange, playSound }) {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef(null);

  /**
   * Toggle voice recognition on/off
   */
  const toggleVoiceMode = useCallback(() => {
    if (!isVoiceMode) {
      // Start voice mode - continuous transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;  // Keep recording
      recognition.interimResults = true;  // Show results in real-time

      recognition.onstart = () => {
        console.log('[Voice] Voice recognition started');
        setIsVoiceMode(true);
        if (playSound) {
          playSound('voiceStart');
        }
      };

      recognition.onresult = (event) => {
        // Build complete transcription (final + interim)
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update input in real-time
        const fullTranscript = (finalTranscript + interimTranscript).trim();
        console.log('[Voice] Transcription:', fullTranscript);

        if (onTranscriptChange) {
          onTranscriptChange(fullTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('[Voice] Error:', event.error);

        // Don't close for "no-speech" since it's continuous
        if (event.error === 'no-speech') {
          console.log('[Voice] Waiting for speech...');
          return;
        }

        setIsVoiceMode(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'aborted') {
          alert(`Voice recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('[Voice] Voice recognition ended');
        // Only change state if we're not stopping manually
        if (recognitionRef.current && isVoiceMode) {
          setIsVoiceMode(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      // Stop voice mode
      if (playSound) {
        playSound('voiceStop');
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsVoiceMode(false);
    }
  }, [isVoiceMode, onTranscriptChange, playSound]);

  /**
   * Stop voice recognition (cleanup)
   */
  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceMode(false);
  }, []);

  /**
   * Check if voice recognition is supported
   */
  const isVoiceSupported = useCallback(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  return {
    isVoiceMode,
    toggleVoiceMode,
    stopVoiceRecognition,
    isVoiceSupported,
  };
}
