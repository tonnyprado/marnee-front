/**
 * useMessageSearch Hook
 *
 * Handles message search functionality with navigation.
 * Extracted from ChatPage.jsx to separate search logic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export function useMessageSearch(messages) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const searchResultRefs = useRef([]);

  /**
   * Perform search when searchTerm or messages change
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(0);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = messages
      .map((msg, index) => ({
        messageIndex: index,
        messageId: msg.id,
        matches: msg.content.toLowerCase().includes(term),
      }))
      .filter(result => result.matches);

    setSearchResults(results);
    setCurrentResultIndex(0);

    // Scroll to first result
    if (results.length > 0) {
      setTimeout(() => {
        const firstResultElement = searchResultRefs.current[0];
        if (firstResultElement) {
          firstResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [searchTerm, messages]);

  /**
   * Navigate to next search result
   */
  const goToNextResult = useCallback(() => {
    if (searchResults.length === 0) return;

    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);

    const resultElement = searchResultRefs.current[nextIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchResults, currentResultIndex]);

  /**
   * Navigate to previous search result
   */
  const goToPrevResult = useCallback(() => {
    if (searchResults.length === 0) return;

    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(prevIndex);

    const resultElement = searchResultRefs.current[prevIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchResults, currentResultIndex]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setCurrentResultIndex(0);
  }, []);

  /**
   * Highlight text with search term
   */
  const highlightText = useCallback((text, term = searchTerm) => {
    if (!term.trim()) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase()
        ? `**${part}**`
        : part
    ).join('');
  }, [searchTerm]);

  /**
   * Check if a message index is a search result
   */
  const isSearchResult = useCallback((messageIndex) => {
    return searchResults.some(result => result.messageIndex === messageIndex);
  }, [searchResults]);

  /**
   * Check if a message index is the current search result
   */
  const isCurrentResult = useCallback((messageIndex) => {
    if (searchResults.length === 0) return false;
    const currentResult = searchResults[currentResultIndex];
    return currentResult && currentResult.messageIndex === messageIndex;
  }, [searchResults, currentResultIndex]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    currentResultIndex,
    searchResultRefs,
    goToNextResult,
    goToPrevResult,
    clearSearch,
    highlightText,
    isSearchResult,
    isCurrentResult,
  };
}
