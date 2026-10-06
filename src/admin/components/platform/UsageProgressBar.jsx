/**
 * UsageProgressBar - Shows usage progress with limits
 *
 * Features:
 * - Visual progress bar
 * - Current vs limit display
 * - Color-coded warning states
 * - Percentage display
 *
 * Follows Single Responsibility: Only displays usage progress
 */

import React from 'react';
import './UsageProgressBar.css';

const UsageProgressBar = ({
  label,
  current,
  limit,
  unit = '',
  warningThreshold = 80, // Warning at 80%
  dangerThreshold = 95,  // Danger at 95%
  formatValue = (val) => val.toLocaleString(),
}) => {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;

  const getStatus = () => {
    if (percentage >= dangerThreshold) return 'danger';
    if (percentage >= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  return (
    <div className="usage-progress">
      <div className="usage-progress__header">
        <span className="usage-progress__label">{label}</span>
        <span className="usage-progress__values">
          <strong>{formatValue(current)}</strong>
          <span className="usage-progress__separator">/</span>
          <span>{formatValue(limit)}</span>
          {unit && <span className="usage-progress__unit">{unit}</span>}
        </span>
      </div>

      <div className="usage-progress__bar-container">
        <div
          className={`usage-progress__bar usage-progress__bar--${status}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          <span className="usage-progress__percentage">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {percentage >= warningThreshold && (
        <div className={`usage-progress__alert usage-progress__alert--${status}`}>
          {percentage >= dangerThreshold
            ? '⚠️ Límite casi alcanzado'
            : '⚡ Acercándose al límite'}
        </div>
      )}
    </div>
  );
};

export default UsageProgressBar;
