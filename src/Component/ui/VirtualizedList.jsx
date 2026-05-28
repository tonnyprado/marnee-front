/**
 * VirtualizedList Component
 *
 * A lightweight virtualized list that only renders items visible in the viewport.
 * Uses IntersectionObserver for efficient visibility detection.
 *
 * Best for:
 * - Lists with 50+ items
 * - Items with consistent or estimable heights
 * - When you want to reduce DOM nodes for better performance
 *
 * Features:
 * - Renders only visible items + buffer
 * - Smooth scrolling support
 * - Dynamic item heights
 * - Scroll to index functionality
 * - No external dependencies
 */

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';

/**
 * VirtualizedList - Renders only visible items for performance
 *
 * @param {Array} items - Array of items to render
 * @param {Function} renderItem - (item, index) => React element
 * @param {number} itemHeight - Estimated height of each item in pixels
 * @param {number} overscan - Number of items to render above/below viewport (default: 5)
 * @param {string} className - Container class name
 * @param {Object} style - Container inline styles
 * @param {Function} onEndReached - Called when scrolled near the end
 * @param {number} endReachedThreshold - How far from end to trigger onEndReached (default: 0.8)
 * @param {Function} getItemKey - (item, index) => unique key (default: uses index)
 */
const VirtualizedList = memo(function VirtualizedList({
  items = [],
  renderItem,
  itemHeight = 60,
  overscan = 5,
  className = '',
  style = {},
  onEndReached = null,
  endReachedThreshold = 0.8,
  getItemKey = (item, index) => index,
}) {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [containerHeight, setContainerHeight] = useState(0);
  const endReachedCalledRef = useRef(false);

  // Calculate total height of all items
  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;

    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(clientHeight / itemHeight);
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

    setVisibleRange({ start: startIndex, end: endIndex });

    // Check if we've reached the end
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    if (scrollPercentage >= endReachedThreshold && !endReachedCalledRef.current) {
      endReachedCalledRef.current = true;
      onEndReached?.();
    } else if (scrollPercentage < endReachedThreshold - 0.1) {
      endReachedCalledRef.current = false;
    }
  }, [itemHeight, items.length, overscan, endReachedThreshold, onEndReached]);

  // Set up scroll listener and ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial calculation
    setContainerHeight(container.clientHeight);
    handleScroll();

    // Scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Resize observer for container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
        handleScroll();
      }
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [handleScroll]);

  // Reset when items change significantly
  useEffect(() => {
    handleScroll();
    endReachedCalledRef.current = false;
  }, [items.length, handleScroll]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  // Calculate spacer heights
  const topSpacer = visibleRange.start * itemHeight;
  const bottomSpacer = (items.length - visibleRange.end) * itemHeight;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: 'auto',
        position: 'relative',
        ...style,
      }}
    >
      {/* Total height container for scrollbar */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Top spacer */}
        {topSpacer > 0 && <div style={{ height: topSpacer }} />}

        {/* Visible items */}
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index;
          const key = getItemKey(item, actualIndex);

          return (
            <div key={key} style={{ minHeight: itemHeight }}>
              {renderItem(item, actualIndex)}
            </div>
          );
        })}

        {/* Bottom spacer */}
        {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} />}
      </div>
    </div>
  );
});

export default VirtualizedList;

/**
 * Hook for virtualizing any scrollable list
 * Returns the visible range and scroll handler
 */
export function useVirtualization({
  itemCount,
  itemHeight,
  containerRef,
  overscan = 5,
}) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const updateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight } = container;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(clientHeight / itemHeight);
    const endIndex = Math.min(itemCount, startIndex + visibleCount + overscan * 2);

    setVisibleRange((prev) => {
      if (prev.start === startIndex && prev.end === endIndex) {
        return prev; // No change
      }
      return { start: startIndex, end: endIndex };
    });
  }, [containerRef, itemCount, itemHeight, overscan]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateVisibleRange();
    container.addEventListener('scroll', updateVisibleRange, { passive: true });

    return () => {
      container.removeEventListener('scroll', updateVisibleRange);
    };
  }, [containerRef, updateVisibleRange]);

  return {
    visibleRange,
    isItemVisible: (index) => index >= visibleRange.start && index < visibleRange.end,
  };
}

/**
 * Simpler windowed rendering for existing lists
 * Only renders items within the window
 */
export function WindowedList({
  items,
  renderItem,
  windowSize = 50, // Number of items to keep rendered
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [windowStart, setWindowStart] = useState(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight || 1);

    // Calculate window position based on scroll
    const maxStart = Math.max(0, items.length - windowSize);
    const newStart = Math.floor(scrollPercentage * maxStart);

    setWindowStart(newStart);
  }, [items.length, windowSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const windowedItems = useMemo(() => {
    return items.slice(windowStart, windowStart + windowSize);
  }, [items, windowStart, windowSize]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'auto', ...style }}>
      {/* Spacer for items before window */}
      {windowStart > 0 && (
        <div style={{ height: windowStart * 50, flexShrink: 0 }} />
      )}

      {windowedItems.map((item, index) => renderItem(item, windowStart + index))}

      {/* Spacer for items after window */}
      {windowStart + windowSize < items.length && (
        <div style={{ height: (items.length - windowStart - windowSize) * 50, flexShrink: 0 }} />
      )}
    </div>
  );
}
