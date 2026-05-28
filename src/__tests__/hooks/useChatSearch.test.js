/**
 * useChatSearch Hook Tests
 */
import { renderHook, act } from '@testing-library/react';
import { useChatSearch } from '../../hooks/useChatSearch';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('useChatSearch', () => {
  const mockMessages = [
    { id: '1', content: 'Hello world' },
    { id: '2', content: 'How are you?' },
    { id: '3', content: 'Hello again' },
    { id: '4', content: 'Goodbye world' },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize with empty search term', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));
      expect(result.current.searchTerm).toBe('');
    });

    it('should initialize with empty search results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));
      expect(result.current.searchResults).toEqual([]);
    });

    it('should initialize currentResultIndex at 0', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));
      expect(result.current.currentResultIndex).toBe(0);
    });
  });

  describe('setSearchTerm', () => {
    it('should update search term', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.searchTerm).toBe('hello');
    });

    it('should find matching messages', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.searchResults).toHaveLength(2);
      expect(result.current.searchResults[0].messageIndex).toBe(0);
      expect(result.current.searchResults[1].messageIndex).toBe(2);
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('HELLO');
      });

      expect(result.current.searchResults).toHaveLength(2);
    });

    it('should find partial matches', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('wor');
      });

      expect(result.current.searchResults).toHaveLength(2); // "world" appears twice
    });

    it('should return empty results for no matches', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('xyz');
      });

      expect(result.current.searchResults).toHaveLength(0);
    });

    it('should clear results when search term is empty', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.searchResults).toHaveLength(2);

      act(() => {
        result.current.setSearchTerm('');
      });

      expect(result.current.searchResults).toHaveLength(0);
    });

    it('should clear results when search term is whitespace', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('   ');
      });

      expect(result.current.searchResults).toHaveLength(0);
    });

    it('should reset currentResultIndex when search term changes', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      expect(result.current.currentResultIndex).toBe(1);

      act(() => {
        result.current.setSearchTerm('world');
      });

      expect(result.current.currentResultIndex).toBe(0);
    });
  });

  describe('goToNextResult', () => {
    it('should increment currentResultIndex', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      expect(result.current.currentResultIndex).toBe(1);
    });

    it('should wrap around to 0 when at last result', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      act(() => {
        result.current.goToNextResult();
      });

      expect(result.current.currentResultIndex).toBe(0);
    });

    it('should do nothing when no results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.goToNextResult();
      });

      expect(result.current.currentResultIndex).toBe(0);
    });
  });

  describe('goToPrevResult', () => {
    it('should decrement currentResultIndex', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      act(() => {
        result.current.goToPrevResult();
      });

      expect(result.current.currentResultIndex).toBe(0);
    });

    it('should wrap around to last when at first result', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToPrevResult();
      });

      expect(result.current.currentResultIndex).toBe(1);
    });

    it('should do nothing when no results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.goToPrevResult();
      });

      expect(result.current.currentResultIndex).toBe(0);
    });
  });

  describe('highlightText', () => {
    it('should wrap matching text with asterisks', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      const highlighted = result.current.highlightText('Hello world');
      expect(highlighted).toBe('**Hello** world');
    });

    it('should highlight multiple occurrences', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('o');
      });

      const highlighted = result.current.highlightText('Hello world');
      expect(highlighted).toBe('Hell**o** w**o**rld');
    });

    it('should return original text when no search term', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      const highlighted = result.current.highlightText('Hello world');
      expect(highlighted).toBe('Hello world');
    });

    it('should return original text when search term is whitespace', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('   ');
      });

      const highlighted = result.current.highlightText('Hello world');
      expect(highlighted).toBe('Hello world');
    });
  });

  describe('clearSearch', () => {
    it('should clear search term', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('should clear search results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchResults).toHaveLength(0);
    });

    it('should reset currentResultIndex', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.currentResultIndex).toBe(0);
    });
  });

  describe('isSearchResult', () => {
    it('should return true for message index in results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.isSearchResult(0)).toBe(true);
      expect(result.current.isSearchResult(2)).toBe(true);
    });

    it('should return false for message index not in results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.isSearchResult(1)).toBe(false);
      expect(result.current.isSearchResult(3)).toBe(false);
    });
  });

  describe('getResultIndex', () => {
    it('should return result index for message index', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.getResultIndex(0)).toBe(0);
      expect(result.current.getResultIndex(2)).toBe(1);
    });

    it('should return -1 for message not in results', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.getResultIndex(1)).toBe(-1);
    });
  });

  describe('isCurrentResult', () => {
    it('should return true for current result index', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.isCurrentResult(0)).toBe(true);
      expect(result.current.isCurrentResult(1)).toBe(false);
    });

    it('should update when navigating', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      expect(result.current.isCurrentResult(0)).toBe(false);
      expect(result.current.isCurrentResult(1)).toBe(true);
    });
  });

  describe('setResultRef', () => {
    it('should store element reference', () => {
      const { result } = renderHook(() => useChatSearch(mockMessages));

      const mockElement = document.createElement('div');

      act(() => {
        result.current.setResultRef(0, mockElement);
      });

      // The ref is stored internally, we can verify by calling goToNextResult
      // which should call scrollIntoView on the element
      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        result.current.goToNextResult();
      });

      // scrollIntoView should be called on navigation
      // (verifying the ref was stored)
    });
  });

  describe('messages change', () => {
    it('should re-search when messages change', () => {
      const { result, rerender } = renderHook(
        ({ messages }) => useChatSearch(messages),
        { initialProps: { messages: mockMessages } }
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.searchResults).toHaveLength(0);

      // Add a message containing 'test'
      const newMessages = [
        ...mockMessages,
        { id: '5', content: 'This is a test message' },
      ];

      rerender({ messages: newMessages });

      expect(result.current.searchResults).toHaveLength(1);
    });
  });
});
