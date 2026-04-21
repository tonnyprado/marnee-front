import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing undo/redo history for a Fabric.js canvas.
 * Saves canvas state after modifications and provides undo/redo functionality.
 */
export function useEditorHistory(canvas, maxHistory = 50) {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoRef = useRef(false);

  // Save state to history
  const saveState = useCallback(() => {
    if (!canvas || isUndoRedoRef.current) return;

    const json = canvas.toJSON();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);

    // Limit history size
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    } else {
      setHistoryIndex((prev) => prev + 1);
    }

    setHistory(newHistory);
  }, [canvas, history, historyIndex, maxHistory]);

  // Subscribe to canvas changes
  useEffect(() => {
    if (!canvas) return;

    const events = ['object:added', 'object:modified', 'object:removed'];
    events.forEach((event) => canvas.on(event, saveState));

    // Save initial state
    if (history.length === 0) {
      saveState();
    }

    return () => {
      events.forEach((event) => canvas.off(event, saveState));
    };
  }, [canvas, saveState, history.length]);

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !canvas) return;

    isUndoRedoRef.current = true;
    const newIndex = historyIndex - 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
      isUndoRedoRef.current = false;
    });
  }, [canvas, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !canvas) return;

    isUndoRedoRef.current = true;
    const newIndex = historyIndex + 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
      isUndoRedoRef.current = false;
    });
  }, [canvas, history, historyIndex]);

  return {
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyLength: history.length,
    currentIndex: historyIndex,
  };
}
