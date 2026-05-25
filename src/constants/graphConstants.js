/**
 * Knowledge Graph Constants
 * Colores, tamaños, formas y configuración del grafo
 */

// Colores por categoría de nodo - paleta distintiva pero elegante
export const NODE_COLORS = {
  user: '#E85D04',              // Naranja brillante - nodo central
  expertise: '#7c3aed',         // Violeta - expertise
  audience_interest: '#2563eb', // Azul - lo que preguntan
  value: '#059669',             // Verde esmeralda - valores
  passion: '#db2777',           // Rosa - pasiones
  business_keyword: '#1e1e1e',  // Negro - keywords de negocio
  content_pillar: '#dc2626',    // Rojo - pilares de contenido
  niche_keyword: '#0891b2',     // Cyan - keywords de nicho
  benefit: '#16a34a',           // Verde - beneficio
  differentiator: '#9333ea',    // Púrpura - diferenciador
  conversation_topic: '#6366f1', // Indigo - temas de chat
  brainstorming: '#f59e0b'      // Ámbar - ideas de brainstorming
};

// Formas de nodos por categoría
export const NODE_SHAPES = {
  user: 'star',              // Estrella para el nodo central
  expertise: 'hexagon',      // Hexágono con número
  audience_interest: 'hexagon',
  value: 'square',           // Cuadrado
  passion: 'square',
  business_keyword: 'circle', // Círculo
  content_pillar: 'triangle', // Triángulo
  niche_keyword: 'circle',
  benefit: 'diamond',        // Rombo
  differentiator: 'diamond',
  conversation_topic: 'circle',
  brainstorming: 'hexagon'   // Hexágono para ideas
};

// Tamaños base de nodos por categoría
export const NODE_SIZES = {
  user: 22,              // Nodo central
  expertise: 14,
  audience_interest: 14,
  value: 12,
  passion: 12,
  content_pillar: 16,
  business_keyword: 12,
  niche_keyword: 12,
  benefit: 14,
  differentiator: 14,
  conversation_topic: 11,
  brainstorming: 13
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
  conversation_topic: 'Temas de chat',
  brainstorming: 'Ideas guardadas'
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
  'content_pillar',
  'expertise',
  'audience_interest',
  'brainstorming',
  'conversation_topic',
  'value',
  'passion',
  'business_keyword',
  'niche_keyword',
  'benefit',
  'differentiator'
];
