/**
 * BarChart Component
 * Bar chart premium con bordes redondeados y animaciones
 */
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { barChartOptions, colors } from './chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({
  data,
  height = 220,
  horizontal = false,
  options = {}
}) {
  // Preparar datos con estilos premium
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colors.primary,
      borderColor: dataset.borderColor || colors.primary,
      borderWidth: 0,
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 'flex',
      maxBarThickness: 40,
      hoverBackgroundColor: colors.primaryLight
    }))
  };

  const mergedOptions = {
    ...barChartOptions,
    indexAxis: horizontal ? 'y' : 'x',
    ...options
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Bar data={chartData} options={mergedOptions} />
    </div>
  );
}
