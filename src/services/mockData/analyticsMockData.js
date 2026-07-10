/**
 * Google Analytics Mock Data
 * Datos de demostración para el proceso de review
 *
 * Para activar el modo demo, configura en .env:
 * REACT_APP_ANALYTICS_DEMO_MODE=true
 */

export const MOCK_ANALYTICS_STATUS = {
  connected: true,
  propertyId: 'GA_PROPERTY_123456',
  propertyName: 'Marnee Demo Website',
  websiteUrl: 'https://marnee.ai',
  accountId: 'GA_ACCOUNT_789'
};

export const MOCK_ANALYTICS_DATA = {
  // Métricas principales
  total_users: 45680,
  total_sessions: 67890,
  total_pageviews: 234560,
  bounce_rate: 42.3,
  avg_session_duration: 3.8, // minutos
  pages_per_session: 3.45,
  new_users: 34520,
  returning_users: 11160,
  conversion_rate: 2.8,

  // Users por día (últimos 7 días)
  users_by_day: [5840, 6520, 7180, 6890, 7650, 8920, 8340],

  // Tráfico por hora del día
  traffic_by_hour: [580, 720, 890, 950, 820, 670],

  // Métricas detalladas por día
  daily_metrics: [
    { date: '2026-07-03', users: 5840, sessions: 8760, pageviews: 30240, bounce_rate: 43.2 },
    { date: '2026-07-04', users: 6520, sessions: 9780, pageviews: 33750, bounce_rate: 42.8 },
    { date: '2026-07-05', users: 7180, sessions: 10770, pageviews: 37160, bounce_rate: 41.9 },
    { date: '2026-07-06', users: 6890, sessions: 10335, pageviews: 35670, bounce_rate: 42.5 },
    { date: '2026-07-07', users: 7650, sessions: 11475, pageviews: 39590, bounce_rate: 41.2 },
    { date: '2026-07-08', users: 8920, sessions: 13380, pageviews: 46170, bounce_rate: 40.3 },
    { date: '2026-07-09', users: 8340, sessions: 12510, pageviews: 43160, bounce_rate: 41.8 }
  ],

  // Fuentes de tráfico
  traffic_sources: [
    { source: 'Organic Search', users: 18720, percentage: 41.0 },
    { source: 'Direct', users: 13704, percentage: 30.0 },
    { source: 'Social Media', users: 9136, percentage: 20.0 },
    { source: 'Referral', users: 3198, percentage: 7.0 },
    { source: 'Email', users: 913, percentage: 2.0 }
  ],

  // Top páginas
  top_pages: [
    {
      path: '/',
      title: 'Home',
      pageviews: 67890,
      unique_pageviews: 45680,
      avg_time_on_page: 2.4,
      bounce_rate: 38.5
    },
    {
      path: '/features',
      title: 'Features',
      pageviews: 34520,
      unique_pageviews: 28940,
      avg_time_on_page: 3.8,
      bounce_rate: 32.1
    },
    {
      path: '/pricing',
      title: 'Pricing',
      pageviews: 28930,
      unique_pageviews: 24680,
      avg_time_on_page: 2.9,
      bounce_rate: 28.7
    },
    {
      path: '/blog/marketing-tips',
      title: 'Marketing Tips',
      pageviews: 23140,
      unique_pageviews: 19870,
      avg_time_on_page: 4.2,
      bounce_rate: 45.3
    },
    {
      path: '/dashboard',
      title: 'Dashboard',
      pageviews: 19840,
      unique_pageviews: 8920,
      avg_time_on_page: 8.7,
      bounce_rate: 12.4
    }
  ],

  // Dispositivos
  devices: [
    { device: 'Mobile', users: 25074, percentage: 54.9 },
    { device: 'Desktop', users: 18272, percentage: 40.0 },
    { device: 'Tablet', users: 2334, percentage: 5.1 }
  ],

  // Conversiones
  conversions: [
    { goal: 'Sign Up', conversions: 1280, conversion_rate: 2.8 },
    { goal: 'Contact Form', conversions: 890, conversion_rate: 2.0 },
    { goal: 'Newsletter Subscribe', conversions: 1450, conversion_rate: 3.2 },
    { goal: 'Free Trial', conversions: 670, conversion_rate: 1.5 }
  ]
};

export const MOCK_ANALYTICS_DEMOGRAPHICS = {
  age: [
    { age_range: '18-24', percentage: 28.4 },
    { age_range: '25-34', percentage: 38.7 },
    { age_range: '35-44', percentage: 19.2 },
    { age_range: '45-54', percentage: 8.9 },
    { age_range: '55-64', percentage: 3.8 },
    { age_range: '65+', percentage: 1.0 }
  ],
  gender: [
    { gender: 'Male', percentage: 54.2 },
    { gender: 'Female', percentage: 45.8 }
  ],
  countries: [
    { country: 'United States', users: 14148, percentage: 31.0 },
    { country: 'Mexico', users: 10936, percentage: 23.9 },
    { country: 'Spain', users: 6394, percentage: 14.0 },
    { country: 'Colombia', users: 4111, percentage: 9.0 },
    { country: 'Argentina', users: 3198, percentage: 7.0 },
    { country: 'Other', users: 6893, percentage: 15.1 }
  ],
  languages: [
    { language: 'English', percentage: 45.6 },
    { language: 'Spanish', percentage: 48.2 },
    { language: 'Other', percentage: 6.2 }
  ]
};

export const MOCK_ANALYTICS_ANALYSIS = {
  summary: 'Tu sitio web muestra un crecimiento saludable con buen engagement. El tráfico orgánico es tu mayor fortaleza, pero hay oportunidades de mejora en bounce rate.',
  strengths: [
    'Fuerte tráfico orgánico (41% del total)',
    'Excelente tiempo en página del dashboard (8.7 min)',
    'Buen crecimiento de usuarios nuevos (+34,520)',
    'Alta tasa de conversión en newsletter (3.2%)'
  ],
  opportunities: [
    'Reducir bounce rate en homepage (actualmente 38.5%)',
    'Aumentar páginas por sesión (actual: 3.45)',
    'Mejorar conversión de móvil (menor que desktop)',
    'Crear más contenido de blog para SEO'
  ],
  recommendations: [
    'Optimizar velocidad de carga en móvil',
    'Agregar CTAs más claros en homepage',
    'Crear landing pages específicas por fuente',
    'Implementar A/B testing en páginas clave'
  ],
  sentiment: 'positive',
  growth_trend: 'increasing',
  seo_health: 8.2
};

// Helper para verificar si el modo demo está activado
export const isAnalyticsDemoMode = () => {
  return process.env.REACT_APP_ANALYTICS_DEMO_MODE === 'true';
};
