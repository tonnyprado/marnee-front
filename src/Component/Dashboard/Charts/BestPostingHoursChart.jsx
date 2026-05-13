/**
 * BestPostingHoursChart Component
 * Chart de barras para mostrar mejores horarios de publicación
 * Reutilizable para análisis de timing
 */
import { InteractiveCard, BarChart } from '../index';

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function BestPostingHoursChart({
  data,
  title = "Best Posting Hours",
  badge = "Peak times",
  height = 200,
  expandable = false,
  defaultExpanded = true
}) {
  // Formato por defecto si no se proporciona data
  const chartData = data || {
    labels: ['9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    datasets: [
      {
        label: 'Engagement',
        data: [45, 72, 88, 95, 78, 52]
      }
    ]
  };

  return (
    <InteractiveCard
      title={title}
      badge={badge}
      icon={ClockIcon}
      expandable={expandable}
      defaultExpanded={defaultExpanded}
    >
      <BarChart data={chartData} height={height} />
    </InteractiveCard>
  );
}
