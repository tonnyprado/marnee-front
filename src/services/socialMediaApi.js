// src/services/socialMediaApi.js
/**
 * Social Media API Service - Unified Cross-Platform
 *
 * Incluye:
 * - Facebook Pages (publicación + analytics)
 * - Facebook Ads (gestión + ROI)
 * - Analytics Unificado (IG + FB + Ads)
 * - Forecasting/Pronósticos con IA
 * - Leads Management
 */
import apiClient from '../core/services/ApiClient';

const API_BASE_URL = process.env.REACT_APP_API_MARNEE || 'http://127.0.0.1:8000/api/v1';

// ============ FACEBOOK PAGES ============

/**
 * Publicar texto/link en Facebook Page
 */
export const publishFacebookTextPost = async (pageId, message, link = null, scheduledTime = null) => {
  try {
    const params = new URLSearchParams();
    params.append('message', message);
    if (link) params.append('link', link);
    if (scheduledTime) params.append('scheduled_time', scheduledTime);

    const response = await apiClient.post(
      `${API_BASE_URL}/facebook/pages/${pageId}/publish/text?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing FB text:', error.message);
    throw error;
  }
};

/**
 * Publicar foto en Facebook Page
 */
export const publishFacebookPhoto = async (pageId, photoUrl, caption = null) => {
  try {
    const params = new URLSearchParams();
    params.append('photo_url', photoUrl);
    if (caption) params.append('caption', caption);

    const response = await apiClient.post(
      `${API_BASE_URL}/facebook/pages/${pageId}/publish/photo?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing FB photo:', error.message);
    throw error;
  }
};

/**
 * Publicar video en Facebook Page
 */
export const publishFacebookVideo = async (pageId, videoUrl, caption = null) => {
  try {
    const params = new URLSearchParams();
    params.append('video_url', videoUrl);
    if (caption) params.append('caption', caption);

    const response = await apiClient.post(
      `${API_BASE_URL}/facebook/pages/${pageId}/publish/video?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error publishing FB video:', error.message);
    throw error;
  }
};

/**
 * Obtener analytics de Facebook Page
 */
export const getFacebookPageAnalytics = async (pageId, period = 'day') => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/facebook/pages/${pageId}/analytics`,
      { params: { period } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching FB analytics:', error.message);
    throw error;
  }
};

/**
 * Obtener posts recientes de Facebook Page
 */
export const getFacebookPagePosts = async (pageId, limit = 25, days = 30) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/facebook/pages/${pageId}/posts`,
      { params: { limit, days } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching FB posts:', error.message);
    throw error;
  }
};

// ============ FACEBOOK ADS ============

/**
 * Obtener cuentas publicitarias del usuario
 */
export const getAdAccounts = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/facebook/ads/accounts`);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching ad accounts:', error.message);
    throw error;
  }
};

/**
 * Crear nueva campaña de ads
 */
export const createAdCampaign = async (adAccountId, name, objective, startImmediately = false) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/facebook/ads/campaigns`,
      {
        ad_account_id: adAccountId,
        name,
        objective,
        start_immediately: startImmediately
      }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error creating campaign:', error.message);
    throw error;
  }
};

/**
 * Obtener performance de campaña
 */
export const getCampaignPerformance = async (campaignId, days = 7) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/facebook/ads/campaigns/${campaignId}/performance`,
      { params: { days } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching campaign performance:', error.message);
    throw error;
  }
};

/**
 * Obtener todas las campañas de una cuenta
 */
export const getAllCampaigns = async (adAccountId, activeOnly = false) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/facebook/ads/accounts/${adAccountId}/campaigns`,
      { params: { active_only: activeOnly } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching campaigns:', error.message);
    throw error;
  }
};

/**
 * IA: ¿Debo promocionar este post como ad?
 */
export const suggestPostPromotion = async (postEngagement, currentBudget = null) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/facebook/ads/suggest-promotion`,
      {
        post_engagement: postEngagement,
        current_budget: currentBudget
      }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error suggesting promotion:', error.message);
    throw error;
  }
};

// ============ ANALYTICS UNIFICADO ============

/**
 * Vista general unificada: Instagram + Facebook + Ads
 * ESTE ES EL ENDPOINT PRINCIPAL PARA REPORTES
 */
export const getUnifiedAnalyticsOverview = async (days = 30) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/analytics/unified-overview`,
      { params: { days } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching unified analytics:', error.message);
    throw error;
  }
};

/**
 * Comparación de performance: Instagram vs Facebook
 */
export const getContentPerformanceComparison = async (days = 30) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/analytics/content-comparison`,
      { params: { days } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching content comparison:', error.message);
    throw error;
  }
};

/**
 * Análisis de ROI de ads
 */
export const getAdsROIAnalysis = async (days = 30) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/analytics/ads-roi`,
      { params: { days } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching ads ROI:', error.message);
    throw error;
  }
};

// ============ FORECASTING / PRONÓSTICOS ============

/**
 * Pronóstico de crecimiento de audiencia
 */
export const forecastAudienceGrowth = async (daysAhead = 30) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/analytics/forecast/audience-growth`,
      { params: { days_ahead: daysAhead } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error forecasting growth:', error.message);
    throw error;
  }
};

/**
 * Pronóstico de engagement de próximo post
 */
export const forecastNextPostEngagement = async (nextPostType = 'photo') => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/analytics/forecast/engagement`,
      null,
      { params: { next_post_type: nextPostType } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error forecasting engagement:', error.message);
    throw error;
  }
};

/**
 * Pronóstico de performance de nueva campaña de ads
 */
export const forecastAdCampaign = async (proposedBudget) => {
  try {
    const response = await apiClient.post(
      `${API_BASE_URL}/analytics/forecast/ad-performance`,
      null,
      { params: { proposed_budget: proposedBudget } }
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error forecasting ad performance:', error.message);
    throw error;
  }
};

/**
 * Recomendaciones de estrategia de contenido (IA)
 */
export const getContentStrategyRecommendations = async () => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/analytics/recommendations/content-strategy`
    );
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching recommendations:', error.message);
    throw error;
  }
};

// ============ HELPERS PARA REPORTES ============

/**
 * Obtener TODOS los datos necesarios para el reporte completo
 * Esta función llama a todos los endpoints necesarios
 */
export const getCompleteReportData = async (days = 30) => {
  try {
    const [
      unifiedOverview,
      contentComparison,
      adsROI,
      audienceGrowth,
      contentStrategy
    ] = await Promise.all([
      getUnifiedAnalyticsOverview(days),
      getContentPerformanceComparison(days),
      getAdsROIAnalysis(days),
      forecastAudienceGrowth(30),
      getContentStrategyRecommendations()
    ]);

    return {
      overview: unifiedOverview,
      comparison: contentComparison,
      ads: adsROI,
      forecast: audienceGrowth,
      recommendations: contentStrategy,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching complete report:', error.message);
    throw error;
  }
};

/**
 * Exportar reporte en formato para visualización
 */
export const formatReportForDisplay = (reportData) => {
  return {
    // Métricas clave del período
    keyMetrics: {
      totalReach: reportData.overview?.unified_metrics?.total_reach || 0,
      totalImpressions: reportData.overview?.unified_metrics?.total_impressions || 0,
      totalEngagement: reportData.overview?.unified_metrics?.total_engagement || 0,
      totalAdSpend: reportData.overview?.unified_metrics?.total_ad_spend || 0,
      topPlatform: reportData.overview?.top_performing_platform || 'instagram'
    },

    // Performance por plataforma
    platformPerformance: {
      instagram: reportData.overview?.instagram || {},
      facebook: reportData.overview?.facebook || {},
      betterPlatform: reportData.comparison?.comparison?.better_platform || 'instagram'
    },

    // Ads Performance
    adsPerformance: {
      totalCampaigns: reportData.ads?.total_campaigns || 0,
      totalSpend: reportData.ads?.total_spend || 0,
      averageROAS: reportData.ads?.average_roas || 0,
      bestCampaign: reportData.ads?.best_campaign,
      suggestions: reportData.ads?.optimization_suggestions || []
    },

    // Pronósticos
    forecasts: {
      audienceGrowth: {
        current: reportData.forecast?.current_followers || 0,
        predicted: reportData.forecast?.predicted_followers || 0,
        growthRate: reportData.forecast?.growth_rate || 0,
        timeline: reportData.forecast?.prediction_timeline || []
      }
    },

    // Recomendaciones
    recommendations: {
      contentTypes: reportData.recommendations?.recommended_post_types || [],
      frequency: reportData.recommendations?.recommended_frequency || 'N/A',
      bestTimes: reportData.recommendations?.best_posting_times || [],
      themes: reportData.recommendations?.content_themes || [],
      expectedImprovement: reportData.recommendations?.expected_improvement || 0
    },

    // Insights combinados
    insights: [
      ...(reportData.overview?.insights || []),
      ...(reportData.comparison?.comparison?.recommendation ? [reportData.comparison.comparison.recommendation] : []),
      ...(reportData.forecast?.insights || []),
      ...(reportData.recommendations?.insights || [])
    ],

    // Metadata
    metadata: {
      generatedAt: reportData.generated_at,
      period: `Últimos ${reportData.overview?.period_days || 30} días`,
      platforms: reportData.overview?.unified_metrics?.combined_platforms || 2
    }
  };
};
