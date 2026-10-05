/**
 * ReportsPage Component
 * Página completa de reportes y analytics cross-platform
 * Incluye: métricas unificadas, forecasts, comparaciones y recomendaciones
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../../Component/PageTransition";
import { TopTabs } from "../../Component/Dashboard";
import ErrorBoundary from "../../Component/ErrorBoundary";
import {
  MetricCard,
  ForecastCard,
  ComparisonCard,
  InsightCard
} from "../../Component/Analytics";
import {
  getCompleteReportData,
  formatReportForDisplay
} from "../../services/socialMediaApi";
import {
  exportToPDF,
  exportToCSV
} from "../../services/reportExport";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  DollarSign,
  Download,
  FileText,
  Calendar
} from "lucide-react";

// Tab content animation variants
const tabContentVariants = {
  hidden: { opacity: 0, y: 3 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -3 }
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [error, setError] = useState(null);

  const tabs = [
    "Overview",
    "Forecasts",
    "Comparison",
    "Content Strategy",
    "Ads Performance"
  ];

  const periods = [
    { label: "7 días", value: 7 },
    { label: "30 días", value: 30 },
    { label: "60 días", value: 60 },
    { label: "90 días", value: 90 }
  ];

  // Fetch report data
  const fetchReportData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getCompleteReportData(selectedPeriod);
      const formattedData = formatReportForDisplay(data);

      setReportData(formattedData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Error al cargar los datos del reporte');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Handle export
  const handleExport = async (format) => {
    if (!reportData) {
      console.error('No hay datos para exportar');
      return;
    }

    try {
      if (format === 'pdf') {
        await exportToPDF(reportData);
      } else if (format === 'csv') {
        exportToCSV(reportData);
      }
    } catch (error) {
      console.error(`Error al exportar como ${format}:`, error);
      alert(`Error al exportar el reporte: ${error.message}`);
    }
  };

  if (error) {
    return (
      <PageTransition className="flex min-h-screen bg-[#f6f6f6]">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-[24px] font-['Noto_Serif'] font-bold text-[#40086d] mb-3">
              Error al cargar reportes
            </h2>
            <p className="text-[13.5px] text-[rgba(30,30,30,0.55)] mb-4">
              {error}
            </p>
            <button
              onClick={fetchReportData}
              className="px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#6b21a8] transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex min-h-screen bg-[#f6f6f6]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Premium Top Navigation Tabs */}
        <TopTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Header with filters and export */}
        <div className="px-8 pt-6 pb-4 border-b border-[#dccaf4] bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-['Noto_Serif'] font-bold text-[#40086d] mb-1">
                Reportes y Analytics
              </h1>
              <p className="text-[12px] text-[rgba(30,30,30,0.55)]">
                {reportData?.metadata?.generatedAt
                  ? `Generado: ${new Date(reportData.metadata.generatedAt).toLocaleString('es-ES')}`
                  : 'Cargando...'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Period selector */}
              <div className="flex items-center gap-2 bg-[#f6f6f6] rounded-lg p-1">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`
                      px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all
                      ${selectedPeriod === period.value
                        ? 'bg-[#40086d] text-white'
                        : 'text-[rgba(30,30,30,0.6)] hover:text-[#40086d]'}
                    `}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              {/* Export buttons */}
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#6b21a8] transition-colors text-[11px] font-semibold"
              >
                <FileText className="w-4 h-4" />
                Exportar PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#40086d] text-[#40086d] rounded-lg hover:bg-[#ede0f8] transition-colors text-[11px] font-semibold"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content Area with Premium Spacing */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                <ErrorBoundary>
                  <OverviewSection
                    data={reportData}
                    isLoading={isLoading}
                    period={selectedPeriod}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* FORECASTS TAB */}
            {activeTab === "forecasts" && (
              <motion.div
                key="forecasts"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                <ErrorBoundary>
                  <ForecastsSection
                    data={reportData}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* COMPARISON TAB */}
            {activeTab === "comparison" && (
              <motion.div
                key="comparison"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                <ErrorBoundary>
                  <ComparisonSection
                    data={reportData}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* CONTENT STRATEGY TAB */}
            {activeTab === "content strategy" && (
              <motion.div
                key="content-strategy"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                <ErrorBoundary>
                  <ContentStrategySection
                    data={reportData}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {/* ADS PERFORMANCE TAB */}
            {activeTab === "ads performance" && (
              <motion.div
                key="ads-performance"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                <ErrorBoundary>
                  <AdsPerformanceSection
                    data={reportData}
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

// ============ OVERVIEW SECTION ============
function OverviewSection({ data, isLoading, period }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const metrics = data.keyMetrics || {};

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Alcance Total"
          value={metrics.totalReach || 0}
          icon={Users}
          platform="unified"
          format="number"
          description={`Últimos ${period} días`}
        />
        <MetricCard
          label="Impresiones"
          value={metrics.totalImpressions || 0}
          icon={Eye}
          platform="unified"
          format="number"
          description={`Últimos ${period} días`}
        />
        <MetricCard
          label="Engagement"
          value={metrics.totalEngagement || 0}
          icon={Heart}
          platform="unified"
          format="number"
          description={`Últimos ${period} días`}
        />
        <MetricCard
          label="Inversión en Ads"
          value={metrics.totalAdSpend || 0}
          prefix="$"
          icon={DollarSign}
          platform="ads"
          format="currency"
          description={`Últimos ${period} días`}
        />
      </div>

      {/* Platform Performance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-[16px] font-['Noto_Serif'] font-bold text-[#40086d]">
            Instagram Performance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Seguidores"
              value={data.platformPerformance?.instagram?.followers || 0}
              icon={Users}
              platform="instagram"
              format="number"
            />
            <MetricCard
              label="Engagement"
              value={data.platformPerformance?.instagram?.engagement || 0}
              icon={Heart}
              platform="instagram"
              format="number"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[16px] font-['Noto_Serif'] font-bold text-[#40086d]">
            Facebook Performance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Fans"
              value={data.platformPerformance?.facebook?.fans || 0}
              icon={Users}
              platform="facebook"
              format="number"
            />
            <MetricCard
              label="Engagement"
              value={data.platformPerformance?.facebook?.engagement || 0}
              icon={Heart}
              platform="facebook"
              format="number"
            />
          </div>
        </div>
      </div>

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <InsightCard
          type="insight"
          title="Insights Principales"
          recommendations={data.insights.slice(0, 5)}
        />
      )}
    </div>
  );
}

// ============ FORECASTS SECTION ============
function ForecastsSection({ data, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data?.forecasts) {
    return <EmptyState message="No hay pronósticos disponibles" />;
  }

  const forecast = data.forecasts.audienceGrowth || {};

  return (
    <div className="space-y-6">
      <ForecastCard
        title="Pronóstico de Crecimiento de Audiencia"
        currentValue={forecast.current || 0}
        predictedValue={forecast.predicted || 0}
        timeline={forecast.timeline || []}
        confidence={85}
        growthRate={forecast.growthRate || 0}
        daysAhead={30}
        insights={[
          "Tu audiencia está creciendo a un ritmo constante",
          "Mantén la consistencia en tus publicaciones para alcanzar este objetivo",
          "Considera aumentar la frecuencia de posts en horarios pico"
        ]}
      />
    </div>
  );
}

// ============ COMPARISON SECTION ============
function ComparisonSection({ data, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data?.platformPerformance) {
    return <EmptyState message="No hay datos de comparación disponibles" />;
  }

  return (
    <div className="space-y-6">
      <ComparisonCard
        instagramData={data.platformPerformance.instagram || {}}
        facebookData={data.platformPerformance.facebook || {}}
        betterPlatform={data.platformPerformance.betterPlatform || 'instagram'}
        recommendation="Instagram está generando mejor engagement. Considera cross-postear contenido de alto rendimiento a Facebook."
        metrics={['engagement', 'reach', 'followers']}
      />
    </div>
  );
}

// ============ CONTENT STRATEGY SECTION ============
function ContentStrategySection({ data, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data?.recommendations) {
    return <EmptyState message="No hay recomendaciones disponibles" />;
  }

  const recs = data.recommendations;

  return (
    <div className="space-y-6">
      <InsightCard
        type="strategy"
        title="Estrategia de Contenido Recomendada"
        content="Basado en el análisis de tus últimas publicaciones y el comportamiento de tu audiencia, estas son nuestras recomendaciones para maximizar tu alcance y engagement."
        contentTypes={recs.contentTypes || ['Photos', 'Reels', 'Stories']}
        bestTimes={recs.bestTimes || ['9:00 AM', '1:00 PM', '7:00 PM']}
        themes={recs.themes || ['lifestyle', 'tutorial', 'behind-the-scenes']}
        frequency={recs.frequency || '3-4 posts por semana'}
        expectedImprovement={recs.expectedImprovement || 25}
      />
    </div>
  );
}

// ============ ADS PERFORMANCE SECTION ============
function AdsPerformanceSection({ data, isLoading }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!data?.adsPerformance) {
    return <EmptyState message="No hay datos de anuncios disponibles" />;
  }

  const ads = data.adsPerformance;

  return (
    <div className="space-y-6">
      {/* Ads metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Total Invertido"
          value={ads.totalSpend || 0}
          prefix="$"
          icon={DollarSign}
          platform="ads"
          format="currency"
        />
        <MetricCard
          label="ROAS Promedio"
          value={ads.averageROAS || 0}
          suffix="x"
          icon={TrendingUp}
          platform="ads"
          format="decimal"
        />
        <MetricCard
          label="Campañas Activas"
          value={ads.totalCampaigns || 0}
          icon={Calendar}
          platform="ads"
          format="number"
        />
      </div>

      {/* Optimization suggestions */}
      {ads.suggestions && ads.suggestions.length > 0 && (
        <InsightCard
          type="recommendation"
          title="Optimización de Anuncios"
          recommendations={ads.suggestions}
        />
      )}
    </div>
  );
}

// ============ LOADING STATE ============
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#40086d] border-t-transparent mb-4"></div>
        <p className="text-[13.5px] text-[rgba(30,30,30,0.55)]">
          Cargando reportes...
        </p>
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({ message = "No hay datos disponibles" }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-[24px] font-['Noto_Serif'] font-bold text-[#40086d] mb-3">
        {message}
      </h2>
      <p className="text-[13.5px] text-[rgba(30,30,30,0.55)]">
        Conecta tus redes sociales para ver reportes y analytics
      </p>
    </div>
  );
}
