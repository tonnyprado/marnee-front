/**
 * Business Test Questions Configuration
 * Preguntas adaptadas por tipo de negocio/rol
 */

export const BUSINESS_ROLES = [
  {
    value: 'INFLUENCER',
    label: 'Influencer / Creador de Contenido',
    description: 'Construyo mi marca personal',
    iconFile: 'iconly-icon-export-1794115180.json',
  },
  {
    value: 'COMMUNITY_MANAGER',
    label: 'Community Manager',
    description: 'Gestiono redes sociales de varias marcas',
    iconFile: 'iconly-icon-export-1794115263.json',
  },
  {
    value: 'MARKETING_AGENCY',
    label: 'Agencia de Marketing',
    description: 'Manejo múltiples clientes y campañas',
    iconFile: 'iconly-icon-export-1794115324.json',
  },
  {
    value: 'SMALL_BUSINESS',
    label: 'Pequeño Negocio',
    description: 'Tengo un negocio local o emprendimiento',
    iconFile: 'iconly-icon-export-1794115391.json',
  },
];

// Preguntas base que aplican a todos los roles
export const BASE_QUESTIONS = [
  {
    key: 'businessDescription',
    question: '¿Cómo describirías tu negocio en una frase?',
    type: 'textarea',
    placeholder: 'Ej: Ayudo a empresas tech a escalar su presencia en redes sociales',
    required: true,
  },
  {
    key: 'websiteUrl',
    question: '¿Tienes un sitio web?',
    type: 'url',
    placeholder: 'https://...',
    required: false,
  },
  {
    key: 'mainPriority',
    question: '¿Cuál es tu prioridad principal ahora mismo?',
    type: 'select',
    options: [
      { value: 'getting_clients', label: 'Conseguir más clientes' },
      { value: 'building_awareness', label: 'Construir awareness/marca' },
      { value: 'validating_idea', label: 'Validar mi idea de negocio' },
    ],
    required: true,
  },
];

// Preguntas específicas por rol
export const ROLE_SPECIFIC_QUESTIONS = {
  MARKETING_AGENCY: [
    {
      key: 'numberOfClients',
      question: '¿Cuántos clientes manejas actualmente?',
      type: 'number',
      placeholder: 'Ej: 5',
      required: true,
    },
    {
      key: 'agencySpecialization',
      question: '¿En qué industria o tipo de cliente te especializas?',
      type: 'textarea',
      placeholder: 'Ej: E-commerce de moda, SaaS B2B, restaurantes locales...',
      required: false,
    },
    {
      key: 'agencyTeamSize',
      question: '¿Cuántas personas conforman tu equipo?',
      type: 'number',
      placeholder: 'Ej: 3',
      required: false,
    },
    {
      key: 'agencyMainChallenge',
      question: '¿Cuál es tu principal desafío?',
      type: 'select',
      options: [
        { value: 'client_acquisition', label: 'Conseguir nuevos clientes' },
        { value: 'content_production', label: 'Producir contenido de calidad' },
        { value: 'team_management', label: 'Gestionar al equipo' },
        { value: 'scaling_operations', label: 'Escalar las operaciones' },
      ],
      required: false,
    },
    {
      key: 'idealCustomer',
      question: '¿Quién es tu cliente ideal?',
      type: 'textarea',
      placeholder: 'Ej: Fundadores de startups tech con 50K-500K en funding...',
      required: true,
    },
  ],

  COMMUNITY_MANAGER: [
    {
      key: 'numberOfBrands',
      question: '¿Cuántas marcas o proyectos manejas?',
      type: 'number',
      placeholder: 'Ej: 3',
      required: true,
    },
    {
      key: 'cmPlatformExpertise',
      question: '¿En qué plataformas tienes más experiencia?',
      type: 'multiselect',
      options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'twitter', label: 'Twitter/X' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'youtube', label: 'YouTube' },
      ],
      required: true,
    },
    {
      key: 'cmMainResponsibility',
      question: '¿Cuál es tu responsabilidad principal?',
      type: 'select',
      options: [
        { value: 'content_creation', label: 'Creación de contenido' },
        { value: 'community_engagement', label: 'Engagement con la comunidad' },
        { value: 'social_media_strategy', label: 'Estrategia de redes sociales' },
        { value: 'all_of_above', label: 'Todas las anteriores' },
      ],
      required: true,
    },
    {
      key: 'cmContentVolume',
      question: '¿Cuánto contenido produces semanalmente?',
      type: 'select',
      options: [
        { value: '1-10_per_week', label: '1-10 publicaciones' },
        { value: '11-30_per_week', label: '11-30 publicaciones' },
        { value: '31-50_per_week', label: '31-50 publicaciones' },
        { value: '50+_per_week', label: 'Más de 50 publicaciones' },
      ],
      required: false,
    },
    {
      key: 'contentCreationExperience',
      question: '¿Qué experiencia tienes creando contenido?',
      type: 'textarea',
      placeholder: 'Ej: 3 años editando videos, fotografía básica, diseño en Canva...',
      required: false,
    },
  ],

  INFLUENCER: [
    {
      key: 'influencerNiche',
      question: '¿Cuál es tu nicho principal?',
      type: 'textarea',
      placeholder: 'Ej: Fitness y nutrición para mujeres 25-35, Finanzas personales...',
      required: true,
    },
    {
      key: 'influencerFollowerCount',
      question: '¿Cuántos seguidores tienes aproximadamente?',
      type: 'select',
      options: [
        { value: 'under_1k', label: 'Menos de 1K' },
        { value: '1k-10k', label: '1K - 10K' },
        { value: '10k-100k', label: '10K - 100K' },
        { value: '100k-500k', label: '100K - 500K' },
        { value: '500k+', label: 'Más de 500K' },
      ],
      required: true,
    },
    {
      key: 'influencerMainPlatform',
      question: '¿Cuál es tu plataforma principal?',
      type: 'select',
      options: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'twitter', label: 'Twitter/X' },
        { value: 'linkedin', label: 'LinkedIn' },
      ],
      required: true,
    },
    {
      key: 'influencerMonetizationGoal',
      question: '¿Cómo quieres monetizar tu marca personal?',
      type: 'select',
      options: [
        { value: 'brand_deals', label: 'Deals con marcas' },
        { value: 'own_products', label: 'Productos propios' },
        { value: 'affiliate_marketing', label: 'Marketing de afiliados' },
        { value: 'courses_coaching', label: 'Cursos/Coaching' },
        { value: 'multiple_streams', label: 'Múltiples fuentes de ingreso' },
      ],
      required: true,
    },
    {
      key: 'influencerContentType',
      question: '¿Qué tipo de contenido creas principalmente?',
      type: 'select',
      options: [
        { value: 'educational', label: 'Educativo' },
        { value: 'entertainment', label: 'Entretenimiento' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'professional', label: 'Profesional/Negocios' },
        { value: 'mixed', label: 'Mixto' },
      ],
      required: false,
    },
    {
      key: 'idealCustomer',
      question: '¿Quién es tu audiencia ideal?',
      type: 'textarea',
      placeholder: 'Ej: Mujeres 25-35 interesadas en fitness...',
      required: true,
    },
  ],

  SMALL_BUSINESS: [
    {
      key: 'businessType',
      question: '¿Qué tipo de negocio tienes?',
      type: 'textarea',
      placeholder: 'Ej: Restaurante mexicano, Tienda de ropa online, Consultorio dental...',
      required: true,
    },
    {
      key: 'businessEmployees',
      question: '¿Cuántos empleados tienes?',
      type: 'select',
      options: [
        { value: 'solo', label: 'Solo yo' },
        { value: '2-5', label: '2-5 personas' },
        { value: '6-10', label: '6-10 personas' },
        { value: '11-20', label: '11-20 personas' },
        { value: '20+', label: 'Más de 20 personas' },
      ],
      required: false,
    },
    {
      key: 'hasPhysicalLocation',
      question: '¿Tienes ubicación física?',
      type: 'boolean',
      required: false,
    },
    {
      key: 'businessMarketingExperience',
      question: '¿Qué experiencia tienes con marketing digital?',
      type: 'select',
      options: [
        { value: 'none', label: 'Ninguna, estoy empezando' },
        { value: 'beginner', label: 'Principiante (he probado algunas cosas)' },
        { value: 'intermediate', label: 'Intermedio (tengo algunas campañas activas)' },
        { value: 'advanced', label: 'Avanzado (manejo bien el marketing digital)' },
      ],
      required: true,
    },
    {
      key: 'businessMarketingBudget',
      question: '¿Cuál es tu presupuesto mensual para marketing?',
      type: 'select',
      options: [
        { value: 'under_500', label: 'Menos de $500 USD' },
        { value: '500-2000', label: '$500 - $2,000 USD' },
        { value: '2000-5000', label: '$2,000 - $5,000 USD' },
        { value: '5000+', label: 'Más de $5,000 USD' },
      ],
      required: false,
    },
    {
      key: 'idealCustomer',
      question: '¿Quién es tu cliente ideal?',
      type: 'textarea',
      placeholder: 'Ej: Familias con niños en la zona norte de la ciudad...',
      required: true,
    },
    {
      key: 'currentClientAcquisition',
      question: '¿Cómo consigues clientes actualmente?',
      type: 'textarea',
      placeholder: 'Ej: Referidos, redes sociales, anuncios en Facebook...',
      required: false,
    },
  ],
};

// Preguntas comunes al final (aplican a todos los roles)
export const COMMON_END_QUESTIONS = [
  {
    key: 'differentiator',
    question: '¿Qué te hace diferente de tu competencia?',
    type: 'textarea',
    placeholder: 'Ej: Atención personalizada 24/7, proceso único de 3 pasos...',
    required: true,
  },
  {
    key: 'promisedResult',
    question: '¿Qué resultado prometes a tus clientes/audiencia?',
    type: 'textarea',
    placeholder: 'Ej: Duplicar sus ventas en 90 días, Perder 10kg en 3 meses...',
    required: true,
  },
];

/**
 * Obtiene todas las preguntas para un rol específico
 */
export const getQuestionsForRole = (role) => {
  if (!role) return [];

  return [
    ...BASE_QUESTIONS,
    ...(ROLE_SPECIFIC_QUESTIONS[role] || []),
    ...COMMON_END_QUESTIONS,
  ];
};

/**
 * Obtiene el título del formulario según el rol
 */
export const getFormTitleForRole = (role) => {
  const titles = {
    MARKETING_AGENCY: 'Cuéntanos sobre tu agencia',
    COMMUNITY_MANAGER: 'Cuéntanos sobre tu trabajo como CM',
    INFLUENCER: 'Cuéntanos sobre tu marca personal',
    SMALL_BUSINESS: 'Cuéntanos sobre tu negocio',
  };

  return titles[role] || 'Cuéntanos sobre ti';
};
