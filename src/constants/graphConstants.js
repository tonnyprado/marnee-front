/**
 * Knowledge Graph Constants
 * Colores, tamaños, formas y configuración del grafo
 */

// Colores por categoría de nodo - paleta minimalista
export const NODE_COLORS = {
  user: '#E85D04',              // Naranja - nodo central (como en la imagen)
  expertise: '#1e1e1e',         // Negro - temas que domina
  audience_interest: '#1e1e1e', // Negro - lo que le preguntan
  value: '#1e1e1e',             // Negro - valores personales
  passion: '#1e1e1e',           // Negro - pasiones
  business_keyword: '#1e1e1e',  // Negro - keywords de negocio
  content_pillar: '#1e1e1e',    // Negro - pilares de contenido
  niche_keyword: '#1e1e1e',     // Negro - keywords de nicho
  benefit: '#1e1e1e',           // Negro - beneficio principal
  differentiator: '#1e1e1e',    // Negro - diferenciador
  conversation_topic: '#1e1e1e' // Negro - temas de conversaciones
};

// Formas de nodos por categoría (como en la imagen de referencia)
export const NODE_SHAPES = {
  user: 'star',           // Estrella para el nodo central
  expertise: 'hexagon',   // Hexágono con número
  audience_interest: 'hexagon',
  value: 'square',        // Cuadrado
  passion: 'square',
  business_keyword: 'circle', // Círculo
  content_pillar: 'triangle', // Triángulo
  niche_keyword: 'circle',
  benefit: 'diamond',     // Rombo
  differentiator: 'diamond',
  conversation_topic: 'circle'
};

// Tamaños base de nodos por categoría
export const NODE_SIZES = {
  user: 20,              // Nodo central
  expertise: 14,
  audience_interest: 14,
  value: 12,
  passion: 12,
  content_pillar: 16,
  business_keyword: 12,
  niche_keyword: 12,
  benefit: 14,
  differentiator: 14,
  conversation_topic: 10
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

// Configuración de física del grafo - optimizado para rendimiento
export const GRAPH_CONFIG = {
  linkColor: '#1e1e1e',
  linkColorLight: '#c4c4c4',
  backgroundColor: '#fafafa',
  d3VelocityDecay: 0.4,     // Mayor decaimiento = estabilización más rápida
  d3AlphaDecay: 0.05,       // Mayor decaimiento alpha = menos iteraciones
  cooldownTicks: 50,        // Reducido de 100 para estabilizar más rápido
  warmupTicks: 20,          // Reducido de 50
  linkDistance: 120,        // Distancia entre nodos
  chargeStrength: -200,     // Fuerza de repulsión entre nodos
  centerStrength: 0.1       // Fuerza hacia el centro
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
