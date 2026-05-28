/**
 * useChatSearch
 *
 * Hook for searching within chat messages.
 * Provides search functionality with result navigation.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useChatSearch(messages) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const searchResultRefs = useRef([]);

  // Search when term or messages change
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

  // Navigate to next result
  const goToNextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);

    const resultElement = searchResultRefs.current[nextIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchResults.length, currentResultIndex]);

  // Navigate to previous result
  const goToPrevResult = useCallback(() => {
    if (searchResults.length === 0) return;
    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentResultIndex(prevIndex);

    const resultElement = searchResultRefs.current[prevIndex];
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchResults.length, currentResultIndex]);

  // Highlight text with search term
  const highlightText = useCallback((text) => {
    if (!searchTerm.trim()) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part) =>
      part.toLowerCase() === searchTerm.toLowerCase()
        ? `**${part}**`
        : part
    ).join('');
  }, [searchTerm]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setCurrentResultIndex(0);
  }, []);

  // Check if a message index is a search result
  const isSearchResult = useCallback((index) => {
    return searchResults.some(result => result.messageIndex === index);
  }, [searchResults]);

  // Get result index for a message index
  const getResultIndex = useCallback((index) => {
    return searchResults.findIndex(result => result.messageIndex === index);
  }, [searchResults]);

  // Check if a result index is the current one
  const isCurrentResult = useCallback((resultIdx) => {
    return resultIdx === currentResultIndex;
  }, [currentResultIndex]);

  // Set ref for a search result element
  const setResultRef = useCallback((resultIndex, element) => {
    searchResultRefs.current[resultIndex] = element;
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    currentResultIndex,
    goToNextResult,
    goToPrevResult,
    highlightText,
    clearSearch,
    isSearchResult,
    getResultIndex,
    isCurrentResult,
    setResultRef,
  };
}

export default useChatSearch;
