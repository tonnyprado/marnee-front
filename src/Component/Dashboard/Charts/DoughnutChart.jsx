/**
 * DoughnutChart Component
 * Doughnut chart premium con centro personalizable
 */
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { doughnutChartOptions, colors } from './chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({
  data,
  height = 200,
  centerText,
  centerSubtext,
  options = {}
}) {
  // Preparar datos con estilos premium
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || [
        colors.primary,
        colors.primaryLight,
        colors.secondary,
        colors.accent
      ],
      borderWidth: 0,
      hoverOffset: 8
    }))
  };

  const mergedOptions = {
    ...doughnutChartOptions,
    ...options
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <Doughnut data={chartData} options={mergedOptions} />

      {/* Center text overlay */}
      {centerText && (
        <div className="
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          text-center pointer-events-none
        ">
          <div className="
            font-['Noto_Serif'] text-[28px] font-bold
            text-[#40086d] leading-none
          ">
            {centerText}
          </div>
          {centerSubtext && (
            <div className="text-[11px] text-[rgba(30,30,30,0.55)] mt-1">
              {centerSubtext}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
