/**
 * Instagram Mock Data
 * Datos de demostración para el proceso de review de Meta
 *
 * Para activar el modo demo, configura en .env:
 * REACT_APP_INSTAGRAM_DEMO_MODE=true
 */

export const MOCK_INSTAGRAM_STATUS = {
  connected: true,
  username: 'marnee_demo',
  accountId: '123456789',
  accountType: 'BUSINESS',
  profilePictureUrl: 'https://via.placeholder.com/150',
  followersCount: 12847,
  followsCount: 892,
  mediaCount: 247
};

export const MOCK_INSTAGRAM_INSIGHTS = {
  // Métricas principales
  reach: 128400,
  impressions: 156800,
  engagement_rate: 4.2,
  reel_plays: 89100,
  follower_growth: 347,
  profile_views: 15600,
  website_clicks: 1240,

  // Reach por día (últimos 7 días)
  reach_by_day: [15400, 18200, 21100, 19800, 23400, 28100, 26700],

  // Engagement por hora del día (mejores horarios)
  engagement_by_hour: [45, 72, 88, 95, 78, 52],

  // Distribución de tipos de contenido (porcentajes)
  content_distribution: [45, 25, 20, 10], // Reels, Posts, Carousels, Stories

  // Métricas detalladas por día
  daily_metrics: [
    { date: '2026-07-03', reach: 15400, impressions: 18900, engagement: 648 },
    { date: '2026-07-04', reach: 18200, impressions: 22100, engagement: 764 },
    { date: '2026-07-05', reach: 21100, impressions: 25600, engagement: 886 },
    { date: '2026-07-06', reach: 19800, impressions: 24200, engagement: 831 },
    { date: '2026-07-07', reach: 23400, impressions: 28700, engagement: 983 },
    { date: '2026-07-08', reach: 28100, impressions: 34500, engagement: 1180 },
    { date: '2026-07-09', reach: 26700, impressions: 32800, engagement: 1121 }
  ]
};

export const MOCK_INSTAGRAM_MEDIA = {
  media: [
    {
      id: 'mock_post_1',
      media_type: 'CAROUSEL_ALBUM',
      media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock1',
      caption: '5 tips para crear contenido que realmente conecta con tu audiencia 🎯✨ ¿Cuál es tu favorito?',
      timestamp: '2026-07-08T14:30:00+0000',
      like_count: 1247,
      comments_count: 89,
      engagement_rate: 5.2,
      reach: 25600,
      impressions: 31400,
      saves: 342
    },
    {
      id: 'mock_post_2',
      media_type: 'VIDEO',
      media_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock2',
      caption: 'Tutorial completo de cómo optimizar tu perfil de Instagram para negocios 📱💼',
      timestamp: '2026-07-07T11:15:00+0000',
      like_count: 2156,
      comments_count: 143,
      engagement_rate: 6.8,
      reach: 33800,
      impressions: 41200,
      saves: 589,
      video_views: 28900
    },
    {
      id: 'mock_post_3',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock3',
      caption: 'El secreto del contenido viral está en la autenticidad, no en la perfección ✨',
      timestamp: '2026-07-06T16:45:00+0000',
      like_count: 1893,
      comments_count: 124,
      engagement_rate: 4.9,
      reach: 41200,
      impressions: 48700,
      saves: 421
    },
    {
      id: 'mock_post_4',
      media_type: 'CAROUSEL_ALBUM',
      media_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock4',
      caption: 'Estadísticas que todo creador de contenido debe conocer en 2026 📊',
      timestamp: '2026-07-05T13:20:00+0000',
      like_count: 1654,
      comments_count: 97,
      engagement_rate: 4.7,
      reach: 37300,
      impressions: 44100,
      saves: 512
    },
    {
      id: 'mock_post_5',
      media_type: 'VIDEO',
      media_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock5',
      caption: 'Detrás de cámaras de nuestro proceso creativo 🎬✨',
      timestamp: '2026-07-04T10:00:00+0000',
      like_count: 2341,
      comments_count: 167,
      engagement_rate: 7.1,
      reach: 35200,
      impressions: 42800,
      saves: 678,
      video_views: 31500
    },
    {
      id: 'mock_post_6',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop',
      permalink: 'https://www.instagram.com/p/mock6',
      caption: 'Lunes de motivación: Tu única competencia eres tú mismo 💪',
      timestamp: '2026-07-03T08:30:00+0000',
      like_count: 1456,
      comments_count: 82,
      engagement_rate: 4.1,
      reach: 37500,
      impressions: 43200,
      saves: 289
    }
  ],
  paging: {
    cursors: {
      before: 'mock_before',
      after: 'mock_after'
    }
  }
};

export const MOCK_INSTAGRAM_PROFILE = {
  id: '123456789',
  username: 'marnee_demo',
  name: 'Marnee Demo Account',
  biography: 'Marketing de contenido inteligente con IA 🚀 | Ayudamos a creadores y negocios a crecer en redes sociales 📈',
  website: 'https://marnee.ai',
  profile_picture_url: 'https://via.placeholder.com/150',
  followers_count: 12847,
  follows_count: 892,
  media_count: 247,
  account_type: 'BUSINESS',
  category: 'Marketing Agency'
};

export const MOCK_AUDIENCE_DEMOGRAPHICS = {
  age_gender: [
    { age_range: '13-17', male: 2.1, female: 3.4 },
    { age_range: '18-24', male: 15.8, female: 22.3 },
    { age_range: '25-34', male: 18.9, female: 21.7 },
    { age_range: '35-44', male: 8.2, female: 5.4 },
    { age_range: '45-54', male: 1.4, female: 0.6 },
    { age_range: '55-64', male: 0.1, female: 0.1 }
  ],
  top_countries: [
    { country: 'US', value: 34.5 },
    { country: 'MX', value: 28.7 },
    { country: 'ES', value: 12.3 },
    { country: 'AR', value: 8.9 },
    { country: 'CO', value: 6.2 },
    { country: 'Other', value: 9.4 }
  ],
  top_cities: [
    { city: 'Mexico City, Mexico', value: 18.4 },
    { city: 'Los Angeles, USA', value: 12.7 },
    { city: 'Madrid, Spain', value: 9.8 },
    { city: 'Buenos Aires, Argentina', value: 7.3 },
    { city: 'Bogotá, Colombia', value: 5.1 }
  ]
};

export const MOCK_CONTENT_PERFORMANCE = {
  top_posts: [
    {
      id: 'mock_top_1',
      caption: 'Tutorial completo de Instagram Reels',
      media_type: 'VIDEO',
      engagement_rate: 8.4,
      reach: 45600,
      like_count: 3421,
      comments_count: 289,
      timestamp: '2026-07-01T15:00:00+0000'
    },
    {
      id: 'mock_top_2',
      caption: 'Guía de algoritmo de Instagram 2026',
      media_type: 'CAROUSEL_ALBUM',
      engagement_rate: 7.9,
      reach: 42100,
      like_count: 2987,
      comments_count: 234,
      timestamp: '2026-06-28T12:30:00+0000'
    },
    {
      id: 'mock_top_3',
      caption: 'Errores comunes en marketing digital',
      media_type: 'VIDEO',
      engagement_rate: 7.2,
      reach: 38900,
      like_count: 2543,
      comments_count: 198,
      timestamp: '2026-06-25T14:15:00+0000'
    }
  ],
  performance_summary: {
    avg_engagement_rate: 5.8,
    avg_reach: 35400,
    total_engagement: 45678,
    best_posting_day: 'Tuesday',
    best_posting_hour: '6pm'
  }
};

export const MOCK_INSTAGRAM_ANALYSIS = {
  summary: 'Tu cuenta de Instagram muestra un crecimiento constante con un engagement superior al promedio de tu industria. El contenido de video (Reels) genera 2.3x más engagement que las imágenes estáticas.',
  strengths: [
    'Alto engagement rate (4.2% vs 2.8% promedio de industria)',
    'Crecimiento consistente de followers (+15.7% este mes)',
    'Excelente performance de Reels (89K plays)',
    'Horarios de publicación optimizados (6pm genera más engagement)'
  ],
  opportunities: [
    'Aumentar frecuencia de publicación de Reels (actualmente 45% del contenido)',
    'Explorar más contenido en carrusel (solo 20% actual)',
    'Aprovechar Stories para engagement diario',
    'Optimizar captions para aumentar saves'
  ],
  recommendations: [
    'Publicar 3-4 Reels por semana entre 5-7pm',
    'Crear contenido educativo en formato carrusel',
    'Usar CTAs más fuertes en captions',
    'Responder a comentarios en las primeras 2 horas'
  ],
  sentiment: 'positive',
  growth_trend: 'increasing',
  engagement_trend: 'stable'
};

// Helper para verificar si el modo demo está activado
export const isInstagramDemoMode = () => {
  return process.env.REACT_APP_INSTAGRAM_DEMO_MODE === 'true';
};
