/**
 * MainCalendar Component
 * Container that manages views and renders the appropriate calendar view
 */

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import { VIEW_MODES } from '../../constants/calendarViewConstants';

export default function MainCalendar({
  posts = [],
  viewMode: controlledViewMode,
  onViewModeChange,
  selectedDate,
  onDateSelect,
  onPostClick,
  initialDate = new Date(),
}) {
  // Internal state for uncontrolled mode
  const [internalViewMode, setInternalViewMode] = useState(VIEW_MODES.MONTH);
  const [currentDate, setCurrentDate] = useState(initialDate);

  // Use controlled or internal state
  const viewMode = controlledViewMode ?? internalViewMode;

  // Handle view mode change - navigate to today when switching to week view
  const handleViewModeChange = useCallback((newMode) => {
    if (newMode === VIEW_MODES.WEEK) {
      setCurrentDate(new Date());
    }
    if (onViewModeChange) {
      onViewModeChange(newMode);
    } else {
      setInternalViewMode(newMode);
    }
  }, [onViewModeChange]);

  // Navigate to next/prev period
  const handleNavigate = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);

      switch (viewMode) {
        case VIEW_MODES.MONTH:
          newDate.setMonth(newDate.getMonth() + direction);
          break;
        case VIEW_MODES.WEEK:
          newDate.setDate(newDate.getDate() + (direction * 7));
          break;
        case VIEW_MODES.DAY:
          newDate.setDate(newDate.getDate() + direction);
          break;
        default:
          newDate.setMonth(newDate.getMonth() + direction);
      }

      return newDate;
    });
  }, [viewMode]);

  // Go to today
  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
    if (onDateSelect) {
      onDateSelect(new Date());
    }
  }, [onDateSelect]);

  // View transition variants
  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Render appropriate view
  const renderView = () => {
    const commonProps = {
      currentDate,
      posts,
      selectedDate,
      onDateSelect,
      onPostClick,
    };

    switch (viewMode) {
      case VIEW_MODES.WEEK:
        return <WeekView {...commonProps} />;
      case VIEW_MODES.DAY:
        return <DayView {...commonProps} />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {/* Calendar view */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
