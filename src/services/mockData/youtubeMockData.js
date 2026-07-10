/**
 * YouTube Mock Data
 * Datos de demostración para el proceso de review
 *
 * Para activar el modo demo, configura en .env:
 * REACT_APP_YOUTUBE_DEMO_MODE=true
 */

export const MOCK_YOUTUBE_STATUS = {
  connected: true,
  channelId: 'UC_youtube_demo_123',
  channelTitle: 'Marnee Demo Channel',
  customUrl: '@marnee-demo',
  subscriberCount: 45600,
  videoCount: 127,
  viewCount: 3450000,
  thumbnailUrl: 'https://via.placeholder.com/150'
};

export const MOCK_YOUTUBE_ANALYTICS = {
  // Métricas principales
  total_views: 3450000,
  total_watch_time: 458000, // minutos
  avg_view_duration: 4.2, // minutos
  subscriber_growth: 1240,
  total_likes: 89400,
  total_comments: 12300,
  engagement_rate: 5.8,

  // Views por día (últimos 7 días)
  views_by_day: [425000, 478000, 502000, 489000, 536000, 598000, 562000],

  // Métricas por hora del día
  views_by_hour: [58, 74, 92, 98, 83, 67],

  // Distribución de tipos de contenido
  content_distribution: [55, 30, 15], // Shorts, Videos largos, Lives

  // Métricas detalladas por día
  daily_metrics: [
    { date: '2026-07-03', views: 425000, watch_time: 56800, subscribers: 142 },
    { date: '2026-07-04', views: 478000, watch_time: 63900, subscribers: 167 },
    { date: '2026-07-05', views: 502000, watch_time: 67100, subscribers: 189 },
    { date: '2026-07-06', views: 489000, watch_time: 65400, subscribers: 178 },
    { date: '2026-07-07', views: 536000, watch_time: 71700, subscribers: 201 },
    { date: '2026-07-08', views: 598000, watch_time: 80000, subscribers: 234 },
    { date: '2026-07-09', views: 562000, watch_time: 75200, subscribers: 218 }
  ]
};

export const MOCK_YOUTUBE_VIDEOS = {
  videos: [
    {
      id: 'youtube_video_1',
      title: 'Cómo crecer en YouTube 2026 | Estrategias que funcionan',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo1',
      publishedAt: '2026-07-08T14:30:00Z',
      duration: 'PT12M34S',
      viewCount: 89400,
      likeCount: 4280,
      commentCount: 342,
      engagement_rate: 5.2,
      avgViewDuration: 8.4,
      clickThroughRate: 7.8
    },
    {
      id: 'youtube_video_2',
      title: 'Tutorial completo de YouTube Analytics',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo2',
      publishedAt: '2026-07-07T11:15:00Z',
      duration: 'PT18M45S',
      viewCount: 124500,
      likeCount: 6780,
      commentCount: 489,
      engagement_rate: 5.9,
      avgViewDuration: 11.2,
      clickThroughRate: 9.2
    },
    {
      id: 'youtube_video_3',
      title: 'Shorts vs Videos Largos: ¿Cuál conviene más?',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo3',
      publishedAt: '2026-07-06T16:45:00Z',
      duration: 'PT15M22S',
      viewCount: 98700,
      likeCount: 5120,
      commentCount: 398,
      engagement_rate: 5.6,
      avgViewDuration: 9.8,
      clickThroughRate: 8.4
    },
    {
      id: 'youtube_video_4',
      title: 'Mi setup para grabar videos profesionales',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo4',
      publishedAt: '2026-07-05T13:20:00Z',
      duration: 'PT10M15S',
      viewCount: 76800,
      likeCount: 3940,
      commentCount: 287,
      engagement_rate: 5.5,
      avgViewDuration: 7.2,
      clickThroughRate: 7.1
    },
    {
      id: 'youtube_video_5',
      title: 'Errores que matan tu canal de YouTube',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo5',
      publishedAt: '2026-07-04T10:00:00Z',
      duration: 'PT14M50S',
      viewCount: 134200,
      likeCount: 7890,
      commentCount: 578,
      engagement_rate: 6.4,
      avgViewDuration: 10.5,
      clickThroughRate: 9.8
    },
    {
      id: 'youtube_video_6',
      title: 'Monetización en YouTube: Todo lo que debes saber',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=480&h=270&fit=crop',
      videoUrl: 'https://youtube.com/watch?v=demo6',
      publishedAt: '2026-07-03T08:30:00Z',
      duration: 'PT16M40S',
      viewCount: 112300,
      likeCount: 6240,
      commentCount: 445,
      engagement_rate: 6.0,
      avgViewDuration: 11.8,
      clickThroughRate: 8.9
    }
  ],
  totalVideos: 127,
  hasMore: true
};

export const MOCK_YOUTUBE_DEMOGRAPHICS = {
  age_gender: [
    { age_range: '13-17', male: 8.2, female: 11.4 },
    { age_range: '18-24', male: 18.7, female: 24.3 },
    { age_range: '25-34', male: 16.9, female: 12.8 },
    { age_range: '35-44', male: 5.2, female: 2.3 },
    { age_range: '45-54', male: 0.8, female: 0.4 }
  ],
  top_countries: [
    { country: 'United States', value: 32.5 },
    { country: 'Mexico', value: 22.7 },
    { country: 'Spain', value: 14.3 },
    { country: 'Colombia', value: 9.8 },
    { country: 'Argentina', value: 7.2 },
    { country: 'Other', value: 13.5 }
  ],
  top_cities: [
    { city: 'Los Angeles, USA', value: 12.4 },
    { city: 'Mexico City, Mexico', value: 11.7 },
    { city: 'Madrid, Spain', value: 8.9 },
    { city: 'Bogotá, Colombia', value: 6.3 },
    { city: 'Buenos Aires, Argentina', value: 5.1 }
  ],
  devices: [
    { device: 'Mobile', value: 68.2 },
    { device: 'Desktop', value: 24.8 },
    { device: 'TV', value: 5.4 },
    { device: 'Tablet', value: 1.6 }
  ],
  traffic_sources: [
    { source: 'YouTube Search', value: 34.5 },
    { source: 'Suggested Videos', value: 28.7 },
    { source: 'Browse Features', value: 15.2 },
    { source: 'External', value: 12.4 },
    { source: 'Playlists', value: 6.8 },
    { source: 'Other', value: 2.4 }
  ]
};

export const MOCK_YOUTUBE_ANALYSIS = {
  summary: 'Tu canal de YouTube muestra un crecimiento sólido con excelente engagement. Los Shorts están impulsando el descubrimiento, pero los videos largos generan más watch time y retención.',
  strengths: [
    'Engagement rate superior al promedio (5.8% vs 4.2% promedio)',
    'Excelente CTR en thumbnails (8.5% promedio)',
    'Fuerte crecimiento de suscriptores (+1,240 este mes)',
    'Alta retención de audiencia (promedio 4.2 min de duración)'
  ],
  opportunities: [
    'Aumentar frecuencia de Shorts (solo 55% del contenido)',
    'Mejorar watch time en videos de 15+ minutos',
    'Crear más series para aumentar binge-watching',
    'Optimizar títulos para búsqueda (SEO)'
  ],
  recommendations: [
    'Publicar 1 video largo + 3 Shorts por semana',
    'Usar thumbnails con rostros expresivos',
    'Crear playlists temáticas para aumentar sesión',
    'Responder comentarios en primeras 2 horas'
  ],
  sentiment: 'very_positive',
  growth_trend: 'rapidly_increasing',
  engagement_trend: 'increasing',
  monetization_ready: true
};

// Helper para verificar si el modo demo está activado
export const isYouTubeDemoMode = () => {
  return process.env.REACT_APP_YOUTUBE_DEMO_MODE === 'true';
};
