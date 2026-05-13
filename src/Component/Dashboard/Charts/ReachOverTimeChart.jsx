/**
 * ReachOverTimeChart Component
 * Chart de línea para mostrar reach/alcance a través del tiempo
 * Reutilizable para cualquier métrica temporal
 */
import { InteractiveCard, LineChart } from '../index';

const TrendIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

export default function ReachOverTimeChart({
  data,
  title = "Reach Over Time",
  badge = "7 Days",
  height = 200,
  expandable = false,
  defaultExpanded = true
}) {
  // Formato por defecto si no se proporciona data
  const chartData = data || {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Reach',
        data: [15400, 18200, 21100, 19800, 23400, 28100, 26700]
      }
    ]
  };

  return (
    <InteractiveCard
      title={title}
      badge={badge}
      icon={TrendIcon}
      expandable={expandable}
      defaultExpanded={defaultExpanded}
    >
      <LineChart data={chartData} height={height} />
    </InteractiveCard>
  );
}
