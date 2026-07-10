/**
 * TikTok Mock Data
 * Datos de demostración para el proceso de review
 *
 * Para activar el modo demo, configura en .env:
 * REACT_APP_TIKTOK_DEMO_MODE=true
 */

export const MOCK_TIKTOK_STATUS = {
  connected: true,
  username: '@marnee_ai',
  displayName: 'Marnee AI',
  accountId: 'tiktok_123456789',
  verified: false,
  followersCount: 45200,
  followingCount: 487,
  videoCount: 156
};

export const MOCK_TIKTOK_ANALYTICS = {
  // Métricas principales
  total_views: 2840000,
  total_likes: 156800,
  total_shares: 12400,
  total_comments: 8900,
  engagement_rate: 6.3,
  avg_watch_time: 18.4, // segundos
  follower_growth: 2847,
  profile_views: 89400,

  // Views por día (últimos 7 días)
  views_by_day: [342000, 389000, 421000, 398000, 456000, 512000, 482000],

  // Engagement por hora del día
  engagement_by_hour: [52, 68, 85, 92, 78, 64],

  // Distribución de tipos de contenido (porcentajes)
  content_distribution: [65, 20, 10, 5], // Regular videos, Duets, Stitches, Lives

  // Métricas detalladas por día
  daily_metrics: [
    { date: '2026-07-03', views: 342000, likes: 18900, shares: 1420, comments: 890 },
    { date: '2026-07-04', views: 389000, likes: 21500, shares: 1650, comments: 1020 },
    { date: '2026-07-05', views: 421000, likes: 23400, shares: 1780, comments: 1150 },
    { date: '2026-07-06', views: 398000, likes: 22100, shares: 1690, comments: 1080 },
    { date: '2026-07-07', views: 456000, likes: 25300, shares: 1920, comments: 1240 },
    { date: '2026-07-08', views: 512000, likes: 28400, shares: 2150, comments: 1390 },
    { date: '2026-07-09', views: 482000, likes: 26700, shares: 2030, comments: 1310 }
  ]
};

export const MOCK_TIKTOK_VIDEOS = {
  videos: [
    {
      id: 'tiktok_video_1',
      title: 'Cómo crear contenido viral en TikTok 2026 🚀',
      cover_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video1',
      create_time: '2026-07-08T18:30:00+0000',
      duration: 42,
      view_count: 456000,
      like_count: 34500,
      comment_count: 1240,
      share_count: 2890,
      engagement_rate: 8.5,
      avg_watch_time: 28.5
    },
    {
      id: 'tiktok_video_2',
      title: 'Tutorial de edición en CapCut ✨',
      cover_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video2',
      create_time: '2026-07-07T15:20:00+0000',
      duration: 58,
      view_count: 512000,
      like_count: 38900,
      comment_count: 1580,
      share_count: 3240,
      engagement_rate: 8.8,
      avg_watch_time: 32.1
    },
    {
      id: 'tiktok_video_3',
      title: 'Tendencias de marketing digital 2026 📊',
      cover_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video3',
      create_time: '2026-07-06T12:45:00+0000',
      duration: 35,
      view_count: 398000,
      like_count: 29800,
      comment_count: 1120,
      share_count: 2450,
      engagement_rate: 8.2,
      avg_watch_time: 24.8
    },
    {
      id: 'tiktok_video_4',
      title: 'Behind the scenes de mi setup 🎬',
      cover_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video4',
      create_time: '2026-07-05T10:15:00+0000',
      duration: 47,
      view_count: 421000,
      like_count: 31200,
      comment_count: 1340,
      share_count: 2680,
      engagement_rate: 8.4,
      avg_watch_time: 29.3
    },
    {
      id: 'tiktok_video_5',
      title: 'Errores que cometen los creadores 🚫',
      cover_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video5',
      create_time: '2026-07-04T16:00:00+0000',
      duration: 52,
      view_count: 389000,
      like_count: 28400,
      comment_count: 1180,
      share_count: 2340,
      engagement_rate: 8.1,
      avg_watch_time: 27.6
    },
    {
      id: 'tiktok_video_6',
      title: 'Mi rutina de creación de contenido ☀️',
      cover_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=600&fit=crop',
      video_url: 'https://example.com/video6',
      create_time: '2026-07-03T09:30:00+0000',
      duration: 39,
      view_count: 342000,
      like_count: 25600,
      comment_count: 1040,
      share_count: 2120,
      engagement_rate: 7.9,
      avg_watch_time: 25.2
    }
  ],
  total: 156,
  hasMore: true
};

export const MOCK_TIKTOK_PROFILE = {
  id: 'tiktok_123456789',
  username: '@marnee_ai',
  display_name: 'Marnee AI',
  bio: 'Marketing de contenido con IA 🚀 | Tips para creadores | Sígueme para más 📱',
  avatar_url: 'https://via.placeholder.com/150',
  followers_count: 45200,
  following_count: 487,
  likes_count: 892000,
  video_count: 156,
  verified: false
};

export const MOCK_TIKTOK_DEMOGRAPHICS = {
  age_gender: [
    { age_range: '13-17', male: 8.5, female: 12.3 },
    { age_range: '18-24', male: 22.7, female: 28.4 },
    { age_range: '25-34', male: 14.2, female: 9.8 },
    { age_range: '35-44', male: 2.4, female: 1.5 },
    { age_range: '45+', male: 0.1, female: 0.1 }
  ],
  top_countries: [
    { country: 'US', value: 38.5 },
    { country: 'MX', value: 24.7 },
    { country: 'BR', value: 12.3 },
    { country: 'ES', value: 8.9 },
    { country: 'CO', value: 6.2 },
    { country: 'Other', value: 9.4 }
  ],
  top_cities: [
    { city: 'Los Angeles, USA', value: 15.4 },
    { city: 'Mexico City, Mexico', value: 12.7 },
    { city: 'São Paulo, Brazil', value: 9.8 },
    { city: 'Madrid, Spain', value: 7.3 },
    { city: 'Bogotá, Colombia', value: 5.1 }
  ],
  devices: [
    { device: 'iPhone', value: 45.2 },
    { device: 'Android', value: 52.8 },
    { device: 'Other', value: 2.0 }
  ]
};

export const MOCK_TIKTOK_ANALYSIS = {
  summary: 'Tu cuenta de TikTok muestra un crecimiento explosivo con engagement excepcional. Los videos cortos (35-45 segundos) generan 3.2x más shares que los videos largos.',
  strengths: [
    'Engagement rate excepcional (6.3% vs 3.5% promedio)',
    'Crecimiento viral de followers (+2,847 este mes)',
    'Excelente retención de audiencia (18.4s promedio)',
    'Horarios de publicación optimizados (3pm-6pm genera más views)'
  ],
  opportunities: [
    'Aumentar frecuencia de duetos (solo 20% del contenido)',
    'Experimentar con TikTok Lives para engagement directo',
    'Usar más trending sounds (aumenta descubrimiento)',
    'Crear series de videos para retención de audiencia'
  ],
  recommendations: [
    'Publicar 5-7 videos por semana entre 3-6pm',
    'Crear contenido de 35-45 segundos de duración',
    'Usar CTAs claros en los primeros 3 segundos',
    'Responder a comentarios en la primera hora'
  ],
  sentiment: 'very_positive',
  growth_trend: 'rapidly_increasing',
  engagement_trend: 'increasing',
  viral_score: 8.7
};

// Helper para verificar si el modo demo está activado
export const isTikTokDemoMode = () => {
  return process.env.REACT_APP_TIKTOK_DEMO_MODE === 'true';
};
