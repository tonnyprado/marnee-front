/**
 * MetricCard - Reusable metric display component
 *
 * Displays a single metric with:
 * - Label
 * - Value
 * - Optional trend indicator
 * - Optional icon
 *
 * Follows Single Responsibility: Only displays metrics
 */

import React from 'react';
import './MetricCard.css';

const MetricCard = ({
  label,
  value,
  icon,
  trend,
  trendType, // 'up' | 'down' | 'neutral'
  subtitle,
  color = 'blue',
  onClick,
}) => {
  const getTrendColor = () => {
    if (trendType === 'up') return '#10b981'; // green
    if (trendType === 'down') return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  return (
    <div
      className={`metric-card metric-card--${color} ${onClick ? 'metric-card--clickable' : ''}`}
      onClick={onClick}
    >
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {icon && <span className="metric-card__icon">{icon}</span>}
      </div>

      <div className="metric-card__value">{value}</div>

      {(subtitle || trend) && (
        <div className="metric-card__footer">
          {subtitle && <span className="metric-card__subtitle">{subtitle}</span>}
          {trend && (
            <span
              className="metric-card__trend"
              style={{ color: getTrendColor() }}
            >
              {trendType === 'up' && '↑'}
              {trendType === 'down' && '↓'}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
