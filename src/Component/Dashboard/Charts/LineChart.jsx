/**
 * LineChart Component
 * Line chart premium con gradientes y animaciones
 */
import { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { lineChartOptions, colors, createGradient } from './chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function LineChart({
  data,
  height = 220,
  showGradient = true,
  smooth = true,
  options = {}
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;

    if (chart && showGradient) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;

      if (chartArea) {
        // Update gradient
        chart.data.datasets.forEach((dataset) => {
          if (dataset.fill) {
            dataset.backgroundColor = createGradient(ctx, chartArea);
          }
        });
        chart.update('none');
      }
    }
  }, [showGradient]);

  // Preparar datos con estilos premium
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || colors.primary,
      backgroundColor: showGradient
        ? colors.gradient.start
        : dataset.backgroundColor || 'transparent',
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#fff',
      pointBorderColor: dataset.borderColor || colors.primary,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: dataset.borderColor || colors.primary,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      tension: smooth ? 0.4 : 0,
      fill: showGradient
    }))
  };

  const mergedOptions = {
    ...lineChartOptions,
    ...options
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Line ref={chartRef} data={chartData} options={mergedOptions} />
    </div>
  );
}
