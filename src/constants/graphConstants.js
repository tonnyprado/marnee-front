/**
 * Knowledge Graph Constants
 * Colores, tamaños y configuración del grafo de neuronas
 */

// Colores por categoría de nodo
export const NODE_COLORS = {
  user: '#40086d',              // Morado Marnee - nodo central
  expertise: '#10B981',         // Verde esmeralda - temas que domina
  audience_interest: '#3B82F6', // Azul cielo - lo que le preguntan
  value: '#EC4899',             // Rosa - valores personales
  passion: '#F59E0B',           // Naranja - pasiones
  business_keyword: '#6366F1',  // Indigo - keywords de negocio
  content_pillar: '#14B8A6',    // Teal - pilares de contenido
  niche_keyword: '#06B6D4',     // Cyan - keywords de nicho
  benefit: '#EAB308',           // Amarillo - beneficio principal
  differentiator: '#EF4444',    // Rojo - diferenciador
  conversation_topic: '#9CA3AF' // Gris - temas de conversaciones
};

// Tamaños base de nodos por categoría
export const NODE_SIZES = {
  user: 25,              // Nodo central, el más grande
  expertise: 12,
  audience_interest: 12,
  value: 10,
  passion: 10,
  content_pillar: 14,    // Importante para contenido
  business_keyword: 11,
  niche_keyword: 11,
  benefit: 13,
  differentiator: 13,
  conversation_topic: 8  // Los más pequeños, son derivados
};

// Labels legibles para la leyenda
export const CATEGORY_LABELS = {
  user: 'Tú',
  expertise: 'Expertise',
  audience_interest: 'Te preguntan sobre',
  value: 'Valores',
  passion: 'Pasiones',
  business_keyword: 'Keywords negocio',
  content_pillar: 'Pilares de contenido',
  niche_keyword: 'Keywords de nicho',
  benefit: 'Beneficio principal',
  differentiator: 'Diferenciador',
  conversation_topic: 'Temas de chat'
};

// Configuración de física del grafo
export const GRAPH_CONFIG = {
  linkColor: '#dccaf4',
  backgroundColor: '#f6f6f6',
  d3VelocityDecay: 0.3,
  d3AlphaDecay: 0.02,
  cooldownTicks: 100,
  warmupTicks: 50,
  linkDirectionalParticles: 2,
  linkDirectionalParticleSpeed: 0.005
};

// Categorías ordenadas para la leyenda (excluyendo 'user')
export const LEGEND_CATEGORIES = [
  'expertise',
  'audience_interest',
  'content_pillar',
  'value',
  'passion',
  'business_keyword',
  'niche_keyword',
  'benefit',
  'differentiator',
  'conversation_topic'
];
