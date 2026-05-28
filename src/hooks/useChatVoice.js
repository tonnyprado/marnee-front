/**
 * useChatVoice
 *
 * Hook for voice input functionality in chat.
 * Handles speech recognition with continuous transcription.
 */
import { useState, useRef, useCallback } from 'react';

export function useChatVoice({ onTranscript, playSound }) {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceMode = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log('[Voice] Voice recognition started');
      setIsVoiceMode(true);
      playSound?.('voiceStart');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          if (i >= event.resultIndex) {
            interimTranscript += transcript;
          }
        }
      }

      const fullTranscript = (finalTranscript + interimTranscript).trim();
      onTranscript?.(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.error('[Voice] Error:', event.error);

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
      if (recognitionRef.current) {
        setIsVoiceMode(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  }, [onTranscript, playSound]);

  const stopVoiceMode = useCallback(() => {
    playSound?.('voiceStop');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceMode(false);
  }, [playSound]);

  const toggleVoiceMode = useCallback(() => {
    if (!isVoiceMode) {
      startVoiceMode();
    } else {
      stopVoiceMode();
    }
  }, [isVoiceMode, startVoiceMode, stopVoiceMode]);

  return {
    isVoiceMode,
    toggleVoiceMode,
    startVoiceMode,
    stopVoiceMode,
  };
}

export default useChatVoice;
