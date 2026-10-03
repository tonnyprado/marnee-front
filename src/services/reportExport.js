/**
 * Report Export Service
 * Funciones para exportar reportes en PDF y CSV
 */

// ============ CSV EXPORT ============

/**
 * Exportar reporte completo a CSV
 */
export const exportToCSV = (reportData) => {
  if (!reportData) {
    throw new Error('No hay datos para exportar');
  }

  // Crear array de datos para CSV
  const csvData = [];

  // Header
  csvData.push(['Marnee - Reporte de Analytics']);
  csvData.push(['Generado:', new Date().toLocaleString('es-ES')]);
  csvData.push(['Período:', reportData.metadata?.period || 'N/A']);
  csvData.push([]); // Empty row

  // Key Metrics Section
  csvData.push(['MÉTRICAS CLAVE']);
  csvData.push(['Métrica', 'Valor']);

  const metrics = reportData.keyMetrics || {};
  csvData.push(['Alcance Total', metrics.totalReach || 0]);
  csvData.push(['Impresiones Totales', metrics.totalImpressions || 0]);
  csvData.push(['Engagement Total', metrics.totalEngagement || 0]);
  csvData.push(['Inversión en Ads', `$${(metrics.totalAdSpend || 0).toFixed(2)}`]);
  csvData.push([]); // Empty row

  // Platform Performance
  csvData.push(['PERFORMANCE POR PLATAFORMA']);
  csvData.push(['Plataforma', 'Seguidores', 'Engagement', 'Alcance']);

  const instagram = reportData.platformPerformance?.instagram || {};
  const facebook = reportData.platformPerformance?.facebook || {};

  csvData.push([
    'Instagram',
    instagram.followers || 0,
    instagram.engagement || 0,
    instagram.reach || 0
  ]);
  csvData.push([
    'Facebook',
    facebook.fans || 0,
    facebook.engagement || 0,
    facebook.reach || 0
  ]);
  csvData.push([]); // Empty row

  // Ads Performance
  if (reportData.adsPerformance) {
    csvData.push(['PERFORMANCE DE ANUNCIOS']);
    csvData.push(['Métrica', 'Valor']);

    const ads = reportData.adsPerformance;
    csvData.push(['Total Invertido', `$${(ads.totalSpend || 0).toFixed(2)}`]);
    csvData.push(['ROAS Promedio', `${(ads.averageROAS || 0).toFixed(2)}x`]);
    csvData.push(['Campañas Activas', ads.totalCampaigns || 0]);
    csvData.push([]); // Empty row
  }

  // Forecasts
  if (reportData.forecasts?.audienceGrowth) {
    csvData.push(['PRONÓSTICOS']);
    csvData.push(['Métrica', 'Valor']);

    const forecast = reportData.forecasts.audienceGrowth;
    csvData.push(['Seguidores Actuales', forecast.current || 0]);
    csvData.push(['Seguidores Predichos', forecast.predicted || 0]);
    csvData.push(['Tasa de Crecimiento', `${(forecast.growthRate || 0).toFixed(2)}%`]);
    csvData.push([]); // Empty row
  }

  // Recommendations
  if (reportData.recommendations) {
    csvData.push(['RECOMENDACIONES']);

    const recs = reportData.recommendations;

    if (recs.contentTypes?.length > 0) {
      csvData.push(['Tipos de Contenido:', recs.contentTypes.join(', ')]);
    }
    if (recs.bestTimes?.length > 0) {
      csvData.push(['Mejores Horarios:', recs.bestTimes.join(', ')]);
    }
    if (recs.frequency) {
      csvData.push(['Frecuencia Recomendada:', recs.frequency]);
    }
    if (recs.expectedImprovement) {
      csvData.push(['Mejora Esperada:', `${recs.expectedImprovement}%`]);
    }
    csvData.push([]); // Empty row
  }

  // Insights
  if (reportData.insights?.length > 0) {
    csvData.push(['INSIGHTS PRINCIPALES']);
    reportData.insights.forEach((insight, i) => {
      csvData.push([`${i + 1}.`, insight]);
    });
  }

  // Convert to CSV string
  const csvContent = csvData
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `marnee-report-${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exportar métricas específicas a CSV
 */
export const exportMetricsToCSV = (metrics, filename = 'metrics') => {
  const csvData = [
    ['Métrica', 'Valor']
  ];

  Object.entries(metrics).forEach(([key, value]) => {
    csvData.push([key, value]);
  });

  const csvContent = csvData
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ============ PDF EXPORT ============

/**
 * Exportar reporte completo a PDF
 * Nota: Requiere jsPDF (npm install jspdf jspdf-autotable)
 */
export const exportToPDF = async (reportData) => {
  if (!reportData) {
    throw new Error('No hay datos para exportar');
  }

  // Dynamic import for jsPDF (si no está instalado, fallback a descarga HTML)
  let jsPDF, autoTable;

  try {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.default;

    const autoTableModule = await import('jspdf-autotable');
    autoTable = autoTableModule.default;
  } catch (error) {
    console.warn('jsPDF no está instalado. Usando fallback HTML.');
    return exportToHTMLPrint(reportData);
  }

  // Create PDF
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(64, 8, 109); // #40086d
  doc.text('Marnee - Reporte de Analytics', 20, 20);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 20, 30);
  doc.text(`Período: ${reportData.metadata?.period || 'N/A'}`, 20, 36);

  let yPosition = 50;

  // Key Metrics Section
  doc.setFontSize(14);
  doc.setTextColor(64, 8, 109);
  doc.text('Métricas Clave', 20, yPosition);
  yPosition += 10;

  const metrics = reportData.keyMetrics || {};
  const metricsData = [
    ['Alcance Total', formatNumber(metrics.totalReach || 0)],
    ['Impresiones Totales', formatNumber(metrics.totalImpressions || 0)],
    ['Engagement Total', formatNumber(metrics.totalEngagement || 0)],
    ['Inversión en Ads', `$${(metrics.totalAdSpend || 0).toFixed(2)}`]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Métrica', 'Valor']],
    body: metricsData,
    theme: 'striped',
    headStyles: { fillColor: [64, 8, 109] },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Platform Performance
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(64, 8, 109);
  doc.text('Performance por Plataforma', 20, yPosition);
  yPosition += 10;

  const instagram = reportData.platformPerformance?.instagram || {};
  const facebook = reportData.platformPerformance?.facebook || {};

  const platformData = [
    [
      'Instagram',
      formatNumber(instagram.followers || 0),
      formatNumber(instagram.engagement || 0),
      formatNumber(instagram.reach || 0)
    ],
    [
      'Facebook',
      formatNumber(facebook.fans || 0),
      formatNumber(facebook.engagement || 0),
      formatNumber(facebook.reach || 0)
    ]
  ];

  doc.autoTable({
    startY: yPosition,
    head: [['Plataforma', 'Seguidores', 'Engagement', 'Alcance']],
    body: platformData,
    theme: 'striped',
    headStyles: { fillColor: [64, 8, 109] },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Ads Performance
  if (reportData.adsPerformance) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(64, 8, 109);
    doc.text('Performance de Anuncios', 20, yPosition);
    yPosition += 10;

    const ads = reportData.adsPerformance;
    const adsData = [
      ['Total Invertido', `$${(ads.totalSpend || 0).toFixed(2)}`],
      ['ROAS Promedio', `${(ads.averageROAS || 0).toFixed(2)}x`],
      ['Campañas Activas', ads.totalCampaigns || 0]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Métrica', 'Valor']],
      body: adsData,
      theme: 'striped',
      headStyles: { fillColor: [64, 8, 109] },
      margin: { left: 20, right: 20 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  }

  // Forecasts
  if (reportData.forecasts?.audienceGrowth) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(64, 8, 109);
    doc.text('Pronósticos', 20, yPosition);
    yPosition += 10;

    const forecast = reportData.forecasts.audienceGrowth;
    const forecastData = [
      ['Seguidores Actuales', formatNumber(forecast.current || 0)],
      ['Seguidores Predichos (30 días)', formatNumber(forecast.predicted || 0)],
      ['Tasa de Crecimiento', `${(forecast.growthRate || 0).toFixed(2)}%`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Métrica', 'Valor']],
      body: forecastData,
      theme: 'striped',
      headStyles: { fillColor: [64, 8, 109] },
      margin: { left: 20, right: 20 }
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  }

  // Recommendations
  if (reportData.recommendations) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(64, 8, 109);
    doc.text('Recomendaciones', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const recs = reportData.recommendations;

    if (recs.contentTypes?.length > 0) {
      doc.text(`Tipos de Contenido: ${recs.contentTypes.join(', ')}`, 20, yPosition);
      yPosition += 7;
    }
    if (recs.bestTimes?.length > 0) {
      doc.text(`Mejores Horarios: ${recs.bestTimes.join(', ')}`, 20, yPosition);
      yPosition += 7;
    }
    if (recs.frequency) {
      doc.text(`Frecuencia: ${recs.frequency}`, 20, yPosition);
      yPosition += 7;
    }
    if (recs.expectedImprovement) {
      doc.text(`Mejora Esperada: +${recs.expectedImprovement}%`, 20, yPosition);
      yPosition += 7;
    }
  }

  // Insights
  if (reportData.insights?.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(64, 8, 109);
    doc.text('Insights Principales', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    reportData.insights.slice(0, 8).forEach((insight, i) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }

      const lines = doc.splitTextToSize(`${i + 1}. ${insight}`, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 3;
    });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generado por Marnee - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  doc.save(`marnee-report-${Date.now()}.pdf`);
};

/**
 * Fallback: Export to HTML print view
 */
const exportToHTMLPrint = (reportData) => {
  const printWindow = window.open('', '_blank');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Marnee - Reporte de Analytics</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        h1 {
          color: #40086d;
          border-bottom: 3px solid #40086d;
          padding-bottom: 10px;
        }
        h2 {
          color: #40086d;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #40086d;
          color: white;
        }
        .metric {
          margin-bottom: 10px;
        }
        .insight {
          background: #f6f6f6;
          padding: 10px;
          margin-bottom: 10px;
          border-left: 4px solid #40086d;
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Marnee - Reporte de Analytics</h1>
      <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
      <p><strong>Período:</strong> ${reportData.metadata?.period || 'N/A'}</p>

      <h2>Métricas Clave</h2>
      <table>
        <tr>
          <th>Métrica</th>
          <th>Valor</th>
        </tr>
        <tr><td>Alcance Total</td><td>${formatNumber(reportData.keyMetrics?.totalReach || 0)}</td></tr>
        <tr><td>Impresiones</td><td>${formatNumber(reportData.keyMetrics?.totalImpressions || 0)}</td></tr>
        <tr><td>Engagement</td><td>${formatNumber(reportData.keyMetrics?.totalEngagement || 0)}</td></tr>
        <tr><td>Inversión en Ads</td><td>$${(reportData.keyMetrics?.totalAdSpend || 0).toFixed(2)}</td></tr>
      </table>

      <button onclick="window.print()" style="padding: 10px 20px; background: #40086d; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Imprimir / Guardar como PDF
      </button>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

// ============ HELPER FUNCTIONS ============

function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}
