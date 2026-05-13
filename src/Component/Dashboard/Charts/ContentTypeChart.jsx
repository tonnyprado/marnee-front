/**
 * ContentTypeChart Component
 * Chart de dona para mostrar distribución de tipos de contenido
 * Reutilizable para cualquier análisis de distribución porcentual
 */
import { InteractiveCard, DoughnutChart } from '../index';

const InfoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function ContentTypeChart({
  data,
  title = "Content Type Performance",
  centerText = "Total",
  centerValue = "100%",
  height = 220,
  expandable = true,
  defaultExpanded = true
}) {
  // Formato por defecto si no se proporciona data
  const chartData = data || {
    labels: ['Reels', 'Posts', 'Carousels', 'Stories'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#40086d', '#dccaf4', '#ede0f8', '#f6f6f6']
      }
    ]
  };

  return (
    <InteractiveCard
      title={title}
      expandable={expandable}
      defaultExpanded={defaultExpanded}
      icon={InfoIcon}
    >
      <DoughnutChart
        data={chartData}
        centerText={centerText}
        centerValue={centerValue}
        height={height}
      />
    </InteractiveCard>
  );
}
