/**
 * Topic Extractor
 * Extrae temas relevantes de las conversaciones con Marnee
 */

// Stopwords extendidas para filtrar mejor
const STOPWORDS = new Set([
  // Español - palabras funcionales
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'que', 'y', 'en',
  'es', 'por', 'con', 'para', 'al', 'se', 'su', 'sus', 'lo', 'como', 'más', 'pero',
  'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde',
  'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese',
  'eso', 'ante', 'ellos', 'e', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos',
  'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes',
  'nada', 'muchos', 'cual', 'poco', 'ella', 'estar', 'estas', 'algunas', 'algo',
  'nosotros', 'mi', 'mis', 'tú', 'te', 'ti', 'tu', 'tus', 'ellas', 'nosotras',
  'vosotros', 'vosotras', 'os', 'mío', 'mía', 'míos', 'mías', 'tuyo', 'tuya',
  'hola', 'gracias', 'por favor', 'ok', 'okay', 'si', 'sí', 'no', 'quiero', 'necesito',
  'puedo', 'puede', 'podemos', 'hacer', 'hago', 'hace', 'tengo', 'tiene', 'tienen',
  'ser', 'soy', 'eres', 'somos', 'son', 'estar', 'estoy', 'está', 'estamos', 'están',
  'ahora', 'aquí', 'allí', 'así', 'bien', 'bueno', 'buena', 'mejor', 'peor', 'cada',
  'cómo', 'cuál', 'cuándo', 'cuánto', 'dónde', 'momento', 'vez', 'veces', 'manera',
  'forma', 'parte', 'cosa', 'cosas', 'tipo', 'tipos', 'ejemplo', 'vez', 'caso',
  // Verbos comunes
  'crear', 'creo', 'crea', 'creamos', 'ayuda', 'ayudar', 'dame', 'dar', 'doy', 'das',
  'usar', 'uso', 'usas', 'utilizar', 'poner', 'pongo', 'ver', 'veo', 'ves', 'vemos',
  // Inglés
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'being', 'been', 'have', 'has', 'had', 'having',
  'hi', 'hello', 'thanks', 'thank', 'please', 'yes', 'no', 'okay', 'ok',
  'just', 'like', 'get', 'make', 'know', 'think', 'want', 'see', 'look', 'use',
  'find', 'give', 'tell', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good',
  'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right',
  'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important'
]);

// Palabras clave de interés para contenido/marketing
const INTEREST_KEYWORDS = new Set([
  // Plataformas
  'instagram', 'tiktok', 'youtube', 'linkedin', 'twitter', 'facebook', 'pinterest',
  'reels', 'stories', 'shorts', 'posts', 'feed', 'carrusel', 'carousel',
  // Contenido
  'contenido', 'content', 'video', 'videos', 'podcast', 'blog', 'newsletter',
  'guión', 'script', 'guion', 'copy', 'copywriting', 'hooks', 'hook', 'cta',
  'thumbnail', 'miniaturas', 'edición', 'editing',
  // Marketing
  'marketing', 'branding', 'marca', 'brand', 'audiencia', 'audience', 'nicho', 'niche',
  'engagement', 'alcance', 'reach', 'viral', 'tendencias', 'trends', 'estrategia',
  'strategy', 'monetización', 'monetization', 'ventas', 'sales', 'leads', 'funnel',
  'embudo', 'conversión', 'conversion', 'cliente', 'clientes', 'customers',
  // Formatos
  'tutorial', 'educativo', 'educational', 'entretenimiento', 'entertainment',
  'behind', 'scenes', 'lifestyle', 'storytelling', 'personal', 'profesional',
  // Temas de negocio
  'emprendimiento', 'entrepreneurship', 'startup', 'negocio', 'business',
  'productividad', 'productivity', 'liderazgo', 'leadership', 'coaching',
  'consultoría', 'consulting', 'freelance', 'agencia', 'agency'
]);

/**
 * Extrae frases clave de un texto
 * @param {string} text - Texto del mensaje
 * @returns {string[]} - Array de frases clave
 */
function extractKeyPhrases(text) {
  if (!text || typeof text !== 'string') return [];

  const phrases = [];
  const lowerText = text.toLowerCase();

  // Patrones para extraer frases clave (español e inglés)
  const patterns = [
    // "cómo puedo/crear/hacer <tema>"
    /c[oó]mo (?:puedo|crear|hacer|mejorar|optimizar|implementar) ([\w\s]+)/gi,
    // "necesito ayuda con <tema>"
    /necesito (?:ayuda con|saber sobre|entender) ([\w\s]+)/gi,
    // "quiero crear/aprender/mejorar <tema>"
    /quiero (?:crear|aprender|mejorar|desarrollar|hacer) ([\w\s]+)/gi,
    // "sobre <tema>"
    /sobre ([\w\s]{3,30})/gi,
    // "mi <tema>" (mi negocio, mi marca, etc.)
    /mi ([\w\s]{3,20})/gi,
    // "para <tema>"
    /para (?:mi|el|la|los|las) ([\w\s]{3,25})/gi,
    // Hashtags
    /#([\w]+)/g,
    // "help me with <topic>"
    /help (?:me )?(?:with|on|about) ([\w\s]+)/gi,
    // "how to <topic>"
    /how to ([\w\s]+)/gi,
    // "I want to <topic>"
    /i want to ([\w\s]+)/gi,
    // "my <topic>"
    /my ([\w\s]{3,20})/gi,
  ];

  patterns.forEach(pattern => {
    const matches = lowerText.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const phrase = match[1].trim();
        if (isValidTopic(phrase)) {
          phrases.push(normalizePhrase(phrase));
        }
      }
    }
  });

  // También extraer sustantivos/frases significativas (2-4 palabras)
  const words = lowerText
    .replace(/[^\w\sáéíóúüñ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));

  // Agregar palabras únicas significativas
  words.forEach(word => {
    if (isValidTopic(word) && word.length > 4) {
      phrases.push(normalizePhrase(word));
    }
  });

  return [...new Set(phrases)]; // Eliminar duplicados
}

/**
 * Normaliza una frase (capitaliza primera letra)
 */
function normalizePhrase(phrase) {
  const trimmed = phrase.trim().toLowerCase();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Valida si un topic es válido
 */
function isValidTopic(topic) {
  if (!topic || typeof topic !== 'string') return false;

  const trimmed = topic.trim().toLowerCase();

  // Filtrar muy cortos o muy largos
  if (trimmed.length < 3 || trimmed.length > 50) return false;

  // Filtrar si tiene muchas palabras
  if (trimmed.split(' ').length > 4) return false;

  // Filtrar stopwords
  if (STOPWORDS.has(trimmed)) return false;

  // Filtrar si es solo números
  if (/^\d+$/.test(trimmed)) return false;

  return true;
}

/**
 * Extrae temas de múltiples conversaciones
 * Analiza tanto mensajes del usuario como temas clave mencionados por la IA
 * @param {Array} conversations - Array de conversaciones con mensajes
 * @returns {Array<{topic: string, count: number, source: string}>} - Top temas con conteo
 */
export function extractTopicsFromConversations(conversations) {
  if (!conversations || !Array.isArray(conversations)) {
    return [];
  }

  const topicCounts = new Map();

  conversations.forEach(conv => {
    if (!conv?.messages || !Array.isArray(conv.messages)) return;

    conv.messages.forEach(msg => {
      if (!msg.content) return;

      const content = msg.content;

      // Extraer temas de mensajes del usuario
      if (msg.role === 'user') {
        const topics = extractKeyPhrases(content);
        topics.forEach(topic => {
          const existing = topicCounts.get(topic) || { count: 0, fromUser: 0, fromAI: 0 };
          existing.count += 2; // Peso mayor para temas del usuario
          existing.fromUser += 1;
          topicCounts.set(topic, existing);
        });
      }

      // Extraer keywords de interés de respuestas de la IA
      if (msg.role === 'assistant') {
        const words = content.toLowerCase().split(/[\s,.:;!?()]+/);
        words.forEach(word => {
          if (INTEREST_KEYWORDS.has(word) && word.length > 3) {
            const normalizedTopic = word.charAt(0).toUpperCase() + word.slice(1);
            const existing = topicCounts.get(normalizedTopic) || { count: 0, fromUser: 0, fromAI: 0 };
            existing.count += 1;
            existing.fromAI += 1;
            topicCounts.set(normalizedTopic, existing);
          }
        });
      }
    });
  });

  // Retornar top 15 temas más mencionados
  return Array.from(topicCounts.entries())
    .filter(([topic, data]) => data.count >= 2) // Al menos 2 menciones
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([topic, data]) => ({
      topic,
      count: data.count,
      fromUser: data.fromUser,
      fromAI: data.fromAI
    }));
}

export default extractTopicsFromConversations;
