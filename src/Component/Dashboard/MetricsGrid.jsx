/**
 * MetricsGrid Component
 * Cuadrícula reutilizable de métricas con animaciones
 * Puede mostrar loading states y configurar número de columnas
 */
import { AnimatedMetricCard, SkeletonMetricCard } from './index';

export default function MetricsGrid({
  metrics = [],
  isLoading = false,
  columns = 4
}) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[columns] || 'grid-cols-4';

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-3.5`}>
        {Array.from({ length: metrics.length || columns }).map((_, i) => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridClass} gap-3.5`}>
      {metrics.map((metric, index) => (
        <AnimatedMetricCard
          key={metric.key || index}
          label={metric.label}
          value={metric.value}
          format={metric.format || 'number'}
          suffix={metric.suffix || ''}
          prefix={metric.prefix || ''}
          trend={metric.trend}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
