/**
 * Chart.js Configuration
 * Configuración global premium para todos los charts
 */

// Colores del design system
export const colors = {
  primary: '#40086d',      // deep-purple
  primaryLight: '#7c3aed', // lighter purple
  secondary: '#dccaf4',    // lilac
  accent: '#ede0f8',       // lilac-soft
  text: '#1e1e1e',         // black
  textMuted: 'rgba(30, 30, 30, 0.55)',
  border: '#dccaf4',
  background: '#f6f6f6',
  gradient: {
    start: 'rgba(64, 8, 109, 0.2)',
    end: 'rgba(64, 8, 109, 0.01)'
  }
};

// Opciones globales para todos los charts
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false, // Usaremos leyendas custom
    },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primary,
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      titleFont: {
        family: "'Noto Serif', serif",
        size: 13,
        weight: 'bold'
      },
      bodyFont: {
        family: "'DM Sans', sans-serif",
        size: 12
      },
      callbacks: {
        title: (tooltipItems) => {
          return tooltipItems[0].label;
        }
      }
    }
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  }
};

// Opciones específicas para Line Charts
export const lineChartOptions = {
  ...defaultOptions,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: "'DM Sans', sans-serif",
          size: 11
        },
        color: colors.textMuted
      },
      border: {
        display: false
      }
    },
    y: {
      grid: {
        color: colors.secondary,
        lineWidth: 0.5
      },
      ticks: {
        font: {
          family: "'DM Sans', sans-serif",
          size: 11
        },
        color: colors.textMuted,
        padding: 8
      },
      border: {
        display: false
      }
    }
  }
};

// Opciones específicas para Bar Charts
export const barChartOptions = {
  ...defaultOptions,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: "'DM Sans', sans-serif",
          size: 11
        },
        color: colors.textMuted
      },
      border: {
        display: false
      }
    },
    y: {
      grid: {
        color: colors.secondary,
        lineWidth: 0.5
      },
      ticks: {
        font: {
          family: "'DM Sans', sans-serif",
          size: 11
        },
        color: colors.textMuted,
        padding: 8
      },
      border: {
        display: false
      },
      beginAtZero: true
    }
  }
};

// Opciones para Doughnut Charts
export const doughnutChartOptions = {
  ...defaultOptions,
  cutout: '70%',
  plugins: {
    ...defaultOptions.plugins,
    legend: {
      display: false
    }
  }
};

// Crear gradient para backgrounds
export const createGradient = (ctx, chartArea) => {
  if (!chartArea) return null;

  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, colors.gradient.end);
  gradient.addColorStop(1, colors.gradient.start);
  return gradient;
};
